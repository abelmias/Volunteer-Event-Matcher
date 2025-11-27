import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { EventService } from '../../services/event.service';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { Event, PaginatedEvents } from '../../models/event';

/**
 * Event Listing Component
 * 
 * Displays all published events with search and filter capabilities.
 * Allows volunteers to browse and apply to events.
 */
@Component({
  selector: 'app-event-listing',
  templateUrl: './event-listing.component.html',
  styleUrls: ['./event-listing.component.css']
})
export class EventListingComponent implements OnInit {
  events: Event[] = [];
  filteredEvents: Event[] = [];
  loading = false;
  searchForm!: FormGroup;
  currentUser: any;

  constructor(
    private eventService: EventService,
    private authService: AuthService,
    private formBuilder: FormBuilder,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.initializeForm();
    this.loadEvents();
    this.authService.currentUser.subscribe(user => {
      this.currentUser = user;
    });
  }

  initializeForm(): void {
    this.searchForm = this.formBuilder.group({
      searchTerm: [''],
      location: [''],
      eventType: [''],
      sortBy: ['eventDate']
    });
  }

  loadEvents(): void {
    this.loading = true;
    this.eventService.getUpcomingEvents().subscribe(
      (data: PaginatedEvents) => {
        this.events = data.content || [];
        this.filteredEvents = data.content || [];
        this.loading = false;
      },
      (error: any) => {
        console.error('Error loading events:', error);
        this.loading = false;
      }
    );
  }

  onSearch(): void {
    const { searchTerm, location, eventType, sortBy } = this.searchForm.value;
    
    this.filteredEvents = this.events.filter(event => {
      const matchesSearch = !searchTerm || 
        event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.description.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesLocation = !location || 
        event.location.toLowerCase().includes(location.toLowerCase());
      
      const matchesType = !eventType || event.eventType === eventType;
      
      return matchesSearch && matchesLocation && matchesType;
    });

    // Sort events
    if (sortBy === 'date') {
      this.filteredEvents.sort((a, b) => new Date(a.eventDate).getTime() - new Date(b.eventDate).getTime());
    } else if (sortBy === 'title') {
      this.filteredEvents.sort((a, b) => a.title.localeCompare(b.title));
    }
  }

  resetFilters(): void {
    this.searchForm.reset({
      searchTerm: '',
      location: '',
      eventType: '',
      sortBy: 'date'
    });
    this.filteredEvents = this.events;
  }

  viewEventDetails(eventId: number): void {
    this.router.navigate(['/event', eventId]);
  }

  applyToEvent(eventId: number): void {
    if (!this.currentUser) {
      this.router.navigate(['/auth/login']);
      return;
    }
    this.router.navigate(['/event', eventId, 'apply']);
  }

  getEventTypeColor(eventType: string): string {
    const colors: { [key: string]: string } = {
      'COMMUNITY_SERVICE': 'primary',
      'ENVIRONMENTAL': 'success',
      'EDUCATION': 'info',
      'HEALTHCARE': 'danger',
      'DISASTER_RELIEF': 'warning',
      'OTHER': 'secondary'
    };
    return colors[eventType] || 'secondary';
  }

  formatDate(date: string): string {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }

  getVolunteersSlotsRemaining(event: any): number {
    return event.volunteersNeeded - event.volunteersConfirmed;
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/']);
  }

  goToProfile(): void {
    this.router.navigate(['/volunteer/profile']);
  }

  goToDashboard(): void {
    this.router.navigate(['/volunteer/dashboard']);
  }
}
