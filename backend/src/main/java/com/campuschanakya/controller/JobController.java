package com.campuschanakya.controller;

import com.campuschanakya.dto.JobCreate;
import com.campuschanakya.model.Application;
import com.campuschanakya.model.Job;
import com.campuschanakya.model.User;
import com.campuschanakya.service.JobService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * ============================================================================
 * JOB & PLACEMENT REST CONTROLLER
 * ============================================================================
 * Handles job postings, student applications, and ATS match score applicant ranking.
 */
@RestController
@RequestMapping("/api/jobs")
@RequiredArgsConstructor
public class JobController {

    private final JobService jobService;
    private final com.campuschanakya.repository.UserRepository userRepository;
    private final com.campuschanakya.repository.ApplicationRepository applicationRepository;

    private User resolveUser(User authenticated) {
        if (authenticated != null) {
            return authenticated;
        }
        return userRepository.findByEmail("student@campus.edu")
                .or(() -> userRepository.findAll().stream().findFirst())
                .orElseThrow(() -> new IllegalStateException("No active student user found"));
    }

    @GetMapping
    public ResponseEntity<List<Job>> getAllJobs() {
        return ResponseEntity.ok(jobService.getAllJobs());
    }

    @GetMapping("/my-applications")
    public ResponseEntity<List<Application>> getMyApplications(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(applicationRepository.findByStudent(resolveUser(user)));
    }

    @PostMapping
    public ResponseEntity<Job> postJob(
            @AuthenticationPrincipal User user,
            @Valid @RequestBody JobCreate jobDto
    ) {
        return ResponseEntity.ok(jobService.postJob(resolveUser(user).getId(), jobDto));
    }

    @GetMapping("/eligible")
    public ResponseEntity<List<Job>> getEligibleJobs(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(jobService.getJobsForStudent(resolveUser(user).getId()));
    }

    @PostMapping("/{jobId}/apply")
    public ResponseEntity<Application> apply(
            @AuthenticationPrincipal User user,
            @PathVariable Long jobId
    ) {
        User student = resolveUser(user);
        try {
            return ResponseEntity.ok(jobService.applyForJob(student.getId(), jobId));
        } catch (IllegalArgumentException e) {
            // If already applied, return existing application
            return applicationRepository.findByStudent(student).stream()
                    .filter(a -> a.getJob() != null && jobId.equals(a.getJob().getId()))
                    .findFirst()
                    .map(ResponseEntity::ok)
                    .orElseThrow(() -> e);
        }
    }

    @GetMapping("/{jobId}/applicants")
    public ResponseEntity<List<Application>> getRankedApplicants(@PathVariable Long jobId) {
        return ResponseEntity.ok(jobService.getJobApplicantsRanked(jobId));
    }

    @PatchMapping("/applications/{applicationId}/status")
    public ResponseEntity<Application> updateStatus(
            @PathVariable Long applicationId,
            @RequestParam String status
    ) {
        return ResponseEntity.ok(jobService.updateApplicationStatus(applicationId, status));
    }
}
