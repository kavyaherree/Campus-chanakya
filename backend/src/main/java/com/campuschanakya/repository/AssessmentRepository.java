package com.campuschanakya.repository;

import com.campuschanakya.model.Assessment;
import com.campuschanakya.model.AssessmentStatus;
import com.campuschanakya.model.Skill;
import com.campuschanakya.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

/**
 * ============================================================================
 * ASSESSMENT REPOSITORY (SPRING DATA JPA)
 * ============================================================================
 * Manages database persistence for proctored evaluation attempts and status states.
 */
public interface AssessmentRepository extends JpaRepository<Assessment, Long> {

    List<Assessment> findByStudent(User student);

    List<Assessment> findByStudentId(Long studentId);

    @Query("SELECT a FROM Assessment a WHERE a.student.id = :studentId AND LOWER(a.skill.name) = LOWER(:skillName) AND a.status = :status")
    List<Assessment> findByStudentIdAndSkillNameAndStatus(
            @Param("studentId") Long studentId,
            @Param("skillName") String skillName,
            @Param("status") AssessmentStatus status
    );

    Optional<Assessment> findTopByStudentAndSkillOrderByCreatedAtDesc(User student, Skill skill);
}
