package com.campuschanakya.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.DecimalMax;
import jakarta.validation.constraints.DecimalMin;
import lombok.*;

import java.util.ArrayList;
import java.util.List;

/**
 * ============================================================================
 * OOP PILLAR: INHERITANCE, ENCAPSULATION & ASSOCIATION
 * ============================================================================
 * StudentProfile encapsulates student-specific academic credentials and verified
 * skill tags, linked to the User entity via a 1:1 relationship.
 */
@Entity
@Table(name = "student_profiles")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class StudentProfile extends BaseEntity {

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", referencedColumnName = "id", nullable = false, unique = true)
    private User user;

    @DecimalMin(value = "0.0", message = "CGPA cannot be negative")
    @DecimalMax(value = "10.0", message = "CGPA cannot exceed 10.0")
    @Column(name = "cgpa", nullable = false)
    private Double cgpa;

    @Column(name = "branch", nullable = false)
    private String branch;

    @Column(name = "graduation_year")
    private Integer graduationYear;

    @Column(name = "phone")
    private String phone;

    @Column(name = "college")
    private String college;

    @Column(name = "enrollment_number")
    private String enrollmentNumber;

    @Column(name = "bio", length = 2000)
    private String bio;

    @Column(name = "target_role")
    private String targetRole;

    @Column(name = "github_url")
    private String githubUrl;

    @Column(name = "linkedin_url")
    private String linkedinUrl;

    @Column(name = "portfolio_url")
    private String portfolioUrl;

    @Column(name = "holland_code")
    private String hollandCode;

    @Column(name = "holland_archetype")
    private String hollandArchetype;

    @Column(name = "holland_scores_json", columnDefinition = "TEXT")
    private String hollandScoresJson;

    @Column(name = "ats_score")
    private Integer atsScore;

    @Column(name = "resume_data_json", columnDefinition = "TEXT")
    private String resumeDataJson;

    @Column(name = "repeated_errors_json", columnDefinition = "TEXT")
    private String repeatedErrorsJson;

    @Column(name = "average_assessment_score")
    @Builder.Default
    private Double averageAssessmentScore = 0.0;

    @Column(name = "total_assessments_taken")
    @Builder.Default
    private Integer totalAssessmentsTaken = 0;

    @Column(name = "total_assessments_passed")
    @Builder.Default
    private Integer totalAssessmentsPassed = 0;

    @Column(name = "total_strikes_recorded")
    @Builder.Default
    private Integer totalStrikesRecorded = 0;

    @Column(name = "alumni_endorsement_avg")
    @Builder.Default
    private Double alumniEndorsementAvg = 0.0;

    @Column(name = "alumni_endorsements_count")
    @Builder.Default
    private Integer alumniEndorsementsCount = 0;

    @ElementCollection
    @CollectionTable(name = "student_verified_skills", joinColumns = @JoinColumn(name = "student_id"))
    @Column(name = "skill_name")
    @Builder.Default
    private List<String> verifiedSkills = new ArrayList<>();
}
