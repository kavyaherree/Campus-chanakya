package com.campuschanakya.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * ============================================================================
 * PROJECT SUBMIT DTO
 * ============================================================================
 * Encapsulates alumni project creation and student PR submissions.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProjectSubmit {
    private Long projectId;

    @NotBlank(message = "Title is required")
    private String title;

    private String description;
    private String techStack;
    private String projectType; // "MICRO" or "MACRO"
    private String githubTemplateUrl;

    // Student pull request submission fields
    private String studentGithubPrUrl;
    private String reviewFeedback;
    private String reviewStatus; // "PENDING", "APPROVED", "CHANGES_REQUESTED"
}
