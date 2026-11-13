package com.campuschanakya.service.impl;

import com.campuschanakya.dto.JobCreate;
import com.campuschanakya.model.Application;
import com.campuschanakya.model.Job;
import com.campuschanakya.model.StudentProfile;
import com.campuschanakya.model.User;
import com.campuschanakya.repository.ApplicationRepository;
import com.campuschanakya.repository.JobRepository;
import com.campuschanakya.repository.StudentProfileRepository;
import com.campuschanakya.repository.UserRepository;
import com.campuschanakya.service.JobService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Collections;
import java.util.List;

/**
 * ============================================================================
 * OOP ABSTRACTION: JOB SERVICE & ATS RANKING ENGINE
 * ============================================================================
 * Manages placement postings and computes weighted ATS match scores.
 * Mathematical model:
 * ATS Match = (Verified Skills Overlap % * 0.60) + (Normalized CGPA % * 0.30) + 10.0 (Base)
 */
@Service
@RequiredArgsConstructor
public class JobServiceImpl implements JobService {

    private final JobRepository jobRepository;
    private final ApplicationRepository applicationRepository;
    private final UserRepository userRepository;
    private final StudentProfileRepository studentProfileRepository;

    @Override
    public Job postJob(Long recruiterId, JobCreate jobDto) {
        User recruiter = userRepository.findById(recruiterId)
                .orElseThrow(() -> new IllegalArgumentException("Recruiter not found: " + recruiterId));

        Job job = Job.builder()
                .title(jobDto.getTitle())
                .company(jobDto.getCompany())
                .location(jobDto.getLocation())
                .salaryPackage(jobDto.getSalaryPackage())
                .minCgpa(jobDto.getMinCgpa() != null ? jobDto.getMinCgpa() : 7.0)
                .description(jobDto.getDescription())
                .requiredSkills(jobDto.getRequiredSkills() != null ? jobDto.getRequiredSkills() : Collections.emptyList())
                .recruiter(recruiter)
                .build();

        return jobRepository.save(job);
    }

    @Override
    public List<Job> getAllJobs() {
        return jobRepository.findAll();
    }

    @Override
    public List<Job> getJobsForStudent(Long studentId) {
        StudentProfile profile = studentProfileRepository.findByUserId(studentId).orElse(null);
        if (profile != null) {
            return jobRepository.findByMinCgpaLessThanEqual(profile.getCgpa());
        }
        return jobRepository.findAll();
    }

    @Override
    @Transactional
    public Application applyForJob(Long studentId, Long jobId) {
        User student = userRepository.findById(studentId)
                .orElseThrow(() -> new IllegalArgumentException("Student not found: " + studentId));

        Job job = jobRepository.findById(jobId)
                .orElseThrow(() -> new IllegalArgumentException("Job not found: " + jobId));

        if (applicationRepository.existsByStudentAndJob(student, job)) {
            throw new IllegalArgumentException("You have already submitted an application for this position.");
        }

        StudentProfile profile = studentProfileRepository.findByUser(student).orElse(null);
        double cgpa = profile != null ? profile.getCgpa() : 7.0;
        List<String> verifiedSkills = profile != null ? profile.getVerifiedSkills() : Collections.emptyList();

        // Compute ATS Match Score
        double atsScore = calculateAtsScore(job.getRequiredSkills(), verifiedSkills, cgpa, job.getMinCgpa());

        Application application = Application.builder()
                .job(job)
                .student(student)
                .atsScore(atsScore)
                .status("APPLIED")
                .notes(String.format("Calculated ATS match: %.1f%% based on %d verified skill matches.", atsScore,
                        countMatchingSkills(job.getRequiredSkills(), verifiedSkills)))
                .build();

        return applicationRepository.save(application);
    }

    @Override
    public List<Application> getJobApplicantsRanked(Long jobId) {
        return applicationRepository.findByJobIdOrderByAtsScoreDesc(jobId);
    }

    @Override
    public Application updateApplicationStatus(Long applicationId, String status) {
        Application application = applicationRepository.findById(applicationId)
                .orElseThrow(() -> new IllegalArgumentException("Application not found: " + applicationId));
        application.setStatus(status.toUpperCase());
        return applicationRepository.save(application);
    }

    private double calculateAtsScore(List<String> requiredSkills, List<String> verifiedSkills, double studentCgpa, double minCgpa) {
        if (requiredSkills == null || requiredSkills.isEmpty()) {
            return Math.min(100.0, (studentCgpa / 10.0) * 80.0 + 20.0);
        }

        long matched = countMatchingSkills(requiredSkills, verifiedSkills);
        double skillMatchRatio = (double) matched / requiredSkills.size();

        // 60% skill alignment, 30% CGPA alignment, 10% base eligibility
        double cgpaFactor = Math.min(1.0, studentCgpa / 10.0);
        double score = (skillMatchRatio * 60.0) + (cgpaFactor * 30.0) + 10.0;

        return Math.round(score * 10.0) / 10.0; // Round to 1 decimal place
    }

    private long countMatchingSkills(List<String> required, List<String> verified) {
        if (required == null || verified == null) return 0;
        return required.stream()
                .filter(req -> verified.stream().anyMatch(v -> v.equalsIgnoreCase(req.trim())))
                .count();
    }
}
