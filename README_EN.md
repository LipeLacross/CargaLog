# 🏋️ CargaLog - Complete Platform

<div align="center">

[🇧🇷 Português](README.md) | [🇺🇸 English](README_EN.md)

**Enterprise-grade workout progression tracking platform with Clean Architecture**

![NestJS](https://img.shields.io/badge/NestJS-E0234E?style=flat-square&logo=nestjs&logoColor=white)
![React](https://img.shields.io/badge/React-61DAFB?style=flat-square&logo=react&logoColor=black)
![React%20Native](https://img.shields.io/badge/React%20Native-61DAFB?style=flat-square&logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=flat-square&logo=typescript&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-336791?style=flat-square&logo=postgresql&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-2496ED?style=flat-square&logo=docker&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)

</div>

---

## 📋 Table of Contents

- [About the Project](#about-the-project)
- [Visual Gallery](#-visual-gallery)
- [Key Features](#key-features)
- [Architecture](#architecture)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Documentation](#documentation)
- [Project Status](#project-status)

---

## About the Project

**CargaLog** is an enterprise platform for tracking workout progression in strength training. Developed with **Clean Architecture**, **Domain-Driven Design (DDD)** and **SOLID principles**, it offers an integrated experience across:

- 🖥️ **Robust Backend** with scalable REST API
- 🌐 **Responsive Web** with modern dashboard
- 📱 **Native Apps** for iOS and Android

### 🎯 Goal

Enable athletes, personal trainers and gyms to record, analyze and track load progression in real-time across multiple devices with automatic and secure synchronization.

### ✨ Key Features

#### 🔐 Security
- ✅ JWT authentication with configurable expiration
- ✅ Password encryption with bcrypt (10 rounds)
- ✅ Input validation on all routes
- ✅ CORS configured for production
- ✅ Rate limiting and attack protection

#### 🏋️ Functionality
- ✅ Workout logging with robust validation
- ✅ Complete exercise history
- ✅ Automatic max load and volume calculation
- ✅ Advanced filters by period, exercise, etc.
- ✅ Progression comparison between workouts

#### 📊 Analytics
- ✅ User-wide statistics
- ✅ Load progression charts
- ✅ Most trained exercise ranking
- ✅ Custom reports
- ✅ Data export

#### 🔄 Synchronization
- ✅ Real-time sync across devices
- ✅ Offline-first on mobile
- ✅ Automatic conflict resolution
- ✅ Automatic cloud backup

---

## 📸 Visual Gallery

<div align="center">
  <img src="./public/Screenshot%202026-03-05%20151936.png" alt="CargaLog Screenshot 1" width="80%" style="margin: 16px 0; border-radius: 10px;">
  <img src="./public/Screenshot%202026-03-05%20162017.png" alt="CargaLog Screenshot 2" width="80%" style="margin: 16px 0; border-radius: 10px;">
  <img src="./public/Screenshot%202026-03-05%20162200.png" alt="CargaLog Screenshot 3" width="80%" style="margin: 16px 0; border-radius: 10px;">
  <img src="./public/Screenshot%202026-03-05%20183148.png" alt="CargaLog Screenshot 4" width="80%" style="margin: 16px 0; border-radius: 10px;">
  <img src="./public/Screenshot%202026-03-05%20183204.png" alt="CargaLog Screenshot 5" width="80%" style="margin: 16px 0; border-radius: 10px;">
  <img src="./public/Screenshot%202026-03-05%20184905.png" alt="CargaLog Screenshot 6" width="80%" style="margin: 16px 0; border-radius: 10px;">
  <img src="./public/Screenshot%202026-03-05%20184934.png" alt="CargaLog Screenshot 7" width="80%" style="margin: 16px 0; border-radius: 10px;">
  <img src="./public/Screenshot%202026-03-05%20184958.png" alt="CargaLog Screenshot 8" width="80%" style="margin: 16px 0; border-radius: 10px;">
  <img src="./public/Screenshot%202026-03-05%20191821.png" alt="CargaLog Screenshot 9" width="80%" style="margin: 16px 0; border-radius: 10px;">
  <img src="./public/Screenshot%202026-03-06%20074833.png" alt="CargaLog Screenshot 10" width="80%" style="margin: 16px 0; border-radius: 10px;">
  <img src="./public/Screenshot%202026-03-06%20081725.png" alt="CargaLog Screenshot 11" width="80%" style="margin: 16px 0; border-radius: 10px;">
  <img src="./public/Screenshot%202026-03-06%20081731.png" alt="CargaLog Screenshot 12" width="80%" style="margin: 16px 0; border-radius: 10px;">
  <img src="./public/Screenshot%202026-03-06%20085445.png" alt="CargaLog Screenshot 13" width="80%" style="margin: 16px 0; border-radius: 10px;">
  <img src="./public/Screenshot%202026-03-06%20091739.png" alt="CargaLog Screenshot 14" width="80%" style="margin: 16px 0; border-radius: 10px;">
  <img src="./public/Screenshot_1772800641.png" alt="CargaLog Mobile Screenshot 1" width="80%" style="margin: 16px 0; border-radius: 10px;">
  <img src="./public/Screenshot_1772800646.png" alt="CargaLog Mobile Screenshot 2" width="80%" style="margin: 16px 0; border-radius: 10px;">
  <img src="./public/Screenshot_1772800649.png" alt="CargaLog Mobile Screenshot 3" width="80%" style="margin: 16px 0; border-radius: 10px;">
  <img src="./public/Screenshot_1772800654.png" alt="CargaLog Mobile Screenshot 4" width="80%" style="margin: 16px 0; border-radius: 10px;">
  <img src="./frontend/public/favicon.svg" alt="Frontend Favicon" width="80" style="margin: 16px 8px;">
  <img src="./frontend/public/vite.svg" alt="Frontend Vite Logo" width="80" style="margin: 16px 8px;">
</div>

---

## Architecture

### Clean Architecture + DDD

The project follows a clean architecture with well-defined layers:

```
┌─────────────────────────────────────────┐
│     Presentation (Web/Mobile)           │
├─────────────────────────────────────────┤
│  Interface Adapters (Controllers/API)   │
├─────────────────────────────────────────┤
│     Application (Use Cases/Services)    │
├─────────────────────────────────────────┤
│    Domain (Entities/Value Objects)      │
├─────────────────────────────────────────┤
│  Frameworks & Drivers (DB/HTTP/Auth)    │
└─────────────────────────────────────────┘
```

### SOLID Principles

- **S**RP: Each class has a single responsibility
- **O**CP: Open for extension, closed for modification
- **L**SP: Subtypes substitute base types without breaking
- **I**SP: Specific interfaces, not generic
- **D**IP: Depend on abstractions, not on concretes

---

## Tech Stack

### 📘 Backend
```
- Node.js 22 + NestJS 11 (FastifyAdapter)
- PostgreSQL 15 + TypeORM
- JWT + Passport authentication
- Jest (305 tests, 71% coverage)
- Docker & Docker Compose
```

### 🌐 Frontend Web
```
- React 19 + TypeScript
- Vite 8 (build tool)
- Tailwind CSS 4 + Recharts
- React Router
- Axios HTTP client
```

### 📱 Mobile
```
- React Native 0.84
- React Native CLI workflow
- React Navigation
- NativeWind (Tailwind CSS)
- AsyncStorage
```

---

## Project Structure

```
CargaLog/
├── 📘 backend/              # REST API (NestJS)
├── 🌐 frontend/             # Web Dashboard (React)
├── 📱 mobile/               # Native App (React Native)
├── 📋 ARCHITECTURE.md       # Architecture details
├── 📄 README.md             # Portuguese version
├── 📄 README_EN.md          # This file
└── 📋 IDEAS.md              # Roadmap & ideas
```

---

## Getting Started

### Prerequisites

```bash
node --version          # v22.0.0+
npm --version          # v10.0.0+
git --version          # 2.30+
docker --version       # For containerization (optional)
```

### Quick Start

#### 1. Clone repository
```bash
git clone https://github.com/your-username/cargalog.git
cd CargaLog
```

#### 2. Backend Setup
```bash
cd backend
npm install
cp .env.example .env
npm run migration:run
npm run start:dev
```
Access: `http://localhost:3000`

#### 3. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```
Access: `http://localhost:5173`

#### 4. Mobile Setup
```bash
cd mobile
npm install

# Terminal 1
npm run start

# Terminal 2 (Android)
npm run android

# Terminal 2 (iOS - macOS)
npm run ios
```

### With Docker
```bash
cd backend
docker-compose up -d
npm run migration:run
```

---

## Documentation

- **[Backend](./backend/README_EN.md)** - API, authentication, database
- **[Frontend](./frontend/README_EN.md)** - Dashboard, components, state
- **[Mobile](./mobile/README_EN.md)** - App, sync, offline features
- **[Architecture](./ARCHITECTURE.md)** - Design patterns & decisions

---

## Project Status

### ✅ Completed
- [x] Backend API with CRUD operations
- [x] JWT authentication & security
- [x] 305 automated tests (71% coverage)
- [x] Swagger API documentation
- [x] Docker containerization
- [x] Clean Architecture implementation

### 🔄 In Development
- [ ] Interactive web dashboard
- [ ] Real-time mobile sync
- [ ] Advanced charts & analytics
- [ ] Push notifications
- [ ] Biometric authentication

### 📋 Roadmap
- [ ] Group system & competitions
- [ ] Wearable device integration
- [ ] AI workout recommendations
- [ ] Workout plan marketplace
- [ ] Desktop app (Electron)

---

## 🤝 Contributing

1. Fork the project
2. Create a feature branch (`git checkout -b feature/MyFeature`)
3. Commit changes (`git commit -m 'Add: new feature'`)
4. Push to branch (`git push origin feature/MyFeature`)
5. Open a Pull Request

### Commit Convention
- Use: `feat:`, `fix:`, `docs:`, `refactor:`
- Example: `feat(backend): add load validation`
