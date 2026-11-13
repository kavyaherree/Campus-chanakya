package com.campuschanakya.exception;

import lombok.Getter;

/**
 * ============================================================================
 * ANTI-CHEAT SECURITY EXCEPTION
 * ============================================================================
 * Thrown whenever an assessment breaches the hard 3-strike threshold or attempts
 * illegal operations on an invalidated session.
 */
@Getter
public class AssessmentTerminatedException extends RuntimeException {

    private final Long assessmentId;
    private final int totalStrikes;

    public AssessmentTerminatedException(String message) {
        super(message);
        this.assessmentId = null;
        this.totalStrikes = 3;
    }

    public AssessmentTerminatedException(Long assessmentId, int totalStrikes, String message) {
        super(message);
        this.assessmentId = assessmentId;
        this.totalStrikes = totalStrikes;
    }
}
