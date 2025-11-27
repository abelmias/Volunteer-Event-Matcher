import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';

/**
 * Register Component
 * 
 * Handles user registration with role selection (Volunteer or Organizer).
 * Includes password confirmation validation.
 */
@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  registerForm!: FormGroup;
  loading = false;
  submitted = false;
  error = '';
  success = '';
  showPassword = false;
  showConfirmPassword = false;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    this.initializeForm();
  }

  initializeForm(): void {
    this.registerForm = this.formBuilder.group({
      firstName: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(100)]],
      lastName: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(100)]],
      username: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(100)]],
      confirmPassword: ['', Validators.required],
      role: ['VOLUNTEER', Validators.required]
    }, { validators: this.passwordMatchValidator });
  }

  passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
    const password = control.get('password');
    const confirmPassword = control.get('confirmPassword');

    if (!password || !confirmPassword) {
      return null;
    }

    return password.value === confirmPassword.value ? null : { passwordMismatch: true };
  }

  get f() {
    return this.registerForm.controls;
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  toggleConfirmPasswordVisibility(): void {
    this.showConfirmPassword = !this.showConfirmPassword;
  }

  onSubmit(): void {
    this.submitted = true;
    this.error = '';
    this.success = '';

    if (this.registerForm.invalid) {
      return;
    }

    this.loading = true;

    const registrationData = {
      username: this.f['username'].value,
      email: this.f['email'].value,
      password: this.f['password'].value,
      role: 'VOLUNTEER', // Force role to VOLUNTEER
      firstName: this.f['firstName'].value,
      lastName: this.f['lastName'].value
    };

    this.authService.register(registrationData).subscribe(
      (response) => {
        this.loading = false;
        this.success = 'Registration successful! Redirecting to login...';
        setTimeout(() => {
          this.router.navigate(['/auth/login']);
        }, 2000);
      },
      (error) => {
        this.loading = false;
        // Handle different error response formats
        if (error.error?.message) {
          this.error = error.error.message;
        } else if (error.error?.errors) {
          // Handle validation errors array
          this.error = error.error.errors.map((e: any) => e.message).join(', ');
        } else if (typeof error.error === 'string') {
          this.error = error.error;
        } else {
          this.error = 'Registration failed. Please try again.';
        }
      }
    );
  }

  navigateToLogin(): void {
    this.router.navigate(['/auth/login']);
  }
}
