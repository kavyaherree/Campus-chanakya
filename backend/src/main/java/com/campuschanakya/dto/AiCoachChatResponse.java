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
public class AiCoachChatResponse {
    private String responseMessage;
    // Multi-step agentic thoughts and actions
    private List<Map<String, String>> agentSteps;
    private List<Map<String, Object>> suggestedActions;
    private List<String> identifiedGaps;
    private List<String> topCompanyRecommendations;
    private Map<String, Object> diagnosticSummary;
}
