package com.campuschanakya.service;

/**
 * ============================================================================
 * OTP SERVICE CONTRACT
 * ============================================================================
 * Handles generation, storage, and validation of one-time passwords for
 * email verification and password reset workflows.
 */
public interface OtpService {
    String generateOtp(String email, String purpose);
    String generateOtp(String email);
    boolean verifyOtp(String email, String otp);
    boolean isEmailVerified(String email);
    void clearOtp(String email);
}
