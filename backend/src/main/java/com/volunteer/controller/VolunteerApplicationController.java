package com.volunteer.controller;

import com.volunteer.dto.VolunteerApplicationDTO;
import com.volunteer.entity.User;
import com.volunteer.security.JwtTokenProvider;
import com.volunteer.service.VolunteerApplicationService;
import com.volunteer.service.UserService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@Slf4j
@RestController
@RequestMapping("/api/applications")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:4200")
public class VolunteerApplicationController {

    private final VolunteerApplicationService applicationService;
    private final UserService userService;
    private final JwtTokenProvider jwtTokenProvider;

    @PostMapping("/events/{eventId}")
    public ResponseEntity<?> applyToEvent(@PathVariable Long eventId,
                                          @RequestHeader(value = "Authorization", required = false) String token) {
        try {
            log.info("Apply to event request - EventId: {}, Token present: {}", eventId, token != null);
            
            if (token == null || token.isEmpty()) {
                log.error("Authorization header is missing");
                Map<String, Object> errorResponse = new java.util.HashMap<>();
                errorResponse.put("success", false);
                errorResponse.put("message", "Authorization header is missing");
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(errorResponse);
            }
            
            // Extract username from JWT token
            String jwt = token.replace("Bearer ", "");
            log.debug("JWT token extracted: {}", jwt.substring(0, Math.min(20, jwt.length())) + "...");
            
            String username = jwtTokenProvider.getUsernameFromToken(jwt);
            log.info("Username extracted from JWT: {}", username);
            
            // Load the actual user from database
            User volunteer = userService.findByUsername(username)
                    .orElseThrow(() -> new RuntimeException("User not found: " + username));
            log.info("User found in database: {} (ID: {})", username, volunteer.getId());
            
            VolunteerApplicationDTO applicationDTO = applicationService.applyToEvent(eventId, volunteer);
            log.info("Volunteer {} applied to event {}", username, eventId);
            
            Map<String, Object> response = new java.util.HashMap<>();
            response.put("success", true);
            response.put("message", "Successfully applied to event");
            response.put("application", applicationDTO);
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch (Exception e) {
            log.error("Error applying to event: ", e);
            Map<String, Object> errorResponse = new java.util.HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", "Error applying to event: " + e.getMessage());
            return ResponseEntity.badRequest().body(errorResponse);
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getApplicationById(@PathVariable Long id) {
        try {
            VolunteerApplicationDTO applicationDTO = applicationService.getApplicationById(id);
            return ResponseEntity.ok(applicationDTO);
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/volunteer/{volunteerId}")
    public ResponseEntity<?> getApplicationsByVolunteer(@PathVariable Long volunteerId,
                                                        @RequestHeader(value = "Authorization", required = false) String token) {
        try {
            if (token == null || token.isEmpty()) {
                log.error("Authorization header is missing");
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
            }
            
            // Extract username from JWT token
            String jwt = token.replace("Bearer ", "");
            String username = jwtTokenProvider.getUsernameFromToken(jwt);
            log.info("Username extracted from JWT: {}", username);
            
            User volunteer = userService.findByUsername(username).orElse(null);
            if (volunteer == null) {
                log.error("Volunteer not found: {}", username);
                return ResponseEntity.notFound().build();
            }
            
            List<VolunteerApplicationDTO> applications = applicationService.getApplicationsByVolunteer(volunteer);
            return ResponseEntity.ok(applications);
        } catch (Exception e) {
            log.error("Error fetching volunteer applications: ", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("/event/{eventId}")
    public ResponseEntity<?> getApplicationsByEvent(@PathVariable Long eventId) {
        try {
            List<VolunteerApplicationDTO> applications = applicationService.getApplicationsByEvent(eventId);
            return ResponseEntity.ok(applications);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("/pending")
    public ResponseEntity<?> getPendingApplications(@RequestHeader("Authorization") String token) {
        try {
            // TODO: Extract organizer from token
            User organizer = new User(); // Placeholder
            List<VolunteerApplicationDTO> applications = applicationService.getPendingApplicationsForOrganizer(organizer);
            return ResponseEntity.ok(applications);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @PostMapping("/{id}/approve")
    public ResponseEntity<?> approveApplication(@PathVariable Long id) {
        try {
            VolunteerApplicationDTO applicationDTO = applicationService.approveApplication(id);
            return ResponseEntity.ok(applicationDTO);
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }

    @PostMapping("/{id}/reject")
    public ResponseEntity<?> rejectApplication(@PathVariable Long id) {
        try {
            VolunteerApplicationDTO applicationDTO = applicationService.rejectApplication(id);
            return ResponseEntity.ok(applicationDTO);
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }

    @PostMapping("/{id}/withdraw")
    public ResponseEntity<?> withdrawApplication(@PathVariable Long id) {
        try {
            VolunteerApplicationDTO applicationDTO = applicationService.withdrawApplication(id);
            return ResponseEntity.ok(applicationDTO);
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }

    @PostMapping("/{id}/complete")
    public ResponseEntity<?> completeApplication(@PathVariable Long id,
                                                 @RequestParam Integer hoursCompleted,
                                                 @RequestParam Integer rating,
                                                 @RequestParam String feedback) {
        try {
            VolunteerApplicationDTO applicationDTO = applicationService.completeApplication(id, hoursCompleted, rating, feedback);
            return ResponseEntity.ok(applicationDTO);
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }
}
