import { describe, expect, it } from "vitest";
import culturasData from "../../data/culturas.json";
import { Cultura } from "../recommendation/types";
import {
  calcularDiasPlantio,
  gerarTarefasHoje,
  importarBackupPlantios,
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

  it("valida e importa backup JSON de plantios mesclando com os existentes", () => {
    const existente: PlantioAtivo = {
      id: "plantio-1",
      cultura_id: "alface",
      cultura_nome: "Alface Crespa",
      tipo_espaco: "vaso",
      data_plantio: "2026-10-10T12:00:00Z",
      status: "ativo",
      diario: [],
      tarefas_concluidas: {},
    };

    const jsonBackup = JSON.stringify([
      {
        id: "plantio-2",
        cultura_id: "coentro",
        cultura_nome: "Coentro",
        tipo_espaco: "vaso",
        data_plantio: "2026-10-15T12:00:00Z",
        status: "ativo",
        diario: [{ id: "n1", data: "2026-10-16T12:00:00Z", texto: "Semeado" }],
        tarefas_concluidas: {},
      },
    ]);

    const resultado = importarBackupPlantios(jsonBackup, [existente]);
    expect(resultado.sucesso).toBe(true);
    if (resultado.sucesso) {
      expect(resultado.importados).toBe(1);
      expect(resultado.plantios).toHaveLength(2);
      expect(resultado.plantios[1].cultura_nome).toBe("Coentro");
    }
  });

  it("rejeita backup JSON malformado ou fora do schema Zod", () => {
    const invalido = importarBackupPlantios('[{"id": 123, "invalido": true}]', []);
    expect(invalido.sucesso).toBe(false);

    const corrompido = importarBackupPlantios("{nao_eh_json", []);
    expect(corrompido.sucesso).toBe(false);
  });
});
