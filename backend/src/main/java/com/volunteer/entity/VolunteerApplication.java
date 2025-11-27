package com.volunteer.entity;

import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import javax.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "volunteer_applications", indexes = {
    @Index(name = "idx_volunteer_applications_event_id", columnList = "event_id"),
    @Index(name = "idx_volunteer_applications_volunteer_id", columnList = "volunteer_id"),
    @Index(name = "idx_volunteer_applications_status", columnList = "status")
}, uniqueConstraints = {
    @UniqueConstraint(name = "uk_event_volunteer_app", columnNames = {"event_id", "volunteer_id"})
})
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class VolunteerApplication {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(optional = false)
    @JoinColumn(name = "event_id", nullable = false)
    private Event event;

    @ManyToOne(optional = false)
    @JoinColumn(name = "volunteer_id", nullable = false)
    private User volunteer;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private ApplicationStatus status = ApplicationStatus.PENDING;

    @CreationTimestamp
    @Column(nullable = false, updatable = false)
    private LocalDateTime applicationDate;

    @Column
    private LocalDateTime responseDate;

    @Column(columnDefinition = "TEXT")
    private String motivationText;

    @Column
    private Integer hoursCompleted;

    @Column(length = 1)
    private Integer ratingFromOrganizer;

    @Column(columnDefinition = "TEXT")
    private String feedbackFromOrganizer;

    @CreationTimestamp
    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(nullable = false)
    private LocalDateTime updatedAt;

    // One-to-Many relationships
    @OneToMany(mappedBy = "relatedApplication", cascade = CascadeType.ALL, orphanRemoval = true)
    private java.util.List<Notification> notifications;

    public enum ApplicationStatus {
        PENDING, APPROVED, REJECTED, WITHDRAWN, COMPLETED
    }
}
