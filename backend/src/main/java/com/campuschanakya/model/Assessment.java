package com.campuschanakya.model;

import jakarta.persistence.*;
import lombok.*;

import java.time.Duration;
import java.time.LocalDateTime;

/**
 * ============================================================================
 * OOP PILLAR: INHERITANCE, ENCAPSULATION & DOMAIN INVARIANTS
 * ============================================================================
 * Assessment models a secure, anti-cheat proctored evaluation attempt.
 * Encapsulates:
 * - Real-time strike accumulator (max 3 allowed)
 * - Server-side timer invariants preventing client-side timing tamper
 * - Status lifecycle transitions (IN_PROGRESS -> PASSED / REMEDIATION_READY / TERMINATED)
 */
@Entity
@Table(name = "assessments")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@com.fasterxml.jackson.annotation.JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class Assessment extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    @com.fasterxml.jackson.annotation.JsonIgnore
    private User student;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "skill_id", nullable = false)
    @com.fasterxml.jackson.annotation.JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
    private Skill skill;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false)
    @Builder.Default
    private AssessmentStatus status = AssessmentStatus.IN_PROGRESS;

    @Column(name = "score", nullable = false)
    @Builder.Default
    private Double score = 0.0;

    @Column(name = "strikes_count", nullable = false)
    @Builder.Default
    private Integer strikesCount = 0; // Cumulative blur, fullscreen exits, tab switches

    @Column(name = "paste_count", nullable = false)
    @Builder.Default
    private Integer pasteCount = 0; // Recorded clipboard paste bursts

    @Column(name = "passed", nullable = false)
    @Builder.Default
    private Boolean passed = false;

    @Column(name = "start_time", nullable = false)
    private LocalDateTime startTime;

    @Column(name = "end_time")
    private LocalDateTime endTime;

    @Column(name = "max_allowed_duration_seconds", nullable = false)
    @Builder.Default
    private Integer maxAllowedDurationSeconds = 900; // Default 15 minutes session

    @Column(name = "weak_topics_csv", columnDefinition = "TEXT")
    private String weakTopicsCsv;

    @Column(name = "feedback", columnDefinition = "TEXT")
    private String feedback;

    // ========================================================================
    // ENCAPSULATED DOMAIN METHODS (BEHAVIORAL INVARIANTS)
    // ========================================================================

    /**
     * Increments the anti-cheat strike counter.
     * Enforces the hard 3-strike threshold boundary.
     *
     * @return true if assessment has exceeded threshold and is terminated.
     */
    public boolean registerStrike() {
        this.strikesCount = (this.strikesCount == null ? 0 : this.strikesCount) + 1;
        if (this.strikesCount >= 3) {
            markTerminated("Anti-cheat violation: Exceeded maximum allowed strike threshold (3 strikes logged).");
            return true;
        }
        return false;
    }

    public void registerPaste() {
        this.pasteCount = (this.pasteCount == null ? 0 : this.pasteCount) + 1;
        // Clipboard bursts in high-stakes tests incur an anti-cheat strike
        registerStrike();
    }

    public void markTerminated(String reason) {
        this.status = AssessmentStatus.TERMINATED;
        this.score = 0.0;
        this.passed = false;
        this.endTime = LocalDateTime.now();
        this.feedback = reason;
    }

    public boolean isTerminated() {
        return this.status == AssessmentStatus.TERMINATED;
    }

    /**
     * Verifies server-side elapsed duration against max allowed time plus grace window.
     */
    public boolean isTimeExceeded(long graceMarginSeconds) {
        if (this.startTime == null) return false;
        long elapsedSeconds = Duration.between(this.startTime, LocalDateTime.now()).getSeconds();
        return elapsedSeconds > (this.maxAllowedDurationSeconds + graceMarginSeconds);
    }

    /**
     * Finalizes the assessment with evaluated score and sets completion timestamps.
     */
    public void complete(double evaluatedScore, boolean hasPassed, String weakTopics, String feedbackMsg) {
        this.score = Math.round(evaluatedScore * 10.0) / 10.0;
        this.passed = hasPassed;
        this.status = hasPassed ? AssessmentStatus.PASSED : AssessmentStatus.REMEDIATION_READY;
        this.weakTopicsCsv = weakTopics;
        this.feedback = feedbackMsg;
        this.endTime = LocalDateTime.now();
    }
}
