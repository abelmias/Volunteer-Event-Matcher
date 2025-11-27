import { Component, OnInit, OnDestroy } from '@angular/core';
import { NotificationService } from '../../../services/notification.service';
import { Notification, NotificationType } from '../../../models/notification';
import { Subject, interval } from 'rxjs';
import { takeUntil, switchMap } from 'rxjs/operators';

/**
 * Notification Bell Component
 * Displays notification bell icon with unread count
 * Shows dropdown with recent notifications
 */
@Component({
  selector: 'app-notification-bell',
  templateUrl: './notification-bell.component.html',
  styleUrls: ['./notification-bell.component.css']
})
export class NotificationBellComponent implements OnInit, OnDestroy {
  notifications: Notification[] = [];
  unreadCount = 0;
  showDropdown = false;
  loading = false;
  error = '';
  private destroy$ = new Subject<void>();

  constructor(private notificationService: NotificationService) { }

  ngOnInit(): void {
    this.loadNotifications();
    // Poll for new notifications every 30 seconds
    interval(30000)
      .pipe(
        switchMap(() => this.notificationService.getNotifications(0, 5)),
        takeUntil(this.destroy$)
      )
      .subscribe(
        (response: any) => {
          this.notifications = response.content || [];
          this.updateUnreadCount();
        },
        (error: any) => {
          console.error('Error polling notifications:', error);
        }
      );
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  /**
   * Load notifications
   */
  loadNotifications(): void {
    this.loading = true;
    this.notificationService.getNotifications(0, 5).subscribe(
      (response: any) => {
        this.notifications = response.content || [];
        this.updateUnreadCount();
        this.loading = false;
      },
      (error: any) => {
        this.error = 'Failed to load notifications';
        console.error('Error loading notifications:', error);
        this.loading = false;
      }
    );
  }

  /**
   * Update unread count
   */
  updateUnreadCount(): void {
    this.unreadCount = this.notifications.filter(n => !n.isRead).length;
  }

  /**
   * Toggle dropdown
   */
  toggleDropdown(): void {
    this.showDropdown = !this.showDropdown;
    if (this.showDropdown) {
      this.loadNotifications();
    }
  }

  /**
   * Close dropdown
   */
  closeDropdown(): void {
    this.showDropdown = false;
  }

  /**
   * Mark notification as read
   */
  markAsRead(notification: Notification): void {
    if (!notification.isRead) {
      this.notificationService.markAsRead(notification.id).subscribe(
        () => {
          notification.isRead = true;
          this.updateUnreadCount();
        },
        (error: any) => {
          console.error('Error marking notification as read:', error);
        }
      );
    }
  }

  /**
   * Mark all as read
   */
  markAllAsRead(): void {
    this.notificationService.markAllAsRead().subscribe(
      () => {
        this.notifications.forEach(n => n.isRead = true);
        this.updateUnreadCount();
      },
      (error: any) => {
        console.error('Error marking all as read:', error);
      }
    );
  }

  /**
   * Delete notification
   */
  deleteNotification(notification: Notification): void {
    this.notificationService.deleteNotification(notification.id).subscribe(
      () => {
        this.notifications = this.notifications.filter(n => n.id !== notification.id);
        this.updateUnreadCount();
      },
      (error: any) => {
        console.error('Error deleting notification:', error);
      }
    );
  }

  /**
   * Get notification icon based on type
   */
  getNotificationIcon(type: string): string {
    switch (type) {
      case 'APPLICATION_RECEIVED':
        return '📝';
      case 'APPLICATION_APPROVED':
        return '✅';
      case 'APPLICATION_REJECTED':
        return '❌';
      case 'EVENT_PUBLISHED':
        return '📢';
      case 'EVENT_CANCELLED':
        return '🚫';
      case 'FEEDBACK_RECEIVED':
        return '💬';
      case 'VOLUNTEER_CONFIRMED':
        return '👤';
      case 'EVENT_REMINDER':
        return '⏰';
      default:
        return '🔔';
    }
  }

  /**
   * Get notification color based on type
   */
  getNotificationColor(type: string): string {
    switch (type) {
      case 'APPLICATION_RECEIVED':
        return 'info';
      case 'APPLICATION_APPROVED':
        return 'success';
      case 'APPLICATION_REJECTED':
        return 'danger';
      case 'EVENT_PUBLISHED':
        return 'primary';
      case 'EVENT_CANCELLED':
        return 'warning';
      case 'FEEDBACK_RECEIVED':
        return 'secondary';
      case 'VOLUNTEER_CONFIRMED':
        return 'success';
      case 'EVENT_REMINDER':
        return 'warning';
      default:
        return 'secondary';
    }
  }
}
