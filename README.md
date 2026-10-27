# Plantio Fácil

Aplicação web mobile-first de recomendação e acompanhamento de cultivo para iniciantes absolutos. Guia o usuário desde a escolha da cultura ideal para seu espaço e clima até a colheita, com rotinas diárias e suporte inteligente.

Consulte o [PRODUCT.md](PRODUCT.md) para a visão detalhada de produto, requisitos agronômicos e escopo do MVP.

## Execução

### Pré-requisitos

- **Node.js:** versão 20.x ou superior (desenvolvido e testado em Node v20.20.2).
- **Gerenciador de pacotes:** npm 10.x.

### Instalação e desenvolvimento

```bash
# Instalar dependências
npm install

# Iniciar servidor de desenvolvimento
npm run dev

# Executar validação completa de qualidade
npm run check
```

O servidor local estará disponível em `http://localhost:3000`.

### Comandos de qualidade

- `npm run lint`: ESLint com regras oficiais Next.js e regras customizadas de arquitetura.
- `npm run typecheck`: Geração de tipos do Next.js e verificação rigorosa via TypeScript (`tsc --noEmit`).
- `npm run lint:typed`: Validação estrita de promises e funções assíncronas.
- `npm run lint:rules`: Auto-checagem das regras de qualidade locais (`scripts/verify-quality-rules.mjs`).
- `npm test`: Execução da suíte de testes unitários com Vitest.
- `npm run test:e2e`: Execução dos testes ponta a ponta do fluxo principal com Playwright.
- `npm run build`: Compilação de produção com otimização estática.
- `npm run db:generate`: Geração de migrações SQL com Drizzle Kit (quando houver novas tabelas).

## Documentação

- [Produto e Escopo](PRODUCT.md)
- [Preparação Local e Onboarding](docs/onboarding.md)
- [Estrutura e Decisões Técnicas](docs/architecture.md)
- [Design e Acessibilidade](docs/design.md)
- [Portões de Qualidade e Testes](docs/quality.md)
- [Instruções de Agentes de IA](AGENTS.md)
- [Evidências e Setup do Toolkit](docs/setup.md)
- [Plano Original de Referência](PLANO.md)

## Estado do MVP

O MVP descrito em [PLANO.md](PLANO.md) e [PRODUCT.md](PRODUCT.md) está implementado e validado:

- Onboarding interativo em 3 passos com GPS (`navigator.geolocation`), fallback por IP e busca de municípios via Open-Meteo.
- Catálogo agronômico curado com 15 culturas em `src/data/culturas.json` e motor de recomendação determinístico (`src/lib/recommendation`).
- Calculadora de mudas/substrato (`src/lib/calculator`), diagnóstico foliar visual com soluções caseiras (`src/lib/diagnostic`) e alertas climáticos de rega.
- Jornada do cultivo com rotina diária ("Hoje"), diário fotográfico compactado no cliente e exportação/restauração de backup em JSON.
- Assistente híbrido (`/api/assistente`) ancorado no contexto completo do plantio (local, fase, dias, tarefas pendentes) via Gemma 4 / Ollama com fallback determinístico Embrapa.
- Suporte PWA com Service Worker (`public/sw.js`), Web App Manifest e Dockerfile para publicação.
