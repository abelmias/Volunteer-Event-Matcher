package com.volunteer.dto;

import com.volunteer.entity.VolunteerProfile;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.validation.constraints.Min;
import javax.validation.constraints.NotNull;
import java.time.LocalDateTime;

/**
 * DTO for Volunteer Profile
 * Used for creating and updating volunteer profiles
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class VolunteerProfileDTO {

    private Long id;

    @NotNull(message = "User ID is required")
    private Long userId;

    @Min(value = 0, message = "Years of experience cannot be negative")
    private Integer yearsOfExperience;

    private String availabilityStatus; // AVAILABLE, UNAVAILABLE, LIMITED

    private String preferredEventTypes;

    private String bioExtended;

    private String verificationStatus; // UNVERIFIED, PENDING, VERIFIED, REJECTED

    private Boolean backgroundCheckCompleted;

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;

    /**
     * Convert DTO to Entity
     */
    public VolunteerProfile toEntity() {
        return VolunteerProfile.builder()
                .id(this.id)
                .yearsOfExperience(this.yearsOfExperience != null ? this.yearsOfExperience : 0)
                .availabilityStatus(VolunteerProfile.AvailabilityStatus.valueOf(
                        this.availabilityStatus != null ? this.availabilityStatus : "AVAILABLE"))
                .preferredEventTypes(this.preferredEventTypes)
                .bioExtended(this.bioExtended)
                .verificationStatus(VolunteerProfile.VerificationStatus.valueOf(
                        this.verificationStatus != null ? this.verificationStatus : "UNVERIFIED"))
                .backgroundCheckCompleted(this.backgroundCheckCompleted != null ? this.backgroundCheckCompleted : false)
                .build();
    }

    /**
     * Convert Entity to DTO
     */
    public static VolunteerProfileDTO fromEntity(VolunteerProfile profile) {
        return VolunteerProfileDTO.builder()
                .id(profile.getId())
                .userId(profile.getUser().getId())
                .yearsOfExperience(profile.getYearsOfExperience())
                .availabilityStatus(profile.getAvailabilityStatus().toString())
                .preferredEventTypes(profile.getPreferredEventTypes())
                .bioExtended(profile.getBioExtended())
                .verificationStatus(profile.getVerificationStatus().toString())
                .backgroundCheckCompleted(profile.getBackgroundCheckCompleted())
                .createdAt(profile.getCreatedAt())
                .updatedAt(profile.getUpdatedAt())
                .build();
    }
}
