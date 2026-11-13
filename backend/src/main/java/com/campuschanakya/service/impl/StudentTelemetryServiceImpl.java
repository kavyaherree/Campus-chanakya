package com.campuschanakya.service.impl;

import com.campuschanakya.model.Assessment;
import com.campuschanakya.model.StudentProfile;
import com.campuschanakya.model.User;
import com.campuschanakya.repository.AssessmentRepository;
import com.campuschanakya.repository.StudentProfileRepository;
import com.campuschanakya.service.StudentTelemetryService;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.*;

@Service
@RequiredArgsConstructor
@Slf4j
public class StudentTelemetryServiceImpl implements StudentTelemetryService {

    private final AssessmentRepository assessmentRepository;
    private final StudentProfileRepository studentProfileRepository;
    private final ObjectMapper objectMapper = new ObjectMapper();

    @Override
    @Transactional
    public StudentProfile recordAssessmentTelemetry(User student, Assessment assessment) {
        log.info("Recording assessment telemetry in database for student #{}, assessment #{}", student.getId(), assessment.getId());
        return recomputeTelemetry(student);
    }

    @Override
    @Transactional
    public StudentProfile recomputeTelemetry(User student) {
        List<Assessment> assessments = assessmentRepository.findByStudentId(student.getId());

        int totalTaken = assessments.size();
        int totalPassed = (int) assessments.stream().filter(a -> Boolean.TRUE.equals(a.getPassed())).count();
        double avgScore = assessments.stream().mapToDouble(a -> a.getScore() != null ? a.getScore() : 0.0).average().orElse(0.0);
        int totalStrikes = assessments.stream().mapToInt(a -> a.getStrikesCount() != null ? a.getStrikesCount() : 0).sum();

        // Topic Aggregator: topicName -> Map<String, Object>
        Map<String, TopicDeficitAccumulator> topicMap = new LinkedHashMap<>();

        for (Assessment a : assessments) {
            String csv = a.getWeakTopicsCsv();
            double score = a.getScore() != null ? a.getScore() : 0.0;
            String timestamp = a.getEndTime() != null
                    ? a.getEndTime().format(DateTimeFormatter.ISO_LOCAL_DATE_TIME)
                    : (a.getCreatedAt() != null ? a.getCreatedAt().format(DateTimeFormatter.ISO_LOCAL_DATE_TIME) : LocalDateTime.now().format(DateTimeFormatter.ISO_LOCAL_DATE_TIME));
            String skillName = a.getSkill() != null ? a.getSkill().getName() : "Technical Assessment";

            if (csv != null && !csv.isBlank()) {
                String[] tokens = csv.split("[,;]");
                for (String t : tokens) {
                    String clean = t.trim().replaceAll("^[\\-\\*\\s]+", "");
                    if (clean.length() >= 3 && !clean.equalsIgnoreCase("none") && !clean.equalsIgnoreCase("n/a")) {
                        String normalized = normalizeTopic(clean, skillName);
                        topicMap.computeIfAbsent(normalized, k -> new TopicDeficitAccumulator(k, skillName))
                                .recordOccurrence(score, clean, timestamp);
                    }
                }
            } else if (!Boolean.TRUE.equals(a.getPassed())) {
                // If failed without explicit topics, record the skill itself as weak
                String normalized = normalizeTopic(skillName, skillName);
                topicMap.computeIfAbsent(normalized, k -> new TopicDeficitAccumulator(k, skillName))
                        .recordOccurrence(score, "General proficiency benchmark unmet (" + score + "%)", timestamp);
            }
        }

        // Build structured repeated error list
        List<Map<String, Object>> repeatedErrors = new ArrayList<>();
        List<TopicDeficitAccumulator> sorted = new ArrayList<>(topicMap.values());
        // Sort descending by occurrence count
        sorted.sort((x, y) -> Integer.compare(y.count, x.count));

        for (TopicDeficitAccumulator acc : sorted) {
            Map<String, Object> item = new HashMap<>();
            boolean isCritical = acc.count >= 2;
            item.put("topic", acc.topicName);
            item.put("occurrences", acc.count);
            item.put("severity", isCritical ? "CRITICAL_REPEATED_ERROR" : "ACTIVE_WATCHLIST");
            item.put("status", isCritical ? "RECURRING_DEFICIT" : "NEEDS_OBSERVATION");
            item.put("lastRecordedScore", Math.round(acc.lastScore * 10.0) / 10.0);
            item.put("lowestScore", Math.round(acc.lowestScore * 10.0) / 10.0);
            item.put("lastDetectedAt", acc.lastDetectedAt);
            item.put("associatedSkill", acc.associatedSkill);
            item.put("remedialAdvice", resolveRemedialAdvice(acc.topicName));
            item.put("diagnosticSampleTips", acc.sampleTips.stream().limit(3).toList());
            repeatedErrors.add(item);
        }

        String json = "[]";
        try {
            json = objectMapper.writeValueAsString(repeatedErrors);
        } catch (Exception e) {
            log.error("Failed to serialize repeated errors to JSON", e);
        }

        StudentProfile profile = studentProfileRepository.findByUser(student)
                .or(() -> studentProfileRepository.findByUserId(student.getId()))
                .orElseGet(() -> studentProfileRepository.save(StudentProfile.builder()
                        .user(student)
                        .cgpa(0.0)
                        .branch("Computer Science & Engineering")
                        .verifiedSkills(new ArrayList<>())
                        .build()));

        profile.setRepeatedErrorsJson(json);
        profile.setAverageAssessmentScore(Math.round(avgScore * 10.0) / 10.0);
        profile.setTotalAssessmentsTaken(totalTaken);
        profile.setTotalAssessmentsPassed(totalPassed);
        profile.setTotalStrikesRecorded(totalStrikes);

        // Also add any newly passed skills
        if (profile.getVerifiedSkills() == null) {
            profile.setVerifiedSkills(new ArrayList<>());
        }
        for (Assessment a : assessments) {
            if (Boolean.TRUE.equals(a.getPassed()) && a.getSkill() != null) {
                String sName = a.getSkill().getName();
                if (!profile.getVerifiedSkills().contains(sName)) {
                    profile.getVerifiedSkills().add(sName);
                }
            }
        }

        StudentProfile saved = studentProfileRepository.save(profile);
        log.info("Student #{} database telemetry updated: avgScore={}%, totalTaken={}, passed={}, repeatedErrors={}",
                student.getId(), saved.getAverageAssessmentScore(), saved.getTotalAssessmentsTaken(),
                saved.getTotalAssessmentsPassed(), repeatedErrors.size());
        return saved;
    }

    private String normalizeTopic(String rawTopic, String contextSkill) {
        String lower = rawTopic.toLowerCase();
        if (lower.contains("polymorph") || lower.contains("dynamic dispatch") || lower.contains("vtable") || lower.contains("virtual")) {
            return "Polymorphism & Dynamic Dispatch Mechanics";
        }
        if (lower.contains("encapsulat") || lower.contains("private final") || lower.contains("state invariant")) {
            return "Encapsulation & Domain Invariant Protection";
        }
        if (lower.contains("concurren") || lower.contains("thread") || lower.contains("volatile") || lower.contains("cas") || lower.contains("race")) {
            return "Thread Concurrency & Memory Barrier Invariants";
        }
        if (lower.contains("spring") || lower.contains("stateless") || lower.contains("jwt") || lower.contains("transaction") || lower.contains("rollback")) {
            return "Spring Boot Architecture & Transactional Semantics";
        }
        if (lower.contains("dsa") || lower.contains("binary search") || lower.contains("graph") || lower.contains("cycle") || lower.contains("dp")) {
            return "Algorithmic Invariants & Boundary Conditions";
        }
        if (lower.contains("greeting") || lower.contains("trivial") || lower.contains("irrelevant") || lower.contains("did not address")) {
            return "Technical Articulation & Viva Non-responsiveness";
        }
        if (lower.contains("latency") || lower.contains("memory") || lower.contains("garbage") || lower.contains("heap")) {
            return "System Performance, Latency & JVM Memory Models";
        }
        if (rawTopic.length() > 45) {
            return rawTopic.substring(0, 42).trim() + "...";
        }
        return rawTopic.trim();
    }

    private String resolveRemedialAdvice(String topic) {
        String lower = topic.toLowerCase();
        if (lower.contains("polymorph")) {
            return "Review JVM vtable lookup, compile-time vs runtime binding, and polymorphic strategy interfaces.";
        }
        if (lower.contains("encapsulat")) {
            return "Enforce private final fields, defensive copying in getters, and constructor parameter validation.";
        }
        if (lower.contains("concurren")) {
            return "Use Atomic CAS references, avoid uncoordinated state mutations, and specify strict global lock ordering.";
        }
        if (lower.contains("spring")) {
            return "Ensure @Transactional specifies rollbackFor = Exception.class and isolate JWT authentication in stateless filters.";
        }
        if (lower.contains("algorithmic")) {
            return "Derive boundary invariants explicitly (e.g. low + (high - low) / 2) to prevent arithmetic overflow and off-by-one loops.";
        }
        if (lower.contains("articulation") || lower.contains("viva")) {
            return "Directly answer technical prompts with runtime models, concrete code signatures, and quantifiable latency trade-offs.";
        }
        return "Complete targeted practice questions in the Remediation Sandbox and verify core runtime mechanics.";
    }

    private static class TopicDeficitAccumulator {
        final String topicName;
        final String associatedSkill;
        int count = 0;
        double lowestScore = 100.0;
        double lastScore = 0.0;
        String lastDetectedAt = "";
        final List<String> sampleTips = new ArrayList<>();

        TopicDeficitAccumulator(String topicName, String associatedSkill) {
            this.topicName = topicName;
            this.associatedSkill = associatedSkill;
        }

        void recordOccurrence(double score, String tip, String timestamp) {
            count++;
            lastScore = score;
            if (score < lowestScore) {
                lowestScore = score;
            }
            lastDetectedAt = timestamp;
            if (tip != null && !tip.isBlank() && !sampleTips.contains(tip)) {
                sampleTips.add(tip);
            }
        }
    }
}
