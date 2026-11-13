package com.campuschanakya.controller;

import com.campuschanakya.dto.CollegeRegistrationDto;
import com.campuschanakya.model.College;
import com.campuschanakya.model.Role;
import com.campuschanakya.model.User;
import com.campuschanakya.repository.CollegeRepository;
import com.campuschanakya.repository.UserRepository;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.*;

/**
 * ============================================================================
 * TWO-TIER GOVERNANCE: COLLEGE MANAGEMENT CONTROLLER
 * ============================================================================
 * Handles college registration, superadmin college oversight, and institutional metrics.
 */
@RestController
@RequestMapping("/api/colleges")
@RequiredArgsConstructor
@Slf4j
public class CollegeController {

    private final CollegeRepository collegeRepository;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @GetMapping
    public ResponseEntity<List<Map<String, Object>>> getAllColleges() {
        List<College> colleges = collegeRepository.findAll();
        List<User> allUsers = userRepository.findAll();
        List<Map<String, Object>> response = new ArrayList<>();

        for (College c : colleges) {
            Map<String, Object> map = new HashMap<>();
            map.put("id", c.getId());
            map.put("name", c.getName());
            map.put("code", c.getCode());
            map.put("domain", c.getDomain());
            map.put("city", c.getCity());
            map.put("state", c.getState());
            map.put("contactEmail", c.getContactEmail());
            map.put("contactPhone", c.getContactPhone());
            map.put("status", c.getStatus());
            map.put("createdAt", c.getCreatedAt());

            User admin = c.getCollegeAdmin();
            if (admin != null) {
                map.put("adminName", admin.getFullName());
                map.put("adminEmail", admin.getEmail());
            } else {
                map.put("adminName", "TPO Cell");
                map.put("adminEmail", c.getContactEmail());
            }

            long students = allUsers.stream()
                    .filter(u -> u.getRole() == Role.STUDENT && u.getCollege() != null && u.getCollege().getId().equals(c.getId()))
                    .count();
            long alumni = allUsers.stream()
                    .filter(u -> u.getRole() == Role.ALUMNI && u.getCollege() != null && u.getCollege().getId().equals(c.getId()))
                    .count();
            long recruiters = allUsers.stream()
                    .filter(u -> u.getRole() == Role.RECRUITER && u.getCollege() != null && u.getCollege().getId().equals(c.getId()))
                    .count();

            map.put("studentCount", students);
            map.put("alumniCount", alumni);
            map.put("recruiterCount", recruiters);
            map.put("totalStakeholders", students + alumni + recruiters);

            response.add(map);
        }

        return ResponseEntity.ok(response);
    }

    @PostMapping("/register")
    public ResponseEntity<?> registerCollege(@Valid @RequestBody CollegeRegistrationDto dto) {
        log.info("Received college registration request for institution: {} ({})", dto.getName(), dto.getCode());

        String normalizedCode = dto.getCode().trim().toUpperCase();
        if (collegeRepository.existsByCode(normalizedCode)) {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body(Map.of("error", "College code '" + normalizedCode + "' is already registered."));
        }

        String email = dto.getContactEmail().trim().toLowerCase();
        
        // 1. Create or retrieve College Admin account
        User collegeAdmin = userRepository.findByEmail(email).orElse(null);
        String rawPassword = (dto.getPassword() != null && !dto.getPassword().trim().isEmpty())
                ? dto.getPassword().trim()
                : "password123";

        if (collegeAdmin == null) {
            collegeAdmin = User.builder()
                    .fullName(dto.getAdminName() != null ? dto.getAdminName().trim() : dto.getName() + " Administrator")
                    .email(email)
                    .passwordHash(passwordEncoder.encode(rawPassword))
                    .role(Role.ADMIN)
                    .build();
            collegeAdmin = userRepository.save(collegeAdmin);
        } else {
            collegeAdmin.setRole(Role.ADMIN);
            if (dto.getAdminName() != null) {
                collegeAdmin.setFullName(dto.getAdminName().trim());
            }
            collegeAdmin = userRepository.save(collegeAdmin);
        }

        // 2. Create and persist College
        College college = College.builder()
                .name(dto.getName().trim())
                .code(normalizedCode)
                .domain(dto.getDomain() != null ? dto.getDomain().trim() : null)
                .city(dto.getCity() != null ? dto.getCity().trim() : null)
                .state(dto.getState() != null ? dto.getState().trim() : null)
                .contactEmail(email)
                .contactPhone(dto.getContactPhone() != null ? dto.getContactPhone().trim() : null)
                .status("ACTIVE")
                .collegeAdmin(collegeAdmin)
                .build();

        College savedCollege = collegeRepository.save(college);

        // 3. Associate admin user with college
        collegeAdmin.setCollege(savedCollege);
        userRepository.save(collegeAdmin);

        log.info("College successfully registered: ID={}, Name={}, Code={}, Admin={}",
                savedCollege.getId(), savedCollege.getName(), savedCollege.getCode(), email);

        Map<String, Object> result = new HashMap<>();
        result.put("message", "College '" + savedCollege.getName() + "' registered successfully!");
        result.put("collegeId", savedCollege.getId());
        result.put("name", savedCollege.getName());
        result.put("code", savedCollege.getCode());
        result.put("adminEmail", email);
        result.put("role", "ADMIN");
        result.put("status", savedCollege.getStatus());

        return ResponseEntity.status(HttpStatus.CREATED).body(result);
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getCollegeById(@PathVariable Long id) {
        return collegeRepository.findById(id).map(c -> {
            List<User> affiliated = userRepository.findAll().stream()
                    .filter(u -> u.getCollege() != null && u.getCollege().getId().equals(c.getId()))
                    .toList();

            Map<String, Object> details = new HashMap<>();
            details.put("id", c.getId());
            details.put("name", c.getName());
            details.put("code", c.getCode());
            details.put("domain", c.getDomain());
            details.put("city", c.getCity());
            details.put("state", c.getState());
            details.put("contactEmail", c.getContactEmail());
            details.put("contactPhone", c.getContactPhone());
            details.put("status", c.getStatus());
            details.put("affiliatedUsersCount", affiliated.size());

            return ResponseEntity.ok(details);
        }).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<?> updateCollegeStatus(@PathVariable Long id, @RequestBody Map<String, String> payload) {
        String newStatus = payload.get("status");
        if (newStatus == null || newStatus.isBlank()) {
            return ResponseEntity.badRequest().body(Map.of("error", "Status field is required"));
        }

        return collegeRepository.findById(id).map(college -> {
            college.setStatus(newStatus.toUpperCase());
            collegeRepository.save(college);
            return ResponseEntity.ok(Map.of("message", "College status updated to " + college.getStatus()));
        }).orElseGet(() -> ResponseEntity.notFound().build());
    }
}

