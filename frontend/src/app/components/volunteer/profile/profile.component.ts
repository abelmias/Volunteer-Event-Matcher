import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-volunteer-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  currentUser: any;
  isEditing = false;
  loading = false;
  successMessage = '';
  errorMessage = '';

  profileForm = {
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    bio: '',
    skills: '',
    availability: ''
  };

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadUserProfile();
  }

  loadUserProfile(): void {
    this.currentUser = this.authService.currentUserValue;
    if (!this.currentUser) {
      this.router.navigate(['/']);
      return;
    }

    // Initialize form with current user data
    this.profileForm = {
      firstName: this.currentUser.firstName || '',
      lastName: this.currentUser.lastName || '',
      email: this.currentUser.email || '',
      phone: this.currentUser.phone || '',
      bio: this.currentUser.bio || '',
      skills: this.currentUser.skills || '',
      availability: this.currentUser.availability || ''
    };
  }

  toggleEdit(): void {
    this.isEditing = !this.isEditing;
    this.successMessage = '';
    this.errorMessage = '';
  }

  saveProfile(): void {
    this.loading = true;
    this.errorMessage = '';
    this.successMessage = '';

    // TODO: Call API to update profile
    // For now, just update local user data
    this.currentUser = {
      ...this.currentUser,
      ...this.profileForm
    };

    setTimeout(() => {
      this.loading = false;
      this.successMessage = 'Profile updated successfully!';
      this.isEditing = false;
    }, 1000);
  }

  cancelEdit(): void {
    this.isEditing = false;
    this.loadUserProfile();
    this.errorMessage = '';
    this.successMessage = '';
  }

  goBack(): void {
    this.router.navigate(['/volunteer/dashboard']);
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/']);
  }
}
