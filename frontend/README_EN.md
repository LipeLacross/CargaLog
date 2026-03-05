# 🌐 CargaLog - Web Frontend

<div align="center">

[🇧🇷 Português](README.md) | [🇺🇸 English](README_EN.md)

**Responsive web dashboard for workout progress tracking**

![React](https://img.shields.io/badge/React-61DAFB?style=flat-square&logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=flat-square&logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=flat-square&logo=vite&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white)
![Axios](https://img.shields.io/badge/Axios-5A29E4?style=flat-square&logo=axios&logoColor=white)

</div>

---

## 📝 About the Project

The **CargaLog Web** is a responsive dashboard developed with **React 18** and **TypeScript**. It provides an intuitive interface for users to view, manage, and analyze their workout progression efficiently.

### Main Objective
Provide a modern and responsive web experience for:
- ✅ Manage personal workouts
- ✅ View progression in charts
- ✅ Track real-time statistics
- ✅ Compare exercises
- ✅ Monitor load evolution

---

## 🎯 Main Features

### 🔐 Authentication
- Login with email and password
- New account registration
- Password recovery
- Persistent session with localStorage

### 🏋️ Workout Management
- Create new workout
- Edit existing workout
- Delete workout
- List workouts with filters
- Filters by exercise, date, etc.

### 📊 Dashboard and Analysis
- User general statistics
- Load progression charts
- Exercise comparison
- Personal records
- Evolution over time

### 🎨 Interface
- Responsive design (mobile, tablet, desktop)
- Light/dark theme (optional)
- Intuitive navigation
- Visual feedback on actions
- Loading states

---

## 📸 Project Visual Example

<div align="center">
  <img src="" alt="Dashboard Screenshot" width="80%" style="margin: 16px 0; border-radius: 10px;">
  <img src="" alt="Treinos List Screenshot" width="80%" style="margin: 16px 0; border-radius: 10px;">
  <img src="" alt="Analytics Screenshot" width="80%" style="margin: 16px 0; border-radius: 10px;">
</div>

---

## ✔️ Techniques and Technologies Used

### 🏗️ Frontend Stack
- **React 18** - UI library
- **TypeScript** - Static typing
- **Vite** - Fast build tool
- **React Router** - Routing
- **Axios** - HTTP client

### 🎨 UI/UX
- **Tailwind CSS** - Utility-first CSS
- **Radix UI** (optional) - Accessible components
- **Recharts** - Charts
- **React Hook Form** - Form management

### 🔐 Security
- **JWT Storage** - Secure token storage
- **CORS** - Cross-origin protection
- **HTTPS** - In production

### ⚡ Performance
- **Code Splitting** - Lazy loading routes
- **Image Optimization** - Image compression
- **Caching** - Smart caching
- **Bundle Analysis** - Bundle analysis

### ✅ Testing & Quality
- **Vitest** - Testing framework
- **Testing Library** - Component testing
- **ESLint** - Linting
- **Prettier** - Formatting

---

## 📊 Architecture Diagram

```mermaid
graph TB
    subgraph "🌐 Presentation Layer"
        Pages["Pages<br/>Login, Dashboard, Workouts"]
        Components["Components<br/>Card, Modal, Form, Chart"]
    end
    
    subgraph "💼 Logic Layer"
        Hooks["Custom Hooks<br/>useAuth, useTreinos, useAnalises"]
        Context["Context API<br/>AuthContext"]
    end
    
    subgraph "🔌 API Layer"
        API["API Client<br/>axios"]
        Services["Services<br/>auth, workout, analysis"]
    end
    
    subgraph "🗄️ Backend"
        Backend["REST API<br/>NestJS"]
    end
    
    Pages --> Components
    Pages --> Hooks
    Components --> Hooks
    Hooks --> Context
    Hooks --> Services
    Services --> API
    API --> Backend
    
    style Pages fill:#e1f5ff
    style Components fill:#f3e5f5
    style Hooks fill:#e8f5e9
    style Context fill:#fff3e0
    style API fill:#fce4ec
```

---

## 📁 Project Structure

```
frontend/
├── public/
│   ├── favicon.ico
│   └── index.html
│
├── src/
│   ├── api/
│   │   ├── client.ts              # Configured axios client
│   │   ├── auth.api.ts            # Authentication endpoints
│   │   ├── treino.api.ts          # Workout endpoints
│   │   └── analise.api.ts         # Analysis endpoints
│   │
│   ├── contexts/
│   │   └── AuthContext.tsx         # Authentication context
│   │
│   ├── hooks/
│   │   ├── useAuth.ts             # Authentication hook
│   │   ├── useTreinos.ts          # Workouts hook
│   │   └── useAnalises.ts         # Analysis hook
│   │
│   ├── pages/
│   │   ├── Login.tsx              # Login page
│   │   ├── Register.tsx           # Registration page
│   │   ├── Dashboard.tsx          # Main dashboard
│   │   ├── Treinos.tsx            # Workouts list
│   │   ├── TreinoCreate.tsx        # Create workout
│   │   ├── TreinoEdit.tsx          # Edit workout
│   │   ├── Analises.tsx           # Analysis and reports
│   │   └── NotFound.tsx           # 404 page
│   │
│   ├── components/
│   │   ├── common/
│   │   │   ├── Header.tsx         # Header/Navbar
│   │   │   ├── Footer.tsx         # Footer
│   │   │   ├── Sidebar.tsx        # Sidebar
│   │   │   └── LoadingSpinner.tsx # Spinner
│   │   │
│   │   ├── layout/
│   │   │   ├── MainLayout.tsx     # Main layout
│   │   │   └── AuthLayout.tsx     # Auth layout
│   │   │
│   │   ├── forms/
│   │   │   ├── LoginForm.tsx      # Login form
│   │   │   ├── RegisterForm.tsx   # Registration form
│   │   │   └── TreinoForm.tsx     # Workout form
│   │   │
│   │   └── cards/
│   │       ├── TreinoCard.tsx     # Workout card
│   │       ├── StatCard.tsx       # Statistic card
│   │       └── RecordCard.tsx     # Record card
│   │
│   ├── styles/
│   │   ├── tailwind.css           # Tailwind configuration
│   │   └── globals.css            # Global styles
│   │
│   ├── utils/
│   │   ├── formatters.ts          # Formatting functions
│   │   ├── validators.ts          # Validators
│   │   └── constants.ts           # Constants
│   │
│   ├── App.tsx                    # Main component
│   ├── main.tsx                   # Application entry
│   └── vite-env.d.ts              # Vite types
│
├── .env                           # Environment variables
├── .env.example                   # .env example
├── package.json                   # Dependencies
├── tsconfig.json                  # TypeScript config
├── vite.config.ts                 # Vite config
└── tailwind.config.js             # Tailwind config
```

---

## 🛠️ How to Open and Run the Project

### 📋 Prerequisites

1. **Node.js 18+**
   ```bash
   node -v
   ```

2. **npm or yarn**
   ```bash
   npm -v
   ```

3. **Backend running**
   - Backend must be available at `http://localhost:3000`

### 🚀 Installation and Setup

1. **Clone the repository:**
   ```bash
   git clone <REPOSITORY_URL>
   cd CargaLog/frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure `.env`:**
   ```bash
   cp .env.example .env
   ```

   ```dotenv
   VITE_API_URL=http://localhost:3000/api/v1
   ```

4. **Start the development server:**
   ```bash
   npm run dev
   ```

   **Expected output:**
   ```
   ➜  Local:   http://127.0.0.1:5173/
   ```

---

## 📚 Available Scripts

```bash
# Development
npm run dev          # Start development server
npm run dev:host     # Expose to local network

# Build and Production
npm run build        # Build for production
npm run preview      # Preview the build

# Tests
npm run test         # Run tests
npm run test:ui      # Tests with UI
npm run test:cov     # With coverage

# Quality
npm run lint         # ESLint
npm run format       # Prettier
npm run type-check   # Check TypeScript types
```

---

## 🔧 `.env` Configuration

```dotenv
# API
VITE_API_URL=http://localhost:3000/api/v1

# Environment
VITE_ENV=development
```

---

## 🌐 Deploy

### Netlify

```bash
# 1. Install Netlify CLI
npm install -g netlify-cli

# 2. Build
npm run build

# 3. Deploy
netlify deploy --prod --dir=dist
```

### Vercel

```bash
# 1. Install Vercel CLI
npm install -g vercel

# 2. Deploy
vercel --prod
```

### GitHub Pages

```bash
# 1. Configure vite.config.ts
export default defineConfig({
  base: '/CargaLog/'
})

# 2. Build
npm run build

# 3. Deploy (via GitHub Actions)
```

---

## 📊 Metrics

| Metric | Status |
|--------|--------|
| Performance (Lighthouse) | 90+ |
| Responsiveness | ✅ |
| Accessibility | 95+ |
| Type Coverage | 100% |
| Bundle Size | < 300KB |

---

## 🤝 Contributing

1. Fork the project
2. Create a branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

---

## 📄 License

MIT License - see the LICENSE file for details.

---

<div align="center">

**[⬆ Back to top](#-cargalog---web-frontend)**

Made with ❤️ by developers passionate about clean code

</div>

