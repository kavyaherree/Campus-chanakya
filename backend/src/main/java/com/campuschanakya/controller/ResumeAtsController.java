package com.campuschanakya.controller;

import com.campuschanakya.dto.ResumeAnalyzeRequest;
import com.campuschanakya.dto.ResumeAnalyzeResponse;
import com.campuschanakya.model.User;
import com.campuschanakya.repository.UserRepository;
import com.campuschanakya.service.ResumeAtsService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.Map;

@RestController
@RequestMapping("/api/resume")
@RequiredArgsConstructor
public class ResumeAtsController {

    private final ResumeAtsService resumeAtsService;
    private final UserRepository userRepository;
    private final com.campuschanakya.repository.StudentProfileRepository studentProfileRepository;

    private User resolveUser(User authenticated) {
        if (authenticated != null) {
            return authenticated;
        }
        return userRepository.findByEmail("student@campus.edu")
                .or(() -> userRepository.findAll().stream().findFirst())
                .orElseThrow(() -> new IllegalStateException("No active student user found"));
    }

    @PostMapping(value = "/upload-pdf", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ResumeAnalyzeResponse> uploadAndAnalyze(
            @AuthenticationPrincipal User user,
            @RequestParam("file") MultipartFile file,
            @RequestParam(value = "targetRole", required = false, defaultValue = "Full Stack Java Engineer") String targetRole
    ) {
        ResumeAnalyzeResponse response = resumeAtsService.uploadAndAnalyzeFile(file, targetRole);
        try {
            User student = resolveUser(user);
            com.campuschanakya.model.StudentProfile profile = studentProfileRepository.findByUser(student)
                    .or(() -> studentProfileRepository.findByUserId(student.getId()))
                    .orElseGet(() -> studentProfileRepository.save(com.campuschanakya.model.StudentProfile.builder().user(student).build()));
            profile.setAtsScore(response.getAtsScore());
            profile.setTargetRole(targetRole);
            studentProfileRepository.save(profile);
        } catch (Exception ignored) {
        }
        return ResponseEntity.ok(response);
    }

    @PostMapping("/analyze-text")
    public ResponseEntity<ResumeAnalyzeResponse> analyzeText(
            @AuthenticationPrincipal User user,
            @RequestBody ResumeAnalyzeRequest request
    ) {
        ResumeAnalyzeResponse response = resumeAtsService.analyzeResumeText(request);
        try {
            User student = resolveUser(user);
            com.campuschanakya.model.StudentProfile profile = studentProfileRepository.findByUser(student)
                    .or(() -> studentProfileRepository.findByUserId(student.getId()))
                    .orElseGet(() -> studentProfileRepository.save(com.campuschanakya.model.StudentProfile.builder().user(student).build()));
            profile.setAtsScore(response.getAtsScore());
            if (request.getTargetRole() != null) {
                profile.setTargetRole(request.getTargetRole());
            }
            studentProfileRepository.save(profile);
        } catch (Exception ignored) {
        }
        return ResponseEntity.ok(response);
    }

    @PostMapping("/save")
    public ResponseEntity<Map<String, Object>> saveResume(
            @AuthenticationPrincipal User user,
            @RequestBody Map<String, Object> resumeData
    ) {
        return ResponseEntity.ok(resumeAtsService.saveResumeData(resolveUser(user), resumeData));
    }

    @GetMapping("/data")
    public ResponseEntity<Map<String, Object>> getResumeData(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(resumeAtsService.getSavedResumeData(resolveUser(user)));
    }
}
