"use client";

import { useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import { AbaAssistente } from "@/components/AbaAssistente";
import { AbaHoje } from "@/components/AbaHoje";
import { AbaPlantar } from "@/components/AbaPlantar";
import { AbaPlantios } from "@/components/AbaPlantios";
import culturasData from "@/data/culturas.json";
import {
  carregarPlantiosStorage,
  salvarPlantiosStorage,
} from "@/lib/plantios/service";
import { PlantioAtivo } from "@/lib/plantios/types";
import { gerarRecomendacoes } from "@/lib/recommendation/engine";
import { Cultura, InputRecomendacao } from "@/lib/recommendation/types";
import { LocalizacaoCidade } from "@/lib/weather/types";

const culturas = culturasData as Cultura[];
type AbaAtiva = "hoje" | "plantar" | "plantios" | "assistente";

export default function Home() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-sm">Carregando Plantio Fácil...</div>}>
      <HomeConteudo />
    </Suspense>
  );
}

function HomeConteudo() {
  const searchParams = useSearchParams();
  const abaParam = searchParams.get("aba") as AbaAtiva | null;

  const [plantios, setPlantios] = useState<PlantioAtivo[]>(() =>
    carregarPlantiosStorage()
  );

  const [abaAtiva, setAbaAtiva] = useState<AbaAtiva>(() => {
    if (abaParam && ["hoje", "plantar", "plantios", "assistente"].includes(abaParam)) {
      return abaParam;
    }
    const salvos = carregarPlantiosStorage();
    return salvos.filter((p) => p.status === "ativo").length > 0 ? "hoje" : "plantar";
  });

  const [cidadeNome, setCidadeNome] = useState<string | undefined>();

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
  };

  const recomendacoes = gerarRecomendacoes(culturas, input);

  return (
    <div className="min-h-screen bg-[#fcfbfa] text-[#1f291e] flex flex-col pb-24">
      {/* Cabeçalho */}
      <header className="bg-[#244227] text-white py-5 px-4 shadow-sm sticky top-0 z-20">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-2xl" role="img" aria-label="Planta">
              🌱
            </span>
            <div>
              <h1 className="text-xl font-bold tracking-tight">Plantio Fácil</h1>
              <p className="text-xs text-[#d4e4d5]">Do zero até a colheita no seu espaço</p>
            </div>
          </div>
          {cidadeNome && (
            <span className="text-xs bg-[#1a301c] px-3 py-1 rounded-full text-[#d4e4d5]">
              📍 {cidadeNome}
            </span>
          )}
        </div>
      </header>

      {/* Conteúdo Principal */}
      <main className="max-w-2xl mx-auto w-full px-4 py-6 flex-1">
        {abaAtiva === "hoje" && (
          <AbaHoje
            plantios={plantios}
            culturas={culturas}
            onAlternarTarefa={handleAlternarTarefa}
            onIrParaPlantar={() => setAbaAtiva("plantar")}
          />
        )}

        {abaAtiva === "plantar" && (
          <AbaPlantar
            culturas={culturas}
            recomendacoes={recomendacoes}
            input={input}
            onInputChange={setInput}
            cidadeSelecionada={cidadeNome}
            onSelecionarCidade={handleSelecionarCidade}
          />
        )}

        {abaAtiva === "plantios" && (
          <AbaPlantios
            plantios={plantios}
            culturas={culturas}
            onAdicionarNota={handleAdicionarNota}
            onConcluirPlantio={handleConcluirPlantio}
            onIrParaPlantar={() => setAbaAtiva("plantar")}
          />
        )}

        {abaAtiva === "assistente" && (
          <AbaAssistente plantios={plantios} />
        )}
      </main>

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
                abaAtiva === aba.id
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
