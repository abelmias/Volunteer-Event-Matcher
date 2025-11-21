# Contributing Guidelines

**Project:** Volunteer Event Matcher  
**Last Updated:** [Date]

---

## 📋 Table of Contents

1. [Getting Started](#getting-started)
2. [Development Workflow](#development-workflow)
3. [Code Standards](#code-standards)
4. [Testing Requirements](#testing-requirements)
5. [Pull Request Process](#pull-request-process)
6. [Commit Guidelines](#commit-guidelines)
7. [Code Review](#code-review)
8. [Reporting Issues](#reporting-issues)

---

## 🚀 Getting Started

### Prerequisites

**Backend:**
- Java 11+
- Maven 3.6+
- PostgreSQL 12+
- Git

**Frontend:**
- Node.js 14+
- npm 6+
- Angular CLI 14+
- Git

### Initial Setup

**1. Clone the repository:**
```bash
git clone https://github.com/abelmias/Volunteer-Event-Matcher.git
cd Volunteer-Event-Matcher
```

**2. Create develop branch (if not exists):**
```bash
git checkout develop
git pull origin develop
```

**3. Create feature branch:**
```bash
git checkout -b feature/your-feature-name
```

**4. Backend setup:**
```bash
cd backend
mvn clean install
# Configure application.properties with your database
mvn spring-boot:run
```

**5. Frontend setup:**
```bash
cd ../frontend
npm install
ng serve
```

**6. Verify setup:**
- Backend running on `http://localhost:8080`
- Frontend running on `http://localhost:4200`
- Database connected and initialized

---

## 🔄 Development Workflow

### 1. Create Feature Branch

```bash
# Make sure you're on develop
git checkout develop
git pull origin develop

# Create feature branch
git checkout -b feature/your-feature-name
```

**Branch naming:** `feature/descriptive-name`

### 2. Make Changes

**Backend:**
- Create/modify Java files in `backend/src/main/java/com/volunteer/`
- Follow JAVA_CONVENTIONS.md
- Write tests in `backend/src/test/java/`

**Frontend:**
- Create/modify TypeScript files in `frontend/src/app/`
- Follow ANGULAR_CONVENTIONS.md
- Write tests in `.spec.ts` files

### 3. Test Locally

**Backend:**
```bash
cd backend
mvn test
mvn clean install
mvn spring-boot:run
```

**Frontend:**
```bash
cd frontend
npm test
ng serve
```

### 4. Commit Changes

```bash
git add .
git commit -m "TYPE(scope): description"
```

**Follow COMMIT_CONVENTIONS.md**

### 5. Push to GitHub

```bash
git push origin feature/your-feature-name
```

### 6. Create Pull Request

1. Go to GitHub repository
2. Click "Compare & pull request"
3. Set base: `develop`, compare: `feature/your-feature-name`
4. Add description of changes
5. Request review
6. Wait for approval

### 7. Merge and Cleanup

```bash
# After PR is merged
git checkout develop
git pull origin develop

# Delete local branch
git branch -d feature/your-feature-name

# Delete remote branch
git push origin --delete feature/your-feature-name
```

---

## 📝 Code Standards

### Java Code

**Follow JAVA_CONVENTIONS.md:**
- ✅ PascalCase for classes
- ✅ camelCase for methods/variables
- ✅ UPPER_SNAKE_CASE for constants
- ✅ Javadoc for all public methods
- ✅ 4 spaces indentation
- ✅ Lines under 100 characters

**Example:**
```java
/**
 * Creates a new volunteer event.
 * 
 * @param dto the event data
 * @return the created event
 */
public Event createEvent(EventDTO dto) {
    validateEventDTO(dto);
    Event event = mapDTOToEntity(dto);
    return eventRepository.save(event);
}
```

### TypeScript/Angular Code

**Follow ANGULAR_CONVENTIONS.md:**
- ✅ kebab-case for files
- ✅ PascalCase for classes
- ✅ camelCase for methods/properties
- ✅ UPPER_SNAKE_CASE for constants
- ✅ TSDoc for all public methods
- ✅ 2 spaces indentation
- ✅ Lines under 100 characters
- ✅ Avoid `any` type

**Example:**
```typescript
/**
 * Searches events by keyword.
 * 
 * @param keyword the search term
 * @returns Observable of matching events
 */
public searchEventsByTitle(keyword: string): Observable<IEvent[]> {
    return this.http.get<IEvent[]>(`${this.apiUrl}/search?q=${keyword}`);
}
```

### General Rules

- ✅ No hardcoded values (use constants/config)
- ✅ No commented-out code
- ✅ No console.log (use logger)
- ✅ No unused imports
- ✅ Proper error handling
- ✅ No null pointer exceptions
- ✅ Meaningful variable names
- ✅ DRY principle (Don't Repeat Yourself)

---

## 🧪 Testing Requirements

### Unit Tests

**Backend:**
```bash
cd backend
mvn test
```

**Frontend:**
```bash
cd frontend
ng test
```

### Test Coverage

**Minimum requirements:**
- 80% code coverage for services
- 70% code coverage for controllers
- 60% code coverage for components

### Test Structure (AAA Pattern)

**Arrange, Act, Assert:**

```java
// Java Example
@Test
public void testCreateEventWithValidData_ShouldReturnSavedEvent() {
    // Arrange
    EventDTO dto = new EventDTO("Beach Cleanup", "Help clean beach", ...);
    
    // Act
    Event result = eventService.createEvent(dto);
    
    // Assert
    assertNotNull(result);
    assertEquals("Beach Cleanup", result.getTitle());
}
```

```typescript
// TypeScript Example
it('should return all events', () => {
    // Arrange
    const mockEvents: IEvent[] = [
        { id: 1, title: 'Event 1', ... }
    ];
    
    // Act
    service.getAllEvents().subscribe(events => {
        // Assert
        expect(events.length).toBe(1);
        expect(events[0].title).toBe('Event 1');
    });
});
```

### Before Committing

- [ ] All tests pass locally
- [ ] No console errors/warnings
- [ ] Code coverage meets minimum
- [ ] No broken functionality

---

## 📤 Pull Request Process

### PR Title Format

```
TYPE(scope): description
```

**Example:**
```
FEAT(auth): implement user registration
FIX(event): resolve slot decrement error
DOCS(sprint0): add API documentation
```

### PR Description Template

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] New feature
- [ ] Bug fix
- [ ] Documentation
- [ ] Code refactoring

## Related Issue
Closes #123

## Changes Made
- Change 1
- Change 2
- Change 3

## Testing Done
- [ ] Unit tests added/updated
- [ ] Integration tests passed
- [ ] Manual testing completed

## Screenshots (if applicable)
[Add screenshots for UI changes]

## Checklist
- [ ] Code follows style guidelines
- [ ] Tests pass locally
- [ ] No new warnings generated
- [ ] Documentation updated
- [ ] Commit messages follow conventions
```

### PR Review Checklist

**Reviewer should verify:**
- [ ] Code follows conventions
- [ ] Tests are included
- [ ] No hardcoded values
- [ ] Error handling is proper
- [ ] No performance issues
- [ ] Documentation is updated
- [ ] Commit messages are clear
- [ ] No breaking changes

### Approval & Merge

- At least 1 approval required
- All tests must pass
- No merge conflicts
- Merge using "Squash and merge" for feature branches

---

## 📝 Commit Guidelines

**Follow COMMIT_CONVENTIONS.md**

### Format

```
TYPE(scope): subject

body (optional)

footer (optional)
```

### Types

- `FEAT` - New feature
- `FIX` - Bug fix
- `DOCS` - Documentation
- `STYLE` - Code style (no logic change)
- `REFACTOR` - Code refactoring
- `TEST` - Add/update tests
- `CHORE` - Build, dependencies
- `PERF` - Performance improvement

### Examples

```bash
# Good commits
git commit -m "FEAT(auth): implement user registration"
git commit -m "FIX(event): resolve null pointer in event creation"
git commit -m "DOCS(sprint0): add API documentation"
git commit -m "TEST(auth): add login tests"

# Bad commits
git commit -m "update code"
git commit -m "fix stuff"
git commit -m "work in progress"
```

### Commit Frequency

- Commit after completing a logical unit of work
- Aim for 3-5 commits per feature
- Don't commit broken code
- Don't commit incomplete features

---

## 👀 Code Review

### As an Author

1. **Create clear PRs**
   - Descriptive title and description
   - Link to related issues
   - Include screenshots for UI changes

2. **Respond to feedback**
   - Address all comments
   - Explain decisions if needed
   - Request re-review after changes

3. **Keep PRs small**
   - Easier to review
   - Faster feedback
   - Easier to merge

### As a Reviewer

1. **Review thoroughly**
   - Check code quality
   - Verify tests are included
   - Check for edge cases

2. **Provide constructive feedback**
   - Be respectful
   - Explain why, not just what
   - Suggest improvements

3. **Approve when ready**
   - All comments addressed
   - Tests pass
   - Code follows standards

---

## 🐛 Reporting Issues

### Issue Template

```markdown
## Description
Clear description of the issue

## Steps to Reproduce
1. Step 1
2. Step 2
3. Step 3

## Expected Behavior
What should happen

## Actual Behavior
What actually happens

## Screenshots
[Add screenshots if applicable]

## Environment
- OS: [e.g., Windows 10]
- Browser: [e.g., Chrome 90]
- Java Version: [e.g., 11]
- Node Version: [e.g., 14]

## Additional Context
Any other relevant information
```

### Issue Labels

- `bug` - Something isn't working
- `feature` - New feature request
- `documentation` - Documentation improvement
- `enhancement` - Improvement to existing feature
- `question` - Further information needed
- `help wanted` - Need assistance
- `good first issue` - Good for newcomers

---

## 🚀 Development Best Practices

### Do's ✅

- ✅ Write tests for new features
- ✅ Keep commits small and focused
- ✅ Use meaningful commit messages
- ✅ Review your own code first
- ✅ Test locally before pushing
- ✅ Update documentation
- ✅ Follow code standards
- ✅ Communicate with team
- ✅ Ask for help when stuck
- ✅ Keep learning and improving

### Don'ts ❌

- ❌ Commit directly to main/develop
- ❌ Mix multiple features in one commit
- ❌ Hardcode values
- ❌ Leave commented-out code
- ❌ Ignore test failures
- ❌ Skip documentation
- ❌ Force push to shared branches
- ❌ Merge without review
- ❌ Ignore code standards
- ❌ Work on stale branches

---

## 📞 Communication

### Slack Channels

- `#general` - General discussion
- `#sprint-planning` - Sprint planning
- `#code-review` - Code review discussions
- `#bugs` - Bug reports
- `#help` - Questions and help

### Daily Standup

**Format:** Brief update on:
1. What I did yesterday
2. What I'm doing today
3. Any blockers

**Time:** [Set by team]

### Sprint Planning

**Frequency:** Start of each sprint
**Duration:** 1-2 hours
**Agenda:**
- Review backlog
- Estimate user stories
- Assign tasks
- Set sprint goals

---

## 📚 Resources

- [JAVA_CONVENTIONS.md](./JAVA_CONVENTIONS.md) - Java code standards
- [ANGULAR_CONVENTIONS.md](./ANGULAR_CONVENTIONS.md) - Angular code standards
- [COMMIT_CONVENTIONS.md](./COMMIT_CONVENTIONS.md) - Commit message format
- [BRANCHING_STRATEGY.md](./BRANCHING_STRATEGY.md) - Git workflow
- [API_ENDPOINTS.md](./API_ENDPOINTS.md) - API documentation
- [ARCHITECTURE.md](./ARCHITECTURE.md) - System architecture

---

## ❓ FAQ

**Q: How do I set up the development environment?**
A: Follow the "Getting Started" section above.

**Q: What if I break something?**
A: Don't worry! Use `git reset` to undo changes, or ask for help.

**Q: How often should I commit?**
A: After completing a logical unit of work (usually 1-2 hours).

**Q: Can I commit directly to develop?**
A: No, always create a feature branch and submit a PR.

**Q: What if my PR has conflicts?**
A: Resolve conflicts locally, then push again.

**Q: How long does code review take?**
A: Usually 24-48 hours, depending on PR size.

---

## 🎓 Learning Resources

- [Spring Boot Documentation](https://spring.io/projects/spring-boot)
- [Angular Documentation](https://angular.io/docs)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [Git Documentation](https://git-scm.com/doc)
- [REST API Best Practices](https://restfulapi.net/)

---

**Thank you for contributing! 🙏**

---

**Last Updated:** [Date]  
**Version:** 1.0
