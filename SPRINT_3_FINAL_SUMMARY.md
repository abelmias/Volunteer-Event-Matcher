# Sprint 3: Final Summary & Testing Guide

## 🎯 Sprint 3 Complete Overview

**Status:** 50% Complete (Phases 1-2 Done, Phases 3-6 Planned)  
**Duration:** 3 weeks  
**Start Date:** 2025-11-25  
**Target Completion:** 2025-12-16

---

## ✅ Completed Phases

### Phase 1: User Profile Management ✅ 100% COMPLETE
**Backend:**
- 3 DTOs (VolunteerProfileDTO, OrganizerProfileDTO, VolunteerSkillDTO)
- ProfileService (8 methods)
- ProfileController (10 endpoints)
- Enhanced VolunteerSkillRepository

**Frontend:**
- Profile interfaces
- ProfileService (Angular)
- Profile management components

**Endpoints:** 10

### Phase 2: Event Management ✅ 100% BACKEND + 62.5% FRONTEND COMPLETE
**Backend:**
- EventController enhanced
- EventRequiredSkillDTO created
- EventService (12 methods)
- 10 REST endpoints

**Frontend:**
- Event interfaces & models
- EventService (13 methods)
- SkillService (4 methods)
- Event Form Component (complete)
- Event Management Component (enhanced with filtering & pagination)

**Endpoints:** 10

---

## ⏳ Remaining Phases (To Be Implemented)

### Phase 3: Application Workflow
**Backend Endpoints:**
```
POST   /api/applications/events/{eventId}
GET    /api/applications/volunteer/{volunteerId}
GET    /api/applications/event/{eventId}
POST   /api/applications/{id}/approve
POST   /api/applications/{id}/reject
POST   /api/applications/{id}/withdraw
PUT    /api/applications/{id}
```

**Frontend Components:**
- Application Form Component
- Application Management Component
- Application Status Component

### Phase 4: Notification System
**Backend Endpoints:**
```
GET    /api/notifications
GET    /api/notifications?unread=true
PUT    /api/notifications/{id}/read
DELETE /api/notifications/{id}
POST   /api/notifications/mark-all-read
```

**Frontend Components:**
- Notification Bell Component
- Notification Center Component
- Notification Dropdown Component

### Phase 5: Search & Filtering
**Backend Endpoints:**
```
GET /api/search/events?query={query}
GET /api/search/events/nearby?latitude={lat}&longitude={lon}&radius={km}
GET /api/search/events?location={location}&type={type}&date={date}
```

**Frontend Components:**
- Search Bar Component
- Advanced Filter Component
- Map Search Component

### Phase 6: Route Guards & Security
**Frontend Implementation:**
- AuthGuard
- VolunteerGuard
- OrganizerGuard
- JWT Interceptor
- Protected routes

---

## 🧪 COMPREHENSIVE TESTING GUIDE

### ✅ What to Test While Developing

#### 1. AUTHENTICATION (Test First!)

**Register as Volunteer:**
```
URL: http://localhost:4200/auth/register
1. Click "Register as Volunteer"
2. Fill form:
   - First Name: John
   - Last Name Doe
   - Username: john_volunteer
   - Email: john@example.com
   - Password: password123
   - Confirm: password123
3. Click Register
Expected: Success message, redirect to login
```

**Register as Organizer:**
```
URL: http://localhost:4200/auth/register
1. Click "Register as Organizer"
2. Fill form:
   - First Name: Jane
   - Last Name: Smith
   - Username: jane_organizer
   - Email: jane@example.com
   - Password: password123
   - Confirm: password123
3. Click Register
Expected: Success message, redirect to login
```

**Login as Volunteer:**
```
URL: http://localhost:4200/auth/login
1. Username: volunteer1
2. Password: password123
3. Click Login
Expected: Redirect to /volunteer/dashboard
Check: Token in localStorage (F12 > Application > LocalStorage)
```

**Login as Organizer:**
```
URL: http://localhost:4200/auth/login
1. Username: organizer1
2. Password: password123
3. Click Login
Expected: Redirect to /organizer/dashboard
Check: Token in localStorage
```

**Test Invalid Login:**
```
1. Username: invalid
2. Password: wrong
3. Click Login
Expected: Error message "Invalid credentials"
```

---

#### 2. PROFILE MANAGEMENT

**Volunteer Profile:**
```
URL: http://localhost:4200/volunteer/profile
1. View profile information
2. Edit profile:
   - Years of Experience: 3
   - Availability: AVAILABLE
   - Bio: "Passionate about volunteering"
3. Click Save
Expected: Profile updated successfully

4. Add Skills:
   - Select "First Aid"
   - Proficiency: INTERMEDIATE
   - Click Add
Expected: Skill added to list

5. Add another skill
6. Remove a skill
Expected: Skill removed from list
```

**Organizer Profile:**
```
URL: http://localhost:4200/organizer/profile
1. View profile information
2. Edit profile:
   - Organization Name: "Community Helpers"
   - Description: "Non-profit organization"
   - Website: "https://example.com"
   - Phone: "555-1234"
3. Click Save
Expected: Profile updated successfully
```

---

#### 3. EVENT MANAGEMENT (Most Important!)

**Create Event (Organizer):**
```
URL: http://localhost:4200/organizer/events
1. Click "Create New Event"
2. Fill form:
   - Title: "Community Park Cleanup"
   - Description: "Help us clean up the local park and make it beautiful"
   - Event Type: "Community Service"
   - Location: "Central Park, New York"
   - Latitude: 40.7829
   - Longitude: -73.9654
   - Event Date: 2025-12-15 09:00
   - End Date: 2025-12-15 12:00
   - Duration: 3 hours
   - Volunteers Needed: 20
   - Image URL: (optional)
   - Required Skills: Select "First Aid", "Leadership"
3. Click "Create Event"
Expected: Success message, event appears in list with DRAFT status
```

**Publish Event:**
```
1. Find the event you created
2. Click "Publish" button
Expected: Event status changes to PUBLISHED
Check: Event now visible in volunteer's event list
```

**Edit Event:**
```
1. Click "Edit" on an event
2. Change title to "Park Cleanup - Updated"
3. Change volunteers needed to 25
4. Click "Update Event"
Expected: Event updated successfully
```

**Delete Event:**
```
1. Click "Delete" on an event
2. Confirm deletion
Expected: Event removed from list
```

---

#### 4. EVENT LISTING & FILTERING (Volunteer)

**View Events:**
```
URL: http://localhost:4200/volunteer/events
Expected: List of published events displayed
Check: Event cards show:
- Title
- Description
- Location
- Date
- Volunteers needed
- Organizer name
- Apply button
```

**Search Events:**
```
1. Enter search query: "cleanup"
2. Press Enter or click Search
Expected: Only events with "cleanup" in title/description shown
```

**Filter by Location:**
```
1. Select location filter: "New York"
2. Click Apply
Expected: Only events in New York shown
```

**Filter by Event Type:**
```
1. Select type filter: "Community Service"
2. Click Apply
Expected: Only Community Service events shown
```

**Pagination:**
```
1. Scroll to bottom
2. Click "Next Page"
Expected: Next 10 events displayed
3. Click "Previous Page"
Expected: Previous events displayed
```

---

#### 5. EVENT DETAILS & APPLICATION

**View Event Details:**
```
URL: http://localhost:4200/volunteer/events/1 (or click event)
Expected: Full event information displayed:
- Title, description, date, location
- Volunteers needed vs confirmed
- Required skills
- Organizer information
- Apply button
- Map showing location
```

**Apply to Event (Volunteer):**
```
1. Click "Apply" button
2. Enter motivation: "I want to help clean up the park"
3. Click "Submit Application"
Expected: Success message
Check: Application appears in "My Applications" with PENDING status
```

**View My Applications:**
```
URL: http://localhost:4200/volunteer/applications
Expected: List of applications showing:
- Event name
- Status (PENDING, APPROVED, REJECTED, WITHDRAWN)
- Application date
- Organizer feedback (if approved/rejected)
```

**Withdraw Application:**
```
1. Find a PENDING application
2. Click "Withdraw"
3. Confirm
Expected: Application status changes to WITHDRAWN
```

---

#### 6. APPLICATION MANAGEMENT (Organizer)

**View Applications:**
```
URL: http://localhost:4200/organizer/applications
Expected: List of all applications for organizer's events
Showing:
- Event name
- Volunteer name
- Status
- Application date
- Action buttons
```

**Approve Application:**
```
1. Find a PENDING application
2. Click "Approve"
3. (Optional) Add feedback: "Great volunteer!"
4. Click "Confirm"
Expected: Application status changes to APPROVED
Check: Volunteer receives notification
```

**Reject Application:**
```
1. Find a PENDING application
2. Click "Reject"
3. Add reason: "We have enough volunteers"
4. Click "Confirm"
Expected: Application status changes to REJECTED
Check: Volunteer receives notification
```

**Add Feedback/Rating:**
```
1. Find an APPROVED application
2. Click "Add Feedback"
3. Rating: 5 stars
4. Feedback: "Excellent work!"
5. Click "Save"
Expected: Feedback saved and displayed
```

---

#### 7. NOTIFICATIONS

**Check Notifications:**
```
1. Look for notification bell icon (top right)
2. Check unread count
3. Click bell to open dropdown
Expected: Recent notifications displayed
```

**Mark as Read:**
```
1. Click on a notification
Expected: Notification marked as read
Check: Unread count decreases
```

**View All Notifications:**
```
1. Click "View All" in notification dropdown
URL: http://localhost:4200/notifications
Expected: All notifications displayed with:
- Type (Application, Approval, etc.)
- Message
- Date
- Read/Unread status
```

**Delete Notification:**
```
1. Hover over notification
2. Click delete icon
Expected: Notification removed
```

---

#### 8. SEARCH & FILTERING (Advanced)

**Search by Title:**
```
1. Enter search: "cleanup"
Expected: Events with "cleanup" in title shown
```

**Search by Description:**
```
1. Enter search: "park"
Expected: Events with "park" in description shown
```

**Filter by Multiple Criteria:**
```
1. Location: "New York"
2. Event Type: "Community Service"
3. Date Range: 2025-12-01 to 2025-12-31
4. Click "Apply Filters"
Expected: Events matching all criteria shown
```

**Location-Based Search:**
```
1. Allow location access when prompted
2. Set radius: 5 km
3. Click "Search Nearby"
Expected: Events within 5 km displayed on map
```

---

#### 9. ROUTE GUARDS & SECURITY

**Test Unauthorized Access:**
```
1. Logout
2. Try accessing: http://localhost:4200/organizer/dashboard
Expected: Redirect to login page
```

**Test Role-Based Access:**
```
1. Login as Volunteer
2. Try accessing: http://localhost:4200/organizer/dashboard
Expected: Redirect to unauthorized page or volunteer dashboard
```

**Test JWT Token:**
```
1. Login
2. Open DevTools (F12)
3. Go to Application > LocalStorage
4. Check for 'token' key
Expected: JWT token present
5. Refresh page
Expected: Still logged in (token persists)
6. Logout
Expected: Token removed from localStorage
```

**Check Authorization Header:**
```
1. Login
2. Open DevTools > Network tab
3. Make any API call (e.g., load events)
4. Check request headers
Expected: Authorization: Bearer <token> present
```

---

#### 10. ERROR HANDLING

**Form Validation:**
```
1. Try submitting empty form
Expected: Validation errors for required fields

2. Enter invalid email
Expected: Email validation error

3. Enter password < 6 characters
Expected: Password length validation error
```

**API Errors:**
```
1. Disconnect internet
2. Try to load events
Expected: Error message displayed

3. Reconnect internet
4. Try again
Expected: Data loads successfully
```

**Not Found Errors:**
```
1. Try accessing: http://localhost:4200/events/99999
Expected: 404 error message or redirect
```

---

#### 11. RESPONSIVE DESIGN

**Mobile (375px):**
```
1. Open DevTools (F12)
2. Toggle device toolbar
3. Select iPhone SE (375x667)
Expected: Layout adapts, no horizontal scroll
Check:
- Navigation menu collapses
- Buttons are clickable
- Forms are readable
- Cards stack vertically
```

**Tablet (768px):**
```
1. Select iPad (768x1024)
Expected: Layout adapts for tablet
Check:
- Two-column layout where appropriate
- Touch-friendly buttons
```

**Desktop (1920px):**
```
1. Full screen on desktop
Expected: Full layout displayed
Check:
- Multi-column layouts
- Proper spacing
- All features visible
```

---

#### 12. PERFORMANCE

**Loading Times:**
```
1. Open DevTools > Performance
2. Load events list
Expected: Loads in < 2 seconds

3. Apply filter
Expected: Filters in < 1 second

4. Submit form
Expected: Submits in < 2 seconds
```

**Network Requests:**
```
1. Open DevTools > Network
2. Perform various actions
Expected: No failed requests (404, 500)
Check: All requests return 200, 201, etc.
```

---

## 🎯 Testing Priority Order

### Day 1: Must Test
1. ✅ Register (Volunteer & Organizer)
2. ✅ Login (both roles)
3. ✅ Profile viewing/editing
4. ✅ Event creation
5. ✅ Event publishing

### Day 2: Should Test
6. ✅ Event listing & filtering
7. ✅ Event search
8. ✅ Apply to event
9. ✅ View applications
10. ✅ Approve/reject applications

### Day 3: Nice to Test
11. ✅ Notifications
12. ✅ Advanced search
13. ✅ Route guards
14. ✅ Responsive design
15. ✅ Error handling

---

## 🐛 Common Issues to Check

**Issue: Login not working**
- Check: Backend running on port 8081
- Check: Credentials are correct (organizer1/password123, volunteer1/password123)
- Check: Password hash is correct in DataSeeder
- Check: JWT token generation is working

**Issue: Events not loading**
- Check: Backend API is running
- Check: EventService is calling correct endpoint
- Check: User is authenticated (token present)
- Check: Events exist in database

**Issue: Applications not saving**
- Check: VolunteerApplicationService is implemented
- Check: Database has VolunteerApplication table
- Check: User is authenticated

**Issue: Notifications not showing**
- Check: NotificationService is implemented
- Check: Notifications are being created
- Check: Frontend is polling/listening for notifications

---

## ✅ Success Checklist

- [ ] Can register as volunteer
- [ ] Can register as organizer
- [ ] Can login with both roles
- [ ] Can view and edit profile
- [ ] Can add/remove skills
- [ ] Can create event
- [ ] Can publish event
- [ ] Can view events list
- [ ] Can filter events
- [ ] Can search events
- [ ] Can view event details
- [ ] Can apply to event
- [ ] Can view applications
- [ ] Can approve/reject applications
- [ ] Can receive notifications
- [ ] Can mark notifications as read
- [ ] Cannot access unauthorized routes
- [ ] Token persists after refresh
- [ ] Responsive on mobile
- [ ] No console errors
- [ ] All API calls successful

---

## 📞 Quick Reference

**Backend:**
- URL: `http://localhost:8081/api`
- Database: H2 (in-memory)
- Port: 8081

**Frontend:**
- URL: `http://localhost:4200`
- Port: 4200

**Test Credentials:**
- Organizer: `organizer1` / `password123`
- Volunteer: `volunteer1` / `password123`

**Key Files:**
- Backend: `backend/src/main/java/com/volunteer/`
- Frontend: `frontend/src/app/`
- Models: `frontend/src/app/models/`
- Services: `frontend/src/app/services/`
- Components: `frontend/src/app/components/`

---

## 🚀 Next Steps

1. **Complete Phase 2 Frontend** (Event List HTML & Event Detail)
2. **Implement Phase 3** (Application Workflow)
3. **Implement Phase 4** (Notifications)
4. **Implement Phase 5** (Search & Filtering)
5. **Implement Phase 6** (Route Guards & Security)
6. **Full Testing** (All features)
7. **Bug Fixes** (Based on testing)
8. **Deployment** (To production)

---

**Sprint 3 is on track! Start testing and let me know what issues you find.** 🎯
