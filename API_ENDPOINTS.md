# REST API Endpoints Documentation

**Project:** Volunteer Event Matcher  
**Base URL:** `http://localhost:8080/api`  
**Version:** 1.0

---

## 📋 Table of Contents

1. [Authentication](#authentication)
2. [Events (Admin)](#events-admin)
3. [Events (Helper - Browse)](#events-helper---browse)
4. [Collections](#collections)
5. [Proximity Search](#proximity-search)
6. [Error Handling](#error-handling)

---

## 🔐 Authentication

### Register New User

**Endpoint:** `POST /api/auth/register`

**Request:**
```json
{
  "username": "volunteer1",
  "password": "SecurePassword123!",
  "role": "HELPER"
}
```

**Response (201 Created):**
```json
{
  "userId": 1,
  "username": "volunteer1",
  "role": "HELPER",
  "message": "User registered successfully"
}
```

**Error (400 Bad Request):**
```json
{
  "error": "Username already exists",
  "code": "DUPLICATE_USERNAME"
}
```

---

### User Login

**Endpoint:** `POST /api/auth/login`

**Request:**
```json
{
  "username": "volunteer1",
  "password": "SecurePassword123!"
}
```

**Response (200 OK):**
```json
{
  "userId": 1,
  "username": "volunteer1",
  "role": "HELPER",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "expiresIn": 3600
}
```

**Error (401 Unauthorized):**
```json
{
  "error": "Invalid username or password",
  "code": "AUTH_FAILED"
}
```

---

### User Logout

**Endpoint:** `POST /api/auth/logout`

**Headers:**
```
Authorization: Bearer {token}
```

**Response (200 OK):**
```json
{
  "message": "Logged out successfully"
}
```

---

## 📅 Events (Admin)

### Create Event

**Endpoint:** `POST /api/events`

**Authorization:** Admin only

**Headers:**
```
Authorization: Bearer {admin_token}
Content-Type: application/json
```

**Request:**
```json
{
  "title": "Beach Cleanup",
  "description": "Help clean up the local beach",
  "eventDate": "2025-12-15",
  "eventTime": "09:00:00",
  "location": "Sunny Beach, Coastal City",
  "city": "Coastal City",
  "latitude": 40.7128,
  "longitude": -74.0060,
  "organizer": "Environmental Group",
  "tags": ["environment", "outdoor", "beach"],
  "slotsAvailable": 20,
  "status": "OPEN"
}
```

**Response (201 Created):**
```json
{
  "eventId": 1,
  "title": "Beach Cleanup",
  "description": "Help clean up the local beach",
  "eventDate": "2025-12-15",
  "eventTime": "09:00:00",
  "location": "Sunny Beach, Coastal City",
  "city": "Coastal City",
  "latitude": 40.7128,
  "longitude": -74.0060,
  "organizer": "Environmental Group",
  "tags": ["environment", "outdoor", "beach"],
  "slotsAvailable": 20,
  "registeredVolunteers": 0,
  "status": "OPEN",
  "createdAt": "2025-11-21T10:00:00Z",
  "message": "Event created successfully"
}
```

**Error (403 Forbidden):**
```json
{
  "error": "Only admins can create events",
  "code": "UNAUTHORIZED_ROLE"
}
```

---

### Update Event

**Endpoint:** `PUT /api/events/{eventId}`

**Authorization:** Admin only

**Headers:**
```
Authorization: Bearer {admin_token}
Content-Type: application/json
```

**Request:**
```json
{
  "title": "Beach Cleanup - Extended",
  "slotsAvailable": 25,
  "status": "OPEN"
}
```

**Response (200 OK):**
```json
{
  "eventId": 1,
  "title": "Beach Cleanup - Extended",
  "slotsAvailable": 25,
  "status": "OPEN",
  "updatedAt": "2025-11-21T11:00:00Z",
  "message": "Event updated successfully"
}
```

**Error (404 Not Found):**
```json
{
  "error": "Event not found",
  "code": "EVENT_NOT_FOUND"
}
```

---

### Delete Event

**Endpoint:** `DELETE /api/events/{eventId}`

**Authorization:** Admin only

**Headers:**
```
Authorization: Bearer {admin_token}
```

**Response (200 OK):**
```json
{
  "message": "Event deleted successfully",
  "eventId": 1
}
```

**Error (404 Not Found):**
```json
{
  "error": "Event not found",
  "code": "EVENT_NOT_FOUND"
}
```

---

## 🔍 Events (Helper - Browse)

### Get All Events

**Endpoint:** `GET /api/events`

**Query Parameters:**
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10)
- `status` (optional): Filter by status (OPEN, CLOSED, CANCELLED)

**Example:**
```
GET /api/events?page=1&limit=10&status=OPEN
```

**Response (200 OK):**
```json
{
  "events": [
    {
      "eventId": 1,
      "title": "Beach Cleanup",
      "description": "Help clean up the local beach",
      "eventDate": "2025-12-15",
      "location": "Sunny Beach, Coastal City",
      "city": "Coastal City",
      "latitude": 40.7128,
      "longitude": -74.0060,
      "slotsAvailable": 20,
      "registeredVolunteers": 5,
      "status": "OPEN"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 50,
    "totalPages": 5
  }
}
```

---

### Search Events

**Endpoint:** `GET /api/events/search`

**Query Parameters:**
- `q` (required): Search keyword
- `page` (optional): Page number
- `limit` (optional): Items per page

**Example:**
```
GET /api/events/search?q=beach&page=1&limit=10
```

**Response (200 OK):**
```json
{
  "events": [
    {
      "eventId": 1,
      "title": "Beach Cleanup",
      "description": "Help clean up the local beach",
      "eventDate": "2025-12-15",
      "location": "Sunny Beach, Coastal City",
      "slotsAvailable": 20,
      "status": "OPEN"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 5,
    "totalPages": 1
  }
}
```

---

### Filter Events

**Endpoint:** `GET /api/events/filter`

**Query Parameters:**
- `city` (optional): Filter by city
- `startDate` (optional): Start date (YYYY-MM-DD)
- `endDate` (optional): End date (YYYY-MM-DD)
- `tags` (optional): Comma-separated tags
- `page` (optional): Page number
- `limit` (optional): Items per page

**Example:**
```
GET /api/events/filter?city=Coastal%20City&startDate=2025-12-01&endDate=2025-12-31
```

**Response (200 OK):**
```json
{
  "events": [
    {
      "eventId": 1,
      "title": "Beach Cleanup",
      "city": "Coastal City",
      "eventDate": "2025-12-15",
      "slotsAvailable": 20,
      "status": "OPEN"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 3,
    "totalPages": 1
  }
}
```

---

### Get Event Details

**Endpoint:** `GET /api/events/{eventId}`

**Response (200 OK):**
```json
{
  "eventId": 1,
  "title": "Beach Cleanup",
  "description": "Help clean up the local beach",
  "eventDate": "2025-12-15",
  "eventTime": "09:00:00",
  "location": "Sunny Beach, Coastal City",
  "city": "Coastal City",
  "latitude": 40.7128,
  "longitude": -74.0060,
  "organizer": "Environmental Group",
  "tags": ["environment", "outdoor", "beach"],
  "slotsAvailable": 20,
  "registeredVolunteers": 5,
  "status": "OPEN",
  "createdAt": "2025-11-21T10:00:00Z"
}
```

---

## 🛒 Collections

### Get Helper's Collection

**Endpoint:** `GET /api/collections/{helperId}`

**Authorization:** Helper can only view own collection

**Headers:**
```
Authorization: Bearer {helper_token}
```

**Response (200 OK):**
```json
{
  "collectionId": 1,
  "helperId": 2,
  "events": [
    {
      "volunteerEventId": 1,
      "eventId": 1,
      "title": "Beach Cleanup",
      "eventDate": "2025-12-15",
      "location": "Sunny Beach",
      "status": "INTERESTED",
      "addedAt": "2025-11-21T10:30:00Z"
    },
    {
      "volunteerEventId": 2,
      "eventId": 2,
      "title": "Tree Planting",
      "eventDate": "2025-12-20",
      "location": "City Park",
      "status": "INTERESTED",
      "addedAt": "2025-11-21T11:00:00Z"
    }
  ],
  "createdAt": "2025-11-21T09:00:00Z",
  "lastUpdatedAt": "2025-11-21T11:00:00Z"
}
```

**Error (403 Forbidden):**
```json
{
  "error": "You can only view your own collection",
  "code": "UNAUTHORIZED_ACCESS"
}
```

---

### Add Event to Collection

**Endpoint:** `POST /api/collections/{helperId}/add/{eventId}`

**Authorization:** Helper can only add to own collection

**Headers:**
```
Authorization: Bearer {helper_token}
```

**Response (201 Created):**
```json
{
  "volunteerEventId": 3,
  "eventId": 3,
  "title": "Blood Donation Drive",
  "eventDate": "2025-12-10",
  "status": "INTERESTED",
  "addedAt": "2025-11-21T12:00:00Z",
  "message": "Event added to collection"
}
```

**Error (409 Conflict):**
```json
{
  "error": "Event already in collection",
  "code": "DUPLICATE_ENTRY"
}
```

---

### Remove Event from Collection

**Endpoint:** `DELETE /api/collections/{helperId}/remove/{eventId}`

**Authorization:** Helper can only remove from own collection

**Headers:**
```
Authorization: Bearer {helper_token}
```

**Response (200 OK):**
```json
{
  "message": "Event removed from collection",
  "eventId": 3
}
```

**Error (404 Not Found):**
```json
{
  "error": "Event not in collection",
  "code": "NOT_FOUND"
}
```

---

### Commit Collection

**Endpoint:** `POST /api/collections/{helperId}/commit`

**Authorization:** Helper can only commit own collection

**Headers:**
```
Authorization: Bearer {helper_token}
```

**Request:**
```json
{}
```

**Response (200 OK):**
```json
{
  "message": "Collection committed successfully",
  "committedEvents": [
    {
      "eventId": 1,
      "title": "Beach Cleanup",
      "status": "COMMITTED",
      "committedAt": "2025-11-21T12:30:00Z"
    },
    {
      "eventId": 2,
      "title": "Tree Planting",
      "status": "COMMITTED",
      "committedAt": "2025-11-21T12:30:00Z"
    }
  ],
  "slotsReserved": 2,
  "collectionCleared": true
}
```

**Error (400 Bad Request):**
```json
{
  "error": "Insufficient slots available for one or more events",
  "code": "INSUFFICIENT_SLOTS",
  "failedEvents": [
    {
      "eventId": 3,
      "title": "Blood Donation",
      "slotsAvailable": 0
    }
  ]
}
```

---

## 🗺️ Proximity Search

### Find Events Within Radius

**Endpoint:** `GET /api/events/proximity`

**Query Parameters:**
- `lat` (required): User latitude
- `lon` (required): User longitude
- `radius` (required): Search radius in kilometers
- `page` (optional): Page number
- `limit` (optional): Items per page

**Example:**
```
GET /api/events/proximity?lat=40.7128&lon=-74.0060&radius=10&page=1&limit=10
```

**Response (200 OK):**
```json
{
  "events": [
    {
      "eventId": 1,
      "title": "Beach Cleanup",
      "eventDate": "2025-12-15",
      "location": "Sunny Beach",
      "latitude": 40.7150,
      "longitude": -74.0080,
      "distance": 0.45,
      "slotsAvailable": 20,
      "status": "OPEN"
    },
    {
      "eventId": 2,
      "title": "Tree Planting",
      "eventDate": "2025-12-20",
      "location": "City Park",
      "latitude": 40.7200,
      "longitude": -74.0100,
      "distance": 1.23,
      "slotsAvailable": 15,
      "status": "OPEN"
    }
  ],
  "searchCenter": {
    "latitude": 40.7128,
    "longitude": -74.0060
  },
  "radiusKm": 10,
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 2,
    "totalPages": 1
  }
}
```

---

### Get Nearest Events

**Endpoint:** `GET /api/events/nearest`

**Query Parameters:**
- `lat` (required): User latitude
- `lon` (required): User longitude
- `limit` (optional): Number of nearest events (default: 5)

**Example:**
```
GET /api/events/nearest?lat=40.7128&lon=-74.0060&limit=5
```

**Response (200 OK):**
```json
{
  "events": [
    {
      "eventId": 1,
      "title": "Beach Cleanup",
      "eventDate": "2025-12-15",
      "location": "Sunny Beach",
      "distance": 0.45,
      "slotsAvailable": 20
    },
    {
      "eventId": 2,
      "title": "Tree Planting",
      "eventDate": "2025-12-20",
      "location": "City Park",
      "distance": 1.23,
      "slotsAvailable": 15
    }
  ],
  "searchCenter": {
    "latitude": 40.7128,
    "longitude": -74.0060
  }
}
```

---

## ❌ Error Handling

### Standard Error Response

All errors follow this format:

```json
{
  "error": "Error message",
  "code": "ERROR_CODE",
  "timestamp": "2025-11-21T12:00:00Z",
  "path": "/api/events/1"
}
```

### HTTP Status Codes

| Code | Meaning | Example |
|---|---|---|
| 200 | OK | Successful GET/PUT/DELETE |
| 201 | Created | Successful POST |
| 400 | Bad Request | Invalid input |
| 401 | Unauthorized | Missing/invalid token |
| 403 | Forbidden | Insufficient permissions |
| 404 | Not Found | Resource doesn't exist |
| 409 | Conflict | Duplicate entry |
| 500 | Server Error | Internal error |

### Common Error Codes

| Code | Meaning |
|---|---|
| `DUPLICATE_USERNAME` | Username already exists |
| `AUTH_FAILED` | Invalid credentials |
| `UNAUTHORIZED_ROLE` | User doesn't have required role |
| `UNAUTHORIZED_ACCESS` | User can't access this resource |
| `EVENT_NOT_FOUND` | Event doesn't exist |
| `COLLECTION_NOT_FOUND` | Collection doesn't exist |
| `INSUFFICIENT_SLOTS` | Not enough slots available |
| `DUPLICATE_ENTRY` | Entry already exists |
| `INVALID_INPUT` | Input validation failed |

---

## 🔑 Authentication

All protected endpoints require the `Authorization` header:

```
Authorization: Bearer {jwt_token}
```

Token is obtained from login endpoint and expires after 1 hour.

---

## 📊 Rate Limiting

- 100 requests per minute per IP
- 1000 requests per hour per user

---

## 🔄 Pagination

All list endpoints support pagination:

**Query Parameters:**
- `page` (default: 1)
- `limit` (default: 10, max: 100)

**Response:**
```json
{
  "data": [...],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 50,
    "totalPages": 5
  }
}
```

---

## 📝 Notes

- All timestamps are in ISO 8601 format (UTC)
- All coordinates use WGS84 (latitude/longitude)
- Distance is calculated using Haversine formula
- All requests/responses use JSON

---

**Last Updated:** [Date]  
**Version:** 1.0
