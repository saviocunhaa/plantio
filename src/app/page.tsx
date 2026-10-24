"use client";

import { useId, useState } from "react";
import culturasData from "@/data/culturas.json";
import { gerarRecomendacoes } from "@/lib/recommendation/engine";
import {
  Cultura,
  InputRecomendacao,
  ItemRecomendado,
  StatusRecomendacao,
  TipoEspaco,
} from "@/lib/recommendation/types";

const culturas = culturasData as Cultura[];

export default function Home() {
  const espacoId = useId();
  const solId = useId();
  const mesId = useId();
  const tempId = useId();

  const mesAtual = new Date().getMonth() + 1;

  const [input, setInput] = useState<InputRecomendacao>({
    mes: mesAtual,
    tipo_espaco: "vaso",
    sol_horas: 4,
    temperatura_media_c: 24,
    tem_agua_facil: true,
  });

  const [filtroStatus, setFiltroStatus] = useState<string>("todos");
  const recomendacoes = gerarRecomendacoes(culturas, input);

  const filtradas = recomendacoes.filter((item) => {
    if (filtroStatus === "todos") return true;
    return item.status === filtroStatus;
  });

  return (
    <div className="min-h-screen bg-[#fcfbfa] text-[#1f291e] flex flex-col pb-24">
      {/* Cabeçalho */}
      <header className="bg-[#244227] text-white py-6 px-4 shadow-sm">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-2xl" role="img" aria-label="Planta">
                🌱
              </span>
              <h1 className="text-2xl font-bold tracking-tight">Plantio Fácil</h1>
            </div>
            <p className="text-sm text-[#d4e4d5] mt-1">
              Diga seu espaço e saiba exatamente o que plantar hoje.
            </p>
          </div>
        </div>
      </header>

      <main className="max-w-2xl mx-auto w-full px-4 py-6 space-y-6">
        {/* Painel de entrada e contexto */}
        <section
          aria-labelledby="filtro-titulo"
          className="bg-white rounded-2xl p-5 border border-[#e8e4df] shadow-xs space-y-4"
        >
          <h2 id="filtro-titulo" className="text-lg font-semibold text-[#1f291e]">
            Onde você vai plantar?
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor={espacoId} className="block text-sm font-medium mb-1.5">
                Tipo de Espaço
              </label>
              <select
                id={espacoId}
                value={input.tipo_espaco}
                onChange={(e) =>
                  setInput({ ...input, tipo_espaco: e.target.value as TipoEspaco })
                }
                className="w-full h-11 px-3.5 rounded-xl border border-[#cfc8bf] bg-white text-base focus:ring-2 focus:ring-[#244227] outline-hidden"
              >
                <option value="vaso">🪴 Vaso ou Jardineira (Casa/Apto)</option>
                <option value="quintal_pequeno">🏡 Quintal pequeno (até 20 m²)</option>
                <option value="terreno_medio">🌾 Canteiro / Terreno médio</option>
                <option value="terra_grande">🚜 Sítio ou Terra grande</option>
              </select>
            </div>

            <div>
              <label htmlFor={solId} className="block text-sm font-medium mb-1.5">
                Horas de Sol Diário
              </label>
              <select
                id={solId}
                value={input.sol_horas}
                onChange={(e) =>
                  setInput({ ...input, sol_horas: Number(e.target.value) })
                }
                className="w-full h-11 px-3.5 rounded-xl border border-[#cfc8bf] bg-white text-base focus:ring-2 focus:ring-[#244227] outline-hidden"
              >
                <option value={2}>Sombra (apenas claridade, ~2h)</option>
                <option value={4}>Meia-sombra (sol da manhã, ~4h)</option>
                <option value={6}>Sol moderado (cerca de 6h)</option>
                <option value={8}>Sol pleno (dia todo, 8h+)</option>
              </select>
            </div>

            <div>
              <label htmlFor={tempId} className="block text-sm font-medium mb-1.5">
                Temperatura Média Atual
              </label>
              <select
                id={tempId}
                value={input.temperatura_media_c}
                onChange={(e) =>
                  setInput({ ...input, temperatura_media_c: Number(e.target.value) })
                }
                className="w-full h-11 px-3.5 rounded-xl border border-[#cfc8bf] bg-white text-base focus:ring-2 focus:ring-[#244227] outline-hidden"
              >
                <option value={14}>Frio (&lt; 16°C)</option>
                <option value={20}>Ameno fresco (17°C a 22°C)</option>
                <option value={26}>Ameno quente (23°C a 28°C)</option>
                <option value={32}>Calor intenso (29°C+)</option>
              </select>
            </div>

            <div>
              <label htmlFor={mesId} className="block text-sm font-medium mb-1.5">
                Mês do Ano
              </label>
              <select
                id={mesId}
                value={input.mes}
                onChange={(e) => setInput({ ...input, mes: Number(e.target.value) })}
                className="w-full h-11 px-3.5 rounded-xl border border-[#cfc8bf] bg-white text-base focus:ring-2 focus:ring-[#244227] outline-hidden"
              >
                {[
                  "Janeiro",
                  "Fevereiro",
                  "Março",
                  "Abril",
                  "Maio",
                  "Junho",
                  "Julho",
                  "Agosto",
                  "Setembro",
                  "Outubro",
                  "Novembro",
                  "Dezembro",
                ].map((nome, i) => (
                  <option key={nome} value={i + 1}>
                    {nome}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </section>

        {/* Filtros rápidos de lista */}
        <div className="flex gap-2 overflow-x-auto pb-1 text-sm">
          {[
            { id: "todos", label: "Todas" },
            { id: "ideal_agora", label: "🌟 Ideal agora" },
            { id: "possivel", label: "🌱 Dá para plantar" },
            { id: "esperar", label: "⏳ Esperar" },
          ].map((f) => (
            <button
              key={f.id}
              type="button"
              onClick={() => setFiltroStatus(f.id)}
              className={`px-4 py-2 rounded-full font-medium whitespace-nowrap transition-colors min-h-[44px] ${
                filtroStatus === f.id
                  ? "bg-[#244227] text-white"
                  : "bg-white text-[#4a5848] border border-[#d9d4cc] hover:bg-[#f2efe9]"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Lista de Culturas */}
        <section aria-label="Culturas recomendadas" className="space-y-4">
          {filtradas.length === 0 ? (
            <div className="bg-white rounded-2xl p-8 text-center border border-[#e8e4df]">
              <p className="text-base text-[#615f5b]">
                Nenhuma cultura encontrada para este filtro.
              </p>
            </div>
          ) : (
            filtradas.map((item) => (
              <CardCultura key={item.cultura.id} item={item} />
            ))
          )}
        </section>
      </main>

      {/* Navegação Inferior Mobile */}
      <nav
        aria-label="Navegação principal"
        className="fixed bottom-0 left-0 right-0 bg-white border-t border-[#e8e4df] py-2 px-4 shadow-lg z-10"
      >
        <div className="max-w-2xl mx-auto grid grid-cols-4 gap-1 text-center">
          <button
            type="button"
            className="flex flex-col items-center justify-center min-h-[48px] text-[#787570] hover:text-[#244227]"
          >
            <span className="text-lg">📅</span>
            <span className="text-xs font-medium">Hoje</span>
          </button>
          <button
            type="button"
            className="flex flex-col items-center justify-center min-h-[48px] text-[#244227] font-semibold"
          >
            <span className="text-lg">🌱</span>
            <span className="text-xs">Plantar</span>
          </button>
          <button
            type="button"
            className="flex flex-col items-center justify-center min-h-[48px] text-[#787570] hover:text-[#244227]"
          >
            <span className="text-lg">🌿</span>
            <span className="text-xs font-medium">Plantas</span>
          </button>
          <button
            type="button"
            className="flex flex-col items-center justify-center min-h-[48px] text-[#787570] hover:text-[#244227]"
          >
            <span className="text-lg">💬</span>
            <span className="text-xs font-medium">Assistente</span>
          </button>
        </div>
      </nav>
    </div>
  );
}

function CardCultura({ item }: { item: ItemRecomendado }) {
  const { cultura, status, motivos, avisos } = item;

  const badges: Record<StatusRecomendacao, { bg: string; text: string; label: string }> = {
    ideal_agora: { bg: "bg-[#244227]", text: "text-white", label: "🌟 Ideal agora" },
    possivel: { bg: "bg-[#8f6d28]", text: "text-white", label: "🌱 Dá para plantar" },
    esperar: { bg: "bg-[#6b6762]", text: "text-white", label: "⏳ Melhor esperar" },
    nao_recomendado: {
      bg: "bg-[#8c2b2b]",
      text: "text-white",
      label: "⚠️ Não recomendado",
    },
  };

  const badge = badges[status];

  return (
    <article className="bg-white rounded-2xl p-5 border border-[#e8e4df] shadow-xs space-y-3">
      <div className="flex items-start justify-between gap-3">
        <div>
          <span className="text-xs uppercase tracking-wider font-semibold text-[#66635e]">
            {cultura.categoria}
          </span>
          <h3 className="text-xl font-bold text-[#1f291e]">{cultura.nome}</h3>
        </div>
        <span
          className={`px-3 py-1 rounded-full text-xs font-semibold ${badge.bg} ${badge.text}`}
        >
          {badge.label}
        </span>
      </div>

      <p className="text-sm text-[#474542]">{cultura.descricao_curta}</p>

      {/* Métricas rápidas */}
      <div className="grid grid-cols-3 gap-2 py-2 border-y border-[#f0ede8] text-center text-xs">
        <div>
          <span className="block text-[#7a7772]">Dificuldade</span>
          <span className="font-semibold text-[#1f291e]">
            {cultura.dificuldade === 1
              ? "Muito fácil"
              : cultura.dificuldade === 2
              ? "Fácil"
              : "Média"}
          </span>
        </div>
        <div>
          <span className="block text-[#7a7772]">Colheita em</span>
          <span className="font-semibold text-[#1f291e]">
            {cultura.dias_ate_colheita[0]}-{cultura.dias_ate_colheita[1]} dias
          </span>
        </div>
        <div>
          <span className="block text-[#7a7772]">Sol mínimo</span>
          <span className="font-semibold text-[#1f291e]">{cultura.sol_horas_min}h / dia</span>
        </div>
      </div>

      {/* Dica de ouro para iniciantes */}
      <div className="bg-[#f7f5f2] rounded-xl p-3 text-xs text-[#3b3a37]">
        <strong className="text-[#244227]">Dica prática: </strong>
        {cultura.dica_iniciante}
      </div>

      {/* Motivos ou Avisos */}
      {motivos.length > 0 && (
        <p className="text-xs text-[#2b4c2f]">
          ✓ {motivos[0]}
        </p>
      )}
      {avisos.length > 0 && (
        <p className="text-xs text-[#8c3f2b]">
          ℹ {avisos[0]}
        </p>
      )}

      {/* Ação */}
      <button
        type="button"
        className="w-full h-11 mt-1 rounded-xl bg-[#244227] text-white font-semibold text-sm hover:bg-[#1a301c] transition-colors flex items-center justify-center gap-2"
      >
        <span>Quero plantar {cultura.nome}</span>
        <span>→</span>
      </button>
    </article>
  );
}
