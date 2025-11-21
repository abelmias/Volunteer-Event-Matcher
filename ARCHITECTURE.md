# System Architecture Documentation

**Project:** Volunteer Event Matcher  
**Version:** 1.0  
**Last Updated:** [Date]

---

## 📐 High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    CLIENT LAYER (Browser)                    │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  Angular Single Page Application (SPA)              │   │
│  │  ┌──────────────────────────────────────────────┐   │   │
│  │  │  Components                                  │   │   │
│  │  │  - Auth Component                            │   │   │
│  │  │  - Admin Dashboard Component                 │   │   │
│  │  │  - Event Browse Component                    │   │   │
│  │  │  - Collection Component                      │   │   │
│  │  │  - Map Component                             │   │   │
│  │  └──────────────────────────────────────────────┘   │   │
│  │  ┌──────────────────────────────────────────────┐   │   │
│  │  │  Services                                    │   │   │
│  │  │  - AuthService                               │   │   │
│  │  │  - EventService                              │   │   │
│  │  │  - CollectionService                         │   │   │
│  │  │  - MapService                                │   │   │
│  │  │  - HttpClientService                         │   │   │
│  │  └──────────────────────────────────────────────┘   │   │
│  │  ┌──────────────────────────────────────────────┐   │   │
│  │  │  Models & Interfaces                         │   │   │
│  │  │  - User, Event, Collection, VolunteerEvent   │   │   │
│  │  └──────────────────────────────────────────────┘   │   │
│  └─────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
                        ↕ HTTP/REST (JSON)
┌─────────────────────────────────────────────────────────────┐
│                  API LAYER (Spring Boot)                     │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  REST Controllers                                   │   │
│  │  - AuthController                                  │   │
│  │  - EventController                                 │   │
│  │  - CollectionController                            │   │
│  │  - ProximityController                             │   │
│  └─────────────────────────────────────────────────────┘   │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  Request/Response DTOs                             │   │
│  │  - LoginRequest/Response                           │   │
│  │  - EventDTO                                        │   │
│  │  - CollectionDTO                                   │   │
│  └─────────────────────────────────────────────────────┘   │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  Exception Handlers                                │   │
│  │  - GlobalExceptionHandler                          │   │
│  │  - Custom Exceptions                               │   │
│  └─────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
                        ↕ (Dependency Injection)
┌─────────────────────────────────────────────────────────────┐
│                  SERVICE LAYER (Business Logic)              │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  Services                                           │   │
│  │  - UserService                                      │   │
│  │  - EventService                                     │   │
│  │  - CollectionService                                │   │
│  │  - CommitService                                    │   │
│  │  - ProximitySearchService                           │   │
│  │  - DistanceCalculator (Utility)                     │   │
│  └─────────────────────────────────────────────────────┘   │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  Security & Authentication                         │   │
│  │  - JwtTokenProvider                                 │   │
│  │  - SecurityConfig                                  │   │
│  │  - UserDetailsService                              │   │
│  └─────────────────────────────────────────────────────┘   │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  Utilities                                          │   │
│  │  - ValidationUtils                                 │   │
│  │  - MapperUtils                                     │   │
│  │  - DistanceCalculator (Haversine)                  │   │
│  └─────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
                        ↕ (Dependency Injection)
┌─────────────────────────────────────────────────────────────┐
│              PERSISTENCE LAYER (Data Access)                 │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  JPA Repositories (Spring Data)                     │   │
│  │  - UserRepository                                   │   │
│  │  - EventRepository                                  │   │
│  │  - CollectionRepository                             │   │
│  │  - VolunteerEventRepository                         │   │
│  │  - AdminRepository                                  │   │
│  │  - HelperRepository                                 │   │
│  └─────────────────────────────────────────────────────┘   │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  JPA Entities (ORM Mapping)                         │   │
│  │  - User, Admin, Helper                              │   │
│  │  - Event, EventSuggestion                           │   │
│  │  - Collection, VolunteerEvent                       │   │
│  │  - Catalog, AdminDashboard                          │   │
│  └─────────────────────────────────────────────────────┘   │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  Transaction Management                            │   │
│  │  - @Transactional annotations                       │   │
│  │  - Atomic operations                                │   │
│  └─────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
                        ↕ JDBC/SQL
┌─────────────────────────────────────────────────────────────┐
│              DATABASE LAYER (PostgreSQL)                     │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  Tables                                             │   │
│  │  - users, admin, helper                             │   │
│  │  - event, event_suggestion                          │   │
│  │  - collection, volunteer_event                      │   │
│  │  - catalog, admin_dashboard                         │   │
│  └─────────────────────────────────────────────────────┘   │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  Indexes & Constraints                              │   │
│  │  - Primary keys, Foreign keys                       │   │
│  │  - Unique constraints                               │   │
│  │  - Check constraints                                │   │
│  │  - Performance indexes                              │   │
│  └─────────────────────────────────────────────────────┘   │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  Views (for common queries)                         │   │
│  │  - event_with_admin                                 │   │
│  │  - helper_collection_view                           │   │
│  └─────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

---

## 🏗️ Layered Architecture

### 1. **Presentation Layer (Angular Frontend)**

**Responsibility:** User interface and user interaction

**Components:**
- **Auth Component** - Login/Register UI
- **Admin Dashboard** - Event management UI
- **Event Browse** - Event listing and search
- **Collection** - Helper's basket UI
- **Map Component** - Map display and proximity search

**Services:**
- **AuthService** - Authentication logic
- **EventService** - Event data operations
- **CollectionService** - Collection management
- **MapService** - Map interactions
- **HttpClientService** - HTTP communication

**Models:**
- User, Event, Collection, VolunteerEvent interfaces

---

### 2. **API Layer (Spring Boot Controllers)**

**Responsibility:** HTTP request handling and response formatting

**Controllers:**
- **AuthController** - `/api/auth/*` endpoints
- **EventController** - `/api/events/*` endpoints
- **CollectionController** - `/api/collections/*` endpoints
- **ProximityController** - `/api/events/proximity/*` endpoints

**DTOs (Data Transfer Objects):**
- Request DTOs - Validate and parse incoming data
- Response DTOs - Format outgoing data
- Example: `LoginRequest`, `EventDTO`, `CollectionDTO`

**Exception Handlers:**
- Global exception handling
- Custom exceptions for business logic errors
- Proper HTTP status codes and error messages

---

### 3. **Service Layer (Business Logic)**

**Responsibility:** Core business logic and data processing

**Services:**
- **UserService** - User management
- **EventService** - Event CRUD operations
- **CollectionService** - Collection management
- **CommitService** - Atomic commit operations
- **ProximitySearchService** - Proximity calculations

**Security:**
- **JwtTokenProvider** - JWT token generation/validation
- **SecurityConfig** - Spring Security configuration
- **UserDetailsService** - User authentication

**Utilities:**
- **DistanceCalculator** - Haversine formula implementation
- **ValidationUtils** - Input validation
- **MapperUtils** - Entity-DTO mapping

---

### 4. **Persistence Layer (Spring Data JPA)**

**Responsibility:** Data access and ORM mapping

**Repositories:**
- Extend `JpaRepository<Entity, ID>`
- Custom query methods using `@Query`
- Automatic CRUD operations

**Entities:**
- JPA-annotated classes mapped to database tables
- Relationships defined with `@OneToMany`, `@ManyToOne`, etc.
- Cascade operations configured

**Transaction Management:**
- `@Transactional` annotations for atomic operations
- Rollback on exceptions
- Proper isolation levels

---

### 5. **Database Layer (PostgreSQL)**

**Responsibility:** Data persistence and integrity

**Tables:**
- Normalized schema with proper relationships
- Indexes for performance
- Constraints for data integrity

**Features:**
- Foreign key relationships
- Cascade delete operations
- Views for complex queries
- Triggers (optional) for audit trails

---

## 🔄 Data Flow Examples

### Example 1: Helper Adds Event to Collection

```
1. User clicks "Add to Collection" button
   ↓
2. Angular EventComponent calls CollectionService.addEvent()
   ↓
3. HTTP POST /api/collections/{userId}/add/{eventId}
   ↓
4. Spring CollectionController receives request
   ↓
5. CollectionService.addEventToCollection() called
   ↓
6. VolunteerEventRepository.save() creates new record
   ↓
7. Database INSERT into volunteer_event table
   ↓
8. Response returned to Angular
   ↓
9. UI updated with success message
```

---

### Example 2: Helper Commits Collection (Atomic Transaction)

```
1. User clicks "Commit Collection" button
   ↓
2. Angular CollectionComponent calls CollectionService.commit()
   ↓
3. HTTP POST /api/collections/{userId}/commit
   ↓
4. Spring CollectionController receives request
   ↓
5. CommitService.commitCollection() called (TRANSACTIONAL)
   ├─ Get all INTERESTED items
   ├─ Update status to COMMITTED
   ├─ Decrement event.slotsAvailable
   ├─ Increment event.registeredVolunteers
   ├─ Clear collection
   └─ If any error → ROLLBACK all changes
   ↓
6. Multiple database UPDATEs in single transaction
   ↓
7. Response returned to Angular
   ↓
8. UI updated with committed events
```

---

### Example 3: Proximity Search

```
1. User enters location and radius
   ↓
2. Angular MapComponent calls MapService.searchProximity()
   ↓
3. HTTP GET /api/events/proximity?lat=X&lon=Y&radius=R
   ↓
4. Spring ProximityController receives request
   ↓
5. ProximitySearchService.findEventsWithinRadius() called
   ├─ Fetch all events from database
   ├─ For each event:
   │  └─ Calculate distance using DistanceCalculator (Haversine)
   └─ Filter events within radius
   ↓
6. Results sorted by distance
   ↓
7. Response returned to Angular
   ↓
8. Angular MapComponent displays markers
   ↓
9. Map updates with filtered events
```

---

## 🔐 Security Architecture

### Authentication Flow

```
1. User enters credentials
   ↓
2. POST /api/auth/login
   ↓
3. UserService validates credentials
   ├─ Find user by username
   ├─ Compare password hash
   └─ If valid → continue
   ↓
4. JwtTokenProvider generates JWT token
   ├─ Include userId, username, role
   ├─ Set expiration (1 hour)
   └─ Sign with secret key
   ↓
5. Return token to client
   ↓
6. Client stores token in localStorage
   ↓
7. For subsequent requests, include token in Authorization header
   ↓
8. Spring Security intercepts request
   ├─ Extract token from header
   ├─ Validate token signature
   ├─ Check expiration
   └─ If valid → allow request
```

### Authorization

- **Role-based access control (RBAC)**
  - ADMIN role: Can create/edit/delete events
  - HELPER role: Can browse events, manage collection

- **Resource-level authorization**
  - Helpers can only access their own collection
  - Admin cannot view helper collections

- **Annotations**
  - `@PreAuthorize("hasRole('ADMIN')")` - Admin-only endpoints
  - `@PreAuthorize("hasRole('HELPER')")` - Helper-only endpoints

---

## 📊 Key Design Patterns

### 1. **Repository Pattern**
- Abstracts data access logic
- Repositories handle all database operations
- Services depend on repositories, not database directly

### 2. **Service Layer Pattern**
- Encapsulates business logic
- Controllers delegate to services
- Promotes code reuse and testability

### 3. **DTO Pattern**
- Separates API contracts from internal entities
- Prevents exposing database structure
- Enables validation at API boundary

### 4. **Dependency Injection**
- Spring manages object creation and wiring
- Loose coupling between components
- Easier testing with mock objects

### 5. **Transaction Pattern**
- `@Transactional` ensures atomicity
- Automatic rollback on exceptions
- Prevents partial updates

---

## 🚀 Scalability Considerations

### Database Optimization
- **Indexes** on frequently queried columns
- **Query optimization** for proximity searches
- **Connection pooling** (HikariCP) for performance
- **Caching** (optional) for frequently accessed data

### API Optimization
- **Pagination** for large result sets
- **Lazy loading** for related entities
- **Rate limiting** to prevent abuse
- **Compression** for responses

### Frontend Optimization
- **Lazy loading** of components
- **Virtual scrolling** for large lists
- **Caching** of API responses
- **Minification** and bundling

---

## 🧪 Testing Strategy

### Unit Tests
- Test individual services in isolation
- Mock repositories and dependencies
- Test business logic and calculations

### Integration Tests
- Test controller-service interaction
- Test service-repository interaction
- Use in-memory database (H2) for testing

### E2E Tests
- Test complete user workflows
- Use real database
- Test from UI to database

---

## 📦 Deployment Architecture

### Development Environment
```
Local Machine
├── Angular Dev Server (localhost:4200)
├── Spring Boot App (localhost:8080)
└── PostgreSQL (localhost:5432)
```

### Production Environment (Future)
```
Cloud Platform (e.g., AWS, Heroku)
├── Frontend (CDN/Static Hosting)
├── Backend (App Server)
├── Database (Managed PostgreSQL)
└── Load Balancer (if needed)
```

---

## 🔄 Technology Stack Summary

| Layer | Technology | Purpose |
|---|---|---|
| **Frontend** | Angular 14+ | SPA framework |
| **Frontend UI** | Bootstrap/TailwindCSS | Styling |
| **Frontend Maps** | LeafletJS | Map display |
| **Backend** | Spring Boot 2.7+ | REST API framework |
| **Backend Security** | Spring Security | Authentication/Authorization |
| **Backend ORM** | Spring Data JPA | Database abstraction |
| **Backend Database** | PostgreSQL 12+ | Relational database |
| **Build Tools** | Maven (Backend), npm (Frontend) | Dependency management |
| **Testing** | JUnit, Mockito (Backend), Jasmine (Frontend) | Unit testing |

---

## 📈 Performance Metrics

**Target Performance:**
- API response time: < 200ms
- Page load time: < 2s
- Database query time: < 100ms
- Concurrent users: 100+

**Monitoring:**
- Application logs
- Database query logs
- API response times
- Error rates

---

## 🔗 Integration Points

### Frontend-Backend Integration
- REST API over HTTP/HTTPS
- JSON request/response format
- CORS configured for development

### Backend-Database Integration
- JDBC connection pooling
- Prepared statements for SQL injection prevention
- Transaction management

### External Services (Future)
- Email service (for notifications)
- SMS service (for alerts)
- Payment service (if monetized)

---

## 📝 Notes

- Architecture follows **Clean Architecture** principles
- Separation of concerns at each layer
- Easy to test and maintain
- Scalable for future enhancements

---

**Last Updated:** [Date]  
**Version:** 1.0
