import { NextResponse } from "next/server";
import { processarPerguntaAssistente } from "@/lib/assistant/engine";
import { InputAssistenteSchema } from "@/lib/assistant/types";
import { logger } from "@/lib/logger";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as unknown;
    const parsed = InputAssistenteSchema.safeParse(body);

    if (!parsed.success) {
      logger.warn({ issues: parsed.error.issues }, "Payload inválido para /api/assistente");
      return NextResponse.json(
        { erro: "Dados inválidos", detalhes: parsed.error.issues },
        { status: 400 }
      );
    }

    const resultado = await processarPerguntaAssistente(parsed.data);
    return NextResponse.json(resultado);
  } catch (erro) {
    logger.error({ erro }, "Erro inesperado ao processar pergunta no assistente");
    return NextResponse.json(
      { erro: "Falha interna ao processar consulta" },
      { status: 500 }
    );
  }
}
