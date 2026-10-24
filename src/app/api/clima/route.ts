import { NextResponse } from "next/server";
import {
  buscarCidades,
  obterClimaPorCoordenadas,
  obterLocalizacaoPorIP,
  obterNomePorCoordenadas,
} from "@/lib/weather/client";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const cidade = searchParams.get("cidade");
  const latStr = searchParams.get("lat");
  const lonStr = searchParams.get("lon");
  const auto = searchParams.get("auto");

  if (auto === "ip") {
    const localizacao = await obterLocalizacaoPorIP();
    if (localizacao) {
      const clima = await obterClimaPorCoordenadas(
        localizacao.latitude,
        localizacao.longitude
      );
      return NextResponse.json({ localizacao, clima });
    }
  }

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

    const [clima, infoCidade] = await Promise.all([
      obterClimaPorCoordenadas(lat, lon),
      obterNomePorCoordenadas(lat, lon),
    ]);

    return NextResponse.json({ clima, cidade: infoCidade });
  }

  return NextResponse.json(
    { erro: "Parâmetros insuficientes. Forneça 'cidade', 'lat'/'lon' ou 'auto=ip'." },
    { status: 400 }
  );
}
