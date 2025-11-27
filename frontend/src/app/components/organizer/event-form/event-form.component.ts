import { Component, OnInit, AfterViewInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { EventService } from '../../../services/event.service';
import { SkillService } from '../../../services/skill.service';
import { Event, CreateEventRequest, EVENT_TYPES } from '../../../models/event';
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
 * Event Form Component
 * Used for creating and editing events by organizers
 */
@Component({
  selector: 'app-event-form',
  templateUrl: './event-form.component.html',
  styleUrls: ['./event-form.component.css']
})
export class EventFormComponent implements OnInit, AfterViewInit {
  eventForm!: FormGroup;
  submitted = false;
  loading = false;
  error = '';
  success = '';
  isEditMode = false;
  eventId: number | null = null;
  eventTypes = EVENT_TYPES;
  skills: any[] = [];
  selectedSkills: number[] = [];
  
  // Map related
  private map: any;
  private marker: any;

  constructor(
    private formBuilder: FormBuilder,
    private eventService: EventService,
    private skillService: SkillService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.initializeForm();
    this.loadSkills();
    
    // Check if editing existing event
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.isEditMode = true;
        this.eventId = +id;
        this.loadEvent(this.eventId);
      }
    });
  }

  ngAfterViewInit(): void {
    // Initialize map only if not in edit mode (edit mode will init map after data load)
    if (!this.isEditMode) {
      this.initializeMap();
    }
  }

  /**
   * Initialize map
   */
  private initializeMap(lat?: number, lng?: number): void {
    // Default to Dubai if no coordinates provided
    const defaultLat = 25.2048;
    const defaultLng = 55.2708;
    
    const centerLat = lat || defaultLat;
    const centerLng = lng || defaultLng;
    const zoomLevel = lat ? 13 : 11;

    // If map already exists, remove it (to prevent duplicate init)
    if (this.map) {
      this.map.remove();
    }

    this.map = L.map('map-picker').setView([centerLat, centerLng], zoomLevel);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors',
      maxZoom: 19
    }).addTo(this.map);

    // Add click handler
    this.map.on('click', (e: any) => {
      this.updateMarker(e.latlng.lat, e.latlng.lng);
      this.updateFormCoordinates(e.latlng.lat, e.latlng.lng);
    });

    // If initial coordinates exist, add marker
    if (lat && lng) {
      this.updateMarker(lat, lng);
    }
  }

  /**
   * Update marker position
   */
  private updateMarker(lat: number, lng: number): void {
    if (this.marker) {
      this.marker.setLatLng([lat, lng]);
    } else {
      this.marker = L.marker([lat, lng]).addTo(this.map);
    }
  }

  /**
   * Update form controls with coordinates
   */
  private updateFormCoordinates(lat: number, lng: number): void {
    this.eventForm.patchValue({
      latitude: parseFloat(lat.toFixed(6)),
      longitude: parseFloat(lng.toFixed(6))
    });
  }


  /**
   * Initialize form with validators
   */
  initializeForm(): void {
    this.eventForm = this.formBuilder.group({
      title: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(200)]],
      description: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(2000)]],
      eventType: ['', Validators.required],
      location: ['', [Validators.required, Validators.minLength(3)]],
      latitude: ['', Validators.pattern(/^-?([0-8]?[0-9]|90)(\.[0-9]{1,8})?$/)],
      longitude: ['', Validators.pattern(/^-?([0-9]{1,2}|1[0-7][0-9]|180)(\.[0-9]{1,8})?$/)],
      eventDate: ['', Validators.required],
      endDate: [''],
      durationHours: ['', [Validators.min(1), Validators.max(24)]],
      volunteersNeeded: ['', [Validators.required, Validators.min(1), Validators.max(1000)]],
      imageUrl: ['']
    });
  }

  /**
   * Load skills from backend
   */
  loadSkills(): void {
    this.skillService.getAllSkills().subscribe(
      (skills: any[]) => {
        this.skills = skills;
      },
      (error: any) => {
        console.error('Error loading skills:', error);
      }
    );
  }

  /**
   * Load existing event for editing
   */
  loadEvent(id: number): void {
    this.loading = true;
    this.eventService.getEventById(id).subscribe(
      (event: Event) => {
        this.eventForm.patchValue({
          title: event.title,
          description: event.description,
          eventType: event.eventType,
          location: event.location,
          latitude: event.latitude,
          longitude: event.longitude,
          eventDate: event.eventDate,
          endDate: event.endDate,
          durationHours: event.durationHours,
          volunteersNeeded: event.volunteersNeeded,
          imageUrl: event.imageUrl
        });
        this.loading = false;
        // Initialize map with existing coordinates
        setTimeout(() => {
          if (event.latitude && event.longitude) {
            this.initializeMap(event.latitude, event.longitude);
          } else {
            this.initializeMap();
          }
        }, 100);
      },
      (error) => {
        this.error = 'Failed to load event';
        this.loading = false;
      }
    );

    // Load required skills
    this.eventService.getEventRequiredSkills(id).subscribe(
      (skills) => {
        this.selectedSkills = skills.map(s => s.skillId);
      },
      (error) => {
        console.error('Error loading required skills:', error);
      }
    );
  }

  /**
   * Get form controls for template
   */
  get f() {
    return this.eventForm.controls;
  }

  /**
   * Toggle skill selection
   */
  toggleSkill(skillId: number): void {
    const index = this.selectedSkills.indexOf(skillId);
    if (index > -1) {
      this.selectedSkills.splice(index, 1);
    } else {
      this.selectedSkills.push(skillId);
    }
  }

  /**
   * Check if skill is selected
   */
  isSkillSelected(skillId: number): boolean {
    return this.selectedSkills.includes(skillId);
  }

  /**
   * Submit form
   */
  onSubmit(): void {
    this.submitted = true;
    this.error = '';
    this.success = '';

    if (this.eventForm.invalid) {
      this.error = 'Please fill in all required fields correctly';
      return;
    }

    this.loading = true;
    const eventData: CreateEventRequest = {
      ...this.eventForm.value,
      requiredSkillIds: this.selectedSkills
    };

    if (this.isEditMode && this.eventId) {
      // Update event
      this.eventService.updateEvent(this.eventId, eventData).subscribe(
        (response) => {
          this.loading = false;
          this.success = 'Event updated successfully!';
          setTimeout(() => {
            this.router.navigate(['/organizer/events', this.eventId]);
          }, 2000);
        },
        (error) => {
          this.loading = false;
          this.error = error.error?.message || 'Failed to update event';
        }
      );
    } else {
      // Create new event
      this.eventService.createEvent(eventData).subscribe(
        (response) => {
          this.loading = false;
          this.success = 'Event created successfully!';
          setTimeout(() => {
            this.router.navigate(['/organizer/events']);
          }, 2000);
        },
        (error) => {
          this.loading = false;
          this.error = error.error?.message || 'Failed to create event';
        }
      );
    }
  }

  /**
   * Cancel and go back
   */
  onCancel(): void {
    this.router.navigate(['/organizer/events']);
  }
}
