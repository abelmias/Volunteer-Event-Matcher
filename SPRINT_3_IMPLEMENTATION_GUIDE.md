# Sprint 3: Complete Implementation Guide

## 🎯 Sprint 3 Overview

**Duration:** 3 weeks  
**Status:** Phase 1 Complete ✅ | Phases 2-6 Pending  
**Objective:** Frontend-Backend Integration & Enhanced Features

---

## 📊 Sprint 3 Phases Breakdown

### Phase 1: User Profile Management ✅ COMPLETE
**Status:** Backend 100% Complete | Frontend Ready to Start

**What's Done:**
- ✅ VolunteerProfileDTO created
- ✅ OrganizerProfileDTO created
- ✅ VolunteerSkillDTO created
- ✅ ProfileService implemented (8 methods)
- ✅ ProfileController implemented (10 endpoints)
- ✅ VolunteerSkillRepository enhanced (2 new query methods)

**Files Created:** 5  
**Total Endpoints:** 10  
**Total Methods:** 8

**Next:** Implement frontend components for profile management

---

### Phase 2: Event Management ⏳ PENDING
**Estimated Duration:** 1.5 weeks

**Tasks:**
1. Create EventFormDTO
2. Enhance EventService with CRUD operations
3. Create/Update EventController endpoints
4. Create EventRequiredSkillController
5. Implement frontend Event Form Component
6. Implement frontend Event List Component with filters
7. Implement frontend Event Detail Component enhancements

**Endpoints to Create:**
```
POST   /api/events                    - Create event
PUT    /api/events/{id}               - Update event
DELETE /api/events/{id}               - Delete event
GET    /api/events/{id}               - Get event details
POST   /api/events/{id}/publish       - Publish event
GET    /api/events                    - List all events (with pagination)
GET    /api/events/upcoming/published - Get upcoming published events
GET    /api/events?filters            - Filter events
GET    /api/events/organizer/{id}     - Get organizer's events
POST   /api/events/{id}/required-skills - Add required skill
DELETE /api/events/{id}/required-skills/{skillId} - Remove required skill
```

**DTOs to Create:**
- EventFormDTO (for creation/editing)
- EventFilterDTO (for filtering)
- EventRequiredSkillDTO

---

### Phase 3: Application Workflow ⏳ PENDING
**Estimated Duration:** 1 week

**Tasks:**
1. Enhance VolunteerApplicationService
2. Create/Update VolunteerApplicationController
3. Implement frontend Application Form Component
4. Implement frontend Application Management Component
5. Implement approve/reject functionality

**Endpoints to Create:**
```
POST   /api/applications/events/{eventId}        - Apply to event
GET    /api/applications/volunteer/{volunteerId} - Get volunteer's applications
GET    /api/applications/event/{eventId}         - Get event applications
POST   /api/applications/{id}/approve            - Approve application
POST   /api/applications/{id}/reject             - Reject application
POST   /api/applications/{id}/withdraw           - Withdraw application
PUT    /api/applications/{id}                    - Update application (feedback/rating)
```

---

### Phase 4: Notification System ⏳ PENDING
**Estimated Duration:** 1 week

**Tasks:**
1. Enhance NotificationService
2. Create/Update NotificationController
3. Implement frontend Notification Bell Component
4. Implement frontend Notification Center Component
5. Add real-time notification count

**Endpoints to Create:**
```
GET    /api/notifications                 - Get all notifications
GET    /api/notifications?unread=true     - Get unread notifications
PUT    /api/notifications/{id}/read       - Mark as read
DELETE /api/notifications/{id}            - Delete notification
POST   /api/notifications/mark-all-read   - Mark all as read
```

---

### Phase 5: Search & Filtering ⏳ PENDING
**Estimated Duration:** 1 week

**Tasks:**
1. Create SearchFilterDTO
2. Enhance EventService with search methods
3. Create SearchController
4. Implement frontend Advanced Search Component
5. Implement frontend Map-based Search Component
6. Add location-based filtering

**Endpoints to Create:**
```
GET /api/search/events?query={query}                           - Search events
GET /api/search/events/nearby?lat={lat}&lon={lon}&radius={km}  - Nearby events
GET /api/search/events?location={location}&type={type}&date={date} - Filter events
```

---

### Phase 6: Route Guards & Security ⏳ PENDING
**Estimated Duration:** 1 week

**Tasks:**
1. Create AuthGuard
2. Create RoleGuard (VolunteerGuard, OrganizerGuard)
3. Create JWT Interceptor
4. Implement route protection
5. Add error handling for unauthorized access

**Guards to Create:**
- AuthGuard: Checks if user is authenticated
- VolunteerGuard: Checks if user is a volunteer
- OrganizerGuard: Checks if user is an organizer
- AdminGuard: Checks if user is an admin

**Interceptor to Create:**
- JwtInterceptor: Adds JWT token to all requests

---

## 🚀 How to Proceed

### Step 1: Build and Test Phase 1 Backend
```bash
cd backend
mvn clean compile
mvn spring-boot:run
```

### Step 2: Create Frontend Interfaces (TypeScript)
Create the following files in `frontend/src/app/models/`:
- `volunteer-profile.ts`
- `organizer-profile.ts`
- `volunteer-skill.ts`

### Step 3: Create ProfileService (Frontend)
Create `frontend/src/app/services/profile.service.ts`

### Step 4: Create Profile Components
Create components in `frontend/src/app/components/`:
- `volunteer/profile/`
- `organizer/profile/`
- `shared/skills-management/`

### Step 5: Integrate with Existing Components
Update existing components to use ProfileService

### Step 6: Test End-to-End
Test the complete flow from frontend to backend

---

## 📋 Implementation Checklist

### Phase 1: User Profile Management
- [x] Backend DTOs created
- [x] Backend Service created
- [x] Backend Controller created
- [x] Repository methods added
- [ ] Frontend interfaces created
- [ ] Frontend service created
- [ ] Frontend components created
- [ ] End-to-end testing completed

### Phase 2: Event Management
- [ ] Backend DTOs created
- [ ] Backend Service enhanced
- [ ] Backend Controller created
- [ ] Frontend interfaces created
- [ ] Frontend service enhanced
- [ ] Frontend components created
- [ ] End-to-end testing completed

### Phase 3: Application Workflow
- [ ] Backend Service enhanced
- [ ] Backend Controller created
- [ ] Frontend interfaces created
- [ ] Frontend service enhanced
- [ ] Frontend components created
- [ ] End-to-end testing completed

### Phase 4: Notification System
- [ ] Backend Service enhanced
- [ ] Backend Controller created
- [ ] Frontend interfaces created
- [ ] Frontend service enhanced
- [ ] Frontend components created
- [ ] End-to-end testing completed

### Phase 5: Search & Filtering
- [ ] Backend DTOs created
- [ ] Backend Service enhanced
- [ ] Backend Controller created
- [ ] Frontend interfaces created
- [ ] Frontend service enhanced
- [ ] Frontend components created
- [ ] End-to-end testing completed

### Phase 6: Route Guards & Security
- [ ] AuthGuard created
- [ ] RoleGuards created
- [ ] JWT Interceptor created
- [ ] Routes protected
- [ ] Error handling implemented
- [ ] End-to-end testing completed

---

## 🔗 API Base URL
```
http://localhost:8081/api
```

## 🔐 Authentication
All protected endpoints require JWT token in Authorization header:
```
Authorization: Bearer YOUR_JWT_TOKEN
```

## 📝 Response Format
All responses follow this format:
```json
{
  "status": "success" or "error",
  "message": "Response message",
  "data": { /* response data */ }
}
```

## 🧪 Testing Tools
- **Postman:** For API testing
- **cURL:** For command-line testing
- **Angular DevTools:** For frontend debugging
- **Chrome DevTools:** For network inspection

---

## 📚 Documentation Files

- `SPRINT_3_PLAN.md` - High-level sprint planning
- `SPRINT_3_PHASE1_COMPLETE.md` - Phase 1 detailed documentation
- `SPRINT_3_IMPLEMENTATION_GUIDE.md` - This file

---

## 🎯 Success Criteria

### For Each Phase:
1. ✅ All backend endpoints implemented and tested
2. ✅ All frontend services created
3. ✅ All frontend components created
4. ✅ End-to-end integration tested
5. ✅ Error handling implemented
6. ✅ Documentation updated

### Overall Sprint Success:
- ✅ All 6 phases completed
- ✅ All endpoints functional
- ✅ All components working
- ✅ Full integration tested
- ✅ Ready for deployment

---

## 💡 Best Practices

### Backend
1. Always use DTOs for API responses
2. Implement proper error handling
3. Add logging for debugging
4. Use @Transactional for database operations
5. Validate input on both client and server
6. Return appropriate HTTP status codes

### Frontend
1. Use TypeScript interfaces for type safety
2. Implement proper error handling
3. Add loading states for async operations
4. Use RxJS operators for stream management
5. Implement route guards for protection
6. Add user feedback (toasts, alerts)

---

## 🔄 Development Workflow

1. **Plan:** Define requirements and design
2. **Implement Backend:** Create DTOs, Services, Controllers
3. **Test Backend:** Use Postman or cURL
4. **Implement Frontend:** Create interfaces, services, components
5. **Integrate:** Connect frontend to backend
6. **Test:** End-to-end testing
7. **Document:** Update documentation
8. **Deploy:** Push to production

---

## 📞 Support & Troubleshooting

### Common Issues

**Backend won't start:**
- Check if port 8081 is available
- Verify database connection
- Check for compilation errors

**Frontend can't connect to backend:**
- Verify backend is running on port 8081
- Check CORS configuration
- Verify API URL in services

**JWT token errors:**
- Ensure token is included in Authorization header
- Check token expiration
- Verify token format (Bearer <token>)

---

**Sprint 3 Implementation Guide - COMPLETE ✅**
**Last Updated:** 2025-11-25**
**Status:** Ready for Phase 2 Implementation 🚀
