"use client";

import { useState } from "react";
import { Cultura } from "@/lib/recommendation/types";
import { calcularDiasPlantio, obterFaseAtual } from "@/lib/plantios/service";
import { PlantioAtivo } from "@/lib/plantios/types";

interface AbaPlantiosProps {
  plantios: PlantioAtivo[];
  culturas: Cultura[];
  onAdicionarNota: (plantioId: string, texto: string) => void;
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
          Suas plantinhas ativas aparecerão aqui com a contagem de dias, fase atual e o diário
          de evolução.
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
              onAdicionarNota={(texto) => onAdicionarNota(plantio.id, texto)}
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
  onAdicionarNota: (texto: string) => void;
  onConcluirPlantio: () => void;
}) {
  const [notaTexto, setNotaTexto] = useState("");
  const [mostrarDiario, setMostrarDiario] = useState(false);

  const dias = calcularDiasPlantio(plantio.data_plantio);
  const fase = obterFaseAtual(cultura, dias);
  const diasAteColheitaMax = cultura.dias_ate_colheita[1];
  const progresso = Math.min(100, Math.round((dias / diasAteColheitaMax) * 100));

  const handleSubmitNota = (e: React.FormEvent) => {
    e.preventDefault();
    if (!notaTexto.trim()) return;
    onAdicionarNota(notaTexto.trim());
    setNotaTexto("");
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
          <span>{dias} de ~{cultura.dias_ate_colheita[0]}-{diasAteColheitaMax} dias</span>
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

      {/* Diário de notas */}
      <div className="pt-2 border-t border-[#f0ede8] space-y-2">
        <button
          type="button"
          onClick={() => setMostrarDiario(!mostrarDiario)}
          className="text-xs font-semibold text-[#244227] hover:underline flex items-center gap-1"
        >
          <span>{mostrarDiario ? "▲ Ocultar diário" : "▼ Ver diário e anotações"}</span>
          <span>({plantio.diario.length})</span>
        </button>

        {mostrarDiario && (
          <div className="space-y-3 pt-2">
            <form onSubmit={handleSubmitNota} className="flex gap-2">
              <input
                type="text"
                placeholder="Ex: brotou hoje! / folha cresceu..."
                value={notaTexto}
                onChange={(e) => setNotaTexto(e.target.value)}
                className="flex-1 h-10 px-3 text-xs rounded-xl border border-[#cfc8bf] bg-white outline-hidden focus:ring-2 focus:ring-[#244227]"
              />
              <button
                type="submit"
                className="h-10 px-3 rounded-xl bg-[#244227] text-white text-xs font-semibold hover:bg-[#1a301c]"
              >
                Anotar
              </button>
            </form>

            <div className="space-y-1.5 max-h-40 overflow-y-auto">
              {plantio.diario.length === 0 ? (
                <p className="text-xs text-[#73706b]">Nenhuma anotação ainda.</p>
              ) : (
                plantio.diario.map((item) => (
                  <div
                    key={item.id}
                    className="bg-[#fbfaf9] p-2.5 rounded-lg border border-[#eeebe6] text-xs flex justify-between"
                  >
                    <span className="text-[#262422]">{item.texto}</span>
                    <span className="text-[10px] text-[#85817a] shrink-0 ml-2">
                      {new Date(item.data).toLocaleDateString("pt-BR")}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>
    </article>
  );
}
