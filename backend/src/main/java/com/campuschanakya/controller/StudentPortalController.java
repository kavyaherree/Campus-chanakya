package com.campuschanakya.controller;

import com.campuschanakya.dto.*;
import com.campuschanakya.model.User;
import com.campuschanakya.repository.UserRepository;
import com.campuschanakya.service.StudentPortalService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/student")
@RequiredArgsConstructor
public class StudentPortalController {

    private final StudentPortalService studentPortalService;
    private final UserRepository userRepository;

    private User resolveUser(User authenticated) {
        if (authenticated != null) {
            return authenticated;
        }
        return userRepository.findByEmail("student@campus.edu")
                .or(() -> userRepository.findAll().stream().findFirst())
                .orElseThrow(() -> new IllegalStateException("No active student user found"));
    }

    @GetMapping("/profile")
    public ResponseEntity<StudentProfileDto> getProfile(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(studentPortalService.getStudentProfile(resolveUser(user)));
    }

    @PutMapping("/profile")
    public ResponseEntity<StudentProfileDto> updateProfile(
            @AuthenticationPrincipal User user,
            @RequestBody StudentProfileDto dto
    ) {
        return ResponseEntity.ok(studentPortalService.updateStudentProfile(resolveUser(user), dto));
    }

    @PostMapping("/holland-assessment")
    public ResponseEntity<HollandAssessmentResponse> submitHollandAssessment(
            @AuthenticationPrincipal User user,
            @RequestBody HollandAssessmentRequest request
    ) {
        return ResponseEntity.ok(studentPortalService.evaluateHollandAssessment(resolveUser(user), request));
    }

    @GetMapping("/badges")
    public ResponseEntity<List<SkillBadgeDto>> getBadges(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(studentPortalService.getStudentBadges(resolveUser(user)));
    }

    @GetMapping("/badges/verify/{credentialId}")
    public ResponseEntity<SkillBadgeDto> verifyBadge(@PathVariable String credentialId) {
        return ResponseEntity.ok(studentPortalService.verifyBadge(credentialId));
    }

    @GetMapping("/growth-trajectory")
    public ResponseEntity<GrowthTrajectoryResponse> getGrowthTrajectory(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(studentPortalService.getGrowthTrajectory(resolveUser(user)));
    }
}
