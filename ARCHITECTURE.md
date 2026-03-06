# 🏗️ ARCHITECTURE.md - CargaLog

## 📋 Índice

1. [Visão Geral](#visão-geral)
2. [Clean Architecture](#clean-architecture)
3. [Domain-Driven Design](#domain-driven-design)
4. [SOLID Principles](#solid-principles)
5. [Estrutura de Camadas](#estrutura-de-camadas)
6. [Backend Architecture](#backend-architecture)
7. [Frontend Architecture](#frontend-architecture)
8. [Mobile Architecture](#mobile-architecture)

---

## Visão Geral

**CargaLog** é uma plataforma enterprise desenvolvida com princípios de arquitetura moderna.

### Camadas Arquiteturais

```
┌────────────────────────────────────────────┐
│  📱 PRESENTATION (Web/Mobile)              │
│  - React, React Native Components          │
│  - User Interface & Navigation             │
└────────────────────────────────────────────┘
                    ↓
┌────────────────────────────────────────────┐
│  🔌 INTERFACE ADAPTERS                     │
│  - Controllers (HTTP endpoints)            │
│  - DTO Serializers/Deserializers           │
│  - Repository Implementations              │
└────────────────────────────────────────────┘
                    ↓
┌────────────────────────────────────────────┐
│  🎯 APPLICATION LAYER                      │
│  - Use Cases / Services                    │
│  - Business Logic Orchestration            │
└────────────────────────────────────────────┘
                    ↓
┌────────────────────────────────────────────┐
│  🏛️ DOMAIN LAYER (Heart)                   │
│  - Entities (User, Workout, Analysis)      │
│  - Value Objects (Carga, Repetition)       │
│  - Domain Services                         │
└────────────────────────────────────────────┘
                    ↓
┌────────────────────────────────────────────┐
│  🔧 FRAMEWORKS & DRIVERS                   │
│  - NestJS, TypeORM, Auth, APIs             │
└────────────────────────────────────────────┘
```

---

## Clean Architecture

Clean Architecture enfatiza **independência de frameworks** e **testabilidade**.

### Princípios Fundamentais

1. **Separação de Responsabilidades**
   - Cada camada tem responsabilidade clara
   - Mudanças em uma não afetam outras

2. **Reversão de Dependências**
   - Camadas internas independentes de externas
   - Externas sempre dependem de internas

3. **Isolamento de Lógica de Negócio**
   - Domínio independente de UI/BD
   - Regras podem ser testadas sem framework

4. **Facilidade de Teste**
   - Use cases testáveis sem HTTP/BD
   - Mocks e stubs triviais

---

## Domain-Driven Design

DDD coloca **domínio e lógica de negócio** no centro.

### Componentes DDD

#### 1. **Entidades (Entities)**

Objetos com identidade única:

```typescript
export class User {
  id: string;
  nome: string;
  email: string;

  constructor(nome: string, email: string) {
    this.id = generateUUID();
    this.nome = nome;
    this.email = email;
  }
}
```

#### 2. **Value Objects**

Imutáveis, sem identidade:

```typescript
export class Carga {
  private readonly valor: number;

  constructor(valor: number) {
    if (valor <= 0) {
      throw new DomainException('Carga deve ser > 0');
    }
    this.valor = valor;
  }

  obterValor(): number {
    return this.valor;
  }
}
```

#### 3. **Agregados (Aggregates)**

Clusters de objetos relacionados:

```typescript
export class Treino {
  id: string;
  usuarioId: string;
  exercicio: string;
  carga: Carga;
  repeticoes: number;
  data: Date;

  atualizarCarga(novaCarga: Carga): void {
    if (novaCarga.obterValor() < this.carga.obterValor()) {
      throw new InvalidCargaException();
    }
    this.carga = novaCarga;
  }
}
```

#### 4. **Repositórios (Repositories)**

Abstrações para persistência:

```typescript
export interface ITreinoRepository {
  salvar(treino: Treino): Promise<void>;
  obterPorId(id: string): Promise<Treino | null>;
  listarPorUsuario(usuarioId: string): Promise<Treino[]>;
  deletar(id: string): Promise<void>;
}
```

#### 5. **Domain Services**

Serviços que operam sobre múltiplas entidades:

```typescript
export class ProgressaoDomainService {
  calcularProgressao(
    treinosAntigos: Treino[],
    treinosRecentes: Treino[]
  ): ProgressaoDTO {
    const cargaMediaAntiga = this.calcularMedia(treinosAntigos);
    const cargaMediaRecente = this.calcularMedia(treinosRecentes);
    return new ProgressaoDTO(percentualMelhoria);
  }
}
```

---

## SOLID Principles

### S - Single Responsibility

Cada classe tem uma única razão para mudar:

```typescript
// ✅ BOM
class CriarUsuarioUseCase {
  executar(nome: string, email: string, senha: string) {
    // Apenas criar usuário
  }
}

class EnvioEmailService {
  enviarBemVindo(email: string) {
    // Apenas enviar email
  }
}
```

### O - Open/Closed

Aberto para extensão, fechado para modificação:

```typescript
// ✅ BOM - Extensível
interface ICalculadora {
  calcular(treinos: Treino[]): number;
}

class CalculadoraLinear implements ICalculadora {
  calcular(treinos: Treino[]): number {
    return treinos.length;
  }
}
```

### L - Liskov Substitution

Subtipos devem ser substituíveis:

```typescript
// ✅ BOM
const repo: ITreinoRepository = new RepositorySQL();
const treino = await repo.obter(id);
```

### I - Interface Segregation

Interfaces específicas, não genéricas:

```typescript
// ✅ BOM
interface IRepository<T> {
  criar(item: T): Promise<void>;
  obter(id: string): Promise<T>;
}

interface IRepositoryLeitura<T> extends IRepository<T> {
  listar(): Promise<T[]>;
}
```

### D - Dependency Inversion

Dependa de abstrações, não de implementações:

```typescript
// ✅ BOM
class TreinoController {
  constructor(private repository: ITreinoRepository) {}
}
```

---

## Estrutura de Camadas

### Backend

```
backend/src/
├── domain/                      # 🏛️ Domínio
│   ├── entities/                # Usuário, Treino, Análise
│   ├── value-objects/           # Carga, Repetições, Séries
│   ├── repositories/            # Interfaces de persistência
│   ├── exceptions/              # Exceções de domínio
│   └── services/                # Serviços de domínio
│
├── application/                 # 🎯 Aplicação
│   ├── use-cases/               # Registrar, Listar, Atualizar
│   ├── dto/                     # DTOs de entrada/saída
│   └── validators/              # Validações
│
├── interface-adapters/          # 🔌 Adaptadores
│   ├── controllers/             # HTTP endpoints
│   ├── repositories/            # Implementações SQL
│   └── presenters/              # Formatação de resposta
│
├── frameworks/                  # 🔧 Frameworks
│   ├── auth/                    # JWT, Passport
│   ├── database/                # TypeORM config
│   └── modules/                 # NestJS modules
│
└── shared/                      # 🔄 Compartilhado
    ├── decorators/
    ├── filters/
    ├── interceptors/
    └── services/
```

### Frontend

```
frontend/src/
├── pages/                    # Telas/Páginas
├── components/               # Componentes reutilizáveis
├── hooks/                    # Custom Hooks
├── contexts/                 # Context API (state)
├── api/                      # HTTP clients
├── utils/                    # Utilitários
└── styles/                   # CSS/Tailwind
```

### Mobile

```
mobile/src/
├── screens/              # Telas React Native
├── navigation/           # React Navigation
├── components/           # Componentes RN
├── contexts/             # Estado Global
├── api/                  # HTTP Clients
└── utils/                # Utilitários
```

---

## Backend Architecture

### Fluxo: Registrar Treino

```
POST /api/treinos
    ↓
TreinoController
    ├─→ Validar JWT
    ├─→ Parse request
    └─→ Chamar use case
    ↓
RegistrarTreinoUseCase
    ├─→ Validar DTO
    ├─→ Criar entidade
    └─→ Chamar repository
    ↓
Treino Entity
    ├─→ Aplicar regras
    └─→ Validar negócio
    ↓
TreinoRepository
    └─→ Persistir no BD
    ↓
✅ Response 201
```

### Dependency Injection (NestJS)

```typescript
@Module({
  providers: [
    RegistrarTreinoUseCase,
    ProgressaoDomainService,
    {
      provide: 'ITreinoRepository',
      useClass: TreinoRepositorySQL,
    },
  ],
})
export class TreinoModule {}
```

---

## Frontend Architecture

### State Management (Context API)

```typescript
type AuthContextType = {
  usuario: Usuario | null;
  loading: boolean;
  login: (email: string, senha: string) => Promise<void>;
  logout: () => void;
};

export const AuthProvider = ({ children }) => {
  const [usuario, setUsuario] = useState(null);
  // ...
};
```

---

## Mobile Architecture

### React Native + NativeWind

```typescript
// ✅ Tailwind classes funcionam
<View className="flex-1 justify-center items-center bg-blue-500">
  <Text className="text-white text-lg font-bold">
    Bem-vindo!
  </Text>
</View>

// Condicionais
<View className={`px-4 py-2 ${isActive ? 'bg-blue-600' : 'bg-gray-400'}`}>
  <Text>Status</Text>
</View>
```

---

## Padrões de Design

### Repository Pattern

Abstração para persistência:

```typescript
// Domain
export interface ITreinoRepository {
  salvar(treino: Treino): Promise<void>;
}

// Infrastructure
export class TreinoRepositorySQL implements ITreinoRepository {
  async salvar(treino: Treino): Promise<void> {
    // Persistir com TypeORM
  }
}
```

### Use Case Pattern

Encapsula fluxo de negócio:

```typescript
@Injectable()
export class RegistrarTreinoUseCase {
  async executar(input: RegistrarTreinoInput): Promise<void> {
    const treino = new Treino(/* ... */);
    await this.treinoRepository.salvar(treino);
  }
}
```

### Data Transfer Object (DTO)

Transferência de dados:

```typescript
export class RegistrarTreinoDTO {
  @IsString() exercicio: string;
  @IsNumber() @Min(0.1) carga: number;
  @IsNumber() @Min(1) repeticoes: number;
}
```

---

## Como Adicionar Feature

### 1. Domain (Regras de Negócio)
```typescript
// entities/compartilhamento.entity.ts
export class Compartilhamento {
  id: string;
  treinoId: string;
  usuarioCompartilhador: string;
}
```

### 2. Application (Lógica)
```typescript
// use-cases/compartilhar-treino.use-case.ts
@Injectable()
export class CompartilharTreinoUseCase {
  async executar(input: CompartilharTreinoInput) {
    // Validar, processar, persistir
  }
}
```

### 3. Adapters (Interface)
```typescript
// controllers/compartilhamento.controller.ts
@Post('treinos/:id/compartilhar')
async compartilhar(@Param('id') id: string) {
  return this.compartilharUseCase.executar(/* ... */);
}
```

### 4. Tests
```typescript
// Testar use case, controller, etc.
```

---

## Conclusão

CargaLog demonstra aplicação prática de **Clean Architecture**, **DDD** e **SOLID**:

✅ Código **testável** e **manutenível**
✅ Fácil **adicionar features**
✅ Independência de **frameworks**
✅ **Reutilização** de código
✅ **Performance** e **escalabilidade**

Para mais detalhes, veja os READMEs específicos de cada projeto.

