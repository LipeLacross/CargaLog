# 🏋️ Arquitetura CargaLog - Fullstack

## 📐 Visão Geral

**CargaLog** é uma plataforma fullstack para rastreamento de progressão de treinos, composta por 3 camadas:
- 📘 **Backend**: NestJS + TypeORM + PostgreSQL (Clean Architecture + DDD)
- 🌐 **Frontend Web**: React + TypeScript + Vite
- 📱 **Mobile**: React Native + Expo

```
┌─────────────────────────────────────────────────────────┐
│                  🏋️ CargaLog Platform                   │
├─────────────────────────────────────────────────────────┤
│                                                           │
│  📱 Mobile               🌐 Web                 📘 Backend │
│  (React Native)          (React)             (NestJS)     │
│  - iOS/Android           - Dashboard          - REST API   │
│  - Expo                  - Gráficos           - JWT Auth   │
│  - Offline               - Responsive         - PostgreSQL │
│                                                            │
│  └──────────────────────┬──────────────────────┘          │
│                         │ REST API                         │
│                    JWT Authentication                      │
│                                                            │
│              🗄️ PostgreSQL (Supabase)                     │
│              - Usuarios, Treinos, Analises                │
│              - Migrations versionadas                     │
│                                                            │
└─────────────────────────────────────────────────────────┘
```

---

## 📘 Backend (NestJS + Clean Architecture)

### Estrutura

```
backend/
├── src/
│   ├── domain/                    # 🎯 Camada de Domínio (DDD)
│   │   ├── entities/              # Usuario, Treino, Analise
│   │   ├── value-objects/         # Email, Carga, Repeticoes
│   │   ├── exceptions/            # Domain exceptions
│   │   └── repositories/          # Repository interfaces
│   │
│   ├── application/               # 💼 Camada de Aplicação
│   │   ├── use-cases/             # 8 use cases (auth, treino, analise)
│   │   └── dto/                   # DTOs com validação
│   │
│   ├── interface-adapters/        # 🔌 Adaptadores
│   │   ├── controllers/           # 3 controllers REST
│   │   └── repositories/          # TypeORM implementations
│   │
│   ├── frameworks/                # 🛠️ NestJS + TypeORM
│   │   ├── auth/                  # JWT Strategy
│   │   ├── database/              # TypeORM config + migrations
│   │   └── modules/               # NestJS modules
│   │
│   └── shared/                    # 🔧 Serviços comuns
│       ├── decorators/            # @CurrentUser()
│       ├── filters/               # Exception filters
│       ├── interceptors/          # Logging
│       └── services/              # Logger, Config
│
├── test/                          # 🧪 Testes E2E
├── .env                           # Configuração
└── package.json                   # 305 testes, 71% cobertura
```

### Princípios
- ✅ **Clean Architecture** (4 camadas)
- ✅ **DDD** (Entities, VOs, Aggregates)
- ✅ **SOLID** (SRP, OCP, LSP, ISP, DIP)
- ✅ **Fastify** (alta performance)
- ✅ **TypeORM** (migrations versionadas)

### Endpoints
```
POST   /api/v1/auth/registrar          # Criar conta
POST   /api/v1/auth/login              # Login (JWT)
GET    /api/v1/auth/perfil             # Perfil (autenticado)

POST   /api/v1/treinos                 # Criar treino
GET    /api/v1/treinos                 # Listar treinos
PATCH  /api/v1/treinos/:id             # Atualizar
DELETE /api/v1/treinos/:id             # Deletar

GET    /api/v1/analises/estatisticas   # Estatísticas
GET    /api/v1/analises/progresso/:ex  # Progresso
```

---

## 🌐 Frontend Web (React + TypeScript)

### Estrutura

```
frontend/
├── src/
│   ├── api/                 # HTTP client (Axios)
│   │   ├── client.ts
│   │   ├── auth.api.ts
│   │   ├── treino.api.ts
│   │   └── analise.api.ts
│   │
│   ├── pages/               # Páginas SPA
│   │   ├── Login.tsx
│   │   ├── Dashboard.tsx
│   │   ├── Treinos.tsx
│   │   └── Analises.tsx
│   │
│   ├── components/          # Componentes React
│   │   ├── common/
│   │   ├── forms/
│   │   ├── cards/
│   │   └── charts/
│   │
│   ├── hooks/               # Custom hooks
│   │   ├── useAuth.ts
│   │   ├── useTreinos.ts
│   │   └── useAnalises.ts
│   │
│   ├── contexts/            # Context API
│   │   └── AuthContext.tsx
│   │
│   └── styles/              # Tailwind CSS
│
└── package.json             # React 18, TypeScript, Vite
```

### Stack
- **React 18** - UI moderna
- **TypeScript** - Type-safe
- **Vite** - Build rápido
- **Tailwind CSS** - Styling
- **React Router** - SPA routing
- **Recharts** - Gráficos

---

## 📱 Mobile (React Native + Expo)

### Estrutura

```
mobile/
├── app/
│   ├── screens/             # Telas RN
│   │   ├── auth/
│   │   └── main/
│   │
│   ├── components/          # Componentes RN
│   │   ├── common/
│   │   ├── forms/
│   │   └── charts/
│   │
│   ├── navigation/          # React Navigation
│   │   ├── RootNavigator.tsx
│   │   └── AuthNavigator.tsx
│   │
│   ├── api/                 # HTTP client
│   ├── store/               # Redux
│   ├── hooks/               # Custom hooks
│   └── services/            # AsyncStorage, Biometrics
│
└── package.json             # React Native, Expo, TypeScript
```

### Stack
- **React Native** - Multiplataforma
- **Expo** - Desenvolvimento rápido
- **TypeScript** - Type-safe
- **React Navigation** - Navegação nativa
- **Redux** - State management
- **AsyncStorage** - Persistência local

---

## 🔗 Fluxo de Dados

```
┌─────────────┐         ┌─────────────────────┐
│  Frontend   │         │   Mobile (RN)       │
│   (React)   │         │   (Expo)            │
└──────┬──────┘         └────────┬────────────┘
       │                         │
       └────────────┬────────────┘
                    │ REST API
                    │ JSON + JWT
            ┌───────▼────────┐
            │    Backend     │
            │   (NestJS)     │
            │  Fastify       │
            └───────┬────────┘
                    │ SQL
            ┌───────▼────────┐
            │  PostgreSQL    │
            │  (Supabase)    │
            └────────────────┘
```

---

## 🔐 Segurança

- **JWT** - Autenticação stateless (7 dias)
- **bcrypt** - Hash de senhas (10 rounds)
- **CORS** - Proteção cross-origin
- **Validação** - class-validator + DTOs
- **Guards** - JWT + Role-based (futura)

---

## 🧪 Testes

| Projeto | Testes | Cobertura | Status |
|---------|--------|-----------|--------|
| Backend | 305 | 71% | ✅ |
| Frontend | - | - | 🔄 |
| Mobile | - | - | 🔄 |

**Backend**: Unitários (sem banco), E2E (com banco), Integração

---

## 🚀 Deploy

- **Backend**: Docker + Supabase (PostgreSQL)
- **Frontend**: Netlify / Vercel
- **Mobile**: App Store / Google Play (EAS Build)

---

## 📋 Convenções

- **Commits**: Conventional Commits (feat, fix, refactor)
- **Branches**: feature/*, fix/*, release/*
- **Code**: ESLint + Prettier
- **Docs**: Markdown em português + English

---

**Última atualização**: 05/03/2026 | **Versão**: 2.0.0
