package com.campuschanakya.evaluator;

import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

/**
 * ============================================================================
 * DESIGN PATTERN: FACTORY PATTERN (OOP ABSTRACTION & POLYMORPHISM)
 * ============================================================================
 * EvaluatorFactory decouples the calling service from concrete evaluator classes.
 * Spring automatically injects all beans implementing SkillEvaluator into a Map.
 * At runtime, the factory selects the appropriate polymorphic implementation
 * based on the requested submission type ("MCQ" or "CODE").
 */
@Component
public class EvaluatorFactory {

    private final Map<String, SkillEvaluator> evaluatorMap;

    public EvaluatorFactory(List<SkillEvaluator> evaluators) {
        this.evaluatorMap = evaluators.stream()
                .collect(Collectors.toMap(
                        e -> e.getEvaluatorType().toUpperCase(),
                        e -> e
                ));
    }

    /**
     * Resolves the concrete SkillEvaluator polymorphically.
     *
     * @param type "MCQ" or "CODE"
     * @return Concrete SkillEvaluator instance
     */
    public SkillEvaluator getEvaluator(String type) {
        if (type == null) {
            type = "MCQ";
        }
        SkillEvaluator evaluator = evaluatorMap.get(type.trim().toUpperCase());
        if (evaluator == null) {
            throw new IllegalArgumentException("Unsupported evaluation type: " + type + ". Supported: " + evaluatorMap.keySet());
        }
        return evaluator;
    }
}
