package com.volunteer.service;

import com.volunteer.dto.OrganizerProfileDTO;
import com.volunteer.dto.VolunteerProfileDTO;
import com.volunteer.dto.VolunteerSkillDTO;
import com.volunteer.entity.*;
import com.volunteer.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

/**
 * Service for managing user profiles (Volunteer and Organizer)
 */
@Service
@RequiredArgsConstructor
@Transactional
@Slf4j
public class ProfileService {

    private final VolunteerProfileRepository volunteerProfileRepository;
    private final OrganizerProfileRepository organizerProfileRepository;
    private final VolunteerSkillRepository volunteerSkillRepository;
    private final UserRepository userRepository;
    private final SkillRepository skillRepository;

    // ==================== VOLUNTEER PROFILE METHODS ====================

    /**
     * Get volunteer profile by user ID
     */
    public VolunteerProfileDTO getVolunteerProfile(Long userId) {
        log.info("Fetching volunteer profile for user ID: {}", userId);
        VolunteerProfile profile = volunteerProfileRepository.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("Volunteer profile not found for user ID: " + userId));
        return VolunteerProfileDTO.fromEntity(profile);
    }

    /**
     * Create volunteer profile
     */
    public VolunteerProfileDTO createVolunteerProfile(VolunteerProfileDTO profileDTO) {
        log.info("Creating volunteer profile for user ID: {}", profileDTO.getUserId());
        
        User user = userRepository.findById(profileDTO.getUserId())
                .orElseThrow(() -> new RuntimeException("User not found with ID: " + profileDTO.getUserId()));

        if (!user.getRole().equals(UserRole.VOLUNTEER)) {
            throw new RuntimeException("User is not a volunteer");
        }

        if (volunteerProfileRepository.findByUserId(profileDTO.getUserId()).isPresent()) {
            throw new RuntimeException("Volunteer profile already exists for this user");
        }

        VolunteerProfile profile = profileDTO.toEntity();
        profile.setUser(user);
        
        VolunteerProfile savedProfile = volunteerProfileRepository.save(profile);
        log.info("Volunteer profile created successfully for user ID: {}", profileDTO.getUserId());
        
        return VolunteerProfileDTO.fromEntity(savedProfile);
    }

    /**
     * Update volunteer profile
     */
    public VolunteerProfileDTO updateVolunteerProfile(Long profileId, VolunteerProfileDTO profileDTO) {
        log.info("Updating volunteer profile ID: {}", profileId);
        
        VolunteerProfile profile = volunteerProfileRepository.findById(profileId)
                .orElseThrow(() -> new RuntimeException("Volunteer profile not found with ID: " + profileId));

        if (profileDTO.getYearsOfExperience() != null) {
            profile.setYearsOfExperience(profileDTO.getYearsOfExperience());
        }
        if (profileDTO.getAvailabilityStatus() != null) {
            profile.setAvailabilityStatus(
                    VolunteerProfile.AvailabilityStatus.valueOf(profileDTO.getAvailabilityStatus())
            );
        }
        if (profileDTO.getPreferredEventTypes() != null) {
            profile.setPreferredEventTypes(profileDTO.getPreferredEventTypes());
        }
        if (profileDTO.getBioExtended() != null) {
            profile.setBioExtended(profileDTO.getBioExtended());
        }
        if (profileDTO.getBackgroundCheckCompleted() != null) {
            profile.setBackgroundCheckCompleted(profileDTO.getBackgroundCheckCompleted());
        }

        VolunteerProfile updatedProfile = volunteerProfileRepository.save(profile);
        log.info("Volunteer profile updated successfully. ID: {}", profileId);
        
        return VolunteerProfileDTO.fromEntity(updatedProfile);
    }

    // ==================== ORGANIZER PROFILE METHODS ====================

    /**
     * Get organizer profile by user ID
     */
    public OrganizerProfileDTO getOrganizerProfile(Long userId) {
        log.info("Fetching organizer profile for user ID: {}", userId);
        OrganizerProfile profile = organizerProfileRepository.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("Organizer profile not found for user ID: " + userId));
        return OrganizerProfileDTO.fromEntity(profile);
    }

    /**
     * Create organizer profile
     */
    public OrganizerProfileDTO createOrganizerProfile(OrganizerProfileDTO profileDTO) {
        log.info("Creating organizer profile for user ID: {}", profileDTO.getUserId());
        
        User user = userRepository.findById(profileDTO.getUserId())
                .orElseThrow(() -> new RuntimeException("User not found with ID: " + profileDTO.getUserId()));

        if (!user.getRole().equals(UserRole.ORGANIZER)) {
            throw new RuntimeException("User is not an organizer");
        }

        if (organizerProfileRepository.findByUserId(profileDTO.getUserId()).isPresent()) {
            throw new RuntimeException("Organizer profile already exists for this user");
        }

        OrganizerProfile profile = profileDTO.toEntity();
        profile.setUser(user);
        
        OrganizerProfile savedProfile = organizerProfileRepository.save(profile);
        log.info("Organizer profile created successfully for user ID: {}", profileDTO.getUserId());
        
        return OrganizerProfileDTO.fromEntity(savedProfile);
    }

    /**
     * Update organizer profile
     */
    public OrganizerProfileDTO updateOrganizerProfile(Long profileId, OrganizerProfileDTO profileDTO) {
        log.info("Updating organizer profile ID: {}", profileId);
        
        OrganizerProfile profile = organizerProfileRepository.findById(profileId)
                .orElseThrow(() -> new RuntimeException("Organizer profile not found with ID: " + profileId));

        if (profileDTO.getOrganizationName() != null) {
            profile.setOrganizationName(profileDTO.getOrganizationName());
        }
        if (profileDTO.getOrganizationDescription() != null) {
            profile.setOrganizationDescription(profileDTO.getOrganizationDescription());
        }
        if (profileDTO.getOrganizationWebsite() != null) {
            profile.setOrganizationWebsite(profileDTO.getOrganizationWebsite());
        }
        if (profileDTO.getOrganizationPhone() != null) {
            profile.setOrganizationPhone(profileDTO.getOrganizationPhone());
        }
        if (profileDTO.getRegistrationNumber() != null) {
            profile.setRegistrationNumber(profileDTO.getRegistrationNumber());
        }

        OrganizerProfile updatedProfile = organizerProfileRepository.save(profile);
        log.info("Organizer profile updated successfully. ID: {}", profileId);
        
        return OrganizerProfileDTO.fromEntity(updatedProfile);
    }

    // ==================== VOLUNTEER SKILL METHODS ====================

    /**
     * Get all skills for a volunteer
     */
    public List<VolunteerSkillDTO> getVolunteerSkills(Long volunteerId) {
        log.info("Fetching skills for volunteer ID: {}", volunteerId);
        List<VolunteerSkill> skills = volunteerSkillRepository.findByVolunteerId(volunteerId);
        return skills.stream()
                .map(VolunteerSkillDTO::fromEntity)
                .collect(Collectors.toList());
    }

    /**
     * Add skill to volunteer
     */
    public VolunteerSkillDTO addVolunteerSkill(Long volunteerId, VolunteerSkillDTO skillDTO) {
        log.info("Adding skill {} to volunteer ID: {}", skillDTO.getSkillId(), volunteerId);
        
        User volunteer = userRepository.findById(volunteerId)
                .orElseThrow(() -> new RuntimeException("Volunteer not found with ID: " + volunteerId));

        if (!volunteer.getRole().equals(UserRole.VOLUNTEER)) {
            throw new RuntimeException("User is not a volunteer");
        }

        Skill skill = skillRepository.findById(skillDTO.getSkillId())
                .orElseThrow(() -> new RuntimeException("Skill not found with ID: " + skillDTO.getSkillId()));

        // Check if skill already exists for this volunteer
        if (volunteerSkillRepository.findByVolunteerIdAndSkillId(volunteerId, skillDTO.getSkillId()).isPresent()) {
            throw new RuntimeException("Volunteer already has this skill");
        }

        VolunteerSkill volunteerSkill = VolunteerSkill.builder()
                .volunteer(volunteer)
                .skill(skill)
                .proficiencyLevel(VolunteerSkill.ProficiencyLevel.valueOf(skillDTO.getProficiencyLevel()))
                .endorsementCount(0)
                .build();

        VolunteerSkill savedSkill = volunteerSkillRepository.save(volunteerSkill);
        log.info("Skill added successfully to volunteer ID: {}", volunteerId);
        
        return VolunteerSkillDTO.fromEntity(savedSkill);
    }

    /**
     * Update volunteer skill
     */
    public VolunteerSkillDTO updateVolunteerSkill(Long skillId, VolunteerSkillDTO skillDTO) {
        log.info("Updating volunteer skill ID: {}", skillId);
        
        VolunteerSkill volunteerSkill = volunteerSkillRepository.findById(skillId)
                .orElseThrow(() -> new RuntimeException("Volunteer skill not found with ID: " + skillId));

        if (skillDTO.getProficiencyLevel() != null) {
            volunteerSkill.setProficiencyLevel(
                    VolunteerSkill.ProficiencyLevel.valueOf(skillDTO.getProficiencyLevel())
            );
        }

        VolunteerSkill updatedSkill = volunteerSkillRepository.save(volunteerSkill);
        log.info("Volunteer skill updated successfully. ID: {}", skillId);
        
        return VolunteerSkillDTO.fromEntity(updatedSkill);
    }

    /**
     * Remove skill from volunteer
     */
    public void removeVolunteerSkill(Long volunteerId, Long skillId) {
        log.info("Removing skill {} from volunteer ID: {}", skillId, volunteerId);
        
        VolunteerSkill volunteerSkill = volunteerSkillRepository.findByVolunteerIdAndSkillId(volunteerId, skillId)
                .orElseThrow(() -> new RuntimeException("Volunteer skill not found"));

        volunteerSkillRepository.delete(volunteerSkill);
        log.info("Skill removed successfully from volunteer ID: {}", volunteerId);
    }
}
