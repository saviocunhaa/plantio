# Qualidade e Testes

Estratégia de garantia de qualidade, portões automatizados e regras de arquitetura do **Plantio Fácil**.

## Comandos canônicos de qualidade

| Comando | O que valida | Quando executar |
|---|---|---|
| `npm run lint` | ESLint com presets oficiais do Next.js e regras locais do toolkit (limite de 350 linhas, bloqueio de console e fronteiras de dados). | A cada alteração de arquivo |
| `npm run typecheck` | `next typegen` e compilação TypeScript com `tsc --noEmit`. Valida integridade de tipos e rotas. | Antes de commits |
| `npm run lint:typed` | Checagem de promises flutuantes e async incorretos (`no-floating-promises`, `no-misused-promises`). | Pré-entrega e no check geral |
| `npm run lint:rules` | Execução do self-check das regras de qualidade locais (`scripts/verify-quality-rules.mjs`). | Ao alterar regras ESLint |
| `npm test` | Suíte de testes unitários com Vitest em ambiente Node.js. | Durante desenvolvimento e refatorações |
| `npm run build` | Compilação de produção e otimização estática de rotas. | Pré-entrega |
| `npm run check` | Execução encadeada de todos os 6 checks acima em sequência única. | Porta de aceitação de qualquer tarefa |

## Regras de arquitetura obrigatórias

1. **TypeScript Estrito:** Sem uso de `any` implícito ou supressões de tipo injustificadas.
2. **Teto de 350 Linhas (`quality/max-lines`):** Nenhum arquivo fonte deve ultrapassar 350 linhas. Complexidades maiores devem ser decompostas em módulos coesos.
3. **Proibição de `console` Direto (`quality/no-direct-console`):** Logs no servidor devem usar obrigatoriamente a instância do Pino em `src/lib/logger.ts`, garantindo mascaramento de dados sensíveis.
4. **Isolamento de Dados no Cliente (`quality/no-direct-data-access`):** Componentes ou arquivos do cliente não podem importar instâncias de banco de dados diretamente.
5. **Travas no Drizzle (`eslint-plugin-drizzle`):** Operações de `update` ou `delete` sem cláusula `where` explícita são sinalizadas como erro.
6. **Validação de Variáveis e Entradas:** Nenhuma variável de ambiente ou entrada de usuário é acessada sem validação por schema Zod (`src/lib/env-schema.ts`).

## Estratégia de testes

- **Foco em Comportamento e Fronteiras:** Testar lógica de negócios real (regras de recomendação de culturas, cálculo de épocas de plantio, validação de limites de espaço).
- **Sem Dependência de Credenciais:** Testes unitários rodam isoladamente em memória ou com mocks limpos, sem exigir banco de dados real em execução.
- **Testes Existentes:**
  - `src/lib/env.test.ts`: Valida rejeição de URLs inválidas de banco e garantia de schemas corretos.
  - `src/lib/logger.test.ts`: Valida sanitização e mascaramento de campos como senhas, tokens e cookies.
  - `src/db/index.test.ts`: Valida ciclo de vida da pool lazy, garantia de instância única e ausência de conexões prematuras sem credenciais.

## Revisão de código e entregas

- Toda alteração deve ser acompanhada da menor quantidade suficiente de código para atingir o objetivo da tarefa.
- Nenhuma funcionalidade deve quebrar o comando `npm run check`.
- Revisões de segurança mantêm relatórios privados e auditam dependências com `npm audit`.
