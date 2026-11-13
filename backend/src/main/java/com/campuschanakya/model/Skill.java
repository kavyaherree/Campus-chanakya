package com.campuschanakya.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import lombok.*;

/**
 * ============================================================================
 * OOP PILLAR: ENCAPSULATION
 * ============================================================================
 * Represents a measurable technical competency (e.g. Java OOP, React, Data Structures).
 * Encapsulates the passing cutoff threshold required for verification.
 */
@Entity
@Table(name = "skills")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Skill extends BaseEntity {

    @NotBlank(message = "Skill name is required")
    @Column(name = "name", nullable = false, unique = true)
    private String name;

    @NotBlank(message = "Category is required")
    @Column(name = "category", nullable = false)
    private String category; // e.g., "CORE_OOP", "BACKEND", "FRONTEND", "SYSTEM_DESIGN"

    @Min(value = 0, message = "Passing cutoff cannot be less than 0%")
    @Max(value = 100, message = "Passing cutoff cannot exceed 100%")
    @Column(name = "passing_cutoff", nullable = false)
    @Builder.Default
    private Integer passingCutoff = 70; // Default passing benchmark is 70%
}
