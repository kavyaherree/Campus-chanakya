package com.campuschanakya.service;

import com.campuschanakya.model.Assessment;
import com.campuschanakya.model.RedemptionPlan;

import java.util.List;

/**
 * ============================================================================
 * OOP PILLAR: ABSTRACTION
 * ============================================================================
 * RedemptionService defines contracts for AI-generated remediation roadmaps
 * targeted at failed technical concepts.
 */
public interface RedemptionService {
    RedemptionPlan generateRedemptionPlan(Assessment assessment);
    List<RedemptionPlan> getStudentPlans(Long userId);
    RedemptionPlan completePlan(Long planId);
}
