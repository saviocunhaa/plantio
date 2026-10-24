import { DiagnosticoResultado, SintomaVisual } from "./types";

export interface InputDiagnostico {
  sintoma: SintomaVisual;
  cultura_id?: string;
  cultura_nome?: string;
  foto_url?: string;
}

const TABELA_DIAGNOSTICOS: Record<SintomaVisual, DiagnosticoResultado> = {
  folhas_amareladas: {
    id: "diag_amarelamento",
    nome_problema: "Amarelamento Foliar (Clorose)",
    gravidade: "moderada",
    causa_provavel:
      "Geralmente causada por terra encharcada (as raízes ficam sem oxigênio) ou carência de nitrogênio.",
    solucao_caseira:
      "Faça o teste do dedo e só regue se os primeiros 2 cm de solo estiverem secos. Adicione 1 a 2 colheres de sopa de húmus de minhoca ou composto orgânico na superfície da terra.",
    como_prevenir:
      "Garanta que o vaso tenha orifícios desobstruídos e camada de drenagem no fundo com pedriscos ou argila expandida.",
    proxima_acao:
      "Suspenda a rega até a superfície secar e adube levemente com húmus de minhoca.",
  },
  folhas_murchas: {
    id: "diag_murcha",
    nome_problema: "Murcha por Estresse Hídrico ou Calor",
    gravidade: "moderada",
    causa_provavel:
      "Falta de umidade na terra sob sol forte, ou raízes apodrecidas por água parada.",
    solucao_caseira:
      "Se a terra estiver seca e quente, leve a planta para a sombra e regue suavemente na base até hidratar. Se a terra já estiver empapada, o problema é asfixia radicular.",
    como_prevenir:
      "Faça cobertura morta na terra com folhas secas picadas ou serragem para reter a umidade natural do solo.",
    proxima_acao:
      "Regue abundantemente se a terra estiver ressecada, ou mude para local fresco.",
  },
  furos_folhas: {
    id: "diag_lagartas",
    nome_problema: "Ataque de Lagartas ou Besouros Desfolhadores",
    gravidade: "moderada",
    causa_provavel:
      "Pequenas lagartas verdes ou escuras que se alimentam à noite ou nas primeiras horas da manhã.",
    solucao_caseira:
      "Catação manual das lagartas pela manhã. Borrife infusão fria de casca de alho e sabão neutro (1 dente de alho amassado + 500 ml de água + 3 gotas de detergente neutro).",
    como_prevenir:
      "Plante mudas companheiras aromáticas ao lado, como manjericão e alecrim, que repelem insetos voadores.",
    proxima_acao:
      "Inspecione a parte inferior das folhas e retire manualmente as lagartas encontradas.",
  },
  pontos_brancos_algodao: {
    id: "diag_cochonilha",
    nome_problema: "Infestação de Cochonilhas",
    gravidade: "alta",
    causa_provavel:
      "Insetos sugadores que criam uma cera branca semelhante a algodão nos caules e nós da planta.",
    solucao_caseira:
      "Limpe as partes afetadas com cotonete ou pano embebido em solução de água morna com sabão de coco neutro e álcool 70% (1 colher de chá por litro).",
    como_prevenir:
      "Evite plantas sufocadas em locais sem circulação de ar e com sombra excessiva.",
    proxima_acao:
      "Remova o algodão branco com sabão de coco neutro no final da tarde.",
  },
  pontos_pretos_amarelos: {
    id: "diag_pulgao",
    nome_problema: "Pulgões ou Fungos Oportunistas",
    gravidade: "moderada",
    causa_provavel:
      "Colônias de pulgões sugadores agrupados nas brotações tenras, atraindo formigas e fumagina.",
    solucao_caseira:
      "Pulverize calda de sabão neutro: 1 colher de sopa de detergente ou sabão de coco ralado em 1 litro de água. Aplique a cada 3 dias no fim da tarde.",
    como_prevenir:
      "Controle as formigas doceiras e preserve joaninhas, que são predadoras naturais vorazes de pulgões.",
    proxima_acao:
      "Borrife água com detergente neutro nas colônias ao entardecer.",
  },
  teias_pequenas: {
    id: "diag_acaro",
    nome_problema: "Ácaros-rajados (Aranha Vermelha)",
    gravidade: "alta",
    causa_provavel:
      "Ácaros microscópicos que se multiplicam em clima seco e quente, formando teias muito finas no verso da folha.",
    solucao_caseira:
      "Aumente a umidade borrifando água limpa nas folhas e aplique calda de óleo de neem vegetal diluído (0,5%) ou chá de camomila frio.",
    como_prevenir:
      "Mantenha boa ventilação e umidade do ar ao redor dos vasos em períodos quentes e secos.",
    proxima_acao:
      "Borrife água na parte de trás das folhas para quebrar o ciclo das teias.",
  },
  bordas_queimadas: {
    id: "diag_queima_bordas",
    nome_problema: "Queima de Bordas por Excesso de Sol ou Salinização",
    gravidade: "baixa",
    causa_provavel:
      "Vento seco, sol escaldante repentino em plantas não aclimatadas ou excesso de adubo químico forte.",
    solucao_caseira:
      "Regue a terra abundantemente para lavar possíveis excessos de sais acumulados e ofereça sombra filtrada nas horas do meio-dia (11h às 14h).",
    como_prevenir:
      "Faça a adaptação ao sol gradualmente ao mudar a planta de lugar.",
    proxima_acao:
      "Proteja a planta do sol forte do meio-dia por 3 a 5 dias.",
  },
  crescimento_estiolado: {
    id: "diag_estiolamento",
    nome_problema: "Estiolamento (Falta de Luz Solar Direta)",
    gravidade: "moderada",
    causa_provavel:
      "Caules finos, compridos e pálidos que se esticam desesperadamente em busca de claridade.",
    solucao_caseira:
      "Transfira a planta para um local que receba mais horas de luz solar direta diária. Chegue um pouco mais de terra fofa ao redor do caule frágil para sustentação.",
    como_prevenir:
      "Respeite o mínimo de 4 a 6 horas de sol direto exigido pela maioria das hortaliças.",
    proxima_acao:
      "Mude o vaso para a janela ou varanda com maior incidência de sol.",
  },
};

export function diagnosticarSintomaVisual(input: InputDiagnostico): DiagnosticoResultado {
  const base = TABELA_DIAGNOSTICOS[input.sintoma];
  if (!base) {
    return TABELA_DIAGNOSTICOS.folhas_amareladas;
  }

  if (input.cultura_nome) {
    return {
      ...base,
      nome_problema: `${base.nome_problema} em ${input.cultura_nome}`,
    };
  }

  return base;
}
