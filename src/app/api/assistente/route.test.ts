import { describe, expect, it, vi } from "vitest";

vi.mock("server-only", () => ({}));

import { POST } from "./route";

describe("API /api/assistente", () => {
  it("rejeita requisições com mensagem vazia com status 400", async () => {
    const req = new Request("http://localhost:3000/api/assistente", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ mensagem: "" }),
    });

    const res = await POST(req);
    expect(res.status).toBe(400);

    const json = (await res.json()) as { erro: string };
    expect(json.erro).toBe("Dados inválidos");
  });

  it("responde dúvidas sobre folhas amareladas com orientação segura e ação prática", async () => {
    const req = new Request("http://localhost:3000/api/assistente", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        mensagem: "Minhas folhas estão amarelando, o que faço?",
        cultura_id: "tomate-cereja",
        tipo_espaco: "vaso",
      }),
    });

    const res = await POST(req);
    expect(res.status).toBe(200);

    const json = (await res.json()) as { resposta: string; proxima_acao: string; fonte: string };
    expect(json.resposta).toContain("Folhas amareladas");
    expect(json.proxima_acao).toBeDefined();
    expect(json.fonte).toBe("base_agronomica");
  });

  it("oferece solução caseira para pragas identificadas da cultura", async () => {
    const req = new Request("http://localhost:3000/api/assistente", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        mensagem: "Tem lagartas minúsculas comendo as folhas",
        cultura_id: "alface",
      }),
    });

    const res = await POST(req);
    expect(res.status).toBe(200);

    const json = (await res.json()) as { resposta: string };
    expect(json.resposta).toContain("Lagartas minúsculas");
    expect(json.resposta).toContain("sabão neutro");
  });
});
