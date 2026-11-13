package com.campuschanakya.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import lombok.*;

/**
 * ============================================================================
 * OOP PILLAR: ASSOCIATION & INHERITANCE
 * ============================================================================
 * Represents a student's GitHub PR submission for an alumni industry challenge.
 * Once APPROVED, feeds the 20% alumni endorsement weight in the Composite ATS Matchmaker.
 */
@Entity
@Table(name = "project_submissions")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProjectSubmission extends BaseEntity {

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "project_id", nullable = false)
    private Project project;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "student_id", nullable = false)
    private User student;

    @NotBlank(message = "GitHub PR URL is mandatory")
    @Column(name = "github_pr_url", nullable = false)
    private String githubPrUrl;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false)
    @Builder.Default
    private SubmissionStatus status = SubmissionStatus.PENDING;

    @Column(name = "alumni_feedback", columnDefinition = "TEXT")
    private String alumniFeedback;

    @Min(value = 1, message = "Endorsement rating must be at least 1 star")
    @Max(value = 5, message = "Endorsement rating cannot exceed 5 stars")
    @Column(name = "endorsement_score")
    private Integer endorsementScore; // 1 to 5 stars

    @Column(name = "student_notes", columnDefinition = "TEXT")
    private String studentNotes;
}
