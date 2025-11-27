package com.volunteer.dto;

import com.volunteer.entity.VolunteerApplication;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class VolunteerApplicationDTO {
    private Long id;
    private Long eventId;
    private String eventTitle;
    private Long volunteerId;
    private String volunteerName;
    private VolunteerApplication.ApplicationStatus status;
    private LocalDateTime applicationDate;
    private LocalDateTime responseDate;
    private String motivationText;
    private Integer hoursCompleted;
    private Integer ratingFromOrganizer;
    private String feedbackFromOrganizer;
}
