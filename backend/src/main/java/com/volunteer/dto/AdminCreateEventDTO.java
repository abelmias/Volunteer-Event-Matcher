package com.volunteer.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Positive;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

/**
 * DTO for admin/organizer event creation
 * Used when admins or organizers create events directly
 * Includes latitude/longitude for geolocation features
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AdminCreateEventDTO {
    
    @NotBlank(message = "Event title is required")
    private String title;

    @NotBlank(message = "Event description is required")
    private String description;

    @NotBlank(message = "Event type is required")
    private String eventType;

    @NotBlank(message = "Location is required")
    private String location;

    private BigDecimal latitude;
    private BigDecimal longitude;

    @NotNull(message = "Event date is required")
    private LocalDateTime eventDate;

    private LocalDateTime endDate;
    private Integer durationHours;

    @NotNull(message = "Number of volunteers needed is required")
    @Positive(message = "Volunteers needed must be greater than 0")
    private Integer volunteersNeeded;

    private String imageUrl;
    
    private List<Long> requiredSkillIds;
}
