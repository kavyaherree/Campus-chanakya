package com.campuschanakya.evaluator;

import org.springframework.stereotype.Component;

import java.util.*;

/**
 * ============================================================================
 * OOP PILLAR: POLYMORPHISM (CONCRETE STRATEGY A)
 * ============================================================================
 * McqEvaluator implements SkillEvaluator, providing concrete grading algorithms
 * for multiple-choice verification assessments. It compares submitted answers
 * against canonical answer keys, tracks topic-level failures, and computes percentage.
 */
@Component
public class McqEvaluator implements SkillEvaluator {

    @Override
    public EvaluationResult evaluate(SubmissionDto submission) {
        Map<String, String> answers = submission.getAnswers() != null ? submission.getAnswers() : Collections.emptyMap();
        Map<String, String> correctAnswers = submission.getCorrectAnswers() != null ? submission.getCorrectAnswers() : Collections.emptyMap();
        Map<String, String> topics = submission.getQuestionTopics() != null ? submission.getQuestionTopics() : Collections.emptyMap();

        int totalQuestions = correctAnswers.isEmpty() ? Math.max(answers.size(), 1) : correctAnswers.size();
        int correctCount = 0;
        Set<String> weakTopics = new HashSet<>();

        for (Map.Entry<String, String> entry : correctAnswers.entrySet()) {
            String qId = entry.getKey();
            String expected = entry.getValue();
            String actual = answers.get(qId);

            if (expected != null && expected.equalsIgnoreCase(actual)) {
                correctCount++;
            } else {
                String topic = topics.getOrDefault(qId, "General Concepts");
                weakTopics.add(topic);
            }
        }

        // If no predefined correct answers were passed, fallback to simulation based on submitted count
        double scorePercentage = ((double) correctCount / totalQuestions) * 100.0;
        int cutoff = submission.getCutoffPercentage() != null ? submission.getCutoffPercentage() : 70;
        boolean passed = scorePercentage >= cutoff;

        String feedback = passed
                ? String.format("Proficiency verified! Scored %.1f%% against cutoff %d%%.", scorePercentage, cutoff)
                : String.format("Cutoff unmet (Scored %.1f%%, Required %d%%). AI Redemption roadmap generated.", scorePercentage, cutoff);

        return EvaluationResult.builder()
                .score(scorePercentage)
                .passed(passed)
                .cutoff(cutoff)
                .weakTopics(new ArrayList<>(weakTopics))
                .feedback(feedback)
                .evaluationEngine("MCQ-Deterministic-Evaluator")
                .build();
    }

    @Override
    public String getEvaluatorType() {
        return "MCQ";
    }
}
