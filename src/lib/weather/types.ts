import { z } from "zod";

export const LocalizacaoCidadeSchema = z.object({
  id: z.number().optional(),
  nome: z.string(),
  estado: z.string().optional(),
  pais: z.string().default("Brasil"),
  latitude: z.number(),
  longitude: z.number(),
});

export const ClimaAtualSchema = z.object({
  temperatura_c: z.number(),
  temperatura_max_c: z.number().optional(),
  temperatura_min_c: z.number().optional(),
  umidade_relativa: z.number().optional(),
  chovendo: z.boolean().default(false),
  descricao_resumida: z.string(),
});

export type LocalizacaoCidade = z.infer<typeof LocalizacaoCidadeSchema>;
export type ClimaAtual = z.infer<typeof ClimaAtualSchema>;
