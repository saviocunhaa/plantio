"use client";

import { useState } from "react";
import { PlantioAtivo } from "@/lib/plantios/types";

interface MensagemChat {
  id: string;
  autor: "usuario" | "assistente";
  texto: string;
  proximaAcao?: string;
  fonte?: "gemma" | "base_agronomica";
}

interface AbaAssistenteProps {
  plantios?: PlantioAtivo[];
}

let contadorMensagens = 0;
function gerarIdMensagem(prefixo: string): string {
  contadorMensagens += 1;
  return `${prefixo}-${contadorMensagens}`;
}

export function AbaAssistente({ plantios = [] }: AbaAssistenteProps) {
  const plantiosAtivos = plantios.filter((p) => p.status === "ativo");
  const primeiroAtivo = plantiosAtivos[0];
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
      fonte: "base_agronomica",
    },
  ]);

  const [inputTexto, setInputTexto] = useState("");
  const [carregando, setCarregando] = useState(false);

  const perguntasSugeridas = [
    "Minha folha está amarelando, o que pode ser?",
    "Com que frequência devo regar?",
    "Como saber se já está na hora de colher?",
    "Como afastar insetos com soluções caseiras?",
  ];

  const enviarPergunta = async (pergunta: string) => {
    if (!pergunta.trim() || carregando) return;

    const novaMensagemUsuario: MensagemChat = {
      id: gerarIdMensagem("user"),
      autor: "usuario",
      texto: pergunta.trim(),
    };

    setMensagens((prev) => [...prev, novaMensagemUsuario]);
    setInputTexto("");
    setCarregando(true);

    try {
      const response = await fetch("/api/assistente", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mensagem: pergunta.trim(),
          cultura_id: primeiroAtivo?.cultura_id,
          cultura_nome: primeiroAtivo?.cultura_nome,
          tipo_espaco: primeiroAtivo?.tipo_espaco,
        }),
      });

      if (!response.ok) {
        throw new Error("Falha na resposta do assistente");
      }

      const data = (await response.json()) as {
        resposta: string;
        fonte: "gemma" | "base_agronomica";
        proxima_acao: string;
      };

      setMensagens((prev) => [
        ...prev,
        {
          id: gerarIdMensagem("assist"),
          autor: "assistente",
          texto: data.resposta,
          proximaAcao: data.proxima_acao,
          fonte: data.fonte,
        },
      ]);
    } catch {
      setMensagens((prev) => [
        ...prev,
        {
          id: gerarIdMensagem("assist-erro"),
          autor: "assistente",
          texto:
            "Não consegui consultar o guia no momento. Lembre-se: em caso de dúvida com sua planta, regue apenas se a terra estiver seca e evite produtos químicos.",
          fonte: "base_agronomica",
        },
      ]);
    } finally {
      setCarregando(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    void enviarPergunta(inputTexto);
  };

  return (
    <div className="space-y-4 flex flex-col h-[75vh]">
      <div className="bg-[#244227] text-white p-4 rounded-2xl shadow-xs">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold flex items-center gap-2">
            <span>💬</span>
            <span>Assistente de Cultivo</span>
          </h2>
          <span className="text-[11px] bg-[#1a301c] px-2.5 py-1 rounded-full text-[#c1e2c4]">
            IA & Embrapa
          </span>
        </div>
        <p className="text-xs text-[#d4e4d5] mt-1">
          Tira-dúvidas seguro sem jargões. Conhecimento agronômico verificado.
        </p>
      </div>

      {/* Sugestões rápidas */}
      <div className="flex gap-2 overflow-x-auto pb-1 text-xs">
        {perguntasSugeridas.map((p) => (
          <button
            key={p}
            type="button"
            disabled={carregando}
            onClick={() => void enviarPergunta(p)}
            className="px-3 py-2 rounded-full bg-white border border-[#cfc8bf] text-[#33312e] whitespace-nowrap hover:bg-[#f7f5f2] disabled:opacity-50 transition-colors shrink-0"
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
              className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm space-y-2 ${
                msg.autor === "usuario"
                  ? "bg-[#244227] text-white"
                  : "bg-[#f5f3ef] text-[#242220] border border-[#e8e4df]"
              }`}
            >
              <p className="leading-relaxed">{msg.texto}</p>

              {msg.proximaAcao && (
                <div className="bg-[#eaf3eb] text-[#1e3d22] text-xs p-2 rounded-xl font-medium border border-[#cbe1ce]">
                  <strong>💡 O que fazer hoje: </strong>
                  {msg.proximaAcao}
                </div>
              )}

              {msg.fonte && msg.autor === "assistente" && (
                <div className="text-[10px] text-[#73706b] flex items-center gap-1">
                  <span>Fonte:</span>
                  <span>
                    {msg.fonte === "gemma"
                      ? "Gemma 4 (IA Local)"
                      : "Base Técnica Agronômica (Embrapa)"}
                  </span>
                </div>
              )}
            </div>
          </div>
        ))}

        {carregando && (
          <div className="flex justify-start">
            <div className="bg-[#f5f3ef] text-[#595550] border border-[#e8e4df] rounded-2xl px-4 py-3 text-xs italic flex items-center gap-2">
              <span className="inline-block animate-spin">🌱</span>
              Consultando guia agronômico...
            </div>
          </div>
        )}
      </div>

      {/* Input de envio */}
      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="text"
          value={inputTexto}
          disabled={carregando}
          onChange={(e) => setInputTexto(e.target.value)}
          placeholder="Ex: Minhas folhas estão amarelando..."
          className="flex-1 h-12 px-4 rounded-xl border border-[#cfc8bf] bg-white text-sm outline-hidden focus:ring-2 focus:ring-[#244227] disabled:opacity-60"
        />
        <button
          type="submit"
          disabled={carregando || !inputTexto.trim()}
          className="h-12 px-5 rounded-xl bg-[#244227] text-white font-semibold text-sm hover:bg-[#1a301c] disabled:opacity-50 transition-colors"
        >
          Enviar
        </button>
      </form>
    </div>
  );
}
