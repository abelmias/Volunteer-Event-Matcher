import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { EventService } from '../../services/event.service';
import { ApplicationService } from '../../services/application.service';
import { AuthService } from '../../services/auth.service';
import * as L from 'leaflet';

// Fix Leaflet icon issue
const iconRetinaUrl = 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png';
const iconUrl = 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png';
const shadowUrl = 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png';
const iconDefault = L.icon({
  iconRetinaUrl,
  iconUrl,
  shadowUrl,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  tooltipAnchor: [16, -28],
  shadowSize: [41, 41]
});
L.Marker.prototype.options.icon = iconDefault;

/**
 * Event Detail Component
 * 
 * Displays detailed information about a specific event including
 * location map, event description, and application functionality.
 */
@Component({
  selector: 'app-event-detail',
  templateUrl: './event-detail.component.html',
  styleUrls: ['./event-detail.component.css']
})
export class EventDetailComponent implements OnInit {
  event: any;
  loading = true;
  applying = false;
  addingToCart = false;
  error = '';
  success = '';
  currentUser: any;
  map: any;
  hasApplied = false;
  isInCart = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private eventService: EventService,
    private applicationService: ApplicationService,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    this.authService.currentUser.subscribe(user => {
      this.currentUser = user;
    });

    this.route.params.subscribe(params => {
      if (params['id']) {
        this.loadEvent(params['id']);
      }
    });
  }

  loadEvent(eventId: number): void {
    this.loading = true;
    this.eventService.getEventById(eventId).subscribe(
      (data) => {
        this.event = data;
        this.loading = false;
        this.checkIfInCart();
        setTimeout(() => this.initializeMap(), 100);
      },
      (error) => {
        console.error('Error loading event:', error);
        this.error = 'Failed to load event details';
        this.loading = false;
      }
    );
  }

  checkIfInCart(): void {
    if (!this.currentUser) return;
    
    const cartKey = `event-cart-${this.currentUser.id}`;
    const cart = JSON.parse(localStorage.getItem(cartKey) || '[]');
    this.isInCart = cart.some((e: any) => e.id === this.event.id);
  }

  initializeMap(): void {
    if (!this.event || !this.event.latitude || !this.event.longitude) {
      return;
    }

    if (this.map) {
      this.map.remove();
    }

    this.map = L.map('event-map').setView(
      [this.event.latitude, this.event.longitude],
      13
    );

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors',
      maxZoom: 19
    }).addTo(this.map);

    L.marker([this.event.latitude, this.event.longitude])
      .addTo(this.map)
      .bindPopup(`<strong>${this.event.title}</strong><br>${this.event.location}`)
      .openPopup();
  }

  applyToEvent(): void {
    if (!this.currentUser) {
      // Redirect to login with return URL pointing to this event
      this.router.navigate(['/auth/login'], {
        queryParams: { returnUrl: `/event/${this.event.id}` }
      });
      return;
    }

    this.applying = true;
    this.error = '';
    this.success = '';

    this.applicationService.applyToEvent(this.event.id).subscribe(
      (response) => {
        this.applying = false;
        this.success = 'Successfully applied to this event!';
        this.hasApplied = true;
        this.isInCart = false; // Remove from cart if it was there
        // Stay on the event page to show confirmation
        console.log('Application successful:', response);
      },
      (error) => {
        this.applying = false;
        console.error('Application error:', error);
        // Extract error message from various possible response formats
        let errorMessage = 'Failed to apply to event. Please try again.';
        
        if (error.error?.message) {
          errorMessage = error.error.message;
        } else if (error.error?.error) {
          errorMessage = error.error.error;
        } else if (typeof error.error === 'string') {
          errorMessage = error.error;
        } else if (error.message) {
          errorMessage = error.message;
        }
        
        this.error = errorMessage;
      }
    );
  }

  addToCart(): void {
    if (!this.currentUser) {
      // Redirect to login with return URL pointing to this event
      this.router.navigate(['/auth/login'], {
        queryParams: { returnUrl: `/event/${this.event.id}` }
      });
      return;
    }

    this.addingToCart = true;
    this.error = '';
    this.success = '';

    // Store in local storage for now (can be replaced with backend API)
    const cartKey = `event-cart-${this.currentUser.id}`;
    let cart = JSON.parse(localStorage.getItem(cartKey) || '[]');
    
    // Check if event already in cart
    if (!cart.find((e: any) => e.id === this.event.id)) {
      cart.push({
        id: this.event.id,
        title: this.event.title,
        date: this.event.eventDate,
        location: this.event.location,
        addedAt: new Date().toISOString()
      });
      localStorage.setItem(cartKey, JSON.stringify(cart));
    }

    this.addingToCart = false;
    this.isInCart = true;
    this.success = 'Event saved to your cart!';
    
    // Clear success message after 3 seconds
    setTimeout(() => {
      this.success = '';
    }, 3000);
  }

  goBack(): void {
    this.router.navigate(['/events']);
  }

  formatDate(date: string): string {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
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

  getVolunteersSlotsRemaining(): number {
    return this.event.volunteersNeeded - this.event.volunteersConfirmed;
  }

  isEventFull(): boolean {
    return this.getVolunteersSlotsRemaining() <= 0;
  }

  isEventPassed(): boolean {
    return new Date(this.event.eventDate) < new Date();
  }

  goToProfile(): void {
    this.router.navigate(['/volunteer/profile']);
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/']);
  }
}
