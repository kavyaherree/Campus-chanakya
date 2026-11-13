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
public class AlumniMentorDto {
    private Long id;
    private String fullName;
    private String currentCompany; // e.g. "Google", "Microsoft", "Amazon", "Meta"
    private String roleTitle; // e.g. "Senior Staff Engineer (L6)"
    private String branch;
    private Integer graduationYear;
    private String avatarUrl;
    private List<String> expertiseTags;
    private Double rating;
    private Integer sessionsCompleted;
    private List<String> availableSlots;
    private String bio;
}
