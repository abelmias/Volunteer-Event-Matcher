package com.volunteer.entity;

import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import javax.persistence.*;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "events", indexes = {
    @Index(name = "idx_events_organizer_id", columnList = "organizer_id")
})
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Event {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(optional = false)
    @JoinColumn(name = "organizer_id", nullable = false)
    private User organizer;

    @NotBlank(message = "Event title is required")
    @Column(nullable = false, length = 200)
    private String title;

    @NotBlank(message = "Event description is required")
    @Column(nullable = false, columnDefinition = "TEXT")
    private String description;

    @NotBlank(message = "Event type is required")
    @Column(nullable = false, length = 50)
    private String eventType;

    @NotBlank(message = "Location is required")
    @Column(nullable = false, length = 500)
    private String location;

    @Column(precision = 10, scale = 8)
    private BigDecimal latitude;

    @Column(precision = 11, scale = 8)
    private BigDecimal longitude;

    @NotNull(message = "Event date is required")
    @Column(name = "event_date_col", nullable = false)
    private LocalDateTime eventDate;

    @Column
    private LocalDateTime endDate;

    @Column
    private Integer durationHours;

    @NotNull(message = "Number of volunteers needed is required")
    @Column(nullable = false)
    private Integer volunteersNeeded;

    @Column(nullable = false)
    private Integer volunteersConfirmed = 0;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private EventStatus status = EventStatus.DRAFT;

    @Column(length = 500)
    private String imageUrl;

    @CreationTimestamp
    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(nullable = false)
    private LocalDateTime updatedAt;

    // One-to-Many relationships
    @OneToMany(mappedBy = "event", cascade = CascadeType.ALL, orphanRemoval = true)
    private java.util.List<EventRequiredSkill> requiredSkills;

    @OneToMany(mappedBy = "event", cascade = CascadeType.ALL, orphanRemoval = true)
    private java.util.List<VolunteerApplication> applications;

    @OneToMany(mappedBy = "event", cascade = CascadeType.ALL, orphanRemoval = true)
    private java.util.List<EventMatch> matches;

    @OneToMany(mappedBy = "relatedEvent", cascade = CascadeType.ALL, orphanRemoval = true)
    private java.util.List<Notification> notifications;

    public enum EventStatus {
        DRAFT, PUBLISHED, IN_PROGRESS, COMPLETED, CANCELLED, PENDING_APPROVAL
    }
}
