package com.campuschanakya.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * ============================================================================
 * OOP ENCAPSULATION: ASSESSMENT START REQUEST DTO
 * ============================================================================
 * Initiates an anti-cheating proctored assessment session and begins server timer.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AssessmentStartRequest {

    @NotNull(message = "Student ID is required")
    private Long studentId;

    @NotBlank(message = "Skill name is required")
    private String skillName;
}
