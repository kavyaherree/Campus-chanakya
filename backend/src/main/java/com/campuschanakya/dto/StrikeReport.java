package com.campuschanakya.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * ============================================================================
 * STRIKE REPORT DTO
 * ============================================================================
 * Real-time telemetry report for suspicious proctoring events during tests:
 * Tab switches, blur events, exiting fullscreen, devtools open.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class StrikeReport {
    private Long assessmentId;
    private String violationType; // "TAB_SWITCH", "FULLSCREEN_EXIT", "DEVTOOLS_DETECTED"
    private Long timestamp;
    private Integer currentStrikeCount;
}
