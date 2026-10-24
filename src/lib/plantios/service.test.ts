import { describe, expect, it } from "vitest";
import culturasData from "../../data/culturas.json";
import { Cultura } from "../recommendation/types";
import {
  calcularDiasPlantio,
  gerarTarefasHoje,
  obterFaseAtual,
} from "./service";
import { PlantioAtivo } from "./types";

const culturas = culturasData as Cultura[];

describe("Serviço de Gestão de Plantios e Tarefas", () => {
  it("calcula corretamente os dias corridos de um plantio", () => {
    const hoje = new Date("2026-10-23T12:00:00Z");
    const dataInicio = "2026-10-13T12:00:00Z"; // 10 dias atrás

    const dias = calcularDiasPlantio(dataInicio, hoje);
    expect(dias).toBe(10);
  });

  it("identifica a fase correta da alface com base nos dias corridos", () => {
    const alface = culturas.find((c) => c.id === "alface")!;

    // Dia 3 -> Semeadura (0 a 7 dias)
    const fase1 = obterFaseAtual(alface, 3);
    expect(fase1?.id).toBe("semeadura");

    // Dia 15 -> Crescimento das folhas (8 a 30 dias)
    const fase2 = obterFaseAtual(alface, 15);
    expect(fase2?.id).toBe("desenvolvimento");

    // Dia 35 -> Ponto de colheita (31 a 50 dias)
    const fase3 = obterFaseAtual(alface, 35);
    expect(fase3?.id).toBe("colheita");
  });

  it("gera tarefas do dia com status de conclusão", () => {
    const plantio: PlantioAtivo = {
      id: "plantio-1",
      cultura_id: "alface",
      cultura_nome: "Alface Crespa",
      tipo_espaco: "vaso",
      data_plantio: new Date().toISOString(),
      status: "ativo",
      diario: [],
      tarefas_concluidas: {},
    };

    const tarefas = gerarTarefasHoje([plantio], culturas, "2026-10-23");

    expect(tarefas.length).toBeGreaterThan(0);
    expect(tarefas[0].culturaNome).toBe("Alface Crespa");
    expect(tarefas[0].concluida).toBe(false);
  });
});
