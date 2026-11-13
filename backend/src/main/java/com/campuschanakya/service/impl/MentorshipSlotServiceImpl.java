package com.campuschanakya.service.impl;

import com.campuschanakya.dto.MentorshipSlotBookingRequest;
import com.campuschanakya.dto.MentorshipSlotCreateRequest;
import com.campuschanakya.model.MentorshipSlot;
import com.campuschanakya.model.MentorshipSlotStatus;
import com.campuschanakya.model.User;
import com.campuschanakya.repository.MentorshipSlotRepository;
import com.campuschanakya.repository.UserRepository;
import com.campuschanakya.service.MentorshipGatingValidator;
import com.campuschanakya.service.MentorshipSlotService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/**
 * ============================================================================
 * OOP ABSTRACTION: MENTORSHIP SLOT SERVICE IMPLEMENTATION
 * ============================================================================
 * Coordinates 1:1 availability and bookings with alumni mentors.
 * Enforces Signal-Over-Noise Gatekeeping.
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class MentorshipSlotServiceImpl implements MentorshipSlotService {

    private final MentorshipSlotRepository slotRepository;
    private final UserRepository userRepository;
    private final MentorshipGatingValidator gatingValidator;

    @Override
    @Transactional
    public MentorshipSlot createSlot(MentorshipSlotCreateRequest dto, Long alumniId) {
        Long resolvedAlumniId = (dto.getAlumniId() != null) ? dto.getAlumniId() : alumniId;
        User alumni = userRepository.findById(resolvedAlumniId)
                .orElseThrow(() -> new IllegalArgumentException("Alumni mentor not found: " + resolvedAlumniId));

        MentorshipSlot slot = MentorshipSlot.builder()
                .alumni(alumni)
                .targetSkill(dto.getTargetSkill())
                .scheduledAt(dto.getScheduledAt())
                .meetingUrl(dto.getMeetingUrl())
                .notes(dto.getNotes())
                .status(MentorshipSlotStatus.OPEN)
                .build();

        MentorshipSlot saved = slotRepository.save(slot);
        log.info("Alumni #{} opened mentorship slot #{} for '{}' at {}",
                alumni.getId(), saved.getId(), saved.getTargetSkill(), saved.getScheduledAt());
        return saved;
    }

    @Override
    @Transactional
    public MentorshipSlot bookSlot(MentorshipSlotBookingRequest dto, Long studentId) {
        Long resolvedStudentId = (dto.getStudentId() != null) ? dto.getStudentId() : studentId;
        User student = userRepository.findById(resolvedStudentId)
                .orElseThrow(() -> new IllegalArgumentException("Student not found: " + resolvedStudentId));

        MentorshipSlot slot = slotRepository.findById(dto.getSlotId())
                .orElseThrow(() -> new IllegalArgumentException("Mentorship slot not found: " + dto.getSlotId()));

        if (slot.getStatus() != MentorshipSlotStatus.OPEN) {
            throw new IllegalStateException("Mentorship slot is no longer available. Current status: " + slot.getStatus());
        }

        // SIGNAL-OVER-NOISE GATEKEEPING:
        // Validate student has verified assessment badge for this slot's target skill
        gatingValidator.validateStudentSkillVerification(resolvedStudentId, slot.getTargetSkill());

        slot.setStudent(student);
        slot.setStatus(MentorshipSlotStatus.BOOKED);
        if (dto.getNotes() != null && !dto.getNotes().isBlank()) {
            slot.setNotes((slot.getNotes() != null ? slot.getNotes() + " | Mentee goal: " : "") + dto.getNotes());
        }

        MentorshipSlot saved = slotRepository.save(slot);
        log.info("Signal-Over-Noise Gatekeeping PASSED: Student #{} booked slot #{} with Alumnus #{} for '{}'",
                student.getId(), saved.getId(), saved.getAlumni().getId(), saved.getTargetSkill());
        return saved;
    }

    @Override
    @Transactional(readOnly = true)
    public List<MentorshipSlot> getAvailableSlots(Long studentId, String skill) {
        // Enforce Signal-Over-Noise Gatekeeping
        if (skill != null && !skill.isBlank()) {
            gatingValidator.validateStudentSkillVerification(studentId, skill);
            List<MentorshipSlot> matches = slotRepository.findAvailableSlotsBySkillLike(skill);
            if (!matches.isEmpty()) {
                return matches;
            }
        }
        return slotRepository.findAllAvailableSlots();
    }

    @Override
    @Transactional(readOnly = true)
    public List<MentorshipSlot> getAlumniSlots(Long alumniId) {
        return slotRepository.findByAlumniId(alumniId);
    }

    @Override
    @Transactional(readOnly = true)
    public List<MentorshipSlot> getStudentBookedSlots(Long studentId) {
        return slotRepository.findByStudentId(studentId);
    }

    @Override
    @Transactional
    public void deleteSlot(Long slotId, Long alumniId) {
        MentorshipSlot slot = slotRepository.findById(slotId)
                .orElseThrow(() -> new IllegalArgumentException("Mentorship slot not found: " + slotId));
        if (slot.getAlumni() != null && !slot.getAlumni().getId().equals(alumniId)) {
            throw new org.springframework.security.access.AccessDeniedException("You are not authorized to delete this slot");
        }
        slotRepository.delete(slot);
        log.info("Mentorship slot #{} deleted by Alumni #{}", slotId, alumniId);
    }
}

