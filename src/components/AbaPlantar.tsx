"use client";

import Link from "next/link";
import { useId, useState } from "react";
import {
  Cultura,
  InputRecomendacao,
  ItemRecomendado,
  StatusRecomendacao,
  TipoEspaco,
} from "@/lib/recommendation/types";
import { LocalizacaoCidade } from "@/lib/weather/types";

interface AbaPlantarProps {
  culturas: Cultura[];
  recomendacoes: ItemRecomendado[];
  input: InputRecomendacao;
  onInputChange: (novoInput: InputRecomendacao) => void;
  cidadeSelecionada?: string;
  onSelecionarCidade: (cidade: LocalizacaoCidade) => void;
}

export function AbaPlantar({
  recomendacoes,
  input,
  onInputChange,
  cidadeSelecionada,
  onSelecionarCidade,
}: AbaPlantarProps) {
  const espacoId = useId();
  const solId = useId();
  const mesId = useId();
  const tempId = useId();
  const buscaId = useId();

  const [filtroStatus, setFiltroStatus] = useState<string>("todos");
  const [buscaCidade, setBuscaCidade] = useState("");
  const [cidadesSugeridas, setCidadesSugeridas] = useState<LocalizacaoCidade[]>([]);
  const [buscando, setBuscando] = useState(false);

  const handleBuscarCidade = async (texto: string) => {
    setBuscaCidade(texto);
    if (texto.trim().length < 2) {
      setCidadesSugeridas([]);
      return;
    }

    try {
      setBuscando(true);
      const res = await fetch(`/api/clima?cidade=${encodeURIComponent(texto)}`);
      if (res.ok) {
        const data = await res.json();
        setCidadesSugeridas(data.cidades || []);
      }
    } finally {
      setBuscando(false);
    }
  };

  const handleEscolherCidade = async (cidade: LocalizacaoCidade) => {
    onSelecionarCidade(cidade);
    setCidadesSugeridas([]);
    setBuscaCidade("");

    try {
      const res = await fetch(`/api/clima?lat=${cidade.latitude}&lon=${cidade.longitude}`);
      if (res.ok) {
        const data = await res.json();
        if (data.clima?.temperatura_c) {
          onInputChange({
            ...input,
            temperatura_media_c: data.clima.temperatura_c,
          });
        }
      }
    } catch {
      // Falha de rede silenciosa
    }
  };

  const filtradas = recomendacoes.filter((item) => {
    if (filtroStatus === "todos") return true;
    return item.status === filtroStatus;
  });

  return (
    <div className="space-y-6">
      {/* Seção de Localização e Clima */}
      <section className="bg-white rounded-2xl p-5 border border-[#e8e4df] shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-[#1f291e]">
            {cidadeSelecionada ? `📍 Clima em ${cidadeSelecionada}` : "📍 Onde você está?"}
          </h2>
          <span className="text-xs font-semibold text-[#244227] bg-[#eef5ee] px-2.5 py-1 rounded-full">
            {buscando ? "Consultando clima..." : `${input.temperatura_media_c}°C estimados`}
          </span>
        </div>

        <div className="relative">
          <label htmlFor={buscaId} className="sr-only">
            Buscar cidade
          </label>
          <input
            id={buscaId}
            type="text"
            value={buscaCidade}
            onChange={(e) => {
              void handleBuscarCidade(e.target.value);
            }}
            placeholder="Digite sua cidade (ex: Juazeiro do Norte, São Paulo)..."
            className="w-full h-11 px-3.5 text-sm rounded-xl border border-[#cfc8bf] bg-white outline-hidden focus:ring-2 focus:ring-[#244227]"
          />

          {cidadesSugeridas.length > 0 && (
            <div className="absolute top-12 left-0 right-0 bg-white border border-[#cfc8bf] rounded-xl shadow-lg z-20 max-h-48 overflow-y-auto">
              {cidadesSugeridas.map((c) => (
                <button
                  key={`${c.nome}-${c.latitude}-${c.longitude}`}
                  type="button"
                  onClick={() => {
                    void handleEscolherCidade(c);
                  }}
                  className="w-full text-left px-3.5 py-2.5 text-xs hover:bg-[#f7f5f2] border-b border-[#eeebe6] last:border-b-0"
                >
                  <strong className="text-[#1f291e]">{c.nome}</strong>
                  {c.estado && <span className="text-[#615f5b]">, {c.estado}</span>}
                </button>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Painel de Espaço e Sol */}
      <section className="bg-white rounded-2xl p-5 border border-[#e8e4df] shadow-xs space-y-4">
        <h2 className="text-base font-bold text-[#1f291e]">Como é o seu espaço?</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          <div>
            <label htmlFor={espacoId} className="block text-xs font-medium text-[#4a5848] mb-1">
              Espaço Disponível
            </label>
            <select
              id={espacoId}
              value={input.tipo_espaco}
              onChange={(e) =>
                onInputChange({ ...input, tipo_espaco: e.target.value as TipoEspaco })
              }
              className="w-full h-11 px-3 rounded-xl border border-[#cfc8bf] bg-white text-sm outline-hidden focus:ring-2 focus:ring-[#244227]"
            >
              <option value="vaso">🪴 Vaso ou Jardineira (Apto/Casa)</option>
              <option value="quintal_pequeno">🏡 Quintal pequeno (até 20 m²)</option>
              <option value="terreno_medio">🌾 Canteiro / Terreno médio</option>
              <option value="terra_grande">🚜 Sítio ou Terra grande</option>
            </select>
          </div>

          <div>
            <label htmlFor={solId} className="block text-xs font-medium text-[#4a5848] mb-1">
              Horas de Sol Diário
            </label>
            <select
              id={solId}
              value={input.sol_horas}
              onChange={(e) =>
                onInputChange({ ...input, sol_horas: Number(e.target.value) })
              }
              className="w-full h-11 px-3 rounded-xl border border-[#cfc8bf] bg-white text-sm outline-hidden focus:ring-2 focus:ring-[#244227]"
            >
              <option value={2}>Sombra / Claridade (~2h de sol)</option>
              <option value={4}>Meia-sombra (sol da manhã, ~4h)</option>
              <option value={6}>Sol moderado (cerca de 6h)</option>
              <option value={8}>Sol pleno (dia todo, 8h+)</option>
            </select>
          </div>

          <div>
            <label htmlFor={tempId} className="block text-xs font-medium text-[#4a5848] mb-1">
              Temperatura Estimada
            </label>
            <select
              id={tempId}
              value={input.temperatura_media_c}
              onChange={(e) =>
                onInputChange({
                  ...input,
                  temperatura_media_c: Number(e.target.value),
                })
              }
              className="w-full h-11 px-3 rounded-xl border border-[#cfc8bf] bg-white text-sm outline-hidden focus:ring-2 focus:ring-[#244227]"
            >
              <option value={14}>Frio (&lt; 16°C)</option>
              <option value={20}>Ameno fresco (17°C a 22°C)</option>
              <option value={26}>Ameno quente (23°C a 28°C)</option>
              <option value={32}>Calor intenso (29°C+)</option>
            </select>
          </div>

          <div>
            <label htmlFor={mesId} className="block text-xs font-medium text-[#4a5848] mb-1">
              Mês de Plantio
            </label>
            <select
              id={mesId}
              value={input.mes}
              onChange={(e) => onInputChange({ ...input, mes: Number(e.target.value) })}
              className="w-full h-11 px-3 rounded-xl border border-[#cfc8bf] bg-white text-sm outline-hidden focus:ring-2 focus:ring-[#244227]"
            >
              {[
                "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
                "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
              ].map((m, idx) => (
                <option key={m} value={idx + 1}>
                  {m}
                </option>
              ))}
            </select>
          </div>
        </div>
      </section>

      {/* Filtros rápidos de tags */}
      <div className="flex gap-2 overflow-x-auto pb-1 text-xs">
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
            className={`px-4 py-2 rounded-full font-medium whitespace-nowrap min-h-[44px] transition-colors ${
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
      <div className="space-y-4">
        {filtradas.map((item) => (
          <CardCulturaResumo key={item.cultura.id} item={item} />
        ))}
      </div>
    </div>
  );
}

function CardCulturaResumo({ item }: { item: ItemRecomendado }) {
  const { cultura, status, motivos, avisos } = item;

  const badges: Record<StatusRecomendacao, { bg: string; text: string; label: string }> = {
    ideal_agora: { bg: "bg-[#244227]", text: "text-white", label: "🌟 Ideal agora" },
    possivel: { bg: "bg-[#8f6d28]", text: "text-white", label: "🌱 Dá para plantar" },
    esperar: { bg: "bg-[#6b6762]", text: "text-white", label: "⏳ Melhor esperar" },
    nao_recomendado: { bg: "bg-[#8c2b2b]", text: "text-white", label: "⚠️ Não recomendado" },
  };

  const badge = badges[status];

  return (
    <article className="bg-white rounded-2xl p-5 border border-[#e8e4df] shadow-xs space-y-3">
      <div className="flex items-start justify-between gap-3">
        <div>
          <span className="text-[11px] uppercase tracking-wider font-semibold text-[#66635e]">
            {cultura.categoria}
          </span>
          <h3 className="text-xl font-bold text-[#1f291e]">{cultura.nome}</h3>
        </div>
        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${badge.bg} ${badge.text}`}>
          {badge.label}
        </span>
      </div>

      <p className="text-sm text-[#474542]">{cultura.descricao_curta}</p>

      <div className="grid grid-cols-3 gap-2 py-2 border-y border-[#f0ede8] text-center text-xs">
        <div>
          <span className="block text-[#7a7772]">Dificuldade</span>
          <span className="font-semibold text-[#1f291e]">
            {cultura.dificuldade === 1 ? "Muito fácil" : cultura.dificuldade === 2 ? "Fácil" : "Média"}
          </span>
        </div>
        <div>
          <span className="block text-[#7a7772]">Colheita</span>
          <span className="font-semibold text-[#1f291e]">
            {cultura.dias_ate_colheita[0]}-{cultura.dias_ate_colheita[1]} dias
          </span>
        </div>
        <div>
          <span className="block text-[#7a7772]">Sol mínimo</span>
          <span className="font-semibold text-[#1f291e]">{cultura.sol_horas_min}h / dia</span>
        </div>
      </div>

      {motivos.length > 0 && <p className="text-xs text-[#2b4c2f]">✓ {motivos[0]}</p>}
      {avisos.length > 0 && <p className="text-xs text-[#8c3f2b]">ℹ {avisos[0]}</p>}

      <Link
        href={`/cultura/${cultura.id}`}
        className="w-full h-11 rounded-xl bg-[#244227] text-white font-semibold text-sm hover:bg-[#1a301c] transition-colors flex items-center justify-center gap-1.5 shadow-xs"
      >
        <span>Ver guia completo de {cultura.nome}</span>
        <span>→</span>
      </Link>
    </article>
  );
}
