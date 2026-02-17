# Plano de Implementação - Backend CargaLog

## Visão Geral

Implementar o backend do **CargaLog** seguindo **Clean Architecture** e **Domain-Driven Design (DDD)** com aplicação dos princípios **SOLID**. O sistema permite registro e análise de progressão de carga em exercícios de musculação.

---

## Objetivo

Criar uma API RESTful escalável, modular e de fácil manutenção que permita:
- Registro de treinos com exercícios, cargas e repetições
- Autenticação e autorização de usuários
- Análise de progresso ao longo do tempo
- Geração de relatórios de evolução

---

## Arquitetura

### Camadas da Clean Architecture

1. **Domain Layer (Camada de Domínio)**
   - Entidades de domínio com regras de negócio
   - Value Objects
   - Agregados (quando justificado)
   - Interfaces de repositórios (contratos)

2. **Application Layer (Camada de Aplicação)**
   - Casos de uso (Use Cases)
   - Serviços de aplicação
   - Interfaces de serviços
   - DTOs de entrada/saída

3. **Interface Adapters Layer (Camada de Adaptadores)**
   - Controllers REST
   - Implementações concretas de repositórios
   - Mappers/Transformers
   - Validadores

4. **Frameworks & Drivers Layer (Camada de Infraestrutura)**
   - Configuração NestJS
   - Configuração TypeORM
   - Configuração JWT
   - Database migrations
   - Guards e Middlewares

---

## Stack Tecnológica

### Backend
- **NestJS** - Framework Node.js
- **Fastify** - Servidor HTTP (já configurado)
- **TypeORM** - ORM para PostgreSQL
- **PostgreSQL** - Banco de dados relacional
- **JWT** - Autenticação e autorização
- **bcrypt** - Criptografia de senhas
- **class-validator** - Validação de DTOs
- **class-transformer** - Transformação de objetos

### Desenvolvimento
- **TypeScript** - Linguagem
- **Jest** - Testes unitários e E2E
- **ESLint** - Linting
- **Prettier** - Formatação

---

## Estrutura de Diretórios

```
backend/src/
├── domain/                           # Camada de Domínio
│   ├── entities/                     # Entidades de domínio
│   │   ├── usuario.entity.ts
│   │   ├── treino.entity.ts
│   │   └── analise.entity.ts
│   ├── value-objects/                # Objetos de valor
│   │   ├── carga.vo.ts
│   │   ├── repeticoes.vo.ts
│   │   └── email.vo.ts
│   ├── aggregates/                   # Agregados (se necessário)
│   └── repositories/                 # Interfaces de repositórios
│       ├── usuario.repository.interface.ts
│       ├── treino.repository.interface.ts
│       └── analise.repository.interface.ts
│
├── application/                      # Camada de Aplicação
│   ├── use-cases/                    # Casos de uso
│   │   ├── auth/
│   │   │   ├── registrar-usuario.use-case.ts
│   │   │   ├── autenticar-usuario.use-case.ts
│   │   │   └── validar-token.use-case.ts
│   │   ├── treino/
│   │   │   ├── registrar-treino.use-case.ts
│   │   │   ├── listar-treinos.use-case.ts
│   │   │   ├── atualizar-treino.use-case.ts
│   │   │   └── deletar-treino.use-case.ts
│   │   └── analise/
│   │       ├── gerar-relatorio-progresso.use-case.ts
│   │       └── obter-estatisticas.use-case.ts
│   ├── services/                     # Serviços de aplicação
│   │   └── analise.service.ts
│   ├── dto/                          # DTOs de aplicação
│   │   ├── auth/
│   │   │   ├── registrar-usuario.dto.ts
│   │   │   ├── login.dto.ts
│   │   │   └── token-payload.dto.ts
│   │   ├── treino/
│   │   │   ├── create-treino.dto.ts
│   │   │   ├── update-treino.dto.ts
│   │   │   └── treino-response.dto.ts
│   │   └── analise/
│   │       ├── relatorio-progresso.dto.ts
│   │       └── estatisticas.dto.ts
│   └── interfaces/                   # Interfaces de serviços
│       └── analise.service.interface.ts
│
├── interface-adapters/               # Camada de Adaptadores
│   ├── controllers/                  # Controllers REST
│   │   ├── auth.controller.ts
│   │   ├── treino.controller.ts
│   │   └── analise.controller.ts
│   ├── repositories/                 # Implementações de repositórios
│   │   ├── typeorm-usuario.repository.ts
│   │   ├── typeorm-treino.repository.ts
│   │   └── typeorm-analise.repository.ts
│   └── mappers/                      # Mappers entre camadas
│       ├── usuario.mapper.ts
│       ├── treino.mapper.ts
│       └── analise.mapper.ts
│
├── frameworks/                       # Camada de Frameworks
│   ├── database/                     # Configuração de banco
│   │   ├── typeorm.config.ts
│   │   ├── migrations/
│   │   └── seeds/
│   ├── auth/                         # Configuração de autenticação
│   │   ├── jwt.strategy.ts
│   │   ├── jwt-auth.guard.ts
│   │   └── roles.guard.ts
│   └── modules/                      # Módulos NestJS
│       ├── database.module.ts
│       ├── auth.module.ts
│       ├── usuario.module.ts
│       ├── treino.module.ts
│       └── analise.module.ts
│
└── shared/                           # Utilitários compartilhados
    ├── services/                     # Serviços utilitários
    │   ├── jwt.service.ts
    │   ├── encryption.service.ts
    │   └── logger.service.ts
    ├── decorators/                   # Decorators customizados
    │   ├── current-user.decorator.ts
    │   └── roles.decorator.ts
    ├── filters/                      # Exception filters
    │   └── http-exception.filter.ts
    ├── interceptors/                 # Interceptors
    │   └── logging.interceptor.ts
    └── validators/                   # Validadores customizados
        └── is-strong-password.validator.ts
```

---

## Etapas de Implementação

### Fase 1: Configuração Base e Dependências

**Objetivo**: Preparar ambiente e instalar dependências necessárias

#### 1.1 - Instalar Dependências

```bash
# Dependências de produção
npm install @nestjs/typeorm typeorm pg
npm install @nestjs/jwt @nestjs/passport passport passport-jwt
npm install @nestjs/config
npm install @nestjs/platform-fastify
npm install bcrypt
npm install class-validator class-transformer

# Dependências de desenvolvimento
npm install -D @types/bcrypt @types/passport-jwt
```

#### 1.2 - Configurar Variáveis de Ambiente

Atualizar `.env` com configurações necessárias:
- JWT_SECRET
- JWT_EXPIRATION
- DATABASE_URL
- DIRECT_URL
- PORT
- NODE_ENV

#### 1.3 - Configurar TypeORM

Criar `frameworks/database/typeorm.config.ts` com:
- Conexão PostgreSQL
- Entidades
- Migrations
- Configurações por ambiente (dev/test/prod)

---

### Fase 2: Camada de Domínio (Domain Layer)

**Objetivo**: Criar entidades, value objects e interfaces de repositórios

#### 2.1 - Criar Entidades de Domínio

**Usuario Entity** (`domain/entities/usuario.entity.ts`)
- Propriedades: id, nome, email, senha (hash), criadoEm, atualizadoEm
- Métodos: validarSenha(), atualizarSenha()
- Decorators TypeORM
- Validações de domínio

**Treino Entity** (`domain/entities/treino.entity.ts`)
- Propriedades: id, usuarioId, exercicioNome, carga, repeticoes, series, observacoes, data, criadoEm
- Relacionamento: Many-to-One com Usuario
- Métodos de validação de carga e repetições
- Lógica de domínio para progressão

**Analise Entity** (`domain/entities/analise.entity.ts`)
- Propriedades: id, usuarioId, exercicioNome, periodoInicio, periodoFim, cargaMaxima, cargaMedia, totalTreinos, progresso
- Relacionamento: Many-to-One com Usuario
- Métodos para cálculo de métricas

#### 2.2 - Criar Value Objects (quando justificado)

**Carga** (`domain/value-objects/carga.vo.ts`)
- Validação: valor positivo, unidade (kg/lb)
- Imutabilidade

**Email** (`domain/value-objects/email.vo.ts`)
- Validação de formato
- Normalização (lowercase, trim)

**Repeticoes** (`domain/value-objects/repeticoes.vo.ts`)
- Validação: valor positivo, range (1-100)

#### 2.3 - Criar Interfaces de Repositórios

**IUsuarioRepository** (`domain/repositories/usuario.repository.interface.ts`)
```typescript
interface IUsuarioRepository {
  criar(usuario: Usuario): Promise<Usuario>;
  buscarPorId(id: string): Promise<Usuario | null>;
  buscarPorEmail(email: string): Promise<Usuario | null>;
  atualizar(id: string, dados: Partial<Usuario>): Promise<Usuario>;
  deletar(id: string): Promise<void>;
}
```

**ITreinoRepository** (`domain/repositories/treino.repository.interface.ts`)
```typescript
interface ITreinoRepository {
  criar(treino: Treino): Promise<Treino>;
  buscarPorId(id: string): Promise<Treino | null>;
  listarPorUsuario(usuarioId: string): Promise<Treino[]>;
  atualizar(id: string, dados: Partial<Treino>): Promise<Treino>;
  deletar(id: string): Promise<void>;
  buscarPorExercicio(usuarioId: string, exercicio: string): Promise<Treino[]>;
}
```

**IAnaliseRepository** (`domain/repositories/analise.repository.interface.ts`)
```typescript
interface IAnaliseRepository {
  obterEstatisticas(usuarioId: string): Promise<any>;
  obterProgresso(usuarioId: string, exercicio: string, periodoInicio: Date, periodoFim: Date): Promise<any>;
}
```

---

### Fase 3: Camada de Aplicação (Application Layer)

**Objetivo**: Implementar casos de uso e lógica de aplicação

#### 3.1 - Casos de Uso de Autenticação

**RegistrarUsuarioUseCase** (`application/use-cases/auth/registrar-usuario.use-case.ts`)
- Input: RegistrarUsuarioDto (nome, email, senha)
- Validações: email único, senha forte
- Criptografar senha com bcrypt
- Criar usuário via repositório
- Output: Usuario criado (sem senha)

**AutenticarUsuarioUseCase** (`application/use-cases/auth/autenticar-usuario.use-case.ts`)
- Input: LoginDto (email, senha)
- Buscar usuário por email
- Validar senha
- Gerar token JWT
- Output: { token, usuario }

**ValidarTokenUseCase** (`application/use-cases/auth/validar-token.use-case.ts`)
- Input: token JWT
- Verificar validade do token
- Retornar payload decodificado

#### 3.2 - Casos de Uso de Treino

**RegistrarTreinoUseCase** (`application/use-cases/treino/registrar-treino.use-case.ts`)
- Input: CreateTreinoDto (usuarioId, exercicioNome, carga, repeticoes, series, observacoes)
- Validações de domínio (carga > 0, repeticoes > 0)
- Criar treino via repositório
- Output: Treino criado

**ListarTreinosUseCase** (`application/use-cases/treino/listar-treinos.use-case.ts`)
- Input: usuarioId, filtros opcionais (exercicio, dataInicio, dataFim)
- Buscar treinos do usuário
- Ordenar por data (mais recente primeiro)
- Output: Lista de treinos

**AtualizarTreinoUseCase** (`application/use-cases/treino/atualizar-treino.use-case.ts`)
- Input: treinoId, UpdateTreinoDto
- Verificar propriedade (treino pertence ao usuário)
- Atualizar via repositório
- Output: Treino atualizado

**DeletarTreinoUseCase** (`application/use-cases/treino/deletar-treino.use-case.ts`)
- Input: treinoId, usuarioId
- Verificar propriedade
- Deletar via repositório
- Output: void

#### 3.3 - Casos de Uso de Análise

**GerarRelatorioProgressoUseCase** (`application/use-cases/analise/gerar-relatorio-progresso.use-case.ts`)
- Input: usuarioId, exercicio, periodoInicio, periodoFim
- Buscar treinos no período
- Calcular métricas: carga máxima, média, progresso percentual
- Gerar gráfico de evolução
- Output: RelatorioProgressoDto

**ObterEstatisticasUseCase** (`application/use-cases/analise/obter-estatisticas.use-case.ts`)
- Input: usuarioId
- Agrupar treinos por exercício
- Calcular carga máxima por exercício
- Calcular total de treinos
- Output: EstatisticasDto

#### 3.4 - Criar DTOs

**DTOs de Autenticação**:
- RegistrarUsuarioDto: nome, email, senha
- LoginDto: email, senha
- TokenPayloadDto: userId, email, iat, exp

**DTOs de Treino**:
- CreateTreinoDto: exercicioNome, carga, repeticoes, series?, observacoes?, data?
- UpdateTreinoDto: Partial<CreateTreinoDto>
- TreinoResponseDto: id, exercicioNome, carga, repeticoes, series, observacoes, data, criadoEm

**DTOs de Análise**:
- RelatorioProgressoDto: exercicio, periodo, cargaMaxima, cargaMedia, progresso, pontos[]
- EstatisticasDto: totalTreinos, exercicios[], recordesPorExercicio{}

---

### Fase 4: Camada de Adaptadores (Interface Adapters Layer)

**Objetivo**: Implementar controllers e repositórios concretos

#### 4.1 - Implementar Controllers

**AuthController** (`interface-adapters/controllers/auth.controller.ts`)
```typescript
@Controller('auth')
export class AuthController {
  @Post('registrar')
  async registrar(@Body() dto: RegistrarUsuarioDto)
  
  @Post('login')
  async login(@Body() dto: LoginDto)
  
  @Get('perfil')
  @UseGuards(JwtAuthGuard)
  async perfil(@CurrentUser() usuario)
}
```

**TreinoController** (`interface-adapters/controllers/treino.controller.ts`)
```typescript
@Controller('treinos')
@UseGuards(JwtAuthGuard)
export class TreinoController {
  @Post()
  async criar(@CurrentUser() usuario, @Body() dto: CreateTreinoDto)
  
  @Get()
  async listar(@CurrentUser() usuario, @Query() filtros)
  
  @Get(':id')
  async buscar(@Param('id') id: string, @CurrentUser() usuario)
  
  @Patch(':id')
  async atualizar(@Param('id') id: string, @CurrentUser() usuario, @Body() dto: UpdateTreinoDto)
  
  @Delete(':id')
  async deletar(@Param('id') id: string, @CurrentUser() usuario)
}
```

**AnaliseController** (`interface-adapters/controllers/analise.controller.ts`)
```typescript
@Controller('analises')
@UseGuards(JwtAuthGuard)
export class AnaliseController {
  @Get('estatisticas')
  async obterEstatisticas(@CurrentUser() usuario)
  
  @Get('progresso/:exercicio')
  async gerarRelatorioProgresso(@Param('exercicio') exercicio, @CurrentUser() usuario, @Query() periodo)
}
```

#### 4.2 - Implementar Repositórios TypeORM

**TypeOrmUsuarioRepository** (`interface-adapters/repositories/typeorm-usuario.repository.ts`)
- Implementa IUsuarioRepository
- Usa TypeORM Repository
- Métodos: criar, buscarPorId, buscarPorEmail, atualizar, deletar

**TypeOrmTreinoRepository** (`interface-adapters/repositories/typeorm-treino.repository.ts`)
- Implementa ITreinoRepository
- Queries otimizadas com índices
- Métodos: criar, buscarPorId, listarPorUsuario, buscarPorExercicio, atualizar, deletar

**TypeOrmAnaliseRepository** (`interface-adapters/repositories/typeorm-analise.repository.ts`)
- Implementa IAnaliseRepository
- Queries agregadas (GROUP BY, MAX, AVG)
- Métodos: obterEstatisticas, obterProgresso

#### 4.3 - Criar Mappers

**UsuarioMapper** (`interface-adapters/mappers/usuario.mapper.ts`)
- toDto(entity: Usuario): UsuarioDto (remove senha)
- toEntity(dto: CreateUsuarioDto): Usuario

**TreinoMapper** (`interface-adapters/mappers/treino.mapper.ts`)
- toDto(entity: Treino): TreinoResponseDto
- toEntity(dto: CreateTreinoDto): Treino

---

### Fase 5: Camada de Frameworks (Frameworks Layer)

**Objetivo**: Configurar infraestrutura e módulos NestJS

#### 5.1 - Configurar Database

**TypeORM Config** (`frameworks/database/typeorm.config.ts`)
```typescript
export const typeOrmConfig: TypeOrmModuleOptions = {
  type: 'postgres',
  url: process.env.DATABASE_URL,
  entities: [Usuario, Treino, Analise],
  migrations: ['dist/frameworks/database/migrations/*.js'],
  synchronize: false, // usar migrations em produção
  logging: process.env.NODE_ENV === 'development',
}
```

**Database Module** (`frameworks/modules/database.module.ts`)
- Importa TypeOrmModule.forRoot()
- Configuração centralizada

#### 5.2 - Configurar Autenticação JWT

**JWT Strategy** (`frameworks/auth/jwt.strategy.ts`)
- Extends PassportStrategy
- Valida token
- Extrai payload
- Retorna usuário

**JWT Auth Guard** (`frameworks/auth/jwt-auth.guard.ts`)
- Extends AuthGuard('jwt')
- Protege rotas

**Roles Guard** (`frameworks/auth/roles.guard.ts`)
- Verifica roles do usuário (para expansão futura)

**Auth Module** (`frameworks/modules/auth.module.ts`)
```typescript
@Module({
  imports: [
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: process.env.JWT_EXPIRATION },
    }),
    TypeOrmModule.forFeature([Usuario]),
  ],
  providers: [JwtStrategy, EncryptionService],
  exports: [JwtModule],
})
```

#### 5.3 - Criar Módulos de Domínio

**Usuario Module** (`frameworks/modules/usuario.module.ts`)
- Controllers: AuthController
- Providers: RegistrarUsuarioUseCase, AutenticarUsuarioUseCase, TypeOrmUsuarioRepository
- Exports: repositório

**Treino Module** (`frameworks/modules/treino.module.ts`)
- Controllers: TreinoController
- Providers: RegistrarTreinoUseCase, ListarTreinosUseCase, etc., TypeOrmTreinoRepository
- Imports: AuthModule

**Analise Module** (`frameworks/modules/analise.module.ts`)
- Controllers: AnaliseController
- Providers: GerarRelatorioProgressoUseCase, ObterEstatisticasUseCase, TypeOrmAnaliseRepository
- Imports: AuthModule, TreinoModule

#### 5.4 - Criar Migrations

**Migration Inicial** (`frameworks/database/migrations/CreateUsuariosTable.ts`)
- Tabela usuarios: id (uuid), nome, email (unique), senha, criado_em, atualizado_em

**Migration Treinos** (`frameworks/database/migrations/CreateTreinosTable.ts`)
- Tabela treinos: id, usuario_id (FK), exercicio_nome, carga, repeticoes, series, observacoes, data, criado_em
- Índices: usuario_id, exercicio_nome, data

**Migration Analises** (`frameworks/database/migrations/CreateAnalisesTable.ts`)
- Tabela analises (se necessário para cache de métricas)

---

### Fase 6: Camada Compartilhada (Shared Layer)

**Objetivo**: Criar utilitários e serviços compartilhados

#### 6.1 - Serviços Utilitários

**JWT Service** (`shared/services/jwt.service.ts`)
- gerarToken(payload): string
- verificarToken(token): payload
- decodificarToken(token): payload

**Encryption Service** (`shared/services/encryption.service.ts`)
- hashSenha(senha: string): Promise<string> (bcrypt)
- compararSenha(senha: string, hash: string): Promise<boolean>

**Logger Service** (`shared/services/logger.service.ts`)
- info(mensagem, contexto)
- error(mensagem, stack, contexto)
- warn(mensagem, contexto)
- debug(mensagem, contexto)

#### 6.2 - Decorators Customizados

**CurrentUser Decorator** (`shared/decorators/current-user.decorator.ts`)
- Extrai usuário do request
- Usado em controllers: @CurrentUser() usuario

**Roles Decorator** (`shared/decorators/roles.decorator.ts`)
- Define roles necessárias: @Roles('admin', 'user')

#### 6.3 - Exception Filters

**HTTP Exception Filter** (`shared/filters/http-exception.filter.ts`)
- Formata erros HTTP de forma consistente
- Logs de erros
- Response padrão: { statusCode, timestamp, path, message }

#### 6.4 - Interceptors

**Logging Interceptor** (`shared/interceptors/logging.interceptor.ts`)
- Loga requisições (método, path, tempo de resposta)
- Útil para monitoramento

#### 6.5 - Validadores Customizados

**IsStrongPassword Validator** (`shared/validators/is-strong-password.validator.ts`)
- Valida senha forte (min 8 chars, maiúscula, minúscula, número, especial)
- Usado em DTOs com class-validator

---

### Fase 7: Configuração Global e Main

**Objetivo**: Configurar aplicação NestJS com Fastify

#### 7.1 - Atualizar main.ts

```typescript
import { NestFactory } from '@nestjs/core';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './shared/filters/http-exception.filter';
import { LoggingInterceptor } from './shared/interceptors/logging.interceptor';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
  );

  // Validação global com class-validator
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true, // remove propriedades não decoradas
    forbidNonWhitelisted: true, // lança erro se houver propriedades extras
    transform: true, // transforma payloads em DTOs
  }));

  // Exception filter global
  app.useGlobalFilters(new HttpExceptionFilter());

  // Interceptor de logging
  app.useGlobalInterceptors(new LoggingInterceptor());

  // CORS
  app.enableCors({
    origin: process.env.CORS_ORIGIN || '*',
    credentials: true,
  });

  // Prefixo global
  app.setGlobalPrefix('api/v1');

  const port = process.env.PORT || 3000;
  await app.listen(port, '0.0.0.0');

  console.log(`🚀 CargaLog API rodando em: ${await app.getUrl()}`);
}
bootstrap();
```

#### 7.2 - Atualizar app.module.ts

```typescript
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './frameworks/modules/database.module';
import { AuthModule } from './frameworks/modules/auth.module';
import { UsuarioModule } from './frameworks/modules/usuario.module';
import { TreinoModule } from './frameworks/modules/treino.module';
import { AnaliseModule } from './frameworks/modules/analise.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    DatabaseModule,
    AuthModule,
    UsuarioModule,
    TreinoModule,
    AnaliseModule,
  ],
})
export class AppModule {}
```

---

### Fase 8: Testes

**Objetivo**: Criar testes unitários e E2E

#### 8.1 - Testes Unitários

**Testes de Entidades** (`domain/entities/*.spec.ts`)
- Validações de domínio
- Métodos de negócio

**Testes de Casos de Uso** (`application/use-cases/**/*.spec.ts`)
- Caminho feliz
- Casos de borda
- Validações
- Mocks de repositórios

**Testes de Controllers** (`interface-adapters/controllers/*.spec.ts`)
- Mocks de casos de uso
- Validação de DTOs
- Respostas HTTP

**Testes de Repositórios** (`interface-adapters/repositories/*.spec.ts`)
- Operações CRUD
- Queries customizadas
- Usar banco em memória ou mocks

#### 8.2 - Testes E2E

**Auth E2E** (`test/auth.e2e-spec.ts`)
- POST /auth/registrar
- POST /auth/login
- GET /auth/perfil (com token)

**Treino E2E** (`test/treino.e2e-spec.ts`)
- POST /treinos (criar)
- GET /treinos (listar)
- PATCH /treinos/:id (atualizar)
- DELETE /treinos/:id (deletar)

**Analise E2E** (`test/analise.e2e-spec.ts`)
- GET /analises/estatisticas
- GET /analises/progresso/:exercicio

---

## Boas Práticas e Convenções

### Nomenclatura

**Arquivos**:
- Entidades: `*.entity.ts`
- DTOs: `*.dto.ts`
- Interfaces: `*.interface.ts`
- Use Cases: `*.use-case.ts`
- Repositórios: `*.repository.ts`
- Controllers: `*.controller.ts`
- Módulos: `*.module.ts`
- Testes: `*.spec.ts` (unitários), `*.e2e-spec.ts` (E2E)

**Código**:
- Classes: PascalCase
- Funções/métodos: camelCase
- Variáveis: camelCase
- Constantes: UPPER_SNAKE_CASE
- Interfaces: prefixo `I` (ex: IUsuarioRepository)

### Commits

Seguir **Conventional Commits**:
- `feat(treino): add create treino use case`
- `fix(auth): prevent null token validation`
- `refactor(domain): extract carga value object`
- `test(treino): add unit tests for registrar treino`
- `docs(readme): update installation instructions`

### Documentação

- Comentários JSDoc para classes e métodos públicos
- README com instruções de setup
- Documentação de API (Swagger/OpenAPI - futura expansão)

### Segurança

- Nunca commitar `.env`
- Sempre validar inputs com class-validator
- Sanitizar outputs quando necessário
- Hash de senhas com bcrypt (salt rounds: 10)
- Tokens JWT com expiração
- Proteção contra SQL Injection (TypeORM cuida disso)
- Rate limiting (futura expansão)

---

## Dependências a Instalar

### Produção

```json
{
  "@nestjs/common": "^11.0.1",
  "@nestjs/core": "^11.0.1",
  "@nestjs/config": "^3.2.0",
  "@nestjs/typeorm": "^10.0.1",
  "@nestjs/jwt": "^10.2.0",
  "@nestjs/passport": "^10.0.3",
  "@nestjs/platform-fastify": "^11.0.1",
  "typeorm": "^0.3.20",
  "pg": "^8.11.3",
  "passport": "^0.7.0",
  "passport-jwt": "^4.0.1",
  "bcrypt": "^5.1.1",
  "class-validator": "^0.14.1",
  "class-transformer": "^0.5.1",
  "reflect-metadata": "^0.2.2",
  "rxjs": "^7.8.1"
}
```

### Desenvolvimento

```json
{
  "@types/bcrypt": "^5.0.2",
  "@types/passport-jwt": "^4.0.1",
  "@nestjs/testing": "^11.0.1",
  "@types/jest": "^30.0.0",
  "@types/node": "^22.10.7",
  "@types/supertest": "^6.0.2",
  "jest": "^30.0.0",
  "supertest": "^7.0.0",
  "ts-jest": "^29.2.5"
}
```

---

## Scripts package.json

```json
{
  "scripts": {
    "build": "nest build",
    "start": "nest start",
    "start:dev": "nest start --watch",
    "start:debug": "nest start --debug --watch",
    "start:prod": "node dist/main",
    "migration:generate": "typeorm migration:generate -d src/frameworks/database/typeorm.config.ts",
    "migration:run": "typeorm migration:run -d src/frameworks/database/typeorm.config.ts",
    "migration:revert": "typeorm migration:revert -d src/frameworks/database/typeorm.config.ts",
    "test": "jest",
    "test:watch": "jest --watch",
    "test:cov": "jest --coverage",
    "test:e2e": "jest --config ./test/jest-e2e.json",
    "lint": "eslint \"{src,apps,libs,test}/**/*.ts\" --fix",
    "format": "prettier --write \"src/**/*.ts\" \"test/**/*.ts\""
  }
}
```

---

## Configuração de Ambiente (.env)

```env
# Aplicação
NODE_ENV=development
PORT=3000
CORS_ORIGIN=*

# Banco de Dados
DATABASE_URL=postgresql://postgres.xxx:senha@aws-1-sa-east-1.pooler.supabase.com:6543/postgres?pgbouncer=true
DIRECT_URL=postgresql://postgres.xxx:senha@aws-1-sa-east-1.pooler.supabase.com:5432/postgres

# JWT
JWT_SECRET=seu_segredo_super_seguro_aqui_min_32_chars
JWT_EXPIRATION=7d

# Bcrypt
BCRYPT_SALT_ROUNDS=10

# Logs
LOG_LEVEL=debug
```

---

## Checklist de Implementação

### Fase 1: Configuração ✓
- [ ] Instalar dependências
- [ ] Configurar .env
- [ ] Configurar TypeORM
- [ ] Criar migrations iniciais

### Fase 2: Domain Layer ✓
- [ ] Criar entidade Usuario
- [ ] Criar entidade Treino
- [ ] Criar entidade Analise
- [ ] Criar value objects (Email, Carga, Repeticoes)
- [ ] Criar interfaces de repositórios

### Fase 3: Application Layer ✓
- [ ] Criar DTOs de autenticação
- [ ] Criar DTOs de treino
- [ ] Criar DTOs de análise
- [ ] Implementar RegistrarUsuarioUseCase
- [ ] Implementar AutenticarUsuarioUseCase
- [ ] Implementar RegistrarTreinoUseCase
- [ ] Implementar ListarTreinosUseCase
- [ ] Implementar AtualizarTreinoUseCase
- [ ] Implementar DeletarTreinoUseCase
- [ ] Implementar GerarRelatorioProgressoUseCase
- [ ] Implementar ObterEstatisticasUseCase

### Fase 4: Interface Adapters ✓
- [ ] Implementar AuthController
- [ ] Implementar TreinoController
- [ ] Implementar AnaliseController
- [ ] Implementar TypeOrmUsuarioRepository
- [ ] Implementar TypeOrmTreinoRepository
- [ ] Implementar TypeOrmAnaliseRepository
- [ ] Criar mappers

### Fase 5: Frameworks ✓
- [ ] Configurar DatabaseModule
- [ ] Configurar AuthModule com JWT
- [ ] Criar JwtStrategy
- [ ] Criar JwtAuthGuard
- [ ] Criar UsuarioModule
- [ ] Criar TreinoModule
- [ ] Criar AnaliseModule

### Fase 6: Shared ✓
- [ ] Implementar JwtService
- [ ] Implementar EncryptionService
- [ ] Implementar LoggerService
- [ ] Criar CurrentUser decorator
- [ ] Criar HttpExceptionFilter
- [ ] Criar LoggingInterceptor
- [ ] Criar validadores customizados

### Fase 7: Configuração Global ✓
- [ ] Atualizar main.ts com Fastify
- [ ] Configurar ValidationPipe global
- [ ] Configurar Exception Filter global
- [ ] Atualizar AppModule

### Fase 8: Testes ✓
- [ ] Testes unitários de entidades
- [ ] Testes unitários de casos de uso
- [ ] Testes unitários de controllers
- [ ] Testes E2E de autenticação
- [ ] Testes E2E de treinos
- [ ] Testes E2E de análises

---

## Próximos Passos (Expansões Futuras)

1. **Swagger/OpenAPI**: Documentação automática da API
2. **Rate Limiting**: Proteção contra abuso
3. **Caching**: Redis para cache de análises
4. **WebSockets**: Notificações em tempo real
5. **GraphQL**: Alternativa REST
6. **Docker**: Containerização completa
7. **CI/CD**: Pipeline automático
8. **Monitoramento**: Logs estruturados, APM
9. **Testes de Carga**: k6 ou Artillery
10. **Multi-tenancy**: Suporte a múltiplos clientes

---

## Referências

- [Clean Architecture - Uncle Bob](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html)
- [Domain-Driven Design - Eric Evans](https://www.domainlanguage.com/ddd/)
- [SOLID Principles](https://www.digitalocean.com/community/conceptual-articles/s-o-l-i-d-the-first-five-principles-of-object-oriented-design)
- [NestJS Documentation](https://docs.nestjs.com/)
- [TypeORM Documentation](https://typeorm.io/)
- [Conventional Commits](https://www.conventionalcommits.org/)

---

**Observações Importantes**:

1. **DDD/SOLID aplicado onde o domínio justificar**: Não adicionar complexidade desnecessária em lógicas simples
2. **Migrations sempre em produção**: Nunca usar `synchronize: true` em prod
3. **Testes são obrigatórios**: Caminho feliz + bordas para novas lógicas
4. **Commits atômicos**: Um commit por funcionalidade/fix
5. **Nunca commitar .env**: Usar .env.example como template
6. **Validação em todas as entradas**: class-validator em todos os DTOs
7. **Hash de senhas sempre**: bcrypt com salt rounds >= 10
8. **JWT com expiração**: Tokens devem ter tempo de vida limitado
9. **Logs estruturados**: Usar Logger para facilitar debug
10. **Código em inglês**: Identificadores, classes, funções, variáveis

---

## Conclusão

Este plano fornece uma estrutura completa e escalável para o backend do CargaLog, seguindo as melhores práticas de Clean Architecture, DDD e SOLID. A implementação em fases permite desenvolvimento incremental e testável, garantindo qualidade e manutenibilidade a longo prazo.

