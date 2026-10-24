# Plantio Fácil

> App web mobile-first de recomendação e acompanhamento de cultivo para iniciantes, do zero até a colheita.

## Problema e objetivo

Pessoas que nunca plantaram enfrentam falta de conhecimento prático: não sabem o que plantar na sua região e época do ano, se o espaço que têm (vaso, varanda ou quintal) é suficiente, como regar e cuidar em cada fase da planta, ou o que fazer quando surgem pragas. Hoje dependem de buscas fragmentadas na internet ou dicas genéricas que muitas vezes não consideram o clima local.

O **Plantio Fácil** resolve isso com uma promessa direta: *"Diga onde você está e quanto espaço tem. A gente diz o que plantar e te guia até colher."*

## Público e papéis

- **Iniciantes absolutos:** sem qualquer conhecimento agrícola anterior; precisam de linguagem acessível e instruções passo a passo sem jargões.
- **Moradores de apartamento:** cultivo em vasos, jardineiras, varandas ou janelas com espaço e sol limitados.
- **Quem tem quintal ou pequeno terreno:** áreas de até 20 m² ou de 20 a 500 m² para hortas familiares.
- **Pequenos proprietários de terra:** áreas rurais simples querendo iniciar cultivo sustentável.
- **Papel de usuário:** único no MVP (jardineiro/iniciante); autenticação simples e armazenamento de plantios ativos.

## Fluxos da versão inicial (MVP)

1. **Onboarding e identificação do espaço:**
   - Entrada: localização automática (GPS do navegador com fallback para IP/Internet) ou busca manual por cidade, tipo/tamanho do espaço (vaso, quintal, terreno), horas de sol diárias e disponibilidade de água.
   - Ação: sistema analisa o clima do mês (normais climatológicas / ZARC / temperatura e precipitação) e cruza com a base de dados agronômicos curada.
   - Resultado: apresentação de culturas recomendadas ("Ideal agora", "Dá para plantar", "Espere o mês X").

2. **Seleção e planejamento da cultura:**
   - Entrada: clique na cultura desejada na lista recomendada.
   - Ação: visualização do detalhe da cultura (tempo até colheita, necessidade de rega, sol, materiais necessários e custos estimados) e confirmação de início de plantio.
   - Resultado: criação da jornada de cultivo personalizada com linha do tempo de fases e tarefas datadas.

3. **Rotina diária ("O que fazer hoje"):**
   - Entrada: abertura do app no celular.
   - Ação: visualização das tarefas pendentes do dia (ex.: regar com borrifador, adubação de cobertura, desbaste) com explicação simples de como executar.
   - Resultado: marcação da tarefa como concluída, registro de foto e notas opcionais no diário de bordo.

4. **Assistente de cultivo contextual:**
   - Entrada: pergunta do usuário (ex.: "minha folha de tomate está amarela, o que fazer?").
   - Ação: IA (Gemma) analisa a pergunta ancorada estritamente nos dados agronômicos da cultura e na fase atual do plantio.
   - Resultado: resposta clara, prática e orientada à ação.

## MVP

1. Onboarding em 3 passos (localização, tipo de espaço, nível de experiência).
2. Mecanismo de recomendação baseado em regras determinísticas (clima da cidade, espaço e horas de sol).
3. Base curada inicial de culturas em JSON versionado (ex.: tomate-cereja, alface, coentro, feijão-de-corda, quiabo).
4. Tela detalhe da cultura com guia de compras inicial e necessidades agronômicas.
5. Linha do tempo da jornada da planta dividida em 11 fases canônicas.
6. Painel diário ("Hoje") com checklist de tarefas práticas.
7. Diário de bordo do plantio com histórico de anotações.
8. Assistente de IA integrado com contexto do cultivo ativo.

## Fora de escopo

- E-commerce de sementes e insumos.
- Pagamentos e planos por assinatura.
- Rede social e feed comunitário no primeiro momento.
- Integração com sensores IoT e automação de irrigação.
- Diagnóstico complexo por visão computacional (reservado para v2).

## Requisitos

- **Mobile-first:** interface responsiva otimizada para uso em smartphones com uma mão só (botões de pelo menos 44px, tipografia legível sob luz solar).
- **Offline e PWA:** estrutura preparada para cache offline e funcionamento com conectividade intermitente.
- **Integridade agronômica:** a IA **nunca inventa** recomendações climáticas ou calendários agrícolas. Os dados agronômicos derivam de base curada (Embrapa, INMET, ZARC). A IA atua na explicação pedagógica e no atendimento de dúvidas.
- **Idioma:** Português do Brasil (pt-BR) nativo e claro.
- **Acessibilidade:** conformidade com diretrizes WCAG (contraste mínimo, atributos ARIA, suporte a navegação por teclado).

## Decisões técnicas e restrições

- **Framework:** Next.js 16 (App Router, Server Components e Client boundaries definidos).
- **Linguagem:** TypeScript rigoroso (`strict: true`, noImplicitAny).
- **Estilos:** Tailwind CSS v4 com PostCSS.
- **Persistência:** Drizzle ORM + PostgreSQL/pg para entidades relacionais (usuários, locais, espaços, plantios, tarefas, diário). Base inicial de culturas versionada em JSON no repositório para facilidade de auditoria técnica.
- **Validação:** Zod em todas as fronteiras de entrada (APIs, formulários e schemas de ambiente).
- **Logging:** Pino estruturado e restrito ao servidor (`server-only`), com mascaramento de dados sensíveis.
- **Testes:** Vitest para lógica de domínio, sanitização de ambiente, ciclo de conexão e testes de fronteira.
- **Qualidade de código:** ESLint com regras personalizadas do Vibe Coding Toolkit (limite de 350 linhas por arquivo, proibição de console direto, isolamento de dados no cliente e travas em `update/delete` sem `where`).

## Premissas e decisões consolidadas

- *Catálogo agronômico:* 15 culturas completas versionadas em `src/data/culturas.json` validadas com Embrapa Hortaliças, Semiárido e Milho e Sorgo.
- *Assistente híbrido:* Conexão com Ollama/Gemma 4 local e fallback automático seguro para a base técnica agronômica, via `/api/assistente`.
- *Geolocalização:* Detecção via GPS (`navigator.geolocation`) com 1 clique e fallback automático por conexão de internet (IP).
- *Persistência relacional:* Drizzle ORM com schema definido para usuários, locais, plantios, tarefas e diário com migrations geradas em `drizzle/`.

## Critérios de aceitação

1. O projeto compila sem erros (`npm run build`).
2. Todas as suítes de testes passam sem mock de credenciais (`npm test`).
3. O linting padrão e o linting tipado executam sem avisos ou erros (`npm run lint && npm run lint:typed`).
4. As regras arquiteturais de qualidade são validadas com sucesso (`npm run lint:rules`).
5. A tela inicial mobile-first carrega com identidade visual limpa em verde terroso e alto contraste.
6. As 4 abas funcionam de forma integrada (Hoje, Plantar, Minhas Plantas com fotos, Assistente com IA/Embrapa).

## Manutenção

Atualize este documento sempre que houver mudança no objetivo do produto, regras agronômicas, escopo do MVP ou critérios de aceitação. Detalhes de arquitetura pertencem a `docs/architecture.md`.
