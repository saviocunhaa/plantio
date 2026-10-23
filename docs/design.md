# Design e Acessibilidade

## Direção visual

O **Plantio Fácil** é concebido com foco absoluto em usabilidade mobile-first para iniciantes. A identidade visual transmite clareza, natureza e acessibilidade:

- **Público:** Pessoas de todas as idades sem familiaridade prévia com jardinagem ou agricultura.
- **Ambiente de uso comum:** Celular sob luz solar direta (quintal, varanda, terraço) ou com conexão intermitente.
- **Tom visual:** Tons terrosos e verdes acolhedores, sem saturação excessiva, priorizando legibilidade máxima e alto contraste.
- **Foco de ação:** Telas descomplicadas com apenas uma decisão ou ação principal por vez ("O que fazer hoje").

## Sistema de design e tokens

- **Cores principais:**
  - Verde vegetal / folha para ações positivas e status ativo.
  - Tons terrosos e neutros quentes para planos de fundo e superfícies.
  - Alto contraste (mínimo 4.5:1 para texto normal e 3:1 para botões/gráficos, conforme WCAG AA).
- **Tipografia:**
  - Pilha de fontes nativas do sistema (`system-ui`, `-apple-system`, `sans-serif`) para renderização instantânea sem download de assets pesados e suporte offline.
  - Tamanho base mínimo de texto: `16px` (evita zoom indesejado em inputs no iOS Safari).
- **Dimensões e toques (Touch Targets):**
  - Botões e elementos clicáveis com área mínima de **44 × 44 pixels**, facilitando o toque em movimento ou com apenas uma das mãos.
  - Espaçamentos confortáveis com `p-4` a `p-6` em cards informativos.

## Interação e usabilidade

- **HTML Semântico:** Uso correto de `<main>`, `<header>`, `<nav>`, `<article>`, `<button>` e inputs rotulados com `<label>`.
- **Navegação por Teclado e Foco:** Estados de `:focus-visible` destacados com anel de foco bem definido.
- **Feedback de Validação:** Mensagens de erro posicionadas imediatamente abaixo do campo correspondente, em texto legível com ícone indicativo, nunca apenas por mudança de cor.
- **Estados Assíncronos:** Operações assíncronas (como cálculo de recomendação de culturas ou consulta de clima) exibem esqueletos (*skeletons*) ou indicadores de progresso explícitos.
- **Movimento Reduzido:** Suporte nativo a `prefers-reduced-motion: reduce` em transições e animações de interface.

## Layout e navegação mobile-first

- **Breakpoints:**
  - Mobile default (`< 640px`): Navegação inferior fixa com 4 abas canônicas (**Hoje, Plantar, Minhas Plantas, Assistente**).
  - Tablet / Desktop (`sm:` e superiores): Conteúdo centralizado com largura máxima delimitada (`max-w-2xl` a `max-w-4xl`) para preservar ergonomia de leitura.
- **Estados de tela obrigatórios para cada fluxo:**
  1. *Carregando:* esqueleto com formato antecipado do conteúdo.
  2. *Vazio:* mensagem motivadora com botão de ação rápida (ex.: "Nenhum plantio ativo ainda. Vamos começar?").
  3. *Erro:* mensagem em português claro com botão de tentar novamente, sem jargões técnicos.
  4. *Sucesso:* confirmação visual imediata com próximo passo sugerido.
