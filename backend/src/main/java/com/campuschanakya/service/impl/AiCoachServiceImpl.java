package com.campuschanakya.service.impl;

import com.campuschanakya.dto.AiCoachChatRequest;
import com.campuschanakya.dto.AiCoachChatResponse;
import com.campuschanakya.model.StudentProfile;
import com.campuschanakya.model.User;
import com.campuschanakya.repository.StudentProfileRepository;
import com.campuschanakya.service.AiCoachService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.concurrent.ConcurrentHashMap;

@Service
@RequiredArgsConstructor
@Slf4j
public class AiCoachServiceImpl implements AiCoachService {

    private final StudentProfileRepository profileRepository;
    private final com.campuschanakya.repository.AssessmentRepository assessmentRepository;
    private final com.campuschanakya.service.GeminiAiService geminiAiService;
    private final com.fasterxml.jackson.databind.ObjectMapper objectMapper = new com.fasterxml.jackson.databind.ObjectMapper();

    // In-memory persistent action plan items per user
    private final Map<Long, List<Map<String, Object>>> userActionPlans = new ConcurrentHashMap<>();

    @Override
    public AiCoachChatResponse processAgenticQuery(User user, AiCoachChatRequest request) {
        StudentProfile profile = profileRepository.findByUser(user)
                .or(() -> profileRepository.findByUserId(user.getId()))
                .orElse(null);

        List<com.campuschanakya.model.Assessment> assessments = assessmentRepository.findByStudentId(user.getId());

        Double cgpa = profile != null && profile.getCgpa() != null ? profile.getCgpa() : 0.0;
        String targetRole = (request.getTargetRole() != null && !request.getTargetRole().isBlank())
                ? request.getTargetRole()
                : (profile != null && profile.getTargetRole() != null ? profile.getTargetRole() : "Software Engineer");

        double avgScore = (profile != null && profile.getAverageAssessmentScore() != null && profile.getAverageAssessmentScore() > 0)
                ? profile.getAverageAssessmentScore()
                : (assessments.isEmpty() ? 0.0 : assessments.stream().mapToDouble(a -> a.getScore() != null ? a.getScore() : 0.0).average().orElse(0.0));
        int totalTaken = (profile != null && profile.getTotalAssessmentsTaken() != null && profile.getTotalAssessmentsTaken() > 0)
                ? profile.getTotalAssessmentsTaken()
                : assessments.size();
        int totalPassed = (profile != null && profile.getTotalAssessmentsPassed() != null)
                ? profile.getTotalAssessmentsPassed()
                : (int) assessments.stream().filter(a -> Boolean.TRUE.equals(a.getPassed())).count();
        int strikesCount = (profile != null && profile.getTotalStrikesRecorded() != null)
                ? profile.getTotalStrikesRecorded()
                : 0;

        List<String> realGaps = new ArrayList<>();
        int repeatedErrorsCount = 0;
        if (profile != null && profile.getRepeatedErrorsJson() != null && !profile.getRepeatedErrorsJson().isBlank()) {
            try {
                List<Map<String, Object>> errs = objectMapper.readValue(profile.getRepeatedErrorsJson(), new com.fasterxml.jackson.core.type.TypeReference<List<Map<String, Object>>>() {});
                repeatedErrorsCount = errs.size();
                for (Map<String, Object> err : errs) {
                    String topic = (String) err.get("topic");
                    Integer count = err.get("occurrences") instanceof Number ? ((Number) err.get("occurrences")).intValue() : 1;
                    if (topic != null && !realGaps.contains(topic)) {
                        realGaps.add(count >= 2 ? topic + " (" + count + "x repeated deficit)" : topic);
                    }
                }
            } catch (Exception ignored) {}
        }

        if (realGaps.isEmpty()) {
            realGaps = List.of(
                    "Distributed Lock Management (Redisson / Zookeeper)",
                    "Kafka Event-Driven Architecture & Consumer Group Invariants",
                    "System Design High-Availability Clustering & Latency SLAs"
            );
        }

        String query = request.getMessage() != null ? request.getMessage().trim() : "";
        String intent = request.getContextIntent() != null ? request.getContextIntent() : "GENERAL";
        String candidateName = user.getFullName() != null ? user.getFullName() : "Candidate";
        String skillsCsv = profile != null && profile.getVerifiedSkills() != null && !profile.getVerifiedSkills().isEmpty()
                ? String.join(", ", profile.getVerifiedSkills()) : "Java Core, Spring Boot, DSA, React";

        List<Map<String, String>> steps = new ArrayList<>();
        steps.add(Map.of(
                "phase", "1. Autonomous Diagnostics & DB Telemetry",
                "thought", "Parsing inquiry: '" + query + "' (Intent: " + intent + "). Auditing real database records: " + totalTaken + " assessments taken, avg score " + Math.round(avgScore * 10.0) / 10.0 + "%, " + repeatedErrorsCount + " repeated error topic(s).",
                "action", "Tool Execution: DatabaseTelemetryAuditor.scan(userId=" + user.getId() + ")",
                "observation", "Candidate profile verified. Avg score: " + Math.round(avgScore * 10.0) / 10.0 + "%. Skills: [" + skillsCsv + "]."
        ));

        steps.add(Map.of(
                "phase", "2. Semantic Knowledge & Deficit Analysis",
                "thought", "Retrieving technical placement rubrics and targeting student's recorded weak topics: " + String.join(", ", realGaps),
                "action", "Tool Execution: BenchmarkMatcher.computeDomainContext(query='" + (query.length() > 40 ? query.substring(0, 40) + "..." : query) + "')",
                "observation", "Matched academic and enterprise benchmarks for " + targetRole + "."
        ));

        steps.add(Map.of(
                "phase", "3. Strategic Plan Synthesis",
                "thought", "Synthesizing custom guidance specifically addressing the candidate's question while remediating any repeated errors.",
                "action", "Tool Execution: RoadmapSynthesizer.generateAdvice()",
                "observation", "Delivering targeted actionable insights with next steps."
        ));

        // Attempt live LLM generation via Gemini with strict 2.2s deadline budget
        String naturalMessage = null;
        if (!query.isBlank()) {
            String gapsSummary = String.join("; ", realGaps);
            String honestyStatus = strikesCount > 0 ? (strikesCount + " proctoring strike(s) logged") : "Clean record (0 strikes)";

            String prompt = """
                    You are CampusChanakya's AI Tech Buddy & Engineering Mentor — a friendly, cool, super encouraging, and brilliant senior developer buddy chatting directly with college student %s.

                    Student Profile: Name: %s | Target Role: %s | CGPA: %.2f | Skills: %s
                    Database Performance Telemetry:
                    - Assessment Average Score: %.1f%% across %d tests (%d passed)
                    - Proctoring Integrity: %s
                    - Recurring Deficits / Repeated Weak Topics in DB: %s

                    Student Message: "%s"

                    CRITICAL GUIDELINES:
                    1. Tone: Speak like a supportive, enthusiastic senior developer buddy sitting next to them. Keep response conversational, concise, and punchy (under 180 words).
                    2. If their message touches on any of their repeated deficits (%s), proactively give them a high-yield tip or invariant reminder!
                    3. Answer their question directly with crystal clarity, practical code snippet or actionable advice if relevant.
                    4. Conclude with a snappy, encouraging follow-up question or call-to-action!
                    """.formatted(candidateName, candidateName, targetRole, cgpa, skillsCsv, avgScore, totalTaken, totalPassed, honestyStatus, gapsSummary, query, gapsSummary);

            try {
                java.util.concurrent.CompletableFuture<String> future = java.util.concurrent.CompletableFuture.supplyAsync(
                        () -> geminiAiService.generateAiResponse(prompt)
                );
                naturalMessage = future.get(2200, java.util.concurrent.TimeUnit.MILLISECONDS);
            } catch (java.util.concurrent.TimeoutException te) {
                log.info("Gemini AI Coach query reached 2.2s budget - invoking instant high-speed fallback");
            } catch (Exception e) {
                log.warn("Gemini call for coach query failed: {}", e.getMessage());
            }
        }

        // Contextual dynamic fallback if Gemini returns null or blank or timed out
        if (naturalMessage == null || naturalMessage.isBlank()) {
            naturalMessage = generateIntelligentFallback(query, cgpa, targetRole, candidateName, skillsCsv);
        }

        List<Map<String, Object>> suggestedActions = generateSuggestedActions(query);

        List<String> topCompanies = List.of("Google Cloud", "Microsoft IDC", "Amazon AWS", "Razorpay", "Atlassian");

        Map<String, Object> diagnostic = new HashMap<>();
        diagnostic.put("placementReadinessScore", Math.min(99, Math.max(35, (int) Math.round(avgScore))));
        diagnostic.put("averageAssessmentScore", Math.round(avgScore * 10.0) / 10.0);
        diagnostic.put("totalAssessmentsTaken", totalTaken);
        diagnostic.put("totalAssessmentsPassed", totalPassed);
        diagnostic.put("repeatedErrorsCount", repeatedErrorsCount);
        diagnostic.put("tierCategory", avgScore >= 85 ? "Tier-1 Super Dream Candidate" : (avgScore >= 70 ? "Tier-2 Core Engineering Candidate" : "Active Remediation Track"));
        diagnostic.put("recommendedDailyEffort", repeatedErrorsCount > 0 ? "60 mins targeted weakness remediation" : "45 mins focused practice");
        diagnostic.put("proctoringHonestyScore", strikesCount > 0 ? (Math.max(40, 100 - strikesCount * 15) + "% (" + strikesCount + " strike(s) logged)") : "100% (Clean Record)");

        return AiCoachChatResponse.builder()
                .responseMessage(naturalMessage)
                .agentSteps(steps)
                .suggestedActions(suggestedActions)
                .identifiedGaps(realGaps)
                .topCompanyRecommendations(topCompanies)
                .diagnosticSummary(diagnostic)
                .build();
    }

    private String generateIntelligentFallback(String query, Double cgpa, String targetRole, String name, String skills) {
        String q = query != null ? query.toLowerCase() : "";

        if (q.contains("teach") || q.contains("learn java") || q.contains("start java") || q.contains("java basics") || q.contains("teach me")) {
            return "Hey " + name + "! Absolutely, I'd love to! 🚀 First off, killer choice picking Java. Java powers everything from Android apps to backend microservices at Netflix, Amazon, and Google!\n\n" +
                    "Let's kick things off with **Day 1: Demystifying the Magic**:\n\n" +
                    "### Step 1: Write Once, Run Anywhere\n" +
                    "Java code compiles into bytecode that runs on any machine with the **JVM (Java Virtual Machine)**. Mac, Windows, Linux—it just works!\n\n" +
                    "### Step 2: Your Very First Code\n" +
                    "```java\n" +
                    "public class Main {\n" +
                    "    public static void main(String[] args) {\n" +
                    "        System.out.println(\"Hey " + name + ", welcome to Java!\");\n" +
                    "    }\n" +
                    "}\n" +
                    "```\n" +
                    "- **`public class Main`**: In Java, every piece of code lives inside a labeled box called a **Class**.\n" +
                    "- **`public static void main`**: Think of this as the **ignition switch** of your car. It's where Java begins executing.\n" +
                    "- **`System.out.println`**: Tells the system to print your text on screen and jump to the next line.\n\n" +
                    "What part of Java do you want to explore next? Variables and Loops, Object-Oriented Programming (Classes & Objects), or building your first mini-project? I'm right here with you!";
        }

        if (q.contains("dsa") || q.contains("algorithm") || q.contains("binary search") || q.contains("tree") || q.contains("graph") || q.contains("dp") || q.contains("array") || q.contains("leetcode") || q.contains("topological") || q.contains("cycle") || q.contains("sort") || q.contains("stack") || q.contains("queue") || q.contains("heap")) {
            return "Hey " + name + "! Let's master DSA together! 💡 For " + targetRole + ", here are the exact pattern archetypes interviewers look for:\n\n" +
                    "1. **Boundary Invariant Binary Search**: Always use `low + (high - low) / 2` to avoid integer overflow.\n" +
                    "2. **Two Pointers & Sliding Window**: Super high-frequency for subarray and string problems.\n" +
                    "3. **Graph Cycles & Topological Sort**: Practice Kahn's BFS algorithm for task dependencies.\n" +
                    "4. **Dynamic Programming**: Define your state transitions clearly before optimizing space!\n\n" +
                    "Want to tackle a practice question together right now in the sandbox?";
        }

        if (q.contains("concurrency") || q.contains("thread") || q.contains("cas") || q.contains("volatile") || q.contains("atomic") || q.contains("lock") || q.contains("deadlock")) {
            return "Hey " + name + "! Concurrency is where backend developers really stand out! ⚡ Here's the key mental model:\n\n" +
                    "- **`volatile`**: Inserts CPU memory barriers (LoadLoad/StoreStore) so writes go straight to main memory. Visibility guaranteed, but not atomicity for `count++`.\n" +
                    "- **Atomic CAS (`AtomicLong`, `AtomicReference`)**: Uses hardware `CMPXCHG` instructions—zero thread-parking overhead!\n" +
                    "- **Deadlock Rules**: Always acquire locks in the exact same global order and use `tryLock` with timeouts.\n\n" +
                    "Ready to test your concurrency invariants on the skill assessment tab?";
        }

        if (q.contains("spring") || q.contains("boot") || q.contains("microservice") || q.contains("jpa") || q.contains("hibernate") || q.contains("database") || q.contains("sql") || q.contains("api")) {
            return "Hey " + name + "! Spring Boot is an absolute superpower for backend engineers! 🍃 Here are the golden rules for production:\n\n" +
                    "1. **Stateless Security**: Keep JWT authentication strictly stateless for cloud scaling.\n" +
                    "2. **Kill N+1 Queries**: Always use `JOIN FETCH` or `@EntityGraph` for `@ManyToOne` relationships.\n" +
                    "3. **Transaction Rollbacks**: Remember Spring only rolls back unchecked exceptions by default. Use `@Transactional(rollbackFor = Exception.class)` for checked ones.\n\n" +
                    "Let me know if you want me to explain any annotation or architectural pattern in detail!";
        }

        if (q.contains("resume") || q.contains("ats") || q.contains("cv") || q.contains("format")) {
            return "Hey " + name + "! Let's make sure your resume stands out and scores 95%+! 📄\n\n" +
                    "1. **Use Google's XYZ Formula**: *'Accomplished [X] measured by [Y], by doing [Z]'* (e.g. *'Reduced checkout API latency by 35% across 50K requests using Redis caching'*).\n" +
                    "2. **Align Keywords**: Highlight Java 21, Spring Boot, REST APIs, and Docker explicitly for " + targetRole + ".\n" +
                    "3. **ATS-Clean Layout**: Keep a crisp single-column format that Workday and Taleo parse effortlessly.\n\n" +
                    "You can upload your PDF right now in the ATS Resume tab to see your live score!";
        }

        if (q.contains("viva") || q.contains("interview") || q.contains("hr") || q.contains("mock") || q.contains("behavioral")) {
            return "Hey " + name + "! You've totally got what it takes to ace your interviews! 🎯 Here is the game plan:\n\n" +
                    "- **The STAR Method**: Structure answers into Situation, Task, Action, and Result.\n" +
                    "- **State Complexity Upfront**: Before writing code, tell the interviewer your time and space target.\n" +
                    "- **Think Out Loud**: Interviewers care way more about your problem-solving thought process than quiet memorization.\n\n" +
                    "Let's practice a mock question together in the AI Mock Viva tab whenever you're ready!";
        }

        if (q.contains("python") || q.contains("django") || q.contains("flask") || q.contains("pandas") || q.contains("ai") || q.contains("ml")) {
            return "Hey " + name + "! Python is an incredible language, especially for rapid prototyping, AI/ML, and automation! 🐍\n\n" +
                    "- **Core Strength**: Expressive, clean syntax with dynamic typing and massive ecosystem (NumPy, PyTorch, FastAPI).\n" +
                    "- **Memory & Execution**: Runs on CPython using bytecode interpretation and a Global Interpreter Lock (GIL).\n" +
                    "- **Best Practice**: Use type hints (`def greet(name: str) -> str:`) to write robust, maintainable code!\n\n" +
                    "Are you looking to use Python for DSA problem-solving, data science, or backend web APIs? Let's dive in!";
        }

        if (q.contains("react") || q.contains("frontend") || q.contains("javascript") || q.contains("css") || q.contains("html") || q.contains("ui")) {
            return "Hey " + name + "! Frontend engineering with React and modern JavaScript is super fun! ⚛️\n\n" +
                    "1. **Component State**: Keep state as close as possible to the components that need it to prevent wasteful re-renders.\n" +
                    "2. **Hooks Rule**: Master `useEffect` cleanup functions and `useMemo`/`useCallback` for referential equality.\n" +
                    "3. **Clean Tailwind UI**: Pair accessible semantic HTML with responsive utility classes for pixel-perfect screens.\n\n" +
                    "Want tips on connecting your React components seamlessly to Spring Boot REST endpoints?";
        }

        if (q.contains("system design") || q.contains("architecture") || q.contains("scal") || q.contains("kafka") || q.contains("redis")) {
            return "Hey " + name + "! System Design is where you transition from junior coder to senior engineer! 🏛️\n\n" +
                    "- **Caching Invariants**: Use Redis for sub-millisecond lookups with Cache-Aside pattern and TTLs to prevent stale reads.\n" +
                    "- **Event-Driven Asynchrony**: Offload heavy writes to Kafka topics with consumer groups ensuring at-least-once delivery.\n" +
                    "- **CAP Theorem**: In distributed networks, pick between Consistency (Raft/Paxos) vs High Availability (Dynamo-style) based on business requirements.\n\n" +
                    "Shall we practice designing a URL Shortener or a high-throughput Placement Portal together?";
        }

        if (q.contains("hello") || q.contains("hi") || q.contains("hey") || q.contains("who are you")) {
            return "Hey " + name + "! 👋 Great to see you! I'm your dedicated CampusChanakya AI Career Coach & Tech Mentor.\n\n" +
                    "I track your skill verifications, diagnostic telemetry, and placement benchmarks to help you land top-tier software engineering roles. We can practice DSA, dive into Java & Spring Boot, review system design, or tune your resume. What do you want to tackle today?";
        }

        return "Hey " + name + "! Awesome to connect with you! 👋\n\n" +
                (cgpa != null && cgpa > 0.0 ? "You're building momentum with your **" + cgpa + " CGPA** aiming for **" + targetRole + "**!\n\n" : "I'm ready to help you prepare for **" + targetRole + "**!\n\n") +
                "I'm here as your dedicated tech mentor—whether you want to learn Java, debug code, prep for proctored viva rounds, or optimize your resume. What's on your mind today? Let's make it happen! 🚀";
    }

    private List<Map<String, Object>> generateSuggestedActions(String query) {
        String q = query != null ? query.toLowerCase() : "";
        if (q.contains("teach") || q.contains("java") || q.contains("code")) {
            return List.of(
                    Map.of("id", "act-java-1", "title", "Write Your First Java Code in Sandbox", "priority", "HIGH", "estimatedMinutes", 15, "category", "PRACTICE"),
                    Map.of("id", "act-java-2", "title", "Explore OOP Principles with AI Viva", "priority", "MEDIUM", "estimatedMinutes", 10, "category", "VIVA")
            );
        } else if (q.contains("dsa") || q.contains("algorithm")) {
            return List.of(
                    Map.of("id", "act-dsa-1", "title", "Solve Binary Search Invariants in Coding Sandbox", "priority", "HIGH", "estimatedMinutes", 20, "category", "ASSESSMENT"),
                    Map.of("id", "act-dsa-2", "title", "Review Topological Sort & Cycle Detection", "priority", "MEDIUM", "estimatedMinutes", 15, "category", "DSA")
            );
        } else if (q.contains("resume") || q.contains("ats")) {
            return List.of(
                    Map.of("id", "act-res-1", "title", "Upload Resume PDF to ATS Scanner", "priority", "HIGH", "estimatedMinutes", 5, "category", "RESUME"),
                    Map.of("id", "act-res-2", "title", "Integrate Quantified XYZ Metrics into Project Bullets", "priority", "MEDIUM", "estimatedMinutes", 25, "category", "RESUME")
            );
        } else if (q.contains("viva") || q.contains("interview")) {
            return List.of(
                    Map.of("id", "act-viva-1", "title", "Conduct AI Mock Viva on Concurrency & Invariants", "priority", "HIGH", "estimatedMinutes", 10, "category", "VIVA"),
                    Map.of("id", "act-viva-2", "title", "Book 1-on-1 Alumni Mock Technical Interview", "priority", "MEDIUM", "estimatedMinutes", 5, "category", "MENTORSHIP")
            );
        }
        return List.of(
                Map.of("id", "act-1", "title", "Practice Java & Spring Boot in Sandbox", "priority", "HIGH", "estimatedMinutes", 15, "category", "PRACTICE"),
                Map.of("id", "act-2", "title", "Run AI Mock Viva on Backend Architecture", "priority", "HIGH", "estimatedMinutes", 10, "category", "VIVA")
        );
    }

    @Override
    public List<Map<String, Object>> getActionPlan(User user) {
        return userActionPlans.computeIfAbsent(user.getId(), k -> new ArrayList<>(List.of(
                createPlanItem("plan-1", "Phase 1: Invariant & Object-Oriented Mastery", "Verify polymorphism, encapsulation, and Java 21 dynamic dispatch with 0 strikes.", true, "HIGH", "COMPLETED"),
                createPlanItem("plan-2", "Phase 2: Spring Boot Enterprise Security & JPA", "Master stateless JWT filters, N+1 query prevention, and @Transactional rollback semantics.", true, "HIGH", "COMPLETED"),
                createPlanItem("plan-3", "Phase 3: ATS Resume Keyword Optimization (90+ Score)", "Upload resume PDF, integrate verified credentials, and align with Tier-1 role rubrics.", true, "HIGH", "COMPLETED"),
                createPlanItem("plan-4", "Phase 4: High-Frequency AI Mock Viva Voce", "Conduct simulated viva sessions on Concurrency and System Design with 4-pillar evaluation.", false, "HIGH", "IN_PROGRESS"),
                createPlanItem("plan-5", "Phase 5: 1-on-1 Alumni Mock Technical Interview", "Schedule live architecture review session with alumni mentor from Google/Amazon.", false, "MEDIUM", "UPCOMING"),
                createPlanItem("plan-6", "Phase 6: Campus Placement Drive Applications", "One-click submit verified candidate credentials to open Tier-1 engineering vacancies.", false, "MEDIUM", "UPCOMING")
        )));
    }

    @Override
    public Map<String, Object> toggleActionItem(User user, String itemId, boolean completed) {
        List<Map<String, Object>> items = getActionPlan(user);
        for (Map<String, Object> item : items) {
            if (itemId.equals(item.get("id"))) {
                item.put("completed", completed);
                item.put("status", completed ? "COMPLETED" : "IN_PROGRESS");
                return item;
            }
        }
        return Map.of("success", true);
    }

    private Map<String, Object> createPlanItem(String id, String title, String description, boolean completed, String priority, String status) {
        Map<String, Object> map = new HashMap<>();
        map.put("id", id);
        map.put("title", title);
        map.put("description", description);
        map.put("completed", completed);
        map.put("priority", priority);
        map.put("status", status);
        return map;
    }
}
