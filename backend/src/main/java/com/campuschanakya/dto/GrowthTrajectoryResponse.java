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
public class GrowthTrajectoryResponse {
    private Integer overallPlacementReadiness;
    private String placementTierStatus; // e.g. "TIER_1_SUPER_DREAM"
    private Integer activeStreakDays;
    private Integer totalProblemsSolved;
    private Integer verifiedBadgesCount;
    private Double averageScore;

    // Monthly readiness progression (Area/Line chart)
    private List<Map<String, Object>> monthlyReadinessTrajectory;

    // 6-dimensional skill radar data
    private List<Map<String, Object>> skillRadarBreakdown;

    // Recent assessment velocity (Bar/Line chart)
    private List<Map<String, Object>> assessmentVelocity;

    // 30-day activity heatmap
    private List<Map<String, Object>> activityHeatmap;

    // Tier placement readiness probabilities
    private Map<String, Integer> tierProbabilities;

    // Milestone trajectory
    private List<Map<String, Object>> milestones;
}
