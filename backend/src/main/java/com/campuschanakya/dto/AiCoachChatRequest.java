package com.campuschanakya.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;


@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AiCoachChatRequest {
    private String message;
    private String targetRole;
    private String contextIntent; // "DIAGNOSE", "PLAN", "SKILL_GAP", "PLACEMENT_STRATEGY", "CHAT"
}
