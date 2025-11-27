import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

/**
 * Notification Service
 * 
 * Handles all notification operations including:
 * - Retrieving notifications
 * - Marking notifications as read
 * - Deleting notifications
 */
@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private apiUrl = 'http://localhost:8081/api/notifications';

  constructor(private http: HttpClient) { }

  /**
   * Get all notifications for current user
   */
  getNotifications(page: number = 0, size: number = 10): Observable<any> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());
    return this.http.get(this.apiUrl, { params });
  }

  /**
   * Get unread notifications count
   */
  getUnreadCount(): Observable<any> {
    return this.http.get(`${this.apiUrl}/unread/count`);
  }

  /**
   * Mark notification as read
   */
  markAsRead(id: number): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}/read`, {});
  }

  /**
   * Mark all notifications as read
   */
  markAllAsRead(): Observable<any> {
    return this.http.put(`${this.apiUrl}/read-all`, {});
  }

  /**
   * Delete a notification
   */
  deleteNotification(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  /**
   * Delete all notifications
   */
  deleteAllNotifications(): Observable<any> {
    return this.http.delete(this.apiUrl);
  }
}
