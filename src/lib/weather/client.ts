import { ClimaAtual, LocalizacaoCidade } from "./types";

interface OpenMeteoGeoResult {
  id?: number;
  name: string;
  admin1?: string;
  country?: string;
  latitude: number;
  longitude: number;
}

interface OpenMeteoWeatherResult {
  current?: {
    temperature_2m?: number;
    relative_humidity_2m?: number;
    precipitation?: number;
  };
  daily?: {
    temperature_2m_max?: number[];
    temperature_2m_min?: number[];
  };
}

export async function buscarCidades(
  nome: string,
  fetchFn: typeof fetch = fetch
): Promise<LocalizacaoCidade[]> {
  const query = nome.trim();
  if (query.length < 2) return [];

  const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(
    query
  )}&count=5&language=pt&format=json`;

  try {
    const res = await fetchFn(url, { signal: AbortSignal.timeout(5000) });
    if (!res.ok) return [];

    const data = (await res.json()) as { results?: OpenMeteoGeoResult[] };
    if (!data.results || !Array.isArray(data.results)) return [];

    return data.results.map((r) => ({
      id: r.id,
      nome: r.name,
      estado: r.admin1,
      pais: r.country || "Brasil",
      latitude: r.latitude,
      longitude: r.longitude,
    }));
  } catch {
    return [];
  }
}

export async function obterClimaPorCoordenadas(
  latitude: number,
  longitude: number,
  fetchFn: typeof fetch = fetch
): Promise<ClimaAtual | null> {
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,precipitation&daily=temperature_2m_max,temperature_2m_min&timezone=auto`;

  try {
    const res = await fetchFn(url, { signal: AbortSignal.timeout(5000) });
    if (!res.ok) return null;

    const data = (await res.json()) as OpenMeteoWeatherResult;
    const temp = data.current?.temperature_2m ?? 24;
    const chovendo = (data.current?.precipitation ?? 0) > 0.2;
    const tempMax = data.daily?.temperature_2m_max?.[0];
    const tempMin = data.daily?.temperature_2m_min?.[0];

    let descricao = "Tempo estável";
    if (chovendo) {
      descricao = "Chuva no local (não precisa regar agora)";
    } else if (temp > 28) {
      descricao = "Dia quente e ensolarado";
    } else if (temp < 18) {
      descricao = "Dia ameno e fresco";
    }

    return {
      temperatura_c: Math.round(temp),
      temperatura_max_c: tempMax ? Math.round(tempMax) : undefined,
      temperatura_min_c: tempMin ? Math.round(tempMin) : undefined,
      umidade_relativa: data.current?.relative_humidity_2m,
      chovendo,
      descricao_resumida: descricao,
    };
  } catch {
    return null;
  }
}
