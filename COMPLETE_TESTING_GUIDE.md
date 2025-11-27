# Complete End-to-End Testing & Debugging Guide

## STEP 1: Verify Backend is Running

### Check Backend Status

```bash
# Terminal should show:
# Started VolunteerEventMatcherApplication in X.XXX seconds
```

### Test Backend API Directly

Open browser and test these endpoints:

**Test 1: Check if backend is alive**
```
http://localhost:8081/api/events/pending-approval
```
Expected: Should return `[]` (empty array) or list of events

**Test 2: Check H2 Database**
```
http://localhost:8081/api/h2-console
```
- Login with default credentials
- Run query: `SELECT * FROM events WHERE status = 'PENDING_APPROVAL';`
- Should show any pending events

---

## STEP 2: Verify Frontend is Running

### Check Frontend Status

```bash
# Terminal should show:
# ✔ Compiled successfully
# Application bundle generated successfully
```

### Clear Browser Cache (CRITICAL!)

**Option 1: Hard Refresh**
- Windows/Linux: `Ctrl + Shift + R`
- Mac: `Cmd + Shift + R`

**Option 2: DevTools Cache Disable**
1. Press `F12` to open DevTools
2. Go to Network tab
3. Check "Disable cache" checkbox
4. Keep DevTools open while testing

**Option 3: Clear LocalStorage**
1. Press `F12` to open DevTools
2. Go to Application tab
3. Click LocalStorage
4. Right-click and "Clear All"

---

## STEP 3: Test Volunteer Submission

### 3.1: Login as Volunteer

1. Go to `http://localhost:4200`
2. Click "Post Event"
3. Login with:
   - Username: `volunteer1`
   - Password: `password123`
4. Should redirect to submit event form

### 3.2: Fill Submit Event Form

Fill ALL fields:
- **Title**: "Community Park Cleanup"
- **Description**: "Join us for a community cleanup event in the local park. We will remove litter and plant trees."
- **Event Type**: "Environmental"
- **Location**: "Central Park, Dubai"
- **Date**: Select a future date
- **Time**: Select a time
- **Volunteers Needed**: 20
- **Duration**: 3

### 3.3: Submit Event

1. Click "Submit Event for Review"
2. **Check for success message**: "Event submitted successfully! Admins will review it shortly..."
3. **Check browser console** (F12 → Console):
   - Should NOT see any red errors
   - May see: "Error submitting event:" if there's an issue

### 3.4: Verify in Backend Database

1. Go to `http://localhost:8081/api/h2-console`
2. Run query:
   ```sql
   SELECT id, title, status, organizer_id FROM events ORDER BY created_at DESC LIMIT 1;
   ```
3. **Should see**:
   - Title: "Community Park Cleanup"
   - Status: "PENDING_APPROVAL"
   - organizer_id: 2 (volunteer1's ID)

---

## STEP 4: Test Admin Dashboard

### 4.1: Logout Volunteer

1. Click Logout button
2. Should redirect to home page

### 4.2: Login as Organizer/Admin

1. Click "Find Events" or go to home
2. Click "Login"
3. Login with:
   - Username: `organizer1`
   - Password: `password123`
4. Should redirect to `/organizer/dashboard`

### 4.3: Check Dashboard Loads

1. **Should see navbar** with "Voluntra" logo
2. **Should see tab navigation** with buttons:
   - Overview
   - **Pending Submissions** ← CRITICAL: This must appear!
   - Events
   - Applications

### 4.4: Click "Pending Submissions" Tab

1. Click the "Pending Submissions" tab
2. **Should see**:
   - Section header: "Pending Volunteer Submissions"
   - List of submitted events
   - Event card with:
     - Title: "Community Park Cleanup"
     - Status badge: "PENDING REVIEW"
     - Location, volunteers needed, duration
     - **Approve** and **Reject** buttons

### 4.5: Approve Event

1. Click "Approve" button
2. **Should see success message**: "Event approved successfully"
3. Event should disappear from pending list
4. Click "Events" tab
5. **Should see** the event with status "DRAFT"

---

## STEP 5: Debugging - If Something Doesn't Work

### Problem: "Pending Submissions" tab not appearing

**Check 1: Browser Cache**
- Hard refresh: `Ctrl+Shift+R`
- Clear LocalStorage: F12 → Application → LocalStorage → Clear All
- Close and reopen browser

**Check 2: Routing**
- Open DevTools Console (F12)
- Check for errors like: "OrganizerDashboardComponent not found"
- If error, routing module wasn't updated correctly

**Check 3: Module Declaration**
- Verify `organizer.module.ts` has `OrganizerDashboardComponent` in declarations
- Verify `organizer-routing.module.ts` imports `OrganizerDashboardComponent`

### Problem: Pending submissions not loading

**Check 1: Backend API**
- Open: `http://localhost:8081/api/events/pending-approval`
- Should return JSON array
- If error, backend issue

**Check 2: Frontend API Call**
- Open DevTools Network tab (F12 → Network)
- Submit event or refresh dashboard
- Look for request to `/api/events/pending-approval`
- Check response status and data

**Check 3: Console Errors**
- Open DevTools Console (F12 → Console)
- Look for red error messages
- Common errors:
  - "Cannot read property 'length' of undefined"
  - "HTTP 403 Forbidden"
  - "HTTP 401 Unauthorized"

### Problem: Submit button not working

**Check 1: Form Validation**
- Fill ALL fields (including eventType, latitude, longitude)
- Check for validation error messages
- All fields must be filled

**Check 2: Authorization**
- Check if JWT token is in localStorage
- DevTools → Application → LocalStorage → token
- Should have a long string starting with "eyJ"

**Check 3: Network Error**
- Open DevTools Network tab
- Click "Submit Event for Review"
- Look for POST request to `/api/events`
- Check response status:
  - 201 = Success
  - 400 = Validation error
  - 403 = Authorization error
  - 500 = Server error

---

## STEP 6: Complete Test Checklist

### Backend Tests
- [ ] Backend running on `http://localhost:8081/api`
- [ ] Can access `http://localhost:8081/api/events/pending-approval`
- [ ] H2 Console accessible at `http://localhost:8081/api/h2-console`
- [ ] Database has test users (volunteer1, organizer1)

### Frontend Tests
- [ ] Frontend running on `http://localhost:4200`
- [ ] Browser cache cleared
- [ ] Can login as volunteer1
- [ ] Can login as organizer1
- [ ] Submit event form loads
- [ ] Can fill and submit event form
- [ ] See success message after submission

### Integration Tests
- [ ] Volunteer submits event
- [ ] Event appears in database with PENDING_APPROVAL status
- [ ] Admin dashboard loads
- [ ] "Pending Submissions" tab visible
- [ ] Pending submissions appear in tab
- [ ] Can approve submission
- [ ] Approved event appears in Events tab
- [ ] Can reject submission
- [ ] Rejected event disappears from pending list

---

## STEP 7: If Still Not Working - Advanced Debugging

### Enable Detailed Logging

**Backend Logging**
Add to `application.properties`:
```properties
logging.level.com.volunteer=DEBUG
logging.level.org.springframework.security=DEBUG
```

**Frontend Logging**
Add to component:
```typescript
console.log('Pending submissions:', this.pendingSubmissions);
console.log('Active tab:', this.activeTab);
console.log('Current user:', this.currentUser);
```

### Check Network Requests

1. Open DevTools (F12)
2. Go to Network tab
3. Filter by "XHR" (XMLHttpRequest)
4. Perform action (submit event, load dashboard)
5. Check each request:
   - URL should be correct
   - Status should be 200 or 201
   - Response should have data

### Check Console for Errors

1. Open DevTools (F12)
2. Go to Console tab
3. Look for red error messages
4. Copy full error and search for solution

---

## STEP 8: Common Issues & Solutions

| Issue | Cause | Solution |
|-------|-------|----------|
| "Pending Submissions" tab missing | Old dashboard loading | Hard refresh + clear cache |
| 403 Forbidden error | JWT token invalid | Re-login |
| 401 Unauthorized | No JWT token | Check localStorage for token |
| Form won't submit | Validation error | Fill all fields including eventType |
| No pending submissions showing | Backend not returning data | Check `/api/events/pending-approval` endpoint |
| Dashboard not loading | Module not declared | Check organizer.module.ts |
| Approve button not working | API endpoint issue | Check backend logs |

---

## STEP 9: Contact Points for Help

If still not working, provide:

1. **Screenshot** of what you see
2. **Browser console errors** (F12 → Console)
3. **Network request/response** (F12 → Network)
4. **Backend logs** (terminal output)
5. **Database query result** (H2 Console)
6. **Steps to reproduce** the issue

---

## Quick Reference: Test Credentials

```
VOLUNTEER:
- Username: volunteer1
- Password: password123
- Role: VOLUNTEER

ORGANIZER/ADMIN:
- Username: organizer1
- Password: password123
- Role: ORGANIZER
```

## Quick Reference: URLs

```
Frontend: http://localhost:4200
Backend API: http://localhost:8081/api
H2 Console: http://localhost:8081/api/h2-console
Organizer Dashboard: http://localhost:4200/organizer/dashboard
Submit Event: http://localhost:4200/volunteer/submit-event
```

---

## Summary

The complete workflow should be:

1. ✅ Volunteer submits event
2. ✅ Event saved with PENDING_APPROVAL status
3. ✅ Admin sees "Pending Submissions" tab
4. ✅ Admin sees volunteer submission
5. ✅ Admin approves/rejects
6. ✅ Event status updates
7. ✅ Approved events appear in organizer's event list

If any step fails, use this guide to debug and identify the exact issue.
