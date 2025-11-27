# Sprint 3 - Phase 2: Event Management

## 📋 Overview

**Phase 2 Focus:** Event Management - Create, Edit, Publish, List, and Filter Events  
**Duration:** 1.5 weeks  
**Status:** In Progress 🔄

---

## ✅ Backend Status

### Existing Implementation
The backend already has solid event management infrastructure:

#### EventService (Complete)
- ✅ `createEvent()` - Create new event
- ✅ `getEventById()` - Get event details
- ✅ `getUpcomingPublishedEvents()` - Get upcoming events with pagination
- ✅ `getEventsByOrganizer()` - Get organizer's events
- ✅ `getEventsByStatus()` - Filter by status
- ✅ `searchEventsByLocation()` - Search by location
- ✅ `getEventsByType()` - Filter by event type
- ✅ `getEventsNeedingVolunteers()` - Get events needing volunteers
- ✅ `updateEvent()` - Update event details
- ✅ `publishEvent()` - Publish event
- ✅ `cancelEvent()` - Cancel event
- ✅ `deleteEvent()` - Delete event

#### EventController (Needs Enhancement)
- ✅ Basic endpoints implemented
- ⚠️ Needs better error handling
- ⚠️ Needs logging
- ⚠️ Needs proper user extraction from JWT token
- ⚠️ Needs response wrapper

### Enhancements Made
- ✅ Added `@Slf4j` logging annotation
- ✅ Updated `@RequestMapping` from `/api/events` to `/events` (context path already includes `/api`)
- ✅ Added JavaDoc comments

---

## 🎯 Phase 2 Implementation Tasks

### Task 2.1: Enhance EventController ✅ STARTED
**Status:** In Progress

**What to do:**
1. Add proper error handling with meaningful messages
2. Add logging for all operations
3. Extract user from JWT token in createEvent
4. Add response wrapper for consistent API responses
5. Add validation error handling

**Files:**
- `backend/src/main/java/com/volunteer/controller/EventController.java`

### Task 2.2: Create EventRequiredSkillController ⏳ PENDING
**Status:** Ready to Start

**Endpoints to Create:**
```
POST   /api/events/{eventId}/required-skills      - Add required skill
PUT    /api/events/{eventId}/required-skills/{skillId} - Update required skill
DELETE /api/events/{eventId}/required-skills/{skillId} - Remove required skill
GET    /api/events/{eventId}/required-skills      - Get required skills
```

**Methods to Implement:**
```java
addRequiredSkill(Long eventId, EventRequiredSkillDTO skillDTO)
updateRequiredSkill(Long eventId, Long skillId, EventRequiredSkillDTO skillDTO)
removeRequiredSkill(Long eventId, Long skillId)
getRequiredSkills(Long eventId)
```

### Task 2.3: Create EventRequiredSkillDTO ⏳ PENDING
**Status:** Ready to Start

**Fields:**
```java
private Long id;
private Long eventId;
private Long skillId;
private String skillName;
private String minimumProficiency; // BEGINNER, INTERMEDIATE, ADVANCED, EXPERT
private Boolean isMandatory;
private LocalDateTime createdAt;
```

### Task 2.4: Frontend - Create Event Interfaces ⏳ PENDING
**Status:** Ready to Start

**Interfaces to Create:**
- `Event`
- `EventFilter`
- `EventRequiredSkill`

### Task 2.5: Frontend - Create EventService ⏳ PENDING
**Status:** Ready to Start

**Methods to Implement:**
```typescript
createEvent(event: Event): Observable<Event>
updateEvent(id: number, event: Event): Observable<Event>
deleteEvent(id: number): Observable<void>
getEventById(id: number): Observable<Event>
getEventsByOrganizer(organizerId: number): Observable<Event[]>
getUpcomingPublishedEvents(page?: number, size?: number): Observable<Page<Event>>
publishEvent(id: number): Observable<Event>
cancelEvent(id: number): Observable<Event>
searchByLocation(location: string): Observable<Event[]>
searchByType(eventType: string): Observable<Event[]>
getEventsNeedingVolunteers(): Observable<Event[]>
```

### Task 2.6: Frontend - Create Event Form Component ⏳ PENDING
**Status:** Ready to Start

**Component Features:**
- Form for creating/editing events
- Date/time picker
- Location input with map preview
- Skills selection
- Volunteer count input
- Event type selection
- Image upload
- Form validation
- Success/error messages

**File:** `frontend/src/app/components/organizer/event-form/`

### Task 2.7: Frontend - Enhance Event List Component ⏳ PENDING
**Status:** Ready to Start

**Component Features:**
- Display list of events
- Filter by location
- Filter by event type
- Filter by date range
- Search by title/description
- Pagination
- Event cards with key information
- Create/Edit/Delete buttons for organizer
- Responsive grid layout

**File:** `frontend/src/app/components/organizer/event-list/`

### Task 2.8: Frontend - Enhance Event Detail Component ⏳ PENDING
**Status:** Ready to Start

**Component Features:**
- Display full event information
- Show required skills
- Show volunteer count
- Show event status
- Publish/Cancel buttons for organizer
- Edit button for organizer
- Delete button for organizer
- Apply button for volunteers
- Map display of event location

**File:** `frontend/src/app/components/volunteer/event-detail/`

---

## 📊 API Endpoints

### Event Management Endpoints
```
POST   /api/events                           - Create event
GET    /api/events/{id}                      - Get event details
PUT    /api/events/{id}                      - Update event
DELETE /api/events/{id}                      - Delete event
POST   /api/events/{id}/publish              - Publish event
POST   /api/events/{id}/cancel               - Cancel event
```

### Event Listing & Filtering
```
GET    /api/events/upcoming/published        - Get upcoming published events (paginated)
GET    /api/events/needing-volunteers        - Get events needing volunteers
GET    /api/events/search/location?location={location} - Search by location
GET    /api/events/search/type?eventType={type}        - Filter by type
```

### Event Required Skills
```
POST   /api/events/{eventId}/required-skills           - Add required skill
GET    /api/events/{eventId}/required-skills           - Get required skills
PUT    /api/events/{eventId}/required-skills/{skillId} - Update required skill
DELETE /api/events/{eventId}/required-skills/{skillId} - Remove required skill
```

---

## 📝 API Request/Response Examples

### Create Event
```bash
POST /api/events
Content-Type: application/json
Authorization: Bearer YOUR_JWT_TOKEN

{
  "title": "Community Cleanup",
  "description": "Help us clean up the local park",
  "eventType": "Community Service",
  "location": "Central Park, New York",
  "latitude": 40.7829,
  "longitude": -73.9654,
  "eventDate": "2025-12-15T09:00:00",
  "endDate": "2025-12-15T12:00:00",
  "durationHours": 3,
  "volunteersNeeded": 20,
  "imageUrl": "https://example.com/image.jpg",
  "requiredSkillIds": [1, 2]
}

Response (201 Created):
{
  "id": 1,
  "organizerId": 1,
  "organizerName": "John Organizer",
  "title": "Community Cleanup",
  "description": "Help us clean up the local park",
  "eventType": "Community Service",
  "location": "Central Park, New York",
  "latitude": 40.7829,
  "longitude": -73.9654,
  "eventDate": "2025-12-15T09:00:00",
  "endDate": "2025-12-15T12:00:00",
  "durationHours": 3,
  "volunteersNeeded": 20,
  "volunteersConfirmed": 0,
  "status": "DRAFT",
  "imageUrl": "https://example.com/image.jpg",
  "createdAt": "2025-11-25T15:30:00"
}
```

### Publish Event
```bash
POST /api/events/1/publish
Authorization: Bearer YOUR_JWT_TOKEN

Response (200 OK):
{
  "status": "success",
  "message": "Event published successfully"
}
```

### Get Upcoming Published Events
```bash
GET /api/events/upcoming/published?page=0&size=10
Authorization: Bearer YOUR_JWT_TOKEN

Response (200 OK):
{
  "content": [
    {
      "id": 1,
      "organizerId": 1,
      "organizerName": "John Organizer",
      "title": "Community Cleanup",
      ...
    }
  ],
  "totalElements": 25,
  "totalPages": 3,
  "currentPage": 0,
  "pageSize": 10
}
```

### Add Required Skill
```bash
POST /api/events/1/required-skills
Content-Type: application/json
Authorization: Bearer YOUR_JWT_TOKEN

{
  "skillId": 1,
  "minimumProficiency": "INTERMEDIATE",
  "isMandatory": true
}

Response (201 Created):
{
  "id": 1,
  "eventId": 1,
  "skillId": 1,
  "skillName": "First Aid",
  "minimumProficiency": "INTERMEDIATE",
  "isMandatory": true,
  "createdAt": "2025-11-25T15:30:00"
}
```

---

## 🔧 Implementation Checklist

### Backend
- [ ] Enhance EventController with logging
- [ ] Add proper error handling
- [ ] Extract user from JWT token
- [ ] Create EventRequiredSkillController
- [ ] Create EventRequiredSkillDTO
- [ ] Test all endpoints
- [ ] Add validation

### Frontend
- [ ] Create Event interfaces
- [ ] Create EventService
- [ ] Create Event Form Component
- [ ] Enhance Event List Component
- [ ] Enhance Event Detail Component
- [ ] Add event filtering
- [ ] Add event search
- [ ] Test end-to-end

---

## 🧪 Testing

### Backend Testing
```bash
# Create event
curl -X POST http://localhost:8081/api/events \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "title": "Community Cleanup",
    "description": "Help us clean up",
    "eventType": "Community Service",
    "location": "Central Park",
    "latitude": 40.7829,
    "longitude": -73.9654,
    "eventDate": "2025-12-15T09:00:00",
    "volunteersNeeded": 20
  }'

# Get upcoming events
curl -X GET "http://localhost:8081/api/events/upcoming/published?page=0&size=10" \
  -H "Authorization: Bearer YOUR_TOKEN"

# Publish event
curl -X POST http://localhost:8081/api/events/1/publish \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Frontend Testing
```bash
# Start frontend
cd frontend
ng serve

# Navigate to event management
# http://localhost:4200/organizer/events
```

---

## 📚 Related Documentation

- `SPRINT_3_PLAN.md` - Overall sprint planning
- `SPRINT_3_PHASE1_COMPLETE.md` - Phase 1 details
- `SPRINT_3_IMPLEMENTATION_GUIDE.md` - Implementation guide
- `SPRINT_3_QUICK_START.md` - Quick start guide

---

## 🎯 Success Criteria

- [ ] All event CRUD operations working
- [ ] Event publishing workflow functional
- [ ] Event filtering and search working
- [ ] Required skills management working
- [ ] Frontend components created
- [ ] End-to-end integration tested
- [ ] Error handling implemented
- [ ] Logging added throughout
- [ ] Documentation updated

---

## 📞 Support

For questions or issues:
1. Check `SPRINT_3_IMPLEMENTATION_GUIDE.md`
2. Review API examples above
3. Check existing EventService implementation
4. Refer to Phase 1 for patterns and best practices

---

**Phase 2: Event Management - IN PROGRESS 🔄**
**Estimated Completion:** 1.5 weeks
**Next Phase:** Phase 3 - Application Workflow
