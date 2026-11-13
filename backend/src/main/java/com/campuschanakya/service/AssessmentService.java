package com.campuschanakya.service;

import com.campuschanakya.dto.*;
import com.campuschanakya.evaluator.EvaluationResult;
import com.campuschanakya.model.Assessment;
import com.campuschanakya.model.Skill;

import java.util.List;

/**
 * ============================================================================
 * OOP PILLAR: ABSTRACTION (SERVICE CONTRACT)
 * ============================================================================
 * AssessmentService specifies the abstract business contract for:
 * 1. Anti-Cheat Session Initialization & Server-Side Timers
 * 2. Real-Time Telemetry Strike Gating (Max 3 Allowed)
 * 3. Objective Competency Evaluation & Benchmark Gating (7.0/10.0 Threshold)
 */
public interface AssessmentService {

    /**
     * Initializes a proctored assessment session and begins server-side timer.
     *
     * @param studentId ID of the authenticated student
     * @param skillName Name of the skill to be assessed
     * @return Initialized Assessment entity in IN_PROGRESS state
     */
    Assessment startAssessment(Long studentId, String skillName);

    /**
     * Intercepts and records real-time anti-cheat violations from client-side DOM listeners.
     * Enforces the hard 3-strike threshold, automatically invalidating sessions if exceeded.
     *
     * @param report Telemetry payload (TAB_SWITCH, BLUR, FULLSCREEN_EXIT, PASTE_BURST)
     * @return Updated Assessment entity
     */
    Assessment recordTelemetryStrike(TelemetryReportDto report);

    /**
     * Evaluates final student submissions, enforces server-side duration constraints,
     * grades answers against question database, and executes benchmark gating:
     * - Score >= 7.0 / 10.0: Sets PASSED, awards verified skill badge.
     * - Score < 7.0 / 10.0: Sets REMEDIATION_READY, extracts weak tags for AI Remediation.
     *
     * @param request Encapsulated question answers and elapsed time
     * @return AssessmentResultResponse detailing score, status, and diagnostic tags
     */
    AssessmentResultResponse submitAssessment(AssessmentSubmitRequest request);

    /**
     * Retrieves current integrity and proctoring status for polling.
     */
    Assessment getAssessmentStatus(Long assessmentId);

    /**
     * Lists all available competency skills for assessment selection.
     */
    List<Skill> getAllAvailableSkills();

    /**
     * Retrieves audit history of all assessments for a student.
     */
    List<Assessment> getStudentAssessments(Long studentId);

    /**
     * Backward-compatible submission bridge for legacy polymorphic evaluator tests.
     */
    EvaluationResult submitAssessment(Long userId, AssessmentSubmit submitDto);

    /**
     * Backward-compatible strike logger.
     */
    void logStrike(StrikeReport strikeReport);
}
