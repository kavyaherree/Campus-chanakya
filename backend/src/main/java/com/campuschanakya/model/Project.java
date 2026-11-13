package com.campuschanakya.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;

/**
 * ============================================================================
 * OOP PILLAR: INHERITANCE & ENCAPSULATION
 * ============================================================================
 * Micro/Macro industry-aligned projects posted by Alumni to bridge academic
 * theory with industry engineering standards. Gated by verified skill badges.
 */
@Entity
@Table(name = "projects")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Project extends BaseEntity {

    @NotBlank(message = "Title is required")
    @Column(name = "title", nullable = false)
    private String title;

    @Column(name = "description", columnDefinition = "TEXT", nullable = false)
    private String description;

    @Column(name = "target_skill")
    private String targetSkill; // e.g. "Java Core & OOP Invariants", "Spring Boot", "Data Structures"

    @NotNull(message = "Project type is required")
    @Enumerated(EnumType.STRING)
    @Column(name = "project_type", nullable = false)
    private ProjectType projectType; // MICRO or MACRO

    @Column(name = "starter_repo_url")
    private String starterRepoUrl;

    @Column(name = "acceptance_criteria", columnDefinition = "TEXT")
    private String acceptanceCriteria;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "alumni_id", nullable = false)
    private User alumni;

    @Column(name = "tech_stack")
    private String techStack;

    @Column(name = "github_template_url")
    private String githubTemplateUrl;

    @PrePersist
    @PreUpdate
    public void syncLegacyColumns() {
        if (techStack == null || techStack.isBlank()) {
            techStack = targetSkill != null ? targetSkill : "Java Core";
        }
        if (targetSkill == null || targetSkill.isBlank()) {
            targetSkill = techStack;
        }
        if (githubTemplateUrl == null || githubTemplateUrl.isBlank()) {
            githubTemplateUrl = starterRepoUrl != null ? starterRepoUrl : "https://github.com";
        }
        if (starterRepoUrl == null || starterRepoUrl.isBlank()) {
            starterRepoUrl = githubTemplateUrl;
        }
    }
}
