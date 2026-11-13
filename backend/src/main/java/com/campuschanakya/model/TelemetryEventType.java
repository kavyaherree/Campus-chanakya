package com.campuschanakya.model;

/**
 * ============================================================================
 * TELEMETRY EVENT TYPES
 * ============================================================================
 * Defines client-side proctoring violation vectors intercepted in real time:
 * - TAB_SWITCH: Browser tab visibility change (document.visibilitychange)
 * - BLUR: Window focus loss (window.onblur)
 * - FULLSCREEN_EXIT: Breach of full-screen enforcement container
 * - PASTE_BURST: Clipboard paste injection event
 */
public enum TelemetryEventType {
    TAB_SWITCH,
    BLUR,
    FULLSCREEN_EXIT,
    PASTE_BURST
}
