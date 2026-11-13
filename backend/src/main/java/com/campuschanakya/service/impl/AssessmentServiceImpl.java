package com.campuschanakya.service.impl;

import com.campuschanakya.dto.*;
import com.campuschanakya.evaluator.*;
import com.campuschanakya.exception.AssessmentTerminatedException;
import com.campuschanakya.model.*;
import com.campuschanakya.repository.*;
import com.campuschanakya.service.AssessmentService;
import com.campuschanakya.service.RedemptionService;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Duration;
import java.time.LocalDateTime;
import java.util.*;

/**
 * ============================================================================
 * PRINCIPAL BACKEND & SECURITY ENGINE: ASSESSMENT & TELEMETRY MONITORING
 * ============================================================================
 * Adheres strictly to SOLID Principles & OOPJ:
 * 1. Single Responsibility: Encapsulates proctored lifecycle, telemetry gating, and grading.
 * 2. Open/Closed: Uses Strategy EvaluatorFactory for polymorphic evaluation extensions.
 * 3. Liskov Substitution & Interface Segregation: Fulfills clean AssessmentService contract.
 * 4. Dependency Inversion: Injects JPA abstractions rather than coupling to concrete datastores.
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class AssessmentServiceImpl implements AssessmentService {

    private final AssessmentRepository assessmentRepository;
    private final SkillRepository skillRepository;
    private final QuestionRepository questionRepository;
    private final UserRepository userRepository;
    private final StudentProfileRepository studentProfileRepository;
    private final EvaluatorFactory evaluatorFactory;
    private final RedemptionService redemptionService;
    private final com.campuschanakya.service.StudentTelemetryService studentTelemetryService;

    private static final int MAX_ALLOWED_STRIKES = 3;
    private static final double PASSING_SCORE_THRESHOLD = 7.0; // 7.0 / 10.0 (70%)
    private static final long GRACE_MARGIN_SECONDS = 60; // 60s network transmission grace margin

    @PostConstruct
    public void seedInitialDataIfEmpty() {
        // Seed Skills
        if (skillRepository.count() == 0) {
            log.info("Seeding foundational technical competency skills...");
            skillRepository.save(Skill.builder().name("Java OOP (Encapsulation, Inheritance, Polymorphism)").category("CORE_OOP").passingCutoff(70).build());
            skillRepository.save(Skill.builder().name("Spring Boot 3 & REST API Design").category("BACKEND").passingCutoff(70).build());
            skillRepository.save(Skill.builder().name("Data Structures & Algorithms in Java").category("CORE_CS").passingCutoff(70).build());
            skillRepository.save(Skill.builder().name("Database Systems & SQL Normalization").category("DATABASE").passingCutoff(70).build());
        }

        // Seed Objective Questions
        if (questionRepository.count() == 0) {
            log.info("Seeding objective viva question bank for anti-cheat assessment engine...");
            String oopSkill = "Java OOP (Encapsulation, Inheritance, Polymorphism)";

            questionRepository.save(Question.builder()
                    .skillName(oopSkill)
                    .questionText("Which of the following guarantees strict Encapsulation in Java?")
                    .optionA("Private fields with validated getters and setters enforcing domain invariants.")
                    .optionB("Public static variables accessible globally across all package classes.")
                    .optionC("Declaring all methods abstract inside an interface.")
                    .optionD("Creating deep multiple inheritance hierarchies.")
                    .correctAnswer("A")
                    .conceptTag("Encapsulation & Access Modifiers")
                    .difficulty("EASY")
                    .build());

            questionRepository.save(Question.builder()
                    .skillName(oopSkill)
                    .questionText("In runtime Polymorphism, which mechanism in the Java Virtual Machine resolves overridden methods?")
                    .optionA("Static bytecode linking at compile time.")
                    .optionB("Heap garbage collection sweep.")
                    .optionC("Virtual method table (vtable) dispatch based on actual runtime object type.")
                    .optionD("Thread-local stack memory swapping.")
                    .correctAnswer("C")
                    .conceptTag("Polymorphism & Dynamic Dispatch")
                    .difficulty("MEDIUM")
                    .build());

            questionRepository.save(Question.builder()
                    .skillName(oopSkill)
                    .questionText("What is the fundamental difference between an Abstract Class and an Interface in Java 17+?")
                    .optionA("Interfaces cannot contain default or static methods.")
                    .optionB("Abstract classes can hold state (instance fields) and constructors, whereas interfaces cannot.")
                    .optionC("A class can extend multiple abstract classes simultaneously.")
                    .optionD("Interfaces are deprecated in modern Spring Boot architectures.")
                    .correctAnswer("B")
                    .conceptTag("Abstraction & Interface Contracts")
                    .difficulty("MEDIUM")
                    .build());

            questionRepository.save(Question.builder()
                    .skillName(oopSkill)
                    .questionText("Which SOLID principle is directly breached when a subclass overrides a parent method by throwing an UnsupportedOperationException?")
                    .optionA("Single Responsibility Principle (SRP)")
                    .optionB("Open/Closed Principle (OCP)")
                    .optionC("Liskov Substitution Principle (LSP)")
                    .optionD("Interface Segregation Principle (ISP)")
                    .correctAnswer("C")
                    .conceptTag("Liskov Substitution Principle")
                    .difficulty("HARD")
                    .build());

            questionRepository.save(Question.builder()
                    .skillName(oopSkill)
                    .questionText("When a checked exception is thrown inside a subclass overridden method, what is the compiler rule in Java?")
                    .optionA("The subclass method can declare any new checked exception.")
                    .optionB("The subclass method cannot declare broader or new checked exceptions than the superclass method.")
                    .optionC("Exceptions are automatically converted to RuntimeException.")
                    .optionD("Checked exceptions are forbidden in overridden methods.")
                    .correctAnswer("B")
                    .conceptTag("Exception Propagation & Subtyping")
                    .difficulty("HARD")
                    .build());
        }
    }

    @Override
    @Transactional
    public Assessment startAssessment(Long studentId, String skillName) {
        User student = userRepository.findById(studentId)
                .orElseThrow(() -> new IllegalArgumentException("Student not found with ID: " + studentId));

        Skill skill = skillRepository.findByName(skillName)
                .orElseGet(() -> skillRepository.findAll().stream()
                        .findFirst()
                        .orElseThrow(() -> new IllegalStateException("No active skills configured in the platform.")));

        // Look for existing active IN_PROGRESS session
        List<Assessment> activeAssessments = assessmentRepository
                .findByStudentIdAndSkillNameAndStatus(studentId, skill.getName(), AssessmentStatus.IN_PROGRESS);

        if (!activeAssessments.isEmpty()) {
            Assessment existing = activeAssessments.get(0);
            // Verify session timer has not expired
            if (!existing.isTimeExceeded(GRACE_MARGIN_SECONDS) && !existing.isTerminated()) {
                log.info("Reconnecting student #{} to active assessment #{}", studentId, existing.getId());
                return existing;
            } else {
                existing.markTerminated("Session expired prior to completion.");
                assessmentRepository.save(existing);
            }
        }

        // Initialize fresh proctored session with server-side timer invariants
        Assessment newAssessment = Assessment.builder()
                .student(student)
                .skill(skill)
                .status(AssessmentStatus.IN_PROGRESS)
                .startTime(LocalDateTime.now())
                .maxAllowedDurationSeconds(900) // 15-minute standard proctored window
                .strikesCount(0)
                .pasteCount(0)
                .score(0.0)
                .passed(false)
                .feedback("Assessment session initialized. Anti-cheat telemetry monitoring active.")
                .build();

        log.info("Initiated proctored assessment session #{} for student #{} on skill '{}'",
                newAssessment.getId(), studentId, skill.getName());

        return assessmentRepository.save(newAssessment);
    }

    @Override
    @Transactional
    public Assessment recordTelemetryStrike(TelemetryReportDto report) {
        Assessment assessment = assessmentRepository.findById(report.getAssessmentId())
                .orElseThrow(() -> new IllegalArgumentException("Assessment session not found with ID: " + report.getAssessmentId()));

        if (assessment.isTerminated()) {
            throw new AssessmentTerminatedException(assessment.getId(), assessment.getStrikesCount(),
                    "Assessment session has already been TERMINATED due to anti-cheat policy violations.");
        }

        if (assessment.getStatus() != AssessmentStatus.IN_PROGRESS) {
            throw new IllegalStateException("Assessment is not in an active progress state. Current status: " + assessment.getStatus());
        }

        log.warn("ANTI-CHEAT TELEMETRY DETECTED: Assessment #{} - Event: {} at timestamp {}",
                assessment.getId(), report.getEventType(), report.getTimestamp());

        // Process violation vector
        if (report.getEventType() == TelemetryEventType.PASTE_BURST) {
            assessment.registerPaste();
        } else {
            assessment.registerStrike();
        }

        // Enforce hard threshold: if strikes >= 3, flag terminated and throw 403 exception
        if (assessment.getStrikesCount() >= MAX_ALLOWED_STRIKES || assessment.isTerminated()) {
            assessment.markTerminated(String.format(
                    "Anti-cheat violation: Exceeded maximum allowed strike threshold (%d/%d strikes logged across blur, fullscreen exits, or tab switches). Assessment TERMINATED. Score recorded as 0.0.",
                    assessment.getStrikesCount(), MAX_ALLOWED_STRIKES
            ));
            assessmentRepository.save(assessment);

            throw new AssessmentTerminatedException(assessment.getId(), assessment.getStrikesCount(),
                    assessment.getFeedback());
        }

        return assessmentRepository.save(assessment);
    }

    @Override
    @Transactional
    public AssessmentResultResponse submitAssessment(AssessmentSubmitRequest request) {
        Assessment assessment = assessmentRepository.findById(request.getAssessmentId())
                .orElseThrow(() -> new IllegalArgumentException("Assessment not found with ID: " + request.getAssessmentId()));

        // Invariant 1: Terminated sessions are rejected with 403
        if (assessment.isTerminated()) {
            throw new AssessmentTerminatedException(assessment.getId(), assessment.getStrikesCount(),
                    "Submission rejected: Assessment session was TERMINATED due to anti-cheat integrity violations. Score = 0.0.");
        }

        // Invariant 2: Session must be active
        if (assessment.getStatus() != AssessmentStatus.IN_PROGRESS) {
            throw new IllegalStateException("Assessment session is already finalized. Current state: " + assessment.getStatus());
        }

        long elapsedSeconds = Duration.between(assessment.getStartTime(), LocalDateTime.now()).getSeconds();

        // Invariant 3: Server-side duration validation (detects client timer freeze attacks)
        if (assessment.isTimeExceeded(GRACE_MARGIN_SECONDS)) {
            assessment.markTerminated(String.format(
                    "Submission rejected: Server-side integrity breach. Elapsed session duration (%d seconds) exceeded limit (%d seconds + %d grace).",
                    elapsedSeconds, assessment.getMaxAllowedDurationSeconds(), GRACE_MARGIN_SECONDS
            ));
            assessmentRepository.save(assessment);

            return AssessmentResultResponse.builder()
                    .assessmentId(assessment.getId())
                    .score(0.0)
                    .status(AssessmentStatus.TERMINATED)
                    .totalStrikes(assessment.getStrikesCount())
                    .feedbackMessage(assessment.getFeedback())
                    .weakTopics(List.of("Time Management", "Integrity Breach"))
                    .verifiedBadgeAwarded(false)
                    .elapsedSeconds(elapsedSeconds)
                    .build();
        }

        // Retrieve skill questions
        List<Question> questions = questionRepository.findBySkillName(assessment.getSkill().getName());
        if (questions.isEmpty()) {
            questions = questionRepository.findAll();
        }

        int totalQuestions = Math.max(questions.size(), 1);
        int correctCount = 0;
        Set<String> weakTopics = new LinkedHashSet<>();
        Map<Long, String> submittedAnswers = request.getQuestionAnswers() != null ? request.getQuestionAnswers() : Collections.emptyMap();

        for (Question q : questions) {
            String selected = submittedAnswers.get(q.getId());
            if (selected != null && selected.equalsIgnoreCase(q.getCorrectAnswer())) {
                correctCount++;
            } else {
                weakTopics.add(q.getConceptTag());
            }
        }

        // Raw score calculated out of 10.0
        double rawScore = ((double) correctCount / totalQuestions) * 10.0;

        // Apply penalty for strikes logged (e.g. 0.5 per strike below threshold)
        double strikePenalty = (assessment.getStrikesCount() != null ? assessment.getStrikesCount() : 0) * 0.5;
        double finalScore = Math.max(0.0, rawScore - strikePenalty);
        finalScore = Math.round(finalScore * 10.0) / 10.0;

        boolean passed = finalScore >= PASSING_SCORE_THRESHOLD;
        String weakTopicsCsv = String.join(",", weakTopics);

        if (passed) {
            // Benchmark passed: award verified badge
            String feedback = String.format(
                    "Proficiency verified! Scored %.1f / 10.0 against benchmark %.1f. Student verified skill badge awarded.",
                    finalScore, PASSING_SCORE_THRESHOLD
            );
            assessment.complete(finalScore, true, weakTopicsCsv, feedback);

            // Automatically update student verified skills on profile
            studentProfileRepository.findByUser(assessment.getStudent()).ifPresent(profile -> {
                if (!profile.getVerifiedSkills().contains(assessment.getSkill().getName())) {
                    profile.getVerifiedSkills().add(assessment.getSkill().getName());
                    studentProfileRepository.save(profile);
                    log.info("Student #{} verified skill badge unlocked for '{}'", assessment.getStudent().getId(), assessment.getSkill().getName());
                }
            });
        } else {
            // Benchmark unmet: prepare diagnostic input for AI Remediation
            String feedback = String.format(
                    "Benchmark unmet. Scored %.1f / 10.0 (Required >= %.1f). Assessment flagged for AI Remediation.",
                    finalScore, PASSING_SCORE_THRESHOLD
            );
            assessment.complete(finalScore, false, weakTopicsCsv, feedback);

            // Automatically generate AI 3-day recovery roadmap
            redemptionService.generateRedemptionPlan(assessment);
            log.info("Assessment #{} flagged as REMEDIATION_READY. Weak topics: {}", assessment.getId(), weakTopicsCsv);
        }

        Assessment saved = assessmentRepository.save(assessment);
        try {
            studentTelemetryService.recordAssessmentTelemetry(saved.getStudent(), saved);
        } catch (Exception e) {
            log.warn("Telemetry update exception: {}", e.getMessage());
        }

        return AssessmentResultResponse.builder()
                .assessmentId(assessment.getId())
                .score(finalScore)
                .status(assessment.getStatus())
                .totalStrikes(assessment.getStrikesCount())
                .feedbackMessage(assessment.getFeedback())
                .weakTopics(new ArrayList<>(weakTopics))
                .verifiedBadgeAwarded(passed)
                .elapsedSeconds(elapsedSeconds)
                .build();
    }

    @Override
    public Assessment getAssessmentStatus(Long assessmentId) {
        return assessmentRepository.findById(assessmentId)
                .orElseThrow(() -> new IllegalArgumentException("Assessment not found with ID: " + assessmentId));
    }

    @Override
    public List<Skill> getAllAvailableSkills() {
        return skillRepository.findAll();
    }

    @Override
    public List<Assessment> getStudentAssessments(Long studentId) {
        return assessmentRepository.findByStudentId(studentId);
    }

    // ========================================================================
    // BACKWARD COMPATIBILITY BRIDGES
    // ========================================================================

    @Override
    @Transactional
    public EvaluationResult submitAssessment(Long userId, AssessmentSubmit submitDto) {
        User student = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("Student not found: " + userId));
        Skill skill = skillRepository.findById(submitDto.getSkillId())
                .orElseThrow(() -> new IllegalArgumentException("Skill not found: " + submitDto.getSkillId()));

        SkillEvaluator evaluator = evaluatorFactory.getEvaluator(submitDto.getEvaluationType());

        SubmissionDto submission = SubmissionDto.builder()
                .submissionType(submitDto.getEvaluationType())
                .skillId(skill.getId())
                .skillName(skill.getName())
                .cutoffPercentage(skill.getPassingCutoff())
                .answers(submitDto.getAnswers())
                .sourceCode(submitDto.getSourceCode())
                .build();

        EvaluationResult result = evaluator.evaluate(submission);
        int strikes = submitDto.getStrikesCount() != null ? submitDto.getStrikesCount() : 0;

        Assessment assessment = Assessment.builder()
                .student(student)
                .skill(skill)
                .startTime(LocalDateTime.now().minusMinutes(5))
                .endTime(LocalDateTime.now())
                .score(result.getScore() / 10.0) // Scale to 10.0
                .strikesCount(strikes)
                .passed(result.getPassed())
                .status(result.getPassed() ? AssessmentStatus.PASSED : AssessmentStatus.REMEDIATION_READY)
                .weakTopicsCsv(String.join(",", result.getWeakTopics()))
                .feedback(result.getFeedback())
                .build();

        assessmentRepository.save(assessment);
        if (result.getPassed()) {
            studentProfileRepository.findByUser(student).ifPresent(p -> {
                if (!p.getVerifiedSkills().contains(skill.getName())) {
                    p.getVerifiedSkills().add(skill.getName());
                    studentProfileRepository.save(p);
                }
            });
        }
        return result;
    }

    @Override
    public void logStrike(StrikeReport strikeReport) {
        log.warn("Legacy strike logger called for assessment #{}: {}", strikeReport.getAssessmentId(), strikeReport.getViolationType());
    }
}
