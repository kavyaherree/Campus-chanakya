package com.campuschanakya.dto;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MentorshipSlotBookingRequest {

    @NotNull(message = "Slot ID is mandatory")
    private Long slotId;

    private Long studentId; // Can be resolved from authentication context

    private String notes;
}
