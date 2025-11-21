# Trello Board Setup Guide

**Project:** Volunteer Event Matcher  
**Board Name:** Volunteer Event Matcher

---

## 📊 Board Structure

### Columns
1. **Backlog** - Future work not yet scheduled
2. **Sprint 0** - Current sprint (Inception)
3. **Sprint 1** - Elaboration phase
4. **Sprint 2** - Construction phase (Helper features)
5. **Sprint 3** - Construction phase (Map integration)
6. **Sprint 4** - Transition phase
7. **Done** - Completed work

---

## 🎯 Epics (5 Total)

### Epic 1: Authentication & Security
**Description:** User authentication and role-based access control

**Cards in this epic:**
- User registration
- User login
- Session management
- Password hashing
- Role-based access control

---

### Epic 2: Admin Event Management
**Description:** Admin CRUD operations on volunteer events

**Cards in this epic:**
- Create event
- Edit event
- Delete event
- View event details
- Event validation

---

### Epic 3: Helper Event Discovery
**Description:** Helpers browse and search for volunteer opportunities

**Cards in this epic:**
- Browse all events
- Search events by keyword
- Filter events by location
- Filter events by date
- View event details

---

### Epic 4: Collection & Commit
**Description:** Helpers manage personal event collections and commit to events

**Cards in this epic:**
- Add event to collection
- Remove event from collection
- View collection
- Commit collection
- Persist collection data

---

### Epic 5: Map Integration (10% Feature)
**Description:** Display events on map with proximity-based filtering

**Cards in this epic:**
- Display events on map
- Show event markers
- Proximity search (Haversine)
- Filter by radius
- Show distance to events

---

## 📝 User Stories (12-15 Total)

### Authentication Stories

**Story 1: User Registration**
```
As a new volunteer,
I want to register with a username and password,
So that I can create an account and access the platform.

Acceptance Criteria:
- User can enter username and password
- System validates input
- Password is hashed before storage
- User is assigned HELPER role
- Confirmation message shown
```

**Story 2: Admin Login**
```
As an admin,
I want to log in with special privileges,
So that I can manage the event catalog.

Acceptance Criteria:
- Admin can log in with username/password
- System recognizes admin role
- Admin dashboard is displayed
- Session is created
```

**Story 3: Helper Login & Persistence**
```
As a helper,
I want to log in and see my collection,
So that I can continue where I left off.

Acceptance Criteria:
- Helper can log in
- Collection is loaded from database
- All previous events are shown
- Session persists across browser close
```

**Story 4: User Logout**
```
As a user,
I want to log out,
So that my session ends securely.

Acceptance Criteria:
- Logout button is available
- Session is cleared
- User is redirected to login page
- Collection data is saved
```

---

### Admin Stories

**Story 5: Create Event**
```
As an admin,
I want to create a new volunteer event,
So that volunteers can see and commit to it.

Acceptance Criteria:
- Form accepts: title, description, date, location, slots, lat/lon
- Validation ensures all required fields filled
- Event is saved to database
- Event appears in catalog
- Confirmation message shown
```

**Story 6: Edit Event**
```
As an admin,
I want to edit event details,
So that I can fix mistakes or update information.

Acceptance Criteria:
- Admin can select event to edit
- Form pre-fills with current data
- Changes are saved to database
- Event is updated in catalog
- Confirmation message shown
```

**Story 7: Delete Event**
```
As an admin,
I want to delete an event,
So that I can remove cancelled opportunities.

Acceptance Criteria:
- Admin can select event to delete
- Confirmation dialog shown
- Event is removed from database
- Event no longer appears in catalog
- Volunteers' collections are updated
```

**Story 8: Admin Cannot View Helper Collections**
```
As an admin,
I want to be prevented from viewing helper collections,
So that volunteer privacy is protected.

Acceptance Criteria:
- No button/link to view collections
- Direct URL access returns 404
- No hidden API access
- Audit log records attempts
```

---

### Helper Stories

**Story 9: Browse All Events**
```
As a helper,
I want to browse all available events,
So that I can find volunteer opportunities.

Acceptance Criteria:
- All active events are displayed
- Event cards show: title, date, location, slots
- Events are paginated (10 per page)
- No performance issues with 100+ events
```

**Story 10: Search Events**
```
As a helper,
I want to search events by keyword,
So that I can find relevant opportunities.

Acceptance Criteria:
- Search box accepts keywords
- Results filter by title/description
- Results update in real-time
- No results message shown if empty
```

**Story 11: Filter Events by Location**
```
As a helper,
I want to filter events by city/location,
So that I can find nearby opportunities.

Acceptance Criteria:
- Filter dropdown shows cities
- Results update when filter applied
- Multiple filters can be combined
- Clear filters button available
```

**Story 12: Add Event to Collection**
```
As a helper,
I want to add an event to my collection,
So that I can consider it later.

Acceptance Criteria:
- "Add to Collection" button on each event
- Event is added with INTERESTED status
- Confirmation message shown
- Event appears in collection
- Button changes to "Remove from Collection"
```

**Story 13: Remove Event from Collection**
```
As a helper,
I want to remove an event from my collection,
So that I can change my mind.

Acceptance Criteria:
- "Remove from Collection" button available
- Event is removed from collection
- Confirmation message shown
- Button changes back to "Add to Collection"
```

**Story 14: Commit Collection**
```
As a helper,
I want to commit my collection,
So that I confirm my participation in selected events.

Acceptance Criteria:
- "Commit Collection" button available
- All INTERESTED events become COMMITTED
- Event slots are decremented
- Collection is cleared
- Confirmation message shown
- Data persists in database
```

**Story 15: Collection Persistence**
```
As a helper,
I want my collection to persist after logout,
So that I don't lose my selections.

Acceptance Criteria:
- Collection is saved to database
- After logout and login, collection is restored
- Even after browser close, collection persists
- All events and statuses are preserved
```

---

### Map Stories

**Story 16: Display Events on Map**
```
As a helper,
I want to see events displayed on a map,
So that I can visualize their locations.

Acceptance Criteria:
- Map displays all events
- Each event has a marker
- Marker shows event title on hover
- Map is interactive (zoom, pan)
- Performance is good with 100+ events
```

**Story 17: Proximity Search**
```
As a helper,
I want to filter events by proximity,
So that I can find nearby opportunities.

Acceptance Criteria:
- Input field for latitude/longitude
- Input field for radius (km)
- Search button triggers proximity search
- Results show only events within radius
- Distance to each event is displayed
- Map updates with filtered results
```

**Story 18: Geolocation Support**
```
As a helper,
I want to use my current location,
So that I don't have to enter coordinates manually.

Acceptance Criteria:
- "Use My Location" button available
- Browser geolocation is requested
- Coordinates are auto-filled
- User can still manually enter coordinates
- Privacy is respected
```

---

## 🔍 Spike Stories (2-3 Total)

**Spike 1: Research LeafletJS Integration**
```
Investigate how to integrate LeafletJS with Angular:
- How to display markers
- How to handle click events
- Performance with many markers
- Styling and customization
- Mobile responsiveness

Deliverable: Proof of concept with 10+ markers
```

**Spike 2: Research Spring Data JPA Transactions**
```
Investigate atomic transactions in Spring Boot:
- How to ensure atomicity in commit operation
- Rollback on error
- Handling concurrent commits
- Testing transaction behavior

Deliverable: Test code showing transaction management
```

**Spike 3: Research PostgreSQL Setup**
```
Investigate PostgreSQL setup with Spring Boot:
- Connection pooling (HikariCP)
- Migration tools (Flyway/Liquibase)
- Performance tuning
- Backup strategies

Deliverable: Working local PostgreSQL setup
```

---

## 📋 Trello Card Template

Each card should include:

```
Title: [Story/Task Name]

Description:
[User story or task description]

Acceptance Criteria:
- [ ] Criterion 1
- [ ] Criterion 2
- [ ] Criterion 3

Labels: [Epic Name], [Sprint #], [Priority]

Assignee: [Your Name]

Due Date: [Sprint end date]

Checklist:
- [ ] Code complete
- [ ] Tests written
- [ ] Code reviewed
- [ ] Documentation updated
- [ ] Merged to develop
```

---

## 🏷️ Labels to Create

- `Epic: Auth`
- `Epic: Admin`
- `Epic: Helper`
- `Epic: Collection`
- `Epic: Map`
- `Sprint 0`
- `Sprint 1`
- `Sprint 2`
- `Sprint 3`
- `Sprint 4`
- `Priority: High`
- `Priority: Medium`
- `Priority: Low`
- `Bug`
- `Documentation`
- `Testing`

---

## 📊 Initial Board State

### Sprint 0 Column
- [x] Initialize repository
- [x] Create documentation
- [x] Create domain model
- [x] Create database schema
- [ ] Create Trello board (THIS TASK)
- [ ] Create API documentation
- [ ] Create architecture diagram
- [ ] Initialize Spring Boot
- [ ] Initialize Angular

### Sprint 1 Column
- [ ] Epic: Authentication & Security
  - [ ] User registration
  - [ ] User login
  - [ ] Session management
- [ ] Epic: Admin Event Management
  - [ ] Create event
  - [ ] Edit event
  - [ ] Delete event
- [ ] Epic: Admin UI
  - [ ] Admin dashboard
  - [ ] Event form

### Sprint 2 Column
- [ ] Epic: Helper Event Discovery
  - [ ] Browse events
  - [ ] Search events
  - [ ] Filter events
- [ ] Epic: Collection & Commit
  - [ ] Add to collection
  - [ ] Remove from collection
  - [ ] Commit collection

### Sprint 3 Column
- [ ] Epic: Map Integration
  - [ ] Display map
  - [ ] Show markers
  - [ ] Proximity search

### Sprint 4 Column
- [ ] Code review
- [ ] Testing
- [ ] Documentation
- [ ] Demo preparation

---

## 🔗 Sharing the Board

1. After creating the board, click "Share"
2. Get the board link
3. Share with instructor
4. Make sure instructor has view access

---

## 📝 Notes

- Update card status as you work
- Add comments for blockers or questions
- Move cards to "Done" when complete
- Use due dates to track sprint progress
- Attach files/links to cards as needed

---

**Last Updated:** [Date]
