package com.campuschanakya.controller;

import com.campuschanakya.dto.*;
import com.campuschanakya.evaluator.EvaluationResult;
import com.campuschanakya.model.Assessment;
import com.campuschanakya.model.AssessmentStatus;
import com.campuschanakya.model.Question;
import com.campuschanakya.model.Skill;
import com.campuschanakya.model.StudentProfile;
import com.campuschanakya.model.User;
import com.campuschanakya.repository.*;
import com.campuschanakya.service.AssessmentService;
import com.campuschanakya.service.RedemptionService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

/**
 * ============================================================================
 * ANTI-CHEAT ASSESSMENT REST CONTROLLER
 * ============================================================================
 * Exposes endpoints for:
 * 1. POST /api/assessments/start     -> Initialize proctored session & server timer
 * 2. POST /api/assessments/telemetry -> Real-time strike logger & threshold check
 * 3. POST /api/assessments/submit    -> Final answer grading & 7.0/10.0 benchmark gating
 * 4. GET  /api/assessments/{id}/status -> Integrity status polling
 */
@RestController
@RequestMapping({"/api/assessments", "/api/assessment"})
@RequiredArgsConstructor
public class AssessmentController {

    private final AssessmentService assessmentService;
    private final QuestionRepository questionRepository;
    private final UserRepository userRepository;
    private final SkillRepository skillRepository;
    private final AssessmentRepository assessmentRepository;
    private final RedemptionService redemptionService;
    private final com.campuschanakya.service.StudentTelemetryService studentTelemetryService;

    private User resolveUser(User authenticated) {
        if (authenticated != null) {
            return authenticated;
        }
        return userRepository.findByEmail("student@campus.edu")
                .or(() -> userRepository.findAll().stream().findFirst())
                .orElseThrow(() -> new IllegalStateException("No active student user found"));
    }

    @PostMapping("/start")
    public ResponseEntity<Assessment> startAssessment(
            @AuthenticationPrincipal User user,
            @Valid @RequestBody AssessmentStartRequest request
    ) {
        Long studentId = (user != null && user.getId() != null) ? user.getId() : (request.getStudentId() != null ? request.getStudentId() : resolveUser(user).getId());
        Assessment session = assessmentService.startAssessment(studentId, request.getSkillName());
        return ResponseEntity.ok(session);
    }

    @PostMapping("/telemetry")
    public ResponseEntity<Map<String, Object>> logTelemetry(
            @Valid @RequestBody TelemetryReportDto report
    ) {
        Assessment updated = assessmentService.recordTelemetryStrike(report);

        int totalStrikes = updated.getStrikesCount() != null ? updated.getStrikesCount() : 0;
        int remainingStrikes = Math.max(0, 3 - totalStrikes);

        Map<String, Object> response = new HashMap<>();
        response.put("assessmentId", updated.getId());
        response.put("totalStrikes", totalStrikes);
        response.put("remainingAllowedStrikes", remainingStrikes);
        response.put("status", updated.getStatus());
        response.put("message", totalStrikes > 0
                ? "Warning: Telemetry violation logged. " + remainingStrikes + " strike(s) remaining."
                : "Telemetry recorded.");

        return ResponseEntity.ok(response);
    }

    @PostMapping("/submit")
    public ResponseEntity<AssessmentResultResponse> submitAssessment(
            @Valid @RequestBody AssessmentSubmitRequest request
    ) {
        AssessmentResultResponse result = assessmentService.submitAssessment(request);
        return ResponseEntity.ok(result);
    }

    @PostMapping("/record")
    public ResponseEntity<Map<String, Object>> recordAssessmentResult(
            @AuthenticationPrincipal User user,
            @RequestBody Map<String, Object> payload
    ) {
        User student = resolveUser(user);
        String skillName = (String) payload.getOrDefault("skillName", "Technical Competency");
        double score = payload.get("score") instanceof Number ? ((Number) payload.get("score")).doubleValue() : 75.0;
        int strikesCount = payload.get("strikesCount") instanceof Number ? ((Number) payload.get("strikesCount")).intValue() : 0;
        boolean passed = payload.containsKey("passed") ? Boolean.TRUE.equals(payload.get("passed")) : (score >= 75.0);
        String weakTopicsCsv = (String) payload.getOrDefault("weakTopicsCsv", "");
        String feedback = (String) payload.getOrDefault("feedback", passed ? "Competency verified successfully." : "Benchmark unmet. AI Remedial plan activated.");

        Skill skill = skillRepository.findByName(skillName)
                .orElseGet(() -> skillRepository.save(Skill.builder()
                        .name(skillName)
                        .category("Technical Competency")
                        .passingCutoff(75)
                        .build()));

        Assessment assessment = null;
        if (payload.containsKey("assessmentId") && payload.get("assessmentId") instanceof Number) {
            Long assessmentId = ((Number) payload.get("assessmentId")).longValue();
            assessment = assessmentRepository.findById(assessmentId).orElse(null);
        }

        if (assessment == null) {
            assessment = Assessment.builder()
                    .student(student)
                    .skill(skill)
                    .status(passed ? AssessmentStatus.PASSED : AssessmentStatus.REMEDIATION_READY)
                    .score(score)
                    .passed(passed)
                    .strikesCount(strikesCount)
                    .weakTopicsCsv(weakTopicsCsv)
                    .feedback(feedback)
                    .startTime(java.time.LocalDateTime.now().minusMinutes(15))
                    .endTime(java.time.LocalDateTime.now())
                    .maxAllowedDurationSeconds(900)
                    .build();
        } else {
            assessment.setSkill(skill);
            assessment.setScore(score);
            assessment.setPassed(passed);
            assessment.setStatus(passed ? AssessmentStatus.PASSED : AssessmentStatus.REMEDIATION_READY);
            assessment.setStrikesCount(strikesCount);
            assessment.setWeakTopicsCsv(weakTopicsCsv);
            assessment.setFeedback(feedback);
            assessment.setEndTime(java.time.LocalDateTime.now());
        }

        Assessment saved = assessmentRepository.save(assessment);

        if (!passed) {
            // Automatically generate AI 3-day recovery roadmap in database
            redemptionService.generateRedemptionPlan(saved);
        }

        // Persist everything to database: marks, repeated errors, aggregate stats
        StudentProfile updatedProfile = studentTelemetryService.recordAssessmentTelemetry(student, saved);

        Map<String, Object> resp = new HashMap<>();
        resp.put("id", saved.getId());
        resp.put("skillName", skillName);
        resp.put("score", saved.getScore());
        resp.put("passed", saved.getPassed());
        resp.put("strikesCount", saved.getStrikesCount());
        resp.put("feedback", saved.getFeedback());
        resp.put("status", saved.getStatus() != null ? saved.getStatus().name() : "PASSED");
        resp.put("averageAssessmentScore", updatedProfile != null ? updatedProfile.getAverageAssessmentScore() : score);
        resp.put("totalAssessmentsTaken", updatedProfile != null ? updatedProfile.getTotalAssessmentsTaken() : 1);
        resp.put("totalAssessmentsPassed", updatedProfile != null ? updatedProfile.getTotalAssessmentsPassed() : (passed ? 1 : 0));
        resp.put("repeatedErrorsJson", updatedProfile != null ? updatedProfile.getRepeatedErrorsJson() : "[]");

        return ResponseEntity.ok(resp);
    }

    @GetMapping("/{id}/status")
    public ResponseEntity<Assessment> getStatus(@PathVariable Long id) {
        return ResponseEntity.ok(assessmentService.getAssessmentStatus(id));
    }

    @GetMapping("/skills")
    public ResponseEntity<List<Skill>> getSkills() {
        return ResponseEntity.ok(assessmentService.getAllAvailableSkills());
    }

    @GetMapping("/history")
    public ResponseEntity<List<Assessment>> getHistory(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(assessmentService.getStudentAssessments(resolveUser(user).getId()));
    }

    /**
     * Retrieves questions for an assessment, securely sanitizing the canonical answer key.
     */
    @GetMapping("/questions")
    public ResponseEntity<List<Map<String, Object>>> getQuestionsForSkill(
            @RequestParam(defaultValue = "Java OOP (Encapsulation, Inheritance, Polymorphism)") String skillName
    ) {
        List<Question> questions = questionRepository.findBySkillName(skillName);
        if (questions.isEmpty()) {
            questions = questionRepository.findAll();
        }

        // Sanitize out correctAnswer before sending to client
        List<Map<String, Object>> sanitized = questions.stream().map(q -> {
            Map<String, Object> map = new HashMap<>();
            map.put("id", q.getId());
            map.put("skillName", q.getSkillName());
            map.put("questionText", q.getQuestionText());
            map.put("optionA", q.getOptionA());
            map.put("optionB", q.getOptionB());
            map.put("optionC", q.getOptionC());
            map.put("optionD", q.getOptionD());
            map.put("conceptTag", q.getConceptTag());
            map.put("difficulty", q.getDifficulty());
            return map;
        }).collect(Collectors.toList());

        return ResponseEntity.ok(sanitized);
    }

    // ========================================================================
    // BACKWARD COMPATIBILITY ENDPOINTS
    // ========================================================================

    @PostMapping("/legacy-submit")
    public ResponseEntity<EvaluationResult> legacySubmit(
            @AuthenticationPrincipal User user,
            @Valid @RequestBody AssessmentSubmit submitDto
    ) {
        return ResponseEntity.ok(assessmentService.submitAssessment(user.getId(), submitDto));
    }

    @PostMapping("/strike")
    public ResponseEntity<String> recordStrikeLegacy(@RequestBody StrikeReport strikeReport) {
        assessmentService.logStrike(strikeReport);
        return ResponseEntity.ok("Strike violation logged successfully.");
    }
}
