<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# Plantio Fácil — Instruções para Agentes

Instruções compartilhadas para agentes de IA (Claude Code, Codex, Antigravity) operando no projeto.

## Produto e stack

- **Produto e escopo:** [PRODUCT.md](PRODUCT.md) e [PLANO.md](PLANO.md).
- **Stack:** Next.js 16 (App Router), React 19, TypeScript 5, Tailwind CSS v4, Drizzle ORM, PostgreSQL (`pg`), Pino, Zod, Vitest.
- **Ambiente verificado:** Node.js v20.20.2, npm 10.8.2.
- **Evidências de setup:** [docs/setup.md](docs/setup.md).

## Comandos canônicos

- **Instalar:** `npm install`
- **Desenvolver:** `npm run dev`
- **Lint básico:** `npm run lint`
- **Tipagem:** `npm run typecheck`
- **Lint tipado:** `npm run lint:typed`
- **Regras locais:** `npm run lint:rules`
- **Testes unitários:** `npm test`
- **Build de produção:** `npm run build`
- **Geração de migrations:** `npm run db:generate`
- **Verificação completa da base:** `npm run check`

## Acordos de trabalho

- Leia o código relevante e as instruções antes de realizar qualquer alteração. Torne explícitas as premissas que afetem escopo ou comportamento.
- Conclua as solicitações com a menor alteração suficiente. Reutilize padrões, componentes e dependências existentes.
- Preserve validações, tratamento de erro, segurança, acessibilidade e requisitos explícitos.
- Não crie abstrações, camadas arquiteturais vazias, opções ou dependências para necessidades hipotéticas não solicitadas.
- Execute os testes e checks apropriados após alterações de código. Teste regressões e comportamentos relevantes.
- Não converta premissas em fatos nem simule integrações ausentes como se estivessem ativas.
- Respeite limites de escopo: publicação externa, comunicação com terceiros, criação de custos e ações destrutivas requerem autorização prévia.

## Padrões arquiteturais e documentação

- **Persistência:** Drizzle ORM + PostgreSQL (`pg`). Centralize a inicialização do pool em `src/db/index.ts` com criação tardia (*lazy*); o build e os testes padrão não exigem banco ativo.
- **Validação:** Schemas Zod em `src/lib/env-schema.ts` para variáveis de ambiente e validação obrigatória em todos os pontos de entrada de dados.
- **Logs:** Pino estruturado e isolado no servidor (`src/lib/logger.ts`, `server-only`), com mascaramento automático de chaves sensíveis.
- **Fronteira de dados:** Componentes de apresentação não importam o cliente do banco de dados diretamente.
- **Arquivos e responsabilidades:**
  - `PRODUCT.md` controla visão, escopo, regras de negócio e critérios de aceitação.
  - `docs/architecture.md` detalha estrutura, fluxo de dados e decisões técnicas implementadas.
  - `docs/design.md` orienta identidade visual (verde terroso, mobile-first, alto contraste) e acessibilidade.
  - `docs/onboarding.md` guia a configuração do ambiente local e primeiros passos.
  - `docs/quality.md` documenta os portões de qualidade, testes e políticas de revisão.
  - `docs/setup.md` mantém o registro histórico de evidências, ferramentas e versões.

## Skills Vercel instaladas

As seguintes skills oficiais estão instaladas localmente em `.agents/skills/` (com espelhamento em `.claude/skills/`):

- `vercel-react-best-practices`: diretrizes de performance para React 19 e Next.js App Router.
- `vercel-composition-patterns`: padrões de composição de componentes.
- `web-design-guidelines`: boas práticas de design, usabilidade e acessibilidade WCAG.
- `writing-guidelines`: revisão de clareza textual e documentação.
- `vercel-react-view-transitions`: suporte a transições visuais compatíveis.
- `vercel-optimize`: auditoria de performance em deploy.
- `deploy-to-vercel`: publicação e preview autorizados.
- `vercel-cli-with-tokens`: autenticação por tokens na CLI da Vercel.
- `find-skills`: busca de novas capacidades quando estritamente necessário.

## Git e governança

- Não adicione travas de push na branch `main`, exigências obrigatórias de worktree ou git hooks que impeçam commits locais por padrão.
