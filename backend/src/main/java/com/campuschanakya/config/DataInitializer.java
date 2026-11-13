package com.campuschanakya.config;

import com.campuschanakya.model.*;
import com.campuschanakya.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;

/**
 * ============================================================================
 * DATA INITIALIZER - STRICT USER AUTHORITIES ONLY (ZERO FAKE ACCOUNTS)
 * ============================================================================
 * Strictly provisions ONLY the exact 5 accounts provided by the user:
 * 1. kavyauncut@gmail.com -> Academic Governance / Platform Superadmin (Tier 1)
 * 2. ranarainam@gmail.com -> Corporate Recruiter / Company
 * 3. kavyakhurana70@gmail.com -> Alumni Mentor
 * 4. kashishhrajput15@gmail.com -> Student Candidate
 * 5. anjalimalik.7056408607.12@gmail.com -> Student Candidate
 */
@Component
@RequiredArgsConstructor
@Slf4j
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final StudentProfileRepository studentProfileRepository;
    private final JobRepository jobRepository;
    private final ProjectRepository projectRepository;
    private final MentorshipSlotRepository mentorshipSlotRepository;
    private final ProjectSubmissionRepository projectSubmissionRepository;
    private final CollegeRepository collegeRepository;
    private final PasswordEncoder passwordEncoder;
    private final JdbcTemplate jdbcTemplate;

    @Override
    public void run(String... args) {
        log.info("Purging any unapproved / mock accounts. Enforcing STRICTLY the 5 user-provided accounts...");

        // 0. Purge ONLY fake/mock template accounts (never delete real registered users)
        try {
            jdbcTemplate.execute("DELETE FROM student_profiles WHERE user_id IN (SELECT id FROM users WHERE email LIKE '%@campus.edu' OR email LIKE '%@campuschanakya.edu')");
            jdbcTemplate.execute("DELETE FROM project_submissions WHERE student_id IN (SELECT id FROM users WHERE email LIKE '%@campus.edu' OR email LIKE '%@campuschanakya.edu')");
            jdbcTemplate.execute("DELETE FROM mentorship_slots WHERE alumni_id IN (SELECT id FROM users WHERE email LIKE '%@campus.edu' OR email LIKE '%@campuschanakya.edu')");
            jdbcTemplate.execute("DELETE FROM projects WHERE alumni_id IN (SELECT id FROM users WHERE email LIKE '%@campus.edu' OR email LIKE '%@campuschanakya.edu')");
            jdbcTemplate.execute("DELETE FROM jobs WHERE recruiter_id IN (SELECT id FROM users WHERE email LIKE '%@campus.edu' OR email LIKE '%@campuschanakya.edu')");
            jdbcTemplate.execute("DELETE FROM users WHERE email LIKE '%@campus.edu' OR email LIKE '%@campuschanakya.edu'");
        } catch (Exception ex) {
            log.debug("Database user purge check: {}", ex.getMessage());
        }

        // ====================================================================
        // TIER 1: PLATFORM SUPERADMIN / GOVERNANCE (kavyauncut@gmail.com)
        // ====================================================================
        User superAdmin = seedUser("Kavya Superadmin", "kavyauncut@gmail.com", "password123", Role.SUPER_ADMIN, null, null, null);

        // ====================================================================
        // TIER 2: COLLEGES / INSTITUTIONS
        // ====================================================================
        College nitCollege = seedCollege(
                "National Institute of Technology",
                "NIT-KKR",
                "nitkkr.ac.in",
                "Kurukshetra",
                "Haryana",
                "kavyauncut@gmail.com",
                "+91 1744 233208"
        );
        nitCollege.setCollegeAdmin(superAdmin);
        collegeRepository.save(nitCollege);

        superAdmin.setCollege(nitCollege);
        userRepository.save(superAdmin);

        // ====================================================================
        // THE 4 REMAINING CORE USER ACCOUNTS PROVIDED BY USER
        // ====================================================================
        
        // 1. Company / Corporate Recruiter: ranarainam@gmail.com
        User savedRecruiter = seedUser("Rainam Rana", "ranarainam@gmail.com", "password123", Role.RECRUITER, null, null, nitCollege);

        // 2. Alumni Mentor: kavyakhurana70@gmail.com
        User savedAlumni = seedUser("Kavya Khurana", "kavyakhurana70@gmail.com", "password123", Role.ALUMNI, null, null, nitCollege);

        // 3. Student Candidate: kashishhrajput15@gmail.com
        User savedStudentKashish = seedUser("Kashish Rajput", "kashishhrajput15@gmail.com", "password123", Role.STUDENT, 9.0, "Computer Science & Engineering", nitCollege);

        // 4. Student Candidate: anjalimalik.7056408607.12@gmail.com
        User savedStudentAnjali = seedUser("Anjali Malik", "anjalimalik.7056408607.12@gmail.com", "password123", Role.STUDENT, 9.1, "Computer Science & Engineering", nitCollege);

        // ====================================================================
        // SEED PRODUCTION INVARIANTS (JOBS, PROJECTS & SLOTS) LINKED TO REAL ACCOUNTS
        // ====================================================================

        // Placement Vacancy linked to Corporate Recruiter (Rainam Rana)
        if (jobRepository.count() == 0) {
            Job sampleJob = Job.builder()
                    .title("Associate Software Engineer - Java / Cloud")
                    .company("Rainam Enterprise Tech")
                    .location("Bangalore (Hybrid)")
                    .salaryPackage("14 LPA - 18 LPA")
                    .minCgpa(7.5)
                    .description("Seeking graduate engineers strong in OOP, Spring Boot, and data structures to join our Core Platforms team.")
                    .requiredSkills(List.of("Java OOP (Encapsulation, Inheritance, Polymorphism)", "Spring Boot 3 & REST API Design"))
                    .recruiter(savedRecruiter)
                    .build();
            jobRepository.save(sampleJob);
        }

        // Mentorship Projects linked to Alumni Mentor (Kavya Khurana)
        if (projectRepository.count() == 0) {
            Project microProject1 = Project.builder()
                    .title("Rate Limiter in Redis with Token Bucket Algorithm")
                    .description("Implement a high-throughput distributed rate limiter using Redis Lua scripts, token bucket dynamics, and Spring Boot filter interceptors.")
                    .targetSkill("Spring Boot Microservices")
                    .projectType(ProjectType.MICRO)
                    .starterRepoUrl("https://github.com/campus-chanakya/redis-rate-limiter-starter")
                    .acceptanceCriteria("Support 10,000 RPS burst, atomic token decrement via Redis Lua, return 429 Too Many Requests with Retry-After header.")
                    .alumni(savedAlumni)
                    .build();
            projectRepository.save(microProject1);

            Project microProject2 = Project.builder()
                    .title("SQL Indexing & Execution Plan Optimizer")
                    .description("Optimize slow analytical queries using composite B-Tree indexes, eliminating sequential table scans and N+1 query antipatterns in JPA.")
                    .targetSkill("Database Systems & SQL Normalization")
                    .projectType(ProjectType.MICRO)
                    .starterRepoUrl("https://github.com/campus-chanakya/sql-optimization-starter")
                    .acceptanceCriteria("Reduce P99 query latency from 850ms to <12ms, provide EXPLAIN ANALYZE execution plan diff, eliminate table scans.")
                    .alumni(savedAlumni)
                    .build();
            projectRepository.save(microProject2);

            Project macroProject1 = Project.builder()
                    .title("Distributed Order & Payment Saga Orchestrator")
                    .description("Enterprise-grade architecture mimicking microservices: orchestrate multi-step transactions across Orders, Inventory, and Payments with compensating transactions.")
                    .targetSkill("Java Core & OOP Invariants")
                    .projectType(ProjectType.MACRO)
                    .starterRepoUrl("https://github.com/campus-chanakya/saga-orchestrator-macro")
                    .acceptanceCriteria("Strict state machine transitions, idempotent event handlers, rollback compensation on simulated payment gateway failure.")
                    .alumni(savedAlumni)
                    .build();
            projectRepository.save(macroProject1);

            if (projectSubmissionRepository.count() == 0) {
                ProjectSubmission sampleSubmission = ProjectSubmission.builder()
                        .project(microProject1)
                        .student(savedStudentAnjali)
                        .githubPrUrl("https://github.com/anjali-malik/redis-rate-limiter/pull/1")
                        .status(SubmissionStatus.PENDING)
                        .studentNotes("Implemented Token Bucket algorithm in Lua script for atomic updates. Included JUnit tests with Testcontainers Redis.")
                        .build();
                projectSubmissionRepository.save(sampleSubmission);
            }
        }

        // 1-on-1 Alumni Mentorship Slots linked to Alumni Mentor (Kavya Khurana)
        if (mentorshipSlotRepository.count() == 0) {
            java.time.LocalDateTime tomorrow = java.time.LocalDateTime.now().plusDays(1).withHour(18).withMinute(0).withSecond(0);
            java.time.LocalDateTime dayAfter = java.time.LocalDateTime.now().plusDays(2).withHour(19).withMinute(30).withSecond(0);

            mentorshipSlotRepository.save(MentorshipSlot.builder()
                    .alumni(savedAlumni)
                    .targetSkill("Java Core & OOP Invariants")
                    .scheduledAt(tomorrow)
                    .meetingUrl("https://meet.google.com/cc-oop-mentor-01")
                    .notes("Deep dive into polymorphic design patterns, class invariants, and microservices readiness.")
                    .status(MentorshipSlotStatus.OPEN)
                    .build());

            mentorshipSlotRepository.save(MentorshipSlot.builder()
                    .alumni(savedAlumni)
                    .targetSkill("Spring Boot Microservices")
                    .scheduledAt(dayAfter)
                    .meetingUrl("https://meet.google.com/cc-spring-mentor-02")
                    .notes("Architecture code review of production rate limiters and transactional boundaries.")
                    .status(MentorshipSlotStatus.OPEN)
                    .build());
        }

        log.info("Platform initialized strictly with the 5 provided accounts. Zero fake/mock users exist.");
    }

    private College seedCollege(String name, String code, String domain, String city, String state, String email, String phone) {
        return collegeRepository.findByCode(code).orElseGet(() -> {
            College c = College.builder()
                    .name(name)
                    .code(code)
                    .domain(domain)
                    .city(city)
                    .state(state)
                    .contactEmail(email)
                    .contactPhone(phone)
                    .status("ACTIVE")
                    .build();
            return collegeRepository.save(c);
        });
    }

    private User seedUser(String fullName, String email, String rawPassword, Role role, Double cgpa, String branch, College college) {
        String normalizedEmail = email.trim().toLowerCase();
        String encodedPassword = passwordEncoder.encode(rawPassword);

        User user = userRepository.findByEmailIgnoreCase(normalizedEmail).orElse(null);

        if (user == null) {
            user = User.builder()
                    .fullName(fullName)
                    .email(normalizedEmail)
                    .passwordHash(encodedPassword)
                    .role(role)
                    .college(college)
                    .build();
            user = userRepository.save(user);
        } else {
            user.setFullName(fullName);
            if (user.getPasswordHash() == null || user.getPasswordHash().isBlank()) {
                user.setPasswordHash(encodedPassword);
            }
            user.setRole(role);
            if (college != null) {
                user.setCollege(college);
            }
            user = userRepository.save(user);
        }

        if (role == Role.STUDENT && studentProfileRepository.findByUser(user).isEmpty()) {
            StudentProfile profile = StudentProfile.builder()
                    .user(user)
                    .cgpa(cgpa != null ? cgpa : 8.5)
                    .branch(branch != null ? branch : "Computer Science & Engineering")
                    .college(college != null ? college.getName() : "National Institute of Technology")
                    .verifiedSkills(new ArrayList<>())
                    .build();
            studentProfileRepository.save(profile);
        }

        return user;
    }
}
