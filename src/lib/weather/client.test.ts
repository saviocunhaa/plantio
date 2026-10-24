import { describe, expect, it, vi } from "vitest";
import { buscarCidades, obterClimaPorCoordenadas } from "./client";

describe("Módulo de Clima e Geocodificação Open-Meteo", () => {
  it("retorna lista de cidades mapeadas a partir da resposta de geocodificação", async () => {
    const mockFetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        results: [
          {
            id: 1,
            name: "Juazeiro do Norte",
            admin1: "Ceará",
            country: "Brasil",
            latitude: -7.2,
            longitude: -39.3,
          },
        ],
      }),
    });

    const cidades = await buscarCidades("Juazeiro", mockFetch as unknown as typeof fetch);

    expect(cidades).toHaveLength(1);
    expect(cidades[0].nome).toBe("Juazeiro do Norte");
    expect(cidades[0].estado).toBe("Ceará");
    expect(cidades[0].latitude).toBe(-7.2);
  });

  it("retorna array vazio quando a busca tem menos de 2 caracteres ou falha", async () => {
    const cidadesVazias = await buscarCidades("a");
    expect(cidadesVazias).toEqual([]);

    const mockFetchFalha = vi.fn().mockRejectedValue(new Error("Network error"));
    const cidadesFalha = await buscarCidades(
      "Recife",
      mockFetchFalha as unknown as typeof fetch
    );
    expect(cidadesFalha).toEqual([]);
  });

  it("calcula clima e descrição resumida para coordenadas geográficas", async () => {
    const mockFetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        current: {
          temperature_2m: 29.4,
          relative_humidity_2m: 55,
          precipitation: 0.0,
        },
        daily: {
          temperature_2m_max: [33.1],
          temperature_2m_min: [22.0],
        },
      }),
    });

    const clima = await obterClimaPorCoordenadas(
      -7.2,
      -39.3,
      mockFetch as unknown as typeof fetch
    );

    expect(clima).toBeDefined();
    expect(clima?.temperatura_c).toBe(29);
    expect(clima?.chovendo).toBe(false);
    expect(clima?.descricao_resumida).toContain("quente");
  });
});
