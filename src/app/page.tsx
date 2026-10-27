"use client";

import { useSearchParams } from "next/navigation";
import { Suspense, useState, useSyncExternalStore } from "react";
import { AbaAssistente } from "@/components/AbaAssistente";
import { AbaHoje } from "@/components/AbaHoje";
import { AbaPlantar } from "@/components/AbaPlantar";
import { AbaPlantios } from "@/components/AbaPlantios";
import { ModalDiagnosticoVisual } from "@/components/ModalDiagnosticoVisual";
import { OnboardingModal } from "@/components/OnboardingModal";
import culturasData from "@/data/culturas.json";
import {
  carregarPlantiosStorage,
  salvarPlantiosStorage,
} from "@/lib/plantios/service";
import { PlantioAtivo } from "@/lib/plantios/types";
import { gerarRecomendacoes } from "@/lib/recommendation/engine";
import { Cultura, InputRecomendacao, TipoEspaco } from "@/lib/recommendation/types";
import { LocalizacaoCidade } from "@/lib/weather/types";

const culturas = culturasData as Cultura[];
type AbaAtiva = "hoje" | "plantar" | "plantios" | "assistente";

const assinarNada = () => () => {};

function LeitorParametroAba({ onAbaUrl }: { onAbaUrl: (aba: AbaAtiva) => void }) {
  const searchParams = useSearchParams();
  const abaParam = searchParams.get("aba") as AbaAtiva | null;
  const [ultimaAbaUrl, setUltimaAbaUrl] = useState<string | null>(null);

  if (
    abaParam &&
    abaParam !== ultimaAbaUrl &&
    ["hoje", "plantar", "plantios", "assistente"].includes(abaParam)
  ) {
    setUltimaAbaUrl(abaParam);
    onAbaUrl(abaParam);
  }

  return null;
}

export default function Home() {
  const noCliente = useSyncExternalStore(assinarNada, () => true, () => false);

  const [plantios, setPlantios] = useState<PlantioAtivo[]>(() =>
    carregarPlantiosStorage()
  );

  const [abaAtiva, setAbaAtiva] = useState<AbaAtiva>(() => {
    const salvos = carregarPlantiosStorage();
    return salvos.filter((p) => p.status === "ativo").length > 0 ? "hoje" : "plantar";
  });

  const [cidadeNome, setCidadeNome] = useState<string | undefined>();
  const [climaAtual, setClimaAtual] = useState<{
    temperatura_c: number;
    chovendo?: boolean;
  } | undefined>();
  const [diagnosticoAberto, setDiagnosticoAberto] = useState(false);
  const [onboardingAberto, setOnboardingAberto] = useState<boolean>(() => {
    if (typeof window === "undefined") return false;
    return (
      localStorage.getItem("plantio_onboarding_concluido") !== "true" &&
      carregarPlantiosStorage().length === 0
    );
  });

  const plantiosVisiveis = noCliente ? plantios : [];
  const abaVisivel: AbaAtiva = noCliente ? abaAtiva : "plantar";
  const onboardingVisivel = noCliente && onboardingAberto;

  const mesAtual = new Date().getMonth() + 1;
  const [input, setInput] = useState<InputRecomendacao>({
    mes: mesAtual,
    tipo_espaco: "vaso",
    sol_horas: 4,
    temperatura_media_c: 24,
    tem_agua_facil: true,
  });

  const atualizarPlantios = (novos: PlantioAtivo[]) => {
    setPlantios(novos);
    salvarPlantiosStorage(novos);
  };

  const handleAlternarTarefa = (tarefaId: string, plantioId: string) => {
    const atualizados = plantios.map((p) => {
      if (p.id !== plantioId) return p;
      const concluidaAtual = Boolean(p.tarefas_concluidas[tarefaId]);
      return {
        ...p,
        tarefas_concluidas: {
          ...p.tarefas_concluidas,
          [tarefaId]: !concluidaAtual,
        },
      };
    });
    atualizarPlantios(atualizados);
  };

  const handleAdicionarNota = (
    plantioId: string,
    texto: string,
    fotoUrl?: string
  ) => {
    const atualizados = plantios.map((p) => {
      if (p.id !== plantioId) return p;
      return {
        ...p,
        diario: [
          {
            id: `nota_${p.diario.length + 1}_${Date.now()}`,
            data: new Date().toISOString(),
            texto,
            foto_url: fotoUrl,
          },
          ...p.diario,
        ],
      };
    });
    atualizarPlantios(atualizados);
  };

  const handleConcluirPlantio = (plantioId: string) => {
    const atualizados = plantios.map((p) =>
      p.id === plantioId ? { ...p, status: "colhido" as const } : p
    );
    atualizarPlantios(atualizados);
  };

  const handleSelecionarCidade = (cidade: LocalizacaoCidade) => {
    setCidadeNome(cidade.estado ? `${cidade.nome}, ${cidade.estado}` : cidade.nome);
    void (async () => {
      try {
        const res = await fetch(`/api/clima?lat=${cidade.latitude}&lon=${cidade.longitude}`);
        if (res.ok) {
          const data = await res.json();
          if (data.clima) {
            setClimaAtual({
              temperatura_c: data.clima.temperatura_c,
              chovendo: Boolean(data.clima.chovendo),
            });
            setInput((prev) => ({
              ...prev,
              temperatura_media_c: data.clima.temperatura_c,
            }));
          }
        }
      } catch {
        // Silencioso
      }
    })();
  };

  const handleConcluirOnboarding = (dados: {
    espaco: TipoEspaco;
    sol_horas: number;
    tem_agua_facil: boolean;
    cidade?: LocalizacaoCidade;
  }) => {
    setInput((prev) => ({
      ...prev,
      tipo_espaco: dados.espaco,
      sol_horas: dados.sol_horas,
      tem_agua_facil: dados.tem_agua_facil,
    }));

    if (dados.cidade) {
      handleSelecionarCidade(dados.cidade);
    }

    if (typeof window !== "undefined") {
      localStorage.setItem("plantio_onboarding_concluido", "true");
    }
    setOnboardingAberto(false);
    setAbaAtiva("plantar");
  };

  const recomendacoes = gerarRecomendacoes(culturas, input);

  return (
    <div className="min-h-screen bg-[#fcfbfa] text-[#1f291e] flex flex-col pb-24">
      <Suspense fallback={null}>
        <LeitorParametroAba onAbaUrl={setAbaAtiva} />
      </Suspense>

      {/* Cabeçalho */}
      <header className="bg-[#244227] text-white py-4 px-4 shadow-sm sticky top-0 z-20">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-2xl" role="img" aria-label="Planta">
              🌱
            </span>
            <div>
              <h1 className="text-lg sm:text-xl font-bold tracking-tight">Plantio Fácil</h1>
              <p className="text-[11px] text-[#d4e4d5]">Do zero até a colheita no seu espaço</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {cidadeNome && (
              <span className="text-[11px] bg-[#1a301c] px-2.5 py-1 rounded-full text-[#d4e4d5] hidden sm:inline">
                📍 {cidadeNome}
              </span>
            )}
            <button
              type="button"
              onClick={() => setOnboardingAberto(true)}
              className="text-xs bg-[#1a301c] hover:bg-[#132415] px-2.5 py-1.5 rounded-xl text-[#c7dfc9] font-medium flex items-center gap-1 transition-colors"
            >
              <span>⚙️</span>
              <span>Meu Espaço</span>
            </button>
          </div>
        </div>
      </header>

      {/* Conteúdo Principal */}
      <main className="max-w-2xl mx-auto w-full px-4 py-6 flex-1">
        {abaVisivel === "hoje" && (
          <AbaHoje
            plantios={plantiosVisiveis}
            culturas={culturas}
            onAlternarTarefa={handleAlternarTarefa}
            onIrParaPlantar={() => setAbaAtiva("plantar")}
            onAbrirDiagnostico={() => setDiagnosticoAberto(true)}
            clima={climaAtual}
            cidadeNome={cidadeNome}
          />
        )}

        {abaVisivel === "plantar" && (
          <AbaPlantar
            culturas={culturas}
            recomendacoes={recomendacoes}
            input={input}
            onInputChange={setInput}
            cidadeSelecionada={cidadeNome}
            onSelecionarCidade={handleSelecionarCidade}
          />
        )}

        {abaVisivel === "plantios" && (
          <AbaPlantios
            plantios={plantiosVisiveis}
            culturas={culturas}
            onAdicionarNota={handleAdicionarNota}
            onConcluirPlantio={handleConcluirPlantio}
            onRestaurarBackup={atualizarPlantios}
            onIrParaPlantar={() => setAbaAtiva("plantar")}
          />
        )}

        {abaVisivel === "assistente" && (
          <AbaAssistente
            plantios={plantiosVisiveis}
            culturas={culturas}
            cidadeNome={cidadeNome}
            onAbrirDiagnostico={() => setDiagnosticoAberto(true)}
          />
        )}
      </main>

      {/* Modais inovadores */}
      <OnboardingModal
        aberto={onboardingVisivel}
        onConcluir={handleConcluirOnboarding}
        onFechar={() => setOnboardingAberto(false)}
      />

      <ModalDiagnosticoVisual
        aberto={diagnosticoAberto}
        onFechar={() => setDiagnosticoAberto(false)}
        plantiosAtivos={plantiosVisiveis.filter((p) => p.status === "ativo")}
        onAdicionarAoDiario={handleAdicionarNota}
      />

      {/* Navegação Inferior Fixa */}
      <nav
        aria-label="Navegação principal do app"
        className="fixed bottom-0 left-0 right-0 bg-white border-t border-[#e8e4df] py-1.5 px-3 shadow-lg z-30"
      >
        <div className="max-w-2xl mx-auto grid grid-cols-4 gap-1 text-center">
          {[
            { id: "hoje", icon: "📅", label: "Hoje" },
            { id: "plantar", icon: "🌱", label: "Plantar" },
            { id: "plantios", icon: "🌿", label: "Minhas Plantas" },
            { id: "assistente", icon: "💬", label: "Assistente" },
          ].map((aba) => (
            <button
              key={aba.id}
              type="button"
              onClick={() => setAbaAtiva(aba.id as AbaAtiva)}
              className={`flex flex-col items-center justify-center min-h-[48px] rounded-xl transition-colors ${
                abaVisivel === aba.id
                  ? "text-[#244227] font-bold bg-[#f1f6f1]"
                  : "text-[#706c66] hover:text-[#244227]"
              }`}
            >
              <span className="text-lg leading-none">{aba.icon}</span>
              <span className="text-[11px] mt-1">{aba.label}</span>
            </button>
          ))}
        </div>
      </nav>
    </div>
  );
}
