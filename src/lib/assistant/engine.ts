import culturasData from "@/data/culturas.json";
import { Cultura } from "@/lib/recommendation/types";
import { InputAssistente, RespostaAssistente } from "./types";

const culturas = culturasData as Cultura[];

export function montarPromptSistema(input: InputAssistente, cultura?: Cultura): string {
  const cidade = input.cidade ?? "Brasil (clima geral)";
  const espaco = input.tipo_espaco ?? "horta caseira / vaso";
  const culturaNome = cultura?.nome ?? input.cultura_nome ?? "hortaliças gerais";
  const fase = input.fase_atual ?? "desenvolvimento";
  const dias = input.dias_desde_plantio ?? 0;
  const tarefas = (input.tarefas_pendentes ?? []).join("; ") || "nenhuma no momento";

  return `Você é o Assistente do Plantio Fácil, um guia amigável de horta para pessoas que nunca plantaram nada. Responda em português do Brasil, em frases curtas e sem jargão. Se usar um termo técnico, explique entre parênteses.

Contexto do usuário:
- Local: ${cidade}
- Espaço: ${espaco}
- Cultura: ${culturaNome}, fase atual: ${fase}, dia ${dias}
- Tarefas pendentes: ${tarefas}

Regras obrigatórias:
1. Use os dados da cultura fornecidos; não invente prazos ou quantidades.
2. Se não tiver certeza, diga que não tem certeza e sugira observar a planta ou consultar um técnico agrícola (EMATER/Embrapa).
3. Nunca indique agrotóxicos químicos. Prefira manejo, rega, poda e soluções caseiras seguras (sabão neutro, óleo de neem, calda vegetal).
4. Termine sempre com uma próxima ação simples que a pessoa possa fazer hoje.`;
}

export function gerarRespostaAgronomicaLocal(
  input: InputAssistente,
  cultura?: Cultura
): RespostaAssistente {
  const texto = input.mensagem.toLowerCase();
  const cNome = cultura?.nome ?? input.cultura_nome ?? "sua planta";

  // Identificação de praga da base
  if (cultura && cultura.pragas_comuns.length > 0) {
    const pragaEncontrada = cultura.pragas_comuns.find((p) =>
      texto.includes(p.nome.toLowerCase()) ||
      p.sintomas.toLowerCase().split(" ").some((palavra) => palavra.length > 4 && texto.includes(palavra))
    );

    if (pragaEncontrada) {
      return {
        resposta: `Na cultura de ${cNome}, esses sintomas costumam ser de ${pragaEncontrada.nome}. ${pragaEncontrada.sintomas} Para resolver de forma caseira e segura: ${pragaEncontrada.solucao_caseira}. Evite inseticidas químicos para não contaminar a sua horta.`,
        fonte: "base_agronomica",
        proxima_acao: "Inspecione a parte de baixo das folhas e aplique a solução caseira no fim da tarde.",
      };
    }
  }

  // Folhas amarelas ou manchas
  if (texto.includes("amarel") || texto.includes("mancha") || texto.includes("seca")) {
    return {
      resposta: `Folhas amareladas em ${cNome} costumam acontecer por dois motivos comuns: excesso de água (a terra fica encharcada e sufoca as raízes) ou falta de alimento na terra (nutrientes como nitrogênio). Se as folhas velhas de baixo amarelaram primeiro, a planta pode estar precisando de adubo. Se a planta inteira murchar com terra molhada, é água demais.`,
      fonte: "base_agronomica",
      proxima_acao: "Faça o teste do dedo na terra: só regue se os primeiros 2 cm estiverem secos.",
    };
  }

  // Rega e água
  if (texto.includes("regar") || texto.includes("água") || texto.includes("agua")) {
    const frequencia = cultura?.agua === "pouca" ? "2 vezes na semana" : "1 vez ao dia nas horas frescas";
    return {
      resposta: `Para ${cNome}, a recomendação é manter a umidade ${cultura?.agua ?? "regular"}. A melhor técnica para iniciantes é o teste do dedo: encoste na terra; se sair sujo e úmido, espere; se sair seco, regue diretamente na base sem molhar as folhas. Regue cerca de ${frequencia}.`,
      fonte: "base_agronomica",
      proxima_acao: "Coloque o dedo na terra agora para checar a umidade da base.",
    };
  }

  // Colheita e ponto ideal
  if (texto.includes("colher") || texto.includes("colheita") || texto.includes("madur") || texto.includes("ponto")) {
    const ponto = cultura?.ponto_de_colheita ?? "quando a folhagem estiver viçosa ou os frutos estiverem com cor viva e firmeza.";
    return {
      resposta: `O ponto ideal de colheita para ${cNome} é: ${ponto} Lembre-se de colher sempre nas horas mais frescas do dia com uma tesoura limpa.`,
      fonte: "base_agronomica",
      proxima_acao: "Verifique se sua planta já atingiu o tamanho e coloração descritos para colheita.",
    };
  }

  // Sol e luminosidade
  if (texto.includes("sol") || texto.includes("sombra") || texto.includes("luz")) {
    const sol = cultura?.sol_horas_min ?? 5;
    return {
      resposta: `${cNome} precisa de pelo menos ${sol} horas de sol direto por dia para crescer forte e produzir bem. Se ficar apenas na sombra ou claridade indireta, a planta vai esticar os caules finos em busca de luz e ficar fraca (processo chamado estiolamento).`,
      fonte: "base_agronomica",
      proxima_acao: "Mude o vaso para o ponto mais ensolarado da sua casa ou varanda.",
    };
  }

  // Pragas gerais / receitas caseiras
  if (texto.includes("inseto") || texto.includes("praga") || texto.includes("pulgao") || texto.includes("lagarta") || texto.includes("cochonilha")) {
    return {
      resposta: `Para afastar insetos com segurança, a receita caseira recomendada pela Embrapa é simples: misture 500 ml de água com 1 colher de chá de detergente neutro ou sabão de coco. Borrife somente no final da tarde diretamente sobre os insetos, nunca sob sol forte.`,
      fonte: "base_agronomica",
      proxima_acao: "Borrife a solução de sabão neutro nas partes afetadas ao entardecer.",
    };
  }

  // Adubação e terra
  if (texto.includes("adub") || texto.includes("terra") || texto.includes("comida") || texto.includes("nutriente")) {
    return {
      resposta: `Na horta de iniciante, a adubação orgânica simples é a mais segura. Misture uma colher de sopa de húmus de minhoca ou composto orgânico ao redor do caule a cada 15 a 20 dias, regando em seguida para a planta absorver.`,
      fonte: "base_agronomica",
      proxima_acao: "Adicione uma camada fina de húmus de minhoca na terra superficial.",
    };
  }

  // Fase atual, ciclo e tarefas do dia
  if (texto.includes("fase") || texto.includes("etapa") || texto.includes("tarefa") || texto.includes("fazer hoje")) {
    const faseInfo = input.fase_atual
      ? `na fase de ${input.fase_atual} (dia ${input.dias_desde_plantio ?? 0} de cultivo)`
      : `em pleno desenvolvimento (ciclo total de ${cultura?.dias_ate_colheita[0] ?? 30} a ${cultura?.dias_ate_colheita[1] ?? 60} dias)`;
    const primeiraTarefa = input.tarefas_pendentes?.[0];
    return {
      resposta: `No momento, ${cNome} está ${faseInfo}. ${
        primeiraTarefa
          ? `Sua principal tarefa pendente hoje é: ${primeiraTarefa}.`
          : "As tarefas principais de hoje já estão em dia!"
      }`,
      fonte: "base_agronomica",
      proxima_acao:
        primeiraTarefa ??
        "Verifique a umidade da terra e observe o surgimento de folhas novas.",
    };
  }

  // Resposta padrão amigável
  return {
    resposta: `Ótima pergunta sobre ${cNome}! Para que ela se desenvolva com vigor, garanta três pilares básicos: terra fofa e bem drenada (vaso com furos no fundo), sol direto na medida certa (${cultura?.sol_horas_min ?? 4}h ou mais) e regas regulares sem encharcar.`,
    fonte: "base_agronomica",
    proxima_acao:
      input.tarefas_pendentes?.[0] ??
      "Observe as folhas e sinta a umidade da terra para acompanhar a evolução hoje.",
  };
}

export async function processarPerguntaAssistente(
  input: InputAssistente
): Promise<RespostaAssistente> {
  const cultura = culturas.find(
    (c) => c.id === input.cultura_id || c.nome.toLowerCase() === input.cultura_nome?.toLowerCase()
  );

  const ollamaUrl = process.env.OLLAMA_BASE_URL || "http://localhost:11434";
  const modeloGemma = process.env.GEMMA_MODEL || "gemma4";

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 2500);

    const response = await fetch(`${ollamaUrl}/api/chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: modeloGemma,
        stream: false,
        messages: [
          { role: "system", content: montarPromptSistema(input, cultura) },
          { role: "user", content: input.mensagem },
        ],
      }),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (response.ok) {
      const data = (await response.json()) as { message?: { content?: string } };
      if (data.message?.content?.trim()) {
        return {
          resposta: data.message.content.trim(),
          fonte: "gemma",
          proxima_acao: "Siga a orientação da resposta e continue acompanhando seu cultivo no app.",
        };
      }
    }
  } catch {
    // Ollama offline ou indisponível: segue silenciosamente para a base agronômica local
  }

  return gerarRespostaAgronomicaLocal(input, cultura);
}
