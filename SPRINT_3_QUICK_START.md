# Sprint 3: Quick Start Guide

## 🚀 Getting Started with Sprint 3

### Prerequisites
- Java 11+
- Maven 3.6+
- Node.js 14+
- Angular CLI 14+
- Git

---

## 📋 Phase 1: User Profile Management - QUICK START

### Backend Setup

#### 1. Build the Backend
```bash
cd backend
mvn clean compile
```

#### 2. Start the Backend
```bash
mvn spring-boot:run
```

Backend will start on `http://localhost:8081/api`

#### 3. Test the Endpoints

**Create Volunteer Profile:**
```bash
curl -X POST http://localhost:8081/api/profiles/volunteer \
  -H "Content-Type: application/json" \
  -d '{
    "userId": 2,
    "yearsOfExperience": 3,
    "availabilityStatus": "AVAILABLE",
    "preferredEventTypes": "Community Service",
    "bioExtended": "Passionate volunteer"
  }'
```

**Get Volunteer Profile:**
```bash
curl -X GET http://localhost:8081/api/profiles/volunteer/2
```

**Add Volunteer Skill:**
```bash
curl -X POST http://localhost:8081/api/profiles/volunteer/2/skills \
  -H "Content-Type: application/json" \
  -d '{
    "skillId": 1,
    "proficiencyLevel": "INTERMEDIATE"
  }'
```

**Get Volunteer Skills:**
```bash
curl -X GET http://localhost:8081/api/profiles/volunteer/2/skills
```

### Frontend Setup

#### 1. Create TypeScript Interfaces
Create `frontend/src/app/models/profiles.ts`:
```typescript
export interface VolunteerProfile {
  id: number;
  userId: number;
  yearsOfExperience: number;
  availabilityStatus: string;
  preferredEventTypes: string;
  bioExtended: string;
  verificationStatus: string;
  backgroundCheckCompleted: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface OrganizerProfile {
  id: number;
  userId: number;
  organizationName: string;
  organizationDescription: string;
  organizationWebsite: string;
  organizationPhone: string;
  registrationNumber: string;
  verificationStatus: string;
  createdAt: string;
  updatedAt: string;
}

export interface VolunteerSkill {
  id: number;
  volunteerId: number;
  skillId: number;
  proficiencyLevel: string;
  endorsementCount: number;
  createdAt: string;
  updatedAt: string;
}
```

#### 2. Create ProfileService
Create `frontend/src/app/services/profile.service.ts`:
```typescript
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { VolunteerProfile, OrganizerProfile, VolunteerSkill } from '../models/profiles';

@Injectable({ providedIn: 'root' })
export class ProfileService {
  private apiUrl = 'http://localhost:8081/api/profiles';

  constructor(private http: HttpClient) {}

  // Volunteer Profile Methods
  getVolunteerProfile(userId: number): Observable<VolunteerProfile> {
    return this.http.get<VolunteerProfile>(`${this.apiUrl}/volunteer/${userId}`);
  }

  createVolunteerProfile(profile: VolunteerProfile): Observable<VolunteerProfile> {
    return this.http.post<VolunteerProfile>(`${this.apiUrl}/volunteer`, profile);
  }

  updateVolunteerProfile(profileId: number, profile: VolunteerProfile): Observable<VolunteerProfile> {
    return this.http.put<VolunteerProfile>(`${this.apiUrl}/volunteer/${profileId}`, profile);
  }

  // Organizer Profile Methods
  getOrganizerProfile(userId: number): Observable<OrganizerProfile> {
    return this.http.get<OrganizerProfile>(`${this.apiUrl}/organizer/${userId}`);
  }

  createOrganizerProfile(profile: OrganizerProfile): Observable<OrganizerProfile> {
    return this.http.post<OrganizerProfile>(`${this.apiUrl}/organizer`, profile);
  }

  updateOrganizerProfile(profileId: number, profile: OrganizerProfile): Observable<OrganizerProfile> {
    return this.http.put<OrganizerProfile>(`${this.apiUrl}/organizer/${profileId}`, profile);
  }

  // Volunteer Skill Methods
  getVolunteerSkills(volunteerId: number): Observable<VolunteerSkill[]> {
    return this.http.get<VolunteerSkill[]>(`${this.apiUrl}/volunteer/${volunteerId}/skills`);
  }

  addVolunteerSkill(volunteerId: number, skill: VolunteerSkill): Observable<VolunteerSkill> {
    return this.http.post<VolunteerSkill>(`${this.apiUrl}/volunteer/${volunteerId}/skills`, skill);
  }

  updateVolunteerSkill(skillId: number, skill: VolunteerSkill): Observable<VolunteerSkill> {
    return this.http.put<VolunteerSkill>(`${this.apiUrl}/skills/${skillId}`, skill);
  }

  removeVolunteerSkill(volunteerId: number, skillId: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/volunteer/${volunteerId}/skills/${skillId}`);
  }
}
```

#### 3. Create Profile Component
Create `frontend/src/app/components/volunteer/profile/profile.component.ts`:
```typescript
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProfileService } from '../../../services/profile.service';
import { VolunteerProfile, VolunteerSkill } from '../../../models/profiles';

@Component({
  selector: 'app-volunteer-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class VolunteerProfileComponent implements OnInit {
  profile: VolunteerProfile | null = null;
  skills: VolunteerSkill[] = [];
  loading = false;
  error = '';

  constructor(
    private profileService: ProfileService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    const userId = +this.route.snapshot.paramMap.get('userId')!;
    this.loadProfile(userId);
    this.loadSkills(userId);
  }

  loadProfile(userId: number): void {
    this.loading = true;
    this.profileService.getVolunteerProfile(userId).subscribe(
      (profile) => {
        this.profile = profile;
        this.loading = false;
      },
      (error) => {
        this.error = 'Failed to load profile';
        this.loading = false;
      }
    );
  }

  loadSkills(volunteerId: number): void {
    this.profileService.getVolunteerSkills(volunteerId).subscribe(
      (skills) => {
        this.skills = skills;
      },
      (error) => {
        this.error = 'Failed to load skills';
      }
    );
  }
}
```

---

## 🔄 Development Workflow

### 1. Backend Development
```bash
# Terminal 1: Start backend
cd backend
mvn spring-boot:run

# Terminal 2: Test endpoints
curl http://localhost:8081/api/profiles/volunteer/2
```

### 2. Frontend Development
```bash
# Terminal 3: Start frontend
cd frontend
ng serve

# Open browser: http://localhost:4200
```

### 3. Testing
```bash
# Backend tests
cd backend
mvn test

# Frontend tests
cd frontend
ng test
```

---

## 📚 Documentation Files

| File | Purpose |
|------|---------|
| `SPRINT_3_PLAN.md` | High-level sprint planning |
| `SPRINT_3_PHASE1_COMPLETE.md` | Phase 1 detailed guide |
| `SPRINT_3_IMPLEMENTATION_GUIDE.md` | Complete implementation guide |
| `SPRINT_3_SUMMARY.md` | Status report |
| `SPRINT_3_QUICK_START.md` | This file |

---

## 🔗 API Endpoints Reference

### Volunteer Profile
```
GET    /api/profiles/volunteer/{userId}
POST   /api/profiles/volunteer
PUT    /api/profiles/volunteer/{profileId}
```

### Organizer Profile
```
GET    /api/profiles/organizer/{userId}
POST   /api/profiles/organizer
PUT    /api/profiles/organizer/{profileId}
```

### Volunteer Skills
```
GET    /api/profiles/volunteer/{volunteerId}/skills
POST   /api/profiles/volunteer/{volunteerId}/skills
PUT    /api/profiles/skills/{skillId}
DELETE /api/profiles/volunteer/{volunteerId}/skills/{skillId}
```

---

## 🧪 Test Data

### Test Users
```
Organizer:
- ID: 1
- Username: organizer1
- Email: organizer@example.com

Volunteer:
- ID: 2
- Username: volunteer1
- Email: volunteer@example.com
```

### Test Skills
```
Skill 1: First Aid
Skill 2: Teaching
Skill 3: Web Development
```

---

## 🐛 Troubleshooting

### Backend Issues

**Port Already in Use:**
```bash
# Find process using port 8081
lsof -i :8081

# Kill the process
kill -9 <PID>
```

**Compilation Errors:**
```bash
# Clean and rebuild
mvn clean compile
```

**Database Issues:**
```bash
# Reset H2 database
# Delete target/classes/db.h2.db
mvn clean spring-boot:run
```

### Frontend Issues

**Module Not Found:**
```bash
# Reinstall dependencies
rm -rf node_modules
npm install
```

**Port Already in Use:**
```bash
# Use different port
ng serve --port 4201
```

**CORS Errors:**
```bash
# Check backend CORS configuration
# Verify API URL in services
```

---

## 📝 Next Steps

1. ✅ Phase 1 Backend Complete
2. ⏳ Create Phase 1 Frontend Components
3. ⏳ Test Phase 1 End-to-End
4. ⏳ Start Phase 2: Event Management

---

## 💡 Tips & Tricks

### Debugging
```typescript
// Add console logs
console.log('Profile:', this.profile);

// Use Angular DevTools
// Chrome: Install Angular DevTools extension
```

### Performance
```typescript
// Use OnPush change detection
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush
})

// Unsubscribe from observables
ngOnDestroy(): void {
  this.subscription.unsubscribe();
}
```

### Code Quality
```bash
# Lint code
ng lint

# Format code
npm run format
```

---

## 🎯 Success Criteria

- [ ] Backend compiles without errors
- [ ] All 10 endpoints respond correctly
- [ ] Frontend interfaces created
- [ ] ProfileService implemented
- [ ] Profile components created
- [ ] End-to-end testing passed
- [ ] Documentation updated

---

## 📞 Support

For detailed information, refer to:
- `SPRINT_3_PHASE1_COMPLETE.md` - Phase 1 details
- `SPRINT_3_IMPLEMENTATION_GUIDE.md` - Implementation guide
- `SPRINT_3_SUMMARY.md` - Status report

---

**Sprint 3 Quick Start Guide - READY TO USE ✅**
