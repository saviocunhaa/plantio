"use client";

import Link from "next/link";
import { ItemRecomendado, StatusRecomendacao } from "@/lib/recommendation/types";

export function CardCulturaResumo({ item }: { item: ItemRecomendado }) {
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
