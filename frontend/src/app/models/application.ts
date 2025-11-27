/**
 * Application Models and Interfaces
 * Defines the structure of volunteer application data
 */

/**
 * Application Status Enum
 */
export enum ApplicationStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
  WITHDRAWN = 'WITHDRAWN',
  COMPLETED = 'COMPLETED'
}

/**
 * Volunteer Application Interface
 * Represents a volunteer's application to an event
 */
export interface Application {
  id: number;
  eventId: number;
  eventTitle: string;
  volunteerId: number;
  volunteerName: string;
  status: ApplicationStatus | string;
  applicationDate: string; // ISO 8601 format
  responseDate?: string; // ISO 8601 format
  motivationText?: string;
  hoursCompleted?: number;
  ratingFromOrganizer?: number;
  feedbackFromOrganizer?: string;
}

/**
 * Create Application Request DTO
 * Used when applying to an event
 */
export interface CreateApplicationRequest {
  eventId: number;
  motivationText?: string;
}

/**
 * Application Response DTO
 * Used when approving/rejecting applications
 */
export interface ApplicationResponse {
  applicationId: number;
  status: ApplicationStatus | string;
  feedback?: string;
  rating?: number;
}

/**
 * Application Statistics Interface
 * Used for displaying application statistics
 */
export interface ApplicationStatistics {
  totalApplications: number;
  pendingApplications: number;
  approvedApplications: number;
  rejectedApplications: number;
  completedApplications: number;
}

/**
 * Application Filter Interface
 * Used for filtering applications
 */
export interface ApplicationFilter {
  status?: ApplicationStatus | string;
  volunteerId?: number;
  eventId?: number;
  page?: number;
  size?: number;
}
