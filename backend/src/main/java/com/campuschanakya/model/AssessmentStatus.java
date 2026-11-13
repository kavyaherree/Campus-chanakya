package com.campuschanakya.model;

/**
 * ============================================================================
 * ASSESSMENT STATUS LIFECYCLE
 * ============================================================================
 * Encapsulates the state machine for an anti-cheat proctored evaluation:
 * - IN_PROGRESS: Test session active, timer running, telemetry stream listening.
 * - PASSED: Score >= 7.0 / 10.0 (70%), competency verified, badges unlocked.
 * - REMEDIATION_READY: Score < 7.0 / 10.0, diagnostics fed to AI Remediation Agent.
 * - TERMINATED: Anti-cheat strike threshold (>=3) breached or time tamper. Score = 0.0.
 */
public enum AssessmentStatus {
    IN_PROGRESS,
    PASSED,
    REMEDIATION_READY,
    TERMINATED
}
