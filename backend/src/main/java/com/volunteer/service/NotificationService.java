package com.volunteer.service;

import com.volunteer.entity.Event;
import com.volunteer.entity.Notification;
import com.volunteer.entity.User;
import com.volunteer.entity.VolunteerApplication;
import com.volunteer.repository.NotificationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class NotificationService {

    private final NotificationRepository notificationRepository;

    public Notification createNotification(User user, String type, String title, String message, Event event, VolunteerApplication application) {
        Notification notification = Notification.builder()
                .user(user)
                .type(type)
                .title(title)
                .message(message)
                .relatedEvent(event)
                .relatedApplication(application)
                .isRead(false)
                .build();

        return notificationRepository.save(notification);
    }

    public Notification createEventNotification(User user, Event event, String title, String message) {
        return createNotification(user, "EVENT", title, message, event, null);
    }

    public Notification createApplicationNotification(User user, VolunteerApplication application, String title, String message) {
        return createNotification(user, "APPLICATION", title, message, null, application);
    }

    public List<Notification> getUserNotifications(User user) {
        return notificationRepository.findByUserOrderByCreatedAtDesc(user);
    }

    public Page<Notification> getUserNotifications(User user, Pageable pageable) {
        return notificationRepository.findByUserOrderByCreatedAtDesc(user, pageable);
    }

    public List<Notification> getUnreadNotifications(User user) {
        return notificationRepository.findUnreadNotifications(user);
    }

    public Integer getUnreadNotificationCount(User user) {
        return notificationRepository.countUnreadNotifications(user);
    }

    public List<Notification> getNotificationsByType(User user, String type) {
        return notificationRepository.findByUserAndType(user, type);
    }

    public Notification markAsRead(Long notificationId) {
        Notification notification = notificationRepository.findById(notificationId)
                .orElseThrow(() -> new RuntimeException("Notification not found"));

        notification.setIsRead(true);
        return notificationRepository.save(notification);
    }

    public void markAllAsRead(User user) {
        notificationRepository.markAllAsRead(user);
    }

    public void deleteNotification(Long notificationId) {
        notificationRepository.deleteById(notificationId);
    }

    public void deleteAllNotifications(User user) {
        List<Notification> notifications = notificationRepository.findByUser(user);
        notificationRepository.deleteAll(notifications);
    }

    // Notification templates
    public void notifyEventCreated(User organizer, Event event) {
        createEventNotification(organizer, event,
                "Event Created",
                "Your event '" + event.getTitle() + "' has been created successfully.");
    }

    public void notifyEventPublished(User organizer, Event event) {
        createEventNotification(organizer, event,
                "Event Published",
                "Your event '" + event.getTitle() + "' is now live!");
    }

    public void notifyNewApplication(User organizer, VolunteerApplication application) {
        createApplicationNotification(organizer, application,
                "New Application",
                application.getVolunteer().getFirstName() + " has applied to your event '" + application.getEvent().getTitle() + "'");
    }

    public void notifyApplicationApproved(User volunteer, VolunteerApplication application) {
        createApplicationNotification(volunteer, application,
                "Application Approved",
                "Your application for '" + application.getEvent().getTitle() + "' has been approved!");
    }

    public void notifyApplicationRejected(User volunteer, VolunteerApplication application) {
        createApplicationNotification(volunteer, application,
                "Application Rejected",
                "Your application for '" + application.getEvent().getTitle() + "' was not accepted.");
    }

    public void notifyEventMatched(User volunteer, Event event) {
        createEventNotification(volunteer, event,
                "Event Match",
                "We found a great match! Check out '" + event.getTitle() + "'");
    }
}
