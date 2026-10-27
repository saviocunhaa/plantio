import { z } from "zod";
import { Cultura, FaseCultura } from "../recommendation/types";
import { PlantioAtivo, PlantioAtivoSchema } from "./types";

export function calcularDiasPlantio(
  dataPlantio: string,
  dataAtual: Date = new Date()
): number {
  const inicio = new Date(dataPlantio);
  const diffTime = Math.max(0, dataAtual.getTime() - inicio.getTime());
  return Math.floor(diffTime / (1000 * 60 * 60 * 24));
}

export function obterFaseAtual(
  cultura: Cultura,
  diasPlantio: number
): FaseCultura | null {
  if (!cultura.fases || cultura.fases.length === 0) return null;

  for (const fase of cultura.fases) {
    if (diasPlantio >= fase.dias_inicio && diasPlantio <= fase.dias_fim) {
      return fase;
    }
  }

  return cultura.fases[cultura.fases.length - 1];
}

export interface TarefaHoje {
  id: string;
  plantioId: string;
  culturaNome: string;
  faseNome: string;
  titulo: string;
  comoFazer: string;
  concluida: boolean;
}

export function gerarTarefasHoje(
  plantios: PlantioAtivo[],
  culturas: Cultura[],
  dataHojeStr: string = new Date().toISOString().split("T")[0]
): TarefaHoje[] {
  const tarefas: TarefaHoje[] = [];
  const culturasMap = new Map(culturas.map((c) => [c.id, c]));

  for (const plantio of plantios) {
    if (plantio.status !== "ativo") continue;

    const cultura = culturasMap.get(plantio.cultura_id);
    if (!cultura) continue;

    const dias = calcularDiasPlantio(plantio.data_plantio);
    const fase = obterFaseAtual(cultura, dias);
    if (!fase) continue;

    for (let i = 0; i < fase.tarefas.length; i++) {
      const tarefa = fase.tarefas[i];
      const tarefaChave = `${plantio.id}_${fase.id}_${i}_${dataHojeStr}`;
      const concluida = Boolean(plantio.tarefas_concluidas[tarefaChave]);

      tarefas.push({
        id: tarefaChave,
        plantioId: plantio.id,
        culturaNome: plantio.cultura_nome,
        faseNome: fase.nome,
        titulo: tarefa.titulo,
        comoFazer: tarefa.como_fazer,
        concluida,
      });
    }
  }

  return tarefas;
}

const STORAGE_KEY = "plantio_facil_plantios_v1";

export function carregarPlantiosStorage(): PlantioAtivo[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const data = JSON.parse(raw);
    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
}

export function salvarPlantiosStorage(plantios: PlantioAtivo[]): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(plantios));
  } catch {
    // Modo de navegação anônima ou cota atingida
  }
}

const BackupPlantiosSchema = z.array(PlantioAtivoSchema);

export function importarBackupPlantios(
  jsonBruto: string,
  atuais: PlantioAtivo[] = []
): { sucesso: true; plantios: PlantioAtivo[]; importados: number } | { sucesso: false; erro: string } {
  try {
    const parsedJson = JSON.parse(jsonBruto) as unknown;
    const validado = BackupPlantiosSchema.safeParse(parsedJson);
    if (!validado.success) {
      return {
        sucesso: false,
        erro: "Arquivo de backup inválido ou em formato incompatível.",
      };
    }

    const mapa = new Map<string, PlantioAtivo>();
    for (const item of atuais) {
      mapa.set(item.id, item);
    }
    for (const item of validado.data) {
      mapa.set(item.id, item);
    }

    return {
      sucesso: true,
      plantios: Array.from(mapa.values()),
      importados: validado.data.length,
    };
  } catch {
    return {
      sucesso: false,
      erro: "Não foi possível ler o arquivo JSON selecionado.",
    };
  }
}
