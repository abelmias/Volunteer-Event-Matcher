import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { EventService } from '../../services/event.service';

/**
 * Home Component
 * 
 * Landing page shown before authentication.
 * Provides quick navigation to login/register.
 */
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  title = 'Voluntra';
  upcomingEvents: any[] = [];
  loading = true;

  constructor(
    private router: Router,
    private eventService: EventService
  ) { }

  ngOnInit(): void {
    this.loadUpcomingEvents();
  }

  loadUpcomingEvents(): void {
    this.eventService.getUpcomingEvents().subscribe(
      (response) => {
        // Take only the first 3 events for the preview
        if (response && response.content) {
          this.upcomingEvents = response.content.slice(0, 3);
        }
        this.loading = false;
      },
      (error) => {
        console.error('Error loading events', error);
        this.loading = false;
      }
    );
  }

  navigateToLogin(): void {
    this.router.navigate(['/auth/login']);
  }

  navigateToRegisterVolunteer(): void {
    this.router.navigate(['/auth/register'], { queryParams: { role: 'VOLUNTEER' } });
  }

  navigateToEvents(): void {
    this.router.navigate(['/auth/login'], { 
      queryParams: { returnUrl: '/events' } 
    });
  }

  navigateToAbout(): void {
    this.router.navigate(['/about']);
  }

  postEvent(): void {
    // Navigate to login with return URL to submit event form
    this.router.navigate(['/auth/login'], { 
      queryParams: { returnUrl: '/volunteer/submit-event' } 
    });
  }
}
