package com.campuschanakya.dto;

import com.campuschanakya.model.SubmissionStatus;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProjectReviewRequest {

    @NotNull(message = "Submission ID is mandatory")
    private Long submissionId;

    private Long alumniId; // Can be resolved from authentication context

    @NotNull(message = "Review status (APPROVED / REVISION_REQUESTED) is mandatory")
    private SubmissionStatus status;

    private String alumniFeedback;

    @Min(value = 1, message = "Endorsement rating must be at least 1 star")
    @Max(value = 5, message = "Endorsement rating cannot exceed 5 stars")
    private Integer endorsementScore; // 1 to 5 stars
}
