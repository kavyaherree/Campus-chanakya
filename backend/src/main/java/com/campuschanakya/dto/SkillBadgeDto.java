package com.campuschanakya.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SkillBadgeDto {
    private String id;
    private String skillName;
    private String category;
    private String tier; // "BRONZE", "SILVER", "GOLD", "PLATINUM_MASTER"
    private Integer score;
    private Boolean verified;
    private String credentialId; // e.g. "CC-VERIFY-JAVA-8942-X7"
    private String verificationHash;
    private String issuedDate;
    private Integer proctoringStrikes;
    private String description;
    private List<String> verifiedInvariants;
    private String iconName;
    private String shareUrl;
}
