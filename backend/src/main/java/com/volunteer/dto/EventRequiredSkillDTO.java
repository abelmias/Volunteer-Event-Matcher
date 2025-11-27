package com.volunteer.dto;

import com.volunteer.entity.EventRequiredSkill;
import com.volunteer.entity.VolunteerSkill;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;
import java.time.LocalDateTime;

/**
 * DTO for Event Required Skill
 * Used for managing skills required by events
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class EventRequiredSkillDTO {

    private Long id;

    @NotNull(message = "Event ID is required")
    private Long eventId;

    @NotNull(message = "Skill ID is required")
    private Long skillId;

    private String skillName;

    @NotBlank(message = "Minimum proficiency level is required")
    private String minimumProficiency; // BEGINNER, INTERMEDIATE, ADVANCED, EXPERT

    private Boolean isMandatory;

    private LocalDateTime createdAt;

    /**
     * Convert DTO to Entity
     */
    public EventRequiredSkill toEntity() {
        return EventRequiredSkill.builder()
                .minimumProficiency(VolunteerSkill.ProficiencyLevel.valueOf(this.minimumProficiency))
                .isMandatory(this.isMandatory != null ? this.isMandatory : true)
                .build();
    }

    /**
     * Convert Entity to DTO
     */
    public static EventRequiredSkillDTO fromEntity(EventRequiredSkill skill) {
        return EventRequiredSkillDTO.builder()
                .id(skill.getId())
                .eventId(skill.getEvent().getId())
                .skillId(skill.getSkill().getId())
                .skillName(skill.getSkill().getName())
                .minimumProficiency(skill.getMinimumProficiency().toString())
                .isMandatory(skill.getIsMandatory())
                .createdAt(skill.getCreatedAt())
                .build();
    }
}
