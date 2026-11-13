package com.campuschanakya.repository;

import com.campuschanakya.model.Role;
import com.campuschanakya.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

/**
 * ============================================================================
 * USER REPOSITORY (SPRING DATA JPA)
 * ============================================================================
 * Provides abstracted persistence operations for User entities.
 */
public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);
    Optional<User> findByEmailIgnoreCase(String email);
    boolean existsByEmail(String email);
    boolean existsByEmailIgnoreCase(String email);
    List<User> findByRole(Role role);
}
