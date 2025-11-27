package com.volunteer.dto;

import com.volunteer.entity.Event;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class EventDTO {
    private Long id;
    private Long organizerId;
    private String organizerName;
    private String title;
    private String description;
    private String eventType;
    private String location;
    private BigDecimal latitude;
    private BigDecimal longitude;
    private LocalDateTime eventDate;
    private LocalDateTime endDate;
    private Integer durationHours;
    private Integer volunteersNeeded;
    private Integer volunteersConfirmed;
    private Event.EventStatus status;
    private String imageUrl;
    private LocalDateTime createdAt;
    private List<SkillDTO> requiredSkills;
}
