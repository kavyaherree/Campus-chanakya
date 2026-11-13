package com.campuschanakya.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Map;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class HollandAssessmentRequest {
    // Scores for R, I, A, S, E, C (0 to 100)
    private Map<String, Integer> scores;
    private Map<String, String> answers;
}
