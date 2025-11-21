# Angular Code Conventions & Standards

**Project:** Volunteer Event Matcher  
**Framework:** Angular 14+  
**Language:** TypeScript

---

## 📋 Table of Contents

1. [Naming Conventions](#naming-conventions)
2. [File Structure](#file-structure)
3. [Component Guidelines](#component-guidelines)
4. [Service Guidelines](#service-guidelines)
5. [Module Organization](#module-organization)
6. [Comments & Documentation](#comments--documentation)
7. [Code Style](#code-style)
8. [Testing Conventions](#testing-conventions)

---

## 🏷️ Naming Conventions

### Components

**Format:** `kebab-case` for files, `PascalCase` for classes

**Rules:**
- Use descriptive names
- Include "Component" suffix in class name
- One component per file

**Examples:**
```typescript
// ✅ Good
// File: event-browse.component.ts
export class EventBrowseComponent { }

// File: admin-dashboard.component.ts
export class AdminDashboardComponent { }

// File: collection-item.component.ts
export class CollectionItemComponent { }

// ❌ Bad
// File: event.component.ts (too generic)
export class EventComponent { }

// File: EventBrowseComponent.ts (wrong case for file)
export class EventBrowseComponent { }

// File: event-browse.ts (missing Component suffix)
export class EventBrowse { }
```

### Services

**Format:** `kebab-case` for files, `PascalCase` for classes with "Service" suffix

**Rules:**
- Use descriptive names
- Include "Service" suffix in class name
- One service per file

**Examples:**
```typescript
// ✅ Good
// File: event.service.ts
export class EventService { }

// File: collection.service.ts
export class CollectionService { }

// File: auth.service.ts
export class AuthService { }

// ❌ Bad
// File: event-service.ts (wrong format)
export class EventService { }

// File: event.ts (missing Service suffix)
export class Event { }

// File: EventService.ts (wrong case for file)
export class EventService { }
```

### Interfaces & Types

**Format:** `kebab-case` for files, `PascalCase` for names with "I" prefix (optional)

**Rules:**
- Describe data structure
- Use "I" prefix for interfaces (optional but recommended)
- One interface per file or group related interfaces

**Examples:**
```typescript
// ✅ Good
// File: event.model.ts
export interface IEvent {
    id: number;
    title: string;
    description: string;
}

export interface IEventDTO {
    title: string;
    description: string;
}

// ✅ Also Good (without I prefix)
export interface Event {
    id: number;
    title: string;
}

// ❌ Bad
// File: event_model.ts (wrong case)
export interface event { }

// File: Event.ts (wrong case for file)
export interface IEvent { }
```

### Methods & Properties

**Format:** `camelCase`

**Rules:**
- Use verbs for methods
- Use nouns for properties
- Be descriptive

**Examples:**
```typescript
// ✅ Good
export class EventService {
    private events: Event[] = [];
    
    getEventById(id: number): Event { }
    
    searchEventsByTitle(keyword: string): Event[] { }
    
    createEvent(event: Event): Observable<Event> { }
    
    isEventAvailable(event: Event): boolean { }
}

// ❌ Bad
export class EventService {
    private event_list: Event[] = [];
    
    GetEvent(id: number): Event { }
    
    search(q: string): Event[] { }
}
```

### Constants

**Format:** `UPPER_SNAKE_CASE`

**Examples:**
```typescript
// ✅ Good
export const MAX_SEARCH_RADIUS = 50;
export const DEFAULT_PAGE_SIZE = 10;
export const API_BASE_URL = 'http://localhost:8080/api';
export const TOKEN_EXPIRATION_TIME = 3600000;

// ❌ Bad
export const maxSearchRadius = 50;
export const max_search_radius = 50;
export const MaxSearchRadius = 50;
```

---

## 📁 File Structure

**Project Structure:**
```
src/
├── app/
│   ├── components/
│   │   ├── auth/
│   │   │   ├── login/
│   │   │   │   ├── login.component.ts
│   │   │   │   ├── login.component.html
│   │   │   │   ├── login.component.css
│   │   │   │   └── login.component.spec.ts
│   │   │   └── register/
│   │   │       └── ...
│   │   ├── admin/
│   │   │   ├── dashboard/
│   │   │   ├── event-form/
│   │   │   └── event-list/
│   │   ├── helper/
│   │   │   ├── event-browse/
│   │   │   ├── collection/
│   │   │   └── search/
│   │   └── shared/
│   │       ├── header/
│   │       ├── footer/
│   │       └── navbar/
│   ├── services/
│   │   ├── auth.service.ts
│   │   ├── event.service.ts
│   │   ├── collection.service.ts
│   │   ├── map.service.ts
│   │   └── http-client.service.ts
│   ├── models/
│   │   ├── user.model.ts
│   │   ├── event.model.ts
│   │   ├── collection.model.ts
│   │   └── volunteer-event.model.ts
│   ├── guards/
│   │   ├── auth.guard.ts
│   │   └── role.guard.ts
│   ├── interceptors/
│   │   └── auth.interceptor.ts
│   ├── app-routing.module.ts
│   ├── app.module.ts
│   └── app.component.ts
├── assets/
├── environments/
│   ├── environment.ts
│   └── environment.prod.ts
└── index.html
```

**File Naming Rules:**
- Components: `[name].component.ts`
- Services: `[name].service.ts`
- Models: `[name].model.ts`
- Guards: `[name].guard.ts`
- Interceptors: `[name].interceptor.ts`
- Modules: `[name].module.ts`
- Tests: `[name].spec.ts`
- Styles: `[name].component.css`
- Templates: `[name].component.html`

---

## 🧩 Component Guidelines

### Component Structure

**Example:**
```typescript
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { IEvent } from '../../models/event.model';
import { EventService } from '../../services/event.service';

/**
 * EventBrowseComponent displays a list of volunteer events.
 * 
 * Users can search, filter, and add events to their collection.
 */
@Component({
    selector: 'app-event-browse',
    templateUrl: './event-browse.component.html',
    styleUrls: ['./event-browse.component.css']
})
export class EventBrowseComponent implements OnInit {
    // 1. Input/Output properties
    @Input() events: IEvent[] = [];
    @Output() eventSelected = new EventEmitter<IEvent>();
    
    // 2. Public properties
    searchKeyword: string = '';
    filteredEvents: IEvent[] = [];
    isLoading: boolean = false;
    
    // 3. Private properties
    private pageSize: number = 10;
    private currentPage: number = 1;
    
    // 4. Constructor with dependency injection
    constructor(private eventService: EventService) { }
    
    // 5. Lifecycle hooks
    ngOnInit(): void {
        this.loadEvents();
    }
    
    // 6. Public methods
    public searchEvents(keyword: string): void {
        this.searchKeyword = keyword;
        this.filteredEvents = this.eventService.searchEventsByTitle(keyword);
    }
    
    public selectEvent(event: IEvent): void {
        this.eventSelected.emit(event);
    }
    
    // 7. Private methods
    private loadEvents(): void {
        this.isLoading = true;
        this.eventService.getAllEvents().subscribe(
            (events: IEvent[]) => {
                this.events = events;
                this.filteredEvents = events;
                this.isLoading = false;
            },
            (error) => {
                console.error('Error loading events:', error);
                this.isLoading = false;
            }
        );
    }
}
```

### Component Decorators

**Rules:**
- Use `selector` with `app-` prefix
- Use `templateUrl` and `styleUrls` (not inline)
- Keep templates and styles in separate files

**Examples:**
```typescript
// ✅ Good
@Component({
    selector: 'app-event-browse',
    templateUrl: './event-browse.component.html',
    styleUrls: ['./event-browse.component.css']
})

// ❌ Bad
@Component({
    selector: 'eventBrowse',  // Wrong case
    template: '<div>...</div>',  // Inline template
    styles: ['div { color: red; }']  // Inline styles
})
```

---

## 🔧 Service Guidelines

### Service Structure

**Example:**
```typescript
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IEvent } from '../models/event.model';

/**
 * EventService handles all event-related API calls and business logic.
 */
@Injectable({
    providedIn: 'root'
})
export class EventService {
    private apiUrl = 'http://localhost:8080/api/events';
    
    constructor(private http: HttpClient) { }
    
    /**
     * Retrieves all events from the server.
     * 
     * @returns Observable of event array
     */
    getAllEvents(): Observable<IEvent[]> {
        return this.http.get<IEvent[]>(this.apiUrl);
    }
    
    /**
     * Retrieves a single event by ID.
     * 
     * @param id the event ID
     * @returns Observable of the event
     */
    getEventById(id: number): Observable<IEvent> {
        return this.http.get<IEvent>(`${this.apiUrl}/${id}`);
    }
    
    /**
     * Searches events by keyword.
     * 
     * @param keyword the search term
     * @returns Observable of matching events
     */
    searchEventsByTitle(keyword: string): Observable<IEvent[]> {
        return this.http.get<IEvent[]>(`${this.apiUrl}/search?q=${keyword}`);
    }
    
    /**
     * Creates a new event.
     * 
     * @param event the event to create
     * @returns Observable of the created event
     */
    createEvent(event: IEvent): Observable<IEvent> {
        return this.http.post<IEvent>(this.apiUrl, event);
    }
    
    /**
     * Updates an existing event.
     * 
     * @param id the event ID
     * @param event the updated event data
     * @returns Observable of the updated event
     */
    updateEvent(id: number, event: IEvent): Observable<IEvent> {
        return this.http.put<IEvent>(`${this.apiUrl}/${id}`, event);
    }
    
    /**
     * Deletes an event.
     * 
     * @param id the event ID
     * @returns Observable of the delete response
     */
    deleteEvent(id: number): Observable<any> {
        return this.http.delete(`${this.apiUrl}/${id}`);
    }
}
```

### Service Injection

**Rules:**
- Use `providedIn: 'root'` for singleton services
- Inject in constructor with `private` modifier
- Use typed HTTP calls

**Examples:**
```typescript
// ✅ Good
@Injectable({ providedIn: 'root' })
export class EventService {
    constructor(private http: HttpClient) { }
}

// ❌ Bad
@Injectable()
export class EventService {
    constructor(http: HttpClient) { }  // Not private
}
```

---

## 📦 Module Organization

### Feature Modules

**Example:**
```typescript
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { EventBrowseComponent } from './event-browse/event-browse.component';
import { EventDetailComponent } from './event-detail/event-detail.component';
import { HelperRoutingModule } from './helper-routing.module';

@NgModule({
    declarations: [
        EventBrowseComponent,
        EventDetailComponent
    ],
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        HelperRoutingModule
    ],
    exports: [
        EventBrowseComponent
    ]
})
export class HelperModule { }
```

### Shared Module

**Example:**
```typescript
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { NavbarComponent } from './navbar/navbar.component';

@NgModule({
    declarations: [
        HeaderComponent,
        FooterComponent,
        NavbarComponent
    ],
    imports: [
        CommonModule
    ],
    exports: [
        HeaderComponent,
        FooterComponent,
        NavbarComponent
    ]
})
export class SharedModule { }
```

---

## 💬 Comments & Documentation

### TSDoc Comments

**Rules:**
- Document all public classes and methods
- Include `@param`, `@returns` tags
- Describe the "what" and "why"

**Example:**
```typescript
/**
 * Searches for events matching the given keyword.
 * 
 * This method queries the backend API and filters results
 * based on event title and description.
 *
 * @param keyword the search term (case-insensitive)
 * @returns Observable of matching events
 */
public searchEventsByTitle(keyword: string): Observable<IEvent[]> {
    return this.http.get<IEvent[]>(`${this.apiUrl}/search?q=${keyword}`);
}

/**
 * Represents a volunteer event in the system.
 * 
 * @interface IEvent
 * @property {number} id - Unique event identifier
 * @property {string} title - Event title
 * @property {string} description - Event description
 * @property {Date} eventDate - Event date
 * @property {string} location - Event location
 * @property {number} slotsAvailable - Available volunteer slots
 */
export interface IEvent {
    id: number;
    title: string;
    description: string;
    eventDate: Date;
    location: string;
    slotsAvailable: number;
}
```

### Inline Comments

**Rules:**
- Use sparingly
- Explain "why", not "what"
- Keep updated

**Examples:**
```typescript
// ✅ Good
// Use debounceTime to avoid excessive API calls while typing
this.searchInput.valueChanges
    .pipe(debounceTime(300))
    .subscribe(keyword => this.search(keyword));

// ❌ Bad
// Set loading to true
this.isLoading = true;

// ❌ Bad - Outdated
// TODO: This needs to be fixed but it's complicated
// The API returns wrong data sometimes
```

---

## 🎨 Code Style

### Indentation & Spacing

**Rules:**
- Use 2 spaces per indentation level
- One blank line between methods
- One blank line between logical sections

**Example:**
```typescript
export class EventService {
  private apiUrl = 'http://localhost:8080/api/events';
  
  constructor(private http: HttpClient) { }
  
  getAllEvents(): Observable<IEvent[]> {
    return this.http.get<IEvent[]>(this.apiUrl);
  }
  
  getEventById(id: number): Observable<IEvent> {
    return this.http.get<IEvent>(`${this.apiUrl}/${id}`);
  }
}
```

### Line Length

**Rules:**
- Keep lines under 100 characters
- Break long lines at logical points

**Example:**
```typescript
// ✅ Good
this.eventService.searchEventsByTitle(keyword)
    .pipe(
        debounceTime(300),
        distinctUntilChanged()
    )
    .subscribe(events => this.filteredEvents = events);

// ❌ Bad
this.eventService.searchEventsByTitle(keyword).pipe(debounceTime(300), distinctUntilChanged()).subscribe(events => this.filteredEvents = events);
```

### Type Annotations

**Rules:**
- Always use type annotations
- Use interfaces for complex types
- Avoid `any` type

**Examples:**
```typescript
// ✅ Good
public events: IEvent[] = [];
public selectedEvent: IEvent | null = null;
public isLoading: boolean = false;
public pageSize: number = 10;

// ❌ Bad
public events: any = [];
public selectedEvent;
public isLoading = false;
public pageSize = 10;
```

---

## 🧪 Testing Conventions

### Test File Naming

**Format:** `[name].spec.ts`

**Examples:**
```typescript
// ✅ Good
event.service.spec.ts
event-browse.component.spec.ts
auth.guard.spec.ts

// ❌ Bad
event.service.test.ts
event-browse.component.test.ts
eventServiceTest.ts
```

### Test Structure

**Format:** Arrange, Act, Assert (AAA)

**Example:**
```typescript
describe('EventService', () => {
    let service: EventService;
    let httpMock: HttpTestingController;
    
    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [EventService],
            imports: [HttpClientTestingModule]
        });
        service = TestBed.inject(EventService);
        httpMock = TestBed.inject(HttpTestingController);
    });
    
    afterEach(() => {
        httpMock.verify();
    });
    
    describe('getAllEvents', () => {
        it('should return all events', () => {
            // Arrange
            const mockEvents: IEvent[] = [
                { id: 1, title: 'Event 1', ... },
                { id: 2, title: 'Event 2', ... }
            ];
            
            // Act
            service.getAllEvents().subscribe(events => {
                // Assert
                expect(events.length).toBe(2);
                expect(events[0].title).toBe('Event 1');
            });
            
            const req = httpMock.expectOne('http://localhost:8080/api/events');
            expect(req.request.method).toBe('GET');
            req.flush(mockEvents);
        });
    });
});
```

---

## ✅ Code Review Checklist

Before committing, verify:

- [ ] All files follow naming conventions
- [ ] All public methods have TSDoc comments
- [ ] Code is properly indented (2 spaces)
- [ ] Lines are under 100 characters
- [ ] No `any` types used
- [ ] Proper error handling
- [ ] No console.log statements (use logger)
- [ ] Tests are included
- [ ] No unused imports
- [ ] Components use OnDestroy for cleanup

---

## 🔗 Tools & Plugins

**Recommended IDE Setup:**
- **IDE:** Visual Studio Code
- **Extensions:** Angular Language Service, Prettier
- **Formatter:** Prettier (2 spaces)
- **Linter:** ESLint with Angular config

**VS Code Settings:**
```json
{
    "editor.defaultFormatter": "esbenp.prettier-vscode",
    "editor.formatOnSave": true,
    "[typescript]": {
        "editor.defaultFormatter": "esbenp.prettier-vscode"
    },
    "prettier.tabWidth": 2,
    "prettier.semi": true,
    "prettier.singleQuote": true
}
```

---

## 📚 References

- [Angular Style Guide](https://angular.io/guide/styleguide)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [RxJS Documentation](https://rxjs.dev/)

---

**Last Updated:** [Date]  
**Version:** 1.0
