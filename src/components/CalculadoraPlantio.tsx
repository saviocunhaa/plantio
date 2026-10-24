"use client";

import { useId, useState } from "react";
import { calcularEspacoPlantio } from "@/lib/calculator/engine";
import { Cultura } from "@/lib/recommendation/types";

export function CalculadoraPlantio({ cultura }: { cultura: Cultura }) {
  const [modo, setModo] = useState<"vaso" | "canteiro">(
    cultura.espaco.permite_vaso ? "vaso" : "canteiro"
  );
  const [litros, setLitros] = useState<number>(cultura.espaco.vaso_litros_min ?? 10);
  const [m2, setM2] = useState<number>(1);

  const inputLitrosId = useId();
  const inputM2Id = useId();

  const resultado = calcularEspacoPlantio(cultura, {
    modo,
    vaso_litros: litros,
    canteiro_m2: m2,
  });

  return (
    <div className="bg-white rounded-2xl p-6 border border-[#e8e4df] shadow-xs space-y-4">
      <div className="flex items-center justify-between pb-2 border-b border-[#f0ede8]">
        <div className="flex items-center gap-2">
          <span className="text-xl">🧮</span>
          <h2 className="text-lg font-bold text-[#1f291e]">Calculadora de Espaço e Mudas</h2>
        </div>
        <span className="text-[11px] font-semibold text-[#244227] bg-[#eef5ee] px-2.5 py-0.5 rounded-full">
          Agronomia Embrapa
        </span>
      </div>

      <p className="text-xs text-[#57544f]">
        Descubra quantas plantas cabem no seu espaço sem competição e quanta terra você vai precisar.
      </p>

      {/* Seleção do modo */}
      <div className="flex gap-2 p-1 bg-[#f0ede8] rounded-xl text-xs font-semibold">
        {cultura.espaco.permite_vaso && (
          <button
            type="button"
            onClick={() => setModo("vaso")}
            className={`flex-1 py-2 rounded-lg transition-all ${
              modo === "vaso"
                ? "bg-white text-[#244227] shadow-xs"
                : "text-[#57544f] hover:text-[#1f291e]"
            }`}
          >
            🪴 Em Vaso / Jardineira
          </button>
        )}
        <button
          type="button"
          onClick={() => setModo("canteiro")}
          className={`flex-1 py-2 rounded-lg transition-all ${
            modo === "canteiro"
              ? "bg-white text-[#244227] shadow-xs"
              : "text-[#57544f] hover:text-[#1f291e]"
          }`}
        >
          🌱 Em Canteiro / Chão (m²)
        </button>
      </div>

      {modo === "vaso" ? (
        <div className="space-y-2">
          <label htmlFor={inputLitrosId} className="text-xs font-semibold text-[#474542]">
            Volume do vaso em litros:
          </label>
          <div className="flex items-center gap-2">
            <input
              id={inputLitrosId}
              type="number"
              min={1}
              max={200}
              value={litros}
              onChange={(e) => setLitros(Math.max(1, Number(e.target.value)))}
              className="w-24 h-10 px-3 text-sm font-semibold rounded-xl border border-[#cfc8bf] bg-white outline-hidden focus:ring-2 focus:ring-[#244227]"
            />
            <div className="flex gap-1.5 text-xs">
              {[5, 10, 20, 40].map((val) => (
                <button
                  key={val}
                  type="button"
                  onClick={() => setLitros(val)}
                  className={`px-2.5 py-1.5 rounded-lg border text-xs font-medium ${
                    litros === val
                      ? "bg-[#244227] text-white border-[#244227]"
                      : "bg-[#f7f5f2] border-[#e0dad1] text-[#33312e]"
                  }`}
                >
                  {val}L
                </button>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-2">
          <label htmlFor={inputM2Id} className="text-xs font-semibold text-[#474542]">
            Área do canteiro ou terreno em m²:
          </label>
          <div className="flex items-center gap-2">
            <input
              id={inputM2Id}
              type="number"
              min={0.2}
              step={0.5}
              max={1000}
              value={m2}
              onChange={(e) => setM2(Math.max(0.1, Number(e.target.value)))}
              className="w-24 h-10 px-3 text-sm font-semibold rounded-xl border border-[#cfc8bf] bg-white outline-hidden focus:ring-2 focus:ring-[#244227]"
            />
            <div className="flex gap-1.5 text-xs">
              {[1, 2, 5, 10].map((val) => (
                <button
                  key={val}
                  type="button"
                  onClick={() => setM2(val)}
                  className={`px-2.5 py-1.5 rounded-lg border text-xs font-medium ${
                    m2 === val
                      ? "bg-[#244227] text-white border-[#244227]"
                      : "bg-[#f7f5f2] border-[#e0dad1] text-[#33312e]"
                  }`}
                >
                  {val} m²
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Resultados da Calculadora */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 pt-2">
        <div className="bg-[#f7f5f2] p-3 rounded-xl border border-[#e5dfd5]">
          <span className="block text-[11px] text-[#73706b]">Mudas ideais</span>
          <span className="text-lg font-bold text-[#244227]">
            {resultado.quantidade_plantas} {resultado.quantidade_plantas === 1 ? "muda" : "mudas"}
          </span>
        </div>

        <div className="bg-[#f7f5f2] p-3 rounded-xl border border-[#e5dfd5]">
          <span className="block text-[11px] text-[#73706b]">Terra / Substrato</span>
          <span className="text-lg font-bold text-[#1f291e]">
            ~{resultado.volume_substrato_litros} Litros
          </span>
        </div>

        <div className="bg-[#f7f5f2] p-3 rounded-xl border border-[#e5dfd5] col-span-2 sm:col-span-1">
          <span className="block text-[11px] text-[#73706b]">Distância entre pés</span>
          <span className="text-lg font-bold text-[#1f291e]">
            ~{resultado.espacamento_sugerido_cm} cm
          </span>
        </div>
      </div>

      <div className="bg-[#eef5ee] border border-[#cbe1ce] rounded-xl p-3.5 space-y-1.5 text-xs text-[#1e3d22]">
        <div className="flex items-center justify-between">
          <strong>💰 Economia Estimada em Casa:</strong>
          <span className="font-bold text-sm bg-white px-2.5 py-0.5 rounded-full border border-[#cbe1ce]">
            ~R$ {resultado.economia_estimada_reais},00
          </span>
        </div>
        <p className="text-[11px] leading-relaxed text-[#2c4e31]">
          {resultado.dica_distribuicao}
        </p>
      </div>
    </div>
  );
}
