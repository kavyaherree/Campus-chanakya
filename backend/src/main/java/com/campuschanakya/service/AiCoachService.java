package com.campuschanakya.service;

import com.campuschanakya.dto.AiCoachChatRequest;
import com.campuschanakya.dto.AiCoachChatResponse;
import com.campuschanakya.model.User;

import java.util.List;
import java.util.Map;

public interface AiCoachService {
    AiCoachChatResponse processAgenticQuery(User user, AiCoachChatRequest request);
    List<Map<String, Object>> getActionPlan(User user);
    Map<String, Object> toggleActionItem(User user, String itemId, boolean completed);
}
