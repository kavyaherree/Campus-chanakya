package com.campuschanakya.repository;

import com.campuschanakya.model.Job;
import com.campuschanakya.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

/**
 * ============================================================================
 * JOB REPOSITORY
 * ============================================================================
 */
public interface JobRepository extends JpaRepository<Job, Long> {
    List<Job> findByRecruiter(User recruiter);
    List<Job> findByMinCgpaLessThanEqual(Double cgpa);
}
