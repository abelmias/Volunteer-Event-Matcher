package com.volunteer.repository;

import com.volunteer.entity.Skill;
import com.volunteer.entity.User;
import com.volunteer.entity.VolunteerSkill;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface VolunteerSkillRepository extends JpaRepository<VolunteerSkill, Long> {

    List<VolunteerSkill> findByVolunteer(User volunteer);

    List<VolunteerSkill> findBySkill(Skill skill);

    Optional<VolunteerSkill> findByVolunteerAndSkill(User volunteer, Skill skill);

    @Query("SELECT vs FROM VolunteerSkill vs WHERE vs.volunteer = :volunteer ORDER BY vs.proficiencyLevel DESC")
    List<VolunteerSkill> findByVolunteerOrderByProficiency(@Param("volunteer") User volunteer);

    @Query("SELECT vs FROM VolunteerSkill vs WHERE vs.skill = :skill ORDER BY vs.endorsementCount DESC")
    List<VolunteerSkill> findBySkillOrderByEndorsements(@Param("skill") Skill skill);

    @Query("SELECT vs FROM VolunteerSkill vs WHERE vs.volunteer = :volunteer AND vs.proficiencyLevel IN ('ADVANCED', 'EXPERT')")
    List<VolunteerSkill> findAdvancedSkillsByVolunteer(@Param("volunteer") User volunteer);

    @Query("SELECT vs FROM VolunteerSkill vs WHERE vs.volunteer.id = :volunteerId")
    List<VolunteerSkill> findByVolunteerId(@Param("volunteerId") Long volunteerId);

    @Query("SELECT vs FROM VolunteerSkill vs WHERE vs.volunteer.id = :volunteerId AND vs.skill.id = :skillId")
    Optional<VolunteerSkill> findByVolunteerIdAndSkillId(@Param("volunteerId") Long volunteerId, @Param("skillId") Long skillId);
}
