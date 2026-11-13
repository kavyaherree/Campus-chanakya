package com.campuschanakya.controller;

import com.campuschanakya.dto.AiCoachChatRequest;
import com.campuschanakya.dto.AiCoachChatResponse;
import com.campuschanakya.model.User;
import com.campuschanakya.repository.UserRepository;
import com.campuschanakya.service.AiCoachService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/ai/coach")
@RequiredArgsConstructor
public class AiCoachController {

    private final AiCoachService aiCoachService;
    private final UserRepository userRepository;

    private User resolveUser(User authenticated) {
        if (authenticated != null) {
            return authenticated;
        }
        return userRepository.findByEmail("student@campus.edu")
                .or(() -> userRepository.findAll().stream().findFirst())
                .orElseThrow(() -> new IllegalStateException("No active student user found"));
    }

    @PostMapping("/chat")
    public ResponseEntity<AiCoachChatResponse> chat(
            @AuthenticationPrincipal User user,
            @RequestBody AiCoachChatRequest request
    ) {
        return ResponseEntity.ok(aiCoachService.processAgenticQuery(resolveUser(user), request));
    }

    @GetMapping("/action-plan")
    public ResponseEntity<List<Map<String, Object>>> getActionPlan(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(aiCoachService.getActionPlan(resolveUser(user)));
    }

    @PostMapping("/action-plan/toggle")
    public ResponseEntity<Map<String, Object>> toggleActionItem(
            @AuthenticationPrincipal User user,
            @RequestBody Map<String, Object> payload
    ) {
        String itemId = (String) payload.get("itemId");
        boolean completed = Boolean.TRUE.equals(payload.get("completed"));
        return ResponseEntity.ok(aiCoachService.toggleActionItem(resolveUser(user), itemId, completed));
    }
}
