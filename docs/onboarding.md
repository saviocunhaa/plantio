# Preparação Local e Onboarding

Guia para desenvolvedores e agentes configurando o projeto **Plantio Fácil** em um novo ambiente de trabalho.

## Pré-requisitos

- **Node.js:** versão `>= 20.x` (ambiente de desenvolvimento validado com Node `v20.20.2`).
- **Gerenciador de pacotes:** npm `>= 10.x` (validado com npm `10.8.2`).
- **Git:** versão `>= 2.40`.
- **PostgreSQL (opcional no bootstrap inicial):** instância local ou remota (ex.: Supabase, Neon ou Docker) necessária apenas quando for persistir dados em banco.

## Primeiro início

1. Clone o repositório ou abra a pasta do projeto:
   ```bash
   cd plantio
   ```

2. Instale as dependências:
   ```bash
   npm install
   ```

3. Configure as variáveis de ambiente:
   ```bash
   cp .env.example .env.local
   ```
   *Nota: o projeto executa os testes unitários, lint e build de produção sem exigir preenchimento de `DATABASE_URL` no `.env.local`.*

4. Inicie o servidor de desenvolvimento:
   ```bash
   npm run dev
   ```
   Acesse `http://localhost:3000` no seu navegador ou emulador mobile.

## Banco de dados e migrações

- A conexão com o PostgreSQL é definida em `src/db/index.ts` e lê `DATABASE_URL` (ou `DATABASE_URL_UNPOOLED` para migrações diretas).
- Quando criar novas tabelas em `src/db/schema/`:
  ```bash
  # 1. Gerar os arquivos SQL de migração em drizzle/
  npm run db:generate

  # 2. Revisar o arquivo SQL gerado

  # 3. Aplicar ao banco de desenvolvimento
  npm run db:migrate
  ```

## Verificação e portões de qualidade

Execute a suíte canônica de verificação antes de qualquer envio de código:

```bash
npm run check
```

Esse comando executa em cadeia:
1. `npm run lint`: Checagem de sintaxe e padrões de código via ESLint.
2. `npm run typecheck`: Geração de tipos de rotas e verificação estrita via `tsc`.
3. `npm run lint:typed`: Validação de chamadas assíncronas e tipagem profunda.
4. `npm run lint:rules`: Auto-teste das regras de qualidade locais do toolkit.
5. `npm test`: Execução dos testes unitários com Vitest.
6. `npm run build`: Validação de compilação estática de produção.

## Agentes de IA

Antes de iniciar tarefas no código, consulte:
- [AGENTS.md](../AGENTS.md): acordos de trabalho, limites de autorização e convenções do projeto.
- [CLAUDE.md](../CLAUDE.md): ponte de entrada para sessões com Claude Code.
- [docs/setup.md](setup.md): registro de ferramentas, evidências e estado das skills.

## Problemas conhecidos e soluções

- **Erro ao buscar fontes do Google durante o build:**
  - *Sintoma:* `Failed to fetch Geist from Google Fonts`.
  - *Causa:* Restrição de rede no ambiente de build isolado ou offline.
  - *Solução aplicada:* Uso de pilha de fontes nativas do sistema em `src/app/layout.tsx`, eliminando a dependência de fontes externas e tornando o app mais rápido para PWA.
- **Falha de processo IPC no Turbopack com `@tailwindcss/turbopack`:**
  - *Sintoma:* `node process exited before we could connect to it with exit status: 0`.
  - *Causa:* Incompatibilidade do loader de webpack em subprocessos do Turbopack em macOS.
  - *Solução aplicada:* Configuração do Tailwind CSS v4 via `@tailwindcss/postcss` com `postcss.config.mjs` e compilação estável via `--webpack`.
