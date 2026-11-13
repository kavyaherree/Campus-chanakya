package com.campuschanakya.evaluator;

/**
 * ============================================================================
 * OOP PILLAR: ABSTRACTION & POLYMORPHISM (STRATEGY PATTERN)
 * ============================================================================
 * SkillEvaluator establishes an abstract contract defining evaluation behavior.
 * By coding to this interface rather than concrete classes, the caller can
 * polymorphically invoke `evaluate(...)` without knowing or coupling to the
 * underlying grading mechanics (Open/Closed Principle & Dependency Inversion).
 */
public interface SkillEvaluator {

    /**
     * Polymorphic method to grade a student's technical submission.
     *
     * @param submission Encapsulated answers or code artifact.
     * @return EvaluationResult containing computed score, pass status and weak topics.
     */
    EvaluationResult evaluate(SubmissionDto submission);

    /**
     * Identifies the evaluator strategy type (e.g. "MCQ", "CODE").
     */
    String getEvaluatorType();
}
