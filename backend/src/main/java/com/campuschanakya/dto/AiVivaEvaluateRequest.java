package com.campuschanakya.dto;

import lombok.Data;

@Data
public class AiVivaEvaluateRequest {
    private String topic;
    private String question;
    private String studentAnswer;
    private String candidateAnswer;
    private String difficulty;

    public String resolveAnswer() {
        if (studentAnswer != null && !studentAnswer.isBlank()) {
            return studentAnswer.trim();
        }
        if (candidateAnswer != null && !candidateAnswer.isBlank()) {
            return candidateAnswer.trim();
        }
        return "";
    }
}

