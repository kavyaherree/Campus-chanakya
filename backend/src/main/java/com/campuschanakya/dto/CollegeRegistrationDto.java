package com.campuschanakya.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CollegeRegistrationDto {

    @NotBlank(message = "College name is required")
    private String name;

    @NotBlank(message = "College code is required")
    private String code;

    private String domain;
    private String city;
    private String state;

    @NotBlank(message = "TPO / Admin contact name is required")
    private String adminName;

    @Email(message = "Valid official email is required")
    @NotBlank(message = "Official college email is required")
    private String contactEmail;

    private String contactPhone;

    private String password;
}

