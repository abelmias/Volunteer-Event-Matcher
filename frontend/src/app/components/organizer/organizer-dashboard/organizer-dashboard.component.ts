import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EventService } from '../../../services/event.service';
import { AuthService } from '../../../services/auth.service';
import { ApplicationService } from '../../../services/application.service';
import { Event } from '../../../models/event';
import { Application } from '../../../models/application';

/**
 * Organizer Dashboard Component
 * 
 * Displays organizer dashboard with event management, applications, and statistics
 */
@Component({
  selector: 'app-organizer-dashboard',
  templateUrl: './organizer-dashboard.component.html',
  styleUrls: ['./organizer-dashboard.component.css']
})
export class OrganizerDashboardComponent implements OnInit {
  
  // User data
  currentUser: any;
  
  // Events
  events: Event[] = [];
  filteredEvents: Event[] = [];
  selectedEventFilter = 'all'; // all, draft, published, cancelled
  
  // Pending Submissions
  pendingSubmissions: Event[] = [];
  filteredPendingSubmissions: Event[] = [];
  
  // Applications
  pendingApplications: Application[] = [];
  allApplications: Application[] = [];
  
  // Statistics
  totalEvents = 0;
  publishedEvents = 0;
  draftEvents = 0;
  totalApplications = 0;
  pendingApplicationsCount = 0;
  approvedApplicationsCount = 0;
  rejectedApplicationsCount = 0;
  totalVolunteersNeeded = 0;
  totalVolunteersConfirmed = 0;
  
  // UI State
  loading = false;
  activeTab = 'overview'; // overview, events, applications
  selectedEvent: Event | null = null;
  selectedApplication: Application | null = null;
  showEventForm = false;
  showApplicationDetails = false;
  error = '';
  success = '';
  submitted = false;

  // Form
  eventForm!: FormGroup;

  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private eventService: EventService,
    private authService: AuthService,
    private applicationService: ApplicationService
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

    this.initializeEventForm();
    this.loadDashboardData();
  }

  /**
   * Initialize event form
   */
  initializeEventForm(): void {
    this.eventForm = this.formBuilder.group({
      title: ['', [Validators.required, Validators.minLength(5)]],
      description: ['', [Validators.required, Validators.minLength(20)]],
      eventType: ['', Validators.required],
      location: ['', Validators.required],
      eventDate: ['', Validators.required],
      durationHours: ['', [Validators.required, Validators.min(1)]],
      volunteersNeeded: ['', [Validators.required, Validators.min(1)]],
      latitude: [''],
      longitude: [''],
      imageUrl: ['']
    });
  }

  /**
   * Get form controls
   */
  get f() {
    return this.eventForm.controls;
  }

  /**
   * Load all dashboard data
   */
  loadDashboardData(): void {
    this.loading = true;
    this.error = '';

    // Load organizer's events
    this.eventService.getOrganizerEvents().subscribe(
      (events: Event[]) => {
        this.events = events;
        this.filterEvents();
        this.calculateEventStatistics();
        this.loadPendingSubmissions();
      },
      (error: any) => {
        this.error = 'Failed to load events';
        console.error('Error loading events:', error);
        this.loading = false;
      }
    );
  }

  /**
   * Load pending volunteer submissions
   */
  loadPendingSubmissions(): void {
    this.eventService.getPendingApprovalEvents().subscribe(
      (events: Event[]) => {
        this.pendingSubmissions = events;
        this.filteredPendingSubmissions = events;
        console.log('Pending submissions loaded:', events);
        this.loadApplications();
      },
      (error: any) => {
        console.error('Error loading pending submissions:', error);
        this.loadApplications();
      }
    );
  }

  /**
   * Load all applications for organizer's events
   */
  loadApplications(): void {
    this.applicationService.getPendingApplications().subscribe(
      (applications: Application[]) => {
        this.pendingApplications = applications;
        this.loadAllApplications();
      },
      (error: any) => {
        console.error('Error loading pending applications:', error);
        this.loading = false;
      }
    );
  }

  /**
   * Load all applications (not just pending)
   */
  loadAllApplications(): void {
    // In a real app, you'd have an endpoint to get all applications for organizer
    // For now, we'll just use pending applications
    this.allApplications = this.pendingApplications;
    this.calculateApplicationStatistics();
    this.loading = false;
  }

  /**
   * Filter events based on selected filter
   */
  filterEvents(): void {
    switch (this.selectedEventFilter) {
      case 'draft':
        this.filteredEvents = this.events.filter(e => e.status === 'DRAFT');
        break;
      case 'published':
        this.filteredEvents = this.events.filter(e => e.status === 'PUBLISHED');
        break;
      case 'cancelled':
        this.filteredEvents = this.events.filter(e => e.status === 'CANCELLED');
        break;
      default:
        this.filteredEvents = this.events;
    }
  }

  /**
   * Calculate event statistics
   */
  calculateEventStatistics(): void {
    this.totalEvents = this.events.length;
    this.publishedEvents = this.events.filter(e => e.status === 'PUBLISHED').length;
    this.draftEvents = this.events.filter(e => e.status === 'DRAFT').length;
    this.totalVolunteersNeeded = this.events.reduce((sum, e) => sum + e.volunteersNeeded, 0);
    this.totalVolunteersConfirmed = this.events.reduce((sum, e) => sum + e.volunteersConfirmed, 0);
  }

  /**
   * Calculate application statistics
   */
  calculateApplicationStatistics(): void {
    this.totalApplications = this.allApplications.length;
    this.pendingApplicationsCount = this.allApplications.filter(a => a.status === 'PENDING').length;
    this.approvedApplicationsCount = this.allApplications.filter(a => a.status === 'APPROVED').length;
    this.rejectedApplicationsCount = this.allApplications.filter(a => a.status === 'REJECTED').length;
  }

  /**
   * Get volunteer percentage
   */
  getVolunteerPercentage(): number {
    if (this.totalVolunteersNeeded === 0) return 0;
    return Math.round((this.totalVolunteersConfirmed / this.totalVolunteersNeeded) * 100);
  }

  /**
   * Switch to events tab
   */
  switchToEventsTab(): void {
    this.activeTab = 'events';
    this.selectedEventFilter = 'all';
    this.filterEvents();
  }

  /**
   * Switch to applications tab
   */
  switchToApplicationsTab(): void {
    this.activeTab = 'applications';
  }

  /**
   * Switch to overview tab
   */
  switchToOverviewTab(): void {
    this.activeTab = 'overview';
  }

  /**
   * Create new event
   */
  createNewEvent(): void {
    this.submitted = false;
    this.eventForm.reset();
    this.selectedEvent = null;
    this.showEventForm = true;
  }

  /**
   * Save event (create or update)
   */
  saveEvent(): void {
    this.submitted = true;

    if (this.eventForm.invalid) {
      this.error = 'Please fill in all required fields correctly.';
      return;
    }

    this.loading = true;
    const formValue = this.eventForm.value;

    // Convert eventDate string to proper format
    const eventDate = new Date(formValue.eventDate);

    const eventData: any = {
      title: formValue.title,
      description: formValue.description,
      eventType: formValue.eventType,
      location: formValue.location,
      eventDate: eventDate.toISOString(),
      durationHours: parseInt(formValue.durationHours),
      volunteersNeeded: parseInt(formValue.volunteersNeeded),
      latitude: formValue.latitude ? parseFloat(formValue.latitude) : undefined,
      longitude: formValue.longitude ? parseFloat(formValue.longitude) : undefined,
      imageUrl: formValue.imageUrl || undefined
    };

    if (this.selectedEvent) {
      // Update existing event
      this.eventService.updateEvent(this.selectedEvent.id, eventData).subscribe(
        () => {
          this.loading = false;
          this.success = 'Event updated successfully';
          this.closeEventForm();
          this.loadDashboardData();
          setTimeout(() => this.success = '', 3000);
        },
        (error: any) => {
          this.loading = false;
          this.error = 'Failed to update event';
          console.error('Error updating event:', error);
        }
      );
    } else {
      // Create new event
      this.eventService.createEvent(eventData).subscribe(
        () => {
          this.loading = false;
          this.success = 'Event created successfully';
          this.closeEventForm();
          this.loadDashboardData();
          setTimeout(() => this.success = '', 3000);
        },
        (error: any) => {
          this.loading = false;
          this.error = 'Failed to create event';
          console.error('Error creating event:', error);
        }
      );
    }
  }

  /**
   * Edit event
   */
  editEvent(event: Event): void {
    this.selectedEvent = event;
    this.submitted = false;
    this.eventForm.patchValue({
      title: event.title,
      description: event.description,
      eventType: event.eventType,
      location: event.location,
      eventDate: event.eventDate,
      durationHours: event.durationHours,
      volunteersNeeded: event.volunteersNeeded,
      latitude: event.latitude,
      longitude: event.longitude,
      imageUrl: event.imageUrl
    });
    this.showEventForm = true;
  }

  /**
   * Delete event
   */
  deleteEvent(eventId: number): void {
    if (confirm('Are you sure you want to delete this event?')) {
      this.eventService.deleteEvent(eventId).subscribe(
        () => {
          this.success = 'Event deleted successfully';
          this.loadDashboardData();
          setTimeout(() => this.success = '', 3000);
        },
        (error: any) => {
          this.error = 'Failed to delete event';
          console.error('Error deleting event:', error);
        }
      );
    }
  }

  /**
   * Publish event
   */
  publishEvent(event: Event): void {
    this.eventService.publishEvent(event.id).subscribe({
      next: (response: any) => {
        console.log('Event published response:', response);
        // Update event status immediately in the list for better UX
        const index = this.events.findIndex((e: Event) => e.id === event.id);
        if (index !== -1) {
          this.events[index].status = 'PUBLISHED';
        }
        this.success = 'Event published successfully';
        // Reload all data to ensure consistency
        this.loadDashboardData();
        setTimeout(() => this.success = '', 3000);
      },
      error: (error: any) => {
        let errorMsg = 'Failed to publish event';
        if (error.error?.message) {
          errorMsg = `Failed to publish event: ${error.error.message}`;
        } else if (typeof error.error === 'string') {
          errorMsg = `Failed to publish event: ${error.error}`;
        }
        this.error = errorMsg;
        console.error('Error publishing event:', error);
        console.error('Error status:', error.status);
      }
    });
  }

  /**
   * Unpublish event
   */
  unpublishEvent(event: Event): void {
    if (confirm('Are you sure you want to unpublish this event?')) {
      this.eventService.unpublishEvent(event.id).subscribe({
        next: (response: any) => {
          console.log('Event unpublished response:', response);
          // Update event status immediately in the list for better UX
          const index = this.events.findIndex((e: Event) => e.id === event.id);
          if (index !== -1) {
            this.events[index].status = 'DRAFT';
          }
          this.success = 'Event unpublished successfully';
          // Reload all data to ensure consistency
          this.loadDashboardData();
          setTimeout(() => this.success = '', 3000);
        },
        error: (error: any) => {
          let errorMsg = 'Failed to unpublish event';
          if (error.error?.message) {
            errorMsg = `Failed to unpublish event: ${error.error.message}`;
          } else if (typeof error.error === 'string') {
            errorMsg = `Failed to unpublish event: ${error.error}`;
          }
          this.error = errorMsg;
          console.error('Error unpublishing event:', error);
          console.error('Error status:', error.status);
        }
      });
    }
  }

  /**
   * Cancel event
   */
  cancelEvent(event: Event): void {
    if (confirm('Are you sure you want to cancel this event?')) {
      this.eventService.cancelEvent(event.id).subscribe({
        next: (response: any) => {
          console.log('Event cancelled response:', response);
          // Update event status immediately in the list for better UX
          const index = this.events.findIndex((e: Event) => e.id === event.id);
          if (index !== -1) {
            this.events[index].status = 'CANCELLED';
          }
          this.success = 'Event cancelled successfully';
          // Reload all data to ensure consistency
          this.loadDashboardData();
          setTimeout(() => this.success = '', 3000);
        },
        error: (error: any) => {
          let errorMsg = 'Failed to cancel event';
          if (error.error?.message) {
            errorMsg = `Failed to cancel event: ${error.error.message}`;
          } else if (typeof error.error === 'string') {
            errorMsg = `Failed to cancel event: ${error.error}`;
          }
          this.error = errorMsg;
          console.error('Error cancelling event:', error);
          console.error('Error status:', error.status);
        }
      });
    }
  }

  /**
   * View application details
   */
  viewApplicationDetails(application: Application): void {
    this.selectedApplication = application;
    this.showApplicationDetails = true;
  }

  /**
   * Approve application
   */
  approveApplication(applicationId: number): void {
    this.applicationService.approveApplication(applicationId).subscribe(
      () => {
        this.success = 'Application approved successfully';
        this.loadDashboardData();
        this.showApplicationDetails = false;
        setTimeout(() => this.success = '', 3000);
      },
      (error: any) => {
        // Extract detailed error message from backend response
        let errorMsg = 'Failed to approve application';
        if (error.error?.message) {
          errorMsg = `Failed to approve application: ${error.error.message}`;
        } else if (typeof error.error === 'string') {
          errorMsg = `Failed to approve application: ${error.error}`;
        } else if (error.message) {
          errorMsg = `Failed to approve application: ${error.message}`;
        }
        this.error = errorMsg;
        console.error('Error approving application:', error);
        console.error('Error status:', error.status);
        console.error('Error details:', error.error);
      }
    );
  }

  /**
   * Reject application
   */
  rejectApplication(applicationId: number): void {
    this.applicationService.rejectApplication(applicationId).subscribe(
      () => {
        this.success = 'Application rejected successfully';
        this.loadDashboardData();
        this.showApplicationDetails = false;
        setTimeout(() => this.success = '', 3000);
      },
      (error: any) => {
        // Extract detailed error message from backend response
        let errorMsg = 'Failed to reject application';
        if (error.error?.message) {
          errorMsg = `Failed to reject application: ${error.error.message}`;
        } else if (typeof error.error === 'string') {
          errorMsg = `Failed to reject application: ${error.error}`;
        } else if (error.message) {
          errorMsg = `Failed to reject application: ${error.message}`;
        }
        this.error = errorMsg;
        console.error('Error rejecting application:', error);
        console.error('Error status:', error.status);
        console.error('Error details:', error.error);
      }
    );
  }

  /**
   * Close event form
   */
  closeEventForm(): void {
    this.showEventForm = false;
    this.selectedEvent = null;
  }

  /**
   * Close application details
   */
  closeApplicationDetails(): void {
    this.showApplicationDetails = false;
    this.selectedApplication = null;
  }

  /**
   * Approve pending submission
   */
  approvePendingSubmission(eventId: number): void {
    this.eventService.approveEvent(eventId).subscribe({
      next: (response: any) => {
        console.log('Event approved response:', response);
        // Remove event from pending list immediately for better UX
        this.pendingSubmissions = this.pendingSubmissions.filter(e => e.id !== eventId);
        this.success = 'Event approved successfully';
        // Reload all data to ensure consistency
        this.loadDashboardData();
        setTimeout(() => this.success = '', 3000);
      },
      error: (error: any) => {
        // Extract detailed error message from backend response
        let errorMsg = 'Failed to approve event';
        if (error.error?.message) {
          errorMsg = `Failed to approve event: ${error.error.message}`;
        } else if (typeof error.error === 'string') {
          errorMsg = `Failed to approve event: ${error.error}`;
        } else if (error.message) {
          errorMsg = `Failed to approve event: ${error.message}`;
        }
        this.error = errorMsg;
        console.error('Error approving event:', error);
        console.error('Error status:', error.status);
        console.error('Error details:', error.error);
      }
    });
  }

  /**
   * Reject pending submission
   */
  rejectPendingSubmission(eventId: number): void {
    this.eventService.rejectEvent(eventId).subscribe({
      next: (response: any) => {
        console.log('Event rejected response:', response);
        // Remove event from pending list immediately for better UX
        this.pendingSubmissions = this.pendingSubmissions.filter(e => e.id !== eventId);
        this.success = 'Event rejected successfully';
        // Reload all data to ensure consistency
        this.loadDashboardData();
        setTimeout(() => this.success = '', 3000);
      },
      error: (error: any) => {
        // Extract detailed error message from backend response
        let errorMsg = 'Failed to reject event';
        if (error.error?.message) {
          errorMsg = `Failed to reject event: ${error.error.message}`;
        } else if (typeof error.error === 'string') {
          errorMsg = `Failed to reject event: ${error.error}`;
        } else if (error.message) {
          errorMsg = `Failed to reject event: ${error.message}`;
        }
        this.error = errorMsg;
        console.error('Error rejecting event:', error);
        console.error('Error status:', error.status);
        console.error('Error details:', error.error);
      }
    });
  }

  /**
   * Logout
   */
  logout(): void {
    this.authService.logout();
    this.router.navigate(['/']);
  }

  /**
   * Get status badge color
   */
  getStatusColor(status: string): string {
    switch (status?.toUpperCase()) {
      case 'DRAFT':
        return 'secondary';
      case 'PUBLISHED':
        return 'success';
      case 'CANCELLED':
        return 'danger';
      case 'PENDING':
        return 'warning';
      case 'APPROVED':
        return 'success';
      case 'REJECTED':
        return 'danger';
      default:
        return 'info';
    }
  }
}
