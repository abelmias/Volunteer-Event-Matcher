import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EventService } from '../../../services/event.service';
import { Event, CreateEventRequest, EVENT_TYPES } from '../../../models/event';

/**
 * Event Form Modal Component
 * Handles creation and editing of events
 */
@Component({
  selector: 'app-event-form-modal',
  templateUrl: './event-form-modal.component.html',
  styleUrls: ['./event-form-modal.component.css']
})
export class EventFormModalComponent implements OnInit {
  @Input() event: Event | null = null;
  @Input() isOpen = false;
  @Output() close = new EventEmitter<void>();
  @Output() save = new EventEmitter<void>();

  eventForm!: FormGroup;
  submitted = false;
  loading = false;
  error = '';
  eventTypes = EVENT_TYPES;

  constructor(
    private fb: FormBuilder,
    private eventService: EventService
  ) { }

  ngOnInit(): void {
    this.initializeForm();
  }

  /**
   * Initialize form with validators
   */
  initializeForm(): void {
    this.eventForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(3)]],
      description: ['', [Validators.required, Validators.minLength(10)]],
      eventType: ['', Validators.required],
      location: ['', [Validators.required, Validators.minLength(3)]],
      latitude: ['', [Validators.required, Validators.pattern(/^-?([0-8]?[0-9]|90)(\.[0-9]{1,8})?$/)]],
      longitude: ['', [Validators.required, Validators.pattern(/^-?(180|1[0-7][0-9]|[0-9]{1,2})(\.[0-9]{1,8})?$/)]],
      eventDate: ['', Validators.required],
      volunteersNeeded: ['', [Validators.required, Validators.min(1)]],
      durationHours: ['', [Validators.required, Validators.min(1)]]
    });

    // Populate form if editing
    if (this.event) {
      this.eventForm.patchValue({
        title: this.event.title,
        description: this.event.description,
        eventType: this.event.eventType,
        location: this.event.location,
        latitude: this.event.latitude,
        longitude: this.event.longitude,
        eventDate: this.event.eventDate,
        volunteersNeeded: this.event.volunteersNeeded,
        durationHours: this.event.durationHours
      });
    }
  }

  /**
   * Get form controls
   */
  get f() {
    return this.eventForm.controls;
  }

  /**
   * Submit form
   */
  onSubmit(): void {
    this.submitted = true;
    this.error = '';

    if (this.eventForm.invalid) {
      return;
    }

    this.loading = true;
    const formData: CreateEventRequest = this.eventForm.value;

    if (this.event) {
      // Update event
      this.eventService.updateEvent(this.event.id, formData).subscribe(
        () => {
          this.loading = false;
          this.save.emit();
          this.closeModal();
        },
        (error: any) => {
          this.loading = false;
          this.error = 'Failed to update event';
          console.error('Error updating event:', error);
        }
      );
    } else {
      // Create event
      this.eventService.createEvent(formData).subscribe(
        () => {
          this.loading = false;
          this.save.emit();
          this.closeModal();
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
   * Close modal
   */
  closeModal(): void {
    this.submitted = false;
    this.error = '';
    this.eventForm.reset();
    this.close.emit();
  }

  /**
   * Get error message for field
   */
  getErrorMessage(fieldName: string): string {
    const control = this.eventForm.get(fieldName);
    if (!control || !control.errors) return '';

    if (control.errors['required']) return `${fieldName} is required`;
    if (control.errors['minlength']) return `${fieldName} must be at least ${control.errors['minlength'].requiredLength} characters`;
    if (control.errors['min']) return `${fieldName} must be at least ${control.errors['min'].min}`;
    if (control.errors['pattern']) return `${fieldName} format is invalid`;

    return 'Invalid input';
  }
}
