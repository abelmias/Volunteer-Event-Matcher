package com.volunteer.entity;

import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import javax.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "event_matches", indexes = {
    @Index(name = "idx_event_matches_event_id", columnList = "event_id"),
    @Index(name = "idx_event_matches_volunteer_id", columnList = "volunteer_id"),
    @Index(name = "idx_event_matches_match_score", columnList = "match_score_col")
}, uniqueConstraints = {
    @UniqueConstraint(name = "uk_event_volunteer_match", columnNames = {"event_id", "volunteer_id"})
})
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class EventMatch {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(optional = false)
    @JoinColumn(name = "event_id", nullable = false)
    private Event event;

    @ManyToOne(optional = false)
    @JoinColumn(name = "volunteer_id", nullable = false)
    private User volunteer;

    @Column(name = "match_score_col", nullable = false, precision = 5, scale = 2)
    private BigDecimal matchScore;

    @Column(precision = 5, scale = 2)
    private BigDecimal skillMatchPercentage;

    @Column
    private Boolean availabilityMatch;

    @Column(precision = 10, scale = 2)
    private BigDecimal locationDistanceKm;

    @Column(columnDefinition = "TEXT")
    private String matchReason;

    @Column(nullable = false)
    private Boolean isNotified = false;

    @CreationTimestamp
    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;
}
