package com.campuschanakya.service;

import com.campuschanakya.dto.MentorshipSlotBookingRequest;
import com.campuschanakya.dto.MentorshipSlotCreateRequest;
import com.campuschanakya.model.MentorshipSlot;

import java.util.List;

/**
 * ============================================================================
 * OOP PILLAR: ABSTRACTION
 * ============================================================================
 * Orchestrates 1-on-1 alumni mentorship scheduling and reservations.
 * Enforces Signal-Over-Noise Gatekeeping via MentorshipGatingValidator.
 */
public interface MentorshipSlotService {

    MentorshipSlot createSlot(MentorshipSlotCreateRequest dto, Long alumniId);

    MentorshipSlot bookSlot(MentorshipSlotBookingRequest dto, Long studentId);

    List<MentorshipSlot> getAvailableSlots(Long studentId, String skill);

    List<MentorshipSlot> getAlumniSlots(Long alumniId);

    List<MentorshipSlot> getStudentBookedSlots(Long studentId);

    void deleteSlot(Long slotId, Long alumniId);
}

