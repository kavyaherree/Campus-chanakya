package com.campuschanakya.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BookSessionRequest {
    private Long mentorId;
    private String slot; // e.g. "Tomorrow, 6:00 PM IST"
    private String sessionTopic; // e.g. "System Design & Mock Viva", "ATS Resume Critique"
    private String notes;
}
