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
public class HollandAssessmentResponse {
    private String hollandCode; // e.g. "IRC"
    private String primaryTrait;
    private String secondaryTrait;
    private String tertiaryTrait;
    private String archetypeTitle;
    private String psychologicalProfile;
    private Map<String, Integer> traitPercentages;
    private List<String> recommendedCareerPaths;
    private List<String> topPlacementRoles;
    private List<String> suggestedSkillsToMaster;
    private String workStyleDescription;
}
