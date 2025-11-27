import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { ApplicationService } from '../../../services/application.service';
import { NotificationService } from '../../../services/notification.service';

/**
 * Volunteer Dashboard Component
 * 
 * Displays volunteer's applied events, hours completed, and profile information.
 */
@Component({
  selector: 'app-volunteer-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  currentUser: any;
  applications: any[] = [];
  notifications: any[] = [];
  cartEvents: any[] = [];
  loading = false;
  activeTab = 'all';
  hasNewNotifications = false;

  // Statistics
  totalHours = 0;
  eventsCompleted = 0;
  eventsApplied = 0;
  pendingApplications = 0;
  
  // Progress tracking
  progressPercentage = 0;

  constructor(
    private authService: AuthService,
    private applicationService: ApplicationService,
    private notificationService: NotificationService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.authService.currentUser.subscribe(user => {
      this.currentUser = user;
      if (!user) {
        this.router.navigate(['/auth/login']);
      } else {
        this.loadApplications();
        this.loadNotifications();
        this.loadCartEvents();
      }
    });
  }

  loadApplications(): void {
    if (!this.currentUser) {
      return;
    }
    this.loading = true;
    this.applicationService.getVolunteerApplications(this.currentUser.id).subscribe(
      (data) => {
        this.applications = data;
        this.calculateStatistics();
        this.loading = false;
      },
      (error) => {
        console.error('Error loading applications:', error);
        this.loading = false;
      }
    );
  }

  loadNotifications(): void {
    this.notificationService.getNotifications().subscribe(
      (data) => {
        this.notifications = data.slice(0, 5);
      },
      (error) => {
        console.error('Error loading notifications:', error);
      }
    );
  }

  calculateStatistics(): void {
    this.eventsApplied = this.applications.length;
    this.pendingApplications = this.applications.filter(app => app.status === 'PENDING').length;
    this.eventsCompleted = this.applications.filter(app => app.status === 'COMPLETED').length;
    this.totalHours = this.applications
      .filter(app => app.hoursCompleted)
      .reduce((sum, app) => sum + app.hoursCompleted, 0);
  }

  getFilteredApplications(): any[] {
    switch (this.activeTab) {
      case 'pending':
        return this.applications.filter(app => app.status === 'PENDING');
      case 'approved':
        return this.applications.filter(app => app.status === 'APPROVED');
      case 'completed':
        return this.applications.filter(app => app.status === 'COMPLETED');
      case 'rejected':
        return this.applications.filter(app => app.status === 'REJECTED');
      default:
        return this.applications;
    }
  }

  getStatusColor(status: string): string {
    const colors: { [key: string]: string } = {
      'PENDING': 'warning',
      'APPROVED': 'success',
      'COMPLETED': 'info',
      'REJECTED': 'danger',
      'WITHDRAWN': 'secondary'
    };
    return colors[status] || 'secondary';
  }

  getStatusIcon(status: string): string {
    const icons: { [key: string]: string } = {
      'PENDING': '⏳',
      'APPROVED': '✅',
      'COMPLETED': '🎉',
      'REJECTED': '❌',
      'WITHDRAWN': '↩️'
    };
    return icons[status] || '•';
  }

  formatDate(date: string): string {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }

  viewEventDetails(eventId: number): void {
    this.router.navigate(['/event', eventId]);
  }

  withdrawApplication(applicationId: number): void {
    if (confirm('Are you sure you want to withdraw this application?')) {
      this.applicationService.withdrawApplication(applicationId).subscribe(
        () => {
          this.loadApplications();
        },
        (error) => {
          console.error('Error withdrawing application:', error);
        }
      );
    }
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/']);
  }

  browseMoreEvents(): void {
    this.router.navigate(['/events']);
  }

  editProfile(): void {
    this.router.navigate(['/volunteer/profile']);
  }

  submitEvent(): void {
    this.router.navigate(['/volunteer/submit-event']);
  }

  loadCartEvents(): void {
    if (!this.currentUser) {
      return;
    }

    const cartKey = `event-cart-${this.currentUser.id}`;
    const cart = JSON.parse(localStorage.getItem(cartKey) || '[]');
    this.cartEvents = cart;
  }

  removeFromCart(eventId: number): void {
    if (!this.currentUser) {
      return;
    }

    const cartKey = `event-cart-${this.currentUser.id}`;
    let cart = JSON.parse(localStorage.getItem(cartKey) || '[]');
    cart = cart.filter((e: any) => e.id !== eventId);
    localStorage.setItem(cartKey, JSON.stringify(cart));
    this.loadCartEvents();
  }

  applyFromCart(eventId: number): void {
    // Navigate to event detail page
    this.router.navigate(['/event', eventId]);
  }
}
