# Volunteer Event Matcher - Complete Project Checklist (Part 2: Sprint 3-4)

---

## 📋 SPRINT 3: Construction - Map Integration (10% Feature) (4 Days)

### Goal
Deliver the unique map utility feature for filtering by proximity.

### 3.1 Proximity Search API (Backend) (1 Day)

- [ ] **3.1.1** Create Haversine Distance Calculator
  - [ ] `DistanceCalculator` utility class
  - [ ] Method: `calculateDistance(lat1, lon1, lat2, lon2)` - Returns distance in km
  - [ ] Formula: Haversine formula for great-circle distance
  - [ ] Add Javadoc with formula explanation
  - [ ] Create unit tests

- [ ] **3.1.2** Create Proximity Search Service
  - [ ] `ProximitySearchService` with methods:
    - [ ] `findEventsWithinRadius(userLat, userLon, radiusKm)` - Returns list of events within radius
    - [ ] `findNearestEvents(userLat, userLon, limit)` - Returns N nearest events
  - [ ] Use `DistanceCalculator` for distance calculation
  - [ ] Add Javadoc

- [ ] **3.1.3** Create Proximity Search Controller
  - [ ] `GET /api/events/proximity?lat=X&lon=Y&radius=R` - Search by radius
  - [ ] `GET /api/events/nearest?lat=X&lon=Y&limit=N` - Get nearest events
  - [ ] Add input validation (lat/lon ranges, radius > 0)
  - [ ] Return events sorted by distance
  - [ ] Add Javadoc

- [ ] **3.1.4** Create Proximity Search Tests
  - [ ] Test distance calculation accuracy
  - [ ] Test proximity search with various radii
  - [ ] Test edge cases (0 km radius, very large radius)
  - [ ] Test nearest events sorting

**Commit:** `FEAT(map): implement haversine distance calculation and proximity search API`

---

### 3.2 Map & Marker Display (Frontend) (1 Day)

- [ ] **3.2.1** Install LeafletJS Dependencies
  - [ ] Add `leaflet` to `package.json`
  - [ ] Add `@types/leaflet` for TypeScript support
  - [ ] Run `npm install`

- [ ] **3.2.2** Create Map Component
  - [ ] `event-map.component.ts` and `.html`
  - [ ] Initialize Leaflet map with default center (e.g., city center)
  - [ ] Add map container with proper styling
  - [ ] Set zoom level and map controls

- [ ] **3.2.3** Create Event Markers
  - [ ] Display markers for each event
  - [ ] Use event latitude/longitude for marker position
  - [ ] Add marker popups with event info (title, date, location)
  - [ ] Use different marker colors for different event types (optional)
  - [ ] Add click handler to add event to collection

- [ ] **3.2.4** Create Map Service (Angular)
  - [ ] `MapService` with methods:
    - [ ] `initializeMap(containerId, center, zoom)`
    - [ ] `addMarker(lat, lon, eventData)`
    - [ ] `clearMarkers()`
    - [ ] `fitBounds(markers)` - Auto-zoom to show all markers
  - [ ] Handle map interactions

- [ ] **3.2.5** Integrate Map into Event Browse
  - [ ] Add map display alongside event list
  - [ ] Sync map markers with event list
  - [ ] Highlight marker when event selected in list
  - [ ] Highlight event in list when marker clicked

- [ ] **3.2.6** Create Map Display Tests
  - [ ] Test map initialization
  - [ ] Test marker rendering
  - [ ] Test marker click handling
  - [ ] Test map bounds fitting

**Commit:** `FEAT(map): integrate LeafletJS and display event markers`

---

### 3.3 Proximity Filter UI (1 Day)

- [ ] **3.3.1** Create Proximity Filter Component
  - [ ] `proximity-filter.component.ts` and `.html`
  - [ ] Input fields: latitude, longitude, radius (km)
  - [ ] Button: "Search by Proximity"
  - [ ] Display results count

- [ ] **3.3.2** Add Location Input Options
  - [ ] Manual lat/lon input
  - [ ] Option: Use browser geolocation API to get user's current location
  - [ ] Option: Search by city/zip code (requires geocoding API)
  - [ ] Validate input before submission

- [ ] **3.3.3** Create Proximity Filter Service (Angular)
  - [ ] `ProximityFilterService` with methods:
    - [ ] `searchByProximity(lat, lon, radius)` - Call backend API
    - [ ] `getUserLocation()` - Get browser geolocation
    - [ ] `geocodeAddress(address)` - Convert address to lat/lon (optional)
  - [ ] Handle HTTP errors

- [ ] **3.3.4** Integrate Proximity Filter into Map
  - [ ] Add filter form above/beside map
  - [ ] Update map markers when filter applied
  - [ ] Show filtered events in list
  - [ ] Display distance to each event

- [ ] **3.3.5** Add Radius Slider (Optional Enhancement)
  - [ ] Add slider for easy radius adjustment
  - [ ] Real-time map update as slider moves
  - [ ] Show radius circle on map

- [ ] **3.3.6** Create Proximity Filter Tests
  - [ ] Test filter form submission
  - [ ] Test geolocation retrieval
  - [ ] Test map update after filter
  - [ ] Test distance display

**Commit:** `FEAT(map): implement proximity filter UI and integration`

---

### 3.4 Documentation Update (0.5 Day)

- [ ] **3.4.1** Update Design Documentation
  - [ ] Add section: "Map Integration Architecture"
  - [ ] Explain Haversine formula and its use
  - [ ] Document LeafletJS integration approach
  - [ ] Include diagrams showing data flow

- [ ] **3.4.2** Update API Documentation
  - [ ] Document proximity search endpoints
  - [ ] Include example requests/responses
  - [ ] Document distance calculation formula

- [ ] **3.4.3** Update User Guide
  - [ ] Add section: "Using the Map to Find Events"
  - [ ] Explain proximity search feature
  - [ ] Include screenshots

- [ ] **3.4.4** Create `MAP_INTEGRATION.md`
  - [ ] Technical details of map implementation
  - [ ] LeafletJS configuration
  - [ ] Marker customization options
  - [ ] Performance considerations

**Commit:** `DOCS(sprint3): update documentation for map integration feature`

---

### 3.5 Sprint 3 Testing & Review

- [ ] **3.5.1** End-to-End Map Testing
  - [ ] Test full proximity search workflow
  - [ ] Test map display with various event distributions
  - [ ] Test marker interactions
  - [ ] Test performance with many events (100+)

- [ ] **3.5.2** Code Review
  - [ ] Verify all Javadoc present
  - [ ] Verify naming conventions followed
  - [ ] Verify no hardcoded values
  - [ ] Verify map performance optimized

- [ ] **3.5.3** User Acceptance Testing
  - [ ] Test with actual volunteers (if possible)
  - [ ] Gather feedback on map usability
  - [ ] Verify proximity filtering works as expected

**Commit:** `CHORE(sprint3): final code review and testing`

---

---

## 📋 SPRINT 4: Transition - Polish, Testing & Final Deliverables (4 Days)

### Goal
Ensure all rubric requirements are met, finalize code quality, and prepare demo and documentation.

### 4.1 Comprehensive Code Review (1 Day)

- [ ] **4.1.1** Backend Code Audit
  - [ ] Verify all classes have Javadoc
  - [ ] Verify all methods have Javadoc with `@param`, `@return`, `@throws`
  - [ ] Verify naming conventions followed (PascalCase classes, camelCase methods)
  - [ ] Verify no hardcoded values (use constants or config)
  - [ ] Verify no unused imports
  - [ ] Verify proper exception handling
  - [ ] Verify transactional boundaries correct

- [ ] **4.1.2** Frontend Code Audit
  - [ ] Verify all components have TSDoc comments
  - [ ] Verify all services have TSDoc comments
  - [ ] Verify naming conventions followed
  - [ ] Verify no hardcoded values
  - [ ] Verify no unused imports
  - [ ] Verify proper error handling
  - [ ] Verify responsive design

- [ ] **4.1.3** Code Refactoring
  - [ ] Extract common code into utility methods
  - [ ] Remove code duplication
  - [ ] Simplify complex methods
  - [ ] Improve readability

- [ ] **4.1.4** Security Review
  - [ ] Verify passwords hashed (BCrypt)
  - [ ] Verify SQL injection prevention (use parameterized queries)
  - [ ] Verify authorization checks on all protected endpoints
  - [ ] Verify no sensitive data in logs
  - [ ] Verify CORS configured properly

- [ ] **4.1.5** Performance Review
  - [ ] Verify database queries optimized (use indexes)
  - [ ] Verify N+1 query problems resolved
  - [ ] Verify lazy loading used where appropriate
  - [ ] Verify API responses paginated
  - [ ] Verify map rendering optimized

**Commit:** `REFACTOR(sprint4): comprehensive code review and optimization`

---

### 4.2 Comprehensive Testing (1 Day)

- [ ] **4.2.1** Unit Tests
  - [ ] Test all service methods
  - [ ] Test all utility methods
  - [ ] Test all DTOs and validation
  - [ ] Aim for 80%+ code coverage

- [ ] **4.2.2** Integration Tests
  - [ ] Test full auth flow
  - [ ] Test full event CRUD flow
  - [ ] Test full collection management flow
  - [ ] Test full commit flow
  - [ ] Test proximity search flow
  - [ ] Test database persistence

- [ ] **4.2.3** End-to-End Tests (E2E)
  - [ ] Test complete user workflows
  - [ ] Admin: login → create event → edit → delete
  - [ ] Helper: login → browse → search → add to collection → commit
  - [ ] Helper: login → view collection → remove event
  - [ ] Helper: logout → login → verify collection persisted
  - [ ] Helper: use map to find nearby events

- [ ] **4.2.4** Performance Tests
  - [ ] Test with 100+ events
  - [ ] Test with 50+ concurrent users
  - [ ] Test proximity search performance
  - [ ] Test map rendering with many markers

- [ ] **4.2.5** Security Tests
  - [ ] Test unauthorized access to admin endpoints
  - [ ] Test unauthorized access to other user's collection
  - [ ] Test SQL injection prevention
  - [ ] Test password hashing

- [ ] **4.2.6** Browser Compatibility Tests
  - [ ] Test on Chrome, Firefox, Safari, Edge
  - [ ] Test responsive design on mobile/tablet

**Commit:** `TEST(sprint4): comprehensive test suite and coverage`

---

### 4.3 Demo Script Finalization (0.5 Day)

- [ ] **4.3.1** Create Demo Script Document
  - [ ] Detailed step-by-step instructions
  - [ ] Include all required features:
    - [ ] Authentication (login as admin, login as helper)
    - [ ] Admin CRUD (create, edit, delete events)
    - [ ] Helper browsing and searching
    - [ ] Adding/removing from collection
    - [ ] Committing collection
    - [ ] Collection persistence
    - [ ] Map display and proximity filtering
  - [ ] Include expected outcomes for each step
  - [ ] Include troubleshooting tips

- [ ] **4.3.2** Prepare Demo Data
  - [ ] Create sample events with realistic data
  - [ ] Include events at various locations
  - [ ] Include events with different dates
  - [ ] Create sample user accounts

- [ ] **4.3.3** Create Demo Presentation Slides
  - [ ] Project overview
  - [ ] Architecture overview
  - [ ] Key features
  - [ ] Demo walkthrough
  - [ ] Q&A

- [ ] **4.3.4** Assign Speaking Parts
  - [ ] Intro: Project overview and motivation
  - [ ] Architecture: System design and technology stack
  - [ ] Demo: Live walkthrough of features
  - [ ] Conclusion: Lessons learned and future enhancements

**Deliverable:** Demo script and presentation ready

---

### 4.4 Final Design Documentation (1 Day)

- [ ] **4.4.1** Review and Update All Documents
  - [ ] Vision document - verify still accurate
  - [ ] Domain model - verify complete and accurate
  - [ ] Database design - verify all tables documented
  - [ ] Architecture - verify all layers documented
  - [ ] API endpoints - verify all endpoints documented
  - [ ] Code standards - verify followed throughout

- [ ] **4.4.2** Create Comprehensive Design Document
  - [ ] Table of contents
  - [ ] Executive summary
  - [ ] Problem statement and solution
  - [ ] Domain model with UML diagram
  - [ ] Database design with ERD
  - [ ] Architecture overview with diagrams
  - [ ] API endpoints with examples
  - [ ] Map integration details (Haversine formula, LeafletJS)
  - [ ] Security considerations
  - [ ] Performance considerations
  - [ ] Deployment instructions
  - [ ] Troubleshooting guide

- [ ] **4.4.3** Create User Guide
  - [ ] Getting started
  - [ ] Admin user guide
  - [ ] Helper user guide
  - [ ] Map feature guide
  - [ ] FAQ

- [ ] **4.4.4** Create Developer Guide
  - [ ] Project setup instructions
  - [ ] Build and run instructions
  - [ ] Testing instructions
  - [ ] Deployment instructions
  - [ ] Code style guidelines
  - [ ] Contributing guidelines

- [ ] **4.4.5** Create Installation & Deployment Guide
  - [ ] System requirements
  - [ ] Database setup
  - [ ] Backend setup and configuration
  - [ ] Frontend setup and configuration
  - [ ] Running the application
  - [ ] Docker setup (optional)

**Commit:** `DOCS(sprint4): finalize comprehensive design documentation`

---

### 4.5 Final System Test (1 Day)

- [ ] **4.5.1** Full System Integration Test
  - [ ] Test all features working together
  - [ ] Test data consistency across components
  - [ ] Test error handling and recovery
  - [ ] Test system stability under load

- [ ] **4.5.2** User Acceptance Testing (UAT)
  - [ ] Test with actual users (if possible)
  - [ ] Verify all requirements met
  - [ ] Gather feedback
  - [ ] Fix any issues found

- [ ] **4.5.3** Regression Testing
  - [ ] Re-test all Sprint 1-3 features
  - [ ] Verify no new bugs introduced
  - [ ] Verify performance not degraded

- [ ] **4.5.4** Production Readiness Checklist
  - [ ] All tests passing
  - [ ] All documentation complete
  - [ ] All code reviewed and approved
  - [ ] Security vulnerabilities addressed
  - [ ] Performance optimized
  - [ ] Error handling comprehensive
  - [ ] Logging configured
  - [ ] Database backups configured
  - [ ] Deployment process documented

**Commit:** `TEST(sprint4): final system testing and production readiness`

---

### 4.6 Team Retrospective & Final Submission (0.5 Day)

- [ ] **4.6.1** Conduct Team Retrospective
  - [ ] What went well?
    - [ ] Successful API design
    - [ ] Good separation of concerns
    - [ ] Effective use of Spring Boot and Angular
  - [ ] What could be improved?
    - [ ] Initial challenges with Angular/DB setup
    - [ ] Time management
    - [ ] Communication
  - [ ] What did we learn?
    - [ ] Full-stack development skills
    - [ ] Team collaboration
    - [ ] Problem-solving approaches
  - [ ] Create `RETROSPECTIVE.md`

- [ ] **4.6.2** Create Final Submission Package
  - [ ] All source code committed to GitHub
  - [ ] All documentation complete
  - [ ] All tests passing
  - [ ] README with setup instructions
  - [ ] Demo script ready
  - [ ] Presentation slides ready

- [ ] **4.6.3** Verify GitHub Repository
  - [ ] All commits present
  - [ ] Branching strategy followed
  - [ ] Commit messages follow conventions
  - [ ] All documentation in repo
  - [ ] README complete and clear

- [ ] **4.6.4** Prepare for Final Presentation
  - [ ] Test demo on clean system
  - [ ] Verify all features work
  - [ ] Prepare backup demo (video)
  - [ ] Practice presentation
  - [ ] Prepare for Q&A

**Commit:** `CHORE(sprint4): final retrospective and submission preparation`

---

### 4.7 Final Submission Deliverables

- [ ] **GitHub Repository**
  - [ ] All source code
  - [ ] All documentation
  - [ ] README with setup instructions
  - [ ] .gitignore configured
  - [ ] Commit history showing progression

- [ ] **Design Documentation PDF**
  - [ ] Vision, domain model, ERD, architecture
  - [ ] API documentation
  - [ ] Map integration details

- [ ] **User & Developer Guides**
  - [ ] User guide for admin and helpers
  - [ ] Developer guide for setup and deployment
  - [ ] Troubleshooting guide

- [ ] **Demo Presentation**
  - [ ] Slides covering all features
  - [ ] Demo script with step-by-step instructions
  - [ ] Live demo or video backup

- [ ] **Test Results**
  - [ ] Unit test results
  - [ ] Integration test results
  - [ ] E2E test results
  - [ ] Code coverage report

- [ ] **Retrospective Document**
  - [ ] Team reflection on project
  - [ ] Lessons learned
  - [ ] Future improvements

---

---

## 📋 ADDITIONAL NOTES

### Contribution Documentation (Since Partner is Unavailable)

- [ ] Create `CONTRIBUTIONS.md` documenting:
  - [ ] Tasks completed by primary developer
  - [ ] Commits made on behalf of partner (with clear notation)
  - [ ] Partner's planned contributions (if any)
  - [ ] Explanation of solo work arrangement

### GitHub Commit Strategy for Partner

- [ ] When making commits on behalf of partner:
  - [ ] Use commit message format: `FEAT(scope): description [by Partner Name]`
  - [ ] Or use `Co-authored-by: Partner Name <email>` in commit message
  - [ ] Document in `CONTRIBUTIONS.md` which commits are on behalf of partner

### Trello Board Management

- [ ] Update Trello to reflect solo work:
  - [ ] Mark tasks assigned to partner as "Solo - Primary Dev"
  - [ ] Add comments explaining arrangement
  - [ ] Ensure instructor can see work distribution

### Slack Communication

- [ ] Post regular updates in Slack:
  - [ ] Sprint progress
  - [ ] Blockers and resolutions
  - [ ] Completed features
  - [ ] Upcoming work

---

**END OF PART 2 - PROJECT CHECKLIST COMPLETE**
