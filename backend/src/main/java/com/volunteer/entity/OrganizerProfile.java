package com.volunteer.entity;

import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import javax.persistence.*;
import javax.validation.constraints.NotBlank;
import java.time.LocalDateTime;

@Entity
@Table(name = "organizer_profiles", indexes = {
    @Index(name = "idx_organizer_profiles_user_id", columnList = "user_id"),
    @Index(name = "idx_organizer_profiles_organization_name", columnList = "organization_name_col")
})
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OrganizerProfile {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(optional = false)
    @JoinColumn(name = "user_id", nullable = false, unique = true)
    private User user;

    @NotBlank(message = "Organization name is required")
    @Column(name = "organization_name_col", nullable = false, length = 200)
    private String organizationName;

    @Column(columnDefinition = "TEXT")
    private String organizationDescription;

    @Column(length = 500)
    private String organizationWebsite;

    @Column(length = 20)
    private String organizationPhone;

    @Column(length = 100)
    private String registrationNumber;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private VerificationStatus verificationStatus = VerificationStatus.UNVERIFIED;

    @CreationTimestamp
    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(nullable = false)
    private LocalDateTime updatedAt;

    public enum VerificationStatus {
        UNVERIFIED, PENDING, VERIFIED, REJECTED
    }
}
