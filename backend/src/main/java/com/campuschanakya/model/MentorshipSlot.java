package com.campuschanakya.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;

import java.time.LocalDateTime;

/**
 * ============================================================================
 * OOP PILLAR: ASSOCIATION & ENCAPSULATION
 * ============================================================================
 * 1-on-1 alumni mentorship availability slots.
 * Protected by Signal-Over-Noise Gatekeeping: only accessible if student
 * has verified skill benchmark (score >= 7.0 / 10.0 and status == PASSED).
 */
@Entity
@Table(name = "mentorship_slots")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MentorshipSlot extends BaseEntity {

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "alumni_id", nullable = false)
    private User alumni;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "student_id")
    private User student;

    @NotBlank(message = "Target skill is mandatory")
    @Column(name = "target_skill", nullable = false)
    private String targetSkill;

    @NotNull(message = "Scheduled time is mandatory")
    @Column(name = "scheduled_at", nullable = false)
    private LocalDateTime scheduledAt;

    @Column(name = "meeting_url")
    private String meetingUrl; // Google Meet / Zoom link

    @Column(name = "notes", columnDefinition = "TEXT")
    private String notes;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false)
    @Builder.Default
    private MentorshipSlotStatus status = MentorshipSlotStatus.OPEN;
}
