package com.campuschanakya.service;

import com.campuschanakya.dto.ProjectCreateRequest;
import com.campuschanakya.dto.ProjectReviewRequest;
import com.campuschanakya.dto.ProjectSubmissionRequest;
import com.campuschanakya.dto.ProjectSubmit;
import com.campuschanakya.model.Project;
import com.campuschanakya.model.ProjectSubmission;

import java.util.List;

/**
 * ============================================================================
 * OOP PILLAR: ABSTRACTION
 * ============================================================================
 * ProjectService orchestrates alumni industry project postings and reviews.
 * Enforces Signal-Over-Noise Gatekeeping via MentorshipGatingValidator.
 */
public interface ProjectService {

    Project createProject(ProjectCreateRequest dto, Long alumniId);

    // Backward-compatibility overload
    Project createProject(Long alumniId, ProjectSubmit projectDto);

    List<Project> getProjectsBySkill(Long studentId, String skill);

    ProjectSubmission submitProject(ProjectSubmissionRequest dto, Long studentId);

    ProjectSubmission reviewSubmission(ProjectReviewRequest dto, Long alumniId);

    List<ProjectSubmission> getSubmissionsByProject(Long projectId, Long alumniId);

    List<ProjectSubmission> getSubmissionsForAlumni(Long alumniId);

    List<ProjectSubmission> getSubmissionsForStudent(Long studentId);

    List<Project> getAllProjects();

    List<Project> getAlumniProjects(Long alumniId);

    Project getProjectById(Long projectId);

    void deleteProject(Long projectId, Long alumniId);
}

