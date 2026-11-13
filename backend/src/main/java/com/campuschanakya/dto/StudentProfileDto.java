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
public class StudentProfileDto {
    private Long id;
    private Long userId;
    private String fullName;
    private String email;
    private Double cgpa;
    private String branch;
    private Integer graduationYear;
    private String phone;
    private String college;
    private String enrollmentNumber;
    private String bio;
    private String targetRole;
    private String githubUrl;
    private String linkedinUrl;
    private String portfolioUrl;
    private String hollandCode;
    private String hollandArchetype;
    private String hollandScoresJson;
    private Integer atsScore;
    private String resumeDataJson;
    private String repeatedErrorsJson;
    private List<Map<String, Object>> repeatedErrors;
    private Double averageAssessmentScore;
    private Integer totalAssessmentsTaken;
    private Integer totalAssessmentsPassed;
    private Integer totalStrikesRecorded;
    private Double alumniEndorsementAvg;
    private Integer alumniEndorsementsCount;
    private List<String> verifiedSkills;
    private Map<String, Integer> riasecBreakdown;
}
