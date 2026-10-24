import { z } from "zod";

export const SintomaVisualSchema = z.enum([
  "folhas_amareladas",
  "folhas_murchas",
  "furos_folhas",
  "pontos_brancos_algodao",
  "pontos_pretos_amarelos",
  "teias_pequenas",
  "bordas_queimadas",
  "crescimento_estiolado",
]);

export const DiagnosticoResultadoSchema = z.object({
  id: z.string(),
  nome_problema: z.string(),
  gravidade: z.enum(["baixa", "moderada", "alta"]),
  causa_provavel: z.string(),
  solucao_caseira: z.string(),
  como_prevenir: z.string(),
  proxima_acao: z.string(),
});

export type SintomaVisual = z.infer<typeof SintomaVisualSchema>;
export type DiagnosticoResultado = z.infer<typeof DiagnosticoResultadoSchema>;
