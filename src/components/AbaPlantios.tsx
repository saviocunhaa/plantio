"use client";

import { useState } from "react";
import { Cultura } from "@/lib/recommendation/types";
import { calcularDiasPlantio, obterFaseAtual } from "@/lib/plantios/service";
import { PlantioAtivo } from "@/lib/plantios/types";

interface AbaPlantiosProps {
  plantios: PlantioAtivo[];
  culturas: Cultura[];
  onAdicionarNota: (plantioId: string, texto: string, fotoUrl?: string) => void;
  onConcluirPlantio: (plantioId: string) => void;
  onIrParaPlantar: () => void;
}

export function AbaPlantios({
  plantios,
  culturas,
  onAdicionarNota,
  onConcluirPlantio,
  onIrParaPlantar,
}: AbaPlantiosProps) {
  const culturasMap = new Map(culturas.map((c) => [c.id, c]));
  const plantiosAtivos = plantios.filter((p) => p.status === "ativo");

  if (plantiosAtivos.length === 0) {
    return (
      <div className="bg-white rounded-2xl p-6 border border-[#e8e4df] text-center space-y-4">
        <span className="text-4xl" role="img" aria-label="Jardim">
          🌿
        </span>
        <h2 className="text-xl font-bold text-[#1f291e]">Nenhum cultivo em andamento</h2>
        <p className="text-sm text-[#57544f] max-w-md mx-auto">
          Suas plantinhas ativas aparecerão aqui com a contagem de dias, fase atual, fotos e o
          diário de evolução.
        </p>
        <button
          type="button"
          onClick={onIrParaPlantar}
          className="w-full sm:w-auto px-6 h-12 rounded-xl bg-[#244227] text-white font-semibold text-sm hover:bg-[#1a301c] transition-colors"
        >
          Iniciar novo cultivo agora →
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-[#1f291e]">Minhas Plantações</h2>
        <span className="text-xs font-semibold text-[#244227] bg-[#eef5ee] px-3 py-1 rounded-full">
          {plantiosAtivos.length} ativa{plantiosAtivos.length !== 1 ? "s" : ""}
        </span>
      </div>

      <div className="space-y-4">
        {plantiosAtivos.map((plantio) => {
          const cultura = culturasMap.get(plantio.cultura_id);
          if (!cultura) return null;

          return (
            <CardPlantioDetalhado
              key={plantio.id}
              plantio={plantio}
              cultura={cultura}
              onAdicionarNota={(texto, foto) => onAdicionarNota(plantio.id, texto, foto)}
              onConcluirPlantio={() => onConcluirPlantio(plantio.id)}
            />
          );
        })}
      </div>
    </div>
  );
}

function CardPlantioDetalhado({
  plantio,
  cultura,
  onAdicionarNota,
  onConcluirPlantio,
}: {
  plantio: PlantioAtivo;
  cultura: Cultura;
  onAdicionarNota: (texto: string, fotoUrl?: string) => void;
  onConcluirPlantio: () => void;
}) {
  const [notaTexto, setNotaTexto] = useState("");
  const [fotoBase64, setFotoBase64] = useState<string | undefined>();
  const [mostrarDiario, setMostrarDiario] = useState(false);
  const [fotoAmpliada, setFotoAmpliada] = useState<string | null>(null);

  const dias = calcularDiasPlantio(plantio.data_plantio);
  const fase = obterFaseAtual(cultura, dias);
  const diasAteColheitaMax = cultura.dias_ate_colheita[1];
  const progresso = Math.min(100, Math.round((dias / diasAteColheitaMax) * 100));

  const handleSelecionarFoto = (e: React.ChangeEvent<HTMLInputElement>) => {
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

  const handleSubmitNota = (e: React.FormEvent) => {
    e.preventDefault();
    if (!notaTexto.trim() && !fotoBase64) return;
    onAdicionarNota(notaTexto.trim() || "Registro fotográfico", fotoBase64);
    setNotaTexto("");
    setFotoBase64(undefined);
  };

  return (
    <article className="bg-white rounded-2xl p-5 border border-[#e8e4df] shadow-xs space-y-4">
      <div className="flex items-start justify-between">
        <div>
          <span className="text-xs uppercase font-semibold text-[#73706b]">
            Espaço: {plantio.tipo_espaco === "vaso" ? "Vaso" : "Quintal/Canteiro"}
          </span>
          <h3 className="text-xl font-bold text-[#1f291e]">{plantio.cultura_nome}</h3>
          <p className="text-xs text-[#244227] font-medium mt-0.5">
            Fase atual: {fase?.nome ?? "Desenvolvimento"} ({dias} dias de cultivo)
          </p>
        </div>

        <button
          type="button"
          onClick={onConcluirPlantio}
          className="text-xs text-[#8c3f2b] hover:text-[#5e2112] font-semibold p-2"
        >
          Finalizar cultivo
        </button>
      </div>

      {/* Barra de progresso do ciclo */}
      <div className="space-y-1.5">
        <div className="flex justify-between text-xs text-[#57544f]">
          <span>Ciclo até colheita</span>
          <span>
            {dias} de ~{cultura.dias_ate_colheita[0]}-{diasAteColheitaMax} dias
          </span>
        </div>
        <div className="w-full bg-[#f0ede8] rounded-full h-2.5 overflow-hidden">
          <div
            className="bg-[#244227] h-2.5 rounded-full transition-all duration-300"
            style={{ width: `${progresso}%` }}
          />
        </div>
      </div>

      {/* O que observar nesta fase */}
      {fase?.o_que_observar && (
        <div className="bg-[#f7f5f2] rounded-xl p-3 text-xs text-[#3b3a37]">
          <strong className="text-[#244227]">O que esperar agora: </strong>
          {fase.o_que_observar}
        </div>
      )}

      {/* Diário de notas e fotos */}
      <div className="pt-2 border-t border-[#f0ede8] space-y-2">
        <button
          type="button"
          onClick={() => setMostrarDiario(!mostrarDiario)}
          className="text-xs font-semibold text-[#244227] hover:underline flex items-center gap-1"
        >
          <span>{mostrarDiario ? "▲ Ocultar diário" : "▼ Ver diário e fotos"}</span>
          <span>({plantio.diario.length})</span>
        </button>

        {mostrarDiario && (
          <div className="space-y-3 pt-2">
            <form onSubmit={handleSubmitNota} className="space-y-2">
              <div className="flex gap-2 items-center">
                <input
                  type="text"
                  placeholder="Ex: primeira folha nasceu! / regado hoje..."
                  value={notaTexto}
                  onChange={(e) => setNotaTexto(e.target.value)}
                  className="flex-1 h-10 px-3 text-xs rounded-xl border border-[#cfc8bf] bg-white outline-hidden focus:ring-2 focus:ring-[#244227]"
                />

                <label className="h-10 px-3 rounded-xl border border-[#cfc8bf] bg-[#f7f5f2] hover:bg-[#edeae4] text-[#244227] text-xs font-semibold flex items-center gap-1 cursor-pointer shrink-0">
                  <span>📷</span>
                  <span className="hidden sm:inline">Foto</span>
                  <input
                    type="file"
                    accept="image/*"
                    capture="environment"
                    onChange={handleSelecionarFoto}
                    className="hidden"
                  />
                </label>

                <button
                  type="submit"
                  className="h-10 px-3 rounded-xl bg-[#244227] text-white text-xs font-semibold hover:bg-[#1a301c]"
                >
                  Salvar
                </button>
              </div>

              {fotoBase64 && (
                <div className="flex items-center gap-2 bg-[#f0ede8] p-2 rounded-xl text-xs">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={fotoBase64}
                    alt="Prévia da foto"
                    className="w-10 h-10 object-cover rounded-lg"
                  />
                  <span className="text-[#3b3a37] text-[11px] flex-1">Foto anexada</span>
                  <button
                    type="button"
                    onClick={() => setFotoBase64(undefined)}
                    className="text-[#8c3f2b] text-[11px] hover:underline"
                  >
                    Remover foto
                  </button>
                </div>
              )}
            </form>

            <div className="space-y-2 max-h-48 overflow-y-auto">
              {plantio.diario.length === 0 ? (
                <p className="text-xs text-[#73706b]">Nenhum registro ainda.</p>
              ) : (
                plantio.diario.map((item) => (
                  <div
                    key={item.id}
                    className="bg-[#fbfaf9] p-2.5 rounded-lg border border-[#eeebe6] text-xs flex items-start gap-2.5"
                  >
                    {item.foto_url && (
                      <button
                        type="button"
                        onClick={() => setFotoAmpliada(item.foto_url ?? null)}
                        className="shrink-0"
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={item.foto_url}
                          alt="Foto do registro"
                          className="w-12 h-12 object-cover rounded-lg border border-[#ded8cf] hover:opacity-90"
                        />
                      </button>
                    )}
                    <div className="flex-1">
                      <p className="text-[#262422]">{item.texto}</p>
                      <span className="text-[10px] text-[#85817a]">
                        {new Date(item.data).toLocaleDateString("pt-BR")} às{" "}
                        {new Date(item.data).toLocaleTimeString("pt-BR", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>

      {fotoAmpliada && (
        <div
          className="fixed inset-0 bg-black/75 z-50 flex items-center justify-center p-4"
          onClick={() => setFotoAmpliada(null)}
        >
          <div className="max-w-md w-full bg-white rounded-2xl overflow-hidden p-3 space-y-3">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={fotoAmpliada}
              alt="Foto ampliada do cultivo"
              className="w-full rounded-xl object-contain max-h-[70vh]"
            />
            <button
              type="button"
              onClick={() => setFotoAmpliada(null)}
              className="w-full h-10 rounded-xl bg-[#244227] text-white text-xs font-semibold"
            >
              Fechar visualização
            </button>
          </div>
        </div>
      )}
    </article>
  );
}
