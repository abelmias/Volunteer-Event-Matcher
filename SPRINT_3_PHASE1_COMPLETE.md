# Sprint 3 - Phase 1: User Profile Management ✅ COMPLETE

## Overview
Phase 1 focuses on implementing user profile management for both volunteers and organizers, including skill management for volunteers.

## ✅ Completed Backend Implementation

### 1. DTOs Created

#### VolunteerProfileDTO
- **File:** `backend/src/main/java/com/volunteer/dto/VolunteerProfileDTO.java`
- **Fields:**
  - `id`: Profile ID
  - `userId`: Associated user ID
  - `yearsOfExperience`: Years of volunteer experience
  - `availabilityStatus`: AVAILABLE, UNAVAILABLE, LIMITED
  - `preferredEventTypes`: Comma-separated event types
  - `bioExtended`: Extended biography
  - `verificationStatus`: UNVERIFIED, PENDING, VERIFIED, REJECTED
  - `backgroundCheckCompleted`: Background check flag
- **Methods:**
  - `toEntity()`: Convert DTO to Entity
  - `fromEntity()`: Convert Entity to DTO

#### OrganizerProfileDTO
- **File:** `backend/src/main/java/com/volunteer/dto/OrganizerProfileDTO.java`
- **Fields:**
  - `id`: Profile ID
  - `userId`: Associated user ID
  - `organizationName`: Organization name (required)
  - `organizationDescription`: Organization description
  - `organizationWebsite`: Organization website URL
  - `organizationPhone`: Organization phone number
  - `registrationNumber`: Official registration number
  - `verificationStatus`: UNVERIFIED, PENDING, VERIFIED, REJECTED
- **Methods:**
  - `toEntity()`: Convert DTO to Entity
  - `fromEntity()`: Convert Entity to DTO

#### VolunteerSkillDTO
- **File:** `backend/src/main/java/com/volunteer/dto/VolunteerSkillDTO.java`
- **Fields:**
  - `id`: Skill record ID
  - `volunteerId`: Associated volunteer ID
  - `skillId`: Associated skill ID
  - `proficiencyLevel`: BEGINNER, INTERMEDIATE, ADVANCED, EXPERT
  - `endorsementCount`: Number of endorsements
- **Methods:**
  - `toEntity()`: Convert DTO to Entity
  - `fromEntity()`: Convert Entity to DTO

### 2. ProfileService Created
- **File:** `backend/src/main/java/com/volunteer/service/ProfileService.java`
- **Transactional:** Yes (with @Transactional annotation)
- **Logging:** Enabled with @Slf4j

#### Volunteer Profile Methods
```java
getVolunteerProfile(Long userId): VolunteerProfileDTO
createVolunteerProfile(VolunteerProfileDTO profileDTO): VolunteerProfileDTO
updateVolunteerProfile(Long profileId, VolunteerProfileDTO profileDTO): VolunteerProfileDTO
```

#### Organizer Profile Methods
```java
getOrganizerProfile(Long userId): OrganizerProfileDTO
createOrganizerProfile(OrganizerProfileDTO profileDTO): OrganizerProfileDTO
updateOrganizerProfile(Long profileId, OrganizerProfileDTO profileDTO): OrganizerProfileDTO
```

#### Volunteer Skill Methods
```java
getVolunteerSkills(Long volunteerId): List<VolunteerSkillDTO>
addVolunteerSkill(Long volunteerId, VolunteerSkillDTO skillDTO): VolunteerSkillDTO
updateVolunteerSkill(Long skillId, VolunteerSkillDTO skillDTO): VolunteerSkillDTO
removeVolunteerSkill(Long volunteerId, Long skillId): void
```

### 3. ProfileController Created
- **File:** `backend/src/main/java/com/volunteer/controller/ProfileController.java`
- **Base URL:** `/api/profiles`
- **Logging:** Enabled with @Slf4j

#### Volunteer Profile Endpoints
```
GET    /api/profiles/volunteer/{userId}              - Get profile
POST   /api/profiles/volunteer                        - Create profile
PUT    /api/profiles/volunteer/{profileId}           - Update profile
```

#### Organizer Profile Endpoints
```
GET    /api/profiles/organizer/{userId}              - Get profile
POST   /api/profiles/organizer                        - Create profile
PUT    /api/profiles/organizer/{profileId}           - Update profile
```

#### Volunteer Skill Endpoints
```
GET    /api/profiles/volunteer/{volunteerId}/skills           - Get all skills
POST   /api/profiles/volunteer/{volunteerId}/skills           - Add skill
PUT    /api/profiles/skills/{skillId}                         - Update skill
DELETE /api/profiles/volunteer/{volunteerId}/skills/{skillId} - Remove skill
```

### 4. Repository Enhancements
- **File:** `backend/src/main/java/com/volunteer/repository/VolunteerSkillRepository.java`
- **New Methods Added:**
  - `findByVolunteerId(Long volunteerId)`: Find all skills for a volunteer by ID
  - `findByVolunteerIdAndSkillId(Long volunteerId, Long skillId)`: Find specific skill for volunteer

## 📋 API Response Examples

### Create Volunteer Profile
```bash
POST /api/profiles/volunteer
Content-Type: application/json

{
  "userId": 2,
  "yearsOfExperience": 3,
  "availabilityStatus": "AVAILABLE",
  "preferredEventTypes": "Community Service, Education",
  "bioExtended": "Passionate about helping the community",
  "backgroundCheckCompleted": true
}

Response (201 Created):
{
  "id": 1,
  "userId": 2,
  "yearsOfExperience": 3,
  "availabilityStatus": "AVAILABLE",
  "preferredEventTypes": "Community Service, Education",
  "bioExtended": "Passionate about helping the community",
  "verificationStatus": "UNVERIFIED",
  "backgroundCheckCompleted": true,
  "createdAt": "2025-11-25T15:30:00",
  "updatedAt": "2025-11-25T15:30:00"
}
```

### Add Volunteer Skill
```bash
POST /api/profiles/volunteer/2/skills
Content-Type: application/json

{
  "skillId": 1,
  "proficiencyLevel": "INTERMEDIATE"
}

Response (201 Created):
{
  "id": 1,
  "volunteerId": 2,
  "skillId": 1,
  "proficiencyLevel": "INTERMEDIATE",
  "endorsementCount": 0,
  "createdAt": "2025-11-25T15:30:00",
  "updatedAt": "2025-11-25T15:30:00"
}
```

### Create Organizer Profile
```bash
POST /api/profiles/organizer
Content-Type: application/json

{
  "userId": 1,
  "organizationName": "Community Helpers",
  "organizationDescription": "A non-profit organization dedicated to community service",
  "organizationWebsite": "https://communityhelpers.org",
  "organizationPhone": "555-1234",
  "registrationNumber": "REG-12345"
}

Response (201 Created):
{
  "id": 1,
  "userId": 1,
  "organizationName": "Community Helpers",
  "organizationDescription": "A non-profit organization dedicated to community service",
  "organizationWebsite": "https://communityhelpers.org",
  "organizationPhone": "555-1234",
  "registrationNumber": "REG-12345",
  "verificationStatus": "UNVERIFIED",
  "createdAt": "2025-11-25T15:30:00",
  "updatedAt": "2025-11-25T15:30:00"
}
```

## 🔒 Error Handling

All endpoints return appropriate HTTP status codes:
- **200 OK:** Successful GET/PUT request
- **201 Created:** Successful POST request
- **400 Bad Request:** Invalid input or validation error
- **404 Not Found:** Resource not found
- **500 Internal Server Error:** Server error

### Error Response Format
```json
{
  "status": "error",
  "message": "Error description here"
}
```

## 🧪 Testing the Backend

### 1. Build the Backend
```bash
cd backend
mvn clean compile
```

### 2. Start the Backend
```bash
mvn spring-boot:run
```

### 3. Test Endpoints with cURL

#### Create Volunteer Profile
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

#### Get Volunteer Profile
```bash
curl -X GET http://localhost:8081/api/profiles/volunteer/2 \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

#### Add Volunteer Skill
```bash
curl -X POST http://localhost:8081/api/profiles/volunteer/2/skills \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "skillId": 1,
    "proficiencyLevel": "INTERMEDIATE"
  }'
```

## 📝 Frontend Implementation (Next Steps)

### 1. Create TypeScript Interfaces
```typescript
// src/app/models/volunteer-profile.ts
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

### 2. Create ProfileService
```typescript
// src/app/services/profile.service.ts
@Injectable({ providedIn: 'root' })
export class ProfileService {
  private apiUrl = 'http://localhost:8081/api/profiles';

  constructor(private http: HttpClient) {}

  getVolunteerProfile(userId: number): Observable<VolunteerProfile> {
    return this.http.get<VolunteerProfile>(`${this.apiUrl}/volunteer/${userId}`);
  }

  createVolunteerProfile(profile: VolunteerProfile): Observable<VolunteerProfile> {
    return this.http.post<VolunteerProfile>(`${this.apiUrl}/volunteer`, profile);
  }

  updateVolunteerProfile(profileId: number, profile: VolunteerProfile): Observable<VolunteerProfile> {
    return this.http.put<VolunteerProfile>(`${this.apiUrl}/volunteer/${profileId}`, profile);
  }

  getVolunteerSkills(volunteerId: number): Observable<VolunteerSkill[]> {
    return this.http.get<VolunteerSkill[]>(`${this.apiUrl}/volunteer/${volunteerId}/skills`);
  }

  addVolunteerSkill(volunteerId: number, skill: VolunteerSkill): Observable<VolunteerSkill> {
    return this.http.post<VolunteerSkill>(`${this.apiUrl}/volunteer/${volunteerId}/skills`, skill);
  }

  removeVolunteerSkill(volunteerId: number, skillId: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/volunteer/${volunteerId}/skills/${skillId}`);
  }
}
```

### 3. Create Profile Components
- Volunteer Profile Component (view/edit)
- Organizer Profile Component (view/edit)
- Skills Management Component

## 📊 Files Created/Modified

### Created Files
- ✅ `backend/src/main/java/com/volunteer/dto/VolunteerProfileDTO.java`
- ✅ `backend/src/main/java/com/volunteer/dto/OrganizerProfileDTO.java`
- ✅ `backend/src/main/java/com/volunteer/dto/VolunteerSkillDTO.java`
- ✅ `backend/src/main/java/com/volunteer/service/ProfileService.java`
- ✅ `backend/src/main/java/com/volunteer/controller/ProfileController.java`

### Modified Files
- ✅ `backend/src/main/java/com/volunteer/repository/VolunteerSkillRepository.java` (added 2 new query methods)

## 🚀 Next Phase: Event Management

Phase 2 will implement:
1. Event creation and editing
2. Event publishing
3. Event listing with filtering
4. Event required skills management
5. Event detail page enhancements

---

**Phase 1 Status: ✅ COMPLETE**
**Backend Implementation: 100% Complete**
**Frontend Implementation: Ready to Start**
**Total Endpoints: 10**
**Total DTOs: 3**
**Total Services: 1**
**Total Controllers: 1**
