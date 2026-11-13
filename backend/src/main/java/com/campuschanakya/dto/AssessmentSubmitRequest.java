package com.campuschanakya.dto;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Map;

/**
 * ============================================================================
 * OOP ENCAPSULATION: ASSESSMENT SUBMISSION REQUEST DTO
 * ============================================================================
 * Encapsulates the complete student submission payload for server-side
 * evaluation, elapsed duration validation, and competency benchmark gating.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AssessmentSubmitRequest {

    @NotNull(message = "Assessment ID is mandatory")
    private Long assessmentId;

    @NotNull(message = "Question answers map must be provided")
    private Map<Long, String> questionAnswers; // QuestionId -> SelectedOption ("A", "B", etc.)

    private Long timeSpentSeconds; // Client-reported time (audited against server timer)
}
