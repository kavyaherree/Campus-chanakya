package com.campuschanakya.dto;

import com.campuschanakya.model.Role;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * ============================================================================
 * OOP ENCAPSULATION: DTO
 * ============================================================================
 * Encapsulates the JWT token and authenticated user profile payload.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AuthResponse {
    private String token;
    private Long userId;
    private String email;
    private String fullName;
    private Role role;
    private Double cgpa;
    private String branch;
}
