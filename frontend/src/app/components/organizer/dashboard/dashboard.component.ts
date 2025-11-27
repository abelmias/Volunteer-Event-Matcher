import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';

/**
 * Organizer Dashboard Component
 * 
 * Main dashboard for event organizers showing their events and volunteer applications.
 */
@Component({
  selector: 'app-organizer-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  currentUser: any;
  events: any[] = [];
  pendingApplications: any[] = [];
  loading = false;
  error = '';
  success = '';
  activeTab = 'overview';
  
  // Statistics
  totalEvents = 0;
  publishedEvents = 0;
  draftEvents = 0;
  totalApplications = 0;

  constructor(
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.currentUser = this.authService.currentUserValue;
    if (!this.currentUser) {
      this.router.navigate(['/auth/login']);
      return;
    }

    // Check if user is organizer/admin
    if (this.currentUser.role !== 'ORGANIZER') {
      this.router.navigate(['/']);
      return;
    }

    this.loadDashboardData();
  }

  loadDashboardData(): void {
    this.loading = true;
    // TODO: Load events and applications from API
    this.loading = false;
  }

  switchToOverviewTab(): void {
    this.activeTab = 'overview';
  }

  switchToEventsTab(): void {
    this.activeTab = 'events';
  }

  switchToApplicationsTab(): void {
    this.activeTab = 'applications';
  }

  createNewEvent(): void {
    this.router.navigate(['/organizer/events']);
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/']);
  }
}
