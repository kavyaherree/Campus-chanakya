package com.campuschanakya.dto;

import com.campuschanakya.model.ProjectType;
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
public class ProjectCreateRequest {

    @NotBlank(message = "Title is mandatory")
    private String title;

    @NotBlank(message = "Description is mandatory")
    private String description;

    @NotBlank(message = "Target skill is mandatory")
    private String targetSkill;

    @NotNull(message = "Project type (MICRO/MACRO) is mandatory")
    private ProjectType projectType;

    private String starterRepoUrl;

    private String acceptanceCriteria;
}
