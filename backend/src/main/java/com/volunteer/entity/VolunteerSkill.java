package com.volunteer.entity;

import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import javax.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "volunteer_skills", indexes = {
    @Index(name = "idx_volunteer_skills_volunteer_id", columnList = "volunteer_id"),
    @Index(name = "idx_volunteer_skills_skill_id", columnList = "skill_id")
}, uniqueConstraints = {
    @UniqueConstraint(name = "uk_volunteer_skill", columnNames = {"volunteer_id", "skill_id"})
})
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class VolunteerSkill {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(optional = false)
    @JoinColumn(name = "volunteer_id", nullable = false)
    private User volunteer;

    @ManyToOne(optional = false)
    @JoinColumn(name = "skill_id", nullable = false)
    private Skill skill;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private ProficiencyLevel proficiencyLevel;

    @Column(nullable = false)
    private Integer endorsementCount = 0;

    @CreationTimestamp
    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(nullable = false)
    private LocalDateTime updatedAt;

    public enum ProficiencyLevel {
        BEGINNER, INTERMEDIATE, ADVANCED, EXPERT
    }
}
