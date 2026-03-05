# 🏋️ CargaLog - Backend

<div align="center">

[🇧🇷 Português](README.md) | [🇺🇸 English](README_EN.md)

**Robust REST API for workout progress tracking with clean architecture**

![NestJS](https://img.shields.io/badge/NestJS-E0234E?style=flat-square&logo=nestjs&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=flat-square&logo=typescript&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-336791?style=flat-square&logo=postgresql&logoColor=white)
![TypeORM](https://img.shields.io/badge/TypeORM-CC5DE8?style=flat-square&logo=typeorm&logoColor=white)
![JWT](https://img.shields.io/badge/JWT-000000?style=flat-square&logo=jsonwebtokens&logoColor=white)

</div>

---

## 📝 About the Project

The **CargaLog Backend** is a REST API developed with **NestJS** following the principles of **Clean Architecture** and **Domain-Driven Design (DDD)**. The system allows users to register, analyze, and track load progression in their strength training workouts.

### Main Objective
Provide a robust, scalable, and well-tested API to manage:
- ✅ Secure authentication with JWT
- ✅ Complete workout registration
- ✅ Load progression analysis
- ✅ Exercise comparison
- ✅ Personalized statistics

---

## 🎯 Main Features

### 🔐 Authentication
- User registration with email validation
- Login with JWT token generation (7 days)
- Route protection with Guards
- Password encryption with bcrypt (10 rounds)

### 🏋️ Workout Management
- Create, list, update, and delete workouts
- Advanced filters (exercise, period)
- Domain validations (load > 0, reps 1-1000, sets 1-100)
- Structured records with date, load, reps, and sets

### 📊 Analysis and Reports
- General user statistics (total workouts, unique exercises)
- Exercise progress report
- Maximum, average load calculation, and total volume
- Identification of most trained exercise
- Load evolution over time

### 🔧 Infrastructure
- **Framework**: NestJS 11 with Fastify
- **Database**: PostgreSQL (Supabase)
- **ORM**: TypeORM with versioned migrations
- **Logging**: Winston integrated
- **Validation**: class-validator and class-transformer
- **Tests**: Jest with 305 unit tests (71% coverage)

---

## 📸 Architecture Visual Example

```mermaid
graph TB
    subgraph "🌐 Presentation Layer"
        Controllers["Controllers REST<br/>auth, workout, analysis"]
    end
    
    subgraph "💼 Application Layer"
        UseCases["Use Cases<br/>register, authenticate,<br/>generate reports"]
        DTOs["DTOs<br/>Input validation"]
    end
    
    subgraph "🎯 Domain Layer"
        Entities["Entities<br/>User, Workout, Analysis"]
        ValueObjects["Value Objects<br/>Email, Load, Reps"]
        Exceptions["Domain Exceptions<br/>Custom exceptions"]
    end
    
    subgraph "🔌 Adapters Layer"
        Repositories["Repositories<br/>TypeORM implementations"]
    end
    
    subgraph "🗄️ Infrastructure Layer"
        Database["PostgreSQL<br/>Supabase"]
        Auth["JWT Strategy<br/>Passport"]
    end
    
    Controllers --> UseCases
    UseCases --> Entities
    UseCases --> ValueObjects
    Entities --> Exceptions
    Repositories --> Database
    Auth --> Controllers
    
    style Controllers fill:#e1f5ff
    style UseCases fill:#f3e5f5
    style Entities fill:#e8f5e9
    style Repositories fill:#fff3e0
    style Database fill:#fce4ec
```

---

## ✔️ Techniques and Technologies Used

### 🏗️ Architecture & Design Patterns
- ✅ **Clean Architecture** - 4-layer separation
- ✅ **Domain-Driven Design (DDD)** - Entities, Value Objects, Repositories
- ✅ **SOLID Principles** - SRP, OCP, LSP, ISP, DIP
- ✅ **Repository Pattern** - Data abstraction
- ✅ **Dependency Injection** - Dependency management

### 🛠️ Backend Stack
- **NestJS 11** - Progressive Node.js framework
- **Fastify** - High-performance web server
- **TypeScript** - Static typing
- **TypeORM** - ORM with migration support
- **PostgreSQL** - Relational database
- **Supabase** - Backend platform

### 🔐 Security
- **JWT (JSON Web Tokens)** - Stateless authentication
- **Passport** - Authentication middleware
- **bcrypt** - Password hashing
- **Class Validator** - Data validation
- **CORS** - Cross-origin request protection

### ✅ Testing & Quality
- **Jest** - Testing framework
- **ts-jest** - TypeScript support in Jest
- **Supertest** - HTTP testing
- **ESLint** - Linting
- **Prettier** - Code formatting

### 📊 Observability
- **Winston** - Structured logging
- **Exception Filters** - Global error handling
- **Logging Interceptor** - Automatic logs

---

## 📁 Project Structure

```
backend/
├── src/
│   ├── domain/                           # 🎯 Domain Layer (DDD)
│   │   ├── entities/                     # Main entities
│   │   │   ├── usuario.entity.ts
│   │   │   ├── treino.entity.ts
│   │   │   └── analise.entity.ts
│   │   ├── value-objects/                # Value objects
│   │   │   ├── email.vo.ts
│   │   │   ├── carga.vo.ts
│   │   │   └── repeticoes.vo.ts
│   │   ├── exceptions/                   # Domain exceptions
│   │   │   └── domain.exception.ts
│   │   └── repositories/                 # Repository interfaces
│   │
│   ├── application/                      # 💼 Application Layer
│   │   ├── use-cases/                    # Use cases
│   │   │   ├── auth/
│   │   │   ├── treino/
│   │   │   └── analise/
│   │   └── dto/                          # Data Transfer Objects
│   │
│   ├── interface-adapters/               # 🔌 Interface Adapters
│   │   ├── controllers/                  # REST Controllers
│   │   │   ├── auth.controller.ts
│   │   │   ├── treino.controller.ts
│   │   │   └── analise.controller.ts
│   │   └── repositories/                 # TypeORM implementations
│   │
│   ├── frameworks/                       # 🛠️ Frameworks & Drivers
│   │   ├── auth/                         # JWT & Guards
│   │   ├── database/                     # TypeORM config
│   │   └── modules/                      # NestJS modules
│   │
│   └── shared/                           # 🔧 Shared Services
│       ├── decorators/
│       ├── filters/
│       ├── interceptors/
│       └── services/
│
├── test/                                 # 🧪 E2E Tests
│   ├── auth.e2e-spec.ts
│   ├── treino.e2e-spec.ts
│   └── analise.e2e-spec.ts
│
├── .env                                  # Configuration (DO NOT commit)
├── .env.example                          # .env example
├── package.json                          # Dependencies
├── tsconfig.json                         # TypeScript config
├── jest.config.js                        # Jest config
└── ormconfig.ts                          # TypeORM config
```

---

## 🛠️ How to Open and Run the Project

### 📋 Prerequisites

1. **Node.js 18+**
   ```bash
   node -v  # Check if installed
   ```
   If not installed, download from: https://nodejs.org/

2. **npm or yarn**
   ```bash
   npm -v   # npm
   yarn -v  # yarn
   ```

3. **Supabase Account** (optional - use local database)
   - Create at: https://supabase.com

### 🚀 Installation and Setup

1. **Clone the repository:**
   ```bash
   git clone <REPOSITORY_URL>
   cd CargaLog/backend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure `.env`:**
   ```bash
   cp .env.example .env
   # Edit .env file with your credentials
   ```

   **Required variables:**
   ```dotenv
   # Database
   DATABASE_URL=postgresql://...  # Supabase or local PostgreSQL
   DIRECT_URL=postgresql://...    # For migrations

   # JWT
   JWT_SECRET=your_secret_key_with_minimum_32_characters
   JWT_EXPIRATION=7d

   # Others
   PORT=3000
   NODE_ENV=development
   ```

4. **Run migrations:**
   ```bash
   npm run migration:run
   ```

5. **Start the server:**
   ```bash
   npm run start:dev
   ```

   **Expected output:**
   ```
   🚀 CargaLog API running at: http://0.0.0.0:3000
   📚 Environment: development
   ```

---

## 📡 API Endpoints

### 🔐 Authentication

```http
POST /api/v1/auth/registrar
Content-Type: application/json

{
  "nome": "João Silva",
  "email": "joao@example.com",
  "senha": "Senha@123"
}
```

```http
POST /api/v1/auth/login
Content-Type: application/json

{
  "email": "joao@example.com",
  "senha": "Senha@123"
}
```

```http
GET /api/v1/auth/perfil
Authorization: Bearer <TOKEN>
```

### 🏋️ Workouts (Requires JWT)

```http
POST /api/v1/treinos
Authorization: Bearer <TOKEN>

{
  "exercicioNome": "Supino Reto",
  "carga": 80,
  "repeticoes": 10,
  "series": 3
}
```

```http
GET /api/v1/treinos?exercicio=Supino&dataInicio=2026-01-01
Authorization: Bearer <TOKEN>
```

```http
PATCH /api/v1/treinos/:id
Authorization: Bearer <TOKEN>

{
  "carga": 85
}
```

```http
DELETE /api/v1/treinos/:id
Authorization: Bearer <TOKEN>
```

### 📊 Analysis (Requires JWT)

```http
GET /api/v1/analises/estatisticas
Authorization: Bearer <TOKEN>
```

```http
GET /api/v1/analises/progresso/Supino?dataInicio=2026-01-01
Authorization: Bearer <TOKEN>
```

---

## 🧪 Tests

### Run Unit Tests
```bash
npm run test:unit
```

**Expected output:**
```
Test Suites: 24 passed
Tests:       305 passed ✅
```

### Run with Coverage
```bash
npm run test:cov
```

### Run in Watch Mode
```bash
npm run test:watch
```

### Run E2E Tests
```bash
npm run test:e2e
```

---

## 🌐 Deploy

### Production Deployment

1. **Build the project:**
   ```bash
   npm run build
   ```

2. **Production variables:**
   ```dotenv
   NODE_ENV=production
   JWT_SECRET=very_secure_and_random_key
   ```

3. **Run in production:**
   ```bash
   npm run start:prod
   ```

### With Docker

```bash
# Build image
docker build -t cargalog-backend .

# Run container
docker run -p 3000:3000 --env-file .env cargalog-backend
```

### With Docker Compose

```bash
# Start services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

---

## 📚 Available Scripts

```bash
# Development
npm run start:dev       # Start in watch mode
npm run start:debug     # Start with debugger

# Build and Production
npm run build           # Build project
npm run start:prod      # Start in production

# Tests
npm run test           # Run all tests
npm run test:unit      # Unit tests only
npm run test:watch     # Watch mode
npm run test:cov       # With coverage
npm run test:debug     # With debugger

# Quality
npm run lint           # ESLint
npm run format         # Prettier

# Database
npm run migration:run     # Execute migrations
npm run migration:revert  # Revert last migration
npm run migration:show    # Show status
npm run migration:generate # Generate new migration

# Docker Build
docker-compose up      # Start with Docker
docker-compose down    # Stop container
```

---

## 🔧 Environment Variables

Create a `.env` file in the backend root:

```dotenv
# Application
NODE_ENV=development
PORT=3000
CORS_ORIGIN=*

# Database
DATABASE_URL=postgresql://user:password@host:6543/database?pgbouncer=true
DIRECT_URL=postgresql://user:password@host:5432/database

# Authentication
JWT_SECRET=secret_key_with_minimum_32_characters_required
JWT_EXPIRATION=7d

# Encryption
BCRYPT_SALT_ROUNDS=10

# Logs
LOG_LEVEL=debug
```

---

## 📊 Project Metrics

| Metric | Status |
|--------|--------|
| Test Coverage | 71% |
| Total Tests | 305 |
| Tests Passing | 305 ✅ |
| Lint Errors | 0 |
| Clean Architecture | ✅ |
| SOLID Principles | ✅ |
| TypeScript Strict | ✅ |

---

## 🤝 Contributing

1. Fork the project
2. Create a branch for your feature (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 👥 Authors

- **GitHub Copilot** - Architecture and Development

---

## 📞 Support

For support, open an issue in the repository or contact us through the project email.

---

<div align="center">

**[⬆ Back to top](#-cargalog---backend)**

Made with ❤️ by developers passionate about clean code

</div>

