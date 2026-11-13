package com.campuschanakya.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import lombok.*;

/**
 * ============================================================================
 * OOP PILLAR: INHERITANCE & ENCAPSULATION
 * ============================================================================
 * Question represents an objective competency assessment problem.
 * Encapsulates the question text, options, canonical answer key, and
 * granular concept tag used by the AI Remediation Engine for diagnostic profiling.
 */
@Entity
@Table(name = "questions")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Question extends BaseEntity {

    @NotBlank(message = "Skill name is mandatory")
    @Column(name = "skill_name", nullable = false)
    private String skillName;

    @NotBlank(message = "Question text cannot be blank")
    @Column(name = "question_text", columnDefinition = "TEXT", nullable = false)
    private String questionText;

    @Column(name = "option_a", nullable = false)
    private String optionA;

    @Column(name = "option_b", nullable = false)
    private String optionB;

    @Column(name = "option_c", nullable = false)
    private String optionC;

    @Column(name = "option_d", nullable = false)
    private String optionD;

    @Column(name = "correct_answer", nullable = false, length = 5)
    private String correctAnswer; // "A", "B", "C", or "D"

    @Column(name = "concept_tag", nullable = false)
    private String conceptTag; // e.g., "Encapsulation & Access Modifiers", "Polymorphism & Dynamic Dispatch"

    @Column(name = "difficulty")
    @Builder.Default
    private String difficulty = "MEDIUM"; // "EASY", "MEDIUM", "HARD"
}
