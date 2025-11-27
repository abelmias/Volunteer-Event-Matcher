package com.volunteer.entity;

import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import javax.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "event_required_skills", indexes = {
    @Index(name = "idx_event_required_skills_event_id", columnList = "event_id"),
    @Index(name = "idx_event_required_skills_skill_id", columnList = "skill_id")
}, uniqueConstraints = {
    @UniqueConstraint(name = "uk_event_skill", columnNames = {"event_id", "skill_id"})
})
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class EventRequiredSkill {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(optional = false)
    @JoinColumn(name = "event_id", nullable = false)
    private Event event;

    @ManyToOne(optional = false)
    @JoinColumn(name = "skill_id", nullable = false)
    private Skill skill;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private VolunteerSkill.ProficiencyLevel minimumProficiency;

    @Column(nullable = false)
    private Boolean isMandatory = true;

    @CreationTimestamp
    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;
}
