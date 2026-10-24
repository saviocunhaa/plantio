"use client";

import { useState } from "react";
import { diagnosticarSintomaVisual } from "@/lib/diagnostic/engine";
import { DiagnosticoResultado, SintomaVisual } from "@/lib/diagnostic/types";
import { PlantioAtivo } from "@/lib/plantios/types";

interface ModalDiagnosticoVisualProps {
  aberto: boolean;
  onFechar: () => void;
  plantiosAtivos: PlantioAtivo[];
  onAdicionarAoDiario?: (plantioId: string, texto: string, fotoUrl?: string) => void;
}

const OPCOES_SINTOMAS: Array<{ id: SintomaVisual; label: string; icon: string }> = [
  { id: "folhas_amareladas", label: "Folhas Amareladas", icon: "🟡" },
  { id: "furos_folhas", label: "Folhas Furadas / Mordidas", icon: "🐛" },
  { id: "pontos_brancos_algodao", label: "Pontos Brancos / Algodão", icon: "⚪" },
  { id: "pontos_pretos_amarelos", label: "Pontinhos Pretos (Pulgões)", icon: "🐜" },
  { id: "folhas_murchas", label: "Folhas Murchas / Caídas", icon: "🥀" },
  { id: "teias_pequenas", label: "Teias Finas no Verso", icon: "🕸️" },
  { id: "bordas_queimadas", label: "Bordas Queimadas / Secas", icon: "🍂" },
  { id: "crescimento_estiolado", label: "Caule Fino e Esticado", icon: "🌱" },
];

export function ModalDiagnosticoVisual({
  aberto,
  onFechar,
  plantiosAtivos,
  onAdicionarAoDiario,
}: ModalDiagnosticoVisualProps) {
  const [sintomaSelecionado, setSintomaSelecionado] = useState<SintomaVisual>("folhas_amareladas");
  const [plantioIdSelecionado, setPlantioIdSelecionado] = useState<string>(
    plantiosAtivos[0]?.id ?? ""
  );
  const [fotoBase64, setFotoBase64] = useState<string | undefined>();
  const [resultado, setResultado] = useState<DiagnosticoResultado | null>(null);
  const [salvoNoDiario, setSalvoNoDiario] = useState(false);

  if (!aberto) return null;

  const plantioEscolhido = plantiosAtivos.find((p) => p.id === plantioIdSelecionado);

  const handleFoto = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (loadEvent) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const maxDim = 480;
        let { width, height } = img;
        if (width > height && width > maxDim) {
          height = Math.round((height * maxDim) / width);
          width = maxDim;
        } else if (height > maxDim) {
          width = Math.round((width * maxDim) / height);
          height = maxDim;
        }
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          setFotoBase64(canvas.toDataURL("image/jpeg", 0.72));
        }
      };
      img.src = loadEvent.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  const handleDiagnosticar = () => {
    const diag = diagnosticarSintomaVisual({
      sintoma: sintomaSelecionado,
      cultura_id: plantioEscolhido?.cultura_id,
      cultura_nome: plantioEscolhido?.cultura_nome,
      foto_url: fotoBase64,
    });
    setResultado(diag);
    setSalvoNoDiario(false);
  };

  const handleSalvarNoDiario = () => {
    if (!resultado || !plantioIdSelecionado || !onAdicionarAoDiario) return;
    const textoDiario = `[Diagnóstico Foliar] ${resultado.nome_problema}. Tratamento: ${resultado.solucao_caseira}`;
    onAdicionarAoDiario(plantioIdSelecionado, textoDiario, fotoBase64);
    setSalvoNoDiario(true);
  };

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-lg w-full p-5 sm:p-6 space-y-4 my-8 shadow-xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between pb-2 border-b border-[#f0ede8]">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🔍</span>
            <h2 className="text-lg font-bold text-[#1f291e]">Diagnóstico da Folha & Pragas</h2>
          </div>
          <button
            type="button"
            onClick={onFechar}
            className="text-sm font-semibold text-[#66635e] hover:text-[#1f291e] p-1.5"
          >
            ✕
          </button>
        </div>

        {plantiosAtivos.length > 0 && (
          <div className="space-y-1">
            <label className="text-xs font-semibold text-[#474542]">Qual planta analisar?</label>
            <select
              value={plantioIdSelecionado}
              onChange={(e) => setPlantioIdSelecionado(e.target.value)}
              className="w-full h-10 px-3 rounded-xl border border-[#cfc8bf] bg-white text-xs outline-hidden focus:ring-2 focus:ring-[#244227]"
            >
              {plantiosAtivos.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.cultura_nome} ({p.tipo_espaco === "vaso" ? "Vaso" : "Quintal"})
                </option>
              ))}
            </select>
          </div>
        )}

        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-[#474542]">Foto da folha ou praga (opcional)</label>
          <div className="flex items-center gap-3">
            <label className="h-10 px-4 rounded-xl border border-[#cfc8bf] bg-[#f7f5f2] hover:bg-[#edeae4] text-[#244227] text-xs font-semibold flex items-center gap-1.5 cursor-pointer">
              <span>📷</span>
              <span>Tirar foto ou galeria</span>
              <input type="file" accept="image/*" onChange={handleFoto} className="hidden" />
            </label>
            {fotoBase64 && (
              <div className="flex items-center gap-2">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={fotoBase64} alt="Folha enviada" className="w-10 h-10 object-cover rounded-lg border border-[#cfc8bf]" />
                <button
                  type="button"
                  onClick={() => setFotoBase64(undefined)}
                  className="text-[11px] text-[#8c3f2b] hover:underline"
                >
                  Remover
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-xs font-semibold text-[#474542]">O que você está vendo na planta?</label>
          <div className="grid grid-cols-2 gap-2">
            {OPCOES_SINTOMAS.map((op) => (
              <button
                key={op.id}
                type="button"
                onClick={() => setSintomaSelecionado(op.id)}
                className={`p-2.5 rounded-xl border text-left text-xs flex items-center gap-2 transition-all ${
                  sintomaSelecionado === op.id
                    ? "border-[#244227] bg-[#eef5ee] text-[#1b341d] font-semibold ring-1 ring-[#244227]"
                    : "border-[#e0dad1] bg-white text-[#474542] hover:bg-[#faf9f7]"
                }`}
              >
                <span className="text-base">{op.icon}</span>
                <span className="leading-tight">{op.label}</span>
              </button>
            ))}
          </div>
        </div>

        <button
          type="button"
          onClick={handleDiagnosticar}
          className="w-full h-12 rounded-xl bg-[#244227] text-white font-semibold text-sm hover:bg-[#1a301c] transition-colors shadow-xs"
        >
          Analisar e ver remédio caseiro →
        </button>

        {resultado && (
          <div className="bg-[#f7f5f2] border border-[#ded8cf] rounded-2xl p-4 space-y-3 pt-3">
            <div className="flex items-center justify-between">
              <span className="text-xs uppercase tracking-wider font-bold text-[#244227]">
                Diagnóstico Identificado
              </span>
              <span
                className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                  resultado.gravidade === "alta"
                    ? "bg-[#fed7d7] text-[#9b2c2c]"
                    : resultado.gravidade === "moderada"
                    ? "bg-[#feebc8] text-[#7b341e]"
                    : "bg-[#c6f6d5] text-[#22543d]"
                }`}
              >
                Gravidade {resultado.gravidade}
              </span>
            </div>

            <h3 className="text-base font-bold text-[#1f291e]">{resultado.nome_problema}</h3>

            <div className="text-xs text-[#3b3a37] space-y-2">
              <p>
                <strong className="text-[#1f291e]">Possível causa: </strong>
                {resultado.causa_provavel}
              </p>
              <div className="bg-white p-3 rounded-xl border border-[#e5dfd5] space-y-1">
                <strong className="text-[#244227] flex items-center gap-1">
                  <span>🍃</span> Solução Caseira Segura (Embrapa):
                </strong>
                <p className="text-[#2e2d2a]">{resultado.solucao_caseira}</p>
              </div>
              <p>
                <strong className="text-[#1f291e]">Como prevenir: </strong>
                {resultado.como_prevenir}
              </p>
              <div className="bg-[#e9f3ea] p-2.5 rounded-xl text-[#1e3d22] font-medium border border-[#cbe1ce]">
                <strong>💡 O que fazer hoje: </strong>
                {resultado.proxima_acao}
              </div>
            </div>

            {plantioIdSelecionado && onAdicionarAoDiario && (
              <button
                type="button"
                onClick={handleSalvarNoDiario}
                disabled={salvoNoDiario}
                className="w-full h-10 rounded-xl bg-white border border-[#244227] text-[#244227] font-semibold text-xs hover:bg-[#eef5ee] transition-colors"
              >
                {salvoNoDiario ? "✓ Registrado no Diário de Cultivo!" : "Salvar no Diário de Bordo"}
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
