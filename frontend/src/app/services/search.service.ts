import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { SearchFilter, PaginatedSearchResults, LocationSuggestion, SearchStatistics } from '../models/search';

/**
 * Search Service
 * 
 * Handles all search and filtering operations including:
 * - Advanced event search
 * - Location-based filtering
 * - Event type filtering
 * - Date range filtering
 * - Location suggestions
 */
@Injectable({
  providedIn: 'root'
})
export class SearchService {
  private apiUrl = 'http://localhost:8081/api/search';

  constructor(private http: HttpClient) { }

  /**
   * Search events with advanced filters
   */
  searchEvents(filter: SearchFilter): Observable<PaginatedSearchResults> {
    let params = new HttpParams();

    if (filter.searchTerm) params = params.set('searchTerm', filter.searchTerm);
    if (filter.location) params = params.set('location', filter.location);
    if (filter.eventType) params = params.set('eventType', filter.eventType);
    if (filter.minDate) params = params.set('minDate', filter.minDate);
    if (filter.maxDate) params = params.set('maxDate', filter.maxDate);
    if (filter.minVolunteers) params = params.set('minVolunteers', filter.minVolunteers.toString());
    if (filter.maxVolunteers) params = params.set('maxVolunteers', filter.maxVolunteers.toString());
    if (filter.sortBy) params = params.set('sortBy', filter.sortBy);
    if (filter.sortOrder) params = params.set('sortOrder', filter.sortOrder);
    if (filter.page !== undefined) params = params.set('page', filter.page.toString());
    if (filter.size) params = params.set('size', filter.size.toString());

    return this.http.get<PaginatedSearchResults>(`${this.apiUrl}/events`, { params });
  }

  /**
   * Search events by location with radius
   */
  searchByLocation(latitude: number, longitude: number, radiusKm: number, page: number = 0, size: number = 10): Observable<PaginatedSearchResults> {
    const params = new HttpParams()
      .set('latitude', latitude.toString())
      .set('longitude', longitude.toString())
      .set('radiusKm', radiusKm.toString())
      .set('page', page.toString())
      .set('size', size.toString());

    return this.http.get<PaginatedSearchResults>(`${this.apiUrl}/location`, { params });
  }

  /**
   * Get location suggestions for autocomplete
   */
  getLocationSuggestions(query: string): Observable<LocationSuggestion[]> {
    const params = new HttpParams().set('query', query);
    return this.http.get<LocationSuggestion[]>(`${this.apiUrl}/locations/suggestions`, { params });
  }

  /**
   * Get search statistics
   */
  getSearchStatistics(filter: SearchFilter): Observable<SearchStatistics> {
    let params = new HttpParams();

    if (filter.searchTerm) params = params.set('searchTerm', filter.searchTerm);
    if (filter.location) params = params.set('location', filter.location);
    if (filter.eventType) params = params.set('eventType', filter.eventType);
    if (filter.minDate) params = params.set('minDate', filter.minDate);
    if (filter.maxDate) params = params.set('maxDate', filter.maxDate);

    return this.http.get<SearchStatistics>(`${this.apiUrl}/statistics`, { params });
  }

  /**
   * Get popular search terms
   */
  getPopularSearchTerms(limit: number = 10): Observable<string[]> {
    const params = new HttpParams().set('limit', limit.toString());
    return this.http.get<string[]>(`${this.apiUrl}/popular-terms`, { params });
  }

  /**
   * Get recent searches for current user
   */
  getRecentSearches(limit: number = 5): Observable<SearchFilter[]> {
    const params = new HttpParams().set('limit', limit.toString());
    return this.http.get<SearchFilter[]>(`${this.apiUrl}/recent`, { params });
  }

  /**
   * Save search filter
   */
  saveSearch(filter: SearchFilter, name: string): Observable<any> {
    const body = { filter, name };
    return this.http.post(`${this.apiUrl}/saved`, body);
  }

  /**
   * Get saved searches
   */
  getSavedSearches(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/saved`);
  }

  /**
   * Delete saved search
   */
  deleteSavedSearch(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/saved/${id}`);
  }
}
