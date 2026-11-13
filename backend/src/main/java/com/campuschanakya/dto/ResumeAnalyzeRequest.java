package com.campuschanakya.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Map;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ResumeAnalyzeRequest {
    private String resumeText;
    private String targetRole;
    private Map<String, Object> structuredResumeData;
}
