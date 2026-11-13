package com.campuschanakya.repository;

import com.campuschanakya.model.MentorshipSlot;
import com.campuschanakya.model.MentorshipSlotStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;

/**
 * ============================================================================
 * MENTORSHIP SLOT REPOSITORY
 * ============================================================================
 */
public interface MentorshipSlotRepository extends JpaRepository<MentorshipSlot, Long> {

    List<MentorshipSlot> findByAlumniId(Long alumniId);

    List<MentorshipSlot> findByTargetSkillAndStudentIsNull(String targetSkill);

    List<MentorshipSlot> findByTargetSkill(String targetSkill);

    List<MentorshipSlot> findByStudentId(Long studentId);

    List<MentorshipSlot> findByStatus(MentorshipSlotStatus status);

    @Query("SELECT m FROM MentorshipSlot m WHERE LOWER(m.targetSkill) LIKE LOWER(CONCAT('%', :skill, '%')) AND m.status = 'OPEN'")
    List<MentorshipSlot> findAvailableSlotsBySkillLike(@Param("skill") String skill);

    @Query("SELECT m FROM MentorshipSlot m WHERE m.status = 'OPEN'")
    List<MentorshipSlot> findAllAvailableSlots();
}
