package com.campuschanakya.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;

/**
 * ============================================================================
 * OOP PILLAR: INHERITANCE & ENCAPSULATION
 * ============================================================================
 * User extends BaseEntity, inheriting primary key and audit timestamps.
 * Encapsulation is guaranteed via private access modifiers and validation rules.
 * Affiliated with a College for two-tier governance (Students, Alumni, Recruiters).
 */
@Entity
@Table(name = "users")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class User extends BaseEntity {

    @NotBlank(message = "Full name is mandatory")
    @Column(name = "full_name", nullable = false)
    private String fullName;

    @Email(message = "Email must be a valid RFC format")
    @NotBlank(message = "Email is mandatory")
    @Column(name = "email", nullable = false, unique = true)
    private String email;

    @JsonIgnore
    @NotBlank(message = "Password hash cannot be empty")
    @Column(name = "password_hash", nullable = false)
    private String passwordHash;

    @NotNull(message = "Role is mandatory")
    @Enumerated(EnumType.STRING)
    @Column(name = "role", nullable = false)
    private Role role;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "college_id")
    @JsonIgnoreProperties({"collegeAdmin", "hibernateLazyInitializer", "handler"})
    private College college;
}
