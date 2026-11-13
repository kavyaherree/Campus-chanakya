package com.campuschanakya.model;

import jakarta.persistence.*;
import lombok.*;

/**
 * ============================================================================
 * OOP PILLAR: INHERITANCE & ENCAPSULATION
 * ============================================================================
 * RedemptionPlan models an automated AI-driven recovery roadmap generated for a
 * student who did not meet the cutoff on an assessment. It encapsulates the weak
 * topic tags, 3-day recovery schedule JSON, and re-attempt unlock status.
 */
@Entity
@Table(name = "redemption_plans")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@com.fasterxml.jackson.annotation.JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class RedemptionPlan extends BaseEntity {

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "assessment_id", nullable = false)
    @com.fasterxml.jackson.annotation.JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
    private Assessment assessment;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    @com.fasterxml.jackson.annotation.JsonIgnore
    private User student;

    @Column(name = "weak_tags", columnDefinition = "TEXT", nullable = false)
    private String weakTags;

    @Lob
    @Column(name = "roadmap_json", columnDefinition = "LONGTEXT", nullable = false)
    private String roadmapJson;

    @Column(name = "completed", nullable = false)
    @Builder.Default
    private Boolean completed = false;
}
