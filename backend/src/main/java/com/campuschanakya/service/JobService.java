package com.campuschanakya.service;

import com.campuschanakya.dto.JobCreate;
import com.campuschanakya.model.Application;
import com.campuschanakya.model.Job;

import java.util.List;

/**
 * ============================================================================
 * OOP PILLAR: ABSTRACTION
 * ============================================================================
 * JobService manages job creation, applicant ATS match ranking, and status updates.
 */
public interface JobService {
    Job postJob(Long recruiterId, JobCreate jobDto);
    List<Job> getAllJobs();
    List<Job> getJobsForStudent(Long studentId);
    Application applyForJob(Long studentId, Long jobId);
    List<Application> getJobApplicantsRanked(Long jobId);
    Application updateApplicationStatus(Long applicationId, String status);
}
