import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NotificationService } from '../../services/notification.service';
import { AuthService } from '../../services/auth.service';

/**
 * Notification Center Component
 * 
 * Displays all notifications for the current user.
 */
@Component({
  selector: 'app-notification-center',
  templateUrl: './notification-center.component.html',
  styleUrls: ['./notification-center.component.css']
})
export class NotificationCenterComponent implements OnInit {
  notifications: any[] = [];
  loading = false;
  currentUser: any;

  constructor(
    private notificationService: NotificationService,
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.currentUser = this.authService.currentUserValue;
    if (!this.currentUser) {
      this.router.navigate(['/auth/login']);
      return;
    }
    this.loadNotifications();
  }

  loadNotifications(): void {
    this.loading = true;
    this.notificationService.getNotifications().subscribe(
      (response) => {
        this.notifications = response.content || response;
        this.loading = false;
      },
      (error) => {
        console.error('Error loading notifications:', error);
        this.loading = false;
      }
    );
  }

  markAsRead(notificationId: number): void {
    this.notificationService.markAsRead(notificationId).subscribe(
      () => {
        this.loadNotifications();
      },
      (error) => {
        console.error('Error marking notification as read:', error);
      }
    );
  }

  markAllAsRead(): void {
    this.notificationService.markAllAsRead().subscribe(
      () => {
        this.loadNotifications();
      },
      (error) => {
        console.error('Error marking all as read:', error);
      }
    );
  }

  deleteNotification(notificationId: number): void {
    if (confirm('Delete this notification?')) {
      this.notificationService.deleteNotification(notificationId).subscribe(
        () => {
          this.loadNotifications();
        },
        (error) => {
          console.error('Error deleting notification:', error);
        }
      );
    }
  }

  deleteAllNotifications(): void {
    if (confirm('Delete all notifications?')) {
      this.notificationService.deleteAllNotifications().subscribe(
        () => {
          this.loadNotifications();
        },
        (error) => {
          console.error('Error deleting all notifications:', error);
        }
      );
    }
  }

  goBack(): void {
    window.history.back();
  }
}
