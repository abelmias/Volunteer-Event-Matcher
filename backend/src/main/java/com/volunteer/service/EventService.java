package com.volunteer.service;

import com.volunteer.dto.CreateEventDTO;
import com.volunteer.dto.EventDTO;
import com.volunteer.entity.Event;
import com.volunteer.entity.EventRequiredSkill;
import com.volunteer.entity.Skill;
import com.volunteer.entity.User;
import com.volunteer.entity.UserRole;
import com.volunteer.entity.VolunteerSkill;
import com.volunteer.repository.EventRepository;
import com.volunteer.repository.EventRequiredSkillRepository;
import com.volunteer.repository.SkillRepository;
import com.volunteer.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
@Slf4j
public class EventService {

    private final EventRepository eventRepository;
    private final SkillRepository skillRepository;
    private final EventRequiredSkillRepository eventRequiredSkillRepository;
    private final UserRepository userRepository;

    public EventDTO createEvent(CreateEventDTO createEventDTO, User organizer) {
        // Reload the user within the transactional context to ensure it's attached to the session
        User attachedOrganizer = userRepository.findById(organizer.getId())
                .orElseThrow(() -> new RuntimeException("Organizer not found"));
        
        // Log the user role for debugging
        log.info("Creating event for user: {} with role: {}", attachedOrganizer.getUsername(), attachedOrganizer.getRole());
        
        // Determine event status based on user role
        // Volunteers submit events with PENDING_APPROVAL status
        // Organizers/Admins create events with DRAFT status
        Event.EventStatus initialStatus;
        if (attachedOrganizer.getRole() == UserRole.VOLUNTEER) {
            initialStatus = Event.EventStatus.PENDING_APPROVAL;
            log.info("Volunteer submission detected - setting status to PENDING_APPROVAL");
        } else if (attachedOrganizer.getRole() == UserRole.ORGANIZER || attachedOrganizer.getRole() == UserRole.ADMIN) {
            initialStatus = Event.EventStatus.DRAFT;
            log.info("Organizer/Admin creation detected - setting status to DRAFT");
        } else {
            throw new RuntimeException("Invalid user role for event creation: " + attachedOrganizer.getRole());
        }
        
        Event event = Event.builder()
                .organizer(attachedOrganizer)
                .title(createEventDTO.getTitle())
                .description(createEventDTO.getDescription())
                .eventType(createEventDTO.getEventType())
                .location(createEventDTO.getLocation())
                .latitude(createEventDTO.getLatitude())
                .longitude(createEventDTO.getLongitude())
                .eventDate(createEventDTO.getEventDate())
                .endDate(createEventDTO.getEndDate())
                .durationHours(createEventDTO.getDurationHours())
                .volunteersNeeded(createEventDTO.getVolunteersNeeded())
                .volunteersConfirmed(0)
                .imageUrl(createEventDTO.getImageUrl())
                .status(initialStatus)
                .build();

        Event savedEvent = eventRepository.save(event);

        if (createEventDTO.getRequiredSkillIds() != null && !createEventDTO.getRequiredSkillIds().isEmpty()) {
            for (Long skillId : createEventDTO.getRequiredSkillIds()) {
                Skill skill = skillRepository.findById(skillId)
                        .orElseThrow(() -> new RuntimeException("Skill not found"));
                EventRequiredSkill requiredSkill = EventRequiredSkill.builder()
                        .event(savedEvent)
                        .skill(skill)
                        .minimumProficiency(VolunteerSkill.ProficiencyLevel.BEGINNER)
                        .isMandatory(true)
                        .build();
                eventRequiredSkillRepository.save(requiredSkill);
            }
        }

        return convertToDTO(savedEvent);
    }

    public EventDTO getEventById(Long id) {
        Event event = eventRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Event not found"));
        return convertToDTO(event);
    }

    public List<EventDTO> getUpcomingPublishedEvents() {
        return eventRepository.findUpcomingPublishedEvents(LocalDateTime.now()).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public Page<EventDTO> getUpcomingPublishedEvents(Pageable pageable) {
        return eventRepository.findUpcomingPublishedEvents(LocalDateTime.now(), pageable)
                .map(this::convertToDTO);
    }

    public List<EventDTO> getEventsByOrganizer(User organizer) {
        return eventRepository.findByOrganizer(organizer).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public List<EventDTO> getEventsByStatus(Event.EventStatus status) {
        return eventRepository.findByStatus(status).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public List<EventDTO> searchEventsByLocation(String location) {
        return eventRepository.findByLocationContaining(location).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public List<EventDTO> getEventsByType(String eventType) {
        return eventRepository.findByEventType(eventType).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public List<EventDTO> getEventsNeedingVolunteers() {
        return eventRepository.findEventsNeedingVolunteers().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public EventDTO updateEvent(Long id, CreateEventDTO updateDTO) {
        Event event = eventRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Event not found"));

        event.setTitle(updateDTO.getTitle());
        event.setDescription(updateDTO.getDescription());
        event.setEventType(updateDTO.getEventType());
        event.setLocation(updateDTO.getLocation());
        event.setLatitude(updateDTO.getLatitude());
        event.setLongitude(updateDTO.getLongitude());
        event.setEventDate(updateDTO.getEventDate());
        event.setEndDate(updateDTO.getEndDate());
        event.setDurationHours(updateDTO.getDurationHours());
        event.setVolunteersNeeded(updateDTO.getVolunteersNeeded());
        event.setImageUrl(updateDTO.getImageUrl());

        Event updatedEvent = eventRepository.save(event);
        return convertToDTO(updatedEvent);
    }

    public void publishEvent(Long id) {
        Event event = eventRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Event not found"));
        event.setStatus(Event.EventStatus.PUBLISHED);
        eventRepository.save(event);
    }

    public void unpublishEvent(Long id) {
        Event event = eventRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Event not found"));
        event.setStatus(Event.EventStatus.DRAFT);
        eventRepository.save(event);
    }

    public void cancelEvent(Long id) {
        Event event = eventRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Event not found"));
        event.setStatus(Event.EventStatus.CANCELLED);
        eventRepository.save(event);
    }

    public void deleteEvent(Long id) {
        eventRepository.deleteById(id);
    }

    public void approveEvent(Long id, com.volunteer.entity.User admin) {
        Event event = eventRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Event not found"));
        event.setStatus(Event.EventStatus.PUBLISHED);
        event.setOrganizer(admin);
        eventRepository.save(event);
    }

    public void rejectEvent(Long id) {
        Event event = eventRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Event not found"));
        event.setStatus(Event.EventStatus.CANCELLED);
        eventRepository.save(event);
    }

    private EventDTO convertToDTO(Event event) {
        return EventDTO.builder()
                .id(event.getId())
                .organizerId(event.getOrganizer().getId())
                .organizerName(event.getOrganizer().getFirstName() + " " + event.getOrganizer().getLastName())
                .title(event.getTitle())
                .description(event.getDescription())
                .eventType(event.getEventType())
                .location(event.getLocation())
                .latitude(event.getLatitude())
                .longitude(event.getLongitude())
                .eventDate(event.getEventDate())
                .endDate(event.getEndDate())
                .durationHours(event.getDurationHours())
                .volunteersNeeded(event.getVolunteersNeeded())
                .volunteersConfirmed(event.getVolunteersConfirmed())
                .status(event.getStatus())
                .imageUrl(event.getImageUrl())
                .createdAt(event.getCreatedAt())
                .build();
    }
}
