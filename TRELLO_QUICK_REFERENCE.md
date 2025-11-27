# Trello Quick Reference - Copy & Paste Guide

**Use this to quickly add cards to Trello. Copy the text below and paste into Trello card descriptions.**

---

## 🎯 EPICS (Add to Backlog or Sprint 0)

### Epic 1: Authentication & Security
```
Description: User authentication and role-based access control

Acceptance Criteria:
- Users can register with username and password
- Users can log in securely
- Sessions persist across browser close
- Passwords are hashed with BCrypt
- Role-based access control (ADMIN vs HELPER)
- Logout clears session

Labels: Epic: Auth, Sprint 0
```

### Epic 2: Admin Event Management
```
Description: Admin CRUD operations on volunteer events

Acceptance Criteria:
- Admin can create new events
- Admin can edit existing events
- Admin can delete events
- Admin can view event details
- Event validation prevents invalid data
- Admin cannot view helper collections

Labels: Epic: Admin, Sprint 1
```

### Epic 3: Helper Event Discovery
```
Description: Helpers browse and search for volunteer opportunities

Acceptance Criteria:
- Helpers can browse all events
- Helpers can search by keyword
- Helpers can filter by location and date
- Event details are clearly displayed
- Search results are paginated
- No performance issues with 100+ events

Labels: Epic: Helper, Sprint 2
```

### Epic 4: Collection & Commit
```
Description: Helpers manage personal event collections and commit to events

Acceptance Criteria:
- Helpers can add events to collection
- Helpers can remove events from collection
- Helpers can view their collection
- Helpers can commit collection (atomic transaction)
- Collection persists after logout
- Slots are properly decremented on commit

Labels: Epic: Collection, Sprint 2
```

### Epic 5: Map Integration (10% Feature)
```
Description: Display events on map with proximity-based filtering

Acceptance Criteria:
- Events are displayed on interactive map
- Event markers show location
- Proximity search works with radius
- Distance to events is calculated (Haversine)
- Map filters by location radius
- Mobile responsive

Labels: Epic: Map, Sprint 3
```

---

## 📝 USER STORIES - AUTHENTICATION (Sprint 1)

### Story 1: User Registration
```
As a new volunteer,
I want to register with a username and password,
So that I can create an account and access the platform.

Acceptance Criteria:
- [ ] User can enter username and password
- [ ] System validates input (username unique, password strong)
- [ ] Password is hashed before storage
- [ ] User is assigned HELPER role
- [ ] Confirmation message shown
- [ ] User can then log in

Labels: Epic: Auth, Sprint 1, Priority: High
```

### Story 2: Admin Login
```
As an admin,
I want to log in with special privileges,
So that I can manage the event catalog.

Acceptance Criteria:
- [ ] Admin can log in with username/password
- [ ] System recognizes admin role
- [ ] Admin dashboard is displayed
- [ ] Session is created
- [ ] JWT token is generated

Labels: Epic: Auth, Sprint 1, Priority: High
```

### Story 3: Helper Login & Persistence
```
As a helper,
I want to log in and see my collection,
So that I can continue where I left off.

Acceptance Criteria:
- [ ] Helper can log in
- [ ] Collection is loaded from database
- [ ] All previous events are shown
- [ ] Session persists across browser close
- [ ] Data is restored after logout/login

Labels: Epic: Auth, Sprint 1, Priority: High
```

### Story 4: User Logout
```
As a user,
I want to log out,
So that my session ends securely.

Acceptance Criteria:
- [ ] Logout button is available
- [ ] Session is cleared
- [ ] User is redirected to login page
- [ ] Collection data is saved
- [ ] Token is invalidated

Labels: Epic: Auth, Sprint 1, Priority: Medium
```

---

## 📝 USER STORIES - ADMIN (Sprint 1)

### Story 5: Create Event
```
As an admin,
I want to create a new volunteer event,
So that volunteers can see and commit to it.

Acceptance Criteria:
- [ ] Form accepts: title, description, date, location, slots, lat/lon
- [ ] Validation ensures all required fields filled
- [ ] Event is saved to database
- [ ] Event appears in catalog
- [ ] Confirmation message shown
- [ ] Admin can create multiple events

Labels: Epic: Admin, Sprint 1, Priority: High
```

### Story 6: Edit Event
```
As an admin,
I want to edit event details,
So that I can fix mistakes or update information.

Acceptance Criteria:
- [ ] Admin can select event to edit
- [ ] Form pre-fills with current data
- [ ] Changes are saved to database
- [ ] Event is updated in catalog
- [ ] Confirmation message shown
- [ ] Validation prevents invalid updates

Labels: Epic: Admin, Sprint 1, Priority: High
```

### Story 7: Delete Event
```
As an admin,
I want to delete an event,
So that I can remove cancelled opportunities.

Acceptance Criteria:
- [ ] Admin can select event to delete
- [ ] Confirmation dialog shown
- [ ] Event is removed from database
- [ ] Event no longer appears in catalog
- [ ] Volunteers' collections are updated
- [ ] Audit log records deletion

Labels: Epic: Admin, Sprint 1, Priority: High
```

### Story 8: Admin Cannot View Helper Collections
```
As an admin,
I want to be prevented from viewing helper collections,
So that volunteer privacy is protected.

Acceptance Criteria:
- [ ] No button/link to view collections
- [ ] Direct URL access returns 404
- [ ] No hidden API access
- [ ] Audit log records attempts
- [ ] Authorization check on backend

Labels: Epic: Admin, Sprint 1, Priority: High
```

---

## 📝 USER STORIES - HELPER (Sprint 2)

### Story 9: Browse All Events
```
As a helper,
I want to browse all available events,
So that I can find volunteer opportunities.

Acceptance Criteria:
- [ ] All active events are displayed
- [ ] Event cards show: title, date, location, slots
- [ ] Events are paginated (10 per page)
- [ ] No performance issues with 100+ events
- [ ] Loading indicator shown while fetching

Labels: Epic: Helper, Sprint 2, Priority: High
```

### Story 10: Search Events
```
As a helper,
I want to search events by keyword,
So that I can find relevant opportunities.

Acceptance Criteria:
- [ ] Search box accepts keywords
- [ ] Results filter by title/description
- [ ] Results update in real-time
- [ ] No results message shown if empty
- [ ] Search is case-insensitive

Labels: Epic: Helper, Sprint 2, Priority: High
```

### Story 11: Filter Events by Location
```
As a helper,
I want to filter events by city/location,
So that I can find nearby opportunities.

Acceptance Criteria:
- [ ] Filter dropdown shows cities
- [ ] Results update when filter applied
- [ ] Multiple filters can be combined
- [ ] Clear filters button available
- [ ] Filter state persists in URL

Labels: Epic: Helper, Sprint 2, Priority: Medium
```

### Story 12: Add Event to Collection
```
As a helper,
I want to add an event to my collection,
So that I can consider it later.

Acceptance Criteria:
- [ ] "Add to Collection" button on each event
- [ ] Event is added with INTERESTED status
- [ ] Confirmation message shown
- [ ] Event appears in collection
- [ ] Button changes to "Remove from Collection"

Labels: Epic: Collection, Sprint 2, Priority: High
```

### Story 13: Remove Event from Collection
```
As a helper,
I want to remove an event from my collection,
So that I can change my mind.

Acceptance Criteria:
- [ ] "Remove from Collection" button available
- [ ] Event is removed from collection
- [ ] Confirmation message shown
- [ ] Button changes back to "Add to Collection"
- [ ] Collection updates immediately

Labels: Epic: Collection, Sprint 2, Priority: High
```

### Story 14: Commit Collection
```
As a helper,
I want to commit my collection,
So that I confirm my participation in selected events.

Acceptance Criteria:
- [ ] "Commit Collection" button available
- [ ] All INTERESTED events become COMMITTED
- [ ] Event slots are decremented
- [ ] Collection is cleared
- [ ] Confirmation message shown
- [ ] Data persists in database
- [ ] Transaction is atomic (all or nothing)

Labels: Epic: Collection, Sprint 2, Priority: High
```

### Story 15: Collection Persistence
```
As a helper,
I want my collection to persist after logout,
So that I don't lose my selections.

Acceptance Criteria:
- [ ] Collection is saved to database
- [ ] After logout and login, collection is restored
- [ ] Even after browser close, collection persists
- [ ] All events and statuses are preserved
- [ ] No data loss on server restart

Labels: Epic: Collection, Sprint 2, Priority: High
```

---

## 📝 USER STORIES - MAP (Sprint 3)

### Story 16: Display Events on Map
```
As a helper,
I want to see events displayed on a map,
So that I can visualize their locations.

Acceptance Criteria:
- [ ] Map displays all events
- [ ] Each event has a marker
- [ ] Marker shows event title on hover
- [ ] Map is interactive (zoom, pan)
- [ ] Performance is good with 100+ events
- [ ] Mobile responsive

Labels: Epic: Map, Sprint 3, Priority: High
```

### Story 17: Proximity Search
```
As a helper,
I want to filter events by proximity,
So that I can find nearby opportunities.

Acceptance Criteria:
- [ ] Input field for latitude/longitude
- [ ] Input field for radius (km)
- [ ] Search button triggers proximity search
- [ ] Results show only events within radius
- [ ] Distance to each event is displayed
- [ ] Map updates with filtered results
- [ ] Uses Haversine formula for accuracy

Labels: Epic: Map, Sprint 3, Priority: High
```

### Story 18: Geolocation Support
```
As a helper,
I want to use my current location,
So that I don't have to enter coordinates manually.

Acceptance Criteria:
- [ ] "Use My Location" button available
- [ ] Browser geolocation is requested
- [ ] Coordinates are auto-filled
- [ ] User can still manually enter coordinates
- [ ] Privacy is respected (ask for permission)

Labels: Epic: Map, Sprint 3, Priority: Medium
```

---

## 🔍 SPIKE STORIES (Sprint 0)

### Spike 1: Research LeafletJS Integration
```
Investigate how to integrate LeafletJS with Angular:

Research Items:
- [ ] How to display markers on map
- [ ] How to handle click events on markers
- [ ] Performance with many markers (100+)
- [ ] Styling and customization options
- [ ] Mobile responsiveness

Deliverable: Proof of concept with 10+ markers

Labels: Spike, Sprint 0, Priority: Medium
```

### Spike 2: Research Spring Data JPA Transactions
```
Investigate atomic transactions in Spring Boot:

Research Items:
- [ ] How to ensure atomicity in commit operation
- [ ] Rollback on error
- [ ] Handling concurrent commits
- [ ] Testing transaction behavior
- [ ] Isolation levels

Deliverable: Test code showing transaction management

Labels: Spike, Sprint 0, Priority: Medium
```

### Spike 3: Research PostgreSQL Setup
```
Investigate PostgreSQL setup with Spring Boot:

Research Items:
- [ ] Connection pooling (HikariCP)
- [ ] Migration tools (Flyway/Liquibase)
- [ ] Performance tuning
- [ ] Backup strategies
- [ ] Index creation

Deliverable: Working local PostgreSQL setup

Labels: Spike, Sprint 0, Priority: Medium
```

---

## 📋 HOW TO USE THIS GUIDE

1. Go to your Trello board
2. Copy each card's content above
3. Create a new card in the appropriate column
4. Paste the description
5. Add the labels
6. Set due date (end of sprint)
7. Repeat for all cards

**Total cards to create: 23**
- 5 Epics
- 15 User Stories
- 3 Spike Stories

**Estimated time: 30-45 minutes**

---

**Last Updated:** [Date]
