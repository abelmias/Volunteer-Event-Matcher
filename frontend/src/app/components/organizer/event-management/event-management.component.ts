import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { EventService } from '../../../services/event.service';
import { AuthService } from '../../../services/auth.service';
import { Event, EVENT_TYPES } from '../../../models/event';

/**
 * Event Management Component
 * 
 * Allows organizers to create, edit, and manage their volunteer events.
 * Includes filtering, search, and pagination.
 */
@Component({
  selector: 'app-event-management',
  templateUrl: './event-management.component.html',
  styleUrls: ['./event-management.component.css']
})
export class EventManagementComponent implements OnInit {
  events: Event[] = [];
  filteredEvents: Event[] = [];
  eventForm!: FormGroup;
  filterForm!: FormGroup;
  showForm = false;
  loading = false;
  submitted = false;
  currentUser: any;
  editingEventId: number | null = null;
  errorMessage = '';
  successMessage = '';
  activeTab: string = 'all';
  
  // Pagination
  currentPage = 0;
  pageSize = 10;
  totalEvents = 0;
  
  // Filtering
  eventTypes = EVENT_TYPES;
  searchQuery = '';
  selectedStatus = '';
  selectedType = '';

  constructor(
    private formBuilder: FormBuilder,
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
    this.initializeForm();
    this.initializeFilterForm();
    this.loadEvents();
  }

  initializeForm(): void {
    this.eventForm = this.formBuilder.group({
      title: ['', [Validators.required, Validators.minLength(5)]],
      description: ['', [Validators.required, Validators.minLength(20)]],
      location: ['', Validators.required],
      date: ['', Validators.required],
      duration: ['', [Validators.required, Validators.min(1)]],
      volunteersNeeded: ['', [Validators.required, Validators.min(1)]],
      eventType: ['', Validators.required],
      latitude: ['', Validators.required],
      longitude: ['', Validators.required]
    });
  }

  initializeFilterForm(): void {
    this.filterForm = this.formBuilder.group({
      search: [''],
      status: [''],
      type: ['']
    });
  }

  loadEvents(): void {
    this.loading = true;
    this.eventService.getUpcomingEvents(this.currentPage, this.pageSize).subscribe(
      (response: any) => {
        this.events = response.content || [];
        this.totalEvents = response.totalElements || 0;
        this.applyFilters();
        this.loading = false;
      },
      (error: any) => {
        console.error('Error loading events:', error);
        this.loading = false;
      }
    );
  }

  applyFilters(): void {
    this.filteredEvents = this.events.filter(event => {
      const matchesSearch = !this.searchQuery || 
        event.title.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        event.description.toLowerCase().includes(this.searchQuery.toLowerCase());
      
      // Tab-based filtering
      let matchesTab = true;
      if (this.activeTab === 'published') {
        matchesTab = event.status === 'PUBLISHED';
      } else if (this.activeTab === 'draft') {
        matchesTab = event.status === 'DRAFT';
      }
      
      const matchesStatus = !this.selectedStatus || event.status === this.selectedStatus;
      const matchesType = !this.selectedType || event.eventType === this.selectedType;
      
      return matchesSearch && matchesStatus && matchesType && matchesTab;
    });
  }

  onSearchChange(query: string): void {
    this.searchQuery = query;
    this.applyFilters();
  }

  onStatusChange(status: string): void {
    this.selectedStatus = status;
    this.applyFilters();
  }

  onTypeChange(type: string): void {
    this.selectedType = type;
    this.applyFilters();
  }

  nextPage(): void {
    if ((this.currentPage + 1) * this.pageSize < this.totalEvents) {
      this.currentPage++;
      this.loadEvents();
    }
  }

  previousPage(): void {
    if (this.currentPage > 0) {
      this.currentPage--;
      this.loadEvents();
    }
  }

  get hasNextPage(): boolean {
    return (this.currentPage + 1) * this.pageSize < this.totalEvents;
  }

  get hasPreviousPage(): boolean {
    return this.currentPage > 0;
  }

  switchTab(tab: string): void {
    this.activeTab = tab;
    this.showForm = false;
    this.resetForm();
    this.applyFilters();
  }

  toggleForm(): void {
    this.showForm = !this.showForm;
    if (!this.showForm) {
      this.resetForm();
    }
  }

  resetForm(): void {
    this.eventForm.reset();
    this.submitted = false;
    this.editingEventId = null;
  }

  get f() {
    return this.eventForm.controls;
  }

  onSubmit(): void {
    this.submitted = true;
    this.errorMessage = '';
    this.successMessage = '';

    if (this.eventForm.invalid) {
      this.errorMessage = 'Please fill in all required fields correctly';
      return;
    }

    this.loading = true;
    const formValue = this.eventForm.value;
    
    // Map form fields to API fields
    const eventData = {
      title: formValue.title,
      description: formValue.description,
      location: formValue.location,
      eventDate: formValue.date, // Map 'date' to 'eventDate'
      durationHours: formValue.duration, // Map 'duration' to 'durationHours'
      volunteersNeeded: formValue.volunteersNeeded,
      eventType: formValue.eventType,
      latitude: formValue.latitude,
      longitude: formValue.longitude
    };

    if (this.editingEventId) {
      this.eventService.updateEvent(this.editingEventId, eventData).subscribe(
        (response) => {
          this.loading = false;
          this.successMessage = 'Event updated successfully!';
          setTimeout(() => {
            this.showForm = false;
            this.resetForm();
            this.loadEvents();
          }, 1500);
        },
        (error) => {
          this.loading = false;
          this.errorMessage = error?.error?.message || 'Error updating event. Please try again.';
          console.error('Error updating event:', error);
        }
      );
    } else {
      this.eventService.createEvent(eventData).subscribe(
        (response) => {
          this.loading = false;
          this.successMessage = 'Event created successfully!';
          setTimeout(() => {
            this.showForm = false;
            this.resetForm();
            this.loadEvents();
          }, 1500);
        },
        (error) => {
          this.loading = false;
          this.errorMessage = error?.error?.message || 'Error creating event. Please try again.';
          console.error('Error creating event:', error);
        }
      );
    }
  }

  editEvent(event: any): void {
    this.editingEventId = event.id;
    this.eventForm.patchValue(event);
    this.showForm = true;
  }

  deleteEvent(eventId: number): void {
    if (confirm('Are you sure you want to delete this event?')) {
      this.eventService.deleteEvent(eventId).subscribe(
        () => {
          this.loadEvents();
        },
        (error) => {
          console.error('Error deleting event:', error);
        }
      );
    }
  }

  publishEvent(eventId: number): void {
    this.eventService.publishEvent(eventId).subscribe(
      () => {
        this.loadEvents();
      },
      (error) => {
        console.error('Error publishing event:', error);
      }
    );
  }

  /**
   * Get CSS class for status badge
   */
  getStatusBadgeClass(status: string): string {
    switch (status) {
      case 'DRAFT':
        return 'bg-secondary';
      case 'PUBLISHED':
        return 'bg-success';
      case 'CANCELLED':
        return 'bg-danger';
      case 'COMPLETED':
        return 'bg-info';
      default:
        return 'bg-secondary';
    }
  }

  /**
   * Math object for template
   */
  Math = Math;

  goToDashboard(): void {
    this.router.navigate(['/organizer/dashboard']);
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/']);
  }
}
