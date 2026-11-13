package com.campuschanakya.service;

import com.campuschanakya.exception.UnauthorizedMentorshipAccessException;
import com.campuschanakya.model.Assessment;
import com.campuschanakya.model.AssessmentStatus;
import com.campuschanakya.model.StudentProfile;
import com.campuschanakya.repository.AssessmentRepository;
import com.campuschanakya.repository.StudentProfileRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.*;

/**
 * ============================================================================
 * SIGNAL-OVER-NOISE GATEKEEPING VALIDATOR
 * ============================================================================
 * Enforces zero cold outreach spam.
 * A student CANNOT view, book, or submit work for an alumnus's mentorship slot
 * or projects unless they possess a verified assessment badge in that exact skill
 * (score >= 7.0 / 10.0 or >= 70.0 / 100.0 and status == PASSED).
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class MentorshipGatingValidator {

    private final AssessmentRepository assessmentRepository;
    private final StudentProfileRepository studentProfileRepository;

    /**
     * Validates that student has a verified badge for the target skill.
     * Throws UnauthorizedMentorshipAccessException (HTTP 403) if verification fails.
     */
    public void validateStudentSkillVerification(Long studentId, String targetSkill) {
        if (studentId == null) {
            throw new UnauthorizedMentorshipAccessException("Prerequisite skill verification badge missing: Student identifier is missing.");
        }

        if (targetSkill == null || targetSkill.isBlank()) {
            return; // No specific prerequisite requested
        }

        boolean verified = isStudentVerifiedForSkill(studentId, targetSkill);
        if (!verified) {
            log.warn("Signal-Over-Noise Gatekeeping blocked student #{} for skill '{}'", studentId, targetSkill);
            throw new UnauthorizedMentorshipAccessException(
                    "Prerequisite skill verification badge missing.",
                    targetSkill
            );
        }

        log.info("Signal-Over-Noise Gatekeeping PASSED: student #{} is verified for skill '{}'", studentId, targetSkill);
    }

    /**
     * Returns true if student has achieved passing benchmark (score >= 7.0 / 10.0 or >= 70% and PASSED)
     * for target skill.
     */
    public boolean isStudentVerifiedForSkill(Long studentId, String targetSkill) {
        if (studentId == null || targetSkill == null || targetSkill.isBlank()) {
            return false;
        }

        String targetNorm = normalizeSkill(targetSkill);

        // 1. Check Assessment history
        List<Assessment> assessments = assessmentRepository.findByStudentId(studentId);
        for (Assessment a : assessments) {
            boolean isPassed = Boolean.TRUE.equals(a.getPassed()) || a.getStatus() == AssessmentStatus.PASSED;
            double score = a.getScore() != null ? a.getScore() : 0.0;
            // Benchmark: >= 7.0 out of 10.0 OR >= 70.0 out of 100.0
            boolean meetsBenchmark = (score >= 7.0 && score <= 10.0) || (score >= 70.0);

            if (isPassed && meetsBenchmark && a.getSkill() != null) {
                String assessmentSkillNorm = normalizeSkill(a.getSkill().getName());
                if (matchesSkill(assessmentSkillNorm, targetNorm)) {
                    return true;
                }
            }
        }

        // 2. Check StudentProfile verifiedSkills list
        Optional<StudentProfile> profileOpt = studentProfileRepository.findByUserId(studentId);
        if (profileOpt.isPresent() && profileOpt.get().getVerifiedSkills() != null) {
            for (String vs : profileOpt.get().getVerifiedSkills()) {
                if (matchesSkill(normalizeSkill(vs), targetNorm)) {
                    return true;
                }
            }
        }

        return false;
    }

    /**
     * Retrieves all verified skills for a student.
     */
    public Set<String> getStudentVerifiedSkills(Long studentId) {
        Set<String> verified = new LinkedHashSet<>();
        if (studentId == null) return verified;

        List<Assessment> assessments = assessmentRepository.findByStudentId(studentId);
        for (Assessment a : assessments) {
            boolean isPassed = Boolean.TRUE.equals(a.getPassed()) || a.getStatus() == AssessmentStatus.PASSED;
            double score = a.getScore() != null ? a.getScore() : 0.0;
            boolean meetsBenchmark = (score >= 7.0 && score <= 10.0) || (score >= 70.0);

            if (isPassed && meetsBenchmark && a.getSkill() != null) {
                verified.add(a.getSkill().getName());
            }
        }

        studentProfileRepository.findByUserId(studentId).ifPresent(p -> {
            if (p.getVerifiedSkills() != null) {
                verified.addAll(p.getVerifiedSkills());
            }
        });

        return verified;
    }

    private String normalizeSkill(String skill) {
        return skill.toLowerCase()
                .replaceAll("[^a-z0-9]", " ")
                .replaceAll("\\s+", " ")
                .trim();
    }

    private boolean matchesSkill(String skill1, String skill2) {
        if (skill1.equals(skill2) || skill1.contains(skill2) || skill2.contains(skill1)) {
            return true;
        }

        // Token match: if primary technical tokens overlap (e.g. "java", "spring", "python", "react", "sql")
        Set<String> tokens1 = new HashSet<>(Arrays.asList(skill1.split(" ")));
        Set<String> tokens2 = new HashSet<>(Arrays.asList(skill2.split(" ")));
        List<String> keyKeywords = List.of("java", "spring", "python", "react", "sql", "dsa", "algorithms", "redis", "docker", "microservices", "concurrency");

        for (String kw : keyKeywords) {
            if (tokens1.contains(kw) && tokens2.contains(kw)) {
                return true;
            }
        }

        return false;
    }
}
