import { z } from "zod";
import { CategoriaCultura, Cultura, FaseCultura } from "../recommendation/types";
import { PlantioAtivo, PlantioAtivoSchema } from "./types";

function sugerirRotacaoSolo(categoria: CategoriaCultura): string {
  const rotacoes: Record<CategoriaCultura, string> = {
    folha: "raízes (cenoura, rabanete) ou leguminosas (feijão-de-corda) para repor nutrientes",
    fruto: "folhosas (alface, rúcula) ou leguminosas para recuperar o nitrogênio da terra",
    raiz: "folhosas ou ervas aromáticas (coentro, cebolinha), que exigem menos das camadas fundas",
    leguminosa: "frutos ou folhosas, aproveitando o nitrogênio fixado naturalmente no solo",
    erva: "raízes ou leguminosas para variar a estrutura radicular do canteiro/vaso",
  };
  return rotacoes[categoria];
}

export function gerarJornada11Fases(cultura: Cultura): FaseCultura[] {
  const [germMin, rawGermFim] = cultura.dias_germinacao;
  const germFim = Math.max(2, rawGermFim);
  const colheitaIni = Math.max(germFim + 8, cultura.dias_ate_colheita[0]);
  const colheitaFim = Math.max(colheitaIni + 5, cultura.dias_ate_colheita[1]);
  const janelaDesenv = colheitaIni - germFim - 1;
  const dCrescIni = germFim + Math.max(2, Math.floor(janelaDesenv * 0.25));
  const dCrescVeg = germFim + Math.max(4, Math.floor(janelaDesenv * 0.55));
  const dFloracao = germFim + Math.max(6, Math.floor(janelaDesenv * 0.8));

  const faseMeio = cultura.fases[Math.min(1, Math.max(0, cultura.fases.length - 1))];
  const praga = cultura.pragas_comuns[0];
  const temFlorFruto = cultura.categoria === "fruto" || cultura.categoria === "leguminosa";
  const infoVaso = cultura.espaco.permite_vaso ? `vaso de no mínimo ${cultura.espaco.vaso_litros_min ?? 5}L ou ` : "";
  const materiais = cultura.materiais_iniciais.slice(0, 2).join(", ") || "terra vegetal fofa e composto orgânico";

  return [
    {
      id: "planejamento",
      nome: "1. Planejamento",
      dias_inicio: 0,
      dias_fim: 1,
      tarefas: [{
        titulo: "Escolher local e conferir época",
        como_fazer: `Reserve um ponto com pelo menos ${cultura.sol_horas_min}h de sol por dia e ${infoVaso}${cultura.espaco.espaco_m2_por_planta} m² por planta.`,
        frequencia_dias: 1,
      }],
      o_que_observar: "Incidência direta de luz solar e facilidade de acesso à água.",
    },
    {
      id: "preparacao",
      nome: "2. Preparação do Solo e Materiais",
      dias_inicio: 1,
      dias_fim: 2,
      tarefas: [{
        titulo: "Preparar vaso ou canteiro com drenagem",
        como_fazer: `Separe: ${materiais}. Garanta furos de saída de água no fundo.`,
        frequencia_dias: 1,
      }],
      o_que_observar: "Terra solta, úmida sem empoçar e enriquecida com adubo orgânico.",
    },
    {
      id: "semeadura",
      nome: "3. Semeadura ou Plantio de Muda",
      dias_inicio: 2,
      dias_fim: 3,
      tarefas: [{
        titulo: "Realizar o plantio na profundidade certa",
        como_fazer: `${cultura.dica_iniciante} Plante sem compactar demais a terra sobre a semente ou raiz.`,
        frequencia_dias: 1,
      }],
      o_que_observar: "Sementes ou mudas firmes no substrato e primeira rega suave concluída.",
    },
    {
      id: "germinacao",
      nome: "4. Germinação",
      dias_inicio: 3,
      dias_fim: germFim,
      tarefas: [{
        titulo: "Manter superfície úmida sem encharcar",
        como_fazer: `Regue suavemente com borrifador (${cultura.agua}). Se nada nascer após ${germFim + 5} dias, replante sementes novas mais perto da superfície.`,
        frequencia_dias: 1,
      }],
      o_que_observar: `Primeiros brotinhos apontando na terra entre ${germMin} e ${germFim} dias.`,
    },
    {
      id: "crescimento_inicial",
      nome: "5. Crescimento Inicial",
      dias_inicio: germFim + 1,
      dias_fim: dCrescIni,
      tarefas: [{
        titulo: "Rega na base e desbaste das mudinhas",
        como_fazer: "Molhe apenas a terra ao redor do caule. Se nasceram várias plantas grudadas, mantenha a mais forte para ter espaço.",
        frequencia_dias: 1,
      }],
      o_que_observar: "Surgimento das primeiras folhas definitivas e caule ganhando firmeza.",
    },
    {
      id: "crescimento_vegetativo",
      nome: "6. Crescimento Vegetativo",
      dias_inicio: dCrescIni + 1,
      dias_fim: dCrescVeg,
      tarefas: [
        ...(faseMeio?.tarefas ?? []),
        {
          titulo: "Dar comida extra para a planta (adubação de cobertura)",
          como_fazer: "Espalhe uma colher de sopa de húmus de minhoca ao redor do pé e retire matinhos concorrentes.",
          frequencia_dias: 12,
        },
      ],
      o_que_observar: faseMeio?.o_que_observar ?? "Planta encorpando com folhas novas e raízes bem formadas.",
    },
    {
      id: "floracao_frutificacao",
      nome: temFlorFruto ? "7. Floração e Frutificação" : "7. Formação Plena (Pré-colheita)",
      dias_inicio: dCrescVeg + 1,
      dias_fim: dFloracao,
      tarefas: [{
        titulo: temFlorFruto ? "Proteger flores e reforçar nutrientes" : "Manter umidade regular para maciez",
        como_fazer: temFlorFruto
          ? "Regue diretamente no solo sem molhar as flores para favorecer a polinização e a formação dos frutos/vagens."
          : "Mantenha regas regulares nas horas frescas para evitar que a planta estresse ou floresça antes da hora.",
        frequencia_dias: 2,
      }],
      o_que_observar: temFlorFruto
        ? "Abertura das flores e surgimento dos primeiros frutos ou vagens verdes."
        : "Planta atingindo volume ideal de folhas ou engrossamento da raiz.",
    },
    {
      id: "manejo_pragas",
      nome: "8. Manejo de Pragas e Doenças",
      dias_inicio: dFloracao + 1,
      dias_fim: colheitaIni - 1,
      tarefas: [{
        titulo: "Inspeção preventiva das folhas",
        como_fazer: praga
          ? `Observe o verso das folhas contra ${praga.nome} (${praga.sintomas.toLowerCase()}). Solução caseira: ${praga.solucao_caseira}`
          : "Verifique manchas ou insetos nas folhas e aplique calda leve de água com sabão neutro no fim da tarde se necessário.",
        frequencia_dias: 3,
      }],
      o_que_observar: "Folhagem limpa e saudável sem uso de agrotóxicos.",
    },
    {
      id: "colheita",
      nome: "9. Colheita",
      dias_inicio: colheitaIni,
      dias_fim: colheitaFim,
      tarefas: [{
        titulo: "Colher no ponto ideal pela manhã",
        como_fazer: `${cultura.ponto_de_colheita} Use tesoura limpa ou colha manualmente nas horas mais frescas.`,
        frequencia_dias: 2,
      }],
      o_que_observar: cultura.ponto_de_colheita,
    },
    {
      id: "pos_colheita",
      nome: "10. Pós-colheita",
      dias_inicio: colheitaFim + 1,
      dias_fim: colheitaFim + 5,
      tarefas: [{
        titulo: "Armazenar, consumir e separar para replantio",
        como_fazer: "Higienize apenas na hora do consumo, guarde em local fresco e separe sementes ou mudas sadias se quiser iniciar novo ciclo.",
        frequencia_dias: 3,
      }],
      o_que_observar: "Aproveitamento integral da colheita sem desperdício.",
    },
    {
      id: "encerramento_ciclo",
      nome: "11. Encerramento do Ciclo e Rotação",
      dias_inicio: colheitaFim + 6,
      dias_fim: colheitaFim + 10,
      tarefas: [{
        titulo: "Descansar a terra e alternar a próxima cultura",
        como_fazer: `Retire raízes antigas para compostagem, adicione composto orgânico e faça rotação: após ${cultura.nome}, prefira plantar ${sugerirRotacaoSolo(cultura.categoria)}.`,
        frequencia_dias: 5,
      }],
      o_que_observar: "Solo renovado, solto e pronto para um novo ciclo produtivo.",
    },
  ];
}

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
