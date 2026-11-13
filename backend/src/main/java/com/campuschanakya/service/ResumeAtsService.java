package com.campuschanakya.service;

import com.campuschanakya.dto.ResumeAnalyzeRequest;
import com.campuschanakya.dto.ResumeAnalyzeResponse;
import com.campuschanakya.model.User;
import org.springframework.web.multipart.MultipartFile;

import java.util.Map;

public interface ResumeAtsService {
    ResumeAnalyzeResponse uploadAndAnalyzeFile(MultipartFile file, String targetRole);
    ResumeAnalyzeResponse analyzeResumeText(ResumeAnalyzeRequest request);
    Map<String, Object> saveResumeData(User user, Map<String, Object> resumeData);
    Map<String, Object> getSavedResumeData(User user);
}
