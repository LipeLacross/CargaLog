# Arquitetura Monolítica Modular - LacrossTech Plus

## 📁 Estrutura do Projeto

Este projeto segue uma **arquitetura monolítica modular**, onde o código está organizado em módulos independentes e reutilizáveis, mantendo a simplicidade de um monolito, mas com a organização e separação de responsabilidades de uma arquitetura modular.

```
LacrossTech-plus/
├── public/                    # Arquivos estáticos
│   ├── favicon/              # Favicons e manifestos
│   └── images/               # Imagens (PNG, JPG, SVG)
│
├── src/
│   ├── app/                  # Configuração e estrutura Next.js
│   │   ├── api/             # API routes (Next.js)
│   │   │   ├── brevo-newsletter/
│   │   │   ├── chat/
│   │   │   ├── r/
│   │   │   ├── short/
│   │   │   └── _shortener/
│   │   │
│   │   ├── components/      # Componentes reutilizáveis
│   │   │   ├── base/        # Componentes base (Botões, Overlays, etc.)
│   │   │   ├── layout/      # Layouts de páginas (futuro)
│   │   │   └── sections/    # Seções comuns (Header, Footer)
│   │   │
│   │   ├── pages/           # Páginas estáticas (cookies, privacidade, termos)
│   │   ├── styles/          # Estilos SASS/CSS globais
│   │   ├── layout.tsx       # Layout raiz
│   │   ├── page.tsx         # Página principal
│   │   └── globals.css      # Estilos globais
│   │
│   ├── modules/             # Módulos de funcionalidades
│   │   ├── about/           # Módulo "Sobre"
│   │   │   ├── About.tsx
│   │   │   └── index.ts
│   │   │
│   │   ├── businessPartner/ # Módulo "Parceiros de Negócios"
│   │   │   ├── BusinessPartner.tsx
│   │   │   └── index.ts
│   │   │
│   │   ├── chat/            # Módulo ChatBot
│   │   │   ├── ChatBot.tsx
│   │   │   └── index.ts
│   │   │
│   │   ├── contactForm/     # Módulo Formulário de Contato
│   │   │   ├── ContactForm.tsx
│   │   │   └── index.ts
│   │   │
│   │   ├── differentials/   # Módulo Diferenciais
│   │   │   ├── Differentials.tsx
│   │   │   └── index.ts
│   │   │
│   │   ├── faq/             # Módulo FAQ
│   │   │   ├── FAQ.tsx
│   │   │   └── index.ts
│   │   │
│   │   ├── home/            # Módulo Home
│   │   │   ├── Home.tsx
│   │   │   └── index.ts
│   │   │
│   │   ├── paymentsContracts/ # Módulo Pagamentos e Contratos
│   │   │   ├── PaymentsContracts.tsx
│   │   │   └── index.ts
│   │   │
│   │   ├── portfolio/       # Módulo Portfólio
│   │   │   ├── Portfolio.tsx
│   │   │   └── index.ts
│   │   │
│   │   ├── services/        # Módulo Serviços
│   │   │   ├── Services.tsx
│   │   │   └── index.ts
│   │   │
│   │   └── testimonials/    # Módulo Depoimentos
│   │       ├── Testimonials.tsx
│   │       └── index.ts
│   │
│   ├── hooks/               # Custom React hooks
│   ├── types/               # Tipagens TypeScript globais
│   └── utils/               # Funções auxiliares e helpers
│
├── backup/                  # Backup de arquivos antigos
├── next.config.ts           # Configuração Next.js
├── tsconfig.json            # Configuração TypeScript
├── package.json             # Dependências do projeto
└── README.md                # Documentação principal

```

## 🎯 Princípios da Arquitetura

### 1. **Modularização**
Cada funcionalidade está encapsulada em seu próprio módulo com:
- Componente principal
- Arquivo `index.ts` para exports limpos
- Lógica de negócio isolada

### 2. **Separação de Responsabilidades**
- **`/modules`**: Funcionalidades específicas do negócio
- **`/components/base`**: Componentes reutilizáveis genéricos
- **`/components/sections`**: Seções estruturais (Header, Footer)
- **`/utils`**: Funções auxiliares compartilhadas
- **`/hooks`**: Lógica reutilizável com React Hooks
- **`/types`**: Tipagens TypeScript compartilhadas

### 3. **Importações Limpas**
Exemplo de importação modular:
```typescript
// ❌ Antes
import ChatBot from "./components/base/ChatBot";
import ContactForm from "@/app/components/landing/ContactForm";

// ✅ Agora
import { ChatBot } from "@/modules/chat";
import { ContactForm } from "@/modules/contactForm";
import { Header, Footer } from "./components/sections";
```

## 🔄 Migrações Realizadas

### Componentes movidos para módulos:
- `About.tsx` → `/modules/about/`
- `BusinessPartner.tsx` → `/modules/businessPartner/`
- `ChatBot.tsx` → `/modules/chat/`
- `ContactForm.tsx` → `/modules/contactForm/`
- `Differentials.tsx` → `/modules/differentials/`
- `FAQ.tsx` → `/modules/faq/`
- `Home.tsx` → `/modules/home/`
- `PaymentsContracts.tsx` → `/modules/paymentsContracts/`
- `Portfolio.tsx` → `/modules/portfolio/`
- `Services.tsx` → `/modules/services/`
- `Testimonials.tsx` → `/modules/testimonials/`

### Componentes organizados em sections:
- `Header.tsx` → `/components/sections/`
- `Footer.tsx` → `/components/sections/`

### Imagens reorganizadas:
- Todas as imagens movidas para `/public/images/`

## 📝 Convenções

### Nomenclatura
- **Módulos**: camelCase (ex: `contactForm`, `businessPartner`)
- **Componentes**: PascalCase (ex: `ContactForm.tsx`, `ChatBot.tsx`)
- **Arquivos de exports**: `index.ts` em cada módulo

### Estrutura de Módulo
Cada módulo segue o padrão:
```
moduleName/
├── ComponentName.tsx    # Componente principal
├── index.ts            # Export do componente
└── [opcionais]
    ├── hooks/          # Hooks específicos do módulo
    ├── types.ts        # Tipagens específicas
    └── utils.ts        # Utilitários do módulo
```

## 🚀 Próximos Passos

### Sugestões de Melhoria:
1. **Criar hooks customizados** em `/src/hooks/` para lógica reutilizável
2. **Adicionar tipagens compartilhadas** em `/src/types/`
3. **Extrair utilitários comuns** para `/src/utils/`
4. **Implementar testes unitários** para cada módulo
5. **Adicionar Storybook** para documentar componentes
6. **Criar módulo de validação** para formulários

### Boas Práticas:
- ✅ Mantenha módulos pequenos e focados (SRP - Single Responsibility Principle)
- ✅ Use `index.ts` para controlar exports públicos
- ✅ Evite dependências circulares entre módulos
- ✅ Documente componentes complexos com comentários
- ✅ Siga as diretrizes do `global-copilot-instructions`

## 🛠️ Manutenção

### Adicionando um novo módulo:
1. Criar diretório em `/src/modules/nomeDoModulo/`
2. Criar componente principal `ComponentePrincipal.tsx`
3. Criar `index.ts` com export:
   ```typescript
   export { default as ComponentePrincipal } from './ComponentePrincipal';
   ```
4. Importar onde necessário:
   ```typescript
   import { ComponentePrincipal } from '@/modules/nomeDoModulo';
   ```

### Refatoração Contínua:
- Revise regularmente a estrutura
- Identifique código duplicado para extrair em utils
- Mantenha componentes com menos de 200-300 linhas
- Aplique princípios SOLID e Clean Code

---

**Última atualização**: 19 de fevereiro de 2026
**Versão da arquitetura**: 1.0.0

