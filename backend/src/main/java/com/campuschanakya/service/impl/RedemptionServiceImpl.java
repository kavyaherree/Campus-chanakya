package com.campuschanakya.service.impl;

import com.campuschanakya.model.Assessment;
import com.campuschanakya.model.RedemptionPlan;
import com.campuschanakya.repository.RedemptionPlanRepository;
import com.campuschanakya.service.RedemptionService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/**
 * ============================================================================
 * OOP ABSTRACTION: REDEMPTION SERVICE IMPLEMENTATION
 * ============================================================================
 * Generates structured 3-day recovery roadmaps when assessments fall below the cutoff,
 * bridging academic weaknesses with targeted practice drills and exercises.
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class RedemptionServiceImpl implements RedemptionService {

    private final RedemptionPlanRepository redemptionPlanRepository;

    @Override
    @Transactional
    public RedemptionPlan generateRedemptionPlan(Assessment assessment) {
        String weakTopics = assessment.getWeakTopicsCsv() != null && !assessment.getWeakTopicsCsv().isBlank()
                ? assessment.getWeakTopicsCsv()
                : "Foundational OOP Concepts";

        String roadmapJson = buildAiPromptRoadmapJson(assessment.getSkill().getName(), weakTopics);

        RedemptionPlan plan = RedemptionPlan.builder()
                .assessment(assessment)
                .student(assessment.getStudent())
                .weakTags(weakTopics)
                .roadmapJson(roadmapJson)
                .completed(false)
                .build();

        return redemptionPlanRepository.save(plan);
    }

    @Override
    public List<RedemptionPlan> getStudentPlans(Long userId) {
        return redemptionPlanRepository.findByStudentId(userId);
    }

    @Override
    @Transactional
    public RedemptionPlan completePlan(Long planId) {
        RedemptionPlan plan = redemptionPlanRepository.findById(planId)
                .orElseThrow(() -> new IllegalArgumentException("Redemption plan not found: " + planId));
        plan.setCompleted(true);
        return redemptionPlanRepository.save(plan);
    }

    private String buildAiPromptRoadmapJson(String skillName, String weakTopics) {
        // Structured 3-Day recovery curriculum JSON
        return String.format("""
            {
              "skill": "%s",
              "identifiedWeaknesses": "%s",
              "durationDays": 3,
              "schedule": [
                {
                  "day": 1,
                  "title": "Deep Dive into Theoretical Invariants",
                  "focus": "%s",
                  "tasks": [
                    "Review memory model (Heap vs Stack allocation) for objects",
                    "Understand dynamic method dispatch via vtable in Java",
                    "Solve 5 conceptual viva MCQs on access level scoping"
                  ],
                  "estHours": 2.5
                },
                {
                  "day": 2,
                  "title": "Refactoring & SOLID Design Drills",
                  "focus": "Polymorphism, Abstraction & Decoupling",
                  "tasks": [
                    "Refactor tight coupling into interface-based polymorphism",
                    "Implement a real-world Strategy Pattern for payment or evaluation",
                    "Submit 1 hands-on code drill with 100%% test coverage"
                  ],
                  "estHours": 3.0
                },
                {
                  "day": 3,
                  "title": "Mock Assessment & Verification Unlock",
                  "focus": "Comprehensive Re-test Preparation",
                  "tasks": [
                    "Complete 15-minute timed proctored dry run",
                    "Verify edge-case handling for NullPointerException and bounds",
                    "Unlock re-attempt token on CampusChanakya"
                  ],
                  "estHours": 2.0
                }
              ]
            }
            """, skillName, weakTopics, weakTopics.split(",")[0]);
    }
}
