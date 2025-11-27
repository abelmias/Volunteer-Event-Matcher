# Frontend Quick Start Guide

## 🚀 Getting Started

### Installation
```bash
cd frontend
npm install
ng serve
```

The application will be available at `http://localhost:4200`

## 📱 Application Flow

### 1. Landing Page (Home)
- **URL:** `/`
- **Features:**
  - Hero section with call-to-action
  - Feature highlights
  - Navigation to login/register

### 2. Authentication
- **Login:** `/auth/login`
  - Username and password fields
  - Redirects to dashboard based on role
  
- **Register:** `/auth/register`
  - Full name, username, email, password
  - Role selection (Volunteer/Organizer)
  - Redirects to login on success

### 3. Volunteer Flow
- **Dashboard:** `/volunteer/dashboard`
  - Statistics (applications, approved, hours, events)
  - Recent applications
  - Upcoming events
  - Quick action buttons

- **Browse Events:** `/volunteer/events`
  - Search by title/description
  - Filter by location
  - Event cards with details
  - View details button

- **Event Details:** `/volunteer/events/:id`
  - Full event information
  - Requirements list
  - Apply button
  - Organizer information

### 4. Organizer Flow
- **Dashboard:** `/organizer/dashboard`
  - Statistics (events, applications, approved, volunteers)
  - Recent events
  - Pending applications
  - Quick action buttons

- **Manage Events:** `/organizer/events`
  - Create new event form
  - List of created events
  - Edit/delete/publish buttons
  - Form validation

- **Review Applications:** `/organizer/applications`
  - Filter by status (Pending/Approved/Rejected)
  - Volunteer information
  - Approve/reject buttons
  - Application statistics

### 5. Notifications
- **Notification Center:** `/notifications`
  - All notifications list
  - Mark as read
  - Delete notifications
  - Filter by status

## 🔧 Key Services

### AuthService
```typescript
// Login
authService.login(credentials).subscribe(response => {
  // Handle login response
});

// Register
authService.register(userData).subscribe(response => {
  // Handle registration
});

// Logout
authService.logout();

// Check if logged in
authService.isLoggedIn();

// Get current user
authService.currentUserValue;
```

### EventService
```typescript
// Get upcoming events
eventService.getUpcomingEvents(page, size).subscribe(events => {});

// Get event by ID
eventService.getEventById(id).subscribe(event => {});

// Create event
eventService.createEvent(eventData).subscribe(response => {});

// Update event
eventService.updateEvent(id, eventData).subscribe(response => {});

// Delete event
eventService.deleteEvent(id).subscribe(response => {});

// Publish event
eventService.publishEvent(id).subscribe(response => {});
```

### ApplicationService
```typescript
// Apply to event
applicationService.applyToEvent(eventId).subscribe(response => {});

// Get volunteer applications
applicationService.getVolunteerApplications(volunteerId).subscribe(apps => {});

// Approve application
applicationService.approveApplication(id).subscribe(response => {});

// Reject application
applicationService.rejectApplication(id).subscribe(response => {});

// Withdraw application
applicationService.withdrawApplication(id).subscribe(response => {});
```

### NotificationService
```typescript
// Get notifications
notificationService.getNotifications(page, size).subscribe(notifications => {});

// Mark as read
notificationService.markAsRead(id).subscribe(response => {});

// Delete notification
notificationService.deleteNotification(id).subscribe(response => {});
```

## 🎨 Styling & Themes

### Color Palette
- **Primary (Purple):** `#667eea` to `#764ba2`
- **Success (Green):** `#28a745` to `#20c997`
- **Info (Teal):** `#17a2b8` to `#20c997`
- **Danger (Red):** `#dc3545`
- **Warning (Yellow):** `#ffc107`

### Bootstrap Classes Used
- Grid system (row, col-*)
- Cards, buttons, forms
- Alerts, badges, spinners
- Navbar, navigation
- Responsive utilities

## 📝 Form Validation

### Login Form
- Username: Required, min 3 characters
- Password: Required, min 6 characters

### Register Form
- Full Name: Required, min 2 characters
- Username: Required, min 3 characters, max 50
- Email: Required, valid email format
- Password: Required, min 6 characters
- Confirm Password: Must match password
- Role: Required (Volunteer/Organizer)

### Event Form
- Title: Required, min 5 characters
- Description: Required, min 20 characters
- Location: Required
- Date: Required
- Duration: Required, min 1 hour
- Volunteers Needed: Required, min 1
- Event Type: Required
- Latitude: Required
- Longitude: Required

## 🔐 Security

### JWT Token Handling
- Token stored in `localStorage` as `token`
- Automatically added to all API requests via JWT interceptor
- Token cleared on logout

### Protected Routes
- Auth guard prevents access to protected pages without login
- Role-based navigation (Volunteer vs Organizer)
- Automatic redirect to login if not authenticated

## 🐛 Debugging

### Enable Debug Mode
```typescript
// In main.ts
import { enableDebugTools } from '@angular/platform-browser';
enableDebugTools(componentRef);
```

### Check Console
- Open browser DevTools (F12)
- Check Console tab for errors
- Check Network tab for API calls

### Common Issues
1. **CORS errors:** Ensure backend is running on `localhost:8080`
2. **404 errors:** Check API endpoints in services
3. **Login fails:** Verify credentials and backend response
4. **Page not loading:** Check routing configuration

## 📦 Dependencies

- Angular 14.2.0
- Bootstrap 5.2.3
- Leaflet 1.9.4 (for maps)
- RxJS 7.5.0
- TypeScript 4.7.2

## 🚀 Deployment

### Build for Production
```bash
ng build --configuration production
```

### Output
- Optimized bundle in `dist/volunteer-event-matcher/`
- Ready for deployment to web server

## 📚 Additional Resources

- [Angular Documentation](https://angular.io/docs)
- [Bootstrap Documentation](https://getbootstrap.com/docs)
- [Leaflet Documentation](https://leafletjs.com/)
- [RxJS Documentation](https://rxjs.dev/)

## 💡 Tips & Tricks

1. **Use Angular DevTools** for component inspection
2. **Enable production mode** for better performance
3. **Use lazy loading** for faster initial load
4. **Implement service caching** for repeated API calls
5. **Use trackBy** in *ngFor for better performance

---

**Last Updated:** November 24, 2025
**Frontend Version:** 1.0.0
**Status:** Production Ready ✅
