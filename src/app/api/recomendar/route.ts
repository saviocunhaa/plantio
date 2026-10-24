import { NextResponse } from "next/server";
import culturasData from "@/data/culturas.json";
import { gerarRecomendacoes } from "@/lib/recommendation/engine";
import {
  Cultura,
  InputRecomendacaoSchema,
} from "@/lib/recommendation/types";

const culturas = culturasData as Cultura[];

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = InputRecomendacaoSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          erro: "Parâmetros inválidos para recomendação",
          detalhes: parsed.error.flatten(),
        },
        { status: 400 }
      );
    }

    const recomendacoes = gerarRecomendacoes(culturas, parsed.data);

    return NextResponse.json({
      data: recomendacoes,
      total: recomendacoes.length,
    });
  } catch {
    return NextResponse.json(
      { erro: "Falha ao processar solicitação de recomendação" },
      { status: 500 }
    );
  }
}
