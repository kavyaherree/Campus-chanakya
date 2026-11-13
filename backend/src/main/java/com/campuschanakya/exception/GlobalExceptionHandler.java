package com.campuschanakya.exception;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

/**
 * ============================================================================
 * GLOBAL REST EXCEPTION HANDLER
 * ============================================================================
 * Maps anti-cheat security breaches and validation errors into clear, RFC-compliant
 * HTTP JSON responses.
 */
@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(UnauthorizedMentorshipAccessException.class)
    public ResponseEntity<Map<String, Object>> handleUnauthorizedMentorshipAccess(UnauthorizedMentorshipAccessException ex) {
        Map<String, Object> errorBody = new HashMap<>();
        errorBody.put("timestamp", LocalDateTime.now());
        errorBody.put("status", HttpStatus.FORBIDDEN.value());
        errorBody.put("error", "Forbidden");
        errorBody.put("reason", "Prerequisite skill verification badge missing.");
        errorBody.put("message", ex.getMessage() != null && !ex.getMessage().isBlank()
                ? ex.getMessage()
                : "Prerequisite skill verification badge missing.");
        if (ex.getTargetSkill() != null) {
            errorBody.put("targetSkill", ex.getTargetSkill());
        }
        errorBody.put("actionRequired", "Complete and pass the skill assessment with score >= 7.0 / 10.0 to unlock alumni mentorship and project sandbox.");

        return ResponseEntity.status(HttpStatus.FORBIDDEN).body(errorBody);
    }

    @ExceptionHandler(AssessmentTerminatedException.class)
    public ResponseEntity<Map<String, Object>> handleAssessmentTerminated(AssessmentTerminatedException ex) {
        Map<String, Object> errorBody = new HashMap<>();
        errorBody.put("timestamp", LocalDateTime.now());
        errorBody.put("status", HttpStatus.FORBIDDEN.value());
        errorBody.put("error", "Anti-Cheat Integrity Violation");
        errorBody.put("assessmentId", ex.getAssessmentId());
        errorBody.put("totalStrikes", ex.getTotalStrikes());
        errorBody.put("message", ex.getMessage());
        errorBody.put("remedy", "The session has been terminated and recorded as score 0.0. Please contact the academic proctoring panel or wait for AI Remediation unlock.");

        return ResponseEntity.status(HttpStatus.FORBIDDEN).body(errorBody);
    }

    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<Map<String, Object>> handleIllegalArgument(IllegalArgumentException ex) {
        Map<String, Object> errorBody = new HashMap<>();
        errorBody.put("timestamp", LocalDateTime.now());
        errorBody.put("status", HttpStatus.BAD_REQUEST.value());
        errorBody.put("error", "Bad Request");
        errorBody.put("message", ex.getMessage());

        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errorBody);
    }

    @ExceptionHandler(IllegalStateException.class)
    public ResponseEntity<Map<String, Object>> handleIllegalState(IllegalStateException ex) {
        Map<String, Object> errorBody = new HashMap<>();
        errorBody.put("timestamp", LocalDateTime.now());
        errorBody.put("status", HttpStatus.CONFLICT.value());
        errorBody.put("error", "Session State Conflict");
        errorBody.put("message", ex.getMessage());

        return ResponseEntity.status(HttpStatus.CONFLICT).body(errorBody);
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<Map<String, Object>> handleValidationExceptions(MethodArgumentNotValidException ex) {
        Map<String, Object> errorBody = new HashMap<>();
        errorBody.put("timestamp", LocalDateTime.now());
        errorBody.put("status", HttpStatus.BAD_REQUEST.value());
        errorBody.put("error", "Validation Failed");

        Map<String, String> fieldErrors = new HashMap<>();
        ex.getBindingResult().getFieldErrors().forEach(error ->
                fieldErrors.put(error.getField(), error.getDefaultMessage())
        );
        errorBody.put("fieldErrors", fieldErrors);
        String firstMessage = fieldErrors.values().stream().findFirst().orElse("Invalid input parameters.");
        errorBody.put("message", firstMessage);

        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errorBody);
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<Map<String, Object>> handleGeneralException(Exception ex) {
        Map<String, Object> errorBody = new HashMap<>();
        errorBody.put("timestamp", LocalDateTime.now());
        errorBody.put("status", HttpStatus.INTERNAL_SERVER_ERROR.value());
        errorBody.put("error", "Internal Server Error");
        errorBody.put("message", ex.getMessage());

        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorBody);
    }
}
