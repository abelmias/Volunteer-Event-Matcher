# Volunteer Event Matcher - Complete Project Checklist (Part 1: Sprint 0-2)

**Team:** 2 members (1 active, 1 contributing via documentation)  
**Project:** Volunteer Event Matcher  
**Stack:** Spring Boot + Angular + PostgreSQL  

---

## 📋 SPRINT 0: Inception (3 Days)

### Goal
Finalize design, establish technical environment, and create foundational project documents.

### 0.0 Repository & Communication Setup (1 Day)

- [ ] **0.0.1** Initialize GitHub repository
  - [ ] Create `main` branch (protected)
  - [ ] Create `develop` branch
  - [ ] Create initial `feature/*` branch template
  - [ ] Add `.gitignore` for Java/Angular/Node
  - [ ] Add `README.md` with project overview

- [ ] **0.0.2** Document Branching Strategy
  - [ ] Main workflow: `main` ← `develop` ← `feature/X`
  - [ ] Naming: `feature/auth`, `feature/event-crud`, `feature/map-integration`
  - [ ] Create `BRANCHING_STRATEGY.md`

- [ ] **0.0.3** Document Commit Message Conventions
  - [ ] Format: `TYPE(scope): description`
  - [ ] Types: `FEAT`, `FIX`, `DOCS`, `STYLE`, `REFACTOR`, `TEST`, `CHORE`
  - [ ] Create `COMMIT_CONVENTIONS.md`

- [ ] **0.0.4** Set up Slack Workspace
  - [ ] Create channels: `#general`, `#sprint-planning`, `#code-review`
  - [ ] Post project overview in `#general`

- [ ] **0.0.5** Create `CONTRIBUTING.md`
  - [ ] Code style guidelines
  - [ ] Pull request process

**Commit:** `CHORE(sprint0): initialize repository and documentation`

---

### 0.1 Vision & Domain Model (1 Day)

- [ ] **0.1.1** Write Vision Document (1-2 pages)
  - [ ] Problem statement
  - [ ] Solution overview
  - [ ] Target users: Admin and Helpers
  - [ ] Key features
  - [ ] Create `VISION.md`

- [ ] **0.1.2** Create Domain Model (UML Class Diagram)
  - [ ] **User**: id, username, password, role, createdAt
  - [ ] **Event**: id, title, description, date, location, latitude, longitude, organizer, slotsAvailable, createdBy, status
  - [ ] **Collection**: id, helper (1:1 User), createdAt
  - [ ] **VolunteerEvent**: id, event, collection, status (INTERESTED/COMMITTED/CANCELLED), addedAt, committedAt
  - [ ] Document all relationships
  - [ ] Export as `DOMAIN_MODEL.pdf`

- [ ] **0.1.3** Map Domain Terms
  - [ ] Catalog = Volunteer Opportunities
  - [ ] Entry = Individual VolunteerEvent
  - [ ] Collection = Helper's basket
  - [ ] Commit = Confirming participation
  - [ ] Create `DOMAIN_MAPPING.md`

**Commit:** `DOCS(sprint0): add vision document and domain model`

---

### 0.2 Product Backlog (Trello) (1 Day)

- [ ] **0.2.1** Create Trello Board
  - [ ] Columns: `Backlog`, `Sprint 0`, `Sprint 1-4`, `Done`

- [ ] **0.2.2** Create 5 Epics
  - [ ] Epic 1: Authentication & Security
  - [ ] Epic 2: Admin Event Management
  - [ ] Epic 3: Helper Event Discovery
  - [ ] Epic 4: Collection & Commit
  - [ ] Epic 5: Map Integration (10% Feature)

- [ ] **0.2.3** Create 12-15 User Stories
  - [ ] Auth: registration, login, logout, role-based access
  - [ ] Admin: CRUD events, no collection access
  - [ ] Helper: browse, search, add/remove from collection, commit, persistence
  - [ ] Map: display on map, proximity filtering

- [ ] **0.2.4** Create 2-3 Spike Stories
  - [ ] Research LeafletJS + Angular integration
  - [ ] Research Spring Data JPA transactions
  - [ ] Research PostgreSQL + Spring Boot setup

**Note:** Instructor reviews Trello directly

---

### 0.3 Database Schema & ERD (1 Day)

- [ ] **0.3.1** Create Entity-Relationship Diagram (ERD)
  - [ ] Tables: `users`, `events`, `collections`, `volunteer_events`
  - [ ] Show relationships and cardinality
  - [ ] Export as `DATABASE_ERD.pdf`

- [ ] **0.3.2** Write SQL DDL Script
  - [ ] Create `schema.sql`
  - [ ] Define all tables with proper data types
  - [ ] Add constraints (NOT NULL, UNIQUE, FOREIGN KEY)
  - [ ] Add indexes for performance

- [ ] **0.3.3** Document Database Design
  - [ ] Create `DATABASE_DESIGN.md`
  - [ ] Table and column descriptions

**Commit:** `DOCS(sprint0): add database schema and ERD`

---

### 0.4 Architecture & Code Standards (0.5 Day)

- [ ] **0.4.1** Document REST API Endpoints
  - [ ] Auth: `POST /api/auth/login`, `POST /api/auth/logout`, `POST /api/auth/register`
  - [ ] Events: `GET /api/events`, `POST /api/events` (admin), `PUT /api/events/{id}` (admin), `DELETE /api/events/{id}` (admin)
  - [ ] Collections: `GET /api/collections/{userId}`, `POST /api/collections/{userId}/add`, `DELETE /api/collections/{userId}/remove/{eventId}`
  - [ ] Commit: `POST /api/collections/{userId}/commit`
  - [ ] Map: `GET /api/events/proximity?lat=X&lon=Y&radius=R`
  - [ ] Create `API_ENDPOINTS.md`

- [ ] **0.4.2** Define Java Naming Conventions
  - [ ] Classes: PascalCase (e.g., `UserService`, `EventController`)
  - [ ] Methods: camelCase (e.g., `getUserById`)
  - [ ] Constants: UPPER_SNAKE_CASE
  - [ ] Packages: lowercase (e.g., `com.volunteer.service`)
  - [ ] Create `JAVA_CONVENTIONS.md`

- [ ] **0.4.3** Define TypeScript/Angular Naming Conventions
  - [ ] Components: kebab-case files, PascalCase classes
  - [ ] Services: PascalCase with "Service" suffix
  - [ ] Interfaces: PascalCase with "I" prefix
  - [ ] Create `ANGULAR_CONVENTIONS.md`

- [ ] **0.4.4** Define Javadoc Standards
  - [ ] All public classes and methods documented
  - [ ] Format: `@param`, `@return`, `@throws`
  - [ ] Create `JAVADOC_STANDARDS.md`

- [ ] **0.4.5** Define TypeScript/TSDoc Standards
  - [ ] All public classes and methods documented
  - [ ] JSDoc style comments
  - [ ] Create `TSDOC_STANDARDS.md`

- [ ] **0.4.6** Create Architecture Diagram
  - [ ] Frontend (Angular) → Backend (Spring Boot) → Database (PostgreSQL)
  - [ ] Layer breakdown: Controller → Service → Repository → Entity
  - [ ] Create `ARCHITECTURE.md`

**Commit:** `DOCS(sprint0): add code standards and architecture`

---

### 0.5 Project Setup (0.5 Day)

- [ ] **0.5.1** Initialize Spring Boot Project
  - [ ] Create project structure
  - [ ] Add `pom.xml` with dependencies
  - [ ] Create `application.properties` (placeholder)
  - [ ] Create package structure: `controller`, `service`, `repository`, `entity`, `dto`

- [ ] **0.5.2** Initialize Angular Project
  - [ ] Create project structure
  - [ ] Add `package.json` with dependencies
  - [ ] Create module structure: `components`, `services`, `models`
  - [ ] Set up routing module

- [ ] **0.5.3** Create `.gitignore` Files
  - [ ] Java: `target/`, `.classpath`, `.project`, `.settings/`, `*.class`
  - [ ] Angular: `node_modules/`, `dist/`, `.angular/`
  - [ ] General: `.env`, `.DS_Store`, `*.log`

**Commit:** `CHORE(sprint0): initialize spring boot and angular projects`

---

### 0.6 Sprint 0 Submission

- [ ] **0.6.1** Create Sprint 0 Submission PDF
  - [ ] Include: Vision, domain model, database ERD
  - [ ] File: `SPRINT_0_SUBMISSION.pdf`

- [ ] **0.6.2** Ensure GitHub Ready
  - [ ] All Sprint 0 documentation committed
  - [ ] Branching strategy documented

- [ ] **0.6.3** Ensure Trello Ready
  - [ ] All user stories and epics visible
  - [ ] Sprint 0 tasks marked

- [ ] **0.6.4** Ensure Slack Active
  - [ ] Channels created
  - [ ] Project overview posted

---

---

## 📋 SPRINT 1: Elaboration - Security & Core Catalog (4 Days)

### Goal
Implement secure user access and Admin's full CRUD control over the Event Catalog.

### 1.1 Database & ORM Implementation (1 Day)

- [ ] **1.1.1** Create JPA Entities
  - [ ] `User` entity with all fields and annotations
  - [ ] `Event` entity with all fields
  - [ ] `Collection` entity
  - [ ] `VolunteerEvent` entity (join table)
  - [ ] Add relationships: `@OneToMany`, `@ManyToOne`, `@OneToOne`
  - [ ] Add Javadoc for all entities

- [ ] **1.1.2** Create Spring Data Repositories
  - [ ] `UserRepository extends JpaRepository<User, Long>`
  - [ ] `EventRepository extends JpaRepository<Event, Long>`
  - [ ] `CollectionRepository extends JpaRepository<Collection, Long>`
  - [ ] `VolunteerEventRepository extends JpaRepository<VolunteerEvent, Long>`
  - [ ] Add custom query methods
  - [ ] Add Javadoc for all methods

- [ ] **1.1.3** Configure Database Connection
  - [ ] Update `application.properties` with PostgreSQL details
  - [ ] Set up connection pooling (HikariCP)
  - [ ] Enable JPA/Hibernate logging
  - [ ] Test connection

- [ ] **1.1.4** Create Database Initialization Script
  - [ ] `schema.sql` with all table creation statements
  - [ ] `data.sql` with sample data (admin user, sample events)
  - [ ] Configure Spring Boot to run on startup

**Commit:** `FEAT(database): implement JPA entities and repositories`

---

### 1.2 User Authentication (1 Day)

- [ ] **1.2.1** Create User Service
  - [ ] `UserService` with methods:
    - [ ] `registerUser(username, password, role)`
    - [ ] `authenticateUser(username, password)`
    - [ ] `getUserById(id)`
    - [ ] `getUserByUsername(username)`
  - [ ] Hash passwords using BCrypt
  - [ ] Add Javadoc

- [ ] **1.2.2** Create Authentication Controller
  - [ ] `POST /api/auth/register` - Register new user
  - [ ] `POST /api/auth/login` - Login user (return JWT or session token)
  - [ ] `POST /api/auth/logout` - Logout user
  - [ ] Add request/response DTOs
  - [ ] Add Javadoc

- [ ] **1.2.3** Implement Session Management
  - [ ] Use Spring Security or JWT
  - [ ] Store session info (user ID, role, login time)
  - [ ] Implement role-based access control (ADMIN vs HELPER)
  - [ ] Add `@PreAuthorize` annotations

- [ ] **1.2.4** Create Authentication Tests
  - [ ] Test successful login
  - [ ] Test failed login
  - [ ] Test registration
  - [ ] Test logout

**Commit:** `FEAT(auth): implement user authentication and session management`

---

### 1.3 Admin Event CRUD APIs (1 Day)

- [ ] **1.3.1** Create Event Service
  - [ ] `EventService` with methods:
    - [ ] `createEvent(eventDTO)`
    - [ ] `updateEvent(id, eventDTO)`
    - [ ] `deleteEvent(id)`
    - [ ] `getEventById(id)`
    - [ ] `getAllEvents()`
  - [ ] Add validation
  - [ ] Add Javadoc

- [ ] **1.3.2** Create Event Controller
  - [ ] `POST /api/events` - Create (admin only)
  - [ ] `PUT /api/events/{id}` - Update (admin only)
  - [ ] `DELETE /api/events/{id}` - Delete (admin only)
  - [ ] `GET /api/events/{id}` - Get details
  - [ ] `GET /api/events` - List all (public)
  - [ ] Add `@PreAuthorize("hasRole('ADMIN')")`
  - [ ] Add Javadoc

- [ ] **1.3.3** Create Event DTOs
  - [ ] `EventCreateDTO`
  - [ ] `EventUpdateDTO`
  - [ ] `EventResponseDTO`
  - [ ] Add validation annotations

- [ ] **1.3.4** Create Event CRUD Tests
  - [ ] Test create (admin)
  - [ ] Test create (non-admin) - should fail
  - [ ] Test update
  - [ ] Test delete
  - [ ] Test get all

**Commit:** `FEAT(admin): implement event CRUD operations`

---

### 1.4 Admin UI & Location Input (1 Day)

- [ ] **1.4.1** Create Admin Dashboard Component
  - [ ] `admin-dashboard.component.ts` and `.html`
  - [ ] Display list of all events
  - [ ] Add buttons: Create, Edit, Delete

- [ ] **1.4.2** Create Event Form Component
  - [ ] `event-form.component.ts` and `.html`
  - [ ] Form fields: title, description, date, location, organizer, slots, latitude, longitude
  - [ ] Form validation
  - [ ] Submit calls backend

- [ ] **1.4.3** Create Event Service (Angular)
  - [ ] `EventService` with methods:
    - [ ] `createEvent(event)` - POST
    - [ ] `updateEvent(id, event)` - PUT
    - [ ] `deleteEvent(id)` - DELETE
    - [ ] `getAllEvents()` - GET
  - [ ] Handle HTTP errors

- [ ] **1.4.4** Create Event List Component
  - [ ] Display all events in table
  - [ ] Show: title, date, location, slots
  - [ ] Add Edit and Delete buttons
  - [ ] Add "Create New Event" button

- [ ] **1.4.5** Add Location Input UI
  - [ ] Add latitude/longitude input fields
  - [ ] Validate coordinates

- [ ] **1.4.6** Create Admin UI Tests
  - [ ] Test form submission
  - [ ] Test event list display
  - [ ] Test delete confirmation

**Commit:** `FEAT(admin-ui): implement event management dashboard`

---

### 1.5 Sprint 1 Testing & Review

- [ ] **1.5.1** Backend Integration Tests
  - [ ] Test full auth flow
  - [ ] Test database persistence
  - [ ] Test role-based access control

- [ ] **1.5.2** Frontend Integration Tests
  - [ ] Test admin form submission
  - [ ] Test event list display
  - [ ] Test error handling

- [ ] **1.5.3** Code Review
  - [ ] Verify all Javadoc present
  - [ ] Verify naming conventions followed
  - [ ] Verify no hardcoded values

**Commit:** `CHORE(sprint1): final code review and testing`

---

---

## 📋 SPRINT 2: Construction - Helper Collection & Commit Logic (4 Days)

### Goal
Implement the core Catalog → Collection → Commit user workflow.

### 2.1 Event Browsing API (Helper) (1 Day)

- [ ] **2.1.1** Create Event Browsing Service
  - [ ] `EventBrowsingService` with methods:
    - [ ] `getAllPublicEvents()`
    - [ ] `searchEvents(keyword)`
    - [ ] `filterEventsByLocation(city)`
    - [ ] `filterEventsByDate(startDate, endDate)`
  - [ ] Add pagination support
  - [ ] Add Javadoc

- [ ] **2.1.2** Create Event Browsing Controller
  - [ ] `GET /api/events` - List all events (public)
  - [ ] `GET /api/events/search?q=keyword` - Search
  - [ ] `GET /api/events/filter?city=X&date=Y` - Filter
  - [ ] Add pagination parameters
  - [ ] Add Javadoc

- [ ] **2.1.3** Create Event Browsing Tests
  - [ ] Test get all events
  - [ ] Test search
  - [ ] Test filtering
  - [ ] Test pagination

**Commit:** `FEAT(helper): implement event browsing API`

---

### 2.2 Collection Management APIs (1 Day)

- [ ] **2.2.1** Create Collection Service
  - [ ] `CollectionService` with methods:
    - [ ] `getCollectionByUserId(userId)`
    - [ ] `addEventToCollection(userId, eventId)` - Create VolunteerEvent with INTERESTED status
    - [ ] `removeEventFromCollection(userId, eventId)`
    - [ ] `getCollectionItems(userId)`
  - [ ] Add validation
  - [ ] Add Javadoc

- [ ] **2.2.2** Create Collection Controller
  - [ ] `GET /api/collections/{userId}` - Get collection (user can only see own)
  - [ ] `POST /api/collections/{userId}/add/{eventId}` - Add event
  - [ ] `DELETE /api/collections/{userId}/remove/{eventId}` - Remove event
  - [ ] Add authorization checks
  - [ ] Add Javadoc

- [ ] **2.2.3** Create Collection DTOs
  - [ ] `CollectionDTO`
  - [ ] `VolunteerEventDTO`
  - [ ] Add validation annotations

- [ ] **2.2.4** Create Collection Tests
  - [ ] Test add event
  - [ ] Test remove event
  - [ ] Test get collection
  - [ ] Test authorization

**Commit:** `FEAT(helper): implement collection management APIs`

---

### 2.3 The Commit API (1 Day)

- [ ] **2.3.1** Create Commit Service
  - [ ] `CommitService` with methods:
    - [ ] `commitCollection(userId)` - Atomic operation:
      1. Get all INTERESTED items
      2. Update status to COMMITTED
      3. Decrement event.slotsAvailable
      4. Clear collection
      5. Return result
    - [ ] Add `@Transactional`
    - [ ] Add error handling
  - [ ] Add Javadoc

- [ ] **2.3.2** Create Commit Controller
  - [ ] `POST /api/collections/{userId}/commit` - Commit collection
  - [ ] Return success/failure message
  - [ ] Return updated slots
  - [ ] Add authorization checks
  - [ ] Add Javadoc

- [ ] **2.3.3** Create Commit DTOs
  - [ ] `CommitResultDTO`
  - [ ] Include: committed events, updated slots, timestamp

- [ ] **2.3.4** Create Commit Tests
  - [ ] Test successful commit
  - [ ] Test commit with insufficient slots (should fail)
  - [ ] Test commit clears collection
  - [ ] Test slots decremented
  - [ ] Test transaction rollback on error

**Commit:** `FEAT(helper): implement commit API with atomic transactions`

---

### 2.4 Helper UI: Browse & Collection (1 Day)

- [ ] **2.4.1** Create Event Browse Component
  - [ ] `event-browse.component.ts` and `.html`
  - [ ] Display list of all events
  - [ ] Show: title, description, date, location, slots
  - [ ] Add "Add to Collection" button
  - [ ] Add search/filter inputs

- [ ] **2.4.2** Create Collection Component
  - [ ] `collection.component.ts` and `.html`
  - [ ] Display all items in collection
  - [ ] Show: event title, date, location
  - [ ] Add "Remove from Collection" button
  - [ ] Add "Commit Collection" button

- [ ] **2.4.3** Create Helper Event Service (Angular)
  - [ ] `HelperEventService` with methods:
    - [ ] `getAllEvents()`
    - [ ] `searchEvents(keyword)`
    - [ ] `filterEvents(filters)`
  - [ ] Handle HTTP errors

- [ ] **2.4.4** Create Helper Collection Service (Angular)
  - [ ] `HelperCollectionService` with methods:
    - [ ] `getCollection(userId)`
    - [ ] `addEventToCollection(userId, eventId)`
    - [ ] `removeEventFromCollection(userId, eventId)`
    - [ ] `commitCollection(userId)`
  - [ ] Handle HTTP errors

- [ ] **2.4.5** Create Helper Navigation
  - [ ] Add navigation between Browse and Collection pages
  - [ ] Show current user info
  - [ ] Add logout button

- [ ] **2.4.6** Create Helper UI Tests
  - [ ] Test event browsing
  - [ ] Test add to collection
  - [ ] Test remove from collection
  - [ ] Test commit collection

**Commit:** `FEAT(helper-ui): implement event browsing and collection management UI`

---

### 2.5 Persistence Testing (0.5 Day)

- [ ] **2.5.1** Test Collection Persistence
  - [ ] Add events to collection
  - [ ] Logout
  - [ ] Login again
  - [ ] Verify collection items still present

- [ ] **2.5.2** Test Commit Persistence
  - [ ] Commit collection
  - [ ] Verify event slots decremented
  - [ ] Verify collection cleared
  - [ ] Verify VolunteerEvent status updated to COMMITTED

**Commit:** `TEST(sprint2): verify collection and commit persistence`

---

### 2.6 Sprint 2 Testing & Review

- [ ] **2.6.1** End-to-End Testing
  - [ ] Test full helper workflow: login → browse → add → commit
  - [ ] Test collection persistence across sessions

- [ ] **2.6.2** Code Review
  - [ ] Verify all Javadoc present
  - [ ] Verify naming conventions followed
  - [ ] Verify no hardcoded values
  - [ ] Verify transaction management correct

**Commit:** `CHORE(sprint2): final code review and testing`

---

**END OF PART 1**
