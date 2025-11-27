import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { EventService } from '../../../services/event.service';
import { AuthService } from '../../../services/auth.service';
import { MapService } from '../../../services/map.service';
import { Event, EventRequiredSkill } from '../../../models/event';
import * as L from 'leaflet';

/**
 * Event Detail Component
 * 
 * Displays detailed information about a specific event and allows volunteers to apply.
 */
@Component({
  selector: 'app-event-detail',
  templateUrl: './event-detail.component.html',
  styleUrls: ['./event-detail.component.css']
})
export class EventDetailComponent implements OnInit, OnDestroy {
  event: Event | null = null;
  requiredSkills: EventRequiredSkill[] = [];
  loading = false;
  applying = false;
  currentUser: any;
  hasApplied = false;
  error = '';
  success = '';
  
  // Map properties
  map: L.Map | null = null;
  userLocation: { latitude: number; longitude: number } | null = null;
  distanceToEvent: number | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private eventService: EventService,
    private authService: AuthService,
    private mapService: MapService
  ) { }

  ngOnInit(): void {
    this.currentUser = this.authService.currentUserValue;
    if (!this.currentUser) {
      this.router.navigate(['/auth/login']);
      return;
    }

    const eventId = this.route.snapshot.paramMap.get('id');
    if (eventId) {
      this.loadEventDetail(Number(eventId));
    }
  }

  /**
   * Load event details and required skills
   */
  loadEventDetail(eventId: number): void {
    this.loading = true;
    this.error = '';
    
    this.eventService.getEventById(eventId).subscribe(
      (response: Event) => {
        this.event = response;
        this.loadRequiredSkills(eventId);
        this.initializeMap();
      },
      (error: any) => {
        this.error = 'Failed to load event details';
        console.error('Error loading event:', error);
        this.loading = false;
      }
    );
  }

  /**
   * Load required skills for the event
   */
  loadRequiredSkills(eventId: number): void {
    this.eventService.getEventRequiredSkills(eventId).subscribe(
      (skills: EventRequiredSkill[]) => {
        this.requiredSkills = skills;
        this.loading = false;
      },
      (error: any) => {
        console.error('Error loading required skills:', error);
        this.loading = false;
      }
    );
  }

  /**
   * Apply for the event
   */
  applyForEvent(): void {
    if (!this.event) return;

    this.applying = true;
    this.error = '';
    this.success = '';

    // TODO: Implement application submission when ApplicationService is created
    // For now, show success message
    setTimeout(() => {
      this.applying = false;
      this.hasApplied = true;
      this.success = 'Application submitted successfully!';
    }, 1000);
  }

  /**
   * Get volunteer count percentage
   */
  getVolunteerPercentage(): number {
    if (!this.event || this.event.volunteersNeeded === 0) return 0;
    return Math.round((this.event.volunteersConfirmed / this.event.volunteersNeeded) * 100);
  }

  /**
   * Check if event is fully booked
   */
  isFullyBooked(): boolean {
    if (!this.event) return false;
    return this.event.volunteersConfirmed >= this.event.volunteersNeeded;
  }

  /**
   * Go back to events list
   */
  goBack(): void {
    this.router.navigate(['/volunteer/events']);
  }

  /**
   * Logout
   */
  logout(): void {
    this.authService.logout();
    this.router.navigate(['/']);
  }

  /**
   * Initialize map with event location
   */
  initializeMap(): void {
    if (!this.event || !this.event.latitude || !this.event.longitude) {
      return;
    }

    // Use setTimeout to ensure DOM is ready
    setTimeout(() => {
      const mapContainer = document.getElementById('event-map');
      if (!mapContainer) return;

      try {
        // Initialize map
        this.map = this.mapService.initializeMap(
          'event-map',
          this.event!.latitude!,
          this.event!.longitude!,
          14
        );

        // Add event marker
        const eventIcon = this.mapService.createCustomIcon('red');
        this.mapService.addMarker(
          this.map,
          this.event!.latitude!,
          this.event!.longitude!,
          `📍 ${this.event!.title}`,
          eventIcon
        );

        // Try to get user location and calculate distance
        this.mapService.getUserLocation()
          .then((location) => {
            this.userLocation = location;
            
            // Calculate distance
            this.distanceToEvent = this.mapService.calculateDistance(
              location.latitude,
              location.longitude,
              this.event!.latitude!,
              this.event!.longitude!
            );

            // Add user marker
            const userIcon = this.mapService.createCustomIcon('blue');
            this.mapService.addMarker(
              this.map!,
              location.latitude,
              location.longitude,
              '📍 Your Location',
              userIcon
            );

            // Fit bounds to show both markers
            this.map!.eachLayer((layer) => {
              if (layer instanceof L.Marker) {
                // Markers are now displayed
              }
            });
          })
          .catch((error) => {
            console.log('Could not get user location:', error);
            // Map still shows event location even if user location fails
          });
      } catch (error) {
        console.error('Error initializing map:', error);
      }
    }, 100);
  }

  /**
   * Get color for skill level badge
   * @param level - Skill level (BEGINNER, INTERMEDIATE, ADVANCED, EXPERT)
   * @returns Bootstrap color class
   */
  getLevelColor(level: string): string {
    switch (level?.toUpperCase()) {
      case 'BEGINNER':
        return 'success';
      case 'INTERMEDIATE':
        return 'info';
      case 'ADVANCED':
        return 'warning';
      case 'EXPERT':
        return 'danger';
      default:
        return 'secondary';
    }
  }

  /**
   * Cleanup on component destroy
   */
  ngOnDestroy(): void {
    if (this.map) {
      this.mapService.destroyMap(this.map);
    }
  }
}
