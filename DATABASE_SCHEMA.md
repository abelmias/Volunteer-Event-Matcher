# Database Schema - Volunteer Event Matcher

## Overview
This document defines the PostgreSQL database schema for the Volunteer Event Matcher application. The schema supports user authentication, event management, volunteer profiles, and intelligent matching.

---

## Tables

### 1. `users` - User Accounts (Volunteers & Organizers)
Stores all user account information with role-based access control.

```sql
CREATE TABLE users (
    id BIGSERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    phone_number VARCHAR(20),
    profile_picture_url VARCHAR(500),
    bio TEXT,
    role VARCHAR(20) NOT NULL CHECK (role IN ('VOLUNTEER', 'ORGANIZER', 'ADMIN')),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_login TIMESTAMP
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_username ON users(username);
CREATE INDEX idx_users_role ON users(role);
```

**Columns:**
- `id`: Unique user identifier
- `username`: Unique username for login
- `email`: Unique email address
- `password_hash`: Bcrypt hashed password
- `first_name`, `last_name`: User's name
- `phone_number`: Contact number (optional)
- `profile_picture_url`: URL to profile picture (optional)
- `bio`: User biography (optional)
- `role`: User type (VOLUNTEER, ORGANIZER, ADMIN)
- `is_active`: Account status
- `created_at`, `updated_at`: Timestamps
- `last_login`: Last login timestamp

---

### 2. `skills` - Available Skills
Master list of skills that volunteers can have and events can require.

```sql
CREATE TABLE skills (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    category VARCHAR(50) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_skills_category ON skills(category);
```

**Columns:**
- `id`: Unique skill identifier
- `name`: Skill name (e.g., "First Aid", "Teaching")
- `description`: Skill description
- `category`: Skill category (e.g., "Medical", "Education", "Technical")
- `created_at`: Creation timestamp

**Example Skills:**
- First Aid (Medical)
- CPR (Medical)
- Teaching (Education)
- Mentoring (Education)
- Web Development (Technical)
- Database Design (Technical)
- Event Planning (Logistics)
- Transportation (Logistics)

---

### 3. `volunteer_profiles` - Volunteer-Specific Information
Extended profile information for volunteers.

```sql
CREATE TABLE volunteer_profiles (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    years_of_experience INT DEFAULT 0,
    availability_status VARCHAR(20) DEFAULT 'AVAILABLE' CHECK (availability_status IN ('AVAILABLE', 'UNAVAILABLE', 'LIMITED')),
    preferred_event_types VARCHAR(500),
    bio_extended TEXT,
    verification_status VARCHAR(20) DEFAULT 'UNVERIFIED' CHECK (verification_status IN ('UNVERIFIED', 'PENDING', 'VERIFIED', 'REJECTED')),
    background_check_completed BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_volunteer_profiles_user_id ON volunteer_profiles(user_id);
CREATE INDEX idx_volunteer_profiles_availability ON volunteer_profiles(availability_status);
```

**Columns:**
- `id`: Unique profile identifier
- `user_id`: Reference to users table
- `years_of_experience`: Years of volunteer experience
- `availability_status`: Current availability
- `preferred_event_types`: Comma-separated event types
- `bio_extended`: Extended biography
- `verification_status`: Account verification status
- `background_check_completed`: Background check flag
- `created_at`, `updated_at`: Timestamps

---

### 4. `volunteer_skills` - Volunteer's Skills (Many-to-Many)
Links volunteers to their skills with proficiency levels.

```sql
CREATE TABLE volunteer_skills (
    id BIGSERIAL PRIMARY KEY,
    volunteer_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    skill_id BIGINT NOT NULL REFERENCES skills(id) ON DELETE CASCADE,
    proficiency_level VARCHAR(20) NOT NULL CHECK (proficiency_level IN ('BEGINNER', 'INTERMEDIATE', 'ADVANCED', 'EXPERT')),
    endorsement_count INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(volunteer_id, skill_id)
);

CREATE INDEX idx_volunteer_skills_volunteer_id ON volunteer_skills(volunteer_id);
CREATE INDEX idx_volunteer_skills_skill_id ON volunteer_skills(skill_id);
```

**Columns:**
- `id`: Unique record identifier
- `volunteer_id`: Reference to volunteer user
- `skill_id`: Reference to skill
- `proficiency_level`: Skill proficiency (BEGINNER, INTERMEDIATE, ADVANCED, EXPERT)
- `endorsement_count`: Number of endorsements from other users
- `created_at`, `updated_at`: Timestamps

---

### 5. `organizer_profiles` - Organizer-Specific Information
Extended profile information for event organizers.

```sql
CREATE TABLE organizer_profiles (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    organization_name VARCHAR(200) NOT NULL,
    organization_description TEXT,
    organization_website VARCHAR(500),
    organization_phone VARCHAR(20),
    registration_number VARCHAR(100),
    verification_status VARCHAR(20) DEFAULT 'UNVERIFIED' CHECK (verification_status IN ('UNVERIFIED', 'PENDING', 'VERIFIED', 'REJECTED')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_organizer_profiles_user_id ON organizer_profiles(user_id);
CREATE INDEX idx_organizer_profiles_organization_name ON organizer_profiles(organization_name);
```

**Columns:**
- `id`: Unique profile identifier
- `user_id`: Reference to users table
- `organization_name`: Name of organization
- `organization_description`: Organization description
- `organization_website`: Organization website URL
- `organization_phone`: Organization contact number
- `registration_number`: Official registration number
- `verification_status`: Organization verification status
- `created_at`, `updated_at`: Timestamps

---

### 6. `events` - Volunteer Events
Stores all volunteer event information.

```sql
CREATE TABLE events (
    id BIGSERIAL PRIMARY KEY,
    organizer_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(200) NOT NULL,
    description TEXT NOT NULL,
    event_type VARCHAR(50) NOT NULL,
    location VARCHAR(500) NOT NULL,
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    event_date TIMESTAMP NOT NULL,
    end_date TIMESTAMP,
    duration_hours INT,
    volunteers_needed INT NOT NULL,
    volunteers_confirmed INT DEFAULT 0,
    status VARCHAR(20) DEFAULT 'DRAFT' CHECK (status IN ('DRAFT', 'PUBLISHED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED')),
    image_url VARCHAR(500),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_events_organizer_id ON events(organizer_id);
CREATE INDEX idx_events_event_date ON events(event_date);
CREATE INDEX idx_events_status ON events(status);
CREATE INDEX idx_events_location ON events(location);
```

**Columns:**
- `id`: Unique event identifier
- `organizer_id`: Reference to organizer user
- `title`: Event title
- `description`: Event description
- `event_type`: Type of event (e.g., "Community Cleanup", "Tutoring")
- `location`: Event location (address)
- `latitude`, `longitude`: Geolocation coordinates
- `event_date`: Event start date/time
- `end_date`: Event end date/time (optional)
- `duration_hours`: Duration in hours
- `volunteers_needed`: Number of volunteers needed
- `volunteers_confirmed`: Number of confirmed volunteers
- `status`: Event status (DRAFT, PUBLISHED, IN_PROGRESS, COMPLETED, CANCELLED)
- `image_url`: Event image URL
- `created_at`, `updated_at`: Timestamps

---

### 7. `event_required_skills` - Event Skill Requirements (Many-to-Many)
Links events to required skills with minimum proficiency levels.

```sql
CREATE TABLE event_required_skills (
    id BIGSERIAL PRIMARY KEY,
    event_id BIGINT NOT NULL REFERENCES events(id) ON DELETE CASCADE,
    skill_id BIGINT NOT NULL REFERENCES skills(id) ON DELETE CASCADE,
    minimum_proficiency VARCHAR(20) NOT NULL CHECK (minimum_proficiency IN ('BEGINNER', 'INTERMEDIATE', 'ADVANCED', 'EXPERT')),
    is_mandatory BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(event_id, skill_id)
);

CREATE INDEX idx_event_required_skills_event_id ON event_required_skills(event_id);
CREATE INDEX idx_event_required_skills_skill_id ON event_required_skills(skill_id);
```

**Columns:**
- `id`: Unique record identifier
- `event_id`: Reference to event
- `skill_id`: Reference to skill
- `minimum_proficiency`: Minimum required proficiency level
- `is_mandatory`: Whether skill is mandatory or optional
- `created_at`: Creation timestamp

---

### 8. `volunteer_applications` - Volunteer Event Applications
Tracks volunteer applications to events.

```sql
CREATE TABLE volunteer_applications (
    id BIGSERIAL PRIMARY KEY,
    event_id BIGINT NOT NULL REFERENCES events(id) ON DELETE CASCADE,
    volunteer_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    status VARCHAR(20) DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'APPROVED', 'REJECTED', 'WITHDRAWN', 'COMPLETED')),
    application_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    response_date TIMESTAMP,
    motivation_text TEXT,
    hours_completed INT,
    rating_from_organizer INT CHECK (rating_from_organizer >= 1 AND rating_from_organizer <= 5),
    feedback_from_organizer TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(event_id, volunteer_id)
);

CREATE INDEX idx_volunteer_applications_event_id ON volunteer_applications(event_id);
CREATE INDEX idx_volunteer_applications_volunteer_id ON volunteer_applications(volunteer_id);
CREATE INDEX idx_volunteer_applications_status ON volunteer_applications(status);
```

**Columns:**
- `id`: Unique application identifier
- `event_id`: Reference to event
- `volunteer_id`: Reference to volunteer user
- `status`: Application status (PENDING, APPROVED, REJECTED, WITHDRAWN, COMPLETED)
- `application_date`: When volunteer applied
- `response_date`: When organizer responded
- `motivation_text`: Volunteer's motivation for applying
- `hours_completed`: Hours actually completed
- `rating_from_organizer`: Rating (1-5 stars)
- `feedback_from_organizer`: Feedback text
- `created_at`, `updated_at`: Timestamps

---

### 9. `event_matches` - AI-Generated Matches
Stores AI-generated volunteer-event matches for recommendations.

```sql
CREATE TABLE event_matches (
    id BIGSERIAL PRIMARY KEY,
    event_id BIGINT NOT NULL REFERENCES events(id) ON DELETE CASCADE,
    volunteer_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    match_score DECIMAL(5, 2) NOT NULL CHECK (match_score >= 0 AND match_score <= 100),
    skill_match_percentage DECIMAL(5, 2),
    availability_match BOOLEAN,
    location_distance_km DECIMAL(10, 2),
    match_reason TEXT,
    is_notified BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(event_id, volunteer_id)
);

CREATE INDEX idx_event_matches_event_id ON event_matches(event_id);
CREATE INDEX idx_event_matches_volunteer_id ON event_matches(volunteer_id);
CREATE INDEX idx_event_matches_match_score ON event_matches(match_score DESC);
```

**Columns:**
- `id`: Unique match identifier
- `event_id`: Reference to event
- `volunteer_id`: Reference to volunteer
- `match_score`: Overall match score (0-100)
- `skill_match_percentage`: Skill match percentage
- `availability_match`: Whether volunteer is available
- `location_distance_km`: Distance from volunteer to event
- `match_reason`: Explanation of match
- `is_notified`: Whether volunteer was notified
- `created_at`: Creation timestamp

---

### 10. `notifications` - User Notifications
Stores notifications for users.

```sql
CREATE TABLE notifications (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    type VARCHAR(50) NOT NULL,
    title VARCHAR(200) NOT NULL,
    message TEXT NOT NULL,
    related_event_id BIGINT REFERENCES events(id) ON DELETE SET NULL,
    related_application_id BIGINT REFERENCES volunteer_applications(id) ON DELETE SET NULL,
    is_read BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    read_at TIMESTAMP
);

CREATE INDEX idx_notifications_user_id ON notifications(user_id);
CREATE INDEX idx_notifications_is_read ON notifications(is_read);
CREATE INDEX idx_notifications_created_at ON notifications(created_at DESC);
```

**Columns:**
- `id`: Unique notification identifier
- `user_id`: Reference to user
- `type`: Notification type (e.g., "EVENT_MATCH", "APPLICATION_APPROVED")
- `title`: Notification title
- `message`: Notification message
- `related_event_id`: Reference to related event (optional)
- `related_application_id`: Reference to related application (optional)
- `is_read`: Read status
- `created_at`: Creation timestamp
- `read_at`: When notification was read

---

### 11. `audit_log` - System Audit Trail
Tracks important system events for auditing.

```sql
CREATE TABLE audit_log (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT REFERENCES users(id) ON DELETE SET NULL,
    action VARCHAR(100) NOT NULL,
    entity_type VARCHAR(50) NOT NULL,
    entity_id BIGINT,
    old_values JSONB,
    new_values JSONB,
    ip_address VARCHAR(45),
    user_agent TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_audit_log_user_id ON audit_log(user_id);
CREATE INDEX idx_audit_log_entity_type ON audit_log(entity_type);
CREATE INDEX idx_audit_log_created_at ON audit_log(created_at DESC);
```

**Columns:**
- `id`: Unique log entry identifier
- `user_id`: User who performed action
- `action`: Action performed (CREATE, UPDATE, DELETE)
- `entity_type`: Type of entity affected
- `entity_id`: ID of entity affected
- `old_values`: Previous values (JSONB)
- `new_values`: New values (JSONB)
- `ip_address`: IP address of request
- `user_agent`: User agent string
- `created_at`: Timestamp of action

---

## Relationships Summary

```
users (1) ──── (1) volunteer_profiles
users (1) ──── (1) organizer_profiles
users (1) ──── (M) volunteer_skills
users (1) ──── (M) events (as organizer)
users (1) ──── (M) volunteer_applications
users (1) ──── (M) event_matches
users (1) ──── (M) notifications
users (1) ──── (M) audit_log

skills (1) ──── (M) volunteer_skills
skills (1) ──── (M) event_required_skills

events (1) ──── (M) event_required_skills
events (1) ──── (M) volunteer_applications
events (1) ──── (M) event_matches
events (1) ──── (M) notifications

volunteer_applications (1) ──── (M) notifications
```

---

## Constraints & Business Rules

1. **User Roles:** Each user has exactly one role (VOLUNTEER, ORGANIZER, or ADMIN)
2. **Volunteer Profile:** Only users with VOLUNTEER role can have volunteer_profiles
3. **Organizer Profile:** Only users with ORGANIZER role can have organizer_profiles
4. **Unique Applications:** A volunteer can only apply to an event once
5. **Unique Skills:** A volunteer can only have one proficiency level per skill
6. **Event Status Flow:** DRAFT → PUBLISHED → IN_PROGRESS → COMPLETED (or CANCELLED)
7. **Application Status Flow:** PENDING → (APPROVED or REJECTED) → COMPLETED (or WITHDRAWN)
8. **Match Score:** Always between 0 and 100
9. **Proficiency Levels:** BEGINNER < INTERMEDIATE < ADVANCED < EXPERT

---

## Indexes Strategy

- **Performance:** Indexes on frequently queried columns (user_id, event_id, status, dates)
- **Foreign Keys:** Automatic indexes on all foreign keys
- **Composite Queries:** Indexes on columns used in WHERE and JOIN clauses
- **Sorting:** Indexes on columns used for ORDER BY (e.g., created_at DESC)

---

## Future Enhancements

1. **Ratings & Reviews:** Separate table for volunteer-organizer ratings
2. **Availability Calendar:** Table for volunteer availability slots
3. **Event Categories:** Separate table for event categories
4. **Volunteer Hours Tracking:** Detailed hours tracking per event
5. **Messaging System:** Direct messaging between volunteers and organizers
6. **Payment/Compensation:** Track volunteer compensation if applicable
7. **Certificates:** Track certificates earned by volunteers
8. **Recommendations:** Store recommendation history for matching algorithm

---

## Migration Strategy

1. Create all tables with foreign keys
2. Create all indexes
3. Add sample data (skills, event types)
4. Test referential integrity
5. Set up backup and recovery procedures
