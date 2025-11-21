# Quick Start Guide - Sprint 0

**Goal:** Complete Sprint 0 in 3 days and be ready for Sprint 1 development

---

## 📋 What You Need to Do (In Order)

### Day 1: Foundation (6-8 hours)

#### Morning: Repository Setup (1-2 hours)
```bash
# 1. Create GitHub repo (or use classroom link)
# 2. Clone locally
git clone <repo-url>
cd windsurf-project

# 3. Create develop branch
git checkout -b develop
git push -u origin develop

# 4. Create feature branch
git checkout -b feature/sprint0-setup

# 5. Create .gitignore
# Add: target/, node_modules/, .DS_Store, *.log, .env, .classpath, .project

# 6. Create README.md with basic project info
```

#### Midday: Documentation (2-3 hours)
- [ ] Write `VISION.md` (1-2 pages)
  - Problem, solution, target users, key features
- [ ] Create `DOMAIN_MAPPING.md`
  - Map generic terms to your domain
- [ ] Create `BRANCHING_STRATEGY.md`
  - Document your Git workflow
- [ ] Create `COMMIT_CONVENTIONS.md`
  - Define commit message format

#### Afternoon: Diagrams (2-3 hours)
- [ ] Create Domain Model UML diagram
  - Use draw.io, Lucidchart, or PlantUML
  - Include all entities and relationships
  - Export as `DOMAIN_MODEL.pdf`
- [ ] Create Database ERD
  - Show all tables and relationships
  - Export as `DATABASE_ERD.pdf`

#### End of Day 1: Commit
```bash
git add .
git commit -m "DOCS(sprint0): add vision document and domain model"
git push origin feature/sprint0-setup
```

---

### Day 2: Planning & Database (6-8 hours)

#### Morning: Trello Board (1-2 hours)
- [ ] Create Trello board "Volunteer Event Matcher"
- [ ] Create columns: Backlog, Sprint 0, Sprint 1-4, Done
- [ ] Create 5 Epics:
  1. Authentication & Security
  2. Admin Event Management
  3. Helper Event Discovery
  4. Collection & Commit
  5. Map Integration
- [ ] Create 12-15 User Stories (one per feature)
- [ ] Create 2-3 Spike Stories (research tasks)
- [ ] Share board link with instructor

#### Midday: Database Design (2-3 hours)
- [ ] Create `schema.sql` with all table definitions
  - users, events, collections, volunteer_events
  - Include all columns, constraints, indexes
- [ ] Create `DATABASE_DESIGN.md`
  - Describe each table and column
  - Explain relationships
- [ ] Create `data.sql` with sample data
  - Create admin user
  - Create sample events
  - Create sample helper users

#### Afternoon: API Documentation (2-3 hours)
- [ ] Create `API_ENDPOINTS.md`
  - List all endpoints
  - Include HTTP methods
  - Include example requests/responses
- [ ] Create `ARCHITECTURE.md`
  - Draw system architecture diagram
  - Explain layers: Controller → Service → Repository → Entity

#### End of Day 2: Commit
```bash
git add .
git commit -m "DOCS(sprint0): add database schema and API endpoints"
git push origin feature/sprint0-setup
```

---

### Day 3: Code Standards & Project Setup (6-8 hours)

#### Morning: Code Standards (1-2 hours)
- [ ] Create `JAVA_CONVENTIONS.md`
  - Naming conventions for classes, methods, constants
  - Package structure
  - Javadoc format
- [ ] Create `ANGULAR_CONVENTIONS.md`
  - Naming conventions for components, services, interfaces
  - File structure
  - TSDoc format
- [ ] Create `CONTRIBUTING.md`
  - Code style guidelines
  - Pull request process
  - Testing requirements

#### Midday: Spring Boot Setup (2-3 hours)
```bash
# Option 1: Use Spring Initializr (https://start.spring.io/)
# - Project: Maven
# - Language: Java
# - Spring Boot: Latest stable
# - Dependencies: Spring Web, Spring Data JPA, PostgreSQL Driver, Spring Security
# - Download and extract to backend/

# Option 2: Create manually
mkdir backend
cd backend
# Create pom.xml with dependencies
# Create src/main/java/com/volunteer/ package structure
# Create src/main/resources/application.properties
```

#### Afternoon: Angular Setup (2-3 hours)
```bash
# Create Angular project
ng new frontend --routing --style=css

# Or create manually
mkdir frontend
cd frontend
# Create package.json with dependencies
# Create src/app/ component structure
# Create src/app/app-routing.module.ts
```

#### Late Afternoon: Final Setup (1 hour)
- [ ] Create `CONTRIBUTING.md`
- [ ] Create `.gitignore` for Java and Angular
- [ ] Verify all documentation complete
- [ ] Verify project structure correct

#### End of Day 3: Final Commits
```bash
# Commit code standards
git add .
git commit -m "DOCS(sprint0): add code standards and architecture"

# Commit project setup
git add .
git commit -m "CHORE(sprint0): initialize spring boot and angular projects"

# Create pull request
git push origin feature/sprint0-setup
# Create PR on GitHub from feature/sprint0-setup → develop
```

---

## 📝 Files to Create (Checklist)

### Documentation Files
- [ ] `README.md` - Project overview
- [ ] `VISION.md` - Project vision (1-2 pages)
- [ ] `DOMAIN_MAPPING.md` - Map generic terms to domain
- [ ] `DOMAIN_MODEL.pdf` - UML class diagram
- [ ] `DATABASE_ERD.pdf` - Entity-relationship diagram
- [ ] `DATABASE_DESIGN.md` - Database description
- [ ] `schema.sql` - SQL DDL script
- [ ] `data.sql` - Sample data
- [ ] `API_ENDPOINTS.md` - REST API documentation
- [ ] `ARCHITECTURE.md` - System architecture
- [ ] `JAVA_CONVENTIONS.md` - Java code standards
- [ ] `ANGULAR_CONVENTIONS.md` - TypeScript/Angular standards
- [ ] `BRANCHING_STRATEGY.md` - Git workflow
- [ ] `COMMIT_CONVENTIONS.md` - Commit message format
- [ ] `CONTRIBUTING.md` - Contribution guidelines

### Configuration Files
- [ ] `.gitignore` - Git ignore patterns
- [ ] `backend/pom.xml` - Maven dependencies
- [ ] `backend/src/main/resources/application.properties` - Spring Boot config
- [ ] `frontend/package.json` - NPM dependencies
- [ ] `frontend/angular.json` - Angular configuration

### Project Structure
- [ ] `backend/src/main/java/com/volunteer/` - Java packages
- [ ] `frontend/src/app/` - Angular modules

---

## 🎯 Submission Checklist

Before submitting Sprint 0 to instructor:

- [ ] GitHub repo initialized with all branches
- [ ] All documentation files created
- [ ] Vision document complete and clear
- [ ] Domain model UML diagram created
- [ ] Database ERD created
- [ ] SQL schema script written
- [ ] API endpoints documented
- [ ] Code standards defined
- [ ] Architecture documented
- [ ] Spring Boot project initialized
- [ ] Angular project initialized
- [ ] Trello board created with all epics and user stories
- [ ] Slack workspace set up
- [ ] All commits follow naming conventions
- [ ] No uncommitted changes
- [ ] README.md complete

---

## 🚀 Next Steps (After Sprint 0)

1. **Get Instructor Approval**
   - Submit Sprint 0 deliverables
   - Wait for feedback

2. **Prepare for Sprint 1**
   - Review Sprint 1 checklist
   - Prepare development environment
   - Set up database locally

3. **Start Sprint 1**
   - Begin database and ORM implementation
   - Start user authentication
   - Continue with admin CRUD

---

## 💡 Tips for Success

1. **Start Early:** Don't wait until the last day
2. **Use Templates:** Copy examples from this guide
3. **Keep It Simple:** Don't over-engineer at this stage
4. **Document as You Go:** Write documentation while creating diagrams
5. **Commit Often:** Make small commits with clear messages
6. **Get Feedback:** Share drafts with partner for review
7. **Test Locally:** Verify all setup works before committing

---

## ⚠️ Common Mistakes to Avoid

- ❌ Creating too many branches - keep it simple
- ❌ Committing without clear messages - follow conventions
- ❌ Forgetting to document - write as you go
- ❌ Hardcoding values - use configuration files
- ❌ Skipping tests - write tests from the start
- ❌ Ignoring code standards - follow conventions

---

## 📞 Need Help?

- Check `PROJECT_CHECKLIST_PART1.md` for detailed Sprint 0 tasks
- Check `SPRINT_0_GUIDE.md` for comprehensive Sprint 0 guide
- Review course resources and documentation
- Ask instructor or TA for clarification

---

**Good luck! You've got this! 🚀**
