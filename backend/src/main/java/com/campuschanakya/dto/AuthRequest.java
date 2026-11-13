package com.campuschanakya.dto;

import com.campuschanakya.model.Role;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * ============================================================================
 * OOP ENCAPSULATION: DTO
 * ============================================================================
 * Encapsulates credentials for Login or User Registration.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AuthRequest {

    @NotBlank(message = "Email is mandatory")
    @Email(message = "Must be a valid email format")
    private String email;

    @NotBlank(message = "Password cannot be blank")
    private String password;

    // Optional for login, mandatory for registration
    private String fullName;
    private Role role;

    // Student profile initial fields
    private Double cgpa;
    private String branch;

    // Email verification OTP (required for registration)
    private String otp;

    public void setEmail(String email) {
        this.email = email != null ? email.trim() : null;
    }
}
