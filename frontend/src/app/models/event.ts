/**
 * Event Models and Interfaces
 * Defines the structure of event-related data
 */

/**
 * Event Status Enum
 */
export enum EventStatus {
  DRAFT = 'DRAFT',
  PUBLISHED = 'PUBLISHED',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED'
}

/**
 * Event Interface
 * Represents a complete event object from the backend
 */
export interface Event {
  id: number;
  organizerId: number;
  organizerName: string;
  title: string;
  description: string;
  eventType: string;
  location: string;
  latitude?: number;
  longitude?: number;
  eventDate: string; // ISO 8601 format
  endDate?: string; // ISO 8601 format
  durationHours?: number;
  volunteersNeeded: number;
  volunteersConfirmed: number;
  status: EventStatus | string;
  imageUrl?: string;
  createdAt: string; // ISO 8601 format
  updatedAt?: string; // ISO 8601 format
}

/**
 * Create Event Request DTO
 * Used when creating or updating an event
 */
export interface CreateEventRequest {
  title: string;
  description: string;
  eventType: string;
  location: string;
  latitude?: number;
  longitude?: number;
  eventDate: string; // ISO 8601 format
  endDate?: string; // ISO 8601 format
  durationHours?: number;
  volunteersNeeded: number;
  imageUrl?: string;
  requiredSkillIds?: number[];
}

/**
 * Event Required Skill Interface
 * Represents a skill required by an event
 */
export interface EventRequiredSkill {
  id: number;
  eventId: number;
  skillId: number;
  skillName: string;
  minimumProficiency: string; // BEGINNER, INTERMEDIATE, ADVANCED, EXPERT
  isMandatory: boolean;
  createdAt: string; // ISO 8601 format
}

/**
 * Event Filter Interface
 * Used for filtering events in list views
 */
export interface EventFilter {
  location?: string;
  eventType?: string;
  dateFrom?: string; // ISO 8601 format
  dateTo?: string; // ISO 8601 format
  status?: EventStatus | string;
  organizerId?: number;
  page?: number;
  size?: number;
}

/**
 * Paginated Events Response
 * Used for paginated event listings
 */
export interface PaginatedEvents {
  content: Event[];
  totalElements: number;
  totalPages: number;
  currentPage: number;
  pageSize: number;
  hasNext: boolean;
  hasPrevious: boolean;
}

/**
 * Event Statistics Interface
 * Used for displaying event statistics
 */
export interface EventStatistics {
  totalEvents: number;
  publishedEvents: number;
  draftEvents: number;
  completedEvents: number;
  totalVolunteersNeeded: number;
  totalVolunteersConfirmed: number;
}

/**
 * Event Type Constants
 */
export const EVENT_TYPES = [
  'Community Service',
  'Education',
  'Environment',
  'Health',
  'Sports',
  'Arts & Culture',
  'Disaster Relief',
  'Other'
];

/**
 * Proficiency Level Constants
 */
export const PROFICIENCY_LEVELS = [
  'BEGINNER',
  'INTERMEDIATE',
  'ADVANCED',
  'EXPERT'
];
