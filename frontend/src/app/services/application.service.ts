import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

/**
 * Application Service
 * 
 * Handles all volunteer application operations including:
 * - Applying to events
 * - Retrieving applications
 * - Approving/rejecting applications
 * - Withdrawing applications
 */
@Injectable({
  providedIn: 'root'
})
export class ApplicationService {
  private apiUrl = 'http://localhost:8081/api/applications';

  constructor(private http: HttpClient) { }

  /**
   * Apply to an event
   */
  applyToEvent(eventId: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/events/${eventId}`, {});
  }

  /**
   * Get application by ID
   */
  getApplicationById(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/${id}`);
  }

  /**
   * Get all applications for a volunteer
   */
  getVolunteerApplications(volunteerId: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/volunteer/${volunteerId}`);
  }

  /**
   * Get all applications for an event
   */
  getEventApplications(eventId: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/event/${eventId}`);
  }

  /**
   * Get all pending applications
   */
  getPendingApplications(): Observable<any> {
    return this.http.get(`${this.apiUrl}/pending`);
  }

  /**
   * Approve an application
   */
  approveApplication(id: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/${id}/approve`, {});
  }

  /**
   * Reject an application
   */
  rejectApplication(id: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/${id}/reject`, {});
  }

  /**
   * Withdraw an application
   */
  withdrawApplication(id: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/${id}/withdraw`, {});
  }

  /**
   * Complete an application (mark as completed)
   */
  completeApplication(id: number, rating: number, feedback: string): Observable<any> {
    const body = { rating, feedback };
    return this.http.post(`${this.apiUrl}/${id}/complete`, body);
  }
}
