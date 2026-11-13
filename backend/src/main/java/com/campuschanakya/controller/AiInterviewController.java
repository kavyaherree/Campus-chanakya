package com.campuschanakya.controller;

import com.campuschanakya.dto.AiVivaEvaluateRequest;
import com.campuschanakya.dto.AiVivaEvaluateResponse;
import com.campuschanakya.dto.AiVivaGenerateRequest;
import com.campuschanakya.model.Assessment;
import com.campuschanakya.model.AssessmentStatus;
import com.campuschanakya.model.Skill;
import com.campuschanakya.model.User;
import com.campuschanakya.repository.AssessmentRepository;
import com.campuschanakya.repository.SkillRepository;
import com.campuschanakya.repository.UserRepository;
import com.campuschanakya.service.GeminiAiService;
import com.campuschanakya.service.RedemptionService;
import com.campuschanakya.service.StudentTelemetryService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.Map;

/**
 * ============================================================================
 * AI INTERVIEW REST CONTROLLER
 * ============================================================================
 * Exposes live Gemini-powered AI viva question generation and evaluation endpoints.
 * Automatically persists evaluations and updates repeated error telemetry in database.
 */
@RestController
@RequestMapping("/api/ai/viva")
@RequiredArgsConstructor
@Slf4j
public class AiInterviewController {

    private final GeminiAiService geminiAiService;
    private final UserRepository userRepository;
    private final SkillRepository skillRepository;
    private final AssessmentRepository assessmentRepository;
    private final StudentTelemetryService studentTelemetryService;
    private final RedemptionService redemptionService;

    @PostMapping("/generate")
    public ResponseEntity<Map<String, Object>> generateQuestion(@RequestBody(required = false) AiVivaGenerateRequest request) {
        if (request == null) {
            request = new AiVivaGenerateRequest();
        }
        return ResponseEntity.ok(geminiAiService.generateInterviewQuestion(request));
    }

    @PostMapping("/evaluate")
    public ResponseEntity<AiVivaEvaluateResponse> evaluateAnswer(
            @AuthenticationPrincipal User user,
            @Valid @RequestBody AiVivaEvaluateRequest request
    ) {
        AiVivaEvaluateResponse response = geminiAiService.evaluateAnswer(request);

        // Persistent database storage for marks, attempts, and repeated errors
        try {
            User student = (user != null) ? user : userRepository.findByEmail("student@campus.edu")
                    .or(() -> userRepository.findAll().stream().findFirst())
                    .orElse(null);

            if (student != null) {
                String topicName = request.getTopic() != null ? request.getTopic().trim() : "Technical Architecture";
                String skillName = "AI Mock Viva: " + topicName;

                Skill skill = skillRepository.findByName(skillName)
                        .orElseGet(() -> skillRepository.save(Skill.builder()
                                .name(skillName)
                                .category("AI Mock Viva")
                                .passingCutoff(75)
                                .build()));

                String weakCsv = (response.getWeaknessTips() != null && !response.getWeaknessTips().isEmpty())
                        ? String.join(", ", response.getWeaknessTips())
                        : (response.getAreasOfImprovement() != null ? String.join(", ", response.getAreasOfImprovement()) : "");

                String feedback = response.getFeedbackSummary() != null && !response.getFeedbackSummary().isBlank()
                        ? response.getFeedbackSummary()
                        : (response.getFeedback() != null ? response.getFeedback() : "Viva evaluation recorded.");

                Assessment viva = Assessment.builder()
                        .student(student)
                        .skill(skill)
                        .score((double) response.getOverallScore())
                        .passed(response.isPassed())
                        .status(response.isPassed() ? AssessmentStatus.PASSED : AssessmentStatus.REMEDIATION_READY)
                        .strikesCount(0)
                        .weakTopicsCsv(weakCsv)
                        .feedback(feedback)
                        .startTime(LocalDateTime.now().minusMinutes(5))
                        .endTime(LocalDateTime.now())
                        .maxAllowedDurationSeconds(600)
                        .build();

                Assessment saved = assessmentRepository.save(viva);
                response.setAssessmentId(saved.getId());

                if (!response.isPassed()) {
                    redemptionService.generateRedemptionPlan(saved);
                }

                // Update repeated errors, averages and telemetry in database
                studentTelemetryService.recordAssessmentTelemetry(student, saved);
                log.info("Persisted AI Mock Viva to database: Assessment #{}, student #{}, score: {}, passed: {}",
                        saved.getId(), student.getId(), saved.getScore(), saved.getPassed());
            }
        } catch (Exception e) {
            log.error("Failed to persist viva attempt to database", e);
        }

        return ResponseEntity.ok(response);
    }
}
