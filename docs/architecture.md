# Arquitetura e Código

## Stack atual

- **Framework Web:** Next.js 16.4.3 (App Router com React 19).
- **Linguagem:** TypeScript 5.
- **Estilização:** Tailwind CSS v4 via PostCSS (`@tailwindcss/postcss`).
- **Persistência Relacional:** Drizzle ORM (`^0.45.4`) com driver `pg` (`^8.23.1`).
- **Validação:** Zod (`^4.6.7`).
- **Logs Estruturados:** Pino (`^10.4.0`) com isolamento de servidor (`server-only`).
- **Testes:** Vitest (`^3.2.7`).
- **Runtime e Ferramental:** Node.js v20.20.2 e npm 10.8.2.

## Mapa de código

```text
plantio/
├── AGENTS.md                  # Instruções compartilhadas para agentes de IA
├── CLAUDE.md                  # Ponte para Claude Code (@AGENTS.md)
├── PRODUCT.md                 # Visão de produto, requisitos agronômicos e MVP
├── README.md                  # Ponto de entrada, execução e navegação
├── PLANO.md                   # Plano funcional e de regras de negócio original
├── docs/                      # Documentação técnica e evidências
│   ├── architecture.md        # Estrutura atual e decisões de arquitetura
│   ├── design.md              # Diretrizes de UI/UX, mobile-first e acessibilidade
│   ├── onboarding.md          # Guia de configuração do ambiente local
│   ├── quality.md             # Regras de qualidade, linting e testes
│   └── setup.md               # Evidências do bootstrap e estado de ferramentas
├── eslint-rules/              # Regras personalizadas de arquitetura
│   ├── core-rules.cjs         # Validação de linhas máximas e console
│   ├── index.cjs              # Exportação de regras ESLint
│   ├── next-base.mjs          # Configuração base de qualidade
│   └── utils.cjs              # Utilitários de AST
├── scripts/
│   └── verify-quality-rules.mjs # Validador das regras customizadas
├── src/
│   ├── app/                   # App Router do Next.js
│   │   ├── globals.css        # Import do Tailwind CSS v4
│   │   ├── layout.tsx         # Layout raiz mobile-first
│   │   └── page.tsx           # Página inicial do Plantio Fácil
│   ├── db/                    # Camada de banco de dados
│   │   ├── index.ts           # Conexão Drizzle lazy com pool limitado
│   │   ├── index.test.ts      # Testes do ciclo de vida da conexão
│   │   └── schema/
│   │       ├── index.ts       # Exportação central de tabelas Drizzle
│   │       └── plantios.ts    # Tabelas relacionais (usuarios, locais, plantios, tarefas, diario)
│   └── lib/                   # Utilitários de domínio e infraestrutura
│       ├── assistant/         # Motor de IA (Gemma 4 via Ollama + fallback Embrapa)
│       │   ├── engine.ts      # Integração Ollama e regras agronômicas
│       │   └── types.ts       # Schemas Zod de entrada e resposta
│       ├── calculator/        # Calculadora de mudas, terra e economia
│       │   ├── engine.ts      # Regras de espaçamento e volumetria
│       │   └── engine.test.ts # Testes unitários de cálculo
│       ├── diagnostic/        # Diagnóstico visual foliar e pragas
│       │   ├── engine.ts      # Mapeamento de sintomas para soluções caseiras
│       │   ├── engine.test.ts # Testes de diagnóstico foliar
│       │   └── types.ts       # Schemas de sintomas e resultados
│       ├── env.ts             # Leitor tipado de variáveis de ambiente
│       ├── env.test.ts        # Testes de integridade de ambiente
│       ├── env-schema.ts      # Definição dos schemas Zod de variáveis
│       ├── logger.ts          # Instância do logger Pino com sanitização
│       ├── logger.test.ts     # Testes de redação de dados sensíveis
│       └── utils.ts           # Utilitário de classes CSS (clsx + twMerge)
├── .agents/skills/            # Skills Vercel locais
├── .claude/skills/            # Links relativos para o Claude Code
├── drizzle.config.ts          # Configuração do Drizzle Kit
├── eslint.config.mjs          # ESLint principal
├── eslint.typed.config.mjs    # ESLint tipado com typescript-eslint
├── postcss.config.mjs         # Configuração de PostCSS para Tailwind v4
└── vitest.config.mts          # Configuração de testes unitários com Vitest
```

## Fronteiras e fluxo de dados

1. **Fronteira Cliente-Servidor:** Componentes com `'use client'` lidam exclusivamente com interação de interface, captura de eventos e apresentação. Toda operação de acesso a banco ou dados externos ocorre via Server Components, Server Actions ou Route Handlers.
2. **Isolamento de Credenciais:** `server-only` garante que módulos sensíveis (`src/db/index.ts`, `src/lib/logger.ts`) nunca sejam incluídos no bundle cliente.
3. **Validação na Borda:** Nenhuma entrada externa (formulários, parâmetros de URL ou respostas de APIs de terceiros como Open-Meteo) é consumida sem validação explícita via Zod.
4. **Logs Sanitizados:** Logs no servidor utilizam o Pino configurado em `src/lib/logger.ts`, com máscara automática para chaves sensíveis (`authorization`, `cookie`, `database_url`, `token`, `password`).

## Dados e persistência

- **Drizzle ORM:** Centraliza a definição de tabelas e tipos derivados via `$inferSelect` e `$inferInsert`.
- **Conexão Lazy:** A função `getDb()` só cria a pool do PostgreSQL quando invocada em tempo de execução, garantindo que o build de produção e os testes unitários rodem em ambientes isolados sem exigir credenciais ativas.
- **Migrações:** O ciclo de vida de schema segue:
  1. Alteração do schema em `src/db/schema/`.
  2. Geração da migration versionada via `npm run db:generate`.
  3. Revisão do SQL gerado em `drizzle/`.
  4. Aplicação controlada via `npm run db:migrate`.

## Decisões técnicas

| Decisão | Motivo | Alternativa considerada | Status |
|---|---|---|---|
| **Next.js 16 App Router** | Suporte nativo a Server Components, PWA, renderização otimizada e alinhamento com o padrão do Vibe Coding Toolkit. | Vite SPA (mencionada no PLANO.md) | Adotada com concordância do usuário para stack completa |
| **Tailwind CSS v4 + PostCSS** | Tailwind v4 com `@tailwindcss/postcss` oferece compilação rápida, compatibilidade nativa com Next.js 16 e estabilidade em todos os ambientes. | Turbopack webpack loader | Adotada para garantir builds estáveis |
| **Fonte do sistema nativa** | Elimina requisições externas para Google Fonts em tempo de build e garante compatibilidade offline total para PWA em dispositivos móveis. | `next/font/google` (Geist) | Adotada |
| **Drizzle ORM** | Tipagem estrita ponta a ponta sem overhead de query engine pesada, SQL previsível e portabilidade. | Prisma / Supabase SDK direto | Adotada |
| **Assistente Híbrido (Gemma + Fallback)** | Consulta local ao Ollama com timeout de 2.5s e chaveamento automático para base agronômica Embrapa sem quebrar a experiência do usuário. | Chamada bloqueante a API externa de IA paga | Adotada |
| **Diagnóstico Foliar e Calculadora de Mudas** | Módulos puros em TypeScript com regras determinísticas Embrapa para cálculo de espaçamento, terra e receitas caseiras sem pesticidas. | Dependência de visão computacional em nuvem | Adotada |
| **Onboarding Wizard Interativo** | Fluxo guiado em 3 passos salvando preferências no localStorage e permitindo reabertura a qualquer momento via botão "Meu Espaço". | Formulário único estático | Adotada |
