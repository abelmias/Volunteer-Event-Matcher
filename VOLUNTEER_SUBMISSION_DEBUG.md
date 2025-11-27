# Volunteer Event Submission - Debugging Guide

## Issue: "Failed to submit event. Please try again."

This guide helps identify the exact cause of the submission failure.

---

## Step 1: Check Browser Console

1. **Open DevTools**: Press `F12`
2. **Go to Console Tab**
3. **Look for error messages** that start with:
   - `Error submitting event:`
   - `Error status:`
   - `Error details:`

### Common Error Patterns

**Error 400 - Bad Request**:
```
Error status: 400
Error details: "Error creating event: ..."
```
**Cause**: Validation error in request data

**Error 401 - Unauthorized**:
```
Error status: 401
```
**Cause**: JWT token missing or invalid

**Error 500 - Internal Server Error**:
```
Error status: 500
Error details: "Error creating event: ..."
```
**Cause**: Backend exception

---

## Step 2: Check Network Tab

1. **Open DevTools**: Press `F12`
2. **Go to Network Tab**
3. **Submit Event** (fill form and click submit)
4. **Look for POST request** to `/api/events`

### Verify Request

**Check Request Headers**:
- Should have: `Authorization: Bearer {jwt_token}`
- Should have: `Content-Type: application/json`

**Check Request Body**:
```json
{
  "title": "...",
  "description": "...",
  "eventType": "...",
  "location": "...",
  "latitude": 0.0,
  "longitude": 0.0,
  "eventDate": "2025-...",
  "durationHours": 3,
  "volunteersNeeded": 20
}
```

### Verify Response

**Check Response Status**:
- 201 CREATED = Success
- 400 Bad Request = Validation error
- 401 Unauthorized = Token issue
- 500 Server Error = Backend error

**Check Response Body**:
- If error, should show error message
- If success, should show EventDTO with status = PENDING_APPROVAL

---

## Step 3: Identify Specific Issue

### Issue A: Missing Authorization Header

**Symptom**: Error 401 Unauthorized

**Solution**:
1. Check if user is logged in
2. Verify JWT token exists in localStorage:
   - Open DevTools → Application → Local Storage
   - Look for `token` key
3. If missing, user needs to login again

**Fix**:
```bash
# Re-login as volunteer
Username: volunteer1
Password: password123
```

### Issue B: Validation Error (400)

**Symptom**: Error 400 with message like "Event title is required"

**Possible Causes**:

1. **Missing Required Fields**:
   - Title (min 5 chars)
   - Description (min 20 chars)
   - Event Type
   - Location (min 5 chars)
   - Date & Time
   - Volunteers Needed (min 1)
   - Duration (min 1 hour)

2. **Invalid Field Values**:
   - Volunteers Needed: Must be number > 0
   - Duration: Must be number > 0
   - Date: Must be valid date
   - Time: Must be valid time

**Solution**:
1. Check all form fields are filled
2. Verify field values meet requirements
3. Check browser console for validation errors
4. Try submitting again

### Issue C: Backend Exception (500)

**Symptom**: Error 500 with message like "Error creating event: ..."

**Possible Causes**:

1. **User Not Found**:
   - JWT token contains invalid username
   - User was deleted from database

2. **Database Error**:
   - Connection issue
   - Schema mismatch

3. **Null Pointer Exception**:
   - Missing required field in DTO
   - Null value in unexpected place

**Solution**:
1. Check backend logs for detailed error
2. Verify user exists in database
3. Check database connection
4. Restart backend service

---

## Step 4: Check Backend Logs

### Where to Look

**If running locally**:
- Terminal where `mvn spring-boot:run` is running
- Look for lines starting with `ERROR` or `Exception`

**Common Backend Errors**:

```
ERROR: Error creating event: User not found: volunteer1
→ Solution: User doesn't exist in database

ERROR: Error creating event: Validation failed
→ Solution: Request data doesn't match DTO requirements

ERROR: Error creating event: NullPointerException
→ Solution: Missing required field in request

ERROR: Error creating event: Database error
→ Solution: Database connection issue
```

---

## Step 5: Verify Database

### Check if Event Was Saved

```sql
-- Connect to H2 Console: http://localhost:8081/api/h2-console

-- Check if event exists
SELECT * FROM events WHERE title = 'Community Park Cleanup';

-- Check event status
SELECT id, title, status, organizer_id FROM events ORDER BY created_at DESC LIMIT 1;

-- Check if organizer exists
SELECT * FROM users WHERE username = 'volunteer1';
```

### Expected Results

**Event should exist with**:
- `status` = `PENDING_APPROVAL`
- `organizer_id` = volunteer user's ID
- `created_at` = recent timestamp

---

## Step 6: Test with cURL

### Get JWT Token

```bash
curl -X POST http://localhost:8081/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "volunteer1",
    "password": "password123"
  }'
```

**Response**:
```json
{
  "token": "eyJhbGciOiJIUzUxMiJ9...",
  "type": "Bearer",
  "id": 2,
  "username": "volunteer1",
  "email": "volunteer1@example.com",
  "roles": ["VOLUNTEER"]
}
```

### Submit Event

```bash
curl -X POST http://localhost:8081/api/events \
  -H "Authorization: Bearer {TOKEN_FROM_ABOVE}" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Community Park Cleanup",
    "description": "Join us for a community cleanup event in the local park. We will remove litter and plant trees.",
    "eventType": "Environmental",
    "location": "Central Park, Dubai",
    "latitude": 25.2048,
    "longitude": 55.2708,
    "eventDate": "2025-12-15T14:00:00",
    "durationHours": 3,
    "volunteersNeeded": 20
  }'
```

**Expected Response** (201 CREATED):
```json
{
  "id": 1,
  "title": "Community Park Cleanup",
  "status": "PENDING_APPROVAL",
  "organizerId": 2,
  "organizerName": "Volunteer User",
  ...
}
```

---

## Troubleshooting Checklist

- [ ] **Backend Running?**
  - Check: `http://localhost:8081/api/events/pending-approval`
  - Should return 200 OK (even if empty list)

- [ ] **Frontend Running?**
  - Check: `http://localhost:4200`
  - Should load home page

- [ ] **User Logged In?**
  - Check DevTools → Application → Local Storage
  - Should have `token` and `currentUser`

- [ ] **Form Valid?**
  - Check all required fields are filled
  - Check field values meet requirements
  - Check browser console for validation errors

- [ ] **Network Request Sent?**
  - Check DevTools → Network tab
  - Should see POST to `/api/events`
  - Should have Authorization header

- [ ] **Response Received?**
  - Check response status (201 = success, 400/401/500 = error)
  - Check response body for error message

- [ ] **Event in Database?**
  - Check H2 Console
  - Query: `SELECT * FROM events ORDER BY created_at DESC LIMIT 1`
  - Should show recent event with PENDING_APPROVAL status

---

## Quick Fixes

### Fix 1: Clear Browser Cache

```bash
# Hard refresh (Ctrl+Shift+R on Windows/Linux, Cmd+Shift+R on Mac)
# Or open DevTools → Network → Disable cache (while DevTools open)
```

### Fix 2: Re-login

```bash
# Logout
# Click Logout button or clear localStorage

# Login again
Username: volunteer1
Password: password123
```

### Fix 3: Restart Backend

```bash
# Stop backend (Ctrl+C in terminal)
# Rebuild
cd backend
mvn clean install

# Run again
mvn spring-boot:run
```

### Fix 4: Check Database

```bash
# Open H2 Console
http://localhost:8081/api/h2-console

# Verify tables exist
SELECT * FROM users;
SELECT * FROM events;
```

---

## Still Not Working?

### Collect Debug Information

1. **Screenshot of error message**
2. **Browser console output** (copy full error)
3. **Network request/response** (copy from DevTools)
4. **Backend logs** (copy error lines)
5. **Database query results** (copy output)

### Share with Support

Create a file with:
```
VOLUNTEER SUBMISSION ERROR REPORT
==================================

Error Message: [from screenshot]

Browser Console:
[paste console errors]

Network Request:
[paste request details]

Network Response:
[paste response details]

Backend Logs:
[paste backend error]

Database Check:
[paste query results]

Steps to Reproduce:
1. Login as volunteer1
2. Navigate to /volunteer/submit-event
3. Fill form with:
   - Title: Community Park Cleanup
   - Description: [description]
   - Event Type: Environmental
   - Location: Central Park, Dubai
   - Date: [date]
   - Time: [time]
   - Volunteers: 20
   - Duration: 3
4. Click Submit
5. See error: [error message]
```

---

## Common Solutions Summary

| Error | Cause | Solution |
|-------|-------|----------|
| 401 Unauthorized | No JWT token | Re-login |
| 400 Bad Request | Invalid data | Check form fields |
| 500 Server Error | Backend error | Check backend logs |
| "User not found" | Invalid username in token | Re-login |
| "Validation failed" | Missing required field | Fill all fields |
| Event not in database | Request failed silently | Check network tab |
| Form won't submit | Validation error | Check form validation |

---

## Next Steps

1. **Identify the specific error** using steps above
2. **Apply appropriate fix** from solutions
3. **Test submission again**
4. **Verify event in database**
5. **Check admin dashboard** for pending events

If still not working, collect debug information and share for support.
