# 🚀 Guia Rápido: Migrations TypeORM

## ✅ Configuração Completa

- [x] `ormconfig.ts` configurado na raiz
- [x] `typeorm.config.ts` atualizado com migrations path
- [x] Scripts adicionados no `package.json`
- [x] Diretório `src/frameworks/database/migrations/` criado

---

## 📝 Comandos Principais

### 1️⃣ Ver Status das Migrations
```bash
npm run migration:show
```
Mostra quais migrations foram executadas e quais estão pendentes.

---

### 2️⃣ Gerar Migration Automática
```bash
npm run migration:generate -- src/frameworks/database/migrations/InitialSchema
```
**Quando usar:** Após criar ou modificar entities (Usuario, Treino, Analise).

**O que faz:**
- Compara entities com o banco de dados
- Gera arquivo com SQL para criar/alterar tabelas
- Detecta mudanças automaticamente

**Exemplo prático:**
```bash
# Você modificou a entity Usuario adicionando campo "telefone"
npm run migration:generate -- src/frameworks/database/migrations/AddTelefoneToUsuario
```

---

### 3️⃣ Criar Migration Manual
```bash
npm run migration:create -- src/frameworks/database/migrations/AddCustomIndex
```
**Quando usar:** Para mudanças customizadas (índices, triggers, procedures).

**O que faz:**
- Cria arquivo vazio
- Você escreve SQL manualmente

---

### 4️⃣ Executar Migrations
```bash
npm run migration:run
```
**Quando usar:**
- Antes de iniciar a aplicação em produção
- Após gerar/criar nova migration
- No CI/CD antes do deploy

**O que faz:**
- Executa todas as migrations pendentes na ordem
- Registra na tabela `migrations`

---

### 5️⃣ Reverter Migration
```bash
npm run migration:revert
```
**Quando usar:**
- Após erro em migration
- Para desfazer última mudança

**O que faz:**
- Executa método `down()` da última migration
- Remove registro da tabela `migrations`

---

## 🔄 Workflow Completo

### Cenário 1: Adicionar Nova Coluna

```bash
# 1. Modificar entity
# Exemplo: Adicionar campo "avatar" em Usuario.entity.ts

# 2. Gerar migration
npm run migration:generate -- src/frameworks/database/migrations/AddAvatarToUsuario

# 3. Revisar arquivo gerado em src/frameworks/database/migrations/

# 4. Testar migration
npm run migration:run

# 5. Se algo der errado, reverter
npm run migration:revert

# 6. Commit quando estiver OK
git add src/frameworks/database/migrations/
git commit -m "feat(database): add avatar column to usuario"
```

---

### Cenário 2: Criar Tabela Nova

```bash
# 1. Criar entity (ex: Exercicio.entity.ts)

# 2. Gerar migration
npm run migration:generate -- src/frameworks/database/migrations/CreateExercicioTable

# 3. Executar
npm run migration:run
```

---

### Cenário 3: Deploy em Produção

```bash
# No servidor (após pull do código)
npm run migration:run
npm run start:prod
```

---

## ⚠️ Boas Práticas

### ✅ FAZER
- Sempre revisar migrations geradas automaticamente
- Testar migration em dev antes de produção
- Implementar método `down()` para rollback
- Commitar migrations junto com mudanças de entities
- Fazer backup do banco antes de rodar em produção

### ❌ NÃO FAZER
- Editar migrations já executadas em produção
- Usar `synchronize: true` em produção
- Executar migrations diretamente no banco
- Deletar arquivos de migration
- Pular migrations

---

## 🐛 Troubleshooting

### Erro: "No changes in database schema were found"
**Solução:** Suas entities já estão sincronizadas com o banco. Sem mudanças para migrar.

### Erro: "QueryFailedError"
**Solução:** 
1. Revise o SQL gerado
2. Verifique se a coluna/tabela já existe
3. Execute `npm run migration:revert`
4. Corrija e tente novamente

### Erro: "Cannot find module 'ormconfig.ts'"
**Solução:** Execute comandos a partir da pasta `backend/`.

---

## 📊 Exemplo de Migration Gerada

```typescript
import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddAvatarToUsuario1708113600000 implements MigrationInterface {
  name = 'AddAvatarToUsuario1708113600000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "usuario" 
      ADD "avatar" character varying
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "usuario" 
      DROP COLUMN "avatar"
    `);
  }
}
```

---

## 🎯 Próximos Passos

1. **Primeira Migration:**
   ```bash
   npm run migration:generate -- src/frameworks/database/migrations/InitialSchema
   ```

2. **Ver Status:**
   ```bash
   npm run migration:show
   ```

3. **Executar:**
   ```bash
   npm run migration:run
   ```

---

**Dúvidas?** Consulte: `src/frameworks/database/migrations/README.md`

**Última atualização:** 2026-02-17

