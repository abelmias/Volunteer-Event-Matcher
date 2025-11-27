# Sprint 3 - Phases 3-6: Complete Implementation Guide

## 🎯 Quick Overview

**Phase 3:** Application Workflow (Apply, Approve, Reject)  
**Phase 4:** Notification System (Real-time notifications)  
**Phase 5:** Search & Filtering (Advanced search with location)  
**Phase 6:** Route Guards & Security (AuthGuard, RoleGuard, JWT Interceptor)

---

## 📋 Phase 3: Application Workflow

### Backend Implementation

**VolunteerApplicationController Endpoints:**
```java
POST   /api/applications/events/{eventId}        // Apply to event
GET    /api/applications/volunteer/{volunteerId} // Get volunteer's applications
GET    /api/applications/event/{eventId}         // Get event applications
POST   /api/applications/{id}/approve            // Approve application
POST   /api/applications/{id}/reject             // Reject application
POST   /api/applications/{id}/withdraw           // Withdraw application
PUT    /api/applications/{id}                    // Update with feedback/rating
```

**Backend Service Methods:**
```java
applyToEvent(eventId, volunteerId, motivation)
getVolunteerApplications(volunteerId)
getEventApplications(eventId)
approveApplication(applicationId)
rejectApplication(applicationId, reason)
withdrawApplication(applicationId)
updateApplicationWithFeedback(applicationId, feedback, rating)
```

### Frontend Implementation

**ApplicationService Methods:**
```typescript
applyToEvent(eventId: number, motivation: string): Observable<Application>
getVolunteerApplications(volunteerId: number): Observable<Application[]>
getEventApplications(eventId: number): Observable<Application[]>
approveApplication(applicationId: number): Observable<Application>
rejectApplication(applicationId: number, reason: string): Observable<Application>
withdrawApplication(applicationId: number): Observable<void>
updateApplicationWithFeedback(applicationId: number, feedback: any): Observable<Application>
```

**Components:**
- Application Form Component (for volunteers to apply)
- Application Management Component (for organizers to review)
- Application Status Component (for volunteers to track)

---

## 📋 Phase 4: Notification System

### Backend Implementation

**NotificationController Endpoints:**
```java
GET    /api/notifications                 // Get all notifications
GET    /api/notifications?unread=true     // Get unread only
PUT    /api/notifications/{id}/read       // Mark as read
DELETE /api/notifications/{id}            // Delete notification
POST   /api/notifications/mark-all-read   // Mark all as read
```

**Backend Service Methods:**
```java
getNotifications(userId)
getUnreadNotifications(userId)
markAsRead(notificationId)
markAllAsRead(userId)
deleteNotification(notificationId)
createNotification(userId, type, title, message)
```

### Frontend Implementation

**NotificationService Methods:**
```typescript
getNotifications(): Observable<Notification[]>
getUnreadNotifications(): Observable<Notification[]>
markAsRead(notificationId: number): Observable<Notification>
markAllAsRead(): Observable<void>
deleteNotification(notificationId: number): Observable<void>
```

**Components:**
- Notification Bell Component (shows unread count)
- Notification Center Component (displays all notifications)
- Notification Dropdown Component (quick view)

---

## 📋 Phase 5: Search & Filtering

### Backend Implementation

**SearchController Endpoints:**
```java
GET /api/search/events?query={query}                              // Search by title/description
GET /api/search/events/nearby?latitude={lat}&longitude={lon}&radius={km} // Nearby events
GET /api/search/events?location={location}&type={type}&date={date} // Advanced filter
```

**Backend Service Methods:**
```java
searchEventsByQuery(query)
searchEventsByLocation(location, radius, latitude, longitude)
filterEventsByMultipleCriteria(location, eventType, dateRange)
```

### Frontend Implementation

**SearchService Methods:**
```typescript
searchEvents(query: string): Observable<Event[]>
searchNearbyEvents(latitude: number, longitude: number, radius: number): Observable<Event[]>
filterEvents(filters: EventFilter): Observable<Event[]>
```

**Components:**
- Search Bar Component (global search)
- Advanced Filter Component (location, type, date)
- Map Search Component (location-based search)

---

## 📋 Phase 6: Route Guards & Security

### Frontend Implementation

**AuthGuard:**
```typescript
canActivate(route, state): boolean {
  if (authService.isLoggedIn()) {
    return true;
  }
  router.navigate(['/auth/login']);
  return false;
}
```

**RoleGuards:**
```typescript
// VolunteerGuard
canActivate(route, state): boolean {
  if (authService.currentUserValue?.role === 'VOLUNTEER') {
    return true;
  }
  router.navigate(['/unauthorized']);
  return false;
}

// OrganizerGuard
canActivate(route, state): boolean {
  if (authService.currentUserValue?.role === 'ORGANIZER') {
    return true;
  }
  router.navigate(['/unauthorized']);
  return false;
}
```

**JWT Interceptor:**
```typescript
intercept(req, next): Observable<HttpEvent<any>> {
  const token = localStorage.getItem('token');
  if (token) {
    req = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
  }
  return next.handle(req);
}
```

**Route Configuration:**
```typescript
const routes = [
  { path: 'organizer/dashboard', component: OrganizerDashboard, canActivate: [AuthGuard, OrganizerGuard] },
  { path: 'volunteer/dashboard', component: VolunteerDashboard, canActivate: [AuthGuard, VolunteerGuard] },
  { path: 'auth/login', component: LoginComponent },
  { path: 'auth/register', component: RegisterComponent }
];
```

---

## 🧪 Testing Checklist for Web App

### 1. Authentication Testing

**Register Flow:**
- [ ] Register as Volunteer
  - Username: `test_volunteer`
  - Email: `volunteer@test.com`
  - Password: `password123`
  - First Name: `John`
  - Last Name: `Doe`
  - Expected: Redirect to login

- [ ] Register as Organizer
  - Username: `test_organizer`
  - Email: `organizer@test.com`
  - Password: `password123`
  - First Name: `Jane`
  - Last Name: `Smith`
  - Expected: Redirect to login

**Login Flow:**
- [ ] Login as Volunteer
  - Username: `volunteer1`
  - Password: `password123`
  - Expected: Redirect to `/volunteer/dashboard`

- [ ] Login as Organizer
  - Username: `organizer1`
  - Password: `password123`
  - Expected: Redirect to `/organizer/dashboard`

- [ ] Invalid credentials
  - Username: `invalid`
  - Password: `wrong`
  - Expected: Error message displayed

### 2. Profile Management Testing

**Volunteer Profile:**
- [ ] View profile
- [ ] Edit profile (years of experience, availability, bio)
- [ ] Add skills
  - Select multiple skills
  - Set proficiency levels (BEGINNER, INTERMEDIATE, ADVANCED, EXPERT)
  - Expected: Skills saved and displayed

- [ ] Remove skills
  - Expected: Skill removed from list

**Organizer Profile:**
- [ ] View profile
- [ ] Edit profile (organization name, description, website, phone)
- [ ] Expected: Profile updated successfully

### 3. Event Management Testing

**Create Event (Organizer):**
- [ ] Fill event form
  - Title: `Community Cleanup`
  - Description: `Help us clean up the local park`
  - Event Type: `Community Service`
  - Location: `Central Park, New York`
  - Date: `2025-12-15`
  - Volunteers Needed: `20`
  - Select required skills
  - Expected: Event created in DRAFT status

- [ ] Publish event
  - Expected: Event status changes to PUBLISHED

- [ ] Edit event
  - Change title, description, volunteers needed
  - Expected: Event updated successfully

- [ ] Delete event
  - Expected: Event removed from list

**Event Listing (Volunteer):**
- [ ] View all published events
  - Expected: List of events displayed

- [ ] Search events
  - Search by title: `cleanup`
  - Expected: Matching events displayed

- [ ] Filter events
  - By location: `New York`
  - By type: `Community Service`
  - Expected: Filtered results displayed

- [ ] Pagination
  - Click next page
  - Expected: Next 10 events displayed

**Event Details (Volunteer):**
- [ ] View event details
  - Title, description, date, location, volunteers needed
  - Required skills
  - Organizer information
  - Expected: All details displayed

- [ ] Apply to event
  - Add motivation: `I want to help clean up the park`
  - Expected: Application submitted, status shows PENDING

### 4. Application Workflow Testing

**Volunteer Side:**
- [ ] View my applications
  - Expected: List of applications with status (PENDING, APPROVED, REJECTED, WITHDRAWN)

- [ ] Withdraw application
  - Expected: Application status changes to WITHDRAWN

- [ ] View application details
  - Expected: Motivation, status, organizer feedback displayed

**Organizer Side:**
- [ ] View applications for event
  - Expected: List of volunteers who applied

- [ ] Approve application
  - Expected: Application status changes to APPROVED

- [ ] Reject application
  - Add reason: `We have enough volunteers`
  - Expected: Application status changes to REJECTED

- [ ] Add feedback/rating
  - Rating: `5 stars`
  - Feedback: `Great volunteer!`
  - Expected: Feedback saved and displayed

### 5. Notification System Testing

**Notifications Triggered:**
- [ ] Event application submitted
  - Organizer receives notification
  - Expected: Notification appears in notification center

- [ ] Application approved
  - Volunteer receives notification
  - Expected: Notification appears

- [ ] Application rejected
  - Volunteer receives notification
  - Expected: Notification appears

**Notification Management:**
- [ ] View all notifications
  - Expected: List of notifications displayed

- [ ] Mark as read
  - Click notification
  - Expected: Notification marked as read

- [ ] Mark all as read
  - Expected: All notifications marked as read

- [ ] Delete notification
  - Expected: Notification removed

- [ ] Unread count
  - Expected: Bell shows number of unread notifications

### 6. Search & Filtering Testing

**Basic Search:**
- [ ] Search by event title
  - Search: `cleanup`
  - Expected: Matching events displayed

- [ ] Search by description
  - Search: `park`
  - Expected: Events with matching description displayed

**Advanced Filtering:**
- [ ] Filter by location
  - Location: `New York`
  - Expected: Events in New York displayed

- [ ] Filter by event type
  - Type: `Community Service`
  - Expected: Events of that type displayed

- [ ] Filter by date range
  - From: `2025-12-01`
  - To: `2025-12-31`
  - Expected: Events in date range displayed

**Location-Based Search:**
- [ ] Search nearby events
  - Allow location access
  - Radius: `5 km`
  - Expected: Events within 5 km displayed on map

### 7. Route Guards & Security Testing

**Authentication Guard:**
- [ ] Try accessing `/organizer/dashboard` without login
  - Expected: Redirect to `/auth/login`

- [ ] Try accessing `/volunteer/dashboard` without login
  - Expected: Redirect to `/auth/login`

**Role-Based Guards:**
- [ ] Login as Volunteer, try accessing `/organizer/dashboard`
  - Expected: Redirect to unauthorized page

- [ ] Login as Organizer, try accessing `/volunteer/dashboard`
  - Expected: Redirect to unauthorized page

**JWT Token:**
- [ ] Check Authorization header in network requests
  - Expected: `Authorization: Bearer <token>` present

- [ ] Token persists after page refresh
  - Expected: Still logged in

- [ ] Logout clears token
  - Expected: Token removed from localStorage

### 8. Error Handling Testing

**Form Validation:**
- [ ] Submit empty form
  - Expected: Validation errors displayed

- [ ] Enter invalid email
  - Expected: Email validation error

- [ ] Enter password < 6 characters
  - Expected: Password validation error

**API Error Handling:**
- [ ] Network error during login
  - Expected: Error message displayed

- [ ] Server error (500)
  - Expected: Error message displayed

- [ ] Unauthorized error (401)
  - Expected: Redirect to login

- [ ] Forbidden error (403)
  - Expected: Unauthorized message

### 9. UI/UX Testing

**Responsive Design:**
- [ ] Test on mobile (375px width)
  - Expected: Layout adapts, no horizontal scroll

- [ ] Test on tablet (768px width)
  - Expected: Layout adapts properly

- [ ] Test on desktop (1920px width)
  - Expected: Full layout displayed

**Loading States:**
- [ ] Loading spinner appears during API calls
  - Expected: Spinner visible, buttons disabled

- [ ] Loading completes
  - Expected: Spinner disappears, data displayed

**Animations:**
- [ ] Button hover effects
  - Expected: Smooth transitions

- [ ] Form validation feedback
  - Expected: Error messages appear smoothly

### 10. Data Persistence Testing

**LocalStorage:**
- [ ] Token saved after login
  - Expected: `localStorage.getItem('token')` returns token

- [ ] User info saved
  - Expected: `localStorage.getItem('currentUser')` returns user data

- [ ] Data persists after refresh
  - Expected: Still logged in after F5

**Database:**
- [ ] Create event persists
  - Expected: Event still exists after page refresh

- [ ] Apply to event persists
  - Expected: Application still exists

- [ ] Approve application persists
  - Expected: Application status still APPROVED

---

## 🚀 Testing Workflow

### Day 1: Authentication & Profiles
1. Test registration (volunteer & organizer)
2. Test login (both roles)
3. Test profile viewing/editing
4. Test skill management

### Day 2: Event Management
1. Test event creation
2. Test event listing
3. Test event filtering/search
4. Test event editing/deletion

### Day 3: Applications & Notifications
1. Test volunteer applying to events
2. Test organizer approving/rejecting
3. Test notifications
4. Test application tracking

### Day 4: Security & Edge Cases
1. Test route guards
2. Test unauthorized access
3. Test error handling
4. Test responsive design

---

## 📝 Bug Report Template

When you find an issue, note:
```
Title: [Brief description]
Steps to Reproduce:
1. [Step 1]
2. [Step 2]
3. [Step 3]

Expected Result: [What should happen]
Actual Result: [What actually happened]
Screenshots: [If applicable]
Browser: [Chrome/Firefox/Safari]
Device: [Desktop/Mobile/Tablet]
```

---

## ✅ Success Criteria

- [ ] All authentication flows work
- [ ] All CRUD operations work
- [ ] All filters/searches work
- [ ] All notifications display correctly
- [ ] Route guards prevent unauthorized access
- [ ] No console errors
- [ ] Responsive on all devices
- [ ] Loading states display
- [ ] Error messages are clear
- [ ] Data persists correctly

---

**Ready to test!** 🎯
