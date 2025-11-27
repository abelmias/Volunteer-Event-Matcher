package com.volunteer.repository;

import com.volunteer.entity.Event;
import com.volunteer.entity.EventRequiredSkill;
import com.volunteer.entity.Skill;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface EventRequiredSkillRepository extends JpaRepository<EventRequiredSkill, Long> {
    List<EventRequiredSkill> findByEvent(Event event);
    List<EventRequiredSkill> findBySkill(Skill skill);
    Optional<EventRequiredSkill> findByEventAndSkill(Event event, Skill skill);
}
