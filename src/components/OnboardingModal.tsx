"use client";

import { useState } from "react";
import { TipoEspaco } from "@/lib/recommendation/types";
import { LocalizacaoCidade } from "@/lib/weather/types";

interface OnboardingModalProps {
  aberto: boolean;
  onConcluir: (dados: {
    espaco: TipoEspaco;
    sol_horas: number;
    tem_agua_facil: boolean;
    cidade?: LocalizacaoCidade;
  }) => void;
  onFechar: () => void;
}

export function OnboardingModal({ aberto, onConcluir, onFechar }: OnboardingModalProps) {
  const [etapa, setEtapa] = useState<1 | 2 | 3>(1);
  const [espaco, setEspaco] = useState<TipoEspaco>("vaso");
  const [solHoras, setSolHoras] = useState<number>(4);
  const [aguaFacil, setAguaFacil] = useState<boolean>(true);
  const [cidadeSelecionada, setCidadeSelecionada] = useState<LocalizacaoCidade | undefined>();
  const [buscaCidade, setBuscaCidade] = useState("");
  const [cidadesSugeridas, setCidadesSugeridas] = useState<LocalizacaoCidade[]>([]);
  const [buscando, setBuscando] = useState(false);

  if (!aberto) return null;

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

  const handleDetectarLocalizacao = () => {
    setBuscando(true);
    const detectarPorIP = async () => {
      try {
        const res = await fetch("/api/clima?auto=ip");
        if (res.ok) {
          const data = await res.json();
          if (data.localizacao) {
            setCidadeSelecionada(data.localizacao);
            setEtapa(3);
          }
        }
      } finally {
        setBuscando(false);
      }
    };

    if (typeof navigator !== "undefined" && "geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          void (async () => {
            try {
              const res = await fetch(
                `/api/clima?lat=${pos.coords.latitude}&lon=${pos.coords.longitude}`
              );
              if (res.ok) {
                const data = await res.json();
                const loc = data.localizacao ?? data.cidade;
                if (loc) {
                  setCidadeSelecionada(loc);
                  setEtapa(3);
                  return;
                }
              }
              await detectarPorIP();
            } catch {
              await detectarPorIP();
            } finally {
              setBuscando(false);
            }
          })();
        },
        () => {
          void detectarPorIP();
        },
        { timeout: 6000 }
      );
    } else {
      void detectarPorIP();
    }
  };

  const handleFinalizar = () => {
    onConcluir({
      espaco,
      sol_horas: solHoras,
      tem_agua_facil: aguaFacil,
      cidade: cidadeSelecionada,
    });
  };

  return (
    <div className="fixed inset-0 bg-black/65 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-5 shadow-2xl relative">
        {/* Indicador de progresso */}
        <div className="flex items-center justify-between text-xs text-[#73706b]">
          <span>Passo {etapa} de 3</span>
          <button
            type="button"
            onClick={onFechar}
            className="text-xs text-[#73706b] hover:text-[#1f291e] font-semibold"
          >
            Pular
          </button>
        </div>
        <div className="w-full bg-[#f0ede8] rounded-full h-1.5 overflow-hidden">
          <div
            className="bg-[#244227] h-1.5 rounded-full transition-all duration-300"
            style={{ width: `${(etapa / 3) * 100}%` }}
          />
        </div>

        {/* Etapa 1: Boas-vindas */}
        {etapa === 1 && (
          <div className="text-center space-y-4 py-2">
            <span className="text-5xl block animate-bounce">🌱</span>
            <h2 className="text-2xl font-extrabold text-[#1f291e]">
              Bem-vindo ao Plantio Fácil
            </h2>
            <p className="text-sm text-[#474542] leading-relaxed">
              Diga onde você está e quanto espaço tem. A gente diz o que plantar agora e te guia
              passo a passo até a colheita!
            </p>
            <button
              type="button"
              onClick={() => setEtapa(2)}
              className="w-full h-12 rounded-xl bg-[#244227] text-white font-semibold text-base hover:bg-[#1a301c] transition-colors shadow-sm"
            >
              Começar agora →
            </button>
          </div>
        )}

        {/* Etapa 2: Onde você está? */}
        {etapa === 2 && (
          <div className="space-y-4">
            <div>
              <h2 className="text-xl font-bold text-[#1f291e]">Onde você está?</h2>
              <p className="text-xs text-[#57544f] mt-0.5">
                Usamos o clima da sua região para saber a melhor época de cada planta.
              </p>
            </div>

            <button
              type="button"
              onClick={handleDetectarLocalizacao}
              disabled={buscando}
              className="w-full h-12 rounded-xl bg-[#eef5ee] border border-[#cbe1ce] text-[#1e3d22] font-semibold text-sm hover:bg-[#e0ede1] flex items-center justify-center gap-2"
            >
              <span>{buscando ? "Buscando localização..." : "📍 Usar minha localização atual"}</span>
            </button>

            <div className="relative text-center">
              <span className="text-xs text-[#8c8881] bg-white px-2 relative z-10">ou busque sua cidade</span>
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-[#f0ede8]" />
              </div>
            </div>

            <div className="space-y-2">
              <input
                type="text"
                placeholder="Ex: Juazeiro do Norte, São Paulo..."
                value={buscaCidade}
                onChange={(e) => void handleBuscarCidade(e.target.value)}
                className="w-full h-11 px-3 text-sm rounded-xl border border-[#cfc8bf] bg-white outline-hidden focus:ring-2 focus:ring-[#244227]"
              />

              {cidadesSugeridas.length > 0 && (
                <div className="border border-[#e0dad1] rounded-xl max-h-36 overflow-y-auto bg-white divide-y divide-[#f7f5f2]">
                  {cidadesSugeridas.map((c) => (
                    <button
                      key={`${c.nome}-${c.latitude}`}
                      type="button"
                      onClick={() => {
                        setCidadeSelecionada(c);
                        setCidadesSugeridas([]);
                        setEtapa(3);
                      }}
                      className="w-full text-left p-2.5 text-xs text-[#1f291e] hover:bg-[#f7f5f2]"
                    >
                      📍 {c.nome} {c.estado ? `- ${c.estado}` : ""}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => setEtapa(1)}
                className="w-24 h-11 rounded-xl border border-[#cfc8bf] text-xs font-semibold"
              >
                Voltar
              </button>
              <button
                type="button"
                onClick={() => setEtapa(3)}
                className="flex-1 h-11 rounded-xl bg-[#244227] text-white font-semibold text-xs hover:bg-[#1a301c]"
              >
                Continuar sem local →
              </button>
            </div>
          </div>
        )}

        {/* Etapa 3: Qual seu espaço? */}
        {etapa === 3 && (
          <div className="space-y-4">
            <div>
              <h2 className="text-xl font-bold text-[#1f291e]">Qual seu espaço de plantio?</h2>
              <p className="text-xs text-[#57544f] mt-0.5">
                Isso define quais culturas cabem perfeitamente para você.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs">
              {(
                [
                  { id: "vaso", icon: "🪴", titulo: "Vasos / Apartamento", sub: "Janela ou varanda" },
                  { id: "quintal_pequeno", icon: "🏡", titulo: "Quintal Pequeno", sub: "Até ~20 m² de terra" },
                  { id: "terreno_medio", icon: "🌾", titulo: "Terreno Médio", sub: "20 a 500 m²" },
                  { id: "terra_grande", icon: "🚜", titulo: "Terra Grande / Sítio", sub: "Acima de 500 m²" },
                ] as const
              ).map((op) => (
                <button
                  key={op.id}
                  type="button"
                  onClick={() => setEspaco(op.id)}
                  className={`p-3 rounded-xl border text-left flex flex-col gap-1 ${
                    espaco === op.id
                      ? "border-[#244227] bg-[#eef5ee] ring-1 ring-[#244227] font-semibold text-[#1e3d22]"
                      : "border-[#e0dad1] text-[#474542] hover:bg-[#faf9f7]"
                  }`}
                >
                  <span className="text-xl">{op.icon}</span>
                  <span>{op.titulo}</span>
                  <span className="text-[10px] text-[#73706b] font-normal">{op.sub}</span>
                </button>
              ))}
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-[#474542]">Horas de sol direto por dia:</label>
              <div className="flex gap-2">
                {[
                  { horas: 2, label: "Pouco (2h)" },
                  { horas: 4, label: "Médio (4h)" },
                  { horas: 6, label: "Pleno (6h+)" },
                ].map((s) => (
                  <button
                    key={s.horas}
                    type="button"
                    onClick={() => setSolHoras(s.horas)}
                    className={`flex-1 py-2 text-xs rounded-xl border ${
                      solHoras === s.horas
                        ? "bg-[#244227] text-white border-[#244227] font-semibold"
                        : "bg-[#f7f5f2] border-[#e0dad1] text-[#474542]"
                    }`}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between bg-[#f7f5f2] p-3 rounded-xl text-xs">
              <span className="font-semibold text-[#3b3a37]">Tem torneira / água fácil perto?</span>
              <button
                type="button"
                onClick={() => setAguaFacil(!aguaFacil)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                  aguaFacil ? "bg-[#244227] text-white" : "bg-[#ded8cf] text-[#474542]"
                }`}
              >
                {aguaFacil ? "✓ Sim" : "Não"}
              </button>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => setEtapa(2)}
                className="w-24 h-11 rounded-xl border border-[#cfc8bf] text-xs font-semibold"
              >
                Voltar
              </button>
              <button
                type="button"
                onClick={handleFinalizar}
                className="flex-1 h-11 rounded-xl bg-[#244227] text-white font-semibold text-xs hover:bg-[#1a301c]"
              >
                Ver recomendações ideais →
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
