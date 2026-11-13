package com.campuschanakya.controller;

import com.campuschanakya.model.Assessment;
import com.campuschanakya.model.RedemptionPlan;
import com.campuschanakya.model.StudentProfile;
import com.campuschanakya.model.User;
import com.campuschanakya.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.io.File;
import java.util.*;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
public class AdminController {

    private final UserRepository userRepository;
    private final AssessmentRepository assessmentRepository;
    private final JobRepository jobRepository;
    private final StudentProfileRepository profileRepository;
    private final RedemptionPlanRepository redemptionRepository;
    private final CollegeRepository collegeRepository;

    @GetMapping("/metrics")
    public ResponseEntity<Map<String, Object>> getAdminMetrics() {
        long totalUsers = userRepository.count();
        long totalColleges = collegeRepository.count();
        List<Assessment> assessments = assessmentRepository.findAll();
        long passedAssessments = assessments.stream().filter(a -> Boolean.TRUE.equals(a.getPassed())).count();
        long activePlacements = jobRepository.count();
        
        double passRate = assessments.isEmpty() ? 0.0 : Math.round(((double) passedAssessments / assessments.size()) * 1000.0) / 10.0;
        int totalStrikes = assessments.stream().mapToInt(a -> a.getStrikesCount() != null ? a.getStrikesCount() : 0).sum();

        List<RedemptionPlan> redemptions = redemptionRepository.findAll();
        long completedRedemptions = redemptions.stream().filter(r -> Boolean.TRUE.equals(r.getCompleted())).count();
        double redemptionRate = redemptions.isEmpty() ? 0.0 : Math.round(((double) completedRedemptions / redemptions.size()) * 1000.0) / 10.0;

        String dbSize = "1.2 MB";
        try {
            File dbFile = new File("./data/campus_chanakya.mv.db");
            if (!dbFile.exists()) {
                dbFile = new File("./data/campuschanakya.mv.db");
            }
            if (dbFile.exists()) {
                dbSize = String.format("%.1f MB", dbFile.length() / (1024.0 * 1024.0));
            }
        } catch (Exception ignored) {}

        Map<String, Object> stats = new HashMap<>();
        stats.put("totalUsers", totalUsers);
        stats.put("totalColleges", totalColleges);
        stats.put("verifiedSkills", passedAssessments);
        stats.put("activePlacements", activePlacements);
        stats.put("avgPassRate", passRate);
        stats.put("antiCheatStrikesTotal", totalStrikes);
        stats.put("h2DbSize", dbSize);
        stats.put("activeConnections", 1);
        stats.put("redemptionRate", redemptionRate + "%");

        return ResponseEntity.ok(stats);
    }

    @GetMapping("/users")
    public ResponseEntity<List<Map<String, Object>>> getAdminUsers() {
        List<User> users = userRepository.findAll();
        List<Map<String, Object>> result = new ArrayList<>();

        for (User u : users) {
            Map<String, Object> map = new HashMap<>();
            map.put("id", u.getId());
            map.put("name", u.getFullName() != null ? u.getFullName() : "User #" + u.getId());
            map.put("email", u.getEmail());
            map.put("role", u.getRole() != null ? u.getRole().name() : "STUDENT");
            map.put("department", "Engineering");
            map.put("status", "ACTIVE");

            if (u.getCollege() != null) {
                map.put("college", u.getCollege().getName());
                map.put("collegeCode", u.getCollege().getCode());
            } else {
                map.put("college", "National Institute of Technology");
                map.put("collegeCode", "NIT-KKR");
            }

            if (u.getRole() == com.campuschanakya.model.Role.STUDENT) {
                StudentProfile prof = profileRepository.findByUser(u)
                        .or(() -> profileRepository.findByUserId(u.getId()))
                        .orElse(null);
                double cgpa = prof != null && prof.getCgpa() != null ? prof.getCgpa() : 0.0;
                map.put("score", cgpa > 0 ? cgpa + " CGPA" : "0.0 CGPA");
            } else if (u.getRole() == com.campuschanakya.model.Role.ALUMNI) {
                map.put("score", "Verified Mentor");
            } else if (u.getRole() == com.campuschanakya.model.Role.RECRUITER) {
                long jobCount = jobRepository.count();
                map.put("score", jobCount + " Postings");
            } else if (u.getRole() == com.campuschanakya.model.Role.SUPER_ADMIN) {
                map.put("score", "Platform Superadmin");
            } else {
                map.put("score", "College Administrator");
            }

            result.add(map);
        }

        return ResponseEntity.ok(result);
    }

    @GetMapping("/audit-logs")
    public ResponseEntity<List<Map<String, Object>>> getAuditLogs() {
        List<Assessment> assessments = assessmentRepository.findAll();
        List<Map<String, Object>> logs = new ArrayList<>();

        for (Assessment a : assessments) {
            Map<String, Object> log = new HashMap<>();
            log.put("id", a.getId());
            log.put("studentName", a.getStudent() != null ? a.getStudent().getFullName() : "Candidate #" + a.getId());
            log.put("studentEmail", a.getStudent() != null ? a.getStudent().getEmail() : "");
            log.put("skill", a.getSkill() != null ? a.getSkill().getName() : "Technical Assessment");
            log.put("score", a.getScore() != null ? a.getScore() : 0.0);
            log.put("passed", Boolean.TRUE.equals(a.getPassed()));
            log.put("strikes", a.getStrikesCount() != null ? a.getStrikesCount() : 0);
            log.put("timestamp", a.getCreatedAt() != null ? a.getCreatedAt().toString() : "Recent");
            logs.add(log);
        }

        return ResponseEntity.ok(logs);
    }
}
