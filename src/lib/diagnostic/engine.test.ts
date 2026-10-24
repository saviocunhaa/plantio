import { describe, expect, it } from "vitest";
import { diagnosticarSintomaVisual } from "./engine";

describe("Motor de Diagnóstico Visual Foliar", () => {
  it("diagnostica corretamente folhas amareladas com orientação de rega e húmus", () => {
    const res = diagnosticarSintomaVisual({
      sintoma: "folhas_amareladas",
      cultura_nome: "Tomate-cereja",
    });

    expect(res.id).toBe("diag_amarelamento");
    expect(res.nome_problema).toContain("Tomate-cereja");
    expect(res.solucao_caseira).toContain("húmus de minhoca");
    expect(res.proxima_acao).toBeDefined();
  });

  it("oferece receita de sabão neutro para ataque de lagartas com furos nas folhas", () => {
    const res = diagnosticarSintomaVisual({
      sintoma: "furos_folhas",
      cultura_nome: "Alface",
    });

    expect(res.id).toBe("diag_lagartas");
    expect(res.solucao_caseira).toContain("sabão neutro");
    expect(res.gravidade).toBe("moderada");
  });

  it("identifica cochonilha com solução de sabão de coco", () => {
    const res = diagnosticarSintomaVisual({
      sintoma: "pontos_brancos_algodao",
    });

    expect(res.id).toBe("diag_cochonilha");
    expect(res.solucao_caseira).toContain("sabão de coco");
    expect(res.gravidade).toBe("alta");
  });
});
