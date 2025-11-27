# 🧪 Testing Guide - Dual-Action Participation Model

## Quick Start Testing

### Prerequisites
- Backend running on `http://localhost:8081`
- Frontend running on `http://localhost:4200`
- Test user account created (or use existing)

### Test Scenario 1: Apply Now Button (Authenticated)

**Steps**:
1. Login to volunteer dashboard
2. Navigate to `/events` and click on an event
3. On event detail page, click "Apply Now" button
4. **Expected**: 
   - Button shows loading spinner
   - After 1-2 seconds, button shows "✓ Applied"
   - Success message appears
   - Event appears in dashboard "My Applications" tab

**Verification**:
- Check browser console: No errors
- Check Network tab: POST to `/api/applications/events/{eventId}` returns 201
- Check dashboard: Event appears in "My Applications" with "PENDING" status

---

### Test Scenario 2: Apply Now Button (Unauthenticated)

**Steps**:
1. Logout or open in incognito window
2. Navigate to `/events` and click on an event
3. Click "Apply Now" button
4. **Expected**:
   - Redirected to login page
   - URL shows `?returnUrl=/event/{eventId}`
   - Login with valid credentials
   - After login, automatically return to event page
   - Can now click "Apply Now" again

**Verification**:
- Check URL after redirect: Contains `returnUrl` parameter
- After login: Returned to same event page (not dashboard)
- Can complete application after return

---

### Test Scenario 3: Save for Later Button (Authenticated)

**Steps**:
1. Login to volunteer dashboard
2. Navigate to `/events` and click on an event
3. Click "Save for Later" button
4. **Expected**:
   - Button shows loading spinner
   - After 1-2 seconds, button shows "✓ Saved"
   - Success message "Event saved to your cart!" appears
   - Message auto-dismisses after 3 seconds

**Verification**:
- Check browser DevTools → Application → Local Storage
- Look for key: `event-cart-{userId}`
- Value should contain event data (id, title, date, location)

---

### Test Scenario 4: Save for Later Button (Unauthenticated)

**Steps**:
1. Logout or open in incognito window
2. Navigate to `/events` and click on an event
3. Click "Save for Later" button
4. **Expected**:
   - Redirected to login page
   - URL shows `?returnUrl=/event/{eventId}`
   - Login with valid credentials
   - After login, automatically return to event page
   - Can now click "Save for Later" again

**Verification**:
- Check URL after redirect: Contains `returnUrl` parameter
- After login: Returned to same event page
- Can complete save action after return

---

### Test Scenario 5: Event Cart on Dashboard

**Steps**:
1. Login to volunteer dashboard
2. Navigate to event detail page
3. Click "Save for Later" on multiple events (3-5 events)
4. Return to dashboard
5. **Expected**:
   - Event Cart section shows count: "Event Cart (3)"
   - Each saved event displays with:
     - Event title (clickable)
     - Location
     - Date
     - Remove button (✕)
     - "Apply Now" button

**Verification**:
- Cart displays all saved events
- Event count is accurate
- All event details are correct

---

### Test Scenario 6: Remove from Cart

**Steps**:
1. On dashboard, find Event Cart section
2. Click "✕" button on one of the saved events
3. **Expected**:
   - Event removed from cart immediately
   - Cart count decreases by 1
   - Event no longer appears in list

**Verification**:
- Check Local Storage: Event removed from `event-cart-{userId}`
- Cart count updated correctly
- Event can be saved again

---

### Test Scenario 7: Apply from Cart

**Steps**:
1. On dashboard, find Event Cart section
2. Click "Apply Now" button on a saved event
3. **Expected**:
   - Navigated to event detail page
   - Event details display
   - Can click "Apply Now" to submit application

**Verification**:
- Correct event page loads
- Event data matches saved event
- Can complete application

---

### Test Scenario 8: Cart Persistence

**Steps**:
1. Save 3 events to cart
2. Refresh the page (F5)
3. **Expected**:
   - Cart still shows 3 events
   - All event data is intact

**Verification**:
- Local Storage persists across refresh
- Cart data not lost

---

### Test Scenario 9: Cart Persistence After Logout/Login

**Steps**:
1. Save 3 events to cart
2. Logout
3. Login again with same account
4. **Expected**:
   - Cart still shows 3 events
   - All event data is intact

**Verification**:
- Cart persists across logout/login
- User-specific cart (different user = different cart)

---

### Test Scenario 10: Duplicate Prevention

**Steps**:
1. Save an event to cart
2. Navigate to same event
3. Click "Save for Later" again
4. **Expected**:
   - No duplicate entry created
   - Button still shows "✓ Saved"
   - Cart count remains the same

**Verification**:
- Check Local Storage: Only one entry for event
- Cart count unchanged

---

### Test Scenario 11: Button States

**Steps**:
1. Navigate to event detail page
2. Observe button states:
   - "Save for Later" button
   - "Apply Now" button
3. Click "Save for Later"
4. Observe button state changes
5. Click "Apply Now"
6. Observe button state changes

**Expected States**:
- Initial: "Save for Later" | "Apply Now"
- After save: "✓ Saved" (disabled) | "Apply Now"
- After apply: "Save for Later" | "✓ Applied" (disabled)
- Loading: "Saving..." | "Applying..."

---

### Test Scenario 12: Error Handling

**Steps**:
1. Try to apply to event that's full
2. Try to apply to event that has passed
3. Try to apply twice to same event
4. **Expected**:
   - Appropriate error messages
   - Buttons disabled in correct states
   - Clear user feedback

**Verification**:
- Error messages are clear and helpful
- Buttons prevent invalid actions
- No console errors

---

## Browser DevTools Verification

### Local Storage Check
```javascript
// Open DevTools Console and run:
localStorage.getItem('event-cart-{userId}')

// Should return JSON array:
[
  {
    "id": 1,
    "title": "Beach Cleanup",
    "date": "2025-12-15T09:00:00",
    "location": "Santa Monica Beach",
    "addedAt": "2025-11-27T01:51:00.000Z"
  }
]
```

### Network Tab Check
- POST `/api/applications/events/{eventId}` should return:
  - Status: 201 Created
  - Response body:
    ```json
    {
      "success": true,
      "message": "Successfully applied to event",
      "application": {
        "id": 1,
        "eventId": 1,
        "eventTitle": "Beach Cleanup",
        "volunteerId": 1,
        "volunteerName": "John Doe",
        "status": "PENDING",
        "applicationDate": "2025-11-27T01:51:00"
      }
    }
    ```

### Console Check
- No TypeScript errors
- No 404 errors
- JWT token properly extracted in backend logs

---

## Troubleshooting

### Issue: "Apply Now" button shows error 404
**Solution**:
1. Verify backend is running on `http://localhost:8081`
2. Check VolunteerApplicationController is deployed
3. Verify JWT token is valid
4. Check browser console for exact error message

### Issue: "Save for Later" button not working
**Solution**:
1. Check if user is logged in
2. Check Local Storage is enabled in browser
3. Verify currentUser is set in component
4. Check browser console for errors

### Issue: Event Cart not showing on dashboard
**Solution**:
1. Verify `loadCartEvents()` is called in `ngOnInit()`
2. Check Local Storage for cart data
3. Verify `cartEvents` property is bound in template
4. Check browser console for errors

### Issue: Cart data lost after logout
**Solution**:
1. This is expected behavior (user-specific cart)
2. Cart is stored by userId in Local Storage
3. Different user = different cart
4. To preserve across users, implement backend cart storage

### Issue: Redirect not working after login
**Solution**:
1. Verify `returnUrl` is passed in query params
2. Check login component handles `returnUrl`
3. Verify router navigation is correct
4. Check browser console for routing errors

---

## Performance Testing

### Load Testing
- Save 50+ events to cart
- Verify performance is acceptable
- Check Local Storage size limits

### Memory Testing
- Monitor memory usage with large carts
- Check for memory leaks
- Verify cleanup on logout

---

## Accessibility Testing

- Tab through buttons
- Verify button labels are clear
- Test with screen reader
- Verify color contrast meets WCAG standards
- Test keyboard navigation

---

## Mobile Testing

- Test on iPhone/Android
- Verify buttons are touch-friendly
- Check responsive layout
- Test on slow network (throttle in DevTools)

---

## Final Checklist

- [ ] Apply Now button works when authenticated
- [ ] Apply Now redirects to login when not authenticated
- [ ] Save for Later button works when authenticated
- [ ] Save for Later redirects to login when not authenticated
- [ ] Event Cart displays on dashboard
- [ ] Can remove events from cart
- [ ] Can apply from cart
- [ ] Cart persists after refresh
- [ ] Cart persists after logout/login
- [ ] No duplicate entries in cart
- [ ] Button states update correctly
- [ ] Error messages are clear
- [ ] No console errors
- [ ] Network requests are successful
- [ ] Local Storage data is correct
- [ ] Mobile responsive
- [ ] Accessible with keyboard
- [ ] Works on slow network

---

**Status**: Ready for Testing
**Date**: November 27, 2025
