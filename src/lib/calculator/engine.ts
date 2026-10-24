import { Cultura } from "@/lib/recommendation/types";

export interface InputCalculadora {
  modo: "vaso" | "canteiro";
  vaso_litros?: number;
  canteiro_m2?: number;
}

export interface ResultadoCalculadora {
  quantidade_plantas: number;
  volume_substrato_litros: number;
  espacamento_sugerido_cm: number;
  estimativa_producao: string;
  economia_estimada_reais: number;
  dica_distribuicao: string;
}

const PRECOS_MEDIOS_MERCADO: Record<string, { preco_unitario: number; unidade: string }> = {
  alface: { preco_unitario: 4.5, unidade: "pé" },
  rucula: { preco_unitario: 4.0, unidade: "maço" },
  "tomate-cereja": { preco_unitario: 9.0, unidade: "bandeja 300g" },
  coentro: { preco_unitario: 3.5, unidade: "maço" },
  cebolinha: { preco_unitario: 3.5, unidade: "maço" },
  rabanete: { preco_unitario: 5.0, unidade: "maço" },
  manjericao: { preco_unitario: 4.5, unidade: "maço" },
  "feijao-de-corda": { preco_unitario: 12.0, unidade: "kg" },
  cenoura: { preco_unitario: 6.0, unidade: "kg" },
  pimenta: { preco_unitario: 6.0, unidade: "bandeja" },
  quiabo: { preco_unitario: 8.0, unidade: "kg" },
  maxixe: { preco_unitario: 7.0, unidade: "kg" },
  milho: { preco_unitario: 3.0, unidade: "espiga" },
  macaxeira: { preco_unitario: 6.5, unidade: "kg" },
  "batata-doce": { preco_unitario: 5.5, unidade: "kg" },
};

export function calcularEspacoPlantio(
  cultura: Cultura,
  input: InputCalculadora
): ResultadoCalculadora {
  const precoBase = PRECOS_MEDIOS_MERCADO[cultura.id] ?? { preco_unitario: 5.0, unidade: "unidade" };

  if (input.modo === "vaso") {
    const litros = Math.max(1, input.vaso_litros ?? cultura.espaco.vaso_litros_min ?? 5);
    const litrosPorPlanta = Math.max(2, cultura.espaco.vaso_litros_min ?? 4);
    const qtd = Math.max(1, Math.floor(litros / litrosPorPlanta));
    const economia = qtd * precoBase.preco_unitario * 2;

    return {
      quantidade_plantas: qtd,
      volume_substrato_litros: litros,
      espacamento_sugerido_cm: Math.round(Math.sqrt(cultura.espaco.espaco_m2_por_planta * 10000)),
      estimativa_producao: `~${qtd} a ${qtd * 2} colheitas de ${cultura.nome}`,
      economia_estimada_reais: Math.round(economia),
      dica_distribuicao:
        qtd === 1
          ? `Para um vaso de ${litros}L, cultive 1 planta no centro para dar espaço livre para as raízes se desenvolverem.`
          : `Distribua as ${qtd} mudas mantendo pelo menos 15 a 20 cm de distância entre elas no vaso.`,
    };
  }

  // Modo canteiro / quintal
  const m2 = Math.max(0.1, input.canteiro_m2 ?? 1);
  const espacoPorPlanta = Math.max(0.04, cultura.espaco.espaco_m2_por_planta);
  const qtd = Math.max(1, Math.floor(m2 / espacoPorPlanta));
  const volumeTerra = Math.round(m2 * 200); // 20 cm de profundidade média = 200 L por m²
  const economia = qtd * precoBase.preco_unitario * 1.5;

  return {
    quantidade_plantas: qtd,
    volume_substrato_litros: volumeTerra,
    espacamento_sugerido_cm: Math.round(Math.sqrt(cultura.espaco.espaco_m2_por_planta * 10000)),
    estimativa_producao: `~${qtd} plantas produzindo ao longo da safra`,
    economia_estimada_reais: Math.round(economia),
    dica_distribuicao: `Em ${m2} m², posicione as mudas em linhas com cerca de ${Math.round(
      Math.sqrt(espacoPorPlanta * 10000)
    )} cm de intervalo para garantir aeração.`,
  };
}
