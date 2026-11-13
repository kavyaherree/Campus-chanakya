package com.campuschanakya.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.Map;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ResumeAnalyzeResponse {
    private Integer atsScore; // 0 to 100
    private String targetRole;
    private Integer wordCount;
    private List<String> matchedKeywords;
    private List<String> missingKeywords;
    private Map<String, Boolean> sectionsDetected;
    private Map<String, Integer> categoryScores; // "Formatting", "KeywordMatch", "ImpactMetrics", "ActionVerbs"
    private List<String> improvementChecklist;
    private List<String> powerActionVerbsSuggested;
    private String rawExtractedText;
}
