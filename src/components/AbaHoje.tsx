"use client";

import { useState } from "react";
import { Cultura } from "@/lib/recommendation/types";
import { gerarTarefasHoje, TarefaHoje } from "@/lib/plantios/service";
import { PlantioAtivo } from "@/lib/plantios/types";

interface AbaHojeProps {
  plantios: PlantioAtivo[];
  culturas: Cultura[];
  onAlternarTarefa: (tarefaId: string, plantioId: string) => void;
  onIrParaPlantar: () => void;
  onAbrirDiagnostico?: () => void;
  clima?: {
    temperatura_c: number;
    chuva_mm: number;
    descricao?: string;
  };
  cidadeNome?: string;
}

export function AbaHoje({
  plantios,
  culturas,
  onAlternarTarefa,
  onIrParaPlantar,
  onAbrirDiagnostico,
  clima,
  cidadeNome,
}: AbaHojeProps) {
  const tarefas = gerarTarefasHoje(plantios, culturas);
  const totalTarefas = tarefas.length;
  const concluidas = tarefas.filter((t) => t.concluida).length;
  const plantiosAtivos = plantios.filter((p) => p.status === "ativo");

  const [lembretesAtivos, setLembretesAtivos] = useState<boolean>(() => {
    if (typeof window === "undefined" || !("Notification" in window)) return false;
    return Notification.permission === "granted";
  });

  const handleAtivarLembretes = async () => {
    if (typeof window === "undefined" || !("Notification" in window)) {
      alert("Seu navegador não tem suporte a notificações web.");
      return;
    }
    const permissao = await Notification.requestPermission();
    if (permissao === "granted") {
      setLembretesAtivos(true);
      new Notification("🌱 Plantio Fácil", {
        body: "Lembretes ativados com sucesso! Avisaremos sobre as tarefas do seu cultivo.",
      });
    }
  };

  if (plantiosAtivos.length === 0) {
    return (
      <div className="bg-white rounded-2xl p-6 border border-[#e8e4df] text-center space-y-4">
        <span className="text-4xl" role="img" aria-label="Planta">
          🪴
        </span>
        <h2 className="text-xl font-bold text-[#1f291e]">Nenhum plantio ativo hoje</h2>
        <p className="text-sm text-[#57544f] max-w-md mx-auto">
          Você ainda não começou nenhuma plantação. Escolha uma hortaliça ou tempero para
          começar e receber o passo a passo diário!
        </p>
        <button
          type="button"
          onClick={onIrParaPlantar}
          className="w-full sm:w-auto px-6 h-12 rounded-xl bg-[#244227] text-white font-semibold text-sm hover:bg-[#1a301c] transition-colors"
        >
          Descobrir o que plantar agora →
        </button>
      </div>
    );
  }

  const vaiChover = clima && clima.chuva_mm >= 3;
  const calorIntenso = clima && clima.temperatura_c >= 32;

  return (
    <div className="space-y-4">
      {/* Resumo do dia */}
      <div className="bg-[#244227] text-white rounded-2xl p-5 shadow-xs">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-[#d4e4d5] uppercase tracking-wider">
              Rotina de Hoje
            </span>
            <h2 className="text-xl font-bold mt-0.5">O que fazer hoje</h2>
            {cidadeNome && (
              <p className="text-[11px] text-[#c7dfc9] mt-0.5">
                📍 {cidadeNome} {clima ? `• ${clima.temperatura_c}°C` : ""}
              </p>
            )}
          </div>
          <div className="text-right">
            <span className="text-2xl font-bold">{concluidas}/{totalTarefas}</span>
            <span className="block text-xs text-[#d4e4d5]">concluídas</span>
          </div>
        </div>

        {totalTarefas > 0 && (
          <div className="w-full bg-[#1b321e] rounded-full h-2 mt-3 overflow-hidden">
            <div
              className="bg-[#8ec792] h-2 rounded-full transition-all duration-300"
              style={{
                width: `${(concluidas / totalTarefas) * 100}%`,
              }}
            />
          </div>
        )}
      </div>

      {/* Alerta Climático Inteligente de Rega */}
      {vaiChover && (
        <div className="bg-[#ebf4fa] border border-[#bcdbf1] rounded-2xl p-4 flex items-start gap-3">
          <span className="text-2xl">🌧️</span>
          <div className="text-xs space-y-1">
            <strong className="text-[#1a4a6e] block text-sm">
              Alerta de Chuva Hoje ({clima.chuva_mm} mm previstos)
            </strong>
            <p className="text-[#2b587a]">
              A previsão indica chuva para sua região! Se suas plantas estiverem expostas ao ar livre,
              você pode pular a rega de hoje para economizar água e não encharcar as raízes.
            </p>
          </div>
        </div>
      )}

      {calorIntenso && !vaiChover && (
        <div className="bg-[#fff9eb] border border-[#f7e0a3] rounded-2xl p-4 flex items-start gap-3">
          <span className="text-2xl">☀️</span>
          <div className="text-xs space-y-1">
            <strong className="text-[#875a12] block text-sm">
              Alerta de Calor Forte ({clima.temperatura_c}°C)
            </strong>
            <p className="text-[#6e490e]">
              Dia quente! Evite molhar as folhas no sol forte para não queimá-las. Faça as regas
              direto na terra no final da tarde ou bem cedo pela manhã.
            </p>
          </div>
        </div>
      )}

      {/* Atalhos rápidos: Lembretes e Diagnóstico */}
      <div className="grid grid-cols-2 gap-2">
        <button
          type="button"
          onClick={() => void handleAtivarLembretes()}
          className={`p-3 rounded-xl border text-xs font-semibold flex items-center gap-2 transition-all ${
            lembretesAtivos
              ? "bg-[#eef5ee] border-[#cbe1ce] text-[#1e3d22]"
              : "bg-white border-[#cfc8bf] text-[#3b3a37] hover:bg-[#f7f5f2]"
          }`}
        >
          <span>🔔</span>
          <span className="truncate">
            {lembretesAtivos ? "Lembretes Ativos" : "Ativar Lembretes"}
          </span>
        </button>

        {onAbrirDiagnostico && (
          <button
            type="button"
            onClick={onAbrirDiagnostico}
            className="p-3 rounded-xl border border-[#cfc8bf] bg-white text-[#3b3a37] hover:bg-[#f7f5f2] text-xs font-semibold flex items-center gap-2 transition-all"
          >
            <span>🔍</span>
            <span className="truncate">Diagnóstico Foliar</span>
          </button>
        )}
      </div>

      {/* Lista de tarefas do dia */}
      <div className="space-y-3">
        {tarefas.length === 0 ? (
          <div className="bg-white rounded-xl p-5 border border-[#e8e4df] text-center text-sm text-[#57544f]">
            Tudo em ordem por hoje! Suas plantas estão bem cuidadas.
          </div>
        ) : (
          tarefas.map((t) => (
            <CardTarefa
              key={t.id}
              tarefa={t}
              onToggle={() => onAlternarTarefa(t.id, t.plantioId)}
            />
          ))
        )}
      </div>
    </div>
  );
}

function CardTarefa({
  tarefa,
  onToggle,
}: {
  tarefa: TarefaHoje;
  onToggle: () => void;
}) {
  return (
    <div
      className={`rounded-2xl p-4 border transition-all ${
        tarefa.concluida
          ? "bg-[#f5f8f5] border-[#cbe1cd] opacity-80"
          : "bg-white border-[#e8e4df] shadow-xs"
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-[#244227] bg-[#eef5ee] px-2.5 py-0.5 rounded-full">
              {tarefa.culturaNome}
            </span>
            <span className="text-xs text-[#73706b]">• {tarefa.faseNome}</span>
          </div>
          <h3
            className={`text-base font-semibold ${
              tarefa.concluida ? "line-through text-[#615f5b]" : "text-[#1f291e]"
            }`}
          >
            {tarefa.titulo}
          </h3>
          <p className="text-xs text-[#57544f]">{tarefa.comoFazer}</p>
        </div>

        <button
          type="button"
          onClick={onToggle}
          className={`shrink-0 min-h-[44px] min-w-[76px] px-3 rounded-xl font-semibold text-xs transition-colors flex items-center justify-center gap-1 ${
            tarefa.concluida
              ? "bg-[#d8ebd9] text-[#1c351f] hover:bg-[#cbe1cd]"
              : "bg-[#244227] text-white hover:bg-[#1a301c]"
          }`}
        >
          <span>{tarefa.concluida ? "✓ Feito" : "Marcar feito"}</span>
        </button>
      </div>
    </div>
  );
}
