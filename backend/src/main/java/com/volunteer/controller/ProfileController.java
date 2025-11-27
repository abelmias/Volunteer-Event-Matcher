package com.volunteer.controller;

import com.volunteer.dto.OrganizerProfileDTO;
import com.volunteer.dto.VolunteerProfileDTO;
import com.volunteer.dto.VolunteerSkillDTO;
import com.volunteer.service.ProfileService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.List;

/**
 * Controller for managing user profiles (Volunteer and Organizer)
 * Base URL: /api/profiles
 */
@RestController
@RequestMapping("/profiles")
@RequiredArgsConstructor
@Slf4j
public class ProfileController {

    private final ProfileService profileService;

    // ==================== VOLUNTEER PROFILE ENDPOINTS ====================

    /**
     * Get volunteer profile by user ID
     * GET /api/profiles/volunteer/{userId}
     */
    @GetMapping("/volunteer/{userId}")
    public ResponseEntity<?> getVolunteerProfile(@PathVariable Long userId) {
        try {
            log.info("GET request: Fetch volunteer profile for user ID: {}", userId);
            VolunteerProfileDTO profile = profileService.getVolunteerProfile(userId);
            return ResponseEntity.ok(profile);
        } catch (RuntimeException e) {
            log.error("Error fetching volunteer profile: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(new ErrorResponse("error", e.getMessage()));
        }
    }

    /**
     * Create volunteer profile
     * POST /api/profiles/volunteer
     */
    @PostMapping("/volunteer")
    public ResponseEntity<?> createVolunteerProfile(@Valid @RequestBody VolunteerProfileDTO profileDTO) {
        try {
            log.info("POST request: Create volunteer profile for user ID: {}", profileDTO.getUserId());
            VolunteerProfileDTO createdProfile = profileService.createVolunteerProfile(profileDTO);
            return ResponseEntity.status(HttpStatus.CREATED).body(createdProfile);
        } catch (RuntimeException e) {
            log.error("Error creating volunteer profile: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new ErrorResponse("error", e.getMessage()));
        }
    }

    /**
     * Update volunteer profile
     * PUT /api/profiles/volunteer/{profileId}
     */
    @PutMapping("/volunteer/{profileId}")
    public ResponseEntity<?> updateVolunteerProfile(
            @PathVariable Long profileId,
            @Valid @RequestBody VolunteerProfileDTO profileDTO) {
        try {
            log.info("PUT request: Update volunteer profile ID: {}", profileId);
            VolunteerProfileDTO updatedProfile = profileService.updateVolunteerProfile(profileId, profileDTO);
            return ResponseEntity.ok(updatedProfile);
        } catch (RuntimeException e) {
            log.error("Error updating volunteer profile: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(new ErrorResponse("error", e.getMessage()));
        }
    }

    // ==================== ORGANIZER PROFILE ENDPOINTS ====================

    /**
     * Get organizer profile by user ID
     * GET /api/profiles/organizer/{userId}
     */
    @GetMapping("/organizer/{userId}")
    public ResponseEntity<?> getOrganizerProfile(@PathVariable Long userId) {
        try {
            log.info("GET request: Fetch organizer profile for user ID: {}", userId);
            OrganizerProfileDTO profile = profileService.getOrganizerProfile(userId);
            return ResponseEntity.ok(profile);
        } catch (RuntimeException e) {
            log.error("Error fetching organizer profile: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(new ErrorResponse("error", e.getMessage()));
        }
    }

    /**
     * Create organizer profile
     * POST /api/profiles/organizer
     */
    @PostMapping("/organizer")
    public ResponseEntity<?> createOrganizerProfile(@Valid @RequestBody OrganizerProfileDTO profileDTO) {
        try {
            log.info("POST request: Create organizer profile for user ID: {}", profileDTO.getUserId());
            OrganizerProfileDTO createdProfile = profileService.createOrganizerProfile(profileDTO);
            return ResponseEntity.status(HttpStatus.CREATED).body(createdProfile);
        } catch (RuntimeException e) {
            log.error("Error creating organizer profile: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new ErrorResponse("error", e.getMessage()));
        }
    }

    /**
     * Update organizer profile
     * PUT /api/profiles/organizer/{profileId}
     */
    @PutMapping("/organizer/{profileId}")
    public ResponseEntity<?> updateOrganizerProfile(
            @PathVariable Long profileId,
            @Valid @RequestBody OrganizerProfileDTO profileDTO) {
        try {
            log.info("PUT request: Update organizer profile ID: {}", profileId);
            OrganizerProfileDTO updatedProfile = profileService.updateOrganizerProfile(profileId, profileDTO);
            return ResponseEntity.ok(updatedProfile);
        } catch (RuntimeException e) {
            log.error("Error updating organizer profile: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(new ErrorResponse("error", e.getMessage()));
        }
    }

    // ==================== VOLUNTEER SKILL ENDPOINTS ====================

    /**
     * Get all skills for a volunteer
     * GET /api/profiles/volunteer/{volunteerId}/skills
     */
    @GetMapping("/volunteer/{volunteerId}/skills")
    public ResponseEntity<?> getVolunteerSkills(@PathVariable Long volunteerId) {
        try {
            log.info("GET request: Fetch skills for volunteer ID: {}", volunteerId);
            List<VolunteerSkillDTO> skills = profileService.getVolunteerSkills(volunteerId);
            return ResponseEntity.ok(skills);
        } catch (RuntimeException e) {
            log.error("Error fetching volunteer skills: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(new ErrorResponse("error", e.getMessage()));
        }
    }

    /**
     * Add skill to volunteer
     * POST /api/profiles/volunteer/{volunteerId}/skills
     */
    @PostMapping("/volunteer/{volunteerId}/skills")
    public ResponseEntity<?> addVolunteerSkill(
            @PathVariable Long volunteerId,
            @Valid @RequestBody VolunteerSkillDTO skillDTO) {
        try {
            log.info("POST request: Add skill to volunteer ID: {}", volunteerId);
            skillDTO.setVolunteerId(volunteerId);
            VolunteerSkillDTO addedSkill = profileService.addVolunteerSkill(volunteerId, skillDTO);
            return ResponseEntity.status(HttpStatus.CREATED).body(addedSkill);
        } catch (RuntimeException e) {
            log.error("Error adding skill to volunteer: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new ErrorResponse("error", e.getMessage()));
        }
    }

    /**
     * Update volunteer skill
     * PUT /api/profiles/skills/{skillId}
     */
    @PutMapping("/skills/{skillId}")
    public ResponseEntity<?> updateVolunteerSkill(
            @PathVariable Long skillId,
            @Valid @RequestBody VolunteerSkillDTO skillDTO) {
        try {
            log.info("PUT request: Update volunteer skill ID: {}", skillId);
            VolunteerSkillDTO updatedSkill = profileService.updateVolunteerSkill(skillId, skillDTO);
            return ResponseEntity.ok(updatedSkill);
        } catch (RuntimeException e) {
            log.error("Error updating volunteer skill: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(new ErrorResponse("error", e.getMessage()));
        }
    }

    /**
     * Remove skill from volunteer
     * DELETE /api/profiles/volunteer/{volunteerId}/skills/{skillId}
     */
    @DeleteMapping("/volunteer/{volunteerId}/skills/{skillId}")
    public ResponseEntity<?> removeVolunteerSkill(
            @PathVariable Long volunteerId,
            @PathVariable Long skillId) {
        try {
            log.info("DELETE request: Remove skill {} from volunteer ID: {}", skillId, volunteerId);
            profileService.removeVolunteerSkill(volunteerId, skillId);
            return ResponseEntity.ok(new SuccessResponse("success", "Skill removed successfully"));
        } catch (RuntimeException e) {
            log.error("Error removing skill from volunteer: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(new ErrorResponse("error", e.getMessage()));
        }
    }

    // ==================== HELPER CLASSES ====================

    /**
     * Success response wrapper
     */
    public static class SuccessResponse {
        public String status;
        public String message;

        public SuccessResponse(String status, String message) {
            this.status = status;
            this.message = message;
        }
    }

    /**
     * Error response wrapper
     */
    public static class ErrorResponse {
        public String status;
        public String message;

        public ErrorResponse(String status, String message) {
            this.status = status;
            this.message = message;
        }
    }
}
