package com.campuschanakya.repository;

import com.campuschanakya.model.Application;
import com.campuschanakya.model.Job;
import com.campuschanakya.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

/**
 * ============================================================================
 * APPLICATION REPOSITORY
 * ============================================================================
 */
public interface ApplicationRepository extends JpaRepository<Application, Long> {
    List<Application> findByStudent(User student);
    List<Application> findByJob(Job job);
    List<Application> findByJobIdOrderByAtsScoreDesc(Long jobId);
    Optional<Application> findByStudentAndJob(User student, Job job);
    boolean existsByStudentAndJob(User student, Job job);
}
