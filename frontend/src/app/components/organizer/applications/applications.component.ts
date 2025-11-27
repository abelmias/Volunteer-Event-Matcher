import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';

/**
 * Applications Component
 * 
 * Allows organizers to review and manage volunteer applications.
 */
@Component({
  selector: 'app-applications',
  templateUrl: './applications.component.html',
  styleUrls: ['./applications.component.css']
})
export class ApplicationsComponent implements OnInit {
  applications: any[] = [];
  filteredApplications: any[] = [];
  loading = false;
  currentUser: any;
  statusFilter = 'PENDING';

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
    this.loadApplications();
  }

  loadApplications(): void {
    this.loading = true;
    // TODO: Implement getOrganizerApplications when backend is ready
    this.loading = false;
  }

  filterByStatus(status: string): void {
    this.statusFilter = status;
    this.applyFilters();
  }

  applyFilters(): void {
    this.filteredApplications = this.applications.filter(app => 
      this.statusFilter === 'ALL' || app.status === this.statusFilter
    );
  }

  getPendingCount(): number {
    return this.applications.filter(a => a.status === 'PENDING').length;
  }

  getApprovedCount(): number {
    return this.applications.filter(a => a.status === 'APPROVED').length;
  }

  getRejectedCount(): number {
    return this.applications.filter(a => a.status === 'REJECTED').length;
  }

  approveApplication(applicationId: number): void {
    // TODO: Implement approval when backend is ready
    console.log('Approving application:', applicationId);
  }

  rejectApplication(applicationId: number): void {
    // TODO: Implement rejection when backend is ready
    console.log('Rejecting application:', applicationId);
  }

  goToDashboard(): void {
    this.router.navigate(['/organizer/dashboard']);
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/']);
  }
}
