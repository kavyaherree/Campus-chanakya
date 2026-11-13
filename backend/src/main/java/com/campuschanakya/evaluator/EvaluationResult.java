package com.campuschanakya.evaluator;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

/**
 * ============================================================================
 * EVALUATION RESULT
 * ============================================================================
 * Encapsulates the immutable evaluation outcome computed polymorphically by
 * any SkillEvaluator strategy implementation.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class EvaluationResult {
    private Double score;
    private Boolean passed;
    private Integer cutoff;
    private List<String> weakTopics;
    private String feedback;
    private String evaluationEngine;
}
