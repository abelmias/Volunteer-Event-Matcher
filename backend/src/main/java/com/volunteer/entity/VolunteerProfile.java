package com.volunteer.entity;

import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import javax.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "volunteer_profiles", indexes = {
    @Index(name = "idx_volunteer_profiles_user_id", columnList = "user_id")
})
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class VolunteerProfile {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(optional = false)
    @JoinColumn(name = "user_id", nullable = false, unique = true)
    private User user;

    @Column
    private Integer yearsOfExperience = 0;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private AvailabilityStatus availabilityStatus = AvailabilityStatus.AVAILABLE;

    @Column(length = 500)
    private String preferredEventTypes;

    @Column(columnDefinition = "TEXT")
    private String bioExtended;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private VerificationStatus verificationStatus = VerificationStatus.UNVERIFIED;

    @Column(nullable = false)
    private Boolean backgroundCheckCompleted = false;

    @CreationTimestamp
    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(nullable = false)
    private LocalDateTime updatedAt;

    public enum AvailabilityStatus {
        AVAILABLE, UNAVAILABLE, LIMITED
    }

    public enum VerificationStatus {
        UNVERIFIED, PENDING, VERIFIED, REJECTED
    }
}
