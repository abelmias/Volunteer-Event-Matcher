# Testing Volunteer Event Submission Workflow

## Quick Start

### Prerequisites
- Backend running on `http://localhost:8081/api`
- Frontend running on `http://localhost:4200`
- Test credentials ready

### Test Credentials

**Volunteer User**:
- Username: `volunteer1`
- Password: `password123`
- Role: VOLUNTEER

**Organizer User**:
- Username: `organizer1`
- Password: `password123`
- Role: ORGANIZER

---

## End-to-End Test Scenario

### Step 1: Volunteer Submits Event

1. **Open Browser**: Navigate to `http://localhost:4200`
2. **Click "Post Event"**: On the home page
3. **Login as Volunteer**:
   - Username: `volunteer1`
   - Password: `password123`
   - Click Login
4. **Fill Submit Event Form**:
   - Title: "Community Cleanup Drive"
   - Description: "Join us for a community cleanup event in the local park. We'll be removing litter and planting trees."
   - Event Type: "Environmental"
   - Location: "Central Park, Dubai"
   - Date: (Select a future date)
   - Time: (Select a time)
   - Volunteers Needed: 20
   - Duration: 3 (hours)
5. **Click "Submit Event for Review"**
6. **Verify Success**:
   - Should see: "Event submitted successfully! Admins will review it shortly. Redirecting to dashboard..."
   - Should redirect to volunteer dashboard after 2.5 seconds

### Step 2: Verify Event in Database

1. **Open H2 Console**: Navigate to `http://localhost:8081/api/h2-console`
2. **Run Query**:
   ```sql
   SELECT * FROM events WHERE title = 'Community Cleanup Drive';
   ```
3. **Verify Results**:
   - Event should exist in database
   - Status should be: `PENDING_APPROVAL`
   - Organizer ID should match volunteer1's user ID

### Step 3: Admin Reviews Pending Events

1. **Open Browser**: Navigate to `http://localhost:4200`
2. **Logout** (if still logged in as volunteer)
3. **Login as Admin/Organizer**:
   - Username: `organizer1`
   - Password: `password123`
   - Click Login
4. **Navigate to Admin Dashboard**:
   - Should see dashboard with tabs: Overview, Events, Applications
5. **Check Pending Submissions**:
   - Look for a "Pending Submissions" or "Pending Approval" section
   - Should see the "Community Cleanup Drive" event
   - Status should show: "PENDING_APPROVAL"

### Step 4: Admin Approves Event

1. **Click Approve Button** on the pending event
2. **Verify Success**:
   - Should see success message
   - Event should move from pending to draft
   - Event status should change to: `DRAFT`
3. **Verify in Database**:
   ```sql
   SELECT * FROM events WHERE title = 'Community Cleanup Drive';
   ```
   - Status should now be: `DRAFT`

### Step 5: Verify Event Appears in Organizer's Event List

1. **Still logged in as organizer1**
2. **Go to Events Tab** on dashboard
3. **Verify Event Appears**:
   - Should see "Community Cleanup Drive" in the events list
   - Status should show: "DRAFT"
   - Should have options to: Edit, Publish, Delete

---

## API Testing (Using cURL or Postman)

### Test 1: Submit Event as Volunteer

```bash
# 1. Login to get JWT token
curl -X POST http://localhost:8081/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "volunteer1",
    "password": "password123"
  }'

# Save the token from response (e.g., eyJhbGciOiJIUzUxMiJ9...)

# 2. Submit event
curl -X POST http://localhost:8081/api/events \
  -H "Authorization: Bearer {TOKEN}" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "API Test Event",
    "description": "This is a test event submitted via API",
    "eventType": "Community Service",
    "location": "Dubai",
    "latitude": 25.2048,
    "longitude": 55.2708,
    "eventDate": "2025-12-15T14:00:00",
    "durationHours": 2,
    "volunteersNeeded": 10
  }'

# Expected Response: 201 CREATED with EventDTO (status = PENDING_APPROVAL)
```

### Test 2: Get Pending Approval Events

```bash
curl -X GET http://localhost:8081/api/events/pending-approval \
  -H "Content-Type: application/json"

# Expected Response: 200 OK with List<EventDTO> of all PENDING_APPROVAL events
```

### Test 3: Get Organizer's Events

```bash
# Login as organizer first to get token

curl -X GET http://localhost:8081/api/events/organizer/my-events \
  -H "Authorization: Bearer {ORGANIZER_TOKEN}" \
  -H "Content-Type: application/json"

# Expected Response: 200 OK with List<EventDTO> of all organizer's events
```

### Test 4: Approve Event

```bash
curl -X POST http://localhost:8081/api/events/{EVENT_ID}/approve \
  -H "Content-Type: application/json"

# Expected Response: 200 OK with message "Event approved successfully"
# Event status should change from PENDING_APPROVAL to DRAFT
```

### Test 5: Reject Event

```bash
curl -X POST http://localhost:8081/api/events/{EVENT_ID}/reject \
  -H "Content-Type: application/json"

# Expected Response: 200 OK with message "Event rejected successfully"
# Event status should change from PENDING_APPROVAL to CANCELLED
```

---

## Browser DevTools Testing

### Network Tab Verification

1. **Open DevTools**: Press F12
2. **Go to Network Tab**
3. **Submit Event**:
   - Should see POST request to `/api/events`
   - Status should be: 201 CREATED
   - Response should include event data with status = PENDING_APPROVAL

### Console Tab Verification

1. **Open DevTools**: Press F12
2. **Go to Console Tab**
3. **Submit Event**:
   - Should NOT see any errors
   - May see success log messages
   - Should NOT see 401 Unauthorized errors

### Application Tab Verification

1. **Open DevTools**: Press F12
2. **Go to Application Tab**
3. **Check Local Storage**:
   - Should see `currentUser` with user data
   - Should see `token` with JWT token
   - Token should be valid and not expired

---

## Troubleshooting Tests

### Test Fails: "Event not appearing in database"

**Debugging Steps**:
1. Check browser console for errors
2. Check Network tab - verify POST request succeeded (201 status)
3. Check backend logs for exceptions
4. Verify JWT token is valid
5. Verify user role is VOLUNTEER

**Solution**:
```bash
# Check backend logs
# Look for error messages in terminal where backend is running
# Common issues:
# - "User not found" - JWT token invalid
# - "Validation failed" - Form data invalid
# - "Database error" - Connection issue
```

### Test Fails: "Pending events endpoint returns empty list"

**Debugging Steps**:
1. Verify event was created with status = PENDING_APPROVAL
2. Check database directly:
   ```sql
   SELECT * FROM events WHERE status = 'PENDING_APPROVAL';
   ```
3. Verify endpoint is being called correctly
4. Check backend logs for errors

**Solution**:
- Ensure volunteer submitted event (not organizer)
- Verify event status in database is exactly "PENDING_APPROVAL"
- Try refreshing page and calling endpoint again

### Test Fails: "Organizer events endpoint returns 401"

**Debugging Steps**:
1. Check JWT token is included in Authorization header
2. Verify token format: `Bearer {token}`
3. Check token hasn't expired
4. Verify user role is ORGANIZER

**Solution**:
```bash
# Re-login to get fresh token
curl -X POST http://localhost:8081/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "organizer1",
    "password": "password123"
  }'
# Use the new token in Authorization header
```

---

## Performance Testing

### Test Load Time

1. **Submit Event**:
   - Should complete in < 2 seconds
   - If slower, check backend performance

2. **Retrieve Pending Events**:
   - Should complete in < 1 second
   - If slower, check database indexes

3. **Retrieve Organizer Events**:
   - Should complete in < 1 second
   - If slower, check database query performance

### Test with Multiple Events

1. **Submit 10 volunteer events**
2. **Verify all appear in pending list**
3. **Approve/Reject some events**
4. **Verify counts are correct**

---

## Regression Testing

### After Each Change

1. **Test Volunteer Submission**:
   - [ ] Can submit event
   - [ ] Event has PENDING_APPROVAL status
   - [ ] Event appears in database

2. **Test Admin Review**:
   - [ ] Can see pending events
   - [ ] Can approve events
   - [ ] Can reject events

3. **Test Organizer Dashboard**:
   - [ ] Can see own events
   - [ ] Can filter by status
   - [ ] Can edit/publish/delete events

4. **Test Volunteer Dashboard**:
   - [ ] Can see submitted events
   - [ ] Can see status of submissions
   - [ ] Can withdraw submissions (if implemented)

---

## Success Criteria

✅ **All Tests Pass When**:
- Volunteer can submit event
- Event saved with PENDING_APPROVAL status
- Admin can see pending events
- Admin can approve/reject events
- Event status updates correctly
- Organizer can see approved events
- No errors in browser console
- No errors in backend logs
- All API responses have correct status codes
- Response data matches expected format

---

## Test Report Template

```
Date: [DATE]
Tester: [NAME]
Environment: Local (Backend: 8081, Frontend: 4200)

Test Results:
- [ ] Volunteer submission: PASS / FAIL
- [ ] Event in database: PASS / FAIL
- [ ] Pending events list: PASS / FAIL
- [ ] Admin approve: PASS / FAIL
- [ ] Admin reject: PASS / FAIL
- [ ] Organizer events list: PASS / FAIL
- [ ] Event status updates: PASS / FAIL

Issues Found:
1. [Issue description]
2. [Issue description]

Notes:
[Any additional notes]
```

---

## Next Steps After Testing

1. **If All Tests Pass**:
   - Deploy to staging environment
   - Run full regression test suite
   - Get stakeholder approval
   - Deploy to production

2. **If Tests Fail**:
   - Document failures
   - Check troubleshooting guide
   - Review code changes
   - Fix issues
   - Re-run tests

3. **Performance Optimization**:
   - Add database indexes if needed
   - Optimize queries
   - Add caching if needed
   - Monitor response times

4. **Feature Enhancements**:
   - Add email notifications for submissions
   - Add rejection reason field
   - Add submission deadline
   - Add bulk approve/reject
   - Add submission history/audit log
