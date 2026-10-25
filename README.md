# Event Management System (EMS)

A full-stack event management application that allows users to create, manage, and track events with location-based features.

## 📋 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Configuration](#configuration)
- [Running the Application](#running-the-application)
- [API Documentation](#api-documentation)
- [Database Management](#database-management)
- [Development](#development)
- [Testing](#testing)
- [Deployment](#deployment)

## ✨ Features

- **User Authentication & Authorization**
  - JWT-based authentication
  - Secure password hashing with bcrypt
  - Protected routes and endpoints

- **Event Management**
  - Create, read, update, and delete events
  - Event categorization
  - Date and time management
  - Location tracking with Google Maps integration
  - Event descriptions and details

- **Attendance Tracking**
  - Register attendance for events
  - View event participants
  - Track attendance history

- **Category Management**
  - Organize events by categories
  - Custom category creation
  - Category-based event filtering

- **Location Features**
  - Interactive map integration
  - Location picker for events
  - Coordinate-based event mapping (latitude/longitude)

## 🛠 Tech Stack

### Backend
- **Framework**: [NestJS](https://nestjs.com/) - Progressive Node.js framework
- **Database**: [PostgreSQL](https://www.postgresql.org/) - Relational database
- **ORM**: [Prisma](https://www.prisma.io/) - Next-generation ORM
- **Authentication**: JWT (JSON Web Tokens)
- **API Documentation**: [Swagger/OpenAPI](https://swagger.io/)
- **Validation**: class-validator, class-transformer
- **Security**: bcrypt for password hashing

### Frontend
- **Framework**: [Next.js 16](https://nextjs.org/) - React framework with App Router
- **Language**: TypeScript
- **UI Library**: [Material-UI (MUI)](https://mui.com/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **State Management**: [TanStack Query (React Query)](https://tanstack.com/query)
- **Forms**: [React Hook Form](https://react-hook-form.com/) with [Zod](https://zod.dev/) validation
- **Maps**: [React Google Maps API](https://www.npmjs.com/package/@react-google-maps/api)
- **HTTP Client**: [Axios](https://axios-http.com/)

### DevOps
- **Containerization**: Docker & Docker Compose
- **Database Migrations**: Prisma Migrate
- **Linting**: ESLint
- **Code Formatting**: Prettier

## 📁 Project Structure

```
ems/
├── backend/                 # NestJS backend application
│   ├── src/
│   │   ├── modules/        # Feature modules (auth, user, event, category, attendance)
│   │   ├── database/       # Database configuration
│   │   ├── guards/         # Authentication guards
│   │   ├── decorators/     # Custom decorators
│   │   ├── filters/        # Exception filters
│   │   ├── interceptors/   # Response interceptors
│   │   ├── pipes/          # Validation pipes
│   │   └── utils/          # Utility functions
│   ├── prisma/
│   │   ├── schema.prisma   # Database schema
│   │   └── migrations/     # Database migrations
│   └── Dockerfile
│
├── frontend/                # Next.js frontend application
│   ├── src/
│   │   ├── app/            # Next.js app directory (routes)
│   │   ├── components/     # Reusable React components
│   │   ├── containers/     # Container components
│   │   ├── context/        # React context providers
│   │   ├── hooks/          # Custom React hooks
│   │   ├── lib/            # Libraries and utilities
│   │   ├── types/          # TypeScript type definitions
│   │   └── styles/         # Global styles
│   └── Dockerfile
│
└── docker-compose.yaml      # Docker Compose configuration
```

## 📦 Prerequisites

Before you begin, ensure you have the following installed:

- [Node.js](https://nodejs.org/) (v18 or higher)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)
- [Docker](https://www.docker.com/) and [Docker Compose](https://docs.docker.com/compose/) (for containerized setup)
- [PostgreSQL](https://www.postgresql.org/) (if running without Docker)
- [Google Maps API Key](https://developers.google.com/maps/documentation/javascript/get-api-key) (for map features)

## 🚀 Installation

### 1. Clone the repository

```bash
git clone <repository-url>
cd ems
```

### 2. Install dependencies

#### Backend
```bash
cd backend
npm install
```

#### Frontend
```bash
cd frontend
npm install
```

## ⚙️ Configuration

### 1. Environment Variables

Create a `.env` file in the root directory:

```env
# Database Configuration
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_USERNAME=your_db_user
DATABASE_PASSWORD=your_db_password
DATABASE_NAME=ems_db
DATABASE_URL=postgresql://${DATABASE_USERNAME}:${DATABASE_PASSWORD}@${DATABASE_HOST}:${DATABASE_PORT}/${DATABASE_NAME}?schema=public

# Backend Configuration
BACKEND_PORT=4000
NODE_ENV=development
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRES_IN=7d

# Frontend Configuration
FRONTEND_PORT=3000
NEXT_PUBLIC_API_URL=http://localhost:4000

# Google Maps API (Optional - for location features)
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_google_maps_api_key
```

### 2. Database Setup

The database will be automatically set up when using Docker Compose. For manual setup:

```bash
cd backend
npm run db:migrate:deploy
```

## 🏃 Running the Application

### Option 1: Using Docker Compose (Recommended)

Run the entire stack (database, backend, and frontend):

```bash
docker-compose up --build
```

The services will be available at:
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:4000
- **API Documentation**: http://localhost:4000/api
- **Database**: localhost:5432

### Option 2: Running Locally

#### 1. Start PostgreSQL Database

Make sure PostgreSQL is running on your system or start it with Docker:

```bash
docker-compose up db
```

#### 2. Run Database Migrations

```bash
cd backend
npm run db:migrate:deploy
npm run client:generate
```

#### 3. Start Backend

```bash
cd backend
npm run start:dev
```

#### 4. Start Frontend

```bash
cd frontend
npm run dev
```

## 📚 API Documentation

Once the backend is running, access the interactive API documentation:

- **Swagger UI**: http://localhost:4000/api

The API documentation provides:
- Complete endpoint reference
- Request/response schemas
- Interactive API testing
- Authentication examples

### Main API Endpoints

- `POST /auth/register` - User registration
- `POST /auth/login` - User login
- `GET /users` - Get users list
- `GET /events` - Get all events
- `POST /events` - Create new event
- `GET /events/:id` - Get event details
- `PUT /events/:id` - Update event
- `DELETE /events/:id` - Delete event
- `POST /attendance` - Register attendance
- `GET /categories` - Get all categories
- `POST /categories` - Create category

## 🗄 Database Management

### Generate Prisma Client

```bash
cd backend
npm run client:generate
```

### Create a New Migration

```bash
cd backend
npm run db:migrate:dev --name migration_name
```

### Apply Migrations to Production

```bash
cd backend
npm run db:migrate:deploy
```

### Open Prisma Studio (Database GUI)

```bash
cd backend
npm run db:studio
```

### Reset Database

```bash
cd backend
npm run db:migrate:reset
```

## 💻 Development

### Backend Development

```bash
cd backend
npm run start:dev        # Start in watch mode
npm run lint             # Run linter
npm run format           # Format code
npm run test             # Run tests
npm run test:watch       # Run tests in watch mode
npm run test:cov         # Generate coverage report
```

### Frontend Development

```bash
cd frontend
npm run dev              # Start development server
npm run build            # Build for production
npm run start            # Start production server
npm run lint             # Run linter
```

### Code Quality

Both frontend and backend use:
- **ESLint** for code linting
- **Prettier** for code formatting
- **TypeScript** for type safety

## 🧪 Testing

### Backend Tests

```bash
cd backend
npm run test              # Run unit tests
npm run test:e2e          # Run end-to-end tests
npm run test:cov          # Run tests with coverage
```

## 🚢 Deployment

### Production Build

#### Using Docker Compose

```bash
docker-compose up --build -d
```

#### Manual Deployment

**Backend:**
```bash
cd backend
npm run build
npm run start:prod
```

**Frontend:**
```bash
cd frontend
npm run build
npm run start
```

### Render CD (Continuous Deployment)

CI/CD workflows run tests and deploy to Render when you push to `main`:

- **Backend** (`backend/.github/workflows/ci-cd.yml`) — lint, build, test, then deploy
- **Frontend** (`frontend/.github/workflows/ci-cd.yml`) — lint, build, then deploy

To enable deploy in each repo:

1. **Get Deploy Hook URL** from [Render Dashboard](https://dashboard.render.com/) → service → Settings → Deploy Hook
2. **Add GitHub Secret** in repo Settings → Secrets and variables → Actions:
   - `RENDER_DEPLOY_HOOK` — deploy hook URL for the service

### Environment Variables for Production

Ensure all environment variables are properly set:
- Use strong `JWT_SECRET`
- Set `NODE_ENV=production`
- Configure proper database credentials
- Set correct `NEXT_PUBLIC_API_URL`
- Add production Google Maps API key (if applicable)

### Health Checks

The database service includes health checks in the Docker Compose configuration. The backend will only start after the database is healthy.

## 📝 Database Schema

### Models

- **User**: User accounts with authentication
- **Event**: Events with details, location, and timestamps
- **Category**: Event categories for organization
- **Attendance**: Tracks user attendance at events

### Relationships

- Users can create multiple events and categories
- Events belong to categories (optional)
- Users can attend multiple events (many-to-many)
- All relationships include proper cascade deletion

## 🔒 Security

- JWT-based authentication
- Password hashing with bcrypt
- Environment variable protection
- CORS configuration
- Input validation with class-validator
- SQL injection protection via Prisma ORM
- Protected routes and guards

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the UNLICENSED License.

## 👥 Authors

- Your Name - Initial work

## 🙏 Acknowledgments

- NestJS team for the amazing framework
- Next.js team for the React framework
- Prisma team for the excellent ORM
- Material-UI team for the component library

---

For more information or support, please open an issue in the repository.

