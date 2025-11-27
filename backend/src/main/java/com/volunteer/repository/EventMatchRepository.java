package com.volunteer.repository;

import com.volunteer.entity.Event;
import com.volunteer.entity.EventMatch;
import com.volunteer.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

@Repository
public interface EventMatchRepository extends JpaRepository<EventMatch, Long> {

    Optional<EventMatch> findByEventAndVolunteer(Event event, User volunteer);

    List<EventMatch> findByEvent(Event event);

    List<EventMatch> findByVolunteer(User volunteer);

    @Query("SELECT em FROM EventMatch em WHERE em.event = :event ORDER BY em.matchScore DESC")
    List<EventMatch> findByEventOrderByMatchScoreDesc(@Param("event") Event event);

    @Query("SELECT em FROM EventMatch em WHERE em.volunteer = :volunteer AND em.isNotified = false ORDER BY em.matchScore DESC")
    List<EventMatch> findUnnotifiedMatchesForVolunteer(@Param("volunteer") User volunteer);

    @Query("SELECT em FROM EventMatch em WHERE em.matchScore >= :minScore ORDER BY em.matchScore DESC")
    List<EventMatch> findHighQualityMatches(@Param("minScore") BigDecimal minScore);

    @Query("SELECT em FROM EventMatch em WHERE em.event = :event AND em.matchScore >= :minScore ORDER BY em.matchScore DESC")
    List<EventMatch> findQualityMatchesForEvent(@Param("event") Event event, @Param("minScore") BigDecimal minScore);
}
