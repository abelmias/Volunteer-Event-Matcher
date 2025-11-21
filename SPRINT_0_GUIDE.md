# Sprint 0 - Inception Phase: Complete Guide

**Duration:** 3 Days  
**Goal:** Establish project foundation, create all planning documents, and prepare for Sprint 1 development

---

## 📋 Sprint 0 Overview

Sprint 0 is the **Inception phase** where you set up everything needed before writing code. This is critical for:
- Meeting rubric requirements (Design Documentation, Code Communication standards)
- Establishing team processes (Git workflow, Slack communication)
- Creating a shared understanding of the project (Domain model, vision)
- Preparing for smooth development in Sprints 1-4

---

## 🎯 Sprint 0 Deliverables (What Instructor Reviews)

### 1. **Vision Document** (PDF)
**What:** 1-2 page document describing your project  
**Why:** Shows you understand the problem and solution  
**Include:**
- Problem: Why volunteers need better event discovery
- Solution: What your app does
- Target users: Admin and Helpers
- Key features: Catalog, Collection, Commit, Map
- Success criteria: How you'll measure success

**File:** `VISION.md` or `VISION.pdf`

---

### 2. **Domain Model** (UML Class Diagram - PDF)
**What:** Visual representation of all entities and relationships  
**Why:** Shows you understand the data structure  
**Include:**
- **User** class: id, username, password, role, createdAt
- **Event** class: id, title, description, date, location, latitude, longitude, organizer, slotsAvailable, createdBy, status
- **Collection** class: id, helper (1:1 with User), createdAt
- **VolunteerEvent** class: id, event, collection, status (INTERESTED/COMMITTED/CANCELLED), addedAt, committedAt
- All relationships with cardinality (1:1, 1:many, many:many)

**File:** `DOMAIN_MODEL.pdf` (use draw.io, Lucidchart, or PlantUML)

---

### 3. **Database ERD** (Entity-Relationship Diagram - PDF)
**What:** Database schema visualization  
**Why:** Shows how data is persisted  
**Include:**
- All tables: `users`, `events`, `collections`, `volunteer_events`
- All columns with data types
- Primary keys, foreign keys
- Relationships and cardinality

**File:** `DATABASE_ERD.pdf`

---

### 4. **Trello Board** (Visible to Instructor)
**What:** Product backlog with user stories and epics  
**Why:** Shows planning and work breakdown  
**Include:**
- 5 Epics (Auth, Admin CRUD, Helper Discovery, Collection/Commit, Map)
- 12-15 User Stories (one per feature)
- 2-3 Spike Stories (research tasks)
- Columns: Backlog, Sprint 0, Sprint 1-4, Done
- Sprint 0 tasks clearly marked

**Note:** Instructor reviews directly in Trello

---

### 5. **GitHub Repository** (Visible to Instructor)
**What:** Initialized repo with documentation and project structure  
**Why:** Shows version control setup and initial commits  
**Include:**
- `main` and `develop` branches
- `.gitignore` files
- `README.md` with project overview
- `BRANCHING_STRATEGY.md`
- `COMMIT_CONVENTIONS.md`
- `CONTRIBUTING.md`
- Initial Spring Boot and Angular project structure

**Note:** Instructor reviews commit history and branching

---

### 6. **Slack Workspace** (Visible to Instructor)
**What:** Team communication channel  
**Why:** Shows ongoing communication and collaboration  
**Include:**
- Channels: #general, #sprint-planning, #code-review
- Project overview posted in #general
- Regular updates as you work

**Note:** Instructor can join workspace to see activity

---

## 📅 Sprint 0 Timeline (3 Days)

### Day 1: Repository & Communication Setup + Vision & Domain Model
**Tasks:**
- [ ] Initialize GitHub repo
- [ ] Document branching strategy and commit conventions
- [ ] Set up Slack workspace
- [ ] Write vision document
- [ ] Create domain model UML diagram

**Commits:**
- `CHORE(sprint0): initialize repository and documentation`
- `DOCS(sprint0): add vision document and domain model`

---

### Day 2: Product Backlog + Database Design
**Tasks:**
- [ ] Create Trello board with epics and user stories
- [ ] Create database ERD
- [ ] Write SQL DDL script
- [ ] Document database design

**Commits:**
- `DOCS(sprint0): add database schema and ERD`

**Note:** Trello board doesn't need a commit, instructor reviews directly

---

### Day 3: Architecture & Code Standards + Project Setup
**Tasks:**
- [ ] Document REST API endpoints
- [ ] Define Java naming conventions
- [ ] Define TypeScript/Angular naming conventions
- [ ] Define Javadoc and TSDoc standards
- [ ] Create architecture diagram
- [ ] Initialize Spring Boot project
- [ ] Initialize Angular project

**Commits:**
- `DOCS(sprint0): add code standards and architecture`
- `CHORE(sprint0): initialize spring boot and angular projects`

---

## 🚀 How to Start Sprint 0

### Step 1: Create GitHub Repository
```bash
# Create repo on GitHub (or use classroom link)
# Clone locally
git clone <repo-url>
cd windsurf-project

# Create branches
git checkout -b develop
git push -u origin develop

# Create feature branch for Sprint 0
git checkout -b feature/sprint0-setup
```

### Step 2: Create Initial Directory Structure
```
windsurf-project/
├── backend/                    # Spring Boot project
│   ├── src/
│   ├── pom.xml
│   └── README.md
├── frontend/                   # Angular project
│   ├── src/
│   ├── package.json
│   └── README.md
├── docs/                       # Documentation
│   ├── VISION.md
│   ├── DOMAIN_MODEL.pdf
│   ├── DATABASE_ERD.pdf
│   ├── DATABASE_DESIGN.md
│   ├── API_ENDPOINTS.md
│   ├── JAVA_CONVENTIONS.md
│   ├── ANGULAR_CONVENTIONS.md
│   ├── ARCHITECTURE.md
│   └── schema.sql
├── .gitignore
├── README.md
├── BRANCHING_STRATEGY.md
├── COMMIT_CONVENTIONS.md
└── CONTRIBUTING.md
```

### Step 3: Write Documentation
- Start with vision document (most important)
- Create domain model diagram
- Create database ERD
- Document API endpoints
- Define code standards

### Step 4: Initialize Projects
```bash
# Backend (Spring Boot)
cd backend
# Use Spring Initializr or create manually

# Frontend (Angular)
cd ../frontend
ng new volunteer-event-matcher
```

### Step 5: Create Trello Board
- Go to trello.com
- Create board "Volunteer Event Matcher"
- Add columns and cards as per checklist
- Share link with instructor

### Step 6: Set Up Slack
- Create workspace
- Add channels
- Post project overview
- Invite instructor (if required)

---

## 📝 Key Documents to Create

### 1. VISION.md
```markdown
# Volunteer Event Matcher - Vision Document

## Problem
Volunteers struggle to find nearby volunteer opportunities that match their interests.

## Solution
A web platform where:
- Admins manage a catalog of volunteer events
- Volunteers browse, search, and commit to events
- Events are displayed on a map for proximity-based discovery

## Target Users
- **Admins:** Event coordinators who create and manage events
- **Helpers:** Volunteers who discover and commit to events

## Key Features
1. Event Catalog Management (Admin CRUD)
2. Event Browsing & Search (Helper)
3. Collection Management (Helper basket)
4. Commitment System (Atomic transaction)
5. Map Integration (Proximity filtering)

## Success Criteria
- Users can find and commit to events within 3 clicks
- Events persist after logout
- Map shows nearby events within 10km
```

### 2. DOMAIN_MAPPING.md
```markdown
# Domain Mapping

| Generic Term | Volunteer Event Matcher |
|---|---|
| Catalog | Volunteer Opportunities (Event table) |
| Entry | Individual VolunteerEvent |
| Collection | Helper's basket of interested events |
| Commit | Confirming participation (status → COMMITTED, decrement slots) |
| Owner | Admin user (username = "admin") |
| Helper | Non-admin user |
```

### 3. API_ENDPOINTS.md
```markdown
# REST API Endpoints

## Authentication
- POST /api/auth/register
- POST /api/auth/login
- POST /api/auth/logout

## Events (Admin)
- POST /api/events (admin only)
- PUT /api/events/{id} (admin only)
- DELETE /api/events/{id} (admin only)

## Events (Helper - Browse)
- GET /api/events
- GET /api/events/search?q=keyword
- GET /api/events/filter?city=X&date=Y

## Collections
- GET /api/collections/{userId}
- POST /api/collections/{userId}/add/{eventId}
- DELETE /api/collections/{userId}/remove/{eventId}
- POST /api/collections/{userId}/commit

## Map
- GET /api/events/proximity?lat=X&lon=Y&radius=R
```

---

## ✅ Sprint 0 Submission Checklist

Before submitting to instructor, verify:

- [ ] GitHub repo initialized with all branches
- [ ] All Sprint 0 documentation committed
- [ ] Vision document complete and clear
- [ ] Domain model UML diagram created
- [ ] Database ERD created
- [ ] SQL DDL script written
- [ ] API endpoints documented
- [ ] Code standards defined
- [ ] Architecture diagram created
- [ ] Spring Boot project initialized
- [ ] Angular project initialized
- [ ] Trello board created with all epics and user stories
- [ ] Slack workspace set up with channels
- [ ] README.md complete with setup instructions
- [ ] All commits follow naming conventions
- [ ] No uncommitted changes

---

## 🎓 Rubric Alignment

### Code Communication (Sprint 0)
- ✅ Naming conventions defined (Java, TypeScript)
- ✅ Javadoc/TSDoc standards defined
- ✅ Code structure documented

### Final Design Documentation (Sprint 0)
- ✅ Vision document complete
- ✅ Domain model complete
- ✅ Database design complete
- ✅ Architecture documented
- ✅ API endpoints documented

### Version Control Activities (Sprint 0)
- ✅ GitHub repo initialized
- ✅ Branching strategy documented
- ✅ Commit conventions documented
- ✅ Initial commits made

### Demo (Sprint 0)
- ✅ Project structure ready
- ✅ Documentation ready for presentation

---

## 🔗 Next Steps

After Sprint 0 is complete:
1. Instructor reviews and approves Sprint 0 deliverables
2. Begin Sprint 1: Security & Core Catalog
3. Start implementing authentication and admin CRUD
4. Continue with Sprints 2-4

---

**Good luck with Sprint 0! This foundation will make Sprints 1-4 much smoother.**
