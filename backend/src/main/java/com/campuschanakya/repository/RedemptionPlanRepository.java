package com.campuschanakya.repository;

import com.campuschanakya.model.Assessment;
import com.campuschanakya.model.RedemptionPlan;
import com.campuschanakya.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

/**
 * ============================================================================
 * REDEMPTION PLAN REPOSITORY
 * ============================================================================
 */
public interface RedemptionPlanRepository extends JpaRepository<RedemptionPlan, Long> {
    List<RedemptionPlan> findByStudent(User student);
    List<RedemptionPlan> findByStudentId(Long studentId);
    Optional<RedemptionPlan> findByAssessment(Assessment assessment);
}
