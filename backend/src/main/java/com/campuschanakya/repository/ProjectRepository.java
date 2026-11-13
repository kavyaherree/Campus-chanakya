package com.campuschanakya.repository;

import com.campuschanakya.model.Project;
import com.campuschanakya.model.ProjectType;
import com.campuschanakya.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

/**
 * ============================================================================
 * PROJECT REPOSITORY
 * ============================================================================
 */
public interface ProjectRepository extends JpaRepository<Project, Long> {

    List<Project> findByAlumniId(Long alumniId);

    List<Project> findByAlumni(User alumni);

    List<Project> findByTargetSkill(String targetSkill);

    List<Project> findByTargetSkillContainingIgnoreCase(String targetSkill);

    List<Project> findByProjectType(ProjectType projectType);
}
