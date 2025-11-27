import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

/**
 * Analytics Data Interfaces
 */
export interface EventAnalytics {
  totalEvents: number;
  publishedEvents: number;
  draftEvents: number;
  cancelledEvents: number;
  completedEvents: number;
  totalVolunteersNeeded: number;
  totalVolunteersConfirmed: number;
}

export interface ApplicationAnalytics {
  totalApplications: number;
  pendingApplications: number;
  approvedApplications: number;
  rejectedApplications: number;
  completedApplications: number;
  approvalRate: number;
}

export interface VolunteerAnalytics {
  totalVolunteers: number;
  activeVolunteers: number;
  averageRating: number;
  totalHoursContributed: number;
  topSkills: Array<{ skill: string; count: number }>;
}

export interface EventTrends {
  date: string;
  applications: number;
  approvals: number;
  rejections: number;
}

export interface SkillDemand {
  skillName: string;
  demandCount: number;
  averageProficiency: string;
}

/**
 * Analytics Service
 * Handles analytics data retrieval and processing
 */
@Injectable({
  providedIn: 'root'
})
export class AnalyticsService {
  private apiUrl = 'http://localhost:8081/api/analytics';

  constructor(private http: HttpClient) { }

  /**
   * Get event analytics
   */
  getEventAnalytics(): Observable<EventAnalytics> {
    return this.http.get<EventAnalytics>(`${this.apiUrl}/events`);
  }

  /**
   * Get application analytics
   */
  getApplicationAnalytics(): Observable<ApplicationAnalytics> {
    return this.http.get<ApplicationAnalytics>(`${this.apiUrl}/applications`);
  }

  /**
   * Get volunteer analytics
   */
  getVolunteerAnalytics(): Observable<VolunteerAnalytics> {
    return this.http.get<VolunteerAnalytics>(`${this.apiUrl}/volunteers`);
  }

  /**
   * Get event trends over time
   */
  getEventTrends(days: number = 30): Observable<EventTrends[]> {
    const params = new HttpParams().set('days', days.toString());
    return this.http.get<EventTrends[]>(`${this.apiUrl}/trends/events`, { params });
  }

  /**
   * Get skill demand analytics
   */
  getSkillDemand(): Observable<SkillDemand[]> {
    return this.http.get<SkillDemand[]>(`${this.apiUrl}/skills/demand`);
  }

  /**
   * Get organizer-specific analytics
   */
  getOrganizerAnalytics(organizerId: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/organizer/${organizerId}`);
  }

  /**
   * Get volunteer-specific analytics
   */
  getVolunteerAnalyticsById(volunteerId: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/volunteer/${volunteerId}`);
  }

  /**
   * Export analytics as CSV
   */
  exportAnalyticsCSV(type: string): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/export/${type}`, { responseType: 'blob' });
  }

  /**
   * Export analytics as PDF
   */
  exportAnalyticsPDF(type: string): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/export/${type}/pdf`, { responseType: 'blob' });
  }

  /**
   * Calculate approval rate
   */
  calculateApprovalRate(approved: number, total: number): number {
    if (total === 0) return 0;
    return Math.round((approved / total) * 100);
  }

  /**
   * Calculate volunteer percentage
   */
  calculateVolunteerPercentage(confirmed: number, needed: number): number {
    if (needed === 0) return 0;
    return Math.round((confirmed / needed) * 100);
  }

  /**
   * Format large numbers
   */
  formatNumber(num: number): string {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    }
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  }

  /**
   * Get color for metric
   */
  getMetricColor(value: number, threshold: number): string {
    if (value >= threshold) return 'success';
    if (value >= threshold * 0.5) return 'warning';
    return 'danger';
  }
}
