import { describe, expect, it } from "vitest";
import culturasData from "../../data/culturas.json";
import { gerarRecomendacoes } from "./engine";
import { Cultura, InputRecomendacao } from "./types";

const culturas = culturasData as Cultura[];

describe("Motor de Recomendação Agronômica", () => {
  it("recomenda folhosas e ervas fáceis para apartamento com vasos e 4h de sol", () => {
    const input: InputRecomendacao = {
      mes: 4,
      tipo_espaco: "vaso",
      sol_horas: 4,
      temperatura_media_c: 22,
      tem_agua_facil: true,
    };

    const resultado = gerarRecomendacoes(culturas, input);

    expect(resultado.length).toBeGreaterThan(0);

    const alface = resultado.find((item) => item.cultura.id === "alface");
    expect(alface).toBeDefined();
    expect(alface?.status).toBe("ideal_agora");
    expect(alface?.pontuacao).toBeGreaterThanOrEqual(75);

    const feijao = resultado.find((item) => item.cultura.id === "feijao-de-corda");
    expect(feijao).toBeDefined();
    expect(feijao?.status).toBe("nao_recomendado");
    expect(feijao?.avisos).toContain(
      "Não recomendado para plantio em vasos ou espaços confinados."
    );
  });

  it("bloqueia culturas que exigem muito sol quando o espaço tem pouca luz", () => {
    const input: InputRecomendacao = {
      mes: 5,
      tipo_espaco: "quintal_pequeno",
      sol_horas: 2,
      temperatura_media_c: 24,
      tem_agua_facil: true,
    };

    const resultado = gerarRecomendacoes(culturas, input);
    const tomate = resultado.find((item) => item.cultura.id === "tomate-cereja");

    expect(tomate).toBeDefined();
    expect(tomate?.status).toBe("nao_recomendado");
    expect(tomate?.avisos.some((a) => a.includes("Insolação insuficiente"))).toBe(true);
  });

  it("sinaliza para esperar quando a temperatura está fora dos limites de risco", () => {
    const inputFrio: InputRecomendacao = {
      mes: 7,
      tipo_espaco: "quintal_pequeno",
      sol_horas: 6,
      temperatura_media_c: 2,
      tem_agua_facil: true,
    };

    const resultado = gerarRecomendacoes(culturas, inputFrio);
    const coentro = resultado.find((item) => item.cultura.id === "coentro");

    expect(coentro).toBeDefined();
    expect(coentro?.status).toBe("esperar");
    expect(coentro?.avisos.some((a) => a.includes("Frio excessivo"))).toBe(true);
  });

  it("ordena resultados prioritariamente por status e depois por pontuação decrescente", () => {
    const input: InputRecomendacao = {
      mes: 3,
      tipo_espaco: "quintal_pequeno",
      sol_horas: 6,
      temperatura_media_c: 25,
      tem_agua_facil: true,
    };

    const resultado = gerarRecomendacoes(culturas, input);

    const indicesIdeal = resultado
      .map((item, idx) => (item.status === "ideal_agora" ? idx : -1))
      .filter((idx) => idx !== -1);

    const indicesNaoRecomendado = resultado
      .map((item, idx) => (item.status === "nao_recomendado" ? idx : -1))
      .filter((idx) => idx !== -1);

    if (indicesIdeal.length > 0 && indicesNaoRecomendado.length > 0) {
      expect(Math.max(...indicesIdeal)).toBeLessThan(Math.min(...indicesNaoRecomendado));
    }

    const apenasIdeais = resultado.filter((r) => r.status === "ideal_agora");
    for (let i = 0; i < apenasIdeais.length - 1; i++) {
      expect(apenasIdeais[i].pontuacao).toBeGreaterThanOrEqual(
        apenasIdeais[i + 1].pontuacao
      );
    }
  });
});
