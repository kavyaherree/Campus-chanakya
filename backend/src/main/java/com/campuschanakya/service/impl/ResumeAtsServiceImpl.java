package com.campuschanakya.service.impl;

import com.campuschanakya.dto.ResumeAnalyzeRequest;
import com.campuschanakya.dto.ResumeAnalyzeResponse;
import com.campuschanakya.model.StudentProfile;
import com.campuschanakya.model.User;
import com.campuschanakya.repository.StudentProfileRepository;
import com.campuschanakya.service.ResumeAtsService;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.nio.charset.StandardCharsets;
import java.util.*;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Service
@RequiredArgsConstructor
@Slf4j
public class ResumeAtsServiceImpl implements ResumeAtsService {

    private final StudentProfileRepository profileRepository;
    private final ObjectMapper objectMapper = new ObjectMapper();

    @Override
    public ResumeAnalyzeResponse uploadAndAnalyzeFile(MultipartFile file, String targetRole) {
        String extractedText = "";
        try {
            if (file == null || file.isEmpty()) {
                throw new IllegalArgumentException("Uploaded resume file cannot be empty.");
            }

            String originalName = file.getOriginalFilename() != null ? file.getOriginalFilename().toLowerCase() : "";
            byte[] bytes = file.getBytes();

            if (originalName.endsWith(".txt") || originalName.endsWith(".md") || originalName.endsWith(".csv")) {
                extractedText = new String(bytes, StandardCharsets.UTF_8);
            } else {
                // PDF / Binary text stream extraction: Extract ASCII printable words from stream
                StringBuilder sb = new StringBuilder();
                String raw = new String(bytes, StandardCharsets.ISO_8859_1);
                // Extract strings between parentheses in PDF text operators like (Hello World) Tj
                Pattern pattern = Pattern.compile("\\(([^()]+)\\)");
                Matcher matcher = pattern.matcher(raw);
                while (matcher.find()) {
                    String piece = matcher.group(1).trim();
                    if (piece.length() > 2 && piece.matches(".*[a-zA-Z].*")) {
                        sb.append(piece).append(" ");
                    }
                }

                if (sb.length() > 100) {
                    extractedText = sb.toString();
                } else {
                    // Fallback to sanitizing printable ASCII chunks
                    StringBuilder printable = new StringBuilder();
                    for (byte b : bytes) {
                        if ((b >= 32 && b <= 126) || b == 10 || b == 13) {
                            printable.append((char) b);
                        } else {
                            printable.append(' ');
                        }
                    }
                    extractedText = printable.toString().replaceAll("\\s+", " ").trim();
                }
            }
        } catch (Exception e) {
            log.warn("Error parsing resume file", e);
            extractedText = "";
        }

        return evaluateText(extractedText, targetRole != null ? targetRole : "Full Stack Java Engineer");
    }

    @Override
    public ResumeAnalyzeResponse analyzeResumeText(ResumeAnalyzeRequest request) {
        String text = request.getResumeText() != null ? request.getResumeText() : "";
        String role = request.getTargetRole() != null ? request.getTargetRole() : "Full Stack Java Engineer";
        return evaluateText(text, role);
    }

    @Override
    public Map<String, Object> saveResumeData(User user, Map<String, Object> resumeData) {
        if (resumeData != null) {
            StudentProfile profile = profileRepository.findByUser(user)
                    .or(() -> profileRepository.findByUserId(user.getId()))
                    .orElseGet(() -> profileRepository.save(StudentProfile.builder()
                            .user(user)
                            .cgpa(0.0)
                            .branch("Computer Science & Engineering")
                            .verifiedSkills(new ArrayList<>())
                            .build()));

            try {
                String json = objectMapper.writeValueAsString(resumeData);
                profile.setResumeDataJson(json);
                if (resumeData.containsKey("atsScore")) {
                    Object scoreObj = resumeData.get("atsScore");
                    if (scoreObj instanceof Number) {
                        profile.setAtsScore(((Number) scoreObj).intValue());
                    }
                }
                if (resumeData.containsKey("targetRole") && resumeData.get("targetRole") instanceof String) {
                    profile.setTargetRole((String) resumeData.get("targetRole"));
                }
                profileRepository.save(profile);
            } catch (Exception e) {
                log.error("Failed to save resume JSON to profile", e);
            }
        }
        return Map.of("success", true, "message", "Resume structured data saved successfully.");
    }

    @Override
    public Map<String, Object> getSavedResumeData(User user) {
        StudentProfile profile = profileRepository.findByUser(user)
                .or(() -> profileRepository.findByUserId(user.getId()))
                .orElse(null);

        if (profile != null && profile.getResumeDataJson() != null && !profile.getResumeDataJson().isBlank()) {
            try {
                return objectMapper.readValue(profile.getResumeDataJson(), new TypeReference<Map<String, Object>>() {});
            } catch (Exception ignored) {}
        }

        // Default template data for the resume builder
        return Map.of(
                "fullName", user.getFullName(),
                "email", user.getEmail(),
                "phone", "+91 98765 43210",
                "location", "Bengaluru, India",
                "targetRole", profile != null && profile.getTargetRole() != null ? profile.getTargetRole() : "Full Stack Java / Cloud Engineer",
                "summary", "High-performing Software Engineer with proven expertise in building high-throughput microservices using Java 21, Spring Boot 3, and React 18. Certified in OOP design patterns and invariant testing.",
                "experience", List.of(
                        Map.of(
                                "title", "Software Engineering Intern",
                                "company", "Chanakya Enterprise Cloud Labs",
                                "period", "Jan 2026 - Present",
                                "bullets", List.of(
                                        "Architected high-speed API endpoints reducing p99 latency by 38% using Spring Data JPA fetch joins.",
                                        "Implemented stateless JWT authorization filter pipeline securing 50,000+ daily candidate sessions.",
                                        "Engineered automated anti-cheat telemetry scoring engine with zero memory leaks."
                                )
                        )
                ),
                "education", List.of(
                        Map.of(
                                "degree", "B.Tech in " + (profile != null && profile.getBranch() != null ? profile.getBranch() : "Computer Science & Engineering"),
                                "institution", profile != null && profile.getCollege() != null ? profile.getCollege() : "National Institute of Technology",
                                "year", "2022 - 2026",
                                "cgpa", profile != null && profile.getCgpa() != null && profile.getCgpa() > 0 ? profile.getCgpa() + " / 10.0" : "0.0 / 10.0"
                        )
                ),
                "projects", List.of(
                        Map.of(
                                "name", "CampusChanakya Placement Engine",
                                "tech", "Java 21, Spring Boot 3, MySQL, React, Tailwind CSS",
                                "description", "Engineered an end-to-end placement engine with proctored invariant coding sandboxes and Gemini AI viva simulation."
                        ),
                        Map.of(
                                "name", "High-Throughput Atomic CAS Queue",
                                "tech", "Java Concurrency, AtomicLong, Memory Barriers",
                                "description", "Implemented a lock-free thread-safe counter handling 1.2M ops/second without thread contention."
                        )
                ),
                "skills", List.of("Java 21", "Spring Boot 3", "Spring Security", "React 18", "MySQL", "Docker", "RESTful APIs", "OOP Invariants", "Git")
        );
    }

    private ResumeAnalyzeResponse evaluateText(String text, String targetRole) {
        String lower = text.toLowerCase();
        int wordCount = text.trim().isEmpty() ? 0 : text.trim().split("\\s+").length;

        List<String> targetKeywords = getRoleKeywords(targetRole);

        // Instant rejection for empty, trivial, or gibberish resumes
        if (wordCount < 30) {
            return ResumeAnalyzeResponse.builder()
                    .atsScore(0)
                    .targetRole(targetRole)
                    .wordCount(wordCount)
                    .matchedKeywords(List.of())
                    .missingKeywords(targetKeywords)
                    .sectionsDetected(Map.of(
                            "Contact & Personal Information", false,
                            "Professional Summary / Objective", false,
                            "Technical Skills & Frameworks", false,
                            "Education & Academic CGPA", false,
                            "Projects & Architecture", false,
                            "Experience / Internships", false
                    ))
                    .categoryScores(Map.of(
                            "Technical Keyword Match", 0,
                            "Section Completeness", 0,
                            "Quantified Impact Metrics", 0,
                            "ATS Formatting & Readability", 0
                    ))
                    .improvementChecklist(List.of(
                            "Your uploaded resume is too short or empty (" + wordCount + " words). A standard resume should contain 300 to 800 words.",
                            "Include core sections: Contact Information, Education, Technical Skills, Projects, and Experience.",
                            "Add target keywords for " + targetRole + "."
                    ))
                    .powerActionVerbsSuggested(List.of("Architected", "Engineered", "Implemented", "Optimized", "Refactored"))
                    .rawExtractedText(text)
                    .build();
        }

        List<String> matched = new ArrayList<>();
        List<String> missing = new ArrayList<>();

        for (String kw : targetKeywords) {
            if (lower.contains(kw.toLowerCase())) {
                matched.add(kw);
            } else {
                missing.add(kw);
            }
        }

        // Section checks
        Map<String, Boolean> sections = new LinkedHashMap<>();
        sections.put("Contact & Personal Information", lower.contains("email") || lower.contains("@") || lower.contains("phone"));
        sections.put("Professional Summary / Objective", lower.contains("summary") || lower.contains("objective") || lower.contains("profile") || lower.contains("engineer"));
        sections.put("Technical Skills & Frameworks", lower.contains("skill") || lower.contains("technologies") || lower.contains("competencies") || lower.contains("java"));
        sections.put("Education & Academic CGPA", lower.contains("education") || lower.contains("b.tech") || lower.contains("cgpa") || lower.contains("university") || lower.contains("college"));
        sections.put("Projects & Architecture", lower.contains("project") || lower.contains("architecture") || lower.contains("github") || lower.contains("developed"));
        sections.put("Experience / Internships", lower.contains("experience") || lower.contains("intern") || lower.contains("role") || lower.contains("work"));

        long presentSections = sections.values().stream().filter(Boolean::booleanValue).count();
        int sectionScore = (int) Math.round((presentSections / (double) sections.size()) * 100);

        int keywordScore = targetKeywords.isEmpty() ? 0 : (int) Math.round(((double) matched.size() / targetKeywords.size()) * 100);
        int impactScore = lower.matches(".*\\d+%?.*") ? 92 : 30; // Has quantified numbers/percentages
        int formattingScore = (wordCount >= 250 && wordCount <= 900) ? 95 : (wordCount > 900) ? 70 : 40;

        // If no keywords matched and no sections detected, score is 0!
        int rawScore = (int) Math.round(keywordScore * 0.40 + sectionScore * 0.30 + impactScore * 0.15 + formattingScore * 0.15);
        int overallAts = (matched.isEmpty() || presentSections <= 1) ? Math.min(25, rawScore / 2) : Math.min(98, Math.max(10, rawScore));

        Map<String, Integer> categoryScores = Map.of(
                "Technical Keyword Match", keywordScore,
                "Section Completeness", sectionScore,
                "Quantified Impact Metrics", impactScore,
                "ATS Formatting & Readability", formattingScore
        );


        List<String> improvements = new ArrayList<>();
        if (!missing.isEmpty()) {
            improvements.add("Integrate high-frequency placement keywords: " + String.join(", ", missing.subList(0, Math.min(4, missing.size()))));
        }
        if (impactScore < 85) {
            improvements.add("Add measurable business metrics to your bullet points (e.g. 'boosted throughput by 35%', 'reduced memory footprint by 20%').");
        }
        if (!sections.get("Experience / Internships")) {
            improvements.add("Include an Experience or Industry Micro-Project section with active development responsibilities.");
        }
        improvements.add("Ensure your resume uses single-column layout without embedded textboxes or graphic tables for 100% ATS parseability.");

        List<String> verbs = List.of("Architected", "Engineered", "Optimized", "Refactored", "Spearheaded", "Implemented", "Deployed", "Benchmarked");

        return ResumeAnalyzeResponse.builder()
                .atsScore(overallAts)
                .targetRole(targetRole)
                .wordCount(wordCount)
                .matchedKeywords(matched)
                .missingKeywords(missing)
                .sectionsDetected(sections)
                .categoryScores(categoryScores)
                .improvementChecklist(improvements)
                .powerActionVerbsSuggested(verbs)
                .rawExtractedText(text.length() > 1200 ? text.substring(0, 1200) + "... [truncated]" : text)
                .build();
    }

    private List<String> getRoleKeywords(String role) {
        String r = role.toLowerCase();
        if (r.contains("front") || r.contains("react")) {
            return List.of("React", "JavaScript", "TypeScript", "Tailwind CSS", "Redux", "Hooks", "HTML5", "CSS3", "REST APIs", "Vite", "Performance Optimization", "Git");
        } else if (r.contains("data") || r.contains("ml") || r.contains("ai")) {
            return List.of("Python", "SQL", "Pandas", "NumPy", "TensorFlow", "Scikit-Learn", "Data Pipelines", "Machine Learning", "Git", "Docker", "Statistics");
        } else {
            // Default Java / Backend / Fullstack
            return List.of("Java 21", "Spring Boot", "Spring Security", "RESTful APIs", "Hibernate", "JPA", "MySQL", "Microservices", "Docker", "Git", "Data Structures", "Design Patterns", "JWT", "Unit Testing");
        }
    }
}
