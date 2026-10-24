import { describe, expect, it } from "vitest";
import culturasData from "@/data/culturas.json";
import { Cultura } from "@/lib/recommendation/types";
import { calcularEspacoPlantio } from "./engine";

const culturas = culturasData as Cultura[];

describe("Calculadora Agronômica de Plantio", () => {
  const alface = culturas.find((c) => c.id === "alface")!;
  const tomate = culturas.find((c) => c.id === "tomate-cereja")!;

  it("calcula mudas e terra para alface em jardineira de 15L", () => {
    const res = calcularEspacoPlantio(alface, { modo: "vaso", vaso_litros: 15 });
    expect(res.quantidade_plantas).toBeGreaterThanOrEqual(3);
    expect(res.volume_substrato_litros).toBe(15);
    expect(res.economia_estimada_reais).toBeGreaterThan(0);
  });

  it("calcula plantas e espaçamento para tomate-cereja em canteiro de 2 m²", () => {
    const res = calcularEspacoPlantio(tomate, { modo: "canteiro", canteiro_m2: 2 });
    expect(res.quantidade_plantas).toBe(8); // 2m² / 0.25m² por planta = 8 plantas
    expect(res.volume_substrato_litros).toBe(400); // 2 * 200L
    expect(res.espacamento_sugerido_cm).toBe(50); // sqrt(0.25 * 10000) = 50 cm
  });
});
