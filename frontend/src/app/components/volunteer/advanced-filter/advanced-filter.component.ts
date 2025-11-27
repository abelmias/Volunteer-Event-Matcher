import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { SearchService } from '../../../services/search.service';
import { SearchFilter, LocationSuggestion } from '../../../models/search';
import { EVENT_TYPES } from '../../../models/event';

/**
 * Advanced Filter Component
 * Provides advanced search and filtering capabilities for events
 */
@Component({
  selector: 'app-advanced-filter',
  templateUrl: './advanced-filter.component.html',
  styleUrls: ['./advanced-filter.component.css']
})
export class AdvancedFilterComponent implements OnInit {
  @Output() filterApplied = new EventEmitter<SearchFilter>();

  filterForm!: FormGroup;
  showAdvancedFilters = false;
  locationSuggestions: LocationSuggestion[] = [];
  showLocationSuggestions = false;
  loading = false;
  error = '';
  eventTypes = EVENT_TYPES;

  sortOptions = [
    { value: 'eventDate', label: 'Event Date' },
    { value: 'title', label: 'Title' },
    { value: 'volunteersNeeded', label: 'Volunteers Needed' }
  ];

  constructor(
    private formBuilder: FormBuilder,
    private searchService: SearchService
  ) { }

  ngOnInit(): void {
    this.initializeForm();
  }

  /**
   * Initialize filter form
   */
  initializeForm(): void {
    this.filterForm = this.formBuilder.group({
      searchTerm: [''],
      location: [''],
      eventType: [''],
      minDate: [''],
      maxDate: [''],
      minVolunteers: [''],
      maxVolunteers: [''],
      sortBy: ['eventDate'],
      sortOrder: ['asc']
    });
  }

  /**
   * Apply filters
   */
  applyFilters(): void {
    const filter: SearchFilter = {
      searchTerm: this.filterForm.get('searchTerm')?.value || undefined,
      location: this.filterForm.get('location')?.value || undefined,
      eventType: this.filterForm.get('eventType')?.value || undefined,
      minDate: this.filterForm.get('minDate')?.value || undefined,
      maxDate: this.filterForm.get('maxDate')?.value || undefined,
      minVolunteers: this.filterForm.get('minVolunteers')?.value || undefined,
      maxVolunteers: this.filterForm.get('maxVolunteers')?.value || undefined,
      sortBy: this.filterForm.get('sortBy')?.value || 'eventDate',
      sortOrder: this.filterForm.get('sortOrder')?.value || 'asc',
      page: 0,
      size: 10
    };

    this.filterApplied.emit(filter);
  }

  /**
   * Reset filters
   */
  resetFilters(): void {
    this.filterForm.reset({
      sortBy: 'eventDate',
      sortOrder: 'asc'
    });
    this.applyFilters();
  }

  /**
   * Toggle advanced filters
   */
  toggleAdvancedFilters(): void {
    this.showAdvancedFilters = !this.showAdvancedFilters;
  }

  /**
   * Get location suggestions
   */
  onLocationChange(query: string): void {
    if (query.length < 2) {
      this.locationSuggestions = [];
      this.showLocationSuggestions = false;
      return;
    }

    this.loading = true;
    this.searchService.getLocationSuggestions(query).subscribe(
      (suggestions: LocationSuggestion[]) => {
        this.locationSuggestions = suggestions;
        this.showLocationSuggestions = true;
        this.loading = false;
      },
      (error: any) => {
        console.error('Error getting location suggestions:', error);
        this.loading = false;
      }
    );
  }

  /**
   * Select location suggestion
   */
  selectLocationSuggestion(suggestion: LocationSuggestion): void {
    this.filterForm.patchValue({
      location: suggestion.name
    });
    this.showLocationSuggestions = false;
    this.locationSuggestions = [];
  }

  /**
   * Close location suggestions
   */
  closeLocationSuggestions(): void {
    this.showLocationSuggestions = false;
  }

  /**
   * Get form controls
   */
  get f() {
    return this.filterForm.controls;
  }
}
