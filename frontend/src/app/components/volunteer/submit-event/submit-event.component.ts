import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { EventService } from '../../../services/event.service';

@Component({
  selector: 'app-submit-event',
  templateUrl: './submit-event.component.html',
  styleUrls: ['./submit-event.component.css']
})
export class SubmitEventComponent implements OnInit {
  eventForm!: FormGroup;
  loading = false;
  submitted = false;
  successMessage = '';
  errorMessage = '';
  currentUser: any;

  eventTypes = [
    'Community Service',
    'Environmental',
    'Education',
    'Healthcare',
    'Animal Care',
    'Disaster Relief',
    'Sports & Recreation',
    'Arts & Culture',
    'Other'
  ];

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private authService: AuthService,
    private eventService: EventService
  ) {}

  ngOnInit(): void {
    this.currentUser = this.authService.currentUserValue;
    if (!this.currentUser) {
      this.router.navigate(['/auth/login']);
      return;
    }

    this.initializeForm();
  }

  initializeForm(): void {
    this.eventForm = this.formBuilder.group({
      title: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(200)]],
      description: ['', [Validators.required, Validators.minLength(20), Validators.maxLength(2000)]],
      eventType: ['', Validators.required],
      location: ['', [Validators.required, Validators.minLength(5)]],
      date: ['', Validators.required],
      time: ['', Validators.required],
      volunteersNeeded: ['', [Validators.required, Validators.min(1), Validators.max(1000)]],
      duration: ['', [Validators.required, Validators.min(1), Validators.max(480)]],
      legitimacyDescription: ['', [Validators.required, Validators.minLength(50), Validators.maxLength(1000)]],
      requirements: ['', Validators.maxLength(500)],
      benefits: ['', Validators.maxLength(500)]
    });
  }

  get f() {
    return this.eventForm.controls;
  }

  onSubmit(): void {
    this.submitted = true;
    this.errorMessage = '';
    this.successMessage = '';

    if (this.eventForm.invalid) {
      this.errorMessage = 'Please fill in all required fields correctly.';
      return;
    }

    this.loading = true;

    // Combine date and time into a single datetime
    const formValue = this.eventForm.value;
    const eventDate = new Date(formValue.date);
    const [hours, minutes] = formValue.time.split(':');
    eventDate.setHours(parseInt(hours), parseInt(minutes));

    // Prepare event data for submission (volunteer submission - no lat/lng)
    const eventData: any = {
      title: formValue.title,
      description: formValue.description,
      eventType: formValue.eventType,
      location: formValue.location,
      eventDate: eventDate.toISOString(),
      durationHours: parseInt(formValue.duration),
      volunteersNeeded: parseInt(formValue.volunteersNeeded),
      legitimacyDescription: formValue.legitimacyDescription,
      requirements: formValue.requirements || null,
      benefits: formValue.benefits || null
    };

    // Call the API to submit the event (volunteer submission endpoint)
    this.eventService.submitEventForReview(eventData).subscribe(
      (response: any) => {
        this.loading = false;
        this.successMessage = 'Event submitted successfully! Admins will review it shortly. Redirecting to dashboard...';
        setTimeout(() => {
          this.router.navigate(['/volunteer/dashboard']);
        }, 2500);
      },
      (error: any) => {
        this.loading = false;
        // Extract error message from various possible response formats
        let errorMsg = 'Failed to submit event. Please try again.';
        if (error.error?.message) {
          errorMsg = error.error.message;
        } else if (typeof error.error === 'string') {
          errorMsg = error.error;
        } else if (error.message) {
          errorMsg = error.message;
        }
        this.errorMessage = errorMsg;
        console.error('Error submitting event:', error);
        console.error('Error status:', error.status);
        console.error('Error details:', error.error);
      }
    );
  }

  goBack(): void {
    this.router.navigate(['/volunteer/dashboard']);
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/']);
  }
}
