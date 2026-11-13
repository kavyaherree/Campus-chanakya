package com.campuschanakya.service;

import com.campuschanakya.model.Assessment;
import com.campuschanakya.model.StudentProfile;
import com.campuschanakya.model.User;

/**
 * ============================================================================
 * STUDENT TELEMETRY SERVICE
 * ============================================================================
 * Calculates and persists aggregate performance telemetry across all assessments:
 * - Average assessment score (marks)
 * - Total attempts & passing rates
 * - Proctoring strike totals
 * - Persistent repeated error tracking (recurrent conceptual deficiencies)
 */
public interface StudentTelemetryService {

    /**
     * Recomputes and updates the student's profile telemetry based on the latest assessment.
     */
    StudentProfile recordAssessmentTelemetry(User student, Assessment assessment);

    /**
     * Recalculates full telemetry and repeated error history across all past assessments.
     */
    StudentProfile recomputeTelemetry(User student);
}
