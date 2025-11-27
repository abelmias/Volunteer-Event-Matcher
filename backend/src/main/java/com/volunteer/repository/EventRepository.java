package com.volunteer.repository;

import com.volunteer.entity.Event;
import com.volunteer.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface EventRepository extends JpaRepository<Event, Long> {

    List<Event> findByOrganizer(User organizer);

    List<Event> findByStatus(Event.EventStatus status);

    @Query("SELECT e FROM Event e WHERE e.status = 'PUBLISHED' ORDER BY e.eventDate ASC")
    List<Event> findUpcomingPublishedEvents(@Param("now") LocalDateTime now);

    @Query("SELECT e FROM Event e WHERE e.status = 'PUBLISHED' ORDER BY e.eventDate ASC")
    Page<Event> findUpcomingPublishedEvents(@Param("now") LocalDateTime now, Pageable pageable);

    @Query("SELECT e FROM Event e WHERE e.organizer = :organizer AND e.status = :status")
    List<Event> findByOrganizerAndStatus(@Param("organizer") User organizer, @Param("status") Event.EventStatus status);

    @Query("SELECT e FROM Event e WHERE e.location LIKE %:location% AND e.status = 'PUBLISHED'")
    List<Event> findByLocationContaining(@Param("location") String location);

    @Query("SELECT e FROM Event e WHERE e.eventType = :eventType AND e.status = 'PUBLISHED'")
    List<Event> findByEventType(@Param("eventType") String eventType);

    @Query("SELECT e FROM Event e WHERE e.volunteersNeeded > e.volunteersConfirmed AND e.status = 'PUBLISHED'")
    List<Event> findEventsNeedingVolunteers();
}
