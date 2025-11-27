import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApplicationService } from '../../../services/application.service';
import { Application, ApplicationStatus } from '../../../models/application';

/**
 * Application Form Component
 * Used for volunteers to apply to events
 */
@Component({
  selector: 'app-application-form',
  templateUrl: './application-form.component.html',
  styleUrls: ['./application-form.component.css']
})
export class ApplicationFormComponent implements OnInit {
  @Input() eventId: number | null = null;
  @Output() applicationSubmitted = new EventEmitter<Application>();
  @Output() applicationCancelled = new EventEmitter<void>();

  applicationForm!: FormGroup;
  submitted = false;
  loading = false;
  error = '';
  success = '';

  constructor(
    private formBuilder: FormBuilder,
    private applicationService: ApplicationService
  ) { }

  ngOnInit(): void {
    this.initializeForm();
  }

  /**
   * Initialize form with validators
   */
  initializeForm(): void {
    this.applicationForm = this.formBuilder.group({
      motivationText: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(1000)]]
    });
  }

  /**
   * Get form controls for template
   */
  get f() {
    return this.applicationForm.controls;
  }

  /**
   * Submit application
   */
  onSubmit(): void {
    this.submitted = true;
    this.error = '';
    this.success = '';

    if (this.applicationForm.invalid || !this.eventId) {
      this.error = 'Please fill in all required fields';
      return;
    }

    this.loading = true;
    const motivationText = this.applicationForm.get('motivationText')?.value;

    this.applicationService.applyToEvent(this.eventId).subscribe(
      (response: Application) => {
        this.loading = false;
        this.success = 'Application submitted successfully!';
        this.applicationSubmitted.emit(response);
        setTimeout(() => {
          this.applicationForm.reset();
          this.submitted = false;
        }, 2000);
      },
      (error: any) => {
        this.loading = false;
        this.error = error.error?.message || 'Failed to submit application';
      }
    );
  }

  /**
   * Cancel application
   */
  onCancel(): void {
    this.applicationCancelled.emit();
  }
}
