# 📘 Voluntra Project Documentation

## 1. Project Overview
**Voluntra** is a full-stack web application connecting volunteers with community events.
*   **Frontend:** Angular (handles the UI, user interaction, and display).
*   **Backend:** Java Spring Boot (handles the logic, database, and security).
*   **Database:** H2 (In-memory database for development).

---

## 2. Backend Structure (Spring Boot)
*Location: `/backend/src/main/java/com/volunteer/...`*

The backend follows a **Controller-Service-Repository** pattern. Think of it like a restaurant:
1.  **Controller (Waiter):** Takes the order (API request).
2.  **Service (Chef):** Cooks the food (Business logic).
3.  **Repository (Pantry):** Grabs ingredients (Data from DB).

### Key Folders & Files:

*   **`config/`**: Setup files.
    *   **`SecurityConfig.java`**: The "Bouncer". It decides who can log in and which URLs are public vs. private. It handles CORS (allowing frontend to talk to backend).
    *   **`DataSeeder.java`**: The "Initializer". When the app starts, this file deletes old data and creates default users (admin, volunteers) and events so the app isn't empty.

*   **`controller/`**: The API Endpoints.
    *   **`AuthController.java`**: Handles Login and Registration.
    *   **`EventController.java`**: Handles creating, fetching, and searching for events.

*   **`service/`**: The Business Logic.
    *   **`UserService.java`**: Handles user creation. **Crucial logic:** We modified this to force the "VOLUNTEER" role during public registration.
    *   **`EventService.java`**: Handles the logic for fetching events. It filters "Upcoming" and "Published" events so users don't see old stuff.

*   **`entity/`**: Database Models.
    *   **`User.java`**: Defines what a User looks like in the DB (id, email, role).
    *   **`Event.java`**: Defines an Event (title, lat/long, description).

*   **`dto/`** (Data Transfer Objects):
    *   **`UserRegistrationDTO.java`**: A simple object used to carry data from the signup form to the backend.

---

## 3. Frontend Structure (Angular)
*Location: `/frontend/src/app/...`*

### Key Folders & Files:

*   **`app-routing.module.ts`**: The "GPS". It tells the app which component to show based on the URL (e.g., `/login` shows `LoginComponent`).

*   **`services/`**: The Communication Layer.
    *   **`auth.service.ts`**: Talks to `AuthController` (Backend) to log users in.
    *   **`event.service.ts`**: Talks to `EventController` (Backend) to get event lists.

*   **`components/`**: The UI Screens.
    *   **`home/` (Landing Page)**: The first page users see. We updated this to fetch *real* events instead of fake ones.
    *   **`auth/register/`**: The Signup page. We simplified this by removing the role selection.
    *   **`organizer/event-form/`**: Where organizers create events. **Key Feature:** We added the Map Picker here.
    *   **`event-listing/`**: The Volunteer dashboard showing event cards.
    *   **`about/`**: The Contact Us page with the developer avatars.

---

## 4. How Frontend & Backend Connect

They communicate via **HTTP Requests (REST API)**.

1.  **Frontend** (e.g., `home.component.ts`) calls `eventService.getUpcomingEvents()`.
2.  **Service** sends a `GET` request to `http://localhost:8080/api/events/upcoming`.
3.  **Backend Controller** (`EventController.java`) receives the request.
4.  **Backend Service** (`EventService.java`) asks the Database for data.
5.  **Data** travels back up the chain -> JSON response is sent to Angular -> Angular displays it.

---

## 5. Key Features & Highlights (For Presentation)

### A. Simplified Signup (Role Removal)
*   **Problem:** Users were confused by "Organizer" vs "Volunteer" options on the signup page, and we wanted public signups to only be Volunteers.
*   **Solution:** We removed the UI section in `register.component.html`. In the backend `UserService.java`, we hardcoded the role to `UserRole.VOLUNTEER` regardless of input.
*   **Benefit:** Faster, error-free signup flow.

### B. Map Integration (Leaflet)
*   **Problem:** Organizers had to manually type Latitude/Longitude (e.g., `25.2048`), which is impossible for humans to know.
*   **Solution:** We integrated **Leaflet Maps** in `event-form.component.ts`.
*   **How it works:**
    1.  User clicks the map.
    2.  We capture the click event `(e.latlng)`.
    3.  We auto-fill the hidden Latitude/Longitude form fields.

### C. Event Sync & Display
*   **Problem:** The Landing Page showed fake "San Francisco" events while the Dashboard showed real "Dubai" events.
*   **Solution:** We updated `HomeComponent` to use `EventService` to fetch the exact same data source as the Matcher. Now, if an organizer posts an event, it appears on the Home page immediately.

### D. Developer Team (Contact Us)
*   **Feature:** A "Meet the Team" section.
*   **Implementation:** We used the **DiceBear API** to generate consistent, persona-based avatars.
    *   **Selam:** Seed "Katherine" (Female).
    *   **Abel:** Seed "Maria" (Female/Male style set adjusted for visual distinction).

---

## 6. User Journey Flows (Step-by-Step)

### Flow 1: The Volunteer
1.  **Landing:** User arrives at Home. Sees "Featured Opportunities" (fetched from Backend).
2.  **Signup:** Clicks "Sign Up". Enters Name/Email. Role is auto-set to Volunteer.
3.  **Dashboard:** Redirected to Login -> then Dashboard.
4.  **Browse:** Sees Event Cards. Note how we fixed the "No Image" issue by adding a default Unsplash image if one is missing.
5.  **Action:** Clicks **"View Details & Apply"** (We combined two buttons into one for better UX).
6.  **Apply:** Clicks "Apply" on the detail page. Backend records the application.

### Flow 2: The Organizer (Admin)
1.  **Login:** Logs in with organizer credentials.
2.  **Create:** Clicks "Create Event".
3.  **Map:** Sees the map, clicks on a location in Dubai. Coordinates update automatically.
4.  **Publish:** Submits form.
5.  **Result:** The event immediately appears on the Volunteer's Home page and Dashboard.

---

## 7. Summary of Improvements (The "We Fixed It" List)

If asked about challenges or recent changes, use these points:

1.  **The "Not Loading" Avatar Issue:**
    *   *Issue:* Complex API URLs were getting blocked or failing to render.
    *   *Fix:* We switched to simple, stable seeds (`Katherine`, `Maria`) using the standard DiceBear v9 API.

2.  **The "Apply Button" UX:**
    *   *Issue:* The "Apply" button on the card redirected users oddly or didn't give context.
    *   *Fix:* We removed the standalone button and made the primary action "View Details & Apply" to ensure users read about the event before committing.

3.  **Data Consistency:**
    *   *Issue:* Hardcoded HTML on the landing page made the app look "fake".
    *   *Fix:* We wired the Landing Page to the real Backend API.

4.  **Map Coordinates:**
    *   *Issue:* Volunteers/Organizers don't know GPS coordinates.
    *   *Fix:* Added an interactive visual map picker.
