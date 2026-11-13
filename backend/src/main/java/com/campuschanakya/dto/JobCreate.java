package com.campuschanakya.dto;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

/**
 * ============================================================================
 * JOB CREATE DTO
 * ============================================================================
 * Encapsulates parameters for recruiters posting placement opportunities.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class JobCreate {

    @NotBlank(message = "Job title is required")
    private String title;

    @NotBlank(message = "Company is required")
    private String company;

    private String location;
    private String salaryPackage;

    @DecimalMin(value = "0.0")
    private Double minCgpa;

    private String description;
    private List<String> requiredSkills;
}
