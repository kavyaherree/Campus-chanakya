package com.campuschanakya.repository;

import com.campuschanakya.model.Question;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

/**
 * ============================================================================
 * QUESTION REPOSITORY (SPRING DATA JPA)
 * ============================================================================
 * Handles database queries for competency assessment questions and concept tags.
 */
public interface QuestionRepository extends JpaRepository<Question, Long> {

    List<Question> findBySkillName(String skillName);

    long countBySkillName(String skillName);

    @Query(value = "SELECT * FROM questions WHERE LOWER(skill_name) = LOWER(:skillName) ORDER BY RAND()", nativeQuery = true)
    List<Question> findRandomQuestionsBySkillName(@Param("skillName") String skillName, Pageable pageable);
}
