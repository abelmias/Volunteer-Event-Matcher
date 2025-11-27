package com.volunteer.repository;

import com.volunteer.entity.Event;
import com.volunteer.entity.User;
import com.volunteer.entity.VolunteerApplication;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface VolunteerApplicationRepository extends JpaRepository<VolunteerApplication, Long> {

    Optional<VolunteerApplication> findByEventAndVolunteer(Event event, User volunteer);

    List<VolunteerApplication> findByVolunteer(User volunteer);

    List<VolunteerApplication> findByEvent(Event event);

    List<VolunteerApplication> findByStatus(VolunteerApplication.ApplicationStatus status);

    @Query("SELECT va FROM VolunteerApplication va WHERE va.event = :event AND va.status = :status")
    List<VolunteerApplication> findByEventAndStatus(@Param("event") Event event, @Param("status") VolunteerApplication.ApplicationStatus status);

    @Query("SELECT va FROM VolunteerApplication va WHERE va.volunteer = :volunteer AND va.status = :status")
    List<VolunteerApplication> findByVolunteerAndStatus(@Param("volunteer") User volunteer, @Param("status") VolunteerApplication.ApplicationStatus status);

    @Query("SELECT COUNT(va) FROM VolunteerApplication va WHERE va.event = :event AND va.status = 'APPROVED'")
    Integer countApprovedApplicationsByEvent(@Param("event") Event event);

    @Query("SELECT va FROM VolunteerApplication va WHERE va.event.organizer = :organizer AND va.status = 'PENDING'")
    List<VolunteerApplication> findPendingApplicationsForOrganizer(@Param("organizer") User organizer);
}
