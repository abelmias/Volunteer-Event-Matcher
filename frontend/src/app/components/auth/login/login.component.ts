import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { JwtResponse } from '../../../models/jwt-response';

/**
 * Login Component
 * 
 * Handles user login with email and password validation.
 * Redirects to dashboard on successful login.
 */
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  loading = false;
  submitted = false;
  error = '';
  showPassword = false;
  rememberMe = false;
  returnUrl: string = '';

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    this.initializeForm();
    this.loadRememberedCredentials();
    // Get return URL from route parameters or default to dashboard
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '';
  }

  initializeForm(): void {
    this.loginForm = this.formBuilder.group({
      usernameOrEmail: ['', [Validators.required, Validators.minLength(3)]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      rememberMe: [false]
    });
  }

  get f() {
    return this.loginForm.controls;
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  loadRememberedCredentials(): void {
    const remembered = localStorage.getItem('voluntra_remember_me');
    if (remembered) {
      const credentials = JSON.parse(remembered);
      this.loginForm.patchValue({
        usernameOrEmail: credentials.usernameOrEmail,
        rememberMe: true
      });
      this.rememberMe = true;
    }
  }

  onSubmit(): void {
    this.submitted = true;
    this.error = '';

    if (this.loginForm.invalid) {
      return;
    }

    this.loading = true;
    const formValue = this.loginForm.value;
    
    // Save credentials if remember me is checked
    if (formValue.rememberMe) {
      localStorage.setItem('voluntra_remember_me', JSON.stringify({
        usernameOrEmail: formValue.usernameOrEmail
      }));
    } else {
      localStorage.removeItem('voluntra_remember_me');
    }

    this.authService.login({
      usernameOrEmail: formValue.usernameOrEmail,
      password: formValue.password
    }).subscribe(
      (response: JwtResponse) => {
        this.loading = false;
        // If returnUrl is set, navigate to it; otherwise redirect based on role
        if (this.returnUrl) {
          this.router.navigateByUrl(this.returnUrl);
        } else if (response.user.role === 'ORGANIZER') {
          this.router.navigate(['/organizer/dashboard']);
        } else {
          this.router.navigate(['/volunteer/dashboard']);
        }
      },
      (error) => {
        this.loading = false;
        this.error = error.error?.message || 'Invalid username/email or password. Please try again.';
      }
    );
  }

  navigateToRegister(): void {
    this.router.navigate(['/auth/register']);
  }
}
