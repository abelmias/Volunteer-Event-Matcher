import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Event, CreateEventRequest, PaginatedEvents, EventRequiredSkill } from '../models/event';

/**
 * Event Service
 * Handles all event-related API calls
 */
@Injectable({
  providedIn: 'root'
})
export class EventService {
  private apiUrl = 'http://localhost:8081/api/events';

  constructor(private http: HttpClient) { }

  /**
   * Get upcoming published events with pagination
   */
  getUpcomingEvents(page: number = 0, size: number = 10): Observable<PaginatedEvents> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());
    return this.http.get<PaginatedEvents>(`${this.apiUrl}/upcoming/published`, { params });
  }

  /**
   * Get event by ID
   */
  getEventById(id: number): Observable<Event> {
    return this.http.get<Event>(`${this.apiUrl}/${id}`);
  }

  /**
   * Search events by location
   */
  searchByLocation(location: string): Observable<Event[]> {
    return this.http.get<Event[]>(`${this.apiUrl}/search/location`, {
      params: new HttpParams().set('location', location)
    });
  }

  /**
   * Search events by type
   */
  searchByType(eventType: string): Observable<Event[]> {
    return this.http.get<Event[]>(`${this.apiUrl}/search/type`, {
      params: new HttpParams().set('eventType', eventType)
    });
  }

  /**
   * Get events needing volunteers
   */
  getEventsNeedingVolunteers(): Observable<Event[]> {
    return this.http.get<Event[]>(`${this.apiUrl}/needing-volunteers`);
  }

  /**
   * Volunteer submits event for admin review
   */
  submitEventForReview(eventData: any): Observable<Event> {
    return this.http.post<Event>(`${this.apiUrl}/submit`, eventData);
  }

  /**
   * Create new event (admin/organizer)
   */
  createEvent(eventData: CreateEventRequest): Observable<Event> {
    return this.http.post<Event>(`${this.apiUrl}/create`, eventData);
  }

  /**
   * Update existing event
   */
  updateEvent(id: number, eventData: CreateEventRequest): Observable<Event> {
    return this.http.put<Event>(`${this.apiUrl}/${id}`, eventData);
  }

  /**
   * Publish event
   */
  publishEvent(id: number): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/${id}/publish`, {});
  }

  /**
   * Unpublish event
   */
  unpublishEvent(id: number): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/${id}/unpublish`, {});
  }

  /**
   * Cancel event
   */
  cancelEvent(id: number): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/${id}/cancel`, {});
  }

  /**
   * Delete event
   */
  deleteEvent(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  /**
   * Get required skills for an event
   */
  getEventRequiredSkills(eventId: number): Observable<EventRequiredSkill[]> {
    return this.http.get<EventRequiredSkill[]>(`${this.apiUrl}/${eventId}/required-skills`);
  }

  /**
   * Add required skill to event
   */
  addRequiredSkill(eventId: number, skillData: any): Observable<EventRequiredSkill> {
    return this.http.post<EventRequiredSkill>(`${this.apiUrl}/${eventId}/required-skills`, skillData);
  }

  /**
   * Remove required skill from event
   */
  removeRequiredSkill(eventId: number, skillId: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${eventId}/required-skills/${skillId}`);
  }

  /**
   * Get all events for the current organizer
   */
  getOrganizerEvents(): Observable<Event[]> {
    return this.http.get<Event[]>(`${this.apiUrl}/organizer/my-events`);
  }

  /**
   * Get all pending approval events (volunteer submissions)
   */
  getPendingApprovalEvents(): Observable<Event[]> {
    return this.http.get<Event[]>(`${this.apiUrl}/pending-approval`);
  }

  /**
   * Approve a pending event
   */
  approveEvent(id: number): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/${id}/approve`, {});
  }

  /**
   * Reject a pending event
   */
  rejectEvent(id: number): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/${id}/reject`, {});
  }
}
