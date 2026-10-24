import { describe, expect, it } from "vitest";
import { POST } from "./route";

describe("POST /api/recomendar", () => {
  it("retorna lista ordenada de recomendações para parâmetros válidos", async () => {
    const req = new Request("http://localhost:3000/api/recomendar", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        mes: 10,
        tipo_espaco: "vaso",
        sol_horas: 5,
        temperatura_media_c: 24,
        tem_agua_facil: true,
      }),
    });

    const res = await POST(req);
    expect(res.status).toBe(200);

    const data = await res.json();
    expect(Array.isArray(data.data)).toBe(true);
    expect(data.total).toBeGreaterThan(0);
    expect(data.data[0].status).toBe("ideal_agora");
  });

  it("retorna 400 quando o payload não atende aos tipos exigidos", async () => {
    const req = new Request("http://localhost:3000/api/recomendar", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        mes: 13, // Mês inválido
        tipo_espaco: "espaco_inexistente",
      }),
    });

    const res = await POST(req);
    expect(res.status).toBe(400);

    const body = await res.json();
    expect(body.erro).toBe("Parâmetros inválidos para recomendação");
  });
});
