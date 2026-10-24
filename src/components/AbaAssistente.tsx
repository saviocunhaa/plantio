"use client";

import { useState } from "react";
import { PlantioAtivo } from "@/lib/plantios/types";

interface MensagemChat {
  id: string;
  autor: "usuario" | "assistente";
  texto: string;
}

interface AbaAssistenteProps {
  plantios?: PlantioAtivo[];
}

export function AbaAssistente({ plantios = [] }: AbaAssistenteProps) {
  const plantiosAtivos = plantios.filter((p) => p.status === "ativo");
  const culturasNomes = plantiosAtivos.map((p) => p.cultura_nome).join(", ");

  const saudacaoInicial =
    plantiosAtivos.length > 0
      ? `Olá! Sou seu guia do Plantio Fácil 🌱. Vejo que você está cultivando: ${culturasNomes}. Tem alguma dúvida sobre rega, folhas ou adubação delas hoje?`
      : "Olá! Sou seu guia do Plantio Fácil 🌱. Posso tirar dúvidas sobre rega, adubo, folhas amareladas e colheita das suas plantas. Como posso te ajudar hoje?";

  const [mensagens, setMensagens] = useState<MensagemChat[]>([
    {
      id: "msg-1",
      autor: "assistente",
      texto: saudacaoInicial,
    },
  ]);

  const [inputTexto, setInputTexto] = useState("");

  const perguntasSugeridas = [
    "Minha folha está amarelando, o que pode ser?",
    "Com que frequência devo regar?",
    "Como saber se já está na hora de colher?",
    "Como afastar insetos com soluções caseiras?",
  ];

  const responderPergunta = (pergunta: string) => {
    const textoLower = pergunta.toLowerCase();
    let resposta =
      "Essa é uma ótima pergunta! Na horta caseira, a maioria das dúvidas se resolve observando três coisas fundamentais: horas de sol direto, umidade da terra e furos de drenagem no fundo do vaso.";

    if (textoLower.includes("amarel") || textoLower.includes("folha amarela")) {
      resposta =
        "Folhas amareladas geralmente indicam duas causas clássicas: excesso de água (solo encharcado sufoca as raízes) ou falta de nutrientes (como nitrogênio). Experimente espaçar as regas até a terra secar na superfície e adicione uma colher de húmus de minhoca ao redor do caule.";
    } else if (
      textoLower.includes("regar") ||
      textoLower.includes("agua") ||
      textoLower.includes("água")
    ) {
      resposta =
        "A regra de ouro é o teste do dedo: enfie o dedo 2 cm na terra. Se sair sujo e úmido, não precisa regar. Se sair seco e solto, regue na base até a água começar a drenar pelos furos do fundo do vaso. Sempre evite encharcar!";
    } else if (
      textoLower.includes("colher") ||
      textoLower.includes("colheita") ||
      textoLower.includes("madur")
    ) {
      resposta =
        "Para folhosas (alface, coentro, cebolinha), colha as folhas de fora para dentro e a planta continuará brotando no centro. Para frutos como tomate-cereja, colha quando estiverem totalmente vermelhos e se soltarem facilmente da haste ao girar.";
    } else if (
      textoLower.includes("inseto") ||
      textoLower.includes("praga") ||
      textoLower.includes("pulgao") ||
      textoLower.includes("bicho")
    ) {
      resposta =
        "Para pulgões ou cochonilhas, a receita caseira mais eficaz e segura é: 500 ml de água com 1 colher de chá de detergente neutro ou sabão de coco. Borrife no final da tarde diretamente onde os bichinhos estão, evitando fazer sob sol forte.";
    }

    setMensagens((prev) => [
      ...prev,
      {
        id: `user-${prev.length + 1}`,
        autor: "usuario",
        texto: pergunta,
      },
      {
        id: `assist-${prev.length + 2}`,
        autor: "assistente",
        texto: resposta,
      },
    ]);
    setInputTexto("");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputTexto.trim()) return;
    responderPergunta(inputTexto.trim());
  };

  return (
    <div className="space-y-4 flex flex-col h-[75vh]">
      <div className="bg-[#244227] text-white p-4 rounded-2xl shadow-xs">
        <h2 className="text-lg font-bold flex items-center gap-2">
          <span>💬</span>
          <span>Assistente de Cultivo</span>
        </h2>
        <p className="text-xs text-[#d4e4d5] mt-0.5">
          Respostas simples e práticas para cuidar do seu plantio sem complicação.
        </p>
      </div>

      {/* Sugestões rápidas */}
      <div className="flex gap-2 overflow-x-auto pb-1 text-xs">
        {perguntasSugeridas.map((p) => (
          <button
            key={p}
            type="button"
            onClick={() => responderPergunta(p)}
            className="px-3 py-2 rounded-full bg-white border border-[#cfc8bf] text-[#33312e] whitespace-nowrap hover:bg-[#f7f5f2] transition-colors shrink-0"
          >
            {p}
          </button>
        ))}
      </div>

      {/* Lista de mensagens */}
      <div className="flex-1 overflow-y-auto space-y-3 p-3 bg-white rounded-2xl border border-[#e8e4df]">
        {mensagens.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${
              msg.autor === "usuario" ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm ${
                msg.autor === "usuario"
                  ? "bg-[#244227] text-white"
                  : "bg-[#f5f3ef] text-[#242220] border border-[#e8e4df]"
              }`}
            >
              {msg.texto}
            </div>
          </div>
        ))}
      </div>

      {/* Input de envio */}
      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="text"
          value={inputTexto}
          onChange={(e) => setInputTexto(e.target.value)}
          placeholder="Ex: Minha planta parou de crescer..."
          className="flex-1 h-12 px-4 rounded-xl border border-[#cfc8bf] bg-white text-sm outline-hidden focus:ring-2 focus:ring-[#244227]"
        />
        <button
          type="submit"
          className="h-12 px-5 rounded-xl bg-[#244227] text-white font-semibold text-sm hover:bg-[#1a301c] transition-colors"
        >
          Enviar
        </button>
      </form>
    </div>
  );
}
