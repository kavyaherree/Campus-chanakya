package com.campuschanakya.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SendOtpRequest {

    @NotBlank(message = "Email is mandatory")
    @Email(message = "Must be a valid email format")
    private String email;

    private String purpose; // "SIGNUP" or "FORGOT_PASSWORD"
}
