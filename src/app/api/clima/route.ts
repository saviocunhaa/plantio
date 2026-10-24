import { NextResponse } from "next/server";
import { buscarCidades, obterClimaPorCoordenadas } from "@/lib/weather/client";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const cidade = searchParams.get("cidade");
  const latStr = searchParams.get("lat");
  const lonStr = searchParams.get("lon");

  if (cidade) {
    const cidades = await buscarCidades(cidade);
    return NextResponse.json({ cidades });
  }

  if (latStr && lonStr) {
    const lat = parseFloat(latStr);
    const lon = parseFloat(lonStr);
    if (isNaN(lat) || isNaN(lon)) {
      return NextResponse.json({ erro: "Coordenadas inválidas" }, { status: 400 });
    }

    const clima = await obterClimaPorCoordenadas(lat, lon);
    return NextResponse.json({ clima });
  }

  return NextResponse.json(
    { erro: "Parâmetros insuficientes. Forneça 'cidade' ou 'lat'/'lon'." },
    { status: 400 }
  );
}
