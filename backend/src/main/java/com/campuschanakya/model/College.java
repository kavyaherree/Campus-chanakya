package com.campuschanakya.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import lombok.*;

/**
 * ============================================================================
 * TWO-TIER ARCHITECTURE: COLLEGE / INSTITUTION ENTITY
 * ============================================================================
 * Tier 1 (Superadmin) oversees and onboards Colleges.
 * Tier 2 (College / Admin) manages its affiliated Students, Alumni, and Recruiters.
 */
@Entity
@Table(name = "colleges")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class College extends BaseEntity {

    @NotBlank(message = "College name is mandatory")
    @Column(name = "name", nullable = false)
    private String name;

    @NotBlank(message = "College code is mandatory")
    @Column(name = "code", nullable = false, unique = true)
    private String code;

    @Column(name = "domain")
    private String domain;

    @Column(name = "city")
    private String city;

    @Column(name = "state")
    private String state;

    @NotBlank(message = "Contact email is mandatory")
    @Column(name = "contact_email", nullable = false)
    private String contactEmail;

    @Column(name = "contact_phone")
    private String contactPhone;

    @Column(name = "status", nullable = false)
    @Builder.Default
    private String status = "ACTIVE"; // ACTIVE, PENDING, SUSPENDED

    @OneToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "college_admin_id")
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler", "college"})
    private User collegeAdmin;
}

