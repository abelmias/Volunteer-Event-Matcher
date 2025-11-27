# Volunteer Event Submission Workflow - Complete Fix

## Problem Summary

Volunteer-submitted events were not appearing in the admin dashboard. The issue had three root causes:

1. **Frontend Not Calling API**: The volunteer submission form had a TODO comment and only simulated success without calling any backend API
2. **Missing Backend Endpoint**: No endpoint existed to retrieve organizer's events (`/organizer/my-events`)
3. **Admin Dashboard Query Issue**: The organizer dashboard was calling a non-existent endpoint

---

## Root Cause Analysis

### Issue #1: Frontend Not Calling API ❌

**File**: `frontend/src/app/components/volunteer/submit-event/submit-event.component.ts`

**Problem**:
```typescript
// TODO: Call API to submit event
// For now, just simulate success
setTimeout(() => {
  this.loading = false;
  this.successMessage = 'Event submitted successfully!...';
}, 1500);
```

The form was only simulating success without persisting data to the backend.

### Issue #2: Missing Backend Endpoint ❌

**File**: `backend/src/main/java/com/volunteer/controller/EventController.java`

**Problem**: 
- No `GET /events/organizer/my-events` endpoint existed
- Frontend was calling this endpoint but backend didn't implement it
- Admin dashboard couldn't retrieve organizer's events

### Issue #3: Event Status Not Set Correctly ❌

**File**: `backend/src/main/java/com/volunteer/service/EventService.java`

**Problem**:
- Volunteer submissions were being created with `DRAFT` status instead of `PENDING_APPROVAL`
- Admin dashboard couldn't distinguish between organizer-created and volunteer-submitted events
- No way to filter pending submissions for review

---

## Solution Implemented

### Backend Changes

#### 1. Added Event Status Enum Value

**File**: `backend/src/main/java/com/volunteer/entity/Event.java`

```java
public enum EventStatus {
    DRAFT, PUBLISHED, IN_PROGRESS, COMPLETED, CANCELLED, PENDING_APPROVAL
}
```

#### 2. Updated Event Creation Logic

**File**: `backend/src/main/java/com/volunteer/service/EventService.java`

```java
public EventDTO createEvent(CreateEventDTO createEventDTO, User organizer) {
    // Determine event status based on user role
    // Volunteers submit events with PENDING_APPROVAL status
    // Organizers create events with DRAFT status
    Event.EventStatus initialStatus = organizer.getRole().equals("VOLUNTEER") 
            ? Event.EventStatus.PENDING_APPROVAL 
            : Event.EventStatus.DRAFT;
    
    Event event = Event.builder()
            // ... other fields ...
            .status(initialStatus)
            .build();
    
    // ... rest of method ...
}
```

#### 3. Added Missing Backend Endpoints

**File**: `backend/src/main/java/com/volunteer/controller/EventController.java`

**New Endpoints**:

```java
/**
 * Get all events for the current organizer
 * Used by organizer dashboard to display their events
 */
@GetMapping("/organizer/my-events")
public ResponseEntity<?> getOrganizerEvents(@RequestHeader("Authorization") String token) {
    // Extract user from JWT token
    // Return all events created by this organizer
}

/**
 * Get all pending approval events (for admin review)
 * Used by admin dashboard to review volunteer-submitted events
 */
@GetMapping("/pending-approval")
public ResponseEntity<?> getPendingApprovalEvents() {
    // Return all events with PENDING_APPROVAL status
}

/**
 * Approve a pending event (admin action)
 * Changes status from PENDING_APPROVAL to DRAFT
 */
@PostMapping("/{id}/approve")
public ResponseEntity<?> approveEvent(@PathVariable Long id) {
    // Approve event and change status to DRAFT
}

/**
 * Reject a pending event (admin action)
 * Changes status from PENDING_APPROVAL to CANCELLED
 */
@PostMapping("/{id}/reject")
public ResponseEntity<?> rejectEvent(@PathVariable Long id) {
    // Reject event and change status to CANCELLED
}
```

### Frontend Changes

#### 1. Updated Volunteer Submit Event Component

**File**: `frontend/src/app/components/volunteer/submit-event/submit-event.component.ts`

**Changes**:
- Added `EventService` import
- Injected `EventService` into constructor
- Implemented actual API call in `onSubmit()` method

```typescript
onSubmit(): void {
    // ... validation ...
    
    // Combine date and time into a single datetime
    const eventDate = new Date(formValue.date);
    const [hours, minutes] = formValue.time.split(':');
    eventDate.setHours(parseInt(hours), parseInt(minutes));

    // Prepare event data for submission
    const eventData = {
        title: formValue.title,
        description: formValue.description,
        eventType: formValue.eventType,
        location: formValue.location,
        latitude: 0, // Default - can be updated with geocoding
        longitude: 0,
        eventDate: eventDate.toISOString(),
        durationHours: parseInt(formValue.duration),
        volunteersNeeded: parseInt(formValue.volunteersNeeded),
        imageUrl: undefined
    };

    // Call the API to submit the event
    this.eventService.createEvent(eventData).subscribe(
        (response: any) => {
            this.loading = false;
            this.successMessage = 'Event submitted successfully! Admins will review it shortly...';
            setTimeout(() => {
                this.router.navigate(['/volunteer/dashboard']);
            }, 2500);
        },
        (error: any) => {
            this.loading = false;
            this.errorMessage = error.error?.message || 'Failed to submit event...';
            console.error('Error submitting event:', error);
        }
    );
}
```

---

## Event Workflow

### Volunteer Submission Flow

```
1. Volunteer fills out submit event form
   ↓
2. Clicks "Submit Event for Review"
   ↓
3. Frontend calls POST /api/events with event data
   ↓
4. Backend creates event with status = PENDING_APPROVAL
   ↓
5. Event saved to database
   ↓
6. Frontend shows success message
   ↓
7. Redirects to volunteer dashboard
```

### Admin Review Flow

```
1. Admin logs in
   ↓
2. Goes to Admin Dashboard
   ↓
3. Dashboard calls GET /api/events/pending-approval
   ↓
4. Backend returns all PENDING_APPROVAL events
   ↓
5. Admin sees list of pending submissions
   ↓
6. Admin clicks "Approve" or "Reject"
   ↓
7. Frontend calls POST /api/events/{id}/approve or /reject
   ↓
8. Backend updates event status to DRAFT or CANCELLED
   ↓
9. Event list refreshes
```

### Organizer Dashboard Flow

```
1. Organizer logs in
   ↓
2. Goes to Organizer Dashboard
   ↓
3. Dashboard calls GET /api/events/organizer/my-events
   ↓
4. Backend returns all events created by this organizer
   ↓
5. Organizer sees all their events (DRAFT, PUBLISHED, CANCELLED)
   ↓
6. Can edit, publish, or delete events
```

---

## Database Status Tracking

### Event Status Values

| Status | Description | Created By | Can Be Published | Visible To |
|--------|-------------|-----------|------------------|-----------|
| DRAFT | Initial state for organizer events | Organizer | Yes | Organizer only |
| PENDING_APPROVAL | Awaiting admin review | Volunteer | No | Admin only |
| PUBLISHED | Live and accepting volunteers | Organizer/Admin | - | Everyone |
| IN_PROGRESS | Event is ongoing | System | - | Everyone |
| COMPLETED | Event finished | System | - | Everyone |
| CANCELLED | Event rejected or cancelled | Organizer/Admin | - | Nobody |

---

## Testing Checklist

### Backend Testing

- [ ] **Test 1**: Volunteer submits event
  - Navigate to `/volunteer/submit-event`
  - Fill out form with valid data
  - Click "Submit Event for Review"
  - Check database: Event should have status = `PENDING_APPROVAL`
  - Check response: Should return 201 CREATED

- [ ] **Test 2**: Retrieve pending events
  - Call `GET /api/events/pending-approval`
  - Should return list of all PENDING_APPROVAL events
  - Should include the event from Test 1

- [ ] **Test 3**: Retrieve organizer events
  - Call `GET /api/events/organizer/my-events` with organizer JWT token
  - Should return list of all events created by that organizer
  - Should include DRAFT, PUBLISHED, CANCELLED statuses

- [ ] **Test 4**: Approve pending event
  - Call `POST /api/events/{id}/approve` where id is from Test 1
  - Event status should change from PENDING_APPROVAL to DRAFT
  - Event should now appear in organizer's event list

- [ ] **Test 5**: Reject pending event
  - Submit another volunteer event
  - Call `POST /api/events/{id}/reject`
  - Event status should change to CANCELLED
  - Event should not appear in pending list

### Frontend Testing

- [ ] **Test 6**: Volunteer submission form
  - Form should have all required fields
  - Submit button should be disabled until form is valid
  - On submit, should call API (check Network tab)
  - Should show success message
  - Should redirect to dashboard after 2.5 seconds

- [ ] **Test 7**: Admin dashboard pending events
  - Admin dashboard should have a "Pending Submissions" tab
  - Should display all PENDING_APPROVAL events
  - Should show approve/reject buttons
  - Clicking approve should update event status

- [ ] **Test 8**: Organizer dashboard
  - Organizer dashboard should display all organizer's events
  - Should show DRAFT, PUBLISHED, CANCELLED statuses
  - Should filter events by status
  - Should allow editing and publishing events

---

## API Endpoints Reference

### Event Creation (Volunteer & Organizer)
```
POST /api/events
Headers: Authorization: Bearer {jwt_token}
Body: {
  "title": "string",
  "description": "string",
  "eventType": "string",
  "location": "string",
  "latitude": number,
  "longitude": number,
  "eventDate": "ISO-8601 datetime",
  "durationHours": number,
  "volunteersNeeded": number,
  "imageUrl": "string (optional)"
}
Response: EventDTO with status = PENDING_APPROVAL (volunteer) or DRAFT (organizer)
```

### Get Organizer Events
```
GET /api/events/organizer/my-events
Headers: Authorization: Bearer {jwt_token}
Response: List<EventDTO> - all events created by the authenticated user
```

### Get Pending Approval Events
```
GET /api/events/pending-approval
Response: List<EventDTO> - all events with status = PENDING_APPROVAL
```

### Approve Event
```
POST /api/events/{id}/approve
Response: "Event approved successfully"
Status Change: PENDING_APPROVAL → DRAFT
```

### Reject Event
```
POST /api/events/{id}/reject
Response: "Event rejected successfully"
Status Change: PENDING_APPROVAL → CANCELLED
```

---

## Deployment Steps

### 1. Backend Deployment

```bash
# Navigate to backend directory
cd backend

# Clean and rebuild
mvn clean install

# Run the application
mvn spring-boot:run
```

**Expected Output**:
```
Started VolunteerEventMatcherApplication in X.XXX seconds
```

### 2. Frontend Deployment

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies (if needed)
npm install

# Run the development server
ng serve
```

**Expected Output**:
```
✔ Compiled successfully.
Application bundle generated successfully.
```

### 3. Verify Endpoints

```bash
# Test backend is running
curl http://localhost:8081/api/events/pending-approval

# Test frontend is running
curl http://localhost:4200
```

---

## Troubleshooting

### Issue: "Event not appearing in admin dashboard"

**Solution**:
1. Check backend logs for errors during event creation
2. Verify event was saved to database: `SELECT * FROM events WHERE status = 'PENDING_APPROVAL'`
3. Verify admin is calling correct endpoint: `GET /api/events/pending-approval`
4. Check JWT token is valid and user role is correct

### Issue: "Organizer dashboard showing no events"

**Solution**:
1. Verify endpoint is being called: Check Network tab in browser DevTools
2. Check JWT token is included in Authorization header
3. Verify user exists in database: `SELECT * FROM users WHERE username = 'organizer1'`
4. Check events exist for this organizer: `SELECT * FROM events WHERE organizer_id = {user_id}`

### Issue: "API returning 401 Unauthorized"

**Solution**:
1. Verify JWT token is valid
2. Check token is being sent in Authorization header as `Bearer {token}`
3. Verify token hasn't expired
4. Re-login to get a new token

### Issue: "Event status not changing after approve/reject"

**Solution**:
1. Verify event ID is correct
2. Check backend logs for errors
3. Verify event exists in database
4. Manually check database: `SELECT * FROM events WHERE id = {event_id}`

---

## Files Modified

### Backend
- `backend/src/main/java/com/volunteer/entity/Event.java` - Added PENDING_APPROVAL status
- `backend/src/main/java/com/volunteer/service/EventService.java` - Updated createEvent logic
- `backend/src/main/java/com/volunteer/controller/EventController.java` - Added 4 new endpoints

### Frontend
- `frontend/src/app/components/volunteer/submit-event/submit-event.component.ts` - Implemented API call

---

## Summary

✅ **Fixed**: Volunteer event submissions now properly saved to database
✅ **Fixed**: Events created with PENDING_APPROVAL status for admin review
✅ **Fixed**: Admin dashboard can retrieve pending events for review
✅ **Fixed**: Organizer dashboard can retrieve their own events
✅ **Fixed**: Frontend now calls backend API instead of simulating

**Status**: Ready for testing and deployment
