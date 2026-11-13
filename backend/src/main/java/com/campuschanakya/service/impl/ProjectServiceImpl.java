package com.campuschanakya.service.impl;

import com.campuschanakya.dto.ProjectCreateRequest;
import com.campuschanakya.dto.ProjectReviewRequest;
import com.campuschanakya.dto.ProjectSubmissionRequest;
import com.campuschanakya.dto.ProjectSubmit;
import com.campuschanakya.model.*;
import com.campuschanakya.repository.ProjectRepository;
import com.campuschanakya.repository.ProjectSubmissionRepository;
import com.campuschanakya.repository.StudentProfileRepository;
import com.campuschanakya.repository.UserRepository;
import com.campuschanakya.service.MentorshipGatingValidator;
import com.campuschanakya.service.ProjectService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

/**
 * ============================================================================
 * OOP ABSTRACTION: PROJECT SERVICE IMPLEMENTATION
 * ============================================================================
 * Coordinates alumni micro and macro project publications for student mentorship.
 * Implements Signal-Over-Noise Gatekeeping and Industry Endorsement Loop.
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class ProjectServiceImpl implements ProjectService {

    private final ProjectRepository projectRepository;
    private final ProjectSubmissionRepository projectSubmissionRepository;
    private final UserRepository userRepository;
    private final StudentProfileRepository studentProfileRepository;
    private final MentorshipGatingValidator gatingValidator;

    @Override
    @Transactional
    public Project createProject(ProjectCreateRequest dto, Long alumniId) {
        User alumni = userRepository.findById(alumniId)
                .orElseThrow(() -> new IllegalArgumentException("Alumni not found with ID: " + alumniId));

        Project project = Project.builder()
                .title(dto.getTitle())
                .description(dto.getDescription())
                .targetSkill(dto.getTargetSkill())
                .techStack(dto.getTargetSkill() != null ? dto.getTargetSkill() : "Java Core")
                .projectType(dto.getProjectType() != null ? dto.getProjectType() : ProjectType.MICRO)
                .starterRepoUrl(dto.getStarterRepoUrl())
                .githubTemplateUrl(dto.getStarterRepoUrl() != null ? dto.getStarterRepoUrl() : "https://github.com")
                .acceptanceCriteria(dto.getAcceptanceCriteria())
                .alumni(alumni)
                .build();

        Project saved = projectRepository.save(project);
        log.info("Alumni #{} published new {} project: '{}' (Prerequisite: {})",
                alumniId, saved.getProjectType(), saved.getTitle(), saved.getTargetSkill());
        return saved;
    }

    @Override
    @Transactional
    public Project createProject(Long alumniId, ProjectSubmit projectDto) {
        ProjectType type = "MACRO".equalsIgnoreCase(projectDto.getProjectType()) ? ProjectType.MACRO : ProjectType.MICRO;
        ProjectCreateRequest req = ProjectCreateRequest.builder()
                .title(projectDto.getTitle())
                .description(projectDto.getDescription())
                .targetSkill(projectDto.getTechStack() != null ? projectDto.getTechStack() : "General Competency")
                .projectType(type)
                .starterRepoUrl(projectDto.getGithubTemplateUrl())
                .acceptanceCriteria("Complete all test invariants and maintain strict OOP encapsulation.")
                .build();
        return createProject(req, alumniId);
    }

    @Override
    @Transactional(readOnly = true)
    public List<Project> getProjectsBySkill(Long studentId, String skill) {
        // Enforce Signal-Over-Noise Gatekeeping
        if (skill != null && !skill.isBlank()) {
            gatingValidator.validateStudentSkillVerification(studentId, skill);
            List<Project> matches = projectRepository.findByTargetSkillContainingIgnoreCase(skill);
            if (!matches.isEmpty()) {
                return matches;
            }
        }
        return projectRepository.findAll();
    }

    @Override
    @Transactional
    public ProjectSubmission submitProject(ProjectSubmissionRequest dto, Long studentId) {
        Long resolvedStudentId = (dto.getStudentId() != null) ? dto.getStudentId() : studentId;
        User student = userRepository.findById(resolvedStudentId)
                .orElseThrow(() -> new IllegalArgumentException("Student not found with ID: " + resolvedStudentId));

        Project project = projectRepository.findById(dto.getProjectId())
                .orElseThrow(() -> new IllegalArgumentException("Project not found with ID: " + dto.getProjectId()));

        // Enforce Signal-Over-Noise Gatekeeping for this project's target skill
        gatingValidator.validateStudentSkillVerification(resolvedStudentId, project.getTargetSkill());

        // Check if an existing submission exists for this project + student
        ProjectSubmission submission = projectSubmissionRepository
                .findByProjectIdAndStudentId(project.getId(), student.getId())
                .orElseGet(() -> ProjectSubmission.builder()
                        .project(project)
                        .student(student)
                        .build());

        submission.setGithubPrUrl(dto.getGithubPrUrl());
        submission.setStatus(SubmissionStatus.PENDING);
        submission.setStudentNotes(dto.getNotes());

        ProjectSubmission saved = projectSubmissionRepository.save(submission);
        log.info("Student #{} submitted PR '{}' for Project #{} ('{}')",
                student.getId(), saved.getGithubPrUrl(), project.getId(), project.getTitle());
        return saved;
    }

    @Override
    @Transactional
    public ProjectSubmission reviewSubmission(ProjectReviewRequest dto, Long alumniId) {
        ProjectSubmission submission = projectSubmissionRepository.findById(dto.getSubmissionId())
                .orElseThrow(() -> new IllegalArgumentException("Submission not found with ID: " + dto.getSubmissionId()));

        submission.setStatus(dto.getStatus());
        submission.setAlumniFeedback(dto.getAlumniFeedback());
        if (dto.getEndorsementScore() != null) {
            submission.setEndorsementScore(Math.min(5, Math.max(1, dto.getEndorsementScore())));
        }

        ProjectSubmission saved = projectSubmissionRepository.save(submission);
        log.info("Alumni review recorded for Submission #{}: Status={}, Rating={} stars",
                saved.getId(), saved.getStatus(), saved.getEndorsementScore());

        // INDUSTRY ENDORSEMENT LOOP:
        // An APPROVED project submission writes back to the student's profile and directly feeds
        // the 20% alumni endorsement weight in the Composite ATS Matchmaker.
        if (saved.getStatus() == SubmissionStatus.APPROVED) {
            updateStudentAlumniEndorsementTelemetry(saved.getStudent());
        }

        return saved;
    }

    private void updateStudentAlumniEndorsementTelemetry(User student) {
        List<ProjectSubmission> approvedSubmissions = projectSubmissionRepository
                .findByStudentIdAndStatus(student.getId(), SubmissionStatus.APPROVED);

        double avgScore = approvedSubmissions.stream()
                .filter(s -> s.getEndorsementScore() != null)
                .mapToInt(ProjectSubmission::getEndorsementScore)
                .average()
                .orElse(0.0);

        StudentProfile profile = studentProfileRepository.findByUser(student)
                .or(() -> studentProfileRepository.findByUserId(student.getId()))
                .orElseGet(() -> studentProfileRepository.save(StudentProfile.builder()
                        .user(student)
                        .cgpa(0.0)
                        .branch("Computer Science & Engineering")
                        .verifiedSkills(new ArrayList<>())
                        .build()));

        profile.setAlumniEndorsementAvg(Math.round(avgScore * 10.0) / 10.0);
        profile.setAlumniEndorsementsCount(approvedSubmissions.size());

        // Incorporate 20% alumni endorsement weight into Composite ATS Matchmaker
        int baseAts = profile.getAtsScore() != null ? profile.getAtsScore() : 0;
        int endorsementWeightBonus = approvedSubmissions.isEmpty() ? 0 : (int) Math.round((avgScore / 5.0) * 20.0);
        int compositeAts = baseAts == 0 ? endorsementWeightBonus : Math.min(100, (int) Math.round(baseAts * 0.80) + endorsementWeightBonus);
        profile.setAtsScore(compositeAts);

        // Also add project's skill to student's verified skills if not present
        if (profile.getVerifiedSkills() == null) {
            profile.setVerifiedSkills(new ArrayList<>());
        }
        for (ProjectSubmission sub : approvedSubmissions) {
            if (sub.getProject() != null && sub.getProject().getTargetSkill() != null) {
                String sk = sub.getProject().getTargetSkill();
                if (!profile.getVerifiedSkills().contains(sk)) {
                    profile.getVerifiedSkills().add(sk);
                }
            }
        }

        studentProfileRepository.save(profile);
        log.info("Student #{} profile updated: Alumni Endorsement Avg={} ({} approved projects), Composite ATS Score={}",
                student.getId(), profile.getAlumniEndorsementAvg(), profile.getAlumniEndorsementsCount(), profile.getAtsScore());
    }

    @Override
    @Transactional(readOnly = true)
    public List<ProjectSubmission> getSubmissionsByProject(Long projectId, Long alumniId) {
        return projectSubmissionRepository.findByProjectId(projectId);
    }

    @Override
    @Transactional(readOnly = true)
    public List<ProjectSubmission> getSubmissionsForAlumni(Long alumniId) {
        return projectSubmissionRepository.findByProjectAlumniId(alumniId);
    }

    @Override
    @Transactional(readOnly = true)
    public List<ProjectSubmission> getSubmissionsForStudent(Long studentId) {
        return projectSubmissionRepository.findByStudentId(studentId);
    }

    @Override
    @Transactional(readOnly = true)
    public List<Project> getAllProjects() {
        return projectRepository.findAll();
    }

    @Override
    @Transactional(readOnly = true)
    public List<Project> getAlumniProjects(Long alumniId) {
        return projectRepository.findByAlumniId(alumniId);
    }

    @Override
    @Transactional(readOnly = true)
    public Project getProjectById(Long projectId) {
        return projectRepository.findById(projectId)
                .orElseThrow(() -> new IllegalArgumentException("Project not found: " + projectId));
    }

    @Override
    @Transactional
    public void deleteProject(Long projectId, Long alumniId) {
        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new IllegalArgumentException("Project not found with ID: " + projectId));
        if (project.getAlumni() != null && !project.getAlumni().getId().equals(alumniId)) {
            throw new org.springframework.security.access.AccessDeniedException("You are not authorized to delete this project");
        }
        List<ProjectSubmission> subs = projectSubmissionRepository.findByProjectId(projectId);
        if (!subs.isEmpty()) {
            projectSubmissionRepository.deleteAll(subs);
        }
        projectRepository.delete(project);
        log.info("Project #{} deleted successfully by Alumni #{}", projectId, alumniId);
    }
}

