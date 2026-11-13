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
public class AiVivaEvaluateResponse {
    private Long assessmentId;
    private int overallScore;
    private String grade;
    private boolean passed;
    private String verdict;
    private String feedback;
    private String feedbackSummary;
    private Map<String, Integer> pillarScores;
    private int technicalAccuracyScore;
    private int oopAlignmentScore;
    private int placementReadinessScore;
    private List<String> strengths;
    private List<String> keyStrengths;
    private List<String> weaknessTips;
    private List<String> areasOfImprovement;
    private String recommendedModelAnswer;
    private String providerUsed;
}

