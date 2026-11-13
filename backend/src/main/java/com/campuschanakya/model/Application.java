package com.campuschanakya.model;

import jakarta.persistence.*;
import lombok.*;

/**
 * ============================================================================
 * OOP PILLAR: INHERITANCE & ENCAPSULATION
 * ============================================================================
 * Represents a student's formal placement application to a Job.
 * Encapsulates the algorithmic ATS (Applicant Tracking System) match score
 * computed based on verified skills and academic CGPA metrics.
 */
@Entity
@Table(name = "job_applications")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@com.fasterxml.jackson.annotation.JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class Application extends BaseEntity {

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "job_id", nullable = false)
    @com.fasterxml.jackson.annotation.JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
    private Job job;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "student_id", nullable = false)
    @com.fasterxml.jackson.annotation.JsonIgnore
    private User student;

    @Column(name = "ats_score", nullable = false)
    private Double atsScore; // e.g. 85.5%

    @Column(name = "status", nullable = false)
    @Builder.Default
    private String status = "APPLIED"; // "APPLIED", "SHORTLISTED", "INTERVIEWING", "OFFERED", "REJECTED"

    @Column(name = "notes", columnDefinition = "TEXT")
    private String notes;
}
