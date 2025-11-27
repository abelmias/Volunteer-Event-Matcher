package com.volunteer.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Positive;
import java.time.LocalDateTime;

/**
 * DTO for volunteer event submissions
 * Used when volunteers submit events for admin review
 * Does NOT include latitude/longitude (optional for volunteers)
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class VolunteerSubmitEventDTO {
    
    @NotBlank(message = "Event title is required")
    private String title;

    @NotBlank(message = "Event description is required")
    private String description;

    @NotBlank(message = "Event type is required")
    private String eventType;

    @NotBlank(message = "Location is required")
    private String location;

    @NotNull(message = "Event date is required")
    private LocalDateTime eventDate;

    private Integer durationHours;

    @NotNull(message = "Number of volunteers needed is required")
    @Positive(message = "Volunteers needed must be greater than 0")
    private Integer volunteersNeeded;

    @NotBlank(message = "Legitimacy description is required")
    private String legitimacyDescription;

    private String requirements;
    private String benefits;
}
