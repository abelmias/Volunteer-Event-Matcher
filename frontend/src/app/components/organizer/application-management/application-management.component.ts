import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApplicationService } from '../../../services/application.service';
import { AuthService } from '../../../services/auth.service';
import { Application, ApplicationStatus } from '../../../models/application';

/**
 * Application Management Component
 * Allows organizers to review and manage volunteer applications
 */
@Component({
  selector: 'app-application-management',
  templateUrl: './application-management.component.html',
  styleUrls: ['./application-management.component.css']
})
export class ApplicationManagementComponent implements OnInit {
  applications: Application[] = [];
  filteredApplications: Application[] = [];
  feedbackForm!: FormGroup;
  loading = false;
  submitted = false;
  currentUser: any;
  selectedApplication: Application | null = null;
  showFeedbackForm = false;
  selectedStatus = 'PENDING';
  error = '';
  success = '';

  statusOptions = [
    { value: 'PENDING', label: 'Pending' },
    { value: 'APPROVED', label: 'Approved' },
    { value: 'REJECTED', label: 'Rejected' },
    { value: 'COMPLETED', label: 'Completed' }
  ];

  constructor(
    private formBuilder: FormBuilder,
    private applicationService: ApplicationService,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    this.currentUser = this.authService.currentUserValue;
    this.initializeFeedbackForm();
    this.loadApplications();
  }

  /**
   * Initialize feedback form
   */
  initializeFeedbackForm(): void {
    this.feedbackForm = this.formBuilder.group({
      rating: ['', [Validators.required, Validators.min(1), Validators.max(5)]],
      feedback: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(500)]]
    });
  }

  /**
   * Load pending applications
   */
  loadApplications(): void {
    this.loading = true;
    this.applicationService.getPendingApplications().subscribe(
      (response: Application[]) => {
        this.applications = response;
        this.applyFilters();
        this.loading = false;
      },
      (error: any) => {
        this.error = 'Failed to load applications';
        console.error('Error loading applications:', error);
        this.loading = false;
      }
    );
  }

  /**
   * Apply filters to applications
   */
  applyFilters(): void {
    this.filteredApplications = this.applications.filter(app => {
      if (this.selectedStatus && app.status !== this.selectedStatus) {
        return false;
      }
      return true;
    });
  }

  /**
   * Filter by status
   */
  onStatusChange(status: string): void {
    this.selectedStatus = status;
    this.applyFilters();
  }

  /**
   * Get status badge class
   */
  getStatusBadgeClass(status: string): string {
    switch (status) {
      case 'PENDING':
        return 'bg-warning';
      case 'APPROVED':
        return 'bg-success';
      case 'REJECTED':
        return 'bg-danger';
      case 'COMPLETED':
        return 'bg-info';
      default:
        return 'bg-secondary';
    }
  }

  /**
   * Approve application
   */
  approveApplication(application: Application): void {
    if (confirm(`Approve application from ${application.volunteerName}?`)) {
      this.loading = true;
      this.applicationService.approveApplication(application.id).subscribe(
        (response: Application) => {
          this.success = `Application from ${application.volunteerName} approved!`;
          this.loadApplications();
          this.loading = false;
        },
        (error: any) => {
          this.error = 'Failed to approve application';
          this.loading = false;
        }
      );
    }
  }

  /**
   * Reject application
   */
  rejectApplication(application: Application): void {
    if (confirm(`Reject application from ${application.volunteerName}?`)) {
      this.loading = true;
      this.applicationService.rejectApplication(application.id).subscribe(
        (response: Application) => {
          this.success = `Application from ${application.volunteerName} rejected!`;
          this.loadApplications();
          this.loading = false;
        },
        (error: any) => {
          this.error = 'Failed to reject application';
          this.loading = false;
        }
      );
    }
  }

  /**
   * Open feedback form
   */
  openFeedbackForm(application: Application): void {
    this.selectedApplication = application;
    this.showFeedbackForm = true;
    this.feedbackForm.reset();
  }

  /**
   * Submit feedback
   */
  submitFeedback(): void {
    this.submitted = true;
    this.error = '';
    this.success = '';

    if (this.feedbackForm.invalid || !this.selectedApplication) {
      this.error = 'Please fill in all required fields';
      return;
    }

    this.loading = true;
    const { rating, feedback } = this.feedbackForm.value;

    this.applicationService.completeApplication(this.selectedApplication.id, rating, feedback).subscribe(
      (response: Application) => {
        this.loading = false;
        this.success = 'Feedback submitted successfully!';
        this.showFeedbackForm = false;
        this.selectedApplication = null;
        this.loadApplications();
      },
      (error: any) => {
        this.loading = false;
        this.error = 'Failed to submit feedback';
      }
    );
  }

  /**
   * Cancel feedback form
   */
  cancelFeedback(): void {
    this.showFeedbackForm = false;
    this.selectedApplication = null;
    this.feedbackForm.reset();
    this.submitted = false;
  }

  /**
   * Get form controls
   */
  get f() {
    return this.feedbackForm.controls;
  }
}
