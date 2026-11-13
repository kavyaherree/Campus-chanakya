package com.campuschanakya.controller;

import com.campuschanakya.model.RedemptionPlan;
import com.campuschanakya.model.User;
import com.campuschanakya.service.RedemptionService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * ============================================================================
 * REDEMPTION REST CONTROLLER
 * ============================================================================
 * Exposes endpoints for students to retrieve their AI recovery roadmaps and mark
 * completed recovery milestones to unlock test re-attempts.
 */
@RestController
@RequestMapping("/api/redemption")
@RequiredArgsConstructor
public class RedemptionController {

    private final RedemptionService redemptionService;
    private final com.campuschanakya.repository.UserRepository userRepository;

    private User resolveUser(User authenticated) {
        if (authenticated != null) {
            return authenticated;
        }
        return userRepository.findByEmail("student@campus.edu")
                .or(() -> userRepository.findAll().stream().findFirst())
                .orElseThrow(() -> new IllegalStateException("No active student user found"));
    }

    @GetMapping("/my-plans")
    public ResponseEntity<List<RedemptionPlan>> getMyPlans(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(redemptionService.getStudentPlans(resolveUser(user).getId()));
    }

    @PatchMapping("/complete/{planId}")
    public ResponseEntity<RedemptionPlan> completePlan(@PathVariable Long planId) {
        return ResponseEntity.ok(redemptionService.completePlan(planId));
    }
}
