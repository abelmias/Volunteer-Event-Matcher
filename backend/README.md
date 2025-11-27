# Volunteer Event Matcher - Backend

Spring Boot REST API for volunteer event discovery and management.

## 🚀 Quick Start

### Prerequisites
- Java 11+
- Maven 3.6+
- PostgreSQL 12+

### Setup

1. **Configure Database**
   ```bash
   # Create PostgreSQL database
   createdb volunteer_db
   
   # Update application.properties with your credentials
   # spring.datasource.username=your_username
   # spring.datasource.password=your_password
   ```

2. **Build Project**
   ```bash
   mvn clean install
   ```

3. **Run Application**
   ```bash
   mvn spring-boot:run
   ```

   Backend will be available at: `http://localhost:8080/api`

### Database Setup

```bash
# Create database
createdb volunteer_db

# Run schema script
psql -U postgres -d volunteer_db -f ../schema.sql

# (Optional) Load sample data
psql -U postgres -d volunteer_db -f ../data.sql
```

## 📁 Project Structure

```
backend/
├── src/
│   ├── main/
│   │   ├── java/com/volunteer/
│   │   │   ├── controller/          # REST Controllers
│   │   │   ├── service/             # Business Logic
│   │   │   ├── repository/          # Data Access
│   │   │   ├── entity/              # JPA Entities
│   │   │   ├── dto/                 # Data Transfer Objects
│   │   │   ├── exception/           # Custom Exceptions
│   │   │   ├── security/            # Security & Auth
│   │   │   ├── util/                # Utilities
│   │   │   └── VolunteerEventMatcherApplication.java
│   │   └── resources/
│   │       └── application.properties
│   └── test/
│       └── java/com/volunteer/      # Unit Tests
├── pom.xml
└── README.md
```

## 🔧 Configuration

### application.properties

Key configurations:
- `server.port=8080` - Server port
- `spring.datasource.url` - Database URL
- `spring.jpa.hibernate.ddl-auto=update` - Auto-create tables
- `jwt.secret` - JWT secret key (change in production!)
- `jwt.expiration=3600000` - Token expiration (1 hour)

## 📚 API Documentation

See `../API_ENDPOINTS.md` for complete API documentation.

### Key Endpoints

**Authentication**
- `POST /auth/register` - Register new user
- `POST /auth/login` - User login
- `POST /auth/logout` - User logout

**Events**
- `GET /events` - Get all events
- `GET /events/{id}` - Get event by ID
- `POST /events` - Create event (admin only)
- `PUT /events/{id}` - Update event (admin only)
- `DELETE /events/{id}` - Delete event (admin only)

**Collections**
- `GET /collections/{userId}` - Get user's collection
- `POST /collections/{userId}/add/{eventId}` - Add event to collection
- `DELETE /collections/{userId}/remove/{eventId}` - Remove from collection
- `POST /collections/{userId}/commit` - Commit collection

**Proximity Search**
- `GET /events/proximity?lat=X&lon=Y&radius=R` - Find events within radius
- `GET /events/nearest?lat=X&lon=Y&limit=N` - Get N nearest events

## 🧪 Testing

```bash
# Run all tests
mvn test

# Run specific test class
mvn test -Dtest=EventServiceTest

# Run with coverage
mvn test jacoco:report
```

## 🔐 Security

- Passwords hashed with BCrypt
- JWT token-based authentication
- Role-based access control (ADMIN, HELPER)
- CORS configured for frontend

## 📝 Code Standards

Follow `../JAVA_CONVENTIONS.md` for:
- Naming conventions
- Code style
- Documentation
- Testing

## 🚀 Deployment

### Development
```bash
mvn spring-boot:run
```

### Production
```bash
mvn clean package
java -jar target/volunteer-event-matcher-1.0.0.jar
```

## 📖 Documentation

- `../ARCHITECTURE.md` - System architecture
- `../API_ENDPOINTS.md` - API documentation
- `../DATABASE_DESIGN.md` - Database schema
- `../JAVA_CONVENTIONS.md` - Code standards

## 🤝 Contributing

See `../CONTRIBUTING.md` for contribution guidelines.

## 📞 Support

For issues or questions, please create an issue on GitHub.

---

**Last Updated:** [Date]
