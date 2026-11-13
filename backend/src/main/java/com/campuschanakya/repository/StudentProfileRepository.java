package com.campuschanakya.repository;

import com.campuschanakya.model.StudentProfile;
import com.campuschanakya.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

/**
 * ============================================================================
 * STUDENT PROFILE REPOSITORY
 * ============================================================================
 */
public interface StudentProfileRepository extends JpaRepository<StudentProfile, Long> {
    Optional<StudentProfile> findByUser(User user);
    Optional<StudentProfile> findByUserId(Long userId);
}
