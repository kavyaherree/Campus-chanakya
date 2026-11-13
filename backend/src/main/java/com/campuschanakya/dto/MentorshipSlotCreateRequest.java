package com.campuschanakya.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MentorshipSlotCreateRequest {

    private Long alumniId; // Can be resolved from authentication context

    @NotBlank(message = "Target skill is mandatory")
    private String targetSkill;

    @NotNull(message = "Scheduled timestamp is mandatory")
    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm[:ss]")
    private LocalDateTime scheduledAt;

    private String meetingUrl;

    private String notes;
}
