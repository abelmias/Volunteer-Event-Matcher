# Database Design Document

**Project:** Volunteer Event Matcher  
**Database:** PostgreSQL  
**Last Updated:** [Date]

---

## 📊 Database Overview

The database is designed to support the Volunteer Event Matcher application with the following core entities:

- **Users** - Authentication and role management
- **Admin** - Event coordinators (extends Users)
- **Helper** - Volunteers (extends Users)
- **Catalog** - Central event catalog
- **Event** - Volunteer opportunities
- **EventSuggestion** - Helper-suggested events
- **Collection** - Helper's personal event basket
- **VolunteerEvent** - Join table linking events to collections
- **AdminDashboard** - Admin statistics and metrics

---

## 🗂️ Table Descriptions

### 1. USERS Table
**Purpose:** Base table for all user authentication and role management

| Column | Type | Constraints | Description |
|---|---|---|---|
| user_id | SERIAL | PK | Unique user identifier |
| username | VARCHAR(50) | NOT NULL, UNIQUE | Login username |
| password | VARCHAR(255) | NOT NULL | Hashed password (BCrypt) |
| role | VARCHAR(20) | NOT NULL, CHECK | Role: ADMIN or HELPER |
| created_at | TIMESTAMP | DEFAULT NOW | Account creation timestamp |
| updated_at | TIMESTAMP | DEFAULT NOW | Last update timestamp |

**Indexes:**
- `idx_users_username` - Fast username lookups for login

**Notes:**
- Passwords must be hashed using BCrypt before storage
- Role determines access level and UI presentation
- Timestamps track account lifecycle

---

### 2. ADMIN Table
**Purpose:** Admin-specific information (extends Users)

| Column | Type | Constraints | Description |
|---|---|---|---|
| admin_id | SERIAL | PK | Unique admin identifier |
| user_id | INT | FK, UNIQUE | Reference to Users table |
| role_description | VARCHAR(100) | DEFAULT | Admin role description |
| created_at | TIMESTAMP | DEFAULT NOW | Admin creation timestamp |

**Relationships:**
- 1:1 with Users (one user can be one admin)
- 1:many with Event (admin manages multiple events)
- 1:many with EventSuggestion (admin reviews suggestions)

**Notes:**
- Only one admin user per system (username = "admin")
- Cascade delete: if user deleted, admin record deleted

---

### 3. HELPER Table
**Purpose:** Helper/Volunteer-specific information (extends Users)

| Column | Type | Constraints | Description |
|---|---|---|---|
| helper_id | SERIAL | PK | Unique helper identifier |
| user_id | INT | FK, UNIQUE | Reference to Users table |
| email | VARCHAR(100) | NULLABLE | Contact email |
| phone_number | VARCHAR(20) | NULLABLE | Contact phone |
| created_at | TIMESTAMP | DEFAULT NOW | Helper creation timestamp |
| updated_at | TIMESTAMP | DEFAULT NOW | Last update timestamp |

**Relationships:**
- 1:1 with Users (one user can be one helper)
- 1:1 with Collection (each helper has one collection)
- 1:many with EventSuggestion (helper can suggest events)

**Indexes:**
- `idx_helper_email` - Fast email lookups

**Notes:**
- Email and phone are optional but recommended
- Cascade delete: if user deleted, helper record deleted

---

### 4. CATALOG Table
**Purpose:** Central catalog of volunteer opportunities

| Column | Type | Constraints | Description |
|---|---|---|---|
| catalog_id | SERIAL | PK | Unique catalog identifier |
| name | VARCHAR(100) | DEFAULT | Catalog name |
| description | TEXT | NULLABLE | Catalog description |
| created_at | TIMESTAMP | DEFAULT NOW | Creation timestamp |
| updated_at | TIMESTAMP | DEFAULT NOW | Last update timestamp |

**Relationships:**
- 1:many with Event (catalog contains multiple events)

**Notes:**
- Typically only one catalog per system
- Serves as organizational container for events

---

### 5. EVENT Table
**Purpose:** Volunteer opportunities/events

| Column | Type | Constraints | Description |
|---|---|---|---|
| event_id | SERIAL | PK | Unique event identifier |
| catalog_id | INT | FK, NOT NULL | Reference to Catalog |
| admin_id | INT | FK, NOT NULL | Admin who created event |
| title | VARCHAR(200) | NOT NULL | Event title |
| description | TEXT | NULLABLE | Event description |
| event_date | DATE | NOT NULL | Event date |
| event_time | TIME | NULLABLE | Event time |
| location | VARCHAR(255) | NOT NULL | Event location/address |
| city | VARCHAR(100) | NULLABLE | City name |
| latitude | DECIMAL(10,8) | NULLABLE | GPS latitude |
| longitude | DECIMAL(11,8) | NULLABLE | GPS longitude |
| organizer | VARCHAR(100) | NULLABLE | Organization name |
| tags | TEXT | NULLABLE | Event tags (JSON or CSV) |
| slots_available | INT | NOT NULL, CHECK | Available volunteer slots |
| registered_volunteers | INT | DEFAULT 0 | Count of committed volunteers |
| status | VARCHAR(20) | NOT NULL, CHECK | OPEN, CLOSED, CANCELLED |
| created_at | TIMESTAMP | DEFAULT NOW | Creation timestamp |
| updated_at | TIMESTAMP | DEFAULT NOW | Last update timestamp |

**Relationships:**
- many:1 with Catalog (many events in one catalog)
- many:1 with Admin (many events created by one admin)
- 1:many with VolunteerEvent (event in many collections)

**Indexes:**
- `idx_event_catalog` - Fast catalog lookups
- `idx_event_admin` - Fast admin lookups
- `idx_event_city` - Fast city-based filtering
- `idx_event_date` - Fast date-based filtering
- `idx_event_status` - Fast status filtering
- `idx_event_coordinates` - Fast proximity searches

**Notes:**
- Coordinates (latitude/longitude) enable map display and proximity filtering
- Tags support filtering by event type (environment, health, education, etc.)
- slots_available decrements when volunteer commits
- Cascade delete: if catalog/admin deleted, events deleted

---

### 6. EVENT_SUGGESTION Table
**Purpose:** Helper-suggested events awaiting admin approval

| Column | Type | Constraints | Description |
|---|---|---|---|
| suggestion_id | SERIAL | PK | Unique suggestion identifier |
| helper_id | INT | FK, NOT NULL | Helper who suggested |
| admin_id | INT | FK, NULLABLE | Admin who reviewed |
| title | VARCHAR(200) | NOT NULL | Suggested event title |
| description | TEXT | NULLABLE | Event description |
| suggested_date | DATE | NULLABLE | Proposed event date |
| suggested_time | TIME | NULLABLE | Proposed event time |
| location | VARCHAR(255) | NULLABLE | Proposed location |
| city | VARCHAR(100) | NULLABLE | City name |
| latitude | DECIMAL(10,8) | NULLABLE | GPS latitude |
| longitude | DECIMAL(11,8) | NULLABLE | GPS longitude |
| organizer | VARCHAR(100) | NULLABLE | Organization name |
| tags | TEXT | NULLABLE | Event tags |
| suggested_slots | INT | NULLABLE | Proposed volunteer slots |
| status | VARCHAR(20) | NOT NULL, CHECK | PENDING, APPROVED, REJECTED |
| rejection_reason | TEXT | NULLABLE | Reason for rejection |
| created_at | TIMESTAMP | DEFAULT NOW | Creation timestamp |
| updated_at | TIMESTAMP | DEFAULT NOW | Last update timestamp |

**Relationships:**
- many:1 with Helper (many suggestions from one helper)
- many:1 with Admin (many suggestions reviewed by one admin)

**Indexes:**
- `idx_suggestion_helper` - Fast helper lookups
- `idx_suggestion_admin` - Fast admin lookups
- `idx_suggestion_status` - Fast status filtering

**Notes:**
- Allows helpers to propose new events
- Admin reviews and approves/rejects suggestions
- Approved suggestions become Event records
- Cascade delete: if helper deleted, suggestions deleted

---

### 7. COLLECTION Table
**Purpose:** Helper's personal basket of interested events

| Column | Type | Constraints | Description |
|---|---|---|---|
| collection_id | SERIAL | PK | Unique collection identifier |
| helper_id | INT | FK, UNIQUE, NOT NULL | Reference to Helper |
| created_at | TIMESTAMP | DEFAULT NOW | Creation timestamp |
| last_updated_at | TIMESTAMP | DEFAULT NOW | Last update timestamp |

**Relationships:**
- 1:1 with Helper (each helper has one collection)
- 1:many with VolunteerEvent (collection contains many events)

**Notes:**
- One collection per helper
- Acts as a shopping basket for events
- Persists across sessions
- Cascade delete: if helper deleted, collection deleted

---

### 8. VOLUNTEER_EVENT Table
**Purpose:** Join table linking Events to Collections (with status tracking)

| Column | Type | Constraints | Description |
|---|---|---|---|
| volunteer_event_id | SERIAL | PK | Unique record identifier |
| event_id | INT | FK, NOT NULL | Reference to Event |
| collection_id | INT | FK, NOT NULL | Reference to Collection |
| status | VARCHAR(20) | NOT NULL, CHECK | INTERESTED, COMMITTED, CANCELLED |
| added_at | TIMESTAMP | DEFAULT NOW | When added to collection |
| committed_at | TIMESTAMP | NULLABLE | When committed to event |

**Relationships:**
- many:1 with Event (many volunteers for one event)
- many:1 with Collection (many events in one collection)

**Indexes:**
- `idx_volunteer_event_event` - Fast event lookups
- `idx_volunteer_event_collection` - Fast collection lookups
- `idx_volunteer_event_status` - Fast status filtering

**Constraints:**
- UNIQUE(event_id, collection_id) - Prevent duplicate entries

**Notes:**
- Status tracks volunteer's commitment level:
  - INTERESTED: Added to collection, not yet committed
  - COMMITTED: Confirmed participation, slot reserved
  - CANCELLED: Volunteer withdrew
- committed_at timestamp records when commitment was made
- Cascade delete: if event/collection deleted, records deleted

---

### 9. ADMIN_DASHBOARD Table
**Purpose:** Dashboard metrics and statistics for admin

| Column | Type | Constraints | Description |
|---|---|---|---|
| dashboard_id | SERIAL | PK | Unique dashboard identifier |
| admin_id | INT | FK, UNIQUE, NOT NULL | Reference to Admin |
| pending_suggestions_count | INT | DEFAULT 0 | Count of pending suggestions |
| total_events | INT | DEFAULT 0 | Total events created |
| total_volunteers | INT | DEFAULT 0 | Total registered volunteers |
| last_updated_at | TIMESTAMP | DEFAULT NOW | Last update timestamp |

**Relationships:**
- 1:1 with Admin (each admin has one dashboard)

**Notes:**
- Denormalized data for performance
- Should be updated when events/suggestions change
- Helps admin quickly see system status

---

## 🔗 Relationships Summary

```
Users (1) ──┬──→ (1) Admin
            └──→ (1) Helper

Admin (1) ──→ (many) Event
Admin (1) ──→ (many) EventSuggestion
Admin (1) ──→ (1) AdminDashboard

Helper (1) ──→ (1) Collection
Helper (1) ──→ (many) EventSuggestion

Catalog (1) ──→ (many) Event

Event (1) ──→ (many) VolunteerEvent
Collection (1) ──→ (many) VolunteerEvent
```

---

## 🔐 Data Integrity Constraints

### Primary Keys
- All tables have auto-incrementing SERIAL primary keys
- Ensures unique identification of records

### Foreign Keys
- All foreign keys have ON DELETE CASCADE
- Ensures referential integrity
- Deleting parent automatically deletes children

### Check Constraints
- `role IN ('ADMIN', 'HELPER')` - Valid user roles
- `status IN (...)` - Valid event/volunteer statuses
- `slots_available >= 0` - Non-negative slots

### Unique Constraints
- `username` - Unique usernames
- `user_id` in Admin/Helper - One admin/helper per user
- `helper_id` in Collection - One collection per helper
- `(event_id, collection_id)` in VolunteerEvent - No duplicate entries

---

## 📈 Performance Considerations

### Indexes
- **Username index** - Fast login queries
- **Email index** - Fast helper lookups
- **Foreign key indexes** - Fast joins
- **Status indexes** - Fast filtering
- **Date/coordinate indexes** - Fast searches and proximity queries

### Query Optimization
- Indexes on frequently queried columns
- Denormalized dashboard for quick metrics
- Views for common queries

### Scalability
- Proper indexing for large datasets
- Cascade deletes for data consistency
- Partitioning possible on event_date if needed

---

## 🔄 Key Workflows

### Helper Adds Event to Collection
```sql
INSERT INTO volunteer_event (event_id, collection_id, status)
VALUES (?, ?, 'INTERESTED');
```

### Helper Commits Collection
```sql
UPDATE volunteer_event 
SET status = 'COMMITTED', committed_at = NOW()
WHERE collection_id = ? AND status = 'INTERESTED';

UPDATE event 
SET slots_available = slots_available - 1,
    registered_volunteers = registered_volunteers + 1
WHERE event_id IN (SELECT event_id FROM volunteer_event WHERE collection_id = ?);
```

### Admin Creates Event
```sql
INSERT INTO event (catalog_id, admin_id, title, ...)
VALUES (?, ?, ?, ...);

UPDATE admin_dashboard 
SET total_events = total_events + 1
WHERE admin_id = ?;
```

### Admin Reviews Suggestion
```sql
UPDATE event_suggestion 
SET status = 'APPROVED', admin_id = ?
WHERE suggestion_id = ?;

-- Then create event from suggestion
INSERT INTO event (catalog_id, admin_id, title, ...)
SELECT ?, ?, title, ... FROM event_suggestion WHERE suggestion_id = ?;
```

---

## 📝 Sample Queries

### Get All Events for Helper's Collection
```sql
SELECT e.* FROM event e
JOIN volunteer_event ve ON e.event_id = ve.event_id
JOIN collection c ON ve.collection_id = c.collection_id
WHERE c.helper_id = ?
AND ve.status = 'INTERESTED';
```

### Find Events Within Radius (Proximity Search)
```sql
SELECT * FROM event
WHERE (
  6371 * acos(
    cos(radians(?)) * cos(radians(latitude)) *
    cos(radians(longitude) - radians(?)) +
    sin(radians(?)) * sin(radians(latitude))
  )
) <= ?
ORDER BY (
  6371 * acos(
    cos(radians(?)) * cos(radians(latitude)) *
    cos(radians(longitude) - radians(?)) +
    sin(radians(?)) * sin(radians(latitude))
  )
);
```

### Get Admin Dashboard Stats
```sql
SELECT * FROM admin_dashboard WHERE admin_id = ?;
```

---

## 🛡️ Security Notes

1. **Password Storage:** Always hash passwords with BCrypt before storing
2. **SQL Injection:** Use parameterized queries (prepared statements)
3. **Access Control:** Verify user role before allowing operations
4. **Data Privacy:** Never expose helper collections to admin
5. **Timestamps:** Track all changes for audit trail

---

## 📊 Database Statistics

**Expected Data Volume:**
- Users: 100-1000
- Events: 50-500
- Suggestions: 10-100
- Collections: 100-1000
- VolunteerEvents: 500-5000

**Storage Estimate:** ~50-100 MB for typical usage

---

## 🔄 Backup & Recovery

**Recommended:**
- Daily backups
- Point-in-time recovery capability
- Test restore procedures regularly

---

**Last Updated:** [Date]  
**Version:** 1.0
