package com.campuschanakya.repository;

import com.campuschanakya.model.Skill;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

/**
 * ============================================================================
 * SKILL REPOSITORY
 * ============================================================================
 */
public interface SkillRepository extends JpaRepository<Skill, Long> {
    Optional<Skill> findByName(String name);
    boolean existsByName(String name);
}
