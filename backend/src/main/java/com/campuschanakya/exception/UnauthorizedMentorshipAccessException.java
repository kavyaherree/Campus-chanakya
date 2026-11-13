package com.campuschanakya.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

/**
 * ============================================================================
 * SIGNAL-OVER-NOISE GATEKEEPING EXCEPTION
 * ============================================================================
 * Thrown when an unverified student attempts to view, book, or submit work for
 * an alumnus's mentorship slot or projects without a verified assessment badge
 * (score >= 7.0 / 10.0 and status == PASSED).
 */
@ResponseStatus(HttpStatus.FORBIDDEN)
public class UnauthorizedMentorshipAccessException extends RuntimeException {

    private final String targetSkill;

    public UnauthorizedMentorshipAccessException(String message) {
        super(message);
        this.targetSkill = null;
    }

    public UnauthorizedMentorshipAccessException(String message, String targetSkill) {
        super(message);
        this.targetSkill = targetSkill;
    }

    public String getTargetSkill() {
        return targetSkill;
    }
}
