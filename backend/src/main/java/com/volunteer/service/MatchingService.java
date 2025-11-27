package com.volunteer.service;

import com.volunteer.entity.Event;
import com.volunteer.entity.EventMatch;
import com.volunteer.entity.User;
import com.volunteer.entity.VolunteerSkill;
import com.volunteer.repository.EventMatchRepository;
import com.volunteer.repository.EventRepository;
import com.volunteer.repository.VolunteerSkillRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class MatchingService {

    private final EventMatchRepository eventMatchRepository;
    private final EventRepository eventRepository;
    private final VolunteerSkillRepository volunteerSkillRepository;

    /**
     * Generate matches for a volunteer based on their skills
     */
    public void generateMatchesForVolunteer(User volunteer) {
        List<VolunteerSkill> volunteerSkills = volunteerSkillRepository.findByVolunteer(volunteer);
        
        if (volunteerSkills.isEmpty()) {
            return; // No skills, no matches
        }

        List<Event> upcomingEvents = eventRepository.findUpcomingPublishedEvents(LocalDateTime.now());

        for (Event event : upcomingEvents) {
            if (eventMatchRepository.findByEventAndVolunteer(event, volunteer).isEmpty()) {
                BigDecimal matchScore = calculateMatchScore(volunteer, event, volunteerSkills);
                
                if (matchScore.compareTo(BigDecimal.valueOf(50)) >= 0) { // Minimum 50% match
                    EventMatch match = EventMatch.builder()
                            .event(event)
                            .volunteer(volunteer)
                            .matchScore(matchScore)
                            .skillMatchPercentage(calculateSkillMatch(volunteer, event))
                            .availabilityMatch(true)
                            .matchReason(generateMatchReason(volunteer, event))
                            .isNotified(false)
                            .build();

                    eventMatchRepository.save(match);
                }
            }
        }
    }

    /**
     * Generate matches for an event based on volunteer skills
     */
    public void generateMatchesForEvent(Event event) {
        List<User> volunteers = eventRepository.findAll().stream()
                .flatMap(e -> e.getApplications().stream().map(app -> app.getVolunteer()))
                .distinct()
                .collect(Collectors.toList());

        for (User volunteer : volunteers) {
            if (eventMatchRepository.findByEventAndVolunteer(event, volunteer).isEmpty()) {
                BigDecimal matchScore = calculateMatchScore(volunteer, event, 
                        volunteerSkillRepository.findByVolunteer(volunteer));
                
                if (matchScore.compareTo(BigDecimal.valueOf(50)) >= 0) {
                    EventMatch match = EventMatch.builder()
                            .event(event)
                            .volunteer(volunteer)
                            .matchScore(matchScore)
                            .skillMatchPercentage(calculateSkillMatch(volunteer, event))
                            .availabilityMatch(true)
                            .matchReason(generateMatchReason(volunteer, event))
                            .isNotified(false)
                            .build();

                    eventMatchRepository.save(match);
                }
            }
        }
    }

    /**
     * Calculate match score between volunteer and event (0-100)
     */
    private BigDecimal calculateMatchScore(User volunteer, Event event, List<VolunteerSkill> volunteerSkills) {
        BigDecimal skillMatch = calculateSkillMatch(volunteer, event);
        BigDecimal availabilityMatch = calculateAvailabilityMatch(volunteer);
        BigDecimal locationMatch = calculateLocationMatch(volunteer, event);

        // Weighted average: 50% skills, 30% availability, 20% location
        BigDecimal score = skillMatch.multiply(BigDecimal.valueOf(0.5))
                .add(availabilityMatch.multiply(BigDecimal.valueOf(0.3)))
                .add(locationMatch.multiply(BigDecimal.valueOf(0.2)));

        return score.min(BigDecimal.valueOf(100)).max(BigDecimal.ZERO);
    }

    /**
     * Calculate skill match percentage (0-100)
     */
    private BigDecimal calculateSkillMatch(User volunteer, Event event) {
        List<VolunteerSkill> volunteerSkills = volunteerSkillRepository.findByVolunteer(volunteer);
        
        if (event.getRequiredSkills() == null || event.getRequiredSkills().isEmpty()) {
            return BigDecimal.valueOf(100); // No required skills = perfect match
        }

        int matchedSkills = 0;
        for (var requiredSkill : event.getRequiredSkills()) {
            boolean hasSkill = volunteerSkills.stream()
                    .anyMatch(vs -> vs.getSkill().getId().equals(requiredSkill.getSkill().getId()));
            if (hasSkill) {
                matchedSkills++;
            }
        }

        return BigDecimal.valueOf((matchedSkills * 100.0) / event.getRequiredSkills().size());
    }

    /**
     * Calculate availability match (0-100)
     */
    private BigDecimal calculateAvailabilityMatch(User volunteer) {
        // TODO: Integrate with volunteer availability calendar
        return BigDecimal.valueOf(80); // Placeholder
    }

    /**
     * Calculate location match based on distance (0-100)
     */
    private BigDecimal calculateLocationMatch(User volunteer, Event event) {
        // TODO: Calculate actual distance using coordinates
        // For now, return high score
        return BigDecimal.valueOf(75); // Placeholder
    }

    /**
     * Generate human-readable match reason
     */
    private String generateMatchReason(User volunteer, Event event) {
        BigDecimal skillMatch = calculateSkillMatch(volunteer, event);
        
        if (skillMatch.compareTo(BigDecimal.valueOf(80)) >= 0) {
            return "Excellent skill match for this event";
        } else if (skillMatch.compareTo(BigDecimal.valueOf(60)) >= 0) {
            return "Good skill match for this event";
        } else {
            return "Moderate skill match for this event";
        }
    }

    /**
     * Get top matches for a volunteer
     */
    public List<EventMatch> getTopMatchesForVolunteer(User volunteer, int limit) {
        return eventMatchRepository.findByVolunteer(volunteer).stream()
                .sorted((m1, m2) -> m2.getMatchScore().compareTo(m1.getMatchScore()))
                .limit(limit)
                .collect(Collectors.toList());
    }

    /**
     * Get top matches for an event
     */
    public List<EventMatch> getTopMatchesForEvent(Event event, int limit) {
        return eventMatchRepository.findByEventOrderByMatchScoreDesc(event).stream()
                .limit(limit)
                .collect(Collectors.toList());
    }

    /**
     * Recalculate all matches (batch operation)
     */
    public void recalculateAllMatches() {
        List<Event> allEvents = eventRepository.findAll();
        for (Event event : allEvents) {
            generateMatchesForEvent(event);
        }
    }
}
