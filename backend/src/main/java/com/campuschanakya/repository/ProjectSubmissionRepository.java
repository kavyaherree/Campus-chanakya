package com.campuschanakya.repository;

import com.campuschanakya.model.Project;
import com.campuschanakya.model.ProjectSubmission;
import com.campuschanakya.model.SubmissionStatus;
import com.campuschanakya.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

/**
 * ============================================================================
 * PROJECT SUBMISSION REPOSITORY
 * ============================================================================
 */
public interface ProjectSubmissionRepository extends JpaRepository<ProjectSubmission, Long> {

    List<ProjectSubmission> findByProjectId(Long projectId);

    List<ProjectSubmission> findByStudentId(Long studentId);

    List<ProjectSubmission> findByStudent(User student);

    List<ProjectSubmission> findByProject(Project project);

    List<ProjectSubmission> findByProjectAlumniId(Long alumniId);

    List<ProjectSubmission> findByStudentIdAndStatus(Long studentId, SubmissionStatus status);

    Optional<ProjectSubmission> findByProjectIdAndStudentId(Long projectId, Long studentId);
}
