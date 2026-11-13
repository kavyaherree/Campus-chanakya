package com.campuschanakya.dto;

import com.campuschanakya.model.TelemetryEventType;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * ============================================================================
 * OOP ENCAPSULATION: TELEMETRY REPORT DTO
 * ============================================================================
 * Encapsulates real-time telemetry events captured from client-side DOM listeners:
 * blur, fullscreen-exit, tab switch, and paste bursts.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TelemetryReportDto {

    @NotNull(message = "Assessment ID is mandatory")
    private Long assessmentId;

    @NotNull(message = "Telemetry event type must be specified")
    private TelemetryEventType eventType;

    private Long timestamp;
}
