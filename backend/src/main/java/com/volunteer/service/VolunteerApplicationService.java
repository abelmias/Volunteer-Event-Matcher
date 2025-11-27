package com.volunteer.service;

import com.volunteer.dto.VolunteerApplicationDTO;
import com.volunteer.entity.Event;
import com.volunteer.entity.User;
import com.volunteer.entity.VolunteerApplication;
import com.volunteer.repository.EventRepository;
import com.volunteer.repository.VolunteerApplicationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class VolunteerApplicationService {

    private final VolunteerApplicationRepository applicationRepository;
    private final EventRepository eventRepository;

    public VolunteerApplicationDTO applyToEvent(Long eventId, User volunteer) {
        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new RuntimeException("Event not found"));

        if (applicationRepository.findByEventAndVolunteer(event, volunteer).isPresent()) {
            throw new RuntimeException("Already applied to this event");
        }

        VolunteerApplication application = VolunteerApplication.builder()
                .event(event)
                .volunteer(volunteer)
                .status(VolunteerApplication.ApplicationStatus.PENDING)
                .build();

        VolunteerApplication savedApplication = applicationRepository.save(application);
        return convertToDTO(savedApplication);
    }

    public VolunteerApplicationDTO getApplicationById(Long id) {
        VolunteerApplication application = applicationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Application not found"));
        return convertToDTO(application);
    }

    public List<VolunteerApplicationDTO> getApplicationsByVolunteer(User volunteer) {
        return applicationRepository.findByVolunteer(volunteer).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public List<VolunteerApplicationDTO> getApplicationsByEvent(Long eventId) {
        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new RuntimeException("Event not found"));
        return applicationRepository.findByEvent(event).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public List<VolunteerApplicationDTO> getPendingApplicationsForOrganizer(User organizer) {
        return applicationRepository.findPendingApplicationsForOrganizer(organizer).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public VolunteerApplicationDTO approveApplication(Long applicationId) {
        VolunteerApplication application = applicationRepository.findById(applicationId)
                .orElseThrow(() -> new RuntimeException("Application not found"));

        application.setStatus(VolunteerApplication.ApplicationStatus.APPROVED);
        application.getEvent().setVolunteersConfirmed(application.getEvent().getVolunteersConfirmed() + 1);

        VolunteerApplication updatedApplication = applicationRepository.save(application);
        return convertToDTO(updatedApplication);
    }

    public VolunteerApplicationDTO rejectApplication(Long applicationId) {
        VolunteerApplication application = applicationRepository.findById(applicationId)
                .orElseThrow(() -> new RuntimeException("Application not found"));

        application.setStatus(VolunteerApplication.ApplicationStatus.REJECTED);
        VolunteerApplication updatedApplication = applicationRepository.save(application);
        return convertToDTO(updatedApplication);
    }

    public VolunteerApplicationDTO withdrawApplication(Long applicationId) {
        VolunteerApplication application = applicationRepository.findById(applicationId)
                .orElseThrow(() -> new RuntimeException("Application not found"));

        application.setStatus(VolunteerApplication.ApplicationStatus.WITHDRAWN);
        VolunteerApplication updatedApplication = applicationRepository.save(application);
        return convertToDTO(updatedApplication);
    }

    public VolunteerApplicationDTO completeApplication(Long applicationId, Integer hoursCompleted, Integer rating, String feedback) {
        VolunteerApplication application = applicationRepository.findById(applicationId)
                .orElseThrow(() -> new RuntimeException("Application not found"));

        application.setStatus(VolunteerApplication.ApplicationStatus.COMPLETED);
        application.setHoursCompleted(hoursCompleted);
        application.setRatingFromOrganizer(rating);
        application.setFeedbackFromOrganizer(feedback);

        VolunteerApplication updatedApplication = applicationRepository.save(application);
        return convertToDTO(updatedApplication);
    }

    private VolunteerApplicationDTO convertToDTO(VolunteerApplication application) {
        return VolunteerApplicationDTO.builder()
                .id(application.getId())
                .eventId(application.getEvent().getId())
                .eventTitle(application.getEvent().getTitle())
                .volunteerId(application.getVolunteer().getId())
                .volunteerName(application.getVolunteer().getFirstName() + " " + application.getVolunteer().getLastName())
                .status(application.getStatus())
                .applicationDate(application.getApplicationDate())
                .responseDate(application.getResponseDate())
                .motivationText(application.getMotivationText())
                .hoursCompleted(application.getHoursCompleted())
                .ratingFromOrganizer(application.getRatingFromOrganizer())
                .feedbackFromOrganizer(application.getFeedbackFromOrganizer())
                .build();
    }
}
