package com.campuschanakya.model;

/**
 * ============================================================================
 * ROLE ENUMERATION - TWO TIER SYSTEM
 * ============================================================================
 * Defines strict authorization boundaries across the CampusChanakya ecosystem:
 * - SUPER_ADMIN: Platform Owner managing all colleges, global telemetry & onboarding
 * - ADMIN: College Administrator managing affiliated students, alumni & recruiters
 * - STUDENT: Assessment taker, redemption applicant, job applicant
 * - ALUMNI: Mentorship project publisher, PR reviewer
 * - RECRUITER: Job posting creator, ATS applicant review
 */
public enum Role {
    STUDENT,
    ALUMNI,
    RECRUITER,
    ADMIN,
    SUPER_ADMIN
}
