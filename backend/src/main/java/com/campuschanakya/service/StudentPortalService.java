package com.campuschanakya.service;

import com.campuschanakya.dto.*;
import com.campuschanakya.model.User;

import java.util.List;

public interface StudentPortalService {
    StudentProfileDto getStudentProfile(User user);
    StudentProfileDto updateStudentProfile(User user, StudentProfileDto dto);
    HollandAssessmentResponse evaluateHollandAssessment(User user, HollandAssessmentRequest request);
    List<SkillBadgeDto> getStudentBadges(User user);
    SkillBadgeDto verifyBadge(String credentialId);
    GrowthTrajectoryResponse getGrowthTrajectory(User user);
}
