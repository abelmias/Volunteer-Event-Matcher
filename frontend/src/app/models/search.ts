/**
 * Search Models and Interfaces
 * Defines the structure of search and filtering data
 */

/**
 * Search Filter Interface
 * Used for advanced event search and filtering
 */
export interface SearchFilter {
  searchTerm?: string;
  location?: string;
  eventType?: string;
  minDate?: string; // ISO 8601 format
  maxDate?: string; // ISO 8601 format
  minVolunteers?: number;
  maxVolunteers?: number;
  latitude?: number;
  longitude?: number;
  radiusKm?: number;
  sortBy?: string; // eventDate, title, volunteersNeeded
  sortOrder?: string; // asc, desc
  page?: number;
  size?: number;
}

/**
 * Location Suggestion Interface
 * Used for location autocomplete
 */
export interface LocationSuggestion {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  distance?: number;
}

/**
 * Search Result Interface
 * Represents a single search result
 */
export interface SearchResult {
  id: number;
  title: string;
  description: string;
  location: string;
  latitude: number;
  longitude: number;
  eventDate: string;
  eventType: string;
  volunteersNeeded: number;
  volunteersConfirmed: number;
  distance?: number;
  status: string;
}

/**
 * Paginated Search Results Interface
 * Represents paginated search results
 */
export interface PaginatedSearchResults {
  content: SearchResult[];
  totalElements: number;
  totalPages: number;
  currentPage: number;
  pageSize: number;
  hasNext: boolean;
  hasPrevious: boolean;
}

/**
 * Search Statistics Interface
 * Used for displaying search statistics
 */
export interface SearchStatistics {
  totalResults: number;
  resultsInRadius: number;
  eventTypesCount: {
    [key: string]: number;
  };
  dateRangeCount: {
    [key: string]: number;
  };
}

/**
 * Event Type Interface
 * Used for event type filtering
 */
export interface EventTypeOption {
  value: string;
  label: string;
  icon?: string;
}

/**
 * Sort Option Interface
 * Used for sorting options
 */
export interface SortOption {
  value: string;
  label: string;
}
