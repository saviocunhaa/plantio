# Plano completo: app web mobile-first de plantio para iniciantes

Nome provisório do app: **Plantio Fácil**

## 1. Visão do produto

Um app web, pensado primeiro para celular, que leva uma pessoa que nunca plantou nada do zero até a colheita. O usuário informa onde está, quanto espaço tem (ou se é plantio em casa) e o app diz o que dá para plantar agora, monta um passo a passo e acompanha cada fase da cultura com lembretes.

**Promessa:** "Diga onde você está e quanto espaço tem. A gente diz o que plantar e te guia até colher."

### Público

- Iniciantes absolutos, sem conhecimento agrícola.
- Quem mora em apartamento (vasos, varanda, janela).
- Quem tem quintal ou terreno pequeno.
- Quem tem sítio ou terra maior e quer começar com algo simples.

### Princípios

1. Linguagem simples, sem jargão (explicar "adubação de cobertura" como "dar comida extra para a planta").
2. Uma ação por vez: o app sempre mostra "o que fazer hoje".
3. Dados agronômicos vêm de uma base curada e verificada, **nunca inventados pela IA**.
4. A IA (Gemma) explica, adapta o texto e responde dúvidas, mas com base nos dados da cultura.
5. Funciona bem em celular com internet ruim (PWA, cache offline).

## 2. Funcionalidades

### MVP (versão 1)

1. **Onboarding rápido** em 3 telas: local, tipo/tamanho do espaço, experiência.
2. **Localização automática e manual:**
   - **GPS do navegador:** Detecção precisa por coordenadas (`navigator.geolocation`) com 1 clique no botão "Usar minha localização atual".
   - **Localização por Internet / IP:** Fallback automático quando o GPS estiver desativado ou o usuário preferir não conceder permissão, descobrindo cidade e clima pela conexão de internet.
   - **Busca por cidade:** Campo de busca rápida com autocompletar para qualquer município do Brasil.
   - **Clima integrado:** Consulta automática de temperatura e chuva em tempo real via Open-Meteo.
3. **Tipo de espaço:**
   - Casa/apartamento: vasos, jardineira, garrafa pet, horta vertical.
   - Quintal pequeno (até \~20 m²).
   - Terreno médio (20 a 500 m²).
   - Terra grande (acima de 500 m², com campo em m² ou hectares).
   - Campos extras: quantas horas de sol, tem água fácil?, tem vaso de que tamanho?
4. **Recomendação de culturas:** lista ordenada por facilidade, com selo "Ideal agora", "Dá para plantar", "Espere o mês X".
5. **Detalhe da cultura:** tempo até colher, quanto de espaço, dificuldade, rega, sol, custo estimado, o que comprar.
6. **Plano de cultivo (jornada):** linha do tempo com todas as fases e tarefas com data.
7. **Diário da plantação:** marcar tarefa como feita, registrar foto e anotação.
8. **Lembretes** (notificação web push ou lista "Hoje").
9. **Assistente (Gemma):** chat para tirar dúvidas "minha folha amarelou, e agora?".

### Versão 2

- Diagnóstico por foto (pragas e doenças) usando modelo com visão.
- Previsão do tempo integrada (avisar "vai chover forte, não regue").
- Calculadora de quantidade (quantas mudas/sementes cabem em X m²).
- Comunidade e troca de mudas.
- Estimativa de produção e economia.
- Modo offline completo.

### Fora de escopo no início

Loja, pagamento, rede social, drones, IoT.

## 3. Fases que o app deve cobrir em toda cultura

Cada cultura passa por estas fases, com tarefas, duração e dicas:

1. **Planejamento:** escolher cultura, local, época.
2. **Preparação:** vaso/canteiro, solo, adubo, ferramentas, materiais.
3. **Semeadura ou plantio de muda:** profundidade, espaçamento, quantidade.
4. **Germinação:** quantos dias, o que esperar, o que fazer se não nascer.
5. **Crescimento inicial:** rega, desbaste, proteção.
6. **Crescimento vegetativo:** adubação, tutoramento, capina.
7. **Floração e frutificação (quando houver).**
8. **Manejo de pragas e doenças:** sinais, solução caseira primeiro, depois alternativas.
9. **Colheita:** como saber que está no ponto, como colher.
10. **Pós-colheita:** armazenar, consumir, replantar, guardar sementes.
11. **Encerramento do ciclo:** o que fazer com a terra, rotação de culturas.

## 4. Como funciona a recomendação por localização

### 4.1 Dados de entrada

- Latitude e longitude (obtidos via GPS do navegador, geolocalização por IP/Internet ou busca por cidade).
- Mês atual.
- Tipo e tamanho do espaço.
- Horas de sol e acesso à água.

### 4.2 Dados externos úteis (verificar disponibilidade e termos de uso)

- **Open-Meteo:** geocodificação, clima, previsão e histórico, gratuito para uso não comercial e sem chave de API.
- **Clima por cidade:** normais climatológicas (INMET) para temperatura e chuva média mensal.
- **ZARC (Zoneamento Agrícola de Risco Climático, MAPA/Embrapa):** janelas de plantio recomendadas por município e cultura, relevante para quem tem terra maior.
- **Köppen-Geiger:** classificação climática por coordenadas (pode ser pré-calculada).
- **Mapa de zonas de rusticidade/ clima** como alternativa para outros países.

### 4.3 Algoritmo (regras, não IA)

Para cada cultura da base:

1. Buscar o **clima do local** (temperatura média mensal mín/máx, chuva mensal).
2. Checar se a temperatura do mês cai na faixa ideal da cultura (`temp_min_ideal` a `temp_max_ideal`) e se fica fora da faixa de risco (geada, calor extremo).
3. Checar se o mês está nas janelas de plantio da região (ZARC ou calendário curado).
4. Filtrar por **espaço**: a cultura precisa caber (`espaco_minimo_m2`, `profundidade_vaso_cm`, `permite_vaso`).
5. Filtrar por **sol**: horas mínimas exigidas.
6. Calcular **pontuação**:
   - clima/época (peso 50%)
   - facilidade para iniciante (peso 25%)
   - cabe no espaço (peso 15%)
   - rapidez até a colheita (peso 10%)
7. Classificar em: `ideal_agora`, `possivel`, `esperar` (com o mês indicado) ou `nao_recomendado`.

Exemplo no semiárido nordestino (como Juazeiro do Norte): temperaturas altas o ano todo e chuva concentrada no início do ano. Culturas como macaxeira, feijão-de-corda, milho, quiabo, maxixe, coentro (em sombra parcial) e pimenta tendem a ir bem; alface exige cuidado com calor. **A base curada deve registrar isso, não a IA.**

### 4.4 O que a IA faz aqui

A Gemma **não decide** a recomendação. Ela recebe a lista já calculada e gera a explicação em linguagem simples: "Feijão-de-corda é ótimo agora porque está começando o período de chuva e a planta aguenta calor".

## 5. Modelo de dados

### 5.1 Cultura (JSON em arquivo ou tabela)

```json
{
  "id": "tomate-cereja",
  "nome": "Tomate-cereja",
  "categoria": "fruto",
  "dificuldade": 2,
  "dias_germinacao": [5, 10],
  "dias_ate_colheita": [70, 90],
  "temp_ideal_c": [18, 30],
  "temp_risco_c": { "min": 10, "max": 35 },
  "sol_horas_min": 6,
  "agua": "regular",
  "espaco": {
    "permite_vaso": true,
    "vaso_litros_min": 15,
    "espaco_m2_por_planta": 0.5,
    "permite_apartamento": true
  },
  "janelas_plantio": { "semiarido_ne": [4, 5, 6, 7], "sudeste": [8, 9, 10, 11] },
  "fases": [
    {
      "id": "germinacao",
      "nome": "Germinação",
      "dias": [0, 10],
      "tarefas": [
        { "titulo": "Manter solo úmido", "frequencia_dias": 1, "como_fazer": "Regue com borrifador, sem encharcar." }
      ],
      "sinais_de_problema": ["Sementes não nasceram após 14 dias"]
    }
  ],
  "pragas_comuns": ["mosca-branca", "traça-do-tomateiro"],
  "ponto_de_colheita": "Frutos totalmente vermelhos e firmes.",
  "fontes": ["Embrapa Hortaliças"]
}
```

### 5.2 Tabelas principais (Postgres/Supabase ou SQLite)

- `usuarios` (id, email, criado\_em)
- `locais` (id, usuario\_id, nome, lat, lon, cidade, estado, pais)
- `espacos` (id, local\_id, tipo \[vaso, quintal, terreno\], area\_m2, sol\_horas, agua\_facil, notas)
- `culturas` (dados acima, ou lidas de JSON versionado no repositório)
- `plantios` (id, espaco\_id, cultura\_id, data\_plantio, quantidade, status)
- `tarefas` (id, plantio\_id, titulo, fase, data\_prevista, concluida\_em)
- `diario` (id, plantio\_id, data, texto, foto\_url)
- `chat_mensagens` (id, usuario\_id, plantio\_id, papel, texto, criado\_em)

**Dica:** comece com as culturas em JSON dentro do repositório (versionado, fácil de revisar). Migre para banco depois.

## 6. Telas (mobile-first)

1. **Boas-vindas:** logo, botão "Começar".
2. **Onde você está?** botão "Usar minha localização" ou campo de cidade.
3. **Qual seu espaço?** cartões grandes: Em casa (vasos) / Quintal / Terreno / Terra grande. Se terreno: campo de tamanho com seletor m² ou hectares.
4. **Sol e água:** sol (pouco, meio, muito) e água (fácil, difícil).
5. **O que plantar agora:** lista com cartões (foto, nome, dificuldade, tempo até colher, selo de época). Filtros: "mais fácil", "mais rápido".
6. **Detalhe da cultura:** resumo, o que você vai precisar, custo, botão "Quero plantar isso".
7. **Minha plantação (jornada):** linha do tempo vertical com as fases, fase atual em destaque.
8. **Hoje:** tarefas do dia com botão grande "Feito".
9. **Diário:** fotos e notas.
10. **Pergunte ao assistente:** chat.
11. **Perfil/Configurações.**

Navegação inferior com 4 abas: **Hoje, Plantar, Minhas plantas, Assistente.**

### Diretrizes de design

- Botões grandes (mínimo 44 px de altura), fonte base 16 px.
- Verde terroso como cor principal, boa legibilidade ao sol (alto contraste).
- Ícones e fotos grandes por cultura.
- Modo escuro opcional.

## 7. Stack tecnológica recomendada

### Front-end

- **React + Vite + TypeScript**
- **Tailwind CSS** (mobile-first por padrão)
- **PWA** (vite-plugin-pwa): instalável na tela inicial, cache offline.
- **TanStack Query** para dados, **Zustand** para estado simples.
- **Zod** para validar dados.

### Back-end

Opção A (mais simples): **Supabase** (Postgres, autenticação, storage de fotos) + front chamando direto. Opção B (mais controle): **Node.js + Fastify** (ou **Python + FastAPI**) + Postgres.

Recomendação para começar: **Opção B com FastAPI ou Fastify** se você quer rodar a IA local junto, ou **Supabase** se quer lançar rápido e usar IA por API.

### IA

- **Gemma 4** rodando localmente via **Ollama** ou **LM Studio**, ou hospedada em um servidor com GPU.
- Confirme o nome exato do modelo e o tamanho (por exemplo, versão menor para notebook, maior para servidor) na biblioteca do Ollama ou no Hugging Face antes de configurar, pois os identificadores mudam.
- O back-end expõe `/api/assistente` e conversa com o servidor do modelo pela API compatível com OpenAI ou pela API do Ollama.

### Hospedagem inicial

- Front: Vercel, Netlify ou Cloudflare Pages.
- Back-end: Render, Railway, Fly.io ou VPS.
- IA: máquina própria com Ollama (para desenvolvimento) ou VPS com GPU (produção).

## 8. Arquitetura

```
[Celular / navegador PWA]
        |
        v
[Front-end React]  --->  [API (FastAPI/Fastify)]
                              |-- Regras de recomendação (código)
                              |-- Base de culturas (JSON/Postgres)
                              |-- Clima (Open-Meteo / dados pré-calculados)
                              |-- Agendador de tarefas e lembretes
                              '-- Cliente de IA ---> [Ollama + Gemma 4]
```

### Endpoints principais

- `POST /api/localizacao` recebe cidade ou lat/lon, devolve clima resumido.
- `POST /api/recomendar` recebe local, espaço e mês, devolve culturas pontuadas.
- `GET /api/culturas/{id}` detalhe da cultura.
- `POST /api/plantios` cria plantio e gera tarefas com datas.
- `GET /api/hoje` tarefas do dia.
- `PATCH /api/tarefas/{id}` marcar concluída.
- `POST /api/diario` registrar nota e foto.
- `POST /api/assistente` pergunta ao assistente, com contexto do plantio.

## 9. Uso da Gemma 4 (assistente)

### Papéis

1. Explicar a recomendação em linguagem simples.
2. Responder dúvidas do usuário com contexto da cultura e da fase atual.
3. Reescrever tarefas conforme o nível (iniciante total).
4. (Se o modelo tiver visão) analisar foto de folha ou praga.

### Regras de segurança do assistente

- Responder só com base nos dados da cultura e conhecimento agrícola geral; se não souber, dizer que não sabe.
- Não recomendar agrotóxicos nem dosagens perigosas; priorizar soluções caseiras e manejo, e indicar procurar técnico agrícola (EMATER, Embrapa, casa agropecuária) em casos graves.
- Não afirmar diagnóstico com certeza; falar em "possíveis causas".
- Avisar sobre cuidado com plantas tóxicas para crianças e pets.

### Prompt de sistema (modelo)

```
Você é o Assistente do Plantio Fácil, um guia amigável de horta para pessoas
que nunca plantaram nada. Responda em português do Brasil, em frases curtas e
sem jargão. Se usar um termo técnico, explique entre parênteses.

Contexto do usuário:
- Local: {cidade}, {estado}
- Espaço: {tipo_espaco}, {area}
- Cultura: {cultura}, fase atual: {fase}, dia {dias_desde_plantio}
- Tarefas pendentes: {tarefas}

Regras:
1. Use os dados da cultura fornecidos; não invente prazos ou quantidades.
2. Se não tiver certeza, diga que não tem certeza e sugira observar a planta
   ou consultar um técnico agrícola.
3. Não indique agrotóxicos. Prefira manejo, rega, poda e soluções caseiras seguras.
4. Termine com uma próxima ação simples que a pessoa possa fazer hoje.
```

### Chamada exemplo (Ollama)

```
POST http://localhost:11434/api/chat
{
  "model": "<nome-do-modelo-gemma-4-no-ollama>",
  "stream": true,
  "messages": [
    {"role": "system", "content": "<prompt de sistema acima>"},
    {"role": "user", "content": "As folhas do meu tomate estão amarelando"}
  ]
}
```

## 10. Como usar este plano no Claude (Claude Code) com a Gemma 4

### Preparação do ambiente

1. Instale Node.js (versão LTS) e, se for usar Python no back-end, Python 3.11+.
2. Instale o **Ollama** e baixe a Gemma 4 (confira o nome exato com `ollama list` ou na biblioteca de modelos).
3. Crie a pasta do projeto e abra o **Claude Code** nela.
4. Salve este documento como `PLANO.md` na raiz do projeto e crie um arquivo `CLAUDE.md` curto com as regras abaixo, para o Claude sempre seguir.

### Modelo de `CLAUDE.md`

```
# Plantio Fácil
App web PWA mobile-first para iniciantes plantarem e colherem.
Leia PLANO.md antes de qualquer tarefa.

## Regras
- Idioma da interface e dos textos: português do Brasil.
- Stack: React + Vite + TypeScript + Tailwind; API em <FastAPI ou Fastify>.
- Dados de culturas ficam em /data/culturas/*.json e são a fonte da verdade.
- A IA (Gemma via Ollama) nunca decide recomendações; só explica e conversa.
- Mobile-first: projetar para 360 px de largura primeiro.
- Escreva testes para as regras de recomendação.
- Commits pequenos, um por funcionalidade.
```

### Ordem de prompts para o Claude Code (cada um é um passo)

**Passo 1: esqueleto**

> Leia PLANO.md. Crie o projeto React + Vite + TypeScript + Tailwind com PWA configurado, rotas para as telas do plano e navegação inferior com 4 abas. Use dados mockados.

**Passo 2: onboarding**

> Implemente as telas de onboarding (localização, tipo e tamanho do espaço, sol e água). Use geolocalização do navegador e, como alternativa, busca de cidade pela API de geocodificação do Open-Meteo. Salve no estado e no localStorage.

**Passo 3: base de culturas**

> Crie o schema Zod da cultura (veja seção 5.1) e 15 culturas iniciais em JSON para clima tropical/semiárido do Brasil: coentro, cebolinha, alface, rúcula, tomate-cereja, pimenta, quiabo, maxixe, feijão-de-corda, milho, macaxeira, batata-doce, cenoura, rabanete e manjericão. Marque qualquer dado incerto com `"verificar": true`.

**Passo 4: motor de recomendação**

> Implemente o algoritmo da seção 4.3 como função pura, com testes unitários cobrindo vaso, quintal e terreno, e meses diferentes.

**Passo 5: clima**

> Integre o clima via Open-Meteo, com cache. Calcule médias mensais de temperatura e chuva para a localização e use no motor de recomendação.

**Passo 6: jornada do plantio**

> Ao escolher "Quero plantar", gere o plano com todas as fases e tarefas com datas, e implemente a tela Hoje com marcar como feito.

**Passo 7: diário e lembretes**

> Implemente o diário com foto (compactada no cliente) e lembretes por Web Push.

**Passo 8: assistente**

> Crie o endpoint /api/assistente que chama o Ollama com o prompt de sistema da seção 9, injetando o contexto do plantio, com streaming de resposta, e a tela de chat.

**Passo 9: qualidade**

> Revise acessibilidade (contraste, tamanho de toque), desempenho em 3G e adicione testes end-to-end do fluxo principal.

**Passo 10: publicação**

> Prepare o deploy: variáveis de ambiente, Dockerfile e instruções de hospedagem.

### Dica sobre Claude e Gemma

- O **Claude** é ótimo para escrever e revisar o código do projeto (via Claude Code).
- A **Gemma 4** fica dentro do app como o assistente que conversa com o usuário final, e pode rodar local e de graça.
- Se a Gemma local for lenta, comece com uma versão menor do modelo e deixe o assistente como recurso opcional.

## 11. Conteúdo: como montar uma base confiável de culturas

1. Comece com **15 a 20 culturas fáceis** (folhosas, temperos, raízes, leguminosas).
2. Fontes recomendadas: **Embrapa** (Hortaliças e Agroindústria Tropical), **EMATER/EMATERCE** locais, **IAC**, **INMET**, **ZARC/MAPA**.
3. Cada cultura deve ter revisão de alguém com conhecimento (agrônomo ou técnico agrícola) antes do lançamento.
4. Registrar a fonte em cada cultura (`fontes`).
5. Versionar a base para poder corrigir e atualizar.
6. Criar variações regionais: semiárido, Mata Atlântica, Sul, Cerrado, Amazônia.

### Sugestão de primeiras culturas por tipo de espaço

- **Vasos e apartamento:** cebolinha, coentro, manjericão, hortelã, pimenta, tomate-cereja, alface, rúcula.
- **Quintal pequeno:** quiabo, maxixe, feijão-de-corda, cenoura, rabanete, couve, batata-doce.
- **Terreno médio ou grande:** milho, feijão, macaxeira, mandioca, abóbora, melancia, feijão-de-corda em maior escala.

## 12. Roadmap sugerido

| Etapa | Duração | Entrega |
| --- | --- | --- |
| 0. Pesquisa e conteúdo | 1 a 2 semanas | 15 culturas curadas, fontes definidas |
| 1. Protótipo clicável | 1 semana | Telas e fluxo com dados mockados |
| 2. MVP funcional | 3 a 4 semanas | Onboarding, recomendação, jornada, tarefas |
| 3. Assistente com Gemma | 1 a 2 semanas | Chat com contexto da cultura |
| 4. Teste com 10 a 20 iniciantes reais | 2 semanas | Feedback e ajustes |
| 5. Lançamento beta | 1 semana | PWA publicado |
| 6. Versão 2 | contínuo | Foto-diagnóstico, previsão, comunidade |

## 13. Métricas de sucesso

- % de usuários que concluem o onboarding.
- % que iniciam um plantio depois de ver recomendações.
- Tarefas concluídas por semana.
- **% de plantios que chegam à colheita** (métrica principal).
- Satisfação ("consegui colher?", sim/não).

## 14. Riscos e cuidados

| Risco | Mitigação |
| --- | --- |
| Dado agronômico errado leva o usuário a perder a planta | Base curada, revisão por técnico, campo `fontes` |
| IA "alucinar" conselhos | IA só explica dados da base; regras no prompt; aviso na tela |
| Clima local muito diferente da média da cidade | Permitir ajuste manual e usar previsão real |
| Usuário desiste no meio | Lembretes curtos, foco em "o que fazer hoje", fotos de progresso |
| Internet ruim no campo | PWA com cache e modo offline |
| Privacidade da localização | Pedir permissão clara, guardar só cidade aproximada se possível, seguir a LGPD |
| Plantas tóxicas para pets e crianças | Aviso nas culturas relevantes |

## 15. Próximos passos imediatos

1. Escolher o nome final e a região piloto (sugestão: começar pelo semiárido do Nordeste, onde você está, e expandir depois).
2. Salvar este plano como `PLANO.md` e criar o `CLAUDE.md`.
3. Instalar Ollama e testar a Gemma 4 com o prompt de sistema da seção 9.
4. Executar o **Passo 1** do Claude Code e ir seguindo a ordem.
5. Montar as 15 primeiras culturas com ajuda de um técnico agrícola local.
