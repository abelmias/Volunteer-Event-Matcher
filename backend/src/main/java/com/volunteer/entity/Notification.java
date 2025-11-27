package com.volunteer.entity;

import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import javax.persistence.*;
import javax.validation.constraints.NotBlank;
import java.time.LocalDateTime;

@Entity
@Table(name = "notifications", indexes = {
    @Index(name = "idx_notifications_user_id", columnList = "user_id")
})
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Notification {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(optional = false)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @NotBlank(message = "Notification type is required")
    @Column(nullable = false, length = 50)
    private String type;

    @NotBlank(message = "Notification title is required")
    @Column(nullable = false, length = 200)
    private String title;

    @NotBlank(message = "Notification message is required")
    @Column(nullable = false, columnDefinition = "TEXT")
    private String message;

    @ManyToOne
    @JoinColumn(name = "related_event_id")
    private Event relatedEvent;

    @ManyToOne
    @JoinColumn(name = "related_application_id")
    private VolunteerApplication relatedApplication;

    @Column(nullable = false)
    private Boolean isRead = false;

    @CreationTimestamp
    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column
    private LocalDateTime readAt;
}
