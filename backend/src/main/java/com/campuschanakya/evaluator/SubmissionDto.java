package com.campuschanakya.evaluator;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Map;

/**
 * ============================================================================
 * EVALUATOR SUBMISSION DTO
 * ============================================================================
 * Encapsulates the polymorphic payload submitted for verification:
 * Can represent either MCQ responses or Code submissions.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SubmissionDto {
    private String submissionType; // "MCQ" or "CODE"
    private Long skillId;
    private String skillName;
    private Integer cutoffPercentage;

    // For MCQ
    private Map<String, String> answers;         // QuestionId -> SelectedOption
    private Map<String, String> correctAnswers;  // QuestionId -> CorrectOption
    private Map<String, String> questionTopics;  // QuestionId -> ConceptTag (e.g. "Polymorphism")

    // For Code
    private String sourceCode;
    private String language;
    private String testSuite;
}
