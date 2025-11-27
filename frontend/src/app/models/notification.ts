/**
 * Notification Models and Interfaces
 * Defines the structure of notification data
 */

/**
 * Notification Type Enum
 */
export enum NotificationType {
  APPLICATION_RECEIVED = 'APPLICATION_RECEIVED',
  APPLICATION_APPROVED = 'APPLICATION_APPROVED',
  APPLICATION_REJECTED = 'APPLICATION_REJECTED',
  EVENT_PUBLISHED = 'EVENT_PUBLISHED',
  EVENT_CANCELLED = 'EVENT_CANCELLED',
  FEEDBACK_RECEIVED = 'FEEDBACK_RECEIVED',
  VOLUNTEER_CONFIRMED = 'VOLUNTEER_CONFIRMED',
  EVENT_REMINDER = 'EVENT_REMINDER'
}

/**
 * Notification Interface
 * Represents a user notification
 */
export interface Notification {
  id: number;
  userId: number;
  type: NotificationType | string;
  title: string;
  message: string;
  relatedEntityId?: number;
  relatedEntityType?: string; // EVENT, APPLICATION, USER
  isRead: boolean;
  createdAt: string; // ISO 8601 format
  readAt?: string; // ISO 8601 format
  actionUrl?: string;
}

/**
 * Create Notification Request DTO
 * Used when creating notifications
 */
export interface CreateNotificationRequest {
  userId: number;
  type: NotificationType | string;
  title: string;
  message: string;
  relatedEntityId?: number;
  relatedEntityType?: string;
  actionUrl?: string;
}

/**
 * Notification Statistics Interface
 * Used for displaying notification statistics
 */
export interface NotificationStatistics {
  totalNotifications: number;
  unreadNotifications: number;
  readNotifications: number;
}

/**
 * Notification Filter Interface
 * Used for filtering notifications
 */
export interface NotificationFilter {
  type?: NotificationType | string;
  isRead?: boolean;
  page?: number;
  size?: number;
}

/**
 * Notification Response DTO
 * Used when marking notifications as read
 */
export interface NotificationResponse {
  notificationId: number;
  isRead: boolean;
}
