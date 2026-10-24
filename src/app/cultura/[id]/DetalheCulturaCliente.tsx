"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Cultura } from "@/lib/recommendation/types";
import { carregarPlantiosStorage, salvarPlantiosStorage } from "@/lib/plantios/service";
import { PlantioAtivo } from "@/lib/plantios/types";

export function DetalheCulturaCliente({ cultura }: { cultura: Cultura }) {
  const router = useRouter();
  const [iniciado, setIniciado] = useState(false);

  const handleIniciarPlantio = () => {
    const existentes = carregarPlantiosStorage();
    const novoPlantio: PlantioAtivo = {
      id: `plantio_${Date.now()}`,
      cultura_id: cultura.id,
      cultura_nome: cultura.nome,
      tipo_espaco: cultura.espaco.permite_vaso ? "vaso" : "quintal_pequeno",
      data_plantio: new Date().toISOString(),
      status: "ativo",
      diario: [
        {
          id: `nota_${Date.now()}`,
          data: new Date().toISOString(),
          texto: `Início do cultivo de ${cultura.nome}!`,
        },
      ],
      tarefas_concluidas: {},
    };

    salvarPlantiosStorage([novoPlantio, ...existentes]);
    setIniciado(true);

    setTimeout(() => {
      router.push("/?aba=plantios");
    }, 600);
  };

  return (
    <div className="pt-2">
      <button
        type="button"
        onClick={handleIniciarPlantio}
        disabled={iniciado}
        className="w-full h-12 rounded-xl bg-[#244227] text-white font-semibold text-base hover:bg-[#1a301c] transition-colors flex items-center justify-center gap-2 shadow-sm"
      >
        <span>{iniciado ? "✓ Plantio adicionado!" : `Começar a plantar ${cultura.nome} agora`}</span>
        <span>→</span>
      </button>
    </div>
  );
}
