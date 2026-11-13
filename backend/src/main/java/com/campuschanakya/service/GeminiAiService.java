package com.campuschanakya.service;

import com.campuschanakya.dto.AiVivaEvaluateRequest;
import com.campuschanakya.dto.AiVivaEvaluateResponse;
import com.campuschanakya.dto.AiVivaGenerateRequest;

import java.util.Map;

/**
 * ============================================================================
 * GEMINI AI SERVICE CONTRACT
 * ============================================================================
 * Interfaces with Google Gemini 2.0 Flash / LLM Provider with key rotation.
 */
public interface GeminiAiService {

    Map<String, Object> generateInterviewQuestion(AiVivaGenerateRequest request);

    AiVivaEvaluateResponse evaluateAnswer(AiVivaEvaluateRequest request);

    String generateAiResponse(String prompt);
}
