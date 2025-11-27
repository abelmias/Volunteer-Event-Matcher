# 🔧 Apply Now Button - Debugging Guide

## Error: "Failed to apply to event. Please try again."

This guide will help you identify and fix the issue with the Apply Now button.

---

## Step 1: Check Browser Console

1. Open DevTools (F12)
2. Go to **Console** tab
3. Click "Apply Now" button
4. Look for error messages

**You should see**:
```
Application successful: {success: true, message: "...", application: {...}}
```

**If you see error**:
```
Application error: {error: {...}, status: 400/401/500, ...}
```

---

## Step 2: Check Network Tab

1. Open DevTools (F12)
2. Go to **Network** tab
3. Click "Apply Now" button
4. Look for `POST` request to `/api/applications/events/{eventId}`

**Expected Response**:
- **Status**: 201 Created
- **Headers**: 
  - `Authorization: Bearer {jwt_token}`
- **Response Body**:
  ```json
  {
    "success": true,
    "message": "Successfully applied to event",
    "application": {
      "id": 1,
      "eventId": 1,
      "eventTitle": "...",
      "volunteerId": 1,
      "volunteerName": "...",
      "status": "PENDING"
    }
  }
  ```

**If Status is 401 (Unauthorized)**:
- Token is missing or invalid
- Check Step 3

**If Status is 400 (Bad Request)**:
- Check response message for details
- Common: "User not found", "Event not found", "Already applied"

**If Status is 500 (Server Error)**:
- Check backend logs
- See Step 4

---

## Step 3: Check JWT Token

### In Browser Console:
```javascript
// Check if token exists
localStorage.getItem('token')

// Check if user is stored
JSON.parse(localStorage.getItem('currentUser'))

// Check if interceptor is adding header
// (Open Network tab and check Authorization header in request)
```

**Expected Output**:
```javascript
// Token should be a long string starting with "eyJ"
"eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJ..."

// User should have id, username, role
{id: 1, username: "john_doe", email: "john@example.com", role: "VOLUNTEER", ...}
```

**If Token is Missing**:
1. Logout and login again
2. Check if login was successful
3. Verify token is stored in localStorage

**If User is Missing**:
1. Logout and login again
2. Verify login response includes user data

---

## Step 4: Check Backend Logs

### In Terminal/Console where backend is running:

Look for log messages like:
```
INFO  - Apply to event request - EventId: 1, Token present: true
INFO  - Username extracted from JWT: john_doe
INFO  - User found in database: john_doe (ID: 1)
INFO  - Volunteer john_doe applied to event 1
```

**If you see**:
```
ERROR - Authorization header is missing
```
→ JWT interceptor not adding header, check Step 3

**If you see**:
```
ERROR - User not found: john_doe
```
→ User doesn't exist in database, check login

**If you see**:
```
ERROR - Event not found
```
→ Event ID is wrong or event doesn't exist

**If you see**:
```
ERROR - Already applied to this event
```
→ User already has an application for this event

---

## Step 5: Common Issues & Solutions

### Issue 1: "Authorization header is missing"

**Cause**: JWT token not being sent

**Solution**:
1. Check if logged in: `localStorage.getItem('token')`
2. If empty, logout and login again
3. Verify JwtInterceptor is registered in app.module.ts

**In app.module.ts**:
```typescript
providers: [
  {
    provide: HTTP_INTERCEPTORS,
    useClass: JwtInterceptor,
    multi: true
  }
]
```

---

### Issue 2: "User not found: {username}"

**Cause**: User exists in JWT but not in database

**Solution**:
1. Check backend database: `SELECT * FROM users WHERE username = '{username}';`
2. If user doesn't exist, create test user
3. Or logout/login with correct credentials

---

### Issue 3: "Event not found"

**Cause**: Event ID is wrong or event doesn't exist

**Solution**:
1. Check event ID in URL: `/event/{id}`
2. Verify event exists in database: `SELECT * FROM events WHERE id = {id};`
3. If event doesn't exist, create test event

---

### Issue 4: "Already applied to this event"

**Cause**: User already has an application for this event

**Solution**:
1. Check My Applications on dashboard
2. Withdraw previous application if needed
3. Or try a different event

---

## Step 6: Test with cURL

If you want to test the endpoint directly:

```bash
# 1. Get JWT token by logging in
curl -X POST http://localhost:8081/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"usernameOrEmail":"john_doe","password":"password123"}'

# Response will include token:
# {"token":"eyJ...", "user":{...}, "message":"..."}

# 2. Use token to apply to event
curl -X POST http://localhost:8081/api/applications/events/1 \
  -H "Authorization: Bearer eyJ..." \
  -H "Content-Type: application/json"

# Expected response:
# {"success":true,"message":"Successfully applied to event","application":{...}}
```

---

## Step 7: Enable Debug Logging

### Frontend (event-detail.component.ts):

Already added! Check console for:
```
Application successful: {...}
Application error: {...}
```

### Backend (application.properties):

Add to `src/main/resources/application.properties`:
```properties
logging.level.com.volunteer.controller=DEBUG
logging.level.com.volunteer.service=DEBUG
logging.level.com.volunteer.security=DEBUG
```

Then restart backend and check logs.

---

## Step 8: Verify Database

### Check if user exists:
```sql
SELECT * FROM users WHERE username = 'john_doe';
```

### Check if event exists:
```sql
SELECT * FROM events WHERE id = 1;
```

### Check if application already exists:
```sql
SELECT * FROM volunteer_applications 
WHERE volunteer_id = {userId} AND event_id = {eventId};
```

---

## Quick Checklist

- [ ] User is logged in
- [ ] JWT token exists in localStorage
- [ ] Authorization header is being sent (check Network tab)
- [ ] Backend receives token
- [ ] User exists in database
- [ ] Event exists in database
- [ ] User hasn't already applied to event
- [ ] No console errors
- [ ] Network request returns 201 Created

---

## If Still Not Working

1. **Restart backend**: Kill and restart Spring Boot
2. **Clear browser cache**: Ctrl+Shift+Delete
3. **Logout and login again**: Fresh token
4. **Check backend logs**: Look for detailed error messages
5. **Check database**: Verify user and event exist

---

## Example Error Messages & Solutions

| Error | Cause | Solution |
|-------|-------|----------|
| 401 Unauthorized | No token or invalid token | Login again |
| "User not found" | User doesn't exist in DB | Create user or login with correct credentials |
| "Event not found" | Event doesn't exist | Create event or check event ID |
| "Already applied" | User already applied | Withdraw previous application |
| 500 Internal Server Error | Backend error | Check backend logs |
| CORS error | Cross-origin issue | Check CORS configuration |

---

## Testing Steps

1. **Create test event** (if needed)
   - Go to `/organizer/events` (as organizer)
   - Create new event
   - Publish event

2. **Login as volunteer**
   - Go to `/auth/login`
   - Login with volunteer account

3. **Browse to event**
   - Go to `/events`
   - Click on test event

4. **Click Apply Now**
   - Check console for success/error
   - Check Network tab for request/response
   - Check dashboard for new application

---

**Last Updated**: November 27, 2025
**Status**: Debugging Guide Ready
