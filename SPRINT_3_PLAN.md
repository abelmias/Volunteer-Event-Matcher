# Sprint 3: Frontend-Backend Integration & Enhanced Features

## 🎯 Sprint 3 Objectives

### Primary Goals
1. **Complete Frontend-Backend Integration** - Connect all frontend services to backend APIs
2. **Implement User Profile Management** - Create/edit volunteer and organizer profiles
3. **Add Advanced Event Features** - Event creation, editing, publishing, and filtering
4. **Implement Application Workflow** - Apply, approve, reject, and withdraw applications
5. **Build Notification System** - Real-time notifications for users
6. **Add Search & Filtering** - Advanced search with location-based filtering

### Secondary Goals
1. **Implement Route Guards** - Protect routes based on authentication and roles
2. **Add Error Handling** - Comprehensive error messages and logging
3. **Optimize Performance** - Pagination, lazy loading, caching
4. **Add Form Validation** - Backend validation with frontend feedback
5. **Implement Loading States** - Better UX with loading indicators

---

## 📋 Detailed Sprint 3 Tasks

### Phase 1: User Profile Management (Week 1)

#### Task 1.1: Volunteer Profile Component
- **Frontend:** Create volunteer profile view/edit component
- **Backend:** Implement VolunteerProfileController endpoints
- **Endpoints:**
  - `GET /api/volunteer-profiles/{userId}` - Get profile
  - `POST /api/volunteer-profiles` - Create profile
  - `PUT /api/volunteer-profiles/{id}` - Update profile
  - `GET /api/volunteer-profiles/{userId}/skills` - Get skills
  - `POST /api/volunteer-profiles/{userId}/skills` - Add skill
  - `DELETE /api/volunteer-profiles/{userId}/skills/{skillId}` - Remove skill

#### Task 1.2: Organizer Profile Component
- **Frontend:** Create organizer profile view/edit component
- **Backend:** Implement OrganizerProfileController endpoints
- **Endpoints:**
  - `GET /api/organizer-profiles/{userId}` - Get profile
  - `POST /api/organizer-profiles` - Create profile
  - `PUT /api/organizer-profiles/{id}` - Update profile

#### Task 1.3: Skills Management
- **Frontend:** Skills selection component with proficiency levels
- **Backend:** SkillController endpoints
- **Endpoints:**
  - `GET /api/skills` - Get all skills
  - `GET /api/skills?category={category}` - Filter by category
  - `POST /api/skills` - Create skill (admin only)

---

### Phase 2: Event Management (Week 1-2)

#### Task 2.1: Event Creation & Editing
- **Frontend:** Event form component with validation
- **Backend:** EventController endpoints
- **Endpoints:**
  - `POST /api/events` - Create event
  - `PUT /api/events/{id}` - Update event
  - `DELETE /api/events/{id}` - Delete event
  - `GET /api/events/{id}` - Get event details
  - `POST /api/events/{id}/publish` - Publish event

#### Task 2.2: Event Listing & Filtering
- **Frontend:** Enhanced event list with filters and search
- **Backend:** Event query endpoints
- **Endpoints:**
  - `GET /api/events` - List all events (with pagination)
  - `GET /api/events/upcoming/published` - Get upcoming published events
  - `GET /api/events?location={location}&type={type}&date={date}` - Filter events
  - `GET /api/events/organizer/{organizerId}` - Get organizer's events

#### Task 2.3: Event Required Skills
- **Frontend:** Skill requirements UI in event form
- **Backend:** EventRequiredSkillController
- **Endpoints:**
  - `POST /api/events/{id}/required-skills` - Add required skill
  - `DELETE /api/events/{id}/required-skills/{skillId}` - Remove required skill

---

### Phase 3: Application Workflow (Week 2)

#### Task 3.1: Volunteer Application
- **Frontend:** Apply button and application form
- **Backend:** ApplicationController endpoints
- **Endpoints:**
  - `POST /api/applications/events/{eventId}` - Apply to event
  - `GET /api/applications/volunteer/{volunteerId}` - Get volunteer's applications
  - `POST /api/applications/{id}/withdraw` - Withdraw application

#### Task 3.2: Application Management (Organizer)
- **Frontend:** Applications review component with approve/reject
- **Backend:** Application approval/rejection endpoints
- **Endpoints:**
  - `GET /api/applications/event/{eventId}` - Get event applications
  - `POST /api/applications/{id}/approve` - Approve application
  - `POST /api/applications/{id}/reject` - Reject application
  - `PUT /api/applications/{id}` - Update application (add feedback/rating)

---

### Phase 4: Notification System (Week 2-3)

#### Task 4.1: Notification Backend
- **Backend:** NotificationController endpoints
- **Endpoints:**
  - `GET /api/notifications` - Get user notifications
  - `GET /api/notifications?unread=true` - Get unread notifications
  - `PUT /api/notifications/{id}/read` - Mark as read
  - `DELETE /api/notifications/{id}` - Delete notification
  - `POST /api/notifications/mark-all-read` - Mark all as read

#### Task 4.2: Notification Frontend
- **Frontend:** Notification bell with dropdown
- **Frontend:** Notification center page
- **Features:**
  - Real-time notification count
  - Mark as read functionality
  - Delete notifications
  - Filter by type

---

### Phase 5: Search & Filtering (Week 3)

#### Task 5.1: Advanced Search
- **Frontend:** Search component with multiple filters
- **Backend:** Enhanced event query endpoints
- **Filters:**
  - Location (with distance radius)
  - Event type
  - Date range
  - Skills required
  - Availability

#### Task 5.2: Location-Based Search
- **Frontend:** Map integration with Leaflet
- **Backend:** Geolocation endpoints
- **Endpoints:**
  - `GET /api/events/nearby?latitude={lat}&longitude={lon}&radius={km}` - Nearby events

---

### Phase 6: Route Guards & Security (Week 3)

#### Task 6.1: Authentication Guard
- **Frontend:** AuthGuard implementation
- **Features:**
  - Check if user is logged in
  - Redirect to login if not authenticated
  - Store return URL for post-login redirect

#### Task 6.2: Role-Based Guards
- **Frontend:** RoleGuard implementation
- **Features:**
  - VolunteerGuard - Only volunteers can access
  - OrganizerGuard - Only organizers can access
  - AdminGuard - Only admins can access

#### Task 6.3: JWT Interceptor
- **Frontend:** JWT token injection in all requests
- **Features:**
  - Add Authorization header to all requests
  - Handle 401 responses (token expired)
  - Refresh token if needed

---

## 🔧 Technical Implementation Details

### Frontend Services to Implement

1. **ProfileService**
   ```typescript
   getVolunteerProfile(userId: number): Observable<VolunteerProfile>
   createVolunteerProfile(profile: VolunteerProfile): Observable<VolunteerProfile>
   updateVolunteerProfile(id: number, profile: VolunteerProfile): Observable<VolunteerProfile>
   getOrganizerProfile(userId: number): Observable<OrganizerProfile>
   createOrganizerProfile(profile: OrganizerProfile): Observable<OrganizerProfile>
   updateOrganizerProfile(id: number, profile: OrganizerProfile): Observable<OrganizerProfile>
   ```

2. **SkillService**
   ```typescript
   getAllSkills(): Observable<Skill[]>
   getSkillsByCategory(category: string): Observable<Skill[]>
   createSkill(skill: Skill): Observable<Skill>
   addVolunteerSkill(volunteerId: number, skillId: number, proficiency: string): Observable<VolunteerSkill>
   removeVolunteerSkill(volunteerId: number, skillId: number): Observable<void>
   ```

3. **EventService** (Enhanced)
   ```typescript
   createEvent(event: Event): Observable<Event>
   updateEvent(id: number, event: Event): Observable<Event>
   deleteEvent(id: number): Observable<void>
   publishEvent(id: number): Observable<Event>
   getEventsByOrganizer(organizerId: number): Observable<Event[]>
   searchEvents(filters: EventFilter): Observable<Event[]>
   getNearbyEvents(latitude: number, longitude: number, radius: number): Observable<Event[]>
   ```

4. **ApplicationService** (Enhanced)
   ```typescript
   applyToEvent(eventId: number, motivation: string): Observable<Application>
   getVolunteerApplications(volunteerId: number): Observable<Application[]>
   getEventApplications(eventId: number): Observable<Application[]>
   approveApplication(applicationId: number): Observable<Application>
   rejectApplication(applicationId: number, reason: string): Observable<Application>
   withdrawApplication(applicationId: number): Observable<void>
   ```

5. **NotificationService** (Enhanced)
   ```typescript
   getNotifications(): Observable<Notification[]>
   getUnreadNotifications(): Observable<Notification[]>
   markAsRead(notificationId: number): Observable<Notification>
   markAllAsRead(): Observable<void>
   deleteNotification(notificationId: number): Observable<void>
   ```

### Backend Controllers to Implement

1. **VolunteerProfileController**
2. **OrganizerProfileController**
3. **SkillController**
4. **EventController** (Enhanced)
5. **ApplicationController** (Enhanced)
6. **NotificationController** (Enhanced)

### Frontend Components to Create

1. **Volunteer Profile Component**
   - View/Edit profile
   - Skills management
   - Availability settings

2. **Organizer Profile Component**
   - View/Edit profile
   - Organization details
   - Verification status

3. **Event Form Component**
   - Create/Edit event
   - Required skills selection
   - Date/time picker
   - Location picker

4. **Event List Component** (Enhanced)
   - Advanced filters
   - Search functionality
   - Pagination
   - Map view option

5. **Application Management Component**
   - List of applications
   - Approve/Reject buttons
   - Feedback/Rating form

6. **Notification Center Component** (Enhanced)
   - Notification list
   - Mark as read
   - Delete notifications
   - Filter by type

---

## 📊 Acceptance Criteria

### User Profile Management
- [ ] Volunteers can create and edit their profiles
- [ ] Volunteers can add/remove skills with proficiency levels
- [ ] Organizers can create and edit their profiles
- [ ] Profile data persists in database
- [ ] Form validation works correctly

### Event Management
- [ ] Organizers can create events with all details
- [ ] Organizers can edit and delete their events
- [ ] Events can be published/unpublished
- [ ] Event list shows all published events
- [ ] Filtering by location, type, and date works
- [ ] Event details page shows all information

### Application Workflow
- [ ] Volunteers can apply to events
- [ ] Organizers can see applications for their events
- [ ] Organizers can approve/reject applications
- [ ] Volunteers can withdraw applications
- [ ] Application status updates correctly

### Notifications
- [ ] Users receive notifications for important events
- [ ] Notifications can be marked as read
- [ ] Unread count is displayed correctly
- [ ] Notifications can be deleted
- [ ] Notification center shows all notifications

### Search & Filtering
- [ ] Users can search events by title/description
- [ ] Users can filter by location
- [ ] Users can filter by event type
- [ ] Users can filter by date range
- [ ] Location-based search works with map

### Security
- [ ] Unauthenticated users cannot access protected routes
- [ ] Volunteers cannot access organizer routes
- [ ] Organizers cannot access volunteer-only routes
- [ ] JWT tokens are properly validated
- [ ] Expired tokens trigger re-authentication

---

## 🚀 Implementation Timeline

| Week | Phase | Tasks | Status |
|------|-------|-------|--------|
| Week 1 | User Profiles | 1.1, 1.2, 1.3 | 🔄 In Progress |
| Week 1-2 | Event Management | 2.1, 2.2, 2.3 | ⏳ Pending |
| Week 2 | Applications | 3.1, 3.2 | ⏳ Pending |
| Week 2-3 | Notifications | 4.1, 4.2 | ⏳ Pending |
| Week 3 | Search & Filtering | 5.1, 5.2 | ⏳ Pending |
| Week 3 | Security | 6.1, 6.2, 6.3 | ⏳ Pending |

---

## 📝 Notes

- All endpoints should return proper HTTP status codes (200, 201, 400, 401, 403, 404, 500)
- All endpoints should include error messages in response
- Frontend should handle all error cases gracefully
- All forms should have client-side and server-side validation
- All API responses should be typed with TypeScript interfaces
- All database operations should be transactional where needed

---

**Sprint 3 Planning - COMPLETE ✅**
**Target Duration: 3 weeks**
**Status: Ready to Start 🚀**
