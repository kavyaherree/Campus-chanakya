package com.campuschanakya.service;

/**
 * ============================================================================
 * EMAIL SERVICE CONTRACT (ABSTRACTION)
 * ============================================================================
 * Decouples business logic from low-level SMTP and MIME email transmission mechanics.
 */
public interface EmailService {

    /**
     * Sends an HTML-formatted OTP verification email.
     *
     * @param toEmail The destination email address
     * @param otpCode The 6-digit numeric verification code
     * @param purpose Context of verification: 'SIGNUP' or 'FORGOT_PASSWORD'
     */
    void sendOtpEmail(String toEmail, String otpCode, String purpose);
}
