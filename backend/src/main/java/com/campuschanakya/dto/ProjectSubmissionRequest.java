package com.campuschanakya.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProjectSubmissionRequest {

    @NotNull(message = "Project ID is mandatory")
    private Long projectId;

    private Long studentId; // Can be resolved from authentication context

    @NotBlank(message = "GitHub PR URL is mandatory")
    private String githubPrUrl;

    private String notes;
}
