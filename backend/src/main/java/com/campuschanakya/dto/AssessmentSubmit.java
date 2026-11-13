package com.campuschanakya.dto;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Map;

/**
 * ============================================================================
 * ASSESSMENT SUBMISSION DTO
 * ============================================================================
 * Encapsulates client answers, evaluation type, and proctoring metrics.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AssessmentSubmit {

    @NotNull(message = "Skill ID is required")
    private Long skillId;

    private String evaluationType; // "MCQ" or "CODE"

    private Map<String, String> answers; // QuestionId -> SelectedOption
    private String sourceCode;           // For code challenges
    private Integer strikesCount;        // Anti-cheating violations detected on client
}
