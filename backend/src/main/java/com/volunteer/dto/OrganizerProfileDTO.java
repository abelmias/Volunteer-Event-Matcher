package com.volunteer.dto;

import com.volunteer.entity.OrganizerProfile;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;
import java.time.LocalDateTime;

/**
 * DTO for Organizer Profile
 * Used for creating and updating organizer profiles
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OrganizerProfileDTO {

    private Long id;

    @NotNull(message = "User ID is required")
    private Long userId;

    @NotBlank(message = "Organization name is required")
    private String organizationName;

    private String organizationDescription;

    private String organizationWebsite;

    private String organizationPhone;

    private String registrationNumber;

    private String verificationStatus; // UNVERIFIED, PENDING, VERIFIED, REJECTED

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;

    /**
     * Convert DTO to Entity
     */
    public OrganizerProfile toEntity() {
        return OrganizerProfile.builder()
                .id(this.id)
                .organizationName(this.organizationName)
                .organizationDescription(this.organizationDescription)
                .organizationWebsite(this.organizationWebsite)
                .organizationPhone(this.organizationPhone)
                .registrationNumber(this.registrationNumber)
                .verificationStatus(OrganizerProfile.VerificationStatus.valueOf(
                        this.verificationStatus != null ? this.verificationStatus : "UNVERIFIED"))
                .build();
    }

    /**
     * Convert Entity to DTO
     */
    public static OrganizerProfileDTO fromEntity(OrganizerProfile profile) {
        return OrganizerProfileDTO.builder()
                .id(profile.getId())
                .userId(profile.getUser().getId())
                .organizationName(profile.getOrganizationName())
                .organizationDescription(profile.getOrganizationDescription())
                .organizationWebsite(profile.getOrganizationWebsite())
                .organizationPhone(profile.getOrganizationPhone())
                .registrationNumber(profile.getRegistrationNumber())
                .verificationStatus(profile.getVerificationStatus().toString())
                .createdAt(profile.getCreatedAt())
                .updatedAt(profile.getUpdatedAt())
                .build();
    }
}
