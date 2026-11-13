package com.campuschanakya.dto;

import com.campuschanakya.model.AssessmentStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

/**
 * ============================================================================
 * OOP ENCAPSULATION: ASSESSMENT RESULT RESPONSE DTO
 * ============================================================================
 * Encapsulates the immutable evaluation outcome, status lifecycle state,
 * anti-cheat strike audit, and diagnostic weak topics for AI remediation.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AssessmentResultResponse {
    private Long assessmentId;
    private Double score; // Score scaled out of 10.0 (e.g. 8.5 / 10.0)
    private AssessmentStatus status; // PASSED, REMEDIATION_READY, TERMINATED
    private Integer totalStrikes;
    private String feedbackMessage;
    private List<String> weakTopics;
    private Boolean verifiedBadgeAwarded;
    private Long elapsedSeconds;
}
