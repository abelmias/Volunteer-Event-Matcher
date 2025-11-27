package com.volunteer.dto;

import com.volunteer.entity.VolunteerSkill;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;
import java.time.LocalDateTime;

/**
 * DTO for Volunteer Skill
 * Used for adding/updating volunteer skills
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class VolunteerSkillDTO {

    private Long id;

    @NotNull(message = "Volunteer ID is required")
    private Long volunteerId;

    @NotNull(message = "Skill ID is required")
    private Long skillId;

    @NotBlank(message = "Proficiency level is required")
    private String proficiencyLevel; // BEGINNER, INTERMEDIATE, ADVANCED, EXPERT

    private Integer endorsementCount;

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;

    /**
     * Convert DTO to Entity
     */
    public VolunteerSkill toEntity() {
        return VolunteerSkill.builder()
                .id(this.id)
                .proficiencyLevel(VolunteerSkill.ProficiencyLevel.valueOf(this.proficiencyLevel))
                .endorsementCount(this.endorsementCount != null ? this.endorsementCount : 0)
                .build();
    }

    /**
     * Convert Entity to DTO
     */
    public static VolunteerSkillDTO fromEntity(VolunteerSkill skill) {
        return VolunteerSkillDTO.builder()
                .id(skill.getId())
                .volunteerId(skill.getVolunteer().getId())
                .skillId(skill.getSkill().getId())
                .proficiencyLevel(skill.getProficiencyLevel().toString())
                .endorsementCount(skill.getEndorsementCount())
                .createdAt(skill.getCreatedAt())
                .updatedAt(skill.getUpdatedAt())
                .build();
    }
}
