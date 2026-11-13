package com.campuschanakya.service;

import com.campuschanakya.dto.AuthRequest;
import com.campuschanakya.dto.AuthResponse;

/**
 * ============================================================================
 * OOP PILLAR: ABSTRACTION (SERVICE CONTRACT)
 * ============================================================================
 * AuthService declares the abstract contract for identity management,
 * user registration, role provisioning, and JWT token issuance.
 */
public interface AuthService {
    AuthResponse register(AuthRequest request);
    AuthResponse login(AuthRequest request);
    AuthResponse loginWithOtp(String email, String otp);
    String sendOtp(String email, String purpose);
    boolean verifyOtp(String email, String otp);
    void resetPassword(String email, String otp, String newPassword);
}
