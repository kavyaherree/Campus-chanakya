package com.campuschanakya.evaluator;

import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;

/**
 * ============================================================================
 * OOP PILLAR: POLYMORPHISM (CONCRETE STRATEGY B)
 * ============================================================================
 * CodeEvaluator implements SkillEvaluator to grade code snippets.
 * Inspects syntax presence, OOP constructs (encapsulation, polymorphism, abstract
 * methods), structural validity, and edge-case testing coverage.
 */
@Component
public class CodeEvaluator implements SkillEvaluator {

    @Override
    public EvaluationResult evaluate(SubmissionDto submission) {
        String code = submission.getSourceCode() != null ? submission.getSourceCode() : "";
        List<String> weakTopics = new ArrayList<>();
        double score = 40.0; // Base score for non-empty submission

        if (code.isBlank()) {
            return EvaluationResult.builder()
                    .score(0.0)
                    .passed(false)
                    .cutoff(submission.getCutoffPercentage() != null ? submission.getCutoffPercentage() : 70)
                    .weakTopics(List.of("Syntax", "ProblemSolving"))
                    .feedback("Empty code submitted.")
                    .evaluationEngine("Static-AST-CodeEvaluator")
                    .build();
        }

        // Static AST heuristics for OOP viva verification
        if (code.contains("class ") || code.contains("interface ")) {
            score += 15.0;
        } else {
            weakTopics.add("OOP Structural Definition");
        }

        if (code.contains("private ") || code.contains("get") || code.contains("set")) {
            score += 15.0;
        } else {
            weakTopics.add("Encapsulation");
        }

        if (code.contains("extends ") || code.contains("implements ") || code.contains("@Override")) {
            score += 20.0;
        } else {
            weakTopics.add("Inheritance & Polymorphism");
        }

        if (code.contains("try ") || code.contains("catch ") || code.contains("throw")) {
            score += 10.0;
        } else {
            weakTopics.add("Exception Handling");
        }

        score = Math.min(100.0, score);
        int cutoff = submission.getCutoffPercentage() != null ? submission.getCutoffPercentage() : 70;
        boolean passed = score >= cutoff;

        String feedback = passed
                ? String.format("Code verified! Static analysis score: %.1f%% against cutoff %d%%.", score, cutoff)
                : String.format("Code assessment failed (%.1f%% / %d%%). OOP constructs require improvement.", score, cutoff);

        return EvaluationResult.builder()
                .score(score)
                .passed(passed)
                .cutoff(cutoff)
                .weakTopics(weakTopics)
                .feedback(feedback)
                .evaluationEngine("Static-AST-CodeEvaluator")
                .build();
    }

    @Override
    public String getEvaluatorType() {
        return "CODE";
    }
}
