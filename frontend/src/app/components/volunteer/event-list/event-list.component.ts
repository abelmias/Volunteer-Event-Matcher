import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { EventService } from '../../../services/event.service';
import { AuthService } from '../../../services/auth.service';

/**
 * Event List Component
 * 
 * Displays all available volunteer events with search and filter capabilities.
 */
@Component({
  selector: 'app-event-list',
  templateUrl: './event-list.component.html',
  styleUrls: ['./event-list.component.css']
})
export class EventListComponent implements OnInit {
  events: any[] = [];
  filteredEvents: any[] = [];
  loading = false;
  searchTerm = '';
  selectedLocation = '';
  currentUser: any;

  constructor(
    private eventService: EventService,
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.currentUser = this.authService.currentUserValue;
    if (!this.currentUser) {
      this.router.navigate(['/auth/login']);
      return;
    }
    this.loadEvents();
  }

  loadEvents(): void {
    this.loading = true;
    this.eventService.getUpcomingEvents().subscribe(
      (response) => {
        this.events = response.content || response;
        this.filteredEvents = this.events;
        this.loading = false;
      },
      (error) => {
        console.error('Error loading events:', error);
        this.loading = false;
      }
    );
  }

  onSearch(): void {
    this.applyFilters();
  }

  onLocationChange(): void {
    this.applyFilters();
  }

  applyFilters(): void {
    this.filteredEvents = this.events.filter(event => {
      const matchesSearch = !this.searchTerm || 
        event.title.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        event.description.toLowerCase().includes(this.searchTerm.toLowerCase());
      
      const matchesLocation = !this.selectedLocation || 
        event.location.toLowerCase() === this.selectedLocation.toLowerCase();
      
      return matchesSearch && matchesLocation;
    });
  }

  viewEventDetail(eventId: number): void {
    this.router.navigate(['/volunteer/events', eventId]);
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/']);
  }

  goToDashboard(): void {
    this.router.navigate(['/volunteer/dashboard']);
  }
}
