package com.campuschanakya.controller;

import com.campuschanakya.dto.AuthRequest;
import com.campuschanakya.dto.AuthResponse;
import com.campuschanakya.dto.ResetPasswordRequest;
import com.campuschanakya.dto.SendOtpRequest;
import com.campuschanakya.dto.VerifyOtpRequest;
import com.campuschanakya.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

/**
 * ============================================================================
 * AUTHENTICATION REST CONTROLLER
 * ============================================================================
 * Provides public entry points for JWT login, user registration, OTP email verification,
 * and forgot password reset workflows.
 */
@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@Valid @RequestBody AuthRequest request) {
        return ResponseEntity.ok(authService.register(request));
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody AuthRequest request) {
        return ResponseEntity.ok(authService.login(request));
    }

    @PostMapping("/login-otp")
    public ResponseEntity<AuthResponse> loginWithOtp(@Valid @RequestBody VerifyOtpRequest request) {
        return ResponseEntity.ok(authService.loginWithOtp(request.getEmail(), request.getOtp()));
    }

    @PostMapping("/send-otp")
    public ResponseEntity<Map<String, Object>> sendOtp(@Valid @RequestBody SendOtpRequest request) {
        authService.sendOtp(request.getEmail(), request.getPurpose() != null ? request.getPurpose() : "SIGNUP");
        return ResponseEntity.ok(Map.of(
                "success", true,
                "message", "A 6-digit verification code has been dispatched to " + request.getEmail() + ". Please check your inbox and spam folder."
        ));
    }

    @PostMapping("/verify-otp")
    public ResponseEntity<Map<String, Object>> verifyOtp(@Valid @RequestBody VerifyOtpRequest request) {
        boolean valid = authService.verifyOtp(request.getEmail(), request.getOtp());
        if (!valid) {
            return ResponseEntity.badRequest().body(Map.of(
                    "success", false,
                    "message", "Invalid or expired verification code. Please check the code in your email or request a new one."
            ));
        }
        return ResponseEntity.ok(Map.of(
                "success", true,
                "verified", true,
                "message", "Email verified successfully."
        ));
    }

    @PostMapping("/forgot-password")
    public ResponseEntity<Map<String, Object>> forgotPassword(@Valid @RequestBody SendOtpRequest request) {
        authService.sendOtp(request.getEmail(), "FORGOT_PASSWORD");
        return ResponseEntity.ok(Map.of(
                "success", true,
                "message", "A password reset verification code has been dispatched to " + request.getEmail() + ". Please check your inbox and spam folder."
        ));
    }

    @PostMapping("/reset-password")
    public ResponseEntity<Map<String, Object>> resetPassword(@Valid @RequestBody ResetPasswordRequest request) {
        authService.resetPassword(request.getEmail(), request.getOtp(), request.getNewPassword());
        return ResponseEntity.ok(Map.of(
                "success", true,
                "message", "Password has been updated successfully. You can now log in."
        ));
    }
}
