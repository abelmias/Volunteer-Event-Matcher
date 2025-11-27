import { Component, OnInit } from '@angular/core';
import { NotificationService } from '../../../services/notification.service';
import { Notification, NotificationType } from '../../../models/notification';

/**
 * Notification Center Component
 * Displays all notifications with filtering and management options
 */
@Component({
  selector: 'app-notification-center',
  templateUrl: './notification-center.component.html',
  styleUrls: ['./notification-center.component.css']
})
export class NotificationCenterComponent implements OnInit {
  notifications: Notification[] = [];
  filteredNotifications: Notification[] = [];
  loading = false;
  error = '';
  selectedFilter = 'all'; // all, unread, read
  currentPage = 0;
  pageSize = 10;
  totalNotifications = 0;

  notificationTypes = [
    { value: 'APPLICATION_RECEIVED', label: 'Application Received' },
    { value: 'APPLICATION_APPROVED', label: 'Application Approved' },
    { value: 'APPLICATION_REJECTED', label: 'Application Rejected' },
    { value: 'EVENT_PUBLISHED', label: 'Event Published' },
    { value: 'EVENT_CANCELLED', label: 'Event Cancelled' },
    { value: 'FEEDBACK_RECEIVED', label: 'Feedback Received' },
    { value: 'VOLUNTEER_CONFIRMED', label: 'Volunteer Confirmed' },
    { value: 'EVENT_REMINDER', label: 'Event Reminder' }
  ];

  constructor(private notificationService: NotificationService) { }

  ngOnInit(): void {
    this.loadNotifications();
  }

  /**
   * Load notifications
   */
  loadNotifications(): void {
    this.loading = true;
    this.notificationService.getNotifications(this.currentPage, this.pageSize).subscribe(
      (response: any) => {
        this.notifications = response.content || [];
        this.totalNotifications = response.totalElements || 0;
        this.applyFilters();
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
   * Apply filters to notifications
   */
  applyFilters(): void {
    this.filteredNotifications = this.notifications.filter(notification => {
      if (this.selectedFilter === 'unread') {
        return !notification.isRead;
      } else if (this.selectedFilter === 'read') {
        return notification.isRead;
      }
      return true;
    });
  }

  /**
   * Filter by read status
   */
  onFilterChange(filter: string): void {
    this.selectedFilter = filter;
    this.applyFilters();
  }

  /**
   * Mark notification as read
   */
  markAsRead(notification: Notification): void {
    if (!notification.isRead) {
      this.notificationService.markAsRead(notification.id).subscribe(
        () => {
          notification.isRead = true;
          this.applyFilters();
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
        this.applyFilters();
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
    if (confirm('Delete this notification?')) {
      this.notificationService.deleteNotification(notification.id).subscribe(
        () => {
          this.notifications = this.notifications.filter(n => n.id !== notification.id);
          this.applyFilters();
        },
        (error: any) => {
          console.error('Error deleting notification:', error);
        }
      );
    }
  }

  /**
   * Delete all notifications
   */
  deleteAllNotifications(): void {
    if (confirm('Delete all notifications? This action cannot be undone.')) {
      this.notificationService.deleteAllNotifications().subscribe(
        () => {
          this.notifications = [];
          this.filteredNotifications = [];
        },
        (error: any) => {
          console.error('Error deleting all notifications:', error);
        }
      );
    }
  }

  /**
   * Get notification icon
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
   * Get notification badge class
   */
  getNotificationBadgeClass(type: string): string {
    switch (type) {
      case 'APPLICATION_RECEIVED':
        return 'bg-info';
      case 'APPLICATION_APPROVED':
        return 'bg-success';
      case 'APPLICATION_REJECTED':
        return 'bg-danger';
      case 'EVENT_PUBLISHED':
        return 'bg-primary';
      case 'EVENT_CANCELLED':
        return 'bg-warning';
      case 'FEEDBACK_RECEIVED':
        return 'bg-secondary';
      case 'VOLUNTEER_CONFIRMED':
        return 'bg-success';
      case 'EVENT_REMINDER':
        return 'bg-warning';
      default:
        return 'bg-secondary';
    }
  }

  /**
   * Get unread count
   */
  getUnreadCount(): number {
    return this.notifications.filter(n => !n.isRead).length;
  }

  /**
   * Next page
   */
  nextPage(): void {
    if ((this.currentPage + 1) * this.pageSize < this.totalNotifications) {
      this.currentPage++;
      this.loadNotifications();
    }
  }

  /**
   * Previous page
   */
  previousPage(): void {
    if (this.currentPage > 0) {
      this.currentPage--;
      this.loadNotifications();
    }
  }

  /**
   * Get has next page
   */
  get hasNextPage(): boolean {
    return (this.currentPage + 1) * this.pageSize < this.totalNotifications;
  }

  /**
   * Get has previous page
   */
  get hasPreviousPage(): boolean {
    return this.currentPage > 0;
  }
}
