package com.volunteer.repository;

import com.volunteer.entity.Notification;
import com.volunteer.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface NotificationRepository extends JpaRepository<Notification, Long> {

    List<Notification> findByUser(User user);

    List<Notification> findByUserOrderByCreatedAtDesc(User user);

    Page<Notification> findByUserOrderByCreatedAtDesc(User user, Pageable pageable);

    @Query("SELECT n FROM Notification n WHERE n.user = :user AND n.isRead = false ORDER BY n.createdAt DESC")
    List<Notification> findUnreadNotifications(@Param("user") User user);

    @Query("SELECT COUNT(n) FROM Notification n WHERE n.user = :user AND n.isRead = false")
    Integer countUnreadNotifications(@Param("user") User user);

    @Query("SELECT n FROM Notification n WHERE n.user = :user AND n.type = :type ORDER BY n.createdAt DESC")
    List<Notification> findByUserAndType(@Param("user") User user, @Param("type") String type);

    @Query("UPDATE Notification n SET n.isRead = true WHERE n.user = :user AND n.isRead = false")
    void markAllAsRead(@Param("user") User user);
}
