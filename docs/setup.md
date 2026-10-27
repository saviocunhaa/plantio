# Setup e Evidências do Toolkit

## Origem e contexto

- **Data de execução:** 23 de Outubro de 2026.
- **Revisão do Vibe Coding Toolkit:** Commit `790a895304e0c08b70a5b215c9d334f1c86b816c` (18 de Outubro de 2026).
- **Repositório de origem:** [soumatheusgomes/vibe-coding-toolkit](https://github.com/soumatheusgomes/vibe-coding-toolkit).
- **Produto:** Plantio Fácil (baseado em [PRODUCT.md](../PRODUCT.md) e [PLANO.md](../PLANO.md)).
- **Ambiente de execução:** macOS Darwin 27.0.0, Node.js `v20.20.2`, npm `10.8.2`, Git `2.54.0`.

## Decisões adotadas e fontes

1. **Bootstrap com Next.js 16 App Router:** Selecionado como padrão estável do toolkit, unificando frontend mobile-first, APIs backend e suporte a PWA.
2. **Drizzle ORM + PostgreSQL (`pg`):** Adotado como core de persistência relacional do toolkit, com inicialização de pool tardia (*lazy*) para permitir builds sem banco configurado.
3. **Tailwind CSS v4 com PostCSS:** Configurado via `@tailwindcss/postcss` com `postcss.config.mjs` para garantir compilação sem falhas de subprocesso IPC no ambiente macOS.
4. **Fontes de Sistema Nativas:** Substituição de `next/font/google` por fontes do sistema (`sans-serif`, `system-ui`) em `src/app/layout.tsx`, permitindo funcionamento offline robusto e builds independentes de conexões externas.
5. **Skills Vercel Locais:** Instaladas em `.agents/skills/` com links relativos correspondentes em `.claude/skills/` e versionadas com `skills-lock.json`.

## Componentes do catálogo

| Componente | Ação e motivo | Escopo | Estado e evidência |
|---|---|---|---|
| **Next.js 16.4.3** | Framework principal da aplicação; App Router e TypeScript. | Projeto | Validado (`npm run build` gerou páginas estáticas com sucesso em 841ms). |
| **Drizzle ORM + Drizzle Kit** | Persistência e controle de migrations SQL. | Projeto | Configurado e testado (`npm run db:generate` validou schema sem erros; 3 testes passando em `src/db/index.test.ts`). |
| **Vitest** | Suíte de testes unitários em Node.js. | Projeto | Validado (8 testes passando em 3 arquivos: `env.test.ts`, `logger.test.ts`, `db/index.test.ts`). |
| **ESLint + Regras Customizadas** | Portões de qualidade (350 linhas max, sem console direto, fronteira de dados). | Projeto | Validado (`npm run lint:rules` e `npm run lint` passando com 0 erros). |
| **ESLint Tipado (`eslint.typed.config.mjs`)** | Verificação estrita de promises e funções assíncronas. | Projeto | Validado (`npm run lint:typed` passando com 0 erros). |
| **Pino Logger** | Logs estruturados com redação de segredos no servidor. | Projeto | Validado (`src/lib/logger.test.ts` confirma mascaramento de tokens e credenciais). |
| **Zod** | Validação em tempo de execução de variáveis de ambiente e dados. | Projeto | Validado (`src/lib/env.test.ts` confirma rejeição de strings inválidas). |
| **Skills Vercel (`agent-skills`)** | Melhores práticas React, composição, design web e documentação. | Projeto / `.agents/skills` | Instalado localmente com 9 skills catalogadas e espelhadas em `.claude/skills/`. |
| **Context7 / RTK / Graphify** | Ferramental de contexto e análise semântica. | Máquina / Projeto | `.graphifyignore` copiado e configurado no projeto para exclusões seguras. |

## Documentação gerada no bootstrap

Todos os 9 arquivos do manifesto oficial do toolkit foram preenchidos com dados reais do Plantio Fácil:

1. `PRODUCT.md`: Requisitos, público, fluxos do MVP, critérios de aceitação e premissas.
2. `README.md`: Ponto de entrada, comandos canônicos e guia de execução.
3. `AGENTS.md`: Instruções compartilhadas de agentes, regras Next.js preservadas e acordos de trabalho.
4. `CLAUDE.md`: Ponte de uma linha (`@AGENTS.md`) para o cliente Claude Code.
5. `docs/architecture.md`: Estrutura do código, fluxo de dados e decisões técnicas implementadas.
6. `docs/design.md`: Diretrizes visuais mobile-first, acessibilidade WCAG e tamanhos mínimos de toque.
7. `docs/onboarding.md`: Instruções de primeiro setup local e soluções para incidentes conhecidos.
8. `docs/quality.md`: Detalhamento dos portões de qualidade, testes e regras de arquitetura.
9. `docs/setup.md`: Este documento com as evidências datadas e histórico de validação.

## Evidências de execução dos checks

| Item | Estado | Evidência observada |
|---|---|---|
| `npm run lint` | Validado | Executou `eslint .` com 0 erros e 0 avisos em todos os componentes e páginas. |
| `npm run typecheck` | Validado | `next typegen && tsc --noEmit` completou com sucesso; rotas estáticas e dinâmicas tipadas. |
| `npm run lint:typed` | Validado | `eslint --config eslint.typed.config.mjs .` executou com 0 erros em promises assíncronas. |
| `npm run lint:rules` | Validado | `verify-quality-rules.mjs` confirmou: `max-lines: ok`, `no-direct-console: ok`, `no-direct-data-access: ok`. |
| `npm test` | Validado | 10 arquivos de teste e 34 testes aprovados no Vitest (recomendação, clima, plantios, calculadora, diagnóstico, assistente, rotas de API, env, logger e db). |
| `npm run build` | Validado | Next.js 16 compilou com sucesso todas as rotas (`/api/assistente`, `/api/clima`, `/api/recomendar`, `/cultura/[id]`, `/`, `/manifest.webmanifest`). |
| `npm run db:generate` | Validado | Drizzle Kit validou a integridade de schema sem pendências. |
| `npm run check` | Validado | Pipeline completa encadeada executou e finalizou com código de saída 0. |

## Funcionalidades do MVP Concluídas

- **Onboarding Wizard em 3 passos:** Detecção de localização via GPS (`navigator.geolocation`), fallback automático por IP/Internet e busca por município brasileiro.
- **Catálogo de 15 Culturas e Recomendação Determinística:** Base curada em `src/data/culturas.json` com pontuação por clima, época, espaço e horas de sol.
- **Clima e Alertas de Rega via Open-Meteo:** Consulta de temperatura e precipitação real com alertas de chuva e calor forte na rotina do dia.
- **Guia Detalhado e Calculadora de Plantio (`/cultura/[id]`):** Lista de compras, calculadora de mudas/substrato/economia, fases do ciclo e manejo caseiro de pragas.
- **Aba "Hoje" e Lembretes Web:** Checklist diário com barra de progresso, atalho de diagnóstico foliar e notificações no navegador.
- **Aba "Minhas Plantas":** Acompanhamento de dias de cultivo, fase atual, diário com fotos compactadas em canvas e exportação/restauração de backup em JSON validado por Zod.
- **Aba "Assistente" (`/api/assistente`):** Chat contextual (local, espaço, cultura, fase, dias e tarefas pendentes) integrando Gemma 4 via Ollama local com fallback seguro para a base técnica Embrapa.
- **PWA, E2E e Deploy:** Web App Manifest, Service Worker offline (`public/sw.js`), suíte E2E em Playwright (`e2e/fluxo-principal.spec.ts`) e `Dockerfile` multi-stage.
