# Commit Message Conventions

**Project:** Volunteer Event Matcher  
**Standard:** Conventional Commits

---

## 📋 Commit Message Format

```
TYPE(scope): subject

body (optional)

footer (optional)
```

---

## 🏷️ Commit Types

| Type | Purpose | Example |
|---|---|---|
| **FEAT** | New feature | `FEAT(auth): implement user login` |
| **FIX** | Bug fix | `FIX(collection): fix slot decrement error` |
| **DOCS** | Documentation | `DOCS(sprint0): add vision document` |
| **STYLE** | Code style (no logic change) | `STYLE(auth): format code` |
| **REFACTOR** | Code refactoring | `REFACTOR(service): simplify event service` |
| **TEST** | Add/update tests | `TEST(auth): add login tests` |
| **CHORE** | Build, dependencies, setup | `CHORE(sprint0): initialize project` |
| **PERF** | Performance improvement | `PERF(map): optimize marker rendering` |
| **CI** | CI/CD configuration | `CI: add GitHub Actions workflow` |

---

## 📝 Scope Examples

**Scope identifies the area of the codebase:**

| Scope | Area |
|---|---|
| `auth` | Authentication and authorization |
| `event` | Event management (CRUD) |
| `collection` | Collection management |
| `commit` | Commit functionality |
| `map` | Map integration and proximity search |
| `admin` | Admin features and UI |
| `helper` | Helper features and UI |
| `database` | Database and ORM |
| `api` | API endpoints |
| `sprint0` | Sprint 0 setup and documentation |
| `sprint1` | Sprint 1 work |
| `sprint2` | Sprint 2 work |
| `sprint3` | Sprint 3 work |
| `sprint4` | Sprint 4 work |

---

## ✍️ Subject Line Rules

1. **Use imperative mood** ("add" not "added" or "adds")
2. **Don't capitalize first letter** (unless it's a proper noun)
3. **No period (.) at the end**
4. **Limit to 50 characters** (approximately)
5. **Be specific and descriptive**

### ✅ Good Examples
```
FEAT(auth): implement user registration
FIX(event): resolve null pointer in event creation
DOCS(sprint0): add database schema documentation
REFACTOR(service): extract common validation logic
TEST(collection): add unit tests for add/remove
CHORE(sprint0): initialize spring boot project
```

### ❌ Bad Examples
```
added new feature                    # Too vague, no type
FEAT: implement user registration    # Missing scope
feat(auth): implement user registration  # Wrong case
FEAT(auth): Implement user registration  # Capitalized
FEAT(auth): implement user registration.  # Period at end
FEAT(auth): implement user registration with password hashing and email verification  # Too long
```

---

## 📄 Commit Body (Optional)

Use the body to explain **what** and **why**, not **how**.

**Format:**
```
FEAT(auth): implement user registration

Add user registration endpoint that:
- Validates username and password
- Hashes password using BCrypt
- Creates user record in database
- Returns JWT token on success

This allows new users to create accounts
before logging in to the system.
```

**Rules:**
- Wrap at 72 characters
- Separate from subject with blank line
- Explain the problem being solved
- Explain the solution approach
- Mention any breaking changes

---

## 🔗 Commit Footer (Optional)

Use for referencing issues or breaking changes.

**Format:**
```
FEAT(auth): implement user registration

Add user registration endpoint.

Closes #123
Relates to #456
```

**Common footers:**
- `Closes #123` - Closes GitHub issue
- `Fixes #123` - Fixes GitHub issue
- `Relates to #123` - Related to GitHub issue
- `BREAKING CHANGE: description` - Breaking API change

---

## 📋 Commit Examples by Sprint

### Sprint 0 Examples
```
CHORE(sprint0): initialize repository and gitignore
DOCS(sprint0): add vision document and domain model
DOCS(sprint0): add database schema and ERD
DOCS(sprint0): add code standards and architecture
CHORE(sprint0): initialize spring boot and angular projects
```

### Sprint 1 Examples
```
FEAT(database): implement JPA entities and repositories
FEAT(auth): implement user authentication and session management
FEAT(admin): implement event CRUD operations
FEAT(admin-ui): implement event management dashboard
TEST(auth): add authentication tests
```

### Sprint 2 Examples
```
FEAT(helper): implement event browsing API
FEAT(helper): implement collection management APIs
FEAT(helper): implement commit API with atomic transactions
FEAT(helper-ui): implement event browsing and collection management UI
TEST(sprint2): verify collection and commit persistence
```

### Sprint 3 Examples
```
FEAT(map): implement haversine distance calculation and proximity search API
FEAT(map): integrate LeafletJS and display event markers
FEAT(map): implement proximity filter UI and integration
DOCS(sprint3): update documentation for map integration feature
```

### Sprint 4 Examples
```
REFACTOR(sprint4): comprehensive code review and optimization
TEST(sprint4): comprehensive test suite and coverage
DOCS(sprint4): finalize comprehensive design documentation
TEST(sprint4): final system testing and production readiness
CHORE(sprint4): final retrospective and submission preparation
```

---

## 🔄 Commit Frequency

**Guidelines:**
- Commit after completing a logical unit of work
- Aim for 3-5 commits per feature
- Don't commit broken code
- Don't commit incomplete features
- Commit at least once per day

**Example workflow:**
```
FEAT(auth): add user registration endpoint
FEAT(auth): add password hashing with BCrypt
FEAT(auth): add JWT token generation
TEST(auth): add registration tests
DOCS(auth): update API documentation
```

---

## 🚫 Commits to Avoid

❌ **Too vague:**
```
git commit -m "update code"
git commit -m "fix stuff"
git commit -m "work in progress"
```

❌ **Too long:**
```
git commit -m "FEAT(auth): implement user registration with password hashing and email verification and JWT token generation and session management and role-based access control"
```

❌ **Wrong format:**
```
git commit -m "Updated authentication module"
git commit -m "auth: implement user registration"
git commit -m "FEAT - implement user registration"
```

---

## ✅ Best Practices

### Do's ✅
- ✅ Use present tense ("add" not "added")
- ✅ Use imperative mood ("move" not "moves")
- ✅ Be specific and descriptive
- ✅ Reference issues when applicable
- ✅ Commit frequently with logical units
- ✅ Keep subject line under 50 characters
- ✅ Use body for detailed explanation
- ✅ Follow the format consistently

### Don'ts ❌
- ❌ Mix multiple features in one commit
- ❌ Use vague messages
- ❌ Capitalize subject line
- ❌ Add period at end of subject
- ❌ Use past tense
- ❌ Commit broken code
- ❌ Ignore the format
- ❌ Make commits too large

---

## 🔍 Viewing Commit History

```bash
# View recent commits
git log --oneline -10

# View commits with details
git log --oneline --graph --all

# View commits for specific file
git log --oneline -- filename

# View commits by author
git log --oneline --author="name"

# View commits since date
git log --oneline --since="2025-11-21"
```

---

## 📊 Commit Statistics

**Expected commits by sprint:**

| Sprint | Expected Commits | Frequency |
|---|---|---|
| Sprint 0 | 5-8 | 1-2 per day |
| Sprint 1 | 8-12 | 2-3 per day |
| Sprint 2 | 8-12 | 2-3 per day |
| Sprint 3 | 8-12 | 2-3 per day |
| Sprint 4 | 5-8 | 1-2 per day |
| **Total** | **35-55** | **Consistent** |

---

## 🎯 Summary

**Key Points:**
- Format: `TYPE(scope): subject`
- Use imperative mood
- Keep subject under 50 characters
- Use body for detailed explanation
- Commit frequently with logical units
- Follow conventions consistently
- Reference issues when applicable

---

## 📚 References

- [Conventional Commits](https://www.conventionalcommits.org/)
- [Git Commit Best Practices](https://git-scm.com/book/en/v2/Git-Basics-Viewing-the-Commit-History)

---

**Last Updated:** [Date]
