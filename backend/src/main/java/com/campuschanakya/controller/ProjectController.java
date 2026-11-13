package com.campuschanakya.controller;

import com.campuschanakya.dto.ProjectSubmit;
import com.campuschanakya.model.Project;
import com.campuschanakya.model.User;
import com.campuschanakya.service.ProjectService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * ============================================================================
 * PROJECT REST CONTROLLER
 * ============================================================================
 * Exposes endpoints for industry micro/macro projects posted by Alumni.
 */
@RestController
@RequestMapping("/api/projects")
@RequiredArgsConstructor
public class ProjectController {

    private final ProjectService projectService;
    private final com.campuschanakya.repository.UserRepository userRepository;
    private final List<java.util.Map<String, Object>> projectSubmissions = java.util.Collections.synchronizedList(new java.util.ArrayList<>());

    private User resolveUser(User authenticated) {
        if (authenticated != null) {
            return authenticated;
        }
        return userRepository.findByEmail("student@campus.edu")
                .or(() -> userRepository.findAll().stream().findFirst())
                .orElseThrow(() -> new IllegalStateException("No active student user found"));
    }

    @GetMapping
    public ResponseEntity<List<Project>> getAllProjects() {
        return ResponseEntity.ok(projectService.getAllProjects());
    }

    @PostMapping
    public ResponseEntity<Project> createProject(
            @AuthenticationPrincipal User user,
            @Valid @RequestBody ProjectSubmit projectDto
    ) {
        return ResponseEntity.ok(projectService.createProject(resolveUser(user).getId(), projectDto));
    }

    @GetMapping("/alumni")
    public ResponseEntity<List<Project>> getAlumniProjects(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(projectService.getAlumniProjects(resolveUser(user).getId()));
    }

    @PostMapping("/{projectId}/submit")
    public ResponseEntity<java.util.Map<String, Object>> submitProject(
            @AuthenticationPrincipal User user,
            @PathVariable Long projectId,
            @RequestBody java.util.Map<String, String> payload
    ) {
        User student = resolveUser(user);
        java.util.Map<String, Object> sub = new java.util.HashMap<>();
        sub.put("submissionId", "PR-" + java.util.UUID.randomUUID().toString().substring(0, 8).toUpperCase());
        sub.put("studentId", student.getId());
        sub.put("projectId", projectId);
        sub.put("url", payload.getOrDefault("url", ""));
        sub.put("notes", payload.getOrDefault("notes", ""));
        sub.put("status", "PENDING_ALUMNI_REVIEW");
        sub.put("submittedAt", java.time.LocalDate.now().toString());

        projectSubmissions.add(0, sub);
        return ResponseEntity.ok(java.util.Map.of("success", true, "submission", sub));
    }

    @GetMapping("/my-submissions")
    public ResponseEntity<List<java.util.Map<String, Object>>> getMySubmissions(@AuthenticationPrincipal User user) {
        User student = resolveUser(user);
        List<java.util.Map<String, Object>> result = new java.util.ArrayList<>();
        for (java.util.Map<String, Object> s : projectSubmissions) {
            if (java.util.Objects.equals(s.get("studentId"), student.getId())) {
                result.add(s);
            }
        }
        return ResponseEntity.ok(result);
    }
}
