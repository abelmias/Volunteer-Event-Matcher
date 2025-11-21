# Volunteer Event Matcher

A full-stack web application that connects volunteers with nearby volunteer opportunities through an intuitive catalog, collection management system, and interactive map interface.

## 📌 Project Overview

**Domain:** Volunteer Event Discovery & Management  
**Team Size:** 2 (1 active developer)  
**Duration:** 5 Sprints (Inception → Elaboration → Construction → Construction → Transition)  
**Technology Stack:** Spring Boot + Angular + PostgreSQL

### Domain Mapping

| Generic Term | Volunteer Event Matcher |
|---|---|
| **Catalog** | Volunteer Opportunities (Event database) |
| **Entry** | Individual volunteer event |
| **Collection** | Volunteer's personal basket of interested events |
| **Commit** | Confirming participation (atomic transaction) |
| **Owner** | Admin user (manages events) |
| **Helper** | Volunteer user (discovers and commits to events) |

---

## 🎯 Key Features

### 1. **Authentication & Authorization**
- Minimal login system (username + password)
- Role-based access control (Admin vs Helper)
- Session management with persistence
- Secure password hashing (BCrypt)

### 2. **Admin Features**
- Full CRUD operations on volunteer events
- Event details: title, description, date, location, slots available
- Location input with latitude/longitude
- Event catalog management

### 3. **Helper Features**
- Browse complete event catalog
- Search events by title, description, location
- Filter events by date range and location
- Add/remove events from personal collection
- Commit collection (atomic transaction)
- **Persistent collection** - survives logout/login

### 4. **Map Integration (10% Feature)** 🗺️
- Display events on interactive map (LeafletJS)
- Proximity-based event filtering
- Haversine distance calculation
- Find nearby events within custom radius
- Real-time map updates

### 5. **Data Persistence**
- PostgreSQL database
- All data persists across sessions
- Atomic commit transactions
- Proper constraint management

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    Frontend (Angular)                    │
│  ┌──────────────────────────────────────────────────┐   │
│  │  Components: Auth, Admin, Helper, Map            │   │
│  │  Services: Event, Collection, Auth, Map          │   │
│  │  Models: User, Event, Collection, VolunteerEvent │   │
│  └──────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────┘
                          ↕ HTTP/REST
┌─────────────────────────────────────────────────────────┐
│                  Backend (Spring Boot)                   │
│  ┌──────────────────────────────────────────────────┐   │
│  │  Controllers: Auth, Event, Collection, Proximity │   │
│  │  Services: User, Event, Collection, Commit       │   │
│  │  Repositories: JPA/Spring Data                   │   │
│  │  Entities: User, Event, Collection, VolunteerEv │   │
│  └──────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────┘
                          ↕ JDBC
┌─────────────────────────────────────────────────────────┐
│              Database (PostgreSQL)                       │
│  Tables: users, events, collections, volunteer_events   │
└─────────────────────────────────────────────────────────┘
```

---

## 📊 Data Model

### Core Entities

**User**
- id (PK)
- username (unique)
- password (hashed)
- role (ADMIN, HELPER)
- createdAt

**Event**
- id (PK)
- title
- description
- date
- location
- latitude
- longitude
- organizer
- slotsAvailable
- createdBy (FK → User)
- status (ACTIVE, CANCELLED)

**Collection**
- id (PK)
- helper (FK → User, 1:1)
- createdAt

**VolunteerEvent**
- id (PK)
- event (FK → Event)
- collection (FK → Collection)
- status (INTERESTED, COMMITTED, CANCELLED)
- addedAt
- committedAt

---

## 🚀 Getting Started

### Prerequisites
- Java 11+
- Node.js 14+
- PostgreSQL 12+
- Git

### Backend Setup

```bash
# Navigate to backend directory
cd backend

# Install dependencies (Maven)
mvn clean install

# Configure database in application.properties
spring.datasource.url=jdbc:postgresql://localhost:5432/volunteer_db
spring.datasource.username=postgres
spring.datasource.password=your_password

# Run Spring Boot application
mvn spring-boot:run

# Backend runs on http://localhost:8080
```

### Frontend Setup

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Start Angular development server
ng serve

# Frontend runs on http://localhost:4200
```

### Database Setup

```bash
# Create PostgreSQL database
createdb volunteer_db

# Run schema script
psql -U postgres -d volunteer_db -f docs/schema.sql

# (Optional) Load sample data
psql -U postgres -d volunteer_db -f docs/data.sql
```

---

## 📚 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout user

### Events (Admin)
- `POST /api/events` - Create event (admin only)
- `PUT /api/events/{id}` - Update event (admin only)
- `DELETE /api/events/{id}` - Delete event (admin only)

### Events (Helper - Browse)
- `GET /api/events` - List all events
- `GET /api/events/search?q=keyword` - Search events
- `GET /api/events/filter?city=X&date=Y` - Filter events
- `GET /api/events/{id}` - Get event details

### Collections
- `GET /api/collections/{userId}` - Get user's collection
- `POST /api/collections/{userId}/add/{eventId}` - Add event to collection
- `DELETE /api/collections/{userId}/remove/{eventId}` - Remove event from collection
- `POST /api/collections/{userId}/commit` - Commit collection

### Map & Proximity
- `GET /api/events/proximity?lat=X&lon=Y&radius=R` - Find events within radius
- `GET /api/events/nearest?lat=X&lon=Y&limit=N` - Get N nearest events

---

## 🧪 Testing

### Run Tests

```bash
# Backend tests
cd backend
mvn test

# Frontend tests
cd ../frontend
ng test
```

### Test Coverage
- Unit tests for all services
- Integration tests for API endpoints
- E2E tests for user workflows
- Target: 80%+ code coverage

---

## 📁 Project Structure

```
windsurf-project/
├── backend/
│   ├── src/
│   │   ├── main/java/com/volunteer/
│   │   │   ├── controller/
│   │   │   ├── service/
│   │   │   ├── repository/
│   │   │   ├── entity/
│   │   │   ├── dto/
│   │   │   └── util/
│   │   └── resources/
│   │       └── application.properties
│   ├── pom.xml
│   └── README.md
├── frontend/
│   ├── src/
│   │   ├── app/
│   │   │   ├── components/
│   │   │   ├── services/
│   │   │   ├── models/
│   │   │   └── app-routing.module.ts
│   │   └── index.html
│   ├── package.json
│   └── README.md
├── docs/
│   ├── VISION.md
│   ├── DOMAIN_MODEL.pdf
│   ├── DATABASE_ERD.pdf
│   ├── DATABASE_DESIGN.md
│   ├── API_ENDPOINTS.md
│   ├── ARCHITECTURE.md
│   ├── schema.sql
│   ├── data.sql
│   └── USER_GUIDE.md
├── PROJECT_CHECKLIST_PART1.md
├── PROJECT_CHECKLIST_PART2.md
├── SPRINT_0_GUIDE.md
├── CONTRIBUTIONS.md
├── BRANCHING_STRATEGY.md
├── COMMIT_CONVENTIONS.md
├── CONTRIBUTING.md
└── README.md
```

---

## 📖 Documentation

### For Users
- **USER_GUIDE.md** - How to use the application (admin and helper)
- **VISION.md** - Project vision and goals

### For Developers
- **DEVELOPER_GUIDE.md** - Setup, build, and deployment instructions
- **ARCHITECTURE.md** - System architecture and design decisions
- **API_ENDPOINTS.md** - Complete API documentation
- **DATABASE_DESIGN.md** - Database schema and relationships
- **JAVA_CONVENTIONS.md** - Java coding standards
- **ANGULAR_CONVENTIONS.md** - TypeScript/Angular coding standards

### For Project Management
- **PROJECT_CHECKLIST_PART1.md** - Sprint 0-2 detailed checklist
- **PROJECT_CHECKLIST_PART2.md** - Sprint 3-4 detailed checklist
- **SPRINT_0_GUIDE.md** - Inception phase guide
- **CONTRIBUTIONS.md** - Team contributions and work log
- **BRANCHING_STRATEGY.md** - Git workflow
- **COMMIT_CONVENTIONS.md** - Commit message format

---

## 🔐 Security Considerations

- ✅ Passwords hashed with BCrypt
- ✅ Role-based access control (RBAC)
- ✅ Authorization checks on all protected endpoints
- ✅ SQL injection prevention (parameterized queries)
- ✅ CORS properly configured
- ✅ Session management with secure tokens
- ✅ No sensitive data in logs

---

## 🗺️ Map Integration Details

### Haversine Formula
The proximity search uses the Haversine formula to calculate great-circle distances between two points on Earth:

```
a = sin²(Δφ/2) + cos(φ1) × cos(φ2) × sin²(Δλ/2)
c = 2 × atan2(√a, √(1−a))
d = R × c
```

Where:
- φ is latitude, λ is longitude, R is Earth's radius (6,371 km)
- Δφ is difference in latitude, Δλ is difference in longitude

### LeafletJS Integration
- Interactive map display
- Dynamic marker rendering
- Popup information on marker click
- Map bounds fitting
- Zoom and pan controls

---

## 🎯 Sprint Overview

### Sprint 0: Inception (3 Days)
- ✅ Project setup and documentation
- ✅ Domain model and database design
- ✅ Code standards and architecture
- ✅ GitHub, Slack, Trello setup

### Sprint 1: Elaboration (4 Days)
- ✅ Database and ORM implementation
- ✅ User authentication
- ✅ Admin event CRUD
- ✅ Admin UI

### Sprint 2: Construction (4 Days)
- ✅ Event browsing API
- ✅ Collection management
- ✅ Commit API with atomic transactions
- ✅ Helper UI

### Sprint 3: Construction (4 Days)
- ✅ Haversine distance calculator
- ✅ Proximity search API
- ✅ Map display and markers
- ✅ Proximity filter UI

### Sprint 4: Transition (4 Days)
- ✅ Code review and refactoring
- ✅ Comprehensive testing
- ✅ Final documentation
- ✅ Demo preparation

---

## 📝 Code Standards

### Java
- **Classes:** PascalCase (e.g., `UserService`, `EventController`)
- **Methods:** camelCase (e.g., `getUserById`, `createEvent`)
- **Constants:** UPPER_SNAKE_CASE (e.g., `MAX_SEARCH_RADIUS`)
- **Javadoc:** All public classes and methods documented

### TypeScript/Angular
- **Components:** kebab-case files, PascalCase classes
- **Services:** PascalCase with "Service" suffix
- **Interfaces:** PascalCase with "I" prefix
- **TSDoc:** All public classes and methods documented

---

## 🤝 Contributing

See **CONTRIBUTING.md** for:
- Code style guidelines
- Pull request process
- Testing requirements
- Commit message format

---

## 📞 Team

**Primary Developer:** [Your Name]  
**Partner:** [Partner Name]  

See **CONTRIBUTIONS.md** for detailed work log and team arrangement.

---

## 📄 License

This project is created for educational purposes as part of a Software Engineering course.

---

## 🙏 Acknowledgments

- Spring Boot documentation and guides
- Angular documentation and tutorials
- LeafletJS documentation
- PostgreSQL documentation
- Course instructors and teaching assistants

---

**Last Updated:** [Date]  
**Project Status:** [In Progress / Complete]
