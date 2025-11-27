package com.volunteer.controller;

import com.volunteer.entity.Notification;
import com.volunteer.entity.User;
import com.volunteer.security.JwtTokenProvider;
import com.volunteer.service.NotificationService;
import com.volunteer.service.UserService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@Slf4j
@RestController
@RequestMapping("/api/notifications")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:4200")
public class NotificationController {

    private final NotificationService notificationService;
    private final UserService userService;
    private final JwtTokenProvider jwtTokenProvider;

    /**
     * Get paginated notifications for the current user
     */
    @GetMapping
    public ResponseEntity<?> getUserNotifications(
            @RequestHeader(value = "Authorization", required = false) String token,
            Pageable pageable) {
        try {
            if (token == null || token.isEmpty()) {
                log.error("Authorization header is missing");
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
            }

            // Extract username from JWT token
            String jwt = token.replace("Bearer ", "");
            String username = jwtTokenProvider.getUsernameFromToken(jwt);
            log.info("Username extracted from JWT: {}", username);

            User user = userService.findByUsername(username).orElse(null);
            if (user == null) {
                log.error("User not found: {}", username);
                return ResponseEntity.notFound().build();
            }

            Page<Notification> notifications = notificationService.getUserNotifications(user, pageable);
            return ResponseEntity.ok(notifications);
        } catch (Exception e) {
            log.error("Error fetching notifications: ", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * Get all notifications for the current user (non-paginated)
     */
    @GetMapping("/all")
    public ResponseEntity<?> getAllUserNotifications(
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

            User user = userService.findByUsername(username).orElse(null);
            if (user == null) {
                log.error("User not found: {}", username);
                return ResponseEntity.notFound().build();
            }

            List<Notification> notifications = notificationService.getUserNotifications(user);
            return ResponseEntity.ok(notifications);
        } catch (Exception e) {
            log.error("Error fetching all notifications: ", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * Get unread notifications for the current user
     */
    @GetMapping("/unread")
    public ResponseEntity<?> getUnreadNotifications(
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

            User user = userService.findByUsername(username).orElse(null);
            if (user == null) {
                log.error("User not found: {}", username);
                return ResponseEntity.notFound().build();
            }

            List<Notification> unreadNotifications = notificationService.getUnreadNotifications(user);
            return ResponseEntity.ok(unreadNotifications);
        } catch (Exception e) {
            log.error("Error fetching unread notifications: ", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * Get count of unread notifications
     */
    @GetMapping("/unread/count")
    public ResponseEntity<?> getUnreadNotificationCount(
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

            User user = userService.findByUsername(username).orElse(null);
            if (user == null) {
                log.error("User not found: {}", username);
                return ResponseEntity.notFound().build();
            }

            Integer count = notificationService.getUnreadNotificationCount(user);
            Map<String, Object> response = new java.util.HashMap<>();
            response.put("unreadCount", count);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("Error fetching unread notification count: ", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * Mark a notification as read
     */
    @PostMapping("/{notificationId}/read")
    public ResponseEntity<?> markAsRead(@PathVariable Long notificationId) {
        try {
            Notification notification = notificationService.markAsRead(notificationId);
            return ResponseEntity.ok(notification);
        } catch (Exception e) {
            log.error("Error marking notification as read: ", e);
            return ResponseEntity.notFound().build();
        }
    }

    /**
     * Mark all notifications as read for the current user
     */
    @PostMapping("/mark-all-read")
    public ResponseEntity<?> markAllAsRead(
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

            User user = userService.findByUsername(username).orElse(null);
            if (user == null) {
                log.error("User not found: {}", username);
                return ResponseEntity.notFound().build();
            }

            notificationService.markAllAsRead(user);
            Map<String, Object> response = new java.util.HashMap<>();
            response.put("success", true);
            response.put("message", "All notifications marked as read");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("Error marking all notifications as read: ", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * Delete a notification
     */
    @DeleteMapping("/{notificationId}")
    public ResponseEntity<?> deleteNotification(@PathVariable Long notificationId) {
        try {
            notificationService.deleteNotification(notificationId);
            Map<String, Object> response = new java.util.HashMap<>();
            response.put("success", true);
            response.put("message", "Notification deleted");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("Error deleting notification: ", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * Delete all notifications for the current user
     */
    @DeleteMapping("/all")
    public ResponseEntity<?> deleteAllNotifications(
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

            User user = userService.findByUsername(username).orElse(null);
            if (user == null) {
                log.error("User not found: {}", username);
                return ResponseEntity.notFound().build();
            }

            notificationService.deleteAllNotifications(user);
            Map<String, Object> response = new java.util.HashMap<>();
            response.put("success", true);
            response.put("message", "All notifications deleted");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("Error deleting all notifications: ", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
}
