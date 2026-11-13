package com.campuschanakya.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import lombok.*;

import java.util.ArrayList;
import java.util.List;

/**
 * ============================================================================
 * OOP PILLAR: INHERITANCE & ENCAPSULATION
 * ============================================================================
 * Job encapsulates placement opportunities posted by corporate recruiters.
 * Invariants include company name, minimum CGPA eligibility cutoff, and
 * a mandatory verified skills checklist.
 */
@Entity
@Table(name = "jobs")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Job extends BaseEntity {

    @NotBlank(message = "Job title is required")
    @Column(name = "title", nullable = false)
    private String title;

    @NotBlank(message = "Company name is required")
    @Column(name = "company", nullable = false)
    private String company;

    @Column(name = "location")
    private String location;

    @Column(name = "salary_package")
    private String salaryPackage; // e.g. "12 LPA - 18 LPA"

    @DecimalMin(value = "0.0")
    @Column(name = "min_cgpa", nullable = false)
    @Builder.Default
    private Double minCgpa = 7.0;

    @Column(name = "description", columnDefinition = "TEXT")
    private String description;

    @ElementCollection
    @CollectionTable(name = "job_required_skills", joinColumns = @JoinColumn(name = "job_id"))
    @Column(name = "skill_name")
    @Builder.Default
    private List<String> requiredSkills = new ArrayList<>();

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "recruiter_id", nullable = false)
    private User recruiter;
}
