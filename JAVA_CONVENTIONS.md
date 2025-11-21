# Java Code Conventions & Standards

**Project:** Volunteer Event Matcher  
**Framework:** Spring Boot  
**Java Version:** 11+

---

## 📋 Table of Contents

1. [Naming Conventions](#naming-conventions)
2. [Package Structure](#package-structure)
3. [Class Organization](#class-organization)
4. [Method Guidelines](#method-guidelines)
5. [Comments & Documentation](#comments--documentation)
6. [Code Style](#code-style)
7. [Error Handling](#error-handling)
8. [Testing Conventions](#testing-conventions)

---

## 🏷️ Naming Conventions

### Classes

**Format:** `PascalCase`

**Rules:**
- Use nouns
- Be descriptive and meaningful
- Avoid abbreviations (except common ones)

**Examples:**
```java
// ✅ Good
public class UserService { }
public class EventController { }
public class CollectionRepository { }
public class VolunteerEventDTO { }
public class InvalidEventException { }

// ❌ Bad
public class US { }  // Too abbreviated
public class user_service { }  // Wrong case
public class UserSvc { }  // Abbreviated
public class UserServiceImpl { }  // Avoid "Impl"
```

### Interfaces

**Format:** `PascalCase` (same as classes)

**Rules:**
- Use adjectives or nouns
- Describe capability or contract
- Don't use "I" prefix

**Examples:**
```java
// ✅ Good
public interface EventService { }
public interface Searchable { }
public interface UserRepository { }

// ❌ Bad
public interface IEventService { }  // Don't use I prefix
public interface event_service { }  // Wrong case
```

### Methods

**Format:** `camelCase`

**Rules:**
- Use verbs
- Start with action word
- Be descriptive
- Keep under 30 characters if possible

**Examples:**
```java
// ✅ Good
public void createEvent(EventDTO dto) { }
public Event getEventById(Long id) { }
public List<Event> searchEventsByTitle(String keyword) { }
public void deleteEventAndNotifyUsers(Long eventId) { }
public boolean isEventAvailable(Event event) { }

// ❌ Bad
public void ce(EventDTO dto) { }  // Too abbreviated
public void create_event(EventDTO dto) { }  // Wrong case
public void createEventAndSaveToDatabase(EventDTO dto) { }  // Too long
public void event(EventDTO dto) { }  // Not a verb
```

### Variables & Constants

**Format:** `camelCase` for variables, `UPPER_SNAKE_CASE` for constants

**Examples:**
```java
// ✅ Good - Variables
private String username;
private List<Event> events;
private int slotsAvailable;
private LocalDateTime createdAt;

// ✅ Good - Constants
private static final int MAX_SEARCH_RADIUS = 50;
private static final String DEFAULT_TIMEZONE = "UTC";
private static final long TOKEN_EXPIRATION_TIME = 3600000;

// ❌ Bad
private String UserName;  // Wrong case
private List<Event> event_list;  // Wrong case
private int slots_available;  // Wrong case
private static final int maxSearchRadius = 50;  // Constants should be UPPER_SNAKE_CASE
```

### Enums

**Format:** `UPPER_SNAKE_CASE` for enum values

**Examples:**
```java
// ✅ Good
public enum UserRole {
    ADMIN,
    HELPER
}

public enum EventStatus {
    OPEN,
    CLOSED,
    CANCELLED
}

// ❌ Bad
public enum UserRole {
    Admin,  // Wrong case
    helper  // Wrong case
}
```

---

## 📁 Package Structure

**Format:** `com.volunteer.[module].[submodule]`

**Structure:**
```
com.volunteer
├── controller          # REST Controllers
├── service             # Business logic services
├── repository          # Data access layer
├── entity              # JPA entities
├── dto                 # Data transfer objects
├── exception           # Custom exceptions
├── security            # Security & authentication
├── util                # Utility classes
└── config              # Configuration classes
```

**Examples:**
```java
// ✅ Good
package com.volunteer.controller;
package com.volunteer.service;
package com.volunteer.repository;
package com.volunteer.entity;
package com.volunteer.dto;
package com.volunteer.exception;
package com.volunteer.security;
package com.volunteer.util;

// ❌ Bad
package com.volunteer.controllers;  // Plural
package com.volunteer.services;     // Plural
package com.volunteer.utils;        // Plural
```

---

## 🏗️ Class Organization

**Order of elements in a class:**

```java
public class EventService {
    // 1. Static constants
    private static final Logger logger = LoggerFactory.getLogger(EventService.class);
    private static final int MAX_EVENTS_PER_PAGE = 10;
    
    // 2. Static variables
    private static int eventCounter = 0;
    
    // 3. Instance variables
    @Autowired
    private EventRepository eventRepository;
    
    @Autowired
    private UserService userService;
    
    // 4. Constructors
    public EventService() { }
    
    public EventService(EventRepository eventRepository) {
        this.eventRepository = eventRepository;
    }
    
    // 5. Public methods
    public Event createEvent(EventDTO dto) { }
    
    public Event getEventById(Long id) { }
    
    public List<Event> getAllEvents() { }
    
    // 6. Protected methods
    protected void validateEvent(Event event) { }
    
    // 7. Private methods
    private void logEventCreation(Event event) { }
    
    private boolean isValidLocation(String location) { }
}
```

---

## 📝 Method Guidelines

### Method Signature

**Rules:**
- Keep parameters under 3-4
- Use meaningful parameter names
- Avoid boolean parameters (use enum or object instead)

**Examples:**
```java
// ✅ Good
public Event createEvent(EventDTO dto) { }
public List<Event> searchEvents(String keyword, int page) { }
public void updateEvent(Long eventId, EventDTO dto) { }

// ❌ Bad
public Event createEvent(String t, String d, String l, String c, int s) { }  // Too many params
public List<Event> search(String q, int p, int l, boolean a, boolean b) { }  // Boolean params
public void update(Long id, EventDTO dto, boolean notify, boolean log) { }  // Too many booleans
```

### Method Length

**Guidelines:**
- Keep methods under 20 lines
- One responsibility per method
- Extract complex logic into helper methods

**Example:**
```java
// ✅ Good - Short and focused
public Event createEvent(EventDTO dto) {
    validateEventDTO(dto);
    Event event = mapDTOToEntity(dto);
    return eventRepository.save(event);
}

// ❌ Bad - Too long and complex
public Event createEvent(EventDTO dto) {
    if (dto == null) throw new IllegalArgumentException("DTO cannot be null");
    if (dto.getTitle() == null || dto.getTitle().isEmpty()) 
        throw new IllegalArgumentException("Title is required");
    if (dto.getDate() == null) 
        throw new IllegalArgumentException("Date is required");
    // ... 20 more lines of validation and logic
}
```

---

## 💬 Comments & Documentation

### Javadoc

**Rules:**
- Document all public classes and methods
- Include `@param`, `@return`, `@throws` tags
- Describe the "what" and "why", not the "how"

**Example:**
```java
/**
 * Creates a new volunteer event in the system.
 * 
 * This method validates the event data, saves it to the database,
 * and notifies relevant admins of the new event.
 *
 * @param dto the event data transfer object containing event details
 * @return the created Event entity with generated ID
 * @throws InvalidEventException if event data is invalid
 * @throws DatabaseException if database operation fails
 */
public Event createEvent(EventDTO dto) {
    // implementation
}

/**
 * Searches for events matching the given keyword.
 *
 * @param keyword the search term (case-insensitive)
 * @param page the page number (1-indexed)
 * @return a list of matching events, empty if none found
 */
public List<Event> searchEvents(String keyword, int page) {
    // implementation
}
```

### Inline Comments

**Rules:**
- Use sparingly - code should be self-explanatory
- Explain "why", not "what"
- Keep comments up-to-date with code

**Examples:**
```java
// ✅ Good
// Use Haversine formula for accurate distance calculation
double distance = calculateHaversineDistance(lat1, lon1, lat2, lon2);

// ❌ Bad
// Add 1 to counter
counter++;

// ❌ Bad - Outdated
// TODO: This was supposed to be fixed in v2.0
// But it still doesn't work properly
```

---

## 🎨 Code Style

### Indentation & Spacing

**Rules:**
- Use 4 spaces per indentation level (not tabs)
- One blank line between methods
- One blank line between logical sections

**Example:**
```java
public class EventService {
    private EventRepository eventRepository;
    
    public Event createEvent(EventDTO dto) {
        validateEventDTO(dto);
        Event event = mapDTOToEntity(dto);
        return eventRepository.save(event);
    }
    
    public Event getEventById(Long id) {
        return eventRepository.findById(id)
            .orElseThrow(() -> new EventNotFoundException("Event not found"));
    }
}
```

### Line Length

**Rules:**
- Keep lines under 100 characters
- Break long lines at logical points

**Example:**
```java
// ✅ Good
List<Event> events = eventRepository.findByStatusAndDateBetween(
    EventStatus.OPEN,
    startDate,
    endDate
);

// ❌ Bad
List<Event> events = eventRepository.findByStatusAndDateBetween(EventStatus.OPEN, startDate, endDate);
```

### Braces

**Rules:**
- Opening brace on same line (Java style)
- Closing brace on new line
- Always use braces, even for single-line blocks

**Example:**
```java
// ✅ Good
if (event != null) {
    eventRepository.save(event);
}

for (Event event : events) {
    processEvent(event);
}

// ❌ Bad
if (event != null)
    eventRepository.save(event);

if (event != null) eventRepository.save(event);
```

---

## ⚠️ Error Handling

### Custom Exceptions

**Format:** `[Domain]Exception`

**Examples:**
```java
// ✅ Good
public class EventNotFoundException extends RuntimeException { }
public class InvalidEventException extends RuntimeException { }
public class UnauthorizedException extends RuntimeException { }
public class InsufficientSlotsException extends RuntimeException { }

// ❌ Bad
public class EventError extends Exception { }
public class BadEvent extends Exception { }
public class Error1 extends Exception { }
```

### Exception Handling

**Rules:**
- Catch specific exceptions, not generic `Exception`
- Log exceptions with context
- Provide meaningful error messages

**Example:**
```java
// ✅ Good
try {
    Event event = eventRepository.findById(id)
        .orElseThrow(() -> new EventNotFoundException("Event with ID " + id + " not found"));
    return event;
} catch (EventNotFoundException e) {
    logger.error("Event not found: {}", id, e);
    throw e;
}

// ❌ Bad
try {
    Event event = eventRepository.findById(id).get();
    return event;
} catch (Exception e) {
    e.printStackTrace();
    return null;
}
```

---

## 🧪 Testing Conventions

### Test Class Naming

**Format:** `[ClassUnderTest]Test`

**Examples:**
```java
// ✅ Good
public class EventServiceTest { }
public class UserControllerTest { }
public class CollectionRepositoryTest { }

// ❌ Bad
public class EventServiceTestCase { }
public class TestEventService { }
public class EventServiceTests { }
```

### Test Method Naming

**Format:** `test[MethodName][Scenario][ExpectedResult]`

**Examples:**
```java
// ✅ Good
@Test
public void testCreateEventWithValidData_ShouldReturnSavedEvent() { }

@Test
public void testCreateEventWithNullDTO_ShouldThrowException() { }

@Test
public void testSearchEventsByKeyword_ShouldReturnMatchingEvents() { }

// ❌ Bad
@Test
public void test1() { }

@Test
public void testCreate() { }

@Test
public void shouldWork() { }
```

### Test Structure (AAA Pattern)

**Format:** Arrange, Act, Assert

```java
@Test
public void testCreateEventWithValidData_ShouldReturnSavedEvent() {
    // Arrange
    EventDTO dto = new EventDTO("Beach Cleanup", "Help clean beach", ...);
    
    // Act
    Event result = eventService.createEvent(dto);
    
    // Assert
    assertNotNull(result);
    assertEquals("Beach Cleanup", result.getTitle());
    assertTrue(result.getId() > 0);
}
```

---

## ✅ Code Review Checklist

Before committing, verify:

- [ ] All classes follow naming conventions
- [ ] All public methods have Javadoc
- [ ] Code is properly indented (4 spaces)
- [ ] Lines are under 100 characters
- [ ] No commented-out code
- [ ] No hardcoded values (use constants)
- [ ] Proper exception handling
- [ ] No null pointer exceptions
- [ ] Tests are included
- [ ] No unused imports
- [ ] No System.out.println (use logger)

---

## 🔗 Tools & Plugins

**Recommended IDE Setup:**
- **IDE:** IntelliJ IDEA or Eclipse
- **Formatter:** Use built-in code formatter (Ctrl+Alt+L in IntelliJ)
- **Linter:** SonarLint plugin
- **Checkstyle:** Maven checkstyle plugin

**Maven Configuration:**
```xml
<plugin>
    <groupId>org.apache.maven.plugins</groupId>
    <artifactId>maven-checkstyle-plugin</artifactId>
    <version>3.1.2</version>
    <configuration>
        <configLocation>checkstyle.xml</configLocation>
    </configuration>
</plugin>
```

---

## 📚 References

- [Google Java Style Guide](https://google.github.io/styleguide/javaguide.html)
- [Oracle Code Conventions](https://www.oracle.com/java/technologies/javase/codeconventions-136091.html)
- [Spring Boot Best Practices](https://spring.io/guides)

---

**Last Updated:** [Date]  
**Version:** 1.0
