package com.volunteer.controller;

import com.volunteer.dto.AdminCreateEventDTO;
import com.volunteer.dto.CreateEventDTO;
import com.volunteer.dto.EventDTO;
import com.volunteer.dto.VolunteerSubmitEventDTO;
import com.volunteer.entity.User;
import com.volunteer.entity.UserRole;
import com.volunteer.repository.UserRepository;
import com.volunteer.security.JwtTokenProvider;
import com.volunteer.service.EventService;
import com.volunteer.service.UserService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.List;

/**
 * Event Management Controller
 * Handles all event-related operations (CRUD, publishing, filtering)
 */
@RestController
@RequestMapping("/api/events")
@RequiredArgsConstructor
@Slf4j
public class EventController {

    private final EventService eventService;
    private final UserService userService;
    private final JwtTokenProvider jwtTokenProvider;
    private final UserRepository userRepository;

    /**
     * Volunteer submits event for admin review
     * Status will be set to PENDING_APPROVAL
     * IMPORTANT: Only VOLUNTEER role users can use this endpoint
     */
    @PostMapping("/submit")
    public ResponseEntity<?> submitEventForReview(@Valid @RequestBody VolunteerSubmitEventDTO submitEventDTO,
                                                   @RequestHeader("Authorization") String token) {
        try {
            // Extract username from JWT token
            String jwt = token.replace("Bearer ", "");
            String username = jwtTokenProvider.getUsernameFromToken(jwt);
            
            // Load the actual user from database
            User volunteer = userRepository.findByUsername(username)
                    .orElseThrow(() -> new RuntimeException("User not found: " + username));
            
            // VALIDATION: Only volunteers can submit events for review
            if (volunteer.getRole() != UserRole.VOLUNTEER) {
                log.warn("Non-volunteer user {} attempted to use /submit endpoint with role: {}", username, volunteer.getRole());
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body("Only volunteers can submit events for review. Use /create endpoint for organizers.");
            }
            
            log.info("Volunteer {} submitting event for review", username);
            
            // Convert VolunteerSubmitEventDTO to CreateEventDTO (without lat/lng)
            CreateEventDTO createEventDTO = CreateEventDTO.builder()
                    .title(submitEventDTO.getTitle())
                    .description(submitEventDTO.getDescription())
                    .eventType(submitEventDTO.getEventType())
                    .location(submitEventDTO.getLocation())
                    .latitude(null)  // Volunteers don't provide coordinates
                    .longitude(null)
                    .eventDate(submitEventDTO.getEventDate())
                    .durationHours(submitEventDTO.getDurationHours())
                    .volunteersNeeded(submitEventDTO.getVolunteersNeeded())
                    .build();
            
            // Create event with the volunteer (will get PENDING_APPROVAL status)
            EventDTO eventDTO = eventService.createEvent(createEventDTO, volunteer);
            log.info("Event created with PENDING_APPROVAL status: {}", eventDTO.getId());
            return ResponseEntity.status(HttpStatus.CREATED).body(eventDTO);
        } catch (Exception e) {
            log.error("Error submitting event: ", e);
            return ResponseEntity.badRequest().body("Error submitting event: " + e.getMessage());
        }
    }

    /**
     * Admin/Organizer creates event directly
     * Status will be set to DRAFT
     * IMPORTANT: Only ORGANIZER or ADMIN role users can use this endpoint
     */
    @PostMapping("/create")
    public ResponseEntity<?> createEvent(@Valid @RequestBody AdminCreateEventDTO createEventDTO,
                                         @RequestHeader("Authorization") String token) {
        try {
            // Extract username from JWT token
            String jwt = token.replace("Bearer ", "");
            String username = jwtTokenProvider.getUsernameFromToken(jwt);
            
            // Load the actual user from database
            User organizer = userRepository.findByUsername(username)
                    .orElseThrow(() -> new RuntimeException("User not found: " + username));
            
            // VALIDATION: Only organizers and admins can create events directly
            if (organizer.getRole() != UserRole.ORGANIZER && organizer.getRole() != UserRole.ADMIN) {
                log.warn("Non-organizer user {} attempted to use /create endpoint with role: {}", username, organizer.getRole());
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body("Only organizers and admins can create events directly. Volunteers must use /submit endpoint.");
            }
            
            log.info("Organizer/Admin {} creating event directly", username);
            
            // Convert AdminCreateEventDTO to CreateEventDTO (with lat/lng)
            CreateEventDTO eventDTO = CreateEventDTO.builder()
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
                    .imageUrl(createEventDTO.getImageUrl())
                    .requiredSkillIds(createEventDTO.getRequiredSkillIds())
                    .build();
            
            // Create event with the loaded user (will get DRAFT status)
            EventDTO result = eventService.createEvent(eventDTO, organizer);
            log.info("Event created with DRAFT status: {}", result.getId());
            return ResponseEntity.status(HttpStatus.CREATED).body(result);
        } catch (Exception e) {
            log.error("Error creating event: ", e);
            return ResponseEntity.badRequest().body("Error creating event: " + e.getMessage());
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getEventById(@PathVariable Long id) {
        try {
            EventDTO eventDTO = eventService.getEventById(id);
            return ResponseEntity.ok(eventDTO);
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/upcoming/published")
    public ResponseEntity<?> getUpcomingPublishedEvents(Pageable pageable) {
        try {
            Page<EventDTO> events = eventService.getUpcomingPublishedEvents(pageable);
            return ResponseEntity.ok(events);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("/search/location")
    public ResponseEntity<?> searchByLocation(@RequestParam String location) {
        try {
            List<EventDTO> events = eventService.searchEventsByLocation(location);
            return ResponseEntity.ok(events);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("/search/type")
    public ResponseEntity<?> searchByType(@RequestParam String eventType) {
        try {
            List<EventDTO> events = eventService.getEventsByType(eventType);
            return ResponseEntity.ok(events);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("/needing-volunteers")
    public ResponseEntity<?> getEventsNeedingVolunteers() {
        try {
            List<EventDTO> events = eventService.getEventsNeedingVolunteers();
            return ResponseEntity.ok(events);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateEvent(@PathVariable Long id,
                                         @Valid @RequestBody CreateEventDTO updateDTO) {
        try {
            EventDTO eventDTO = eventService.updateEvent(id, updateDTO);
            return ResponseEntity.ok(eventDTO);
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }

    /**
     * Get all events for the current organizer
     * Used by organizer dashboard to display their events
     */
    @GetMapping("/organizer/my-events")
    public ResponseEntity<?> getOrganizerEvents(@RequestHeader("Authorization") String token) {
        try {
            // Extract username from JWT token
            String jwt = token.replace("Bearer ", "");
            String username = jwtTokenProvider.getUsernameFromToken(jwt);
            
            // Load the actual user from database
            User organizer = userRepository.findByUsername(username)
                    .orElseThrow(() -> new RuntimeException("User not found: " + username));
            
            // Get all events for this organizer
            List<EventDTO> events = eventService.getEventsByOrganizer(organizer);
            return ResponseEntity.ok(events);
        } catch (Exception e) {
            log.error("Error fetching organizer events: ", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error fetching events: " + e.getMessage());
        }
    }

    /**
     * Get all pending approval events (for admin review)
     * Used by admin dashboard to review volunteer-submitted events
     */
    @GetMapping("/pending-approval")
    public ResponseEntity<?> getPendingApprovalEvents() {
        try {
            List<EventDTO> events = eventService.getEventsByStatus(com.volunteer.entity.Event.EventStatus.PENDING_APPROVAL);
            return ResponseEntity.ok(events);
        } catch (Exception e) {
            log.error("Error fetching pending approval events: ", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error fetching pending events: " + e.getMessage());
        }
    }

    /**
     * Approve a pending event (admin action)
     * Changes status from PENDING_APPROVAL to PUBLISHED and transfers ownership to admin
     */
    @PostMapping(value = "/{id}/approve", produces = "application/json")
    public ResponseEntity<java.util.Map<String, Object>> approveEvent(@PathVariable Long id,
                                                                       @RequestHeader("Authorization") String token) {
        try {
            // Extract username from JWT token
            String jwt = token.replace("Bearer ", "");
            String username = jwtTokenProvider.getUsernameFromToken(jwt);
            
            // Load the actual user from database
            User admin = userRepository.findByUsername(username)
                    .orElseThrow(() -> new RuntimeException("User not found: " + username));
            
            eventService.approveEvent(id, admin);
            log.info("Event {} approved successfully by {}", id, username);
            java.util.Map<String, Object> response = new java.util.HashMap<>();
            response.put("success", true);
            response.put("message", "Event approved successfully");
            response.put("eventId", id);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("Error approving event: ", e);
            java.util.Map<String, Object> errorResponse = new java.util.HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", "Error approving event: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }
    }

    /**
     * Reject a pending event (admin action)
     * Changes status from PENDING_APPROVAL to CANCELLED
     */
    @PostMapping(value = "/{id}/reject", produces = "application/json")
    public ResponseEntity<java.util.Map<String, Object>> rejectEvent(@PathVariable Long id) {
        try {
            eventService.rejectEvent(id);
            log.info("Event {} rejected successfully", id);
            java.util.Map<String, Object> response = new java.util.HashMap<>();
            response.put("success", true);
            response.put("message", "Event rejected successfully");
            response.put("eventId", id);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("Error rejecting event: ", e);
            java.util.Map<String, Object> errorResponse = new java.util.HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", "Error rejecting event: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }
    }

    /**
     * Publish a draft event (admin action)
     * Changes status from DRAFT to PUBLISHED
     */
    @PostMapping(value = "/{id}/publish", produces = "application/json")
    public ResponseEntity<java.util.Map<String, Object>> publishEvent(@PathVariable Long id) {
        try {
            eventService.publishEvent(id);
            log.info("Event {} published successfully", id);
            java.util.Map<String, Object> response = new java.util.HashMap<>();
            response.put("success", true);
            response.put("message", "Event published successfully");
            response.put("eventId", id);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("Error publishing event: ", e);
            java.util.Map<String, Object> errorResponse = new java.util.HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", "Error publishing event: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }
    }

    /**
     * Unpublish a published event (admin action)
     * Changes status from PUBLISHED back to DRAFT
     */
    @PostMapping(value = "/{id}/unpublish", produces = "application/json")
    public ResponseEntity<java.util.Map<String, Object>> unpublishEvent(@PathVariable Long id) {
        try {
            eventService.unpublishEvent(id);
            log.info("Event {} unpublished successfully", id);
            java.util.Map<String, Object> response = new java.util.HashMap<>();
            response.put("success", true);
            response.put("message", "Event unpublished successfully");
            response.put("eventId", id);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("Error unpublishing event: ", e);
            java.util.Map<String, Object> errorResponse = new java.util.HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", "Error unpublishing event: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }
    }
}
