package com.campuschanakya.service.impl;

import com.campuschanakya.dto.AiVivaEvaluateRequest;
import com.campuschanakya.dto.AiVivaEvaluateResponse;
import com.campuschanakya.dto.AiVivaGenerateRequest;
import com.campuschanakya.service.GeminiAiService;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.time.Duration;
import java.util.*;

/**
 * ============================================================================
 * GEMINI AI SERVICE IMPLEMENTATION
 * ============================================================================
 * Leverages Google Gemini 2.0 Flash with automatic failover rotation between
 * GOOGLE_API_KEY1, GOOGLE_API_KEY2, and GOOGLE_API_KEY3.
 */
@Service
@Slf4j
public class GeminiAiServiceImpl implements GeminiAiService {

    @Value("${GOOGLE_API_KEY1:}")
    private String key1;

    @Value("${GOOGLE_API_KEY2:}")
    private String key2;

    @Value("${GOOGLE_API_KEY3:}")
    private String key3;

    @Value("${GEMINI_MODEL:gemini-3.5-flash}")
    private String geminiModel;

    private final ObjectMapper objectMapper = new ObjectMapper();
    private final HttpClient httpClient = HttpClient.newBuilder()
            .connectTimeout(Duration.ofMillis(1500))
            .build();

    // Cache rate-limited keys (e.g. 429) to avoid retry delay storms
    private final Map<String, Long> rateLimitedKeys = new java.util.concurrent.ConcurrentHashMap<>();

    private List<String> getActiveKeys() {
        List<String> keys = new ArrayList<>();
        if (key1 != null && !key1.isBlank()) keys.add(key1.trim());
        if (key2 != null && !key2.isBlank()) keys.add(key2.trim());
        if (key3 != null && !key3.isBlank()) keys.add(key3.trim());
        return keys;
    }

    private String callGeminiWithRotation(String prompt) {
        return callGeminiWithRotation(prompt, 500);
    }

    private String callGeminiWithRotation(String prompt, int maxTokens) {
        List<String> keys = getActiveKeys();
        if (keys.isEmpty()) {
            log.warn("No Google Gemini API keys configured in .env. Using intelligent academic fallback engine.");
            return null;
        }

        List<String> candidateModels = new ArrayList<>();
        if (geminiModel != null && !geminiModel.isBlank()) candidateModels.add(geminiModel.trim());
        if (!candidateModels.contains("gemini-3.5-flash")) candidateModels.add("gemini-3.5-flash");
        if (!candidateModels.contains("gemini-3.5-flash-lite")) candidateModels.add("gemini-3.5-flash-lite");
        if (!candidateModels.contains("gemini-flash-lite-latest")) candidateModels.add("gemini-flash-lite-latest");

        // Strict 2.2s budget for live external LLM response
        long deadline = System.currentTimeMillis() + 2200;

        for (String model : candidateModels) {
            for (int i = 0; i < keys.size(); i++) {
                if (System.currentTimeMillis() >= deadline) {
                    log.info("Gemini LLM budget reached (2.2s). Switching instantly to local fallback.");
                    return null;
                }

                String activeKey = keys.get(i);
                Long rateLimitedUntil = rateLimitedKeys.get(activeKey);
                if (rateLimitedUntil != null && System.currentTimeMillis() < rateLimitedUntil) {
                    continue; // Skip key in 429 cooldown without wasting roundtrip time
                }

                try {
                    String endpoint = "https://generativelanguage.googleapis.com/v1beta/models/"
                            + model + ":generateContent?key=" + activeKey;

                    Map<String, Object> requestBody = Map.of(
                            "contents", List.of(
                                    Map.of("parts", List.of(Map.of("text", prompt)))
                            ),
                            "generationConfig", Map.of(
                                    "temperature", 0.3,
                                    "maxOutputTokens", maxTokens
                            )
                    );

                    String jsonPayload = objectMapper.writeValueAsString(requestBody);

                    long remainingMs = Math.max(700, deadline - System.currentTimeMillis());
                    HttpRequest request = HttpRequest.newBuilder()
                            .uri(URI.create(endpoint))
                            .header("Content-Type", "application/json")
                            .timeout(Duration.ofMillis(remainingMs))
                            .POST(HttpRequest.BodyPublishers.ofString(jsonPayload))
                            .build();

                    HttpResponse<String> response = httpClient.send(request, HttpResponse.BodyHandlers.ofString());

                    if (response.statusCode() == 200) {
                        JsonNode root = objectMapper.readTree(response.body());
                        JsonNode candidates = root.path("candidates");
                        if (candidates.isArray() && !candidates.isEmpty()) {
                            String text = candidates.get(0).path("content").path("parts").get(0).path("text").asText();
                            log.info("Gemini API call succeeded in [{}] using key index [{}] and model [{}]",
                                    (2200 - (deadline - System.currentTimeMillis())) + "ms", i + 1, model);
                            return text;
                        }
                    } else if (response.statusCode() == 429) {
                        log.warn("Gemini key index [{}] hit quota limit (429). Marking in cooldown.", i + 1);
                        rateLimitedKeys.put(activeKey, System.currentTimeMillis() + 60_000);
                    } else {
                        log.warn("Gemini returned non-200 status [{}] for model [{}] and key [{}]", response.statusCode(), model, i + 1);
                    }
                } catch (Exception e) {
                    log.warn("Error querying Gemini with key index [{}] and model {}: {}", i + 1, model, e.getMessage());
                }
            }
        }

        return null;
    }

    @Override
    public Map<String, Object> generateInterviewQuestion(AiVivaGenerateRequest request) {
        String topic = (request.getTopic() != null && !request.getTopic().isBlank())
                ? request.getTopic().trim() : "Object-Oriented Programming with Java";
        String difficulty = (request.getDifficulty() != null && !request.getDifficulty().isBlank())
                ? request.getDifficulty().trim() : "INTERMEDIATE";

        String prompt = """
                You are a Senior Technical Campus Placement Interviewer and Academic Viva Examiner.
                Generate 1 realistic, challenging technical interview question on the topic: "%s" with difficulty level "%s".
                Ensure the question tests both conceptual understanding (OOP principles, invariants, memory/performance) and practical problem-solving.
                
                Respond in valid JSON only with keys:
                {
                  "topic": "%s",
                  "difficulty": "%s",
                  "question": "The question text here",
                  "hint": "A subtle technical hint for the student",
                  "expectedCoreConcepts": ["Concept 1", "Concept 2", "Concept 3"]
                }
                Do not include markdown code block formatting in your response if possible, just the raw JSON.
                """.formatted(topic, difficulty, topic, difficulty);

        String rawResponse = callGeminiWithRotation(prompt);
        if (rawResponse != null) {
            try {
                String cleanJson = cleanJsonString(rawResponse);
                JsonNode node = objectMapper.readTree(cleanJson);
                List<String> concepts = new ArrayList<>();
                if (node.has("expectedCoreConcepts") && node.get("expectedCoreConcepts").isArray()) {
                    node.get("expectedCoreConcepts").forEach(c -> concepts.add(c.asText()));
                }

                return Map.of(
                        "topic", node.path("topic").asText(topic),
                        "difficulty", node.path("difficulty").asText(difficulty),
                        "question", node.path("question").asText(),
                        "hint", node.path("hint").asText(),
                        "expectedCoreConcepts", concepts,
                        "source", "Google Gemini (" + geminiModel + ")"
                );
            } catch (Exception e) {
                log.warn("Failed to parse Gemini generated question JSON: {}", e.getMessage());
            }
        }

        // Contextual Fallback Question Bank
        return getFallbackQuestion(topic, difficulty);
    }

    @Override
    public AiVivaEvaluateResponse evaluateAnswer(AiVivaEvaluateRequest request) {
        String answer = request.resolveAnswer();
        String topic = (request.getTopic() != null && !request.getTopic().isBlank()) ? request.getTopic().trim() : "Software Architecture & Invariants";
        String question = (request.getQuestion() != null && !request.getQuestion().isBlank()) ? request.getQuestion().trim() : "Technical Interview Question";

        // 1. Instant Disqualification for Trivial / Greeting / Repeated Word / Empty Answers
        if (isGreetingOrTrivialOrSpam(answer)) {
            log.info("AI Viva detected greeting/trivial/repeated answer: '{}'. Rejecting with 0 marks.", answer);
            return createZeroScoreResponse(answer, topic, "Submitted response contains only greetings, repeated words, or irrelevant filler with zero technical substance.");
        }

        // 2. Live Gemini Evaluation for substantive answers
        String prompt = """
                You are a Senior Academic Viva Voce Examiner and Technical Placement Hiring Manager at Google/Amazon.
                Evaluate the candidate's interview response with strict technical accuracy and academic integrity.

                VIVA CONTEXT:
                - Topic: %s
                - Question: "%s"
                - Candidate's Answer: "%s"

                STRICT SCORING RUBRIC:
                0. ZERO SCORE RULE (CRITICAL): If the candidate's answer is a greeting (e.g. 'hello', 'hi', repeated 'hello hello hello'), pleasantry, conversational filler, off-topic text, gibberish, or contains NO relevant technical explanation of the question, you MUST award an overallScore of EXACTLY 0 (zero), with all four pillar scores set to 0, passed: false, grade: "F (0/100 - Zero Marks)", verdict: "DISQUALIFIED". Do NOT award any sympathy marks for non-technical words.
                1. If the answer is vague, generic, or misses the core question: Score 15-40, verdict "NEEDS_IMPROVEMENT", passed false.
                2. If the answer is partially correct but misses crucial system invariants: Score 50-70, verdict "NEEDS_IMPROVEMENT", passed false.
                3. If the answer is solid and correctly explains the mechanics: Score 75-85, verdict "GOOD", passed true.
                4. If the answer is exceptional with deep code/JVM/architecture invariants: Score 86-98, verdict "EXCELLENT", passed true.

                Four Pillars (Each scored 0 to 25, overallScore must equal their sum):
                - conceptualClarityScore (0-25)
                - architecturalDepthScore (0-25)
                - verbalArticulationScore (0-25)
                - productionInvariantsScore (0-25)

                Respond STRICTLY in valid JSON with this exact schema (no markdown, no backticks):
                {
                  "overallScore": <integer 0-100>,
                  "grade": "<grade string e.g. 'A (Qualified)' or 'F (0/100 - Zero Marks)'>",
                  "passed": <boolean true if overallScore >= 75 else false>,
                  "verdict": "<DISQUALIFIED|NEEDS_IMPROVEMENT|GOOD|EXCELLENT>",
                  "conceptualClarityScore": <integer 0-25>,
                  "architecturalDepthScore": <integer 0-25>,
                  "verbalArticulationScore": <integer 0-25>,
                  "productionInvariantsScore": <integer 0-25>,
                  "feedback": "<2-sentence examiner verdict>",
                  "keyStrengths": ["<strength 1>", "<strength 2>"],
                  "areasOfImprovement": ["<improvement 1>", "<improvement 2>"],
                  "recommendedModelAnswer": "<2-sentence ideal technical response>"
                }
                """.formatted(topic, question, answer);

        String rawResponse = callGeminiWithRotation(prompt, 600);

        if (rawResponse != null) {
            try {
                String cleanJson = cleanJsonString(rawResponse);
                JsonNode node = objectMapper.readTree(cleanJson);

                int cScore = Math.min(25, Math.max(0, node.path("conceptualClarityScore").asInt(15)));
                int aScore = Math.min(25, Math.max(0, node.path("architecturalDepthScore").asInt(15)));
                int vScore = Math.min(25, Math.max(0, node.path("verbalArticulationScore").asInt(18)));
                int iScore = Math.min(25, Math.max(0, node.path("productionInvariantsScore").asInt(15)));
                int total = node.has("overallScore") ? node.path("overallScore").asInt(cScore + aScore + vScore + iScore) : (cScore + aScore + vScore + iScore);
                total = Math.min(100, Math.max(0, total));

                boolean passed = node.path("passed").asBoolean(total >= 75);
                String verdict = node.path("verdict").asText(total >= 85 ? "EXCELLENT" : (passed ? "GOOD" : "NEEDS_IMPROVEMENT"));
                String grade = node.path("grade").asText(total >= 90 ? "A+ (Distinction Viva Benchmark)" : (passed ? "A (Qualified)" : "C (Needs Work)"));
                String feedback = node.path("feedback").asText("Demonstrated acceptable technical understanding with room for deeper invariant analysis.");

                List<String> strengths = new ArrayList<>();
                if (node.has("keyStrengths") && node.get("keyStrengths").isArray()) {
                    node.get("keyStrengths").forEach(s -> strengths.add(s.asText()));
                }

                List<String> improvements = new ArrayList<>();
                if (node.has("areasOfImprovement") && node.get("areasOfImprovement").isArray()) {
                    node.get("areasOfImprovement").forEach(i -> improvements.add(i.asText()));
                }

                Map<String, Integer> pillars = Map.of(
                        "Conceptual Clarity", cScore,
                        "Architectural Depth", aScore,
                        "Verbal Articulation", vScore,
                        "Production Invariants", iScore
                );

                return AiVivaEvaluateResponse.builder()
                        .overallScore(total)
                        .grade(grade)
                        .passed(passed)
                        .verdict(verdict)
                        .feedback(feedback)
                        .feedbackSummary(feedback)
                        .pillarScores(pillars)
                        .technicalAccuracyScore(total)
                        .oopAlignmentScore(Math.min(100, cScore * 4))
                        .placementReadinessScore(Math.min(100, aScore * 4))
                        .strengths(strengths)
                        .keyStrengths(strengths)
                        .weaknessTips(improvements)
                        .areasOfImprovement(improvements)
                        .recommendedModelAnswer(node.path("recommendedModelAnswer").asText("In Java, virtual method dispatch uses the runtime class vtable on the heap to resolve overridden methods dynamically."))
                        .providerUsed("Google Gemini (" + geminiModel + ")")
                        .build();

            } catch (Exception e) {
                log.warn("Failed to parse Gemini evaluation JSON: {}", e.getMessage());
            }
        }

        // 3. Fallback to Local Deterministic Rigorous Evaluation
        return getFallbackEvaluation(request);
    }

    private String cleanJsonString(String raw) {
        String cleaned = raw.trim();
        if (cleaned.startsWith("```json")) {
            cleaned = cleaned.substring(7);
        } else if (cleaned.startsWith("```")) {
            cleaned = cleaned.substring(3);
        }
        if (cleaned.endsWith("```")) {
            cleaned = cleaned.substring(0, cleaned.length() - 3);
        }
        return cleaned.trim();
    }

    private Map<String, Object> getFallbackQuestion(String topic, String difficulty) {
        List<Map<String, Object>> pool = List.of(
                Map.of(
                        "topic", "Object-Oriented Programming (OOPJ)",
                        "difficulty", "INTERMEDIATE",
                        "question", "Explain the difference between Dynamic Method Dispatch (Runtime Polymorphism) and Compile-time Overloading in Java. How does the JVM vtable resolve overridden methods?",
                        "hint", "Think about method signatures at bytecode compilation vs object reference types on the heap.",
                        "expectedCoreConcepts", List.of("Virtual Method Table", "Method Overriding", "Dynamic Binding", "Bytecode invokevirtual"),
                        "source", "CampusChanakya Academic Question Bank"
                ),
                Map.of(
                        "topic", "Spring Boot & REST Architecture",
                        "difficulty", "INTERMEDIATE",
                        "question", "Why should REST controllers remain strictly decoupled from business logic and database entities using DTOs? How does the Strategy pattern fit into Service layers?",
                        "hint", "Focus on Single Responsibility Principle and preventing over-posting vulnerabilities.",
                        "expectedCoreConcepts", List.of("DTO Abstraction", "Decoupled Service Layer", "Polymorphic Strategy Pattern", "Stateless Contracts"),
                        "source", "CampusChanakya Academic Question Bank"
                )
        );

        return pool.get(new Random().nextInt(pool.size()));
    }

    private boolean isGreetingOrTrivialOrSpam(String answer) {
        if (answer == null) return true;
        String clean = answer.trim().toLowerCase();
        if (clean.isEmpty() || clean.length() < 10) return true;

        // Split into words
        String[] words = clean.split("[\\s,;:.!?]+");
        if (words.length < 3) return true;

        // Check for repeated single word spam (e.g., "hello hello hello hello hello", "ok ok ok")
        Set<String> distinctWords = new HashSet<>(Arrays.asList(words));
        if (distinctWords.size() <= 2) {
            return true;
        }

        // Check if most frequent word accounts for over 50% of the entire answer
        Map<String, Integer> freq = new HashMap<>();
        for (String w : words) {
            freq.put(w, freq.getOrDefault(w, 0) + 1);
        }
        int maxFreq = freq.values().stream().max(Integer::compareTo).orElse(0);
        if ((double) maxFreq / words.length >= 0.50 && words.length >= 4) {
            return true;
        }

        // Set of greeting, pleasantry, and non-technical filler words
        Set<String> greetingsAndFillers = Set.of(
                "hi", "hello", "hey", "hola", "sup", "yo", "test", "testing",
                "ok", "okay", "bye", "goodbye", "yes", "no", "idk", "none",
                "nothing", "sir", "madam", "please", "thanks", "thank", "you",
                "welcome", "morning", "evening", "afternoon", "fine", "good",
                "how", "are", "am", "i", "here", "there", "what", "so", "why",
                "tell", "me", "haha", "hahaha", "asdf", "cool", "nice", "okies"
        );

        long fillerCount = Arrays.stream(words)
                .filter(greetingsAndFillers::contains)
                .count();

        // If 60% or more words are conversational fillers or greetings
        if ((double) fillerCount / words.length >= 0.60) {
            return true;
        }

        // Check character repetitions / keyboard smash
        if (clean.matches(".*([a-z])\\1{4,}.*") || clean.matches("^(asdf|qwer|zxcv|1234|haha|bla|la)+$")) {
            return true;
        }

        return false;
    }

    private AiVivaEvaluateResponse createZeroScoreResponse(String answer, String topic, String reason) {
        String snippet = answer.length() > 35 ? answer.substring(0, 35) + "..." : answer;
        return AiVivaEvaluateResponse.builder()
                .overallScore(0)
                .grade("F (0/100 - Zero Marks / Disqualified)")
                .passed(false)
                .verdict("DISQUALIFIED")
                .feedback("Your response ('" + snippet + "') contains only greetings, repeated words, or irrelevant filler with zero technical substance. In a technical viva, greetings receive 0 marks. Please explain the technical concept asked in the question.")
                .feedbackSummary("Greeting, repetitive, or off-topic response detected. Zero marks awarded (0/100).")
                .pillarScores(Map.of(
                        "Conceptual Clarity", 0,
                        "Architectural Depth", 0,
                        "Verbal Articulation", 0,
                        "Production Invariants", 0
                ))
                .technicalAccuracyScore(0)
                .oopAlignmentScore(0)
                .placementReadinessScore(0)
                .strengths(List.of("No technical merit found."))
                .keyStrengths(List.of("No technical merit found."))
                .weaknessTips(List.of(
                        "Directly explain the technical mechanism asked in the question rather than submitting greetings.",
                        "Detail runtime behavior, memory layout, and code invariants.",
                        "Provide a concrete code example or architectural trade-off."
                ))
                .areasOfImprovement(List.of(
                        "Directly explain the technical mechanism asked in the question rather than submitting greetings.",
                        "Detail runtime behavior, memory layout, and code invariants."
                ))
                .recommendedModelAnswer("In Java, virtual method dispatch uses the object's runtime class vtable on the heap to resolve overriding methods dynamically, ensuring true polymorphism and adhering to the Open/Closed Principle.")
                .providerUsed("CampusChanakya Rigorous Evaluator (Zero Tolerance Rule)")
                .build();
    }

    private AiVivaEvaluateResponse getFallbackEvaluation(AiVivaEvaluateRequest request) {
        String answer = request.resolveAnswer();
        String lower = answer.toLowerCase().trim();
        String topic = request.getTopic() != null ? request.getTopic() : "Technical Interview";

        // 1. Strict check for greetings, spam, repeated words, or empty answers
        if (isGreetingOrTrivialOrSpam(answer)) {
            return createZeroScoreResponse(answer, topic, "Submitted response contains greetings or non-technical filler.");
        }

        int wordCount = lower.split("\\s+").length;

        // Domain keyword analysis
        int keywordMatches = 0;
        List<String> foundKeywords = new ArrayList<>();
        List<String> targetKeywords = List.of(
                "vtable", "dispatch", "polymorph", "dynamic", "override", "runtime", "virtual",
                "volatile", "barrier", "memory", "cache", "cas", "atomic", "synchron", "lock",
                "transaction", "rollback", "exception", "rollbackfor", "jpa", "hibernate", "n+1",
                "heap", "stack", "bytecode", "jvm", "interface", "encapsulat", "immutable",
                "binary search", "invariant", "pointer", "complexity", "o(1)", "o(n)", "o(log n)",
                "solid", "pattern", "strategy", "singleton", "thread", "concurrency", "deadlock"
        );

        for (String kw : targetKeywords) {
            if (lower.contains(kw)) {
                keywordMatches++;
                foundKeywords.add(kw);
            }
        }

        // If zero technical keywords were matched, candidate gets ZERO marks!
        if (keywordMatches == 0) {
            return AiVivaEvaluateResponse.builder()
                    .overallScore(0)
                    .grade("F (0/100 - Zero Technical Concepts)")
                    .passed(false)
                    .verdict("DISQUALIFIED")
                    .feedback("Response does not address the technical concept asked in the question. Zero technical concepts or invariants were detected. Score: 0/100.")
                    .feedbackSummary("No domain concepts identified in response. Zero marks awarded (0/100).")
                    .pillarScores(Map.of(
                            "Conceptual Clarity", 0,
                            "Architectural Depth", 0,
                            "Verbal Articulation", 0,
                            "Production Invariants", 0
                    ))
                    .technicalAccuracyScore(0)
                    .oopAlignmentScore(0)
                    .placementReadinessScore(0)
                    .strengths(List.of("No technical concepts identified."))
                    .keyStrengths(List.of("No technical concepts identified."))
                    .weaknessTips(List.of(
                            "Incorporate domain terminology (e.g. JVM vtable, memory barriers, rollback semantics, or algorithmic bounds).",
                            "Explain the underlying runtime mechanism and provide code invariants."
                    ))
                    .areasOfImprovement(List.of(
                            "Incorporate domain terminology (e.g. JVM vtable, memory barriers, rollback semantics).",
                            "Explain the underlying runtime mechanism."
                    ))
                    .recommendedModelAnswer("In Java, dynamic method dispatch uses the runtime class vtable on the heap to resolve overridden methods dynamically, ensuring true polymorphism.")
                    .providerUsed("CampusChanakya Rigorous Evaluator (Strict Technical Engine)")
                    .build();
        }

        // Calculate 4 pillars strictly for real technical answers (0-25 each)
        int conceptual = Math.min(25, Math.max(5, keywordMatches * 5 + Math.min(5, wordCount / 10)));
        int architectural = Math.min(25, Math.max(5, keywordMatches * 4 + (lower.contains("trade") || lower.contains("pattern") || lower.contains("solid") ? 6 : 0)));
        int verbal = Math.min(25, Math.max(5, Math.min(15, wordCount / 4) + (answer.contains(".") ? 4 : 0)));
        int invariants = Math.min(25, Math.max(5, (lower.contains("code") || lower.contains("class") || lower.contains("method") || lower.contains("jvm") || lower.contains("cpu") ? 8 : 0) + keywordMatches * 3));

        int total = conceptual + architectural + verbal + invariants;
        total = Math.min(98, Math.max(20, total));

        boolean passed = total >= 75;
        String grade = total >= 90 ? "A+ (Distinction Viva Benchmark)" : (passed ? "A (Qualified)" : (total >= 60 ? "B (Needs Polish)" : "C (Unsatisfactory)"));
        String verdict = total >= 85 ? "EXCELLENT" : (passed ? "GOOD" : "NEEDS_IMPROVEMENT");

        List<String> strengths = new ArrayList<>();
        strengths.add("Correctly incorporated domain concepts: " + String.join(", ", foundKeywords.subList(0, Math.min(3, foundKeywords.size()))));
        if (wordCount >= 30) {
            strengths.add("Articulated thoughts in sufficient depth (" + wordCount + " words).");
        }

        List<String> weaknesses = new ArrayList<>();
        if (keywordMatches < 3) {
            weaknesses.add("Incorporate more precise architectural keywords (e.g. JVM vtable, memory barriers, rollback semantics).");
        }
        if (wordCount < 40) {
            weaknesses.add("Expand your explanation to include concrete code signatures or edge-case handling.");
        }
        if (!lower.contains("trade") && !lower.contains("cost")) {
            weaknesses.add("Always state trade-offs (e.g. memory overhead, lock contention, cache locality).");
        }

        return AiVivaEvaluateResponse.builder()
                .overallScore(total)
                .grade(grade)
                .passed(passed)
                .verdict(verdict)
                .feedback(passed ? "Candidate demonstrated competent grasp of the question invariants with clear terminology." : "Candidate answer was partial or missed crucial system invariants. Review core mechanics before re-attempting.")
                .feedbackSummary(passed ? "Solid technical demonstration." : "Response needs further depth in low-level invariants.")
                .pillarScores(Map.of(
                        "Conceptual Clarity", conceptual,
                        "Architectural Depth", architectural,
                        "Verbal Articulation", verbal,
                        "Production Invariants", invariants
                ))
                .technicalAccuracyScore(total)
                .oopAlignmentScore(Math.min(100, conceptual * 4))
                .placementReadinessScore(Math.min(100, architectural * 4))
                .strengths(strengths)
                .keyStrengths(strengths)
                .weaknessTips(weaknesses)
                .areasOfImprovement(weaknesses)
                .recommendedModelAnswer("In Java, virtual method dispatch uses the object's runtime class vtable on the heap to resolve overriding methods dynamically, ensuring loose coupling and adherence to the Open/Closed Principle.")
                .providerUsed("CampusChanakya Academic Examiner (Strict Technical Engine)")
                .build();
    }

    @Override
    public String generateAiResponse(String prompt) {
        return callGeminiWithRotation(prompt);
    }
}

