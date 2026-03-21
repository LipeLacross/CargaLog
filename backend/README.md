# 🏋️ CargaLog - Backend

<div align="center">

[🇧🇷 Português](README.md) | [🇺🇸 English](README_EN.md)

**API REST robusta para rastreamento de progressão de treinos com arquitetura limpa**

![NestJS](https://img.shields.io/badge/NestJS-E0234E?style=flat-square&logo=nestjs&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=flat-square&logo=typescript&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-336791?style=flat-square&logo=postgresql&logoColor=white)
![TypeORM](https://img.shields.io/badge/TypeORM-CC5DE8?style=flat-square&logo=typeorm&logoColor=white)
![JWT](https://img.shields.io/badge/JWT-000000?style=flat-square&logo=jsonwebtokens&logoColor=white)

</div>

---

## 📝 Sobre o Projeto

O **CargaLog Backend** é uma API REST desenvolvida com **NestJS** seguindo os princípios de **Clean Architecture** e **Domain-Driven Design (DDD)**. O sistema permite que os usuários registrem, analisem e acompanhem a progressão de carga em seus treinos de musculação.

## ✅ Status Atualizado (2026-03-21)

- Framework: `@nestjs/core@11.x` com suporte a `@nestjs/platform-fastify`
- Banco e ORM: `pg@8.18.0` + `typeorm@0.3.28`
- Segurança: `@nestjs/jwt`, `passport`, `bcrypt`
- Scripts reais: `start`, `start:dev`, `build`, `test`, `test:e2e`, `migration:run`
- Organização por camadas: `domain`, `application`, `interface-adapters`, `frameworks`, `shared`

---

### Objetivo Principal
Fornecer uma API robusta, escalável e bem testada para gerenciar:
- ✅ Autenticação segura com JWT
- ✅ Registro completo de treinos
- ✅ Análise de progressão de carga
- ✅ Comparação entre exercícios
- ✅ Estatísticas personalizadas

---

## 🎯 Funcionalidades Principais

### 🔐 Autenticação
- Registro de usuários com validação de email
- Login com geração de token JWT (7 dias)
- Proteção de rotas com Guards
- Criptografia de senhas com bcrypt (10 rounds)

### 🏋️ Gerenciamento de Treinos
- Criar, listar, atualizar e deletar treinos
- Filtros avançados (exercício, período)
- Validações de domínio (carga > 0, repetições 1-1000, séries 1-100)
- Registros estruturados com data, carga, repetições e séries

### 📊 Análises e Relatórios
- Estatísticas gerais do usuário (total treinos, exercícios únicos)
- Relatório de progresso por exercício
- Cálculo de carga máxima, média e volume total
- Identificação do exercício mais treinado
- Evolução de carga ao longo do tempo

### 🔧 Infraestrutura
- **Framework**: NestJS 11 com Fastify
- **Banco de Dados**: PostgreSQL (Supabase)
- **ORM**: TypeORM com migrations versionadas
- **Logging**: NestJS Logger + Audit Log no banco
- **Validação**: class-validator e class-transformer
- **Documentação**: Swagger/OpenAPI
- **Testes**: Vitest (305 testes unitários)

---

## 📸 Exemplo Visual da Arquitetura

```mermaid
graph TB
    subgraph "🌐 Camada de Apresentação"
        Controllers["Controllers REST<br/>auth, treino, analise"]
    end
    
    subgraph "💼 Camada de Aplicação"
        UseCases["Use Cases<br/>registrar, autenticar,<br/>gerar relatórios"]
        DTOs["DTOs<br/>Validação de entrada"]
    end
    
    subgraph "🎯 Camada de Domínio"
        Entities["Entities<br/>Usuario, Treino, Analise"]
        ValueObjects["Value Objects<br/>Email, Carga, Repeticoes"]
        Exceptions["Domain Exceptions<br/>Exceções customizadas"]
    end
    
    subgraph "🔌 Camada de Adaptadores"
        Repositories["Repositories<br/>TypeORM implementations"]
    end
    
    subgraph "🗄️ Camada de Infraestrutura"
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

## ✔️ Técnicas e Tecnologias Utilizadas

### 🏗️ Arquitetura & Design Patterns
- ✅ **Clean Architecture** - Separação em 4 camadas
- ✅ **Domain-Driven Design (DDD)** - Entities, Value Objects, Repositories
- ✅ **SOLID Principles** - SRP, OCP, LSP, ISP, DIP
- ✅ **Repository Pattern** - Abstração de dados
- ✅ **Dependency Injection** - Controle de dependências

### 🛠️ Backend Stack
- **NestJS 11** - Framework Node.js progressivo
- **Fastify** - Servidor web de alta performance
- **TypeScript** - Tipagem estática
- **TypeORM** - ORM com suporte a migrations
- **PostgreSQL** - Banco de dados relacional
- **Supabase** - Plataforma de backend

### 🔐 Segurança
- **JWT (JSON Web Tokens)** - Autenticação stateless
- **Passport** - Middleware de autenticação
- **bcrypt** - Hash de senhas
- **Class Validator** - Validação de dados
- **CORS** - Proteção de requisições cross-origin

### ✅ Testing & Quality
- **Vitest** - Framework de testes
- **@vitest/coverage-v8** - Cobertura de testes
- **ESLint** - Linting
- **Prettier** - Formatação de código

### 📊 Observabilidade
- **NestJS Logger** - Logging estruturado
- **Exception Filters** - Tratamento global de erros
- **Logging Interceptor** - Logs automáticos

---

## 📁 Estrutura do Projeto

```
backend/
├── src/
│   ├── domain/                           # 🎯 Camada de Domínio (DDD)
│   │   ├── entities/                     # Entidades principais
│   │   │   ├── usuario.entity.ts
│   │   │   ├── treino.entity.ts
│   │   │   └── analise.entity.ts
│   │   ├── value-objects/                # Objetos de valor
│   │   │   ├── email.vo.ts
│   │   │   ├── carga.vo.ts
│   │   │   └── repeticoes.vo.ts
│   │   ├── exceptions/                   # Exceções de domínio
│   │   │   └── domain.exception.ts
│   │   └── repositories/                 # Interfaces de repositórios
│   │
│   ├── application/                      # 💼 Camada de Aplicação
│   │   ├── use-cases/                    # Casos de uso
│   │   │   ├── auth/
│   │   │   ├── treino/
│   │   │   └── analise/
│   │   └── dto/                          # Data Transfer Objects
│   │
│   ├── interface-adapters/               # 🔌 Adaptadores de Interface
│   │   ├── controllers/                  # Controllers REST
│   │   │   ├── auth.controller.ts
│   │   │   ├── treino.controller.ts
│   │   │   └── analise.controller.ts
│   │   └── repositories/                 # Implementações TypeORM
│   │
│   ├── frameworks/                       # 🛠️ Frameworks & Drivers
│   │   ├── auth/                         # JWT & Guards
│   │   ├── database/                     # TypeORM config
│   │   └── modules/                      # NestJS modules
│   │
│   └── shared/                           # 🔧 Serviços Compartilhados
│       ├── decorators/
│       ├── filters/
│       ├── interceptors/
│       └── services/
│
├── test/                                 # 🧪 Testes E2E
│   ├── auth.e2e-spec.ts
│   ├── treino.e2e-spec.ts
│   └── analise.e2e-spec.ts
│
├── .env                                  # Configuração (NÃO commitar)
├── .env.example                          # Exemplo de .env
├── package.json                          # Dependências
├── tsconfig.json                         # Config TypeScript
├── vitest.config.ts                       # Config Vitest
└── ormconfig.ts                          # Config TypeORM
```

---

## 🛠️ Como Abrir e Rodar o Projeto

### 📋 Pré-requisitos

1. **Node.js 18+**
   ```bash
   node -v  # Verificar se está instalado
   ```
   Se não estiver, baixe em: https://nodejs.org/

2. **npm ou yarn**
   ```bash
   npm -v   # npm
   yarn -v  # yarn
   ```

3. **Conta Supabase** (opcional - usar banco local)
   - Criar em: https://supabase.com

### 🚀 Instalação e Setup

1. **Clone o repositório:**
   ```bash
   git clone <URL_DO_REPOSITORIO>
   cd CargaLog/backend
   ```

2. **Instale as dependências:**
   ```bash
   npm install
   ```

3. **Configure o `.env`:**
   ```bash
   cp .env.example .env
   # Edite o arquivo .env com suas credenciais
   ```

   **Variáveis necessárias:**
   ```dotenv
   # Banco de Dados
   DATABASE_URL=postgresql://...  # Supabase ou PostgreSQL local
   DIRECT_URL=postgresql://...    # Para migrations

   # JWT
   JWT_SECRET=sua_chave_secreta_com_32_caracteres_minimo
   JWT_EXPIRATION=7d

   # Outros
   PORT=3000
   NODE_ENV=development
   ```

4. **Rode as migrations:**
   ```bash
   npm run migration:run
   ```

5. **Inicie o servidor:**
   ```bash
   npm run start:dev
   ```

   **Esperado:**
   ```
   🚀 CargaLog API rodando em: http://0.0.0.0:3000
   📚 Ambiente: development
   ```

---

## 📡 API Endpoints

### 🔐 Autenticação

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

### 🏋️ Treinos (Requer JWT)

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

### 📊 Análises (Requer JWT)

```http
GET /api/v1/analises/estatisticas
Authorization: Bearer <TOKEN>
```

```http
GET /api/v1/analises/progresso/Supino?dataInicio=2026-01-01
Authorization: Bearer <TOKEN>
```

---

## 🧪 Testes

### Rodar Testes Unitários
```bash
npm run test:unit
```

**Resultado esperado:**
```
Test Suites: 24 passed
Tests:       305 passed ✅
```

### Rodar com Cobertura
```bash
npm run test:coverage
```

### Rodar em Watch Mode
```bash
npm run test:watch
```

### Rodar Testes E2E
```bash
npm run test:e2e
```

---

## 🌐 Deploy

### Deploy em Produção

1. **Build do projeto:**
   ```bash
   npm run build
   ```

2. **Variáveis de produção:**
   ```dotenv
   NODE_ENV=production
   JWT_SECRET=chave_muito_segura_e_aleatoria
   ```

3. **Rodar em produção:**
   ```bash
   npm run start:prod
   ```

### Com Docker

```bash
# Build da imagem
docker build -t cargalog-backend .

# Rodar container
docker run -p 3000:3000 --env-file .env cargalog-backend
```

### Com Docker Compose

```bash
# Iniciar serviços
docker-compose up -d

# Ver logs
docker-compose logs -f

# Parar serviços
docker-compose down
```

---

## 📚 Scripts Disponíveis

```bash
# Desenvolvimento
npm run start:dev       # Inicia em watch mode
npm run start:debug     # Inicia com debugger

# Build e Produção
npm run build           # Build do projeto
npm run start:prod      # Inicia em produção

# Testes
npm run test           # Rodar todos os testes (Vitest)
npm run test:unit      # Apenas unitários
npm run test:watch     # Watch mode
npm run test:coverage  # Com cobertura
npm run test:e2e      # Testes E2E

# Qualidade
npm run lint           # ESLint
npm run format         # Prettier

# Database
npm run migration:run     # Executar migrations
npm run migration:revert  # Reverter última
npm run migration:show    # Ver status
npm run migration:generate # Gerar nova

# Build Docker
docker-compose up      # Iniciar com Docker
docker-compose down    # Parar container
```

---

## 🔧 Variáveis de Ambiente

Crie um arquivo `.env` na raiz do projeto backend:

```dotenv
# Aplicação
NODE_ENV=development
PORT=3000
CORS_ORIGIN=*

# Banco de Dados
DATABASE_URL=postgresql://user:password@host:6543/database?pgbouncer=true
DIRECT_URL=postgresql://user:password@host:5432/database

# Autenticação
JWT_SECRET=chave_secreta_com_minimo_32_caracteres_obrigatorio
JWT_EXPIRATION=7d

# Criptografia
BCRYPT_SALT_ROUNDS=10

# Logs
LOG_LEVEL=debug
```

---

## 📊 Métricas do Projeto

| Métrica | Status |
|---------|--------|
| Cobertura de Testes | 71% |
| Testes Totais | 305 |
| Testes Passando | 305 ✅ |
| Erros de Lint | 0 |
| Clean Architecture | ✅ |
| SOLID Principles | ✅ |
| TypeScript Strict | ✅ |

---

## 🤝 Contribuindo

1. Faça um Fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

---

## 📄 Licença

Este projeto está licenciado sob a Licença MIT - veja o arquivo [LICENSE](LICENSE) para detalhes.

---

## 👥 Autores

- **GitHub Copilot** - Arquitetura e Desenvolvimento

---

## 📞 Suporte

Para suporte, abra uma issue no repositório ou entre em contato através do email do projeto.

---

<div align="center">

**[⬆ Voltar ao topo](#-cargalog---backend)**

Feito com ❤️ por desenvolvedores apaixonados por clean code

</div>

