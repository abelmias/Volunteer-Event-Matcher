# Volunteer Event Matcher - Frontend

Angular single-page application for volunteer event discovery and management.

## 🚀 Quick Start

### Prerequisites
- Node.js 14+
- npm 6+
- Angular CLI 14+

### Setup

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Start Development Server**
   ```bash
   ng serve
   ```
   or
   ```bash
   npm start
   ```

   Frontend will be available at: `http://localhost:4200`

3. **Build for Production**
   ```bash
   ng build --configuration production
   ```

## 📁 Project Structure

```
frontend/
├── src/
│   ├── app/
│   │   ├── components/
│   │   │   ├── auth/              # Authentication components
│   │   │   ├── admin/             # Admin dashboard components
│   │   │   ├── helper/            # Helper/volunteer components
│   │   │   └── shared/            # Shared components
│   │   ├── services/              # Angular services
│   │   ├── models/                # TypeScript interfaces
│   │   ├── guards/                # Route guards
│   │   ├── interceptors/          # HTTP interceptors
│   │   ├── app.module.ts          # Root module
│   │   ├── app-routing.module.ts  # Routing configuration
│   │   ├── app.component.ts       # Root component
│   │   ├── app.component.html
│   │   └── app.component.css
│   ├── assets/                    # Static assets
│   ├── environments/              # Environment configs
│   ├── index.html                 # HTML entry point
│   ├── main.ts                    # Bootstrap file
│   └── styles.css                 # Global styles
├── angular.json                   # Angular CLI config
├── package.json                   # NPM dependencies
├── tsconfig.json                  # TypeScript config
└── README.md
```

## 🔧 Configuration

### Environment Configuration

Create `src/environments/environment.ts`:
```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:8080/api'
};
```

Create `src/environments/environment.prod.ts`:
```typescript
export const environment = {
  production: true,
  apiUrl: 'https://api.example.com/api'
};
```

## 📚 API Integration

Services communicate with the Spring Boot backend at `http://localhost:8080/api`.

See `../API_ENDPOINTS.md` for complete API documentation.

### Key Services

- `AuthService` - User authentication
- `EventService` - Event management
- `CollectionService` - Collection management
- `MapService` - Map integration

## 🧪 Testing

```bash
# Run unit tests
ng test

# Run with coverage
ng test --code-coverage

# Run E2E tests
ng e2e
```

## 🎨 Styling

- Bootstrap 5 for responsive design
- Custom CSS for component styling
- CSS variables for theming

## 📖 Code Standards

Follow `../ANGULAR_CONVENTIONS.md` for:
- Naming conventions
- File structure
- Component guidelines
- Service guidelines
- Testing conventions

## 🚀 Deployment

### Development
```bash
ng serve
```

### Production
```bash
ng build --configuration production
# Deploy dist/volunteer-event-matcher to web server
```

## 📚 Documentation

- `../ARCHITECTURE.md` - System architecture
- `../API_ENDPOINTS.md` - API documentation
- `../ANGULAR_CONVENTIONS.md` - Code standards

## 🤝 Contributing

See `../CONTRIBUTING.md` for contribution guidelines.

## 📞 Support

For issues or questions, please create an issue on GitHub.

---

**Last Updated:** [Date]
