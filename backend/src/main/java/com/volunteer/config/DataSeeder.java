package com.volunteer.config;

import com.volunteer.entity.*;
import com.volunteer.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Arrays;

/**
 * Database Seeder - Initializes the database with sample data on application startup
 * This is useful for development with H2 in-memory database
 */
@Slf4j
@Component
@RequiredArgsConstructor
public class DataSeeder implements CommandLineRunner {

    private final UserRepository userRepository;
    private final SkillRepository skillRepository;
    private final EventRepository eventRepository;
    private final OrganizerProfileRepository organizerProfileRepository;
    private final VolunteerProfileRepository volunteerProfileRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    @Transactional
    public void run(String... args) throws Exception {
        log.info("========== DATABASE SEEDING START ==========");
        log.info("User count in database: {}", userRepository.count());
        
        // Only seed if database is empty
        if (userRepository.count() > 0) {
            log.info("Database already seeded. Skipping...");
            return;
        }

        log.info("Starting password encoding...");
        
        // Encode password FIRST
        String encodedPassword = passwordEncoder.encode("password123");
        log.info("✅ PASSWORD ENCODED SUCCESSFULLY");
        log.info("✅ Testing password match: {}", passwordEncoder.matches("password123", encodedPassword));

        // Create Skills
        Skill skillTeaching = Skill.builder()
            .name("Teaching")
            .category("Education")
            .description("Ability to teach and mentor others")
            .build();

        Skill skillCleaning = Skill.builder()
            .name("Cleaning")
            .category("Maintenance")
            .description("Cleaning and maintenance skills")
            .build();

        Skill skillCoding = Skill.builder()
            .name("Coding")
            .category("Technology")
            .description("Programming and software development")
            .build();

        Skill skillFirstAid = Skill.builder()
            .name("First Aid")
            .category("Healthcare")
            .description("First aid and emergency response")
            .build();

        skillRepository.saveAll(Arrays.asList(skillTeaching, skillCleaning, skillCoding, skillFirstAid));
        log.info("Created 4 skills");

        // Create Organizer User
        User organizer = User.builder()
            .username("organizer1")
            .email("organizer@example.com")
            .passwordHash(encodedPassword)
            .firstName("John")
            .lastName("Organizer")
            .phoneNumber("555-0001")
            .role(UserRole.ORGANIZER)
            .isActive(true)
            .createdAt(LocalDateTime.now())
            .updatedAt(LocalDateTime.now())
            .build();

        User savedOrganizer = userRepository.save(organizer);
        log.info("✅ Organizer saved with ID: {}, Username: {}, PasswordHash: {}", 
            savedOrganizer.getId(), savedOrganizer.getUsername(),
            savedOrganizer.getPasswordHash().substring(0, Math.min(30, savedOrganizer.getPasswordHash().length())) + "...");

        // Create Organizer Profile
        OrganizerProfile organizerProfile = OrganizerProfile.builder()
            .user(savedOrganizer)
            .organizationName("Community Helpers Inc")
            .organizationPhone("555-1234")
            .organizationWebsite("https://communityhelpers.org")
            .registrationNumber("CH-2024-001")
            .verificationStatus(OrganizerProfile.VerificationStatus.VERIFIED)
            .createdAt(LocalDateTime.now())
            .updatedAt(LocalDateTime.now())
            .build();

        organizerProfileRepository.save(organizerProfile);
        log.info("Created organizer user and profile");

        // Create Volunteer User
        User volunteer = User.builder()
            .username("volunteer1")
            .email("volunteer@example.com")
            .passwordHash(encodedPassword)
            .firstName("Jane")
            .lastName("Volunteer")
            .phoneNumber("555-0002")
            .role(UserRole.VOLUNTEER)
            .isActive(true)
            .createdAt(LocalDateTime.now())
            .updatedAt(LocalDateTime.now())
            .build();

        User savedVolunteer = userRepository.save(volunteer);
        log.info("✅ Volunteer saved with ID: {}, Username: {}, PasswordHash: {}", 
            savedVolunteer.getId(), savedVolunteer.getUsername(),
            savedVolunteer.getPasswordHash().substring(0, Math.min(30, savedVolunteer.getPasswordHash().length())) + "...");

        // Create Volunteer Profile
        VolunteerProfile volunteerProfile = VolunteerProfile.builder()
            .user(savedVolunteer)
            .availabilityStatus(VolunteerProfile.AvailabilityStatus.AVAILABLE)
            .verificationStatus(VolunteerProfile.VerificationStatus.VERIFIED)
            .backgroundCheckCompleted(true)
            .yearsOfExperience(2)
            .createdAt(LocalDateTime.now())
            .updatedAt(LocalDateTime.now())
            .build();

        volunteerProfileRepository.save(volunteerProfile);
        log.info("Created volunteer user and profile");

        // Create Sample Events - DUBAI/UAE DEMO DATA
        
        // 1. Dubai Beach Cleanup (Jumeirah Beach)
        Event event1 = Event.builder()
                .title("Jumeirah Beach Cleanup")
                .description("Join us for a community effort to keep Jumeirah Beach pristine! We will be collecting plastic waste and debris to protect marine life. Gloves and bags provided. Meet near the Burj Al Arab view point.")
                .eventType("COMMUNITY_SERVICE")
                .location("Jumeirah Beach, Dubai, UAE")
                .latitude(new BigDecimal("25.1412"))
                .longitude(new BigDecimal("55.1853"))
                .eventDate(LocalDateTime.now().plusDays(2))
                .durationHours(3)
                .volunteersNeeded(50)
                .volunteersConfirmed(0)
                .status(Event.EventStatus.PUBLISHED)
                .organizer(savedOrganizer)
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();

        // 2. Tech Skills for Youth (Dubai Internet City)
        Event event2 = Event.builder()
                .title("Tech Skills Workshop for Youth")
                .description("A weekend workshop teaching basic coding and digital literacy to underprivileged youth. seeking mentors with Python or JavaScript experience. Lunch included!")
                .eventType("EDUCATION")
                .location("Dubai Internet City, Building 3, Dubai, UAE")
                .latitude(new BigDecimal("25.0936"))
                .longitude(new BigDecimal("55.1553"))
                .eventDate(LocalDateTime.now().plusDays(5))
                .durationHours(6)
                .volunteersNeeded(15)
                .volunteersConfirmed(0)
                .status(Event.EventStatus.PUBLISHED)
                .organizer(savedOrganizer)
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();

        // 3. Desert Conservation Drive (Al Marmoom)
        Event event3 = Event.builder()
                .title("Desert Conservation Initiative")
                .description("Help us preserve the natural beauty of the UAE desert. We will be planting Ghaf trees and cleaning up camping sites in the Al Marmoom Conservation Reserve. 4x4 transport from city center provided.")
                .eventType("ENVIRONMENTAL")
                .location("Al Marmoom Desert Conservation Reserve, Dubai, UAE")
                .latitude(new BigDecimal("24.9600"))
                .longitude(new BigDecimal("55.3800"))
                .eventDate(LocalDateTime.now().plusDays(8))
                .durationHours(5)
                .volunteersNeeded(30)
                .volunteersConfirmed(0)
                .status(Event.EventStatus.PUBLISHED)
                .organizer(savedOrganizer)
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();

        // 4. Dubai Food Bank Distribution (Al Quoz)
        Event event4 = Event.builder()
                .title("Food Package Distribution")
                .description("Support the UAE Food Bank by sorting and packing food parcels for distribution to labor camps. This is a high-impact activity helping those who build our city.")
                .eventType("DISASTER_RELIEF")
                .location("Al Quoz Industrial Area 3, Dubai, UAE")
                .latitude(new BigDecimal("25.1500"))
                .longitude(new BigDecimal("55.2300"))
                .eventDate(LocalDateTime.now().plusDays(1))
                .durationHours(4)
                .volunteersNeeded(25)
                .volunteersConfirmed(0)
                .status(Event.EventStatus.PUBLISHED)
                .organizer(savedOrganizer)
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();

        // 5. Senior Companionship Visit (Dubai Healthcare City)
        Event event5 = Event.builder()
                .title("Senior Home Visit & Activities")
                .description("Spend a heartwarming afternoon with seniors at the Community Center. We'll play board games, share stories, and enjoy tea together. Arabic speakers preferred but not required.")
                .eventType("HEALTHCARE")
                .location("Dubai Healthcare City, Dubai, UAE")
                .latitude(new BigDecimal("25.2300"))
                .longitude(new BigDecimal("55.3200"))
                .eventDate(LocalDateTime.now().plusDays(4))
                .durationHours(2)
                .volunteersNeeded(10)
                .volunteersConfirmed(0)
                .status(Event.EventStatus.PUBLISHED)
                .organizer(savedOrganizer)
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();

        eventRepository.saveAll(Arrays.asList(event1, event2, event3, event4, event5));
        log.info("✅ Created 5 Dubai/UAE demo events");

        log.info("Database seeding completed successfully!");
        log.info("========== DATABASE SEEDING COMPLETE ==========");
        log.info("Test Credentials:");
        log.info("   Organizer - Username: organizer1, Password: password123");
        log.info("   Volunteer - Username: volunteer1, Password: password123");
    }
}
