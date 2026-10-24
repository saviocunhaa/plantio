import { z } from "zod";
import { TipoEspacoSchema } from "../recommendation/types";

export const EntradaDiarioSchema = z.object({
  id: z.string(),
  data: z.string(),
  texto: z.string(),
  foto_url: z.string().optional(),
});

export const TarefaExecutadaSchema = z.object({
  id: z.string(),
  plantio_id: z.string(),
  titulo: z.string(),
  fase_nome: z.string(),
  data_execucao: z.string(),
  concluida: z.boolean(),
});

export const PlantioAtivoSchema = z.object({
  id: z.string(),
  cultura_id: z.string(),
  cultura_nome: z.string(),
  tipo_espaco: TipoEspacoSchema,
  data_plantio: z.string(),
  status: z.enum(["ativo", "colhido", "perdido"]).default("ativo"),
  diario: z.array(EntradaDiarioSchema).default([]),
  tarefas_concluidas: z.record(z.string(), z.boolean()).default({}),
});

export type EntradaDiario = z.infer<typeof EntradaDiarioSchema>;
export type TarefaExecutada = z.infer<typeof TarefaExecutadaSchema>;
export type PlantioAtivo = z.infer<typeof PlantioAtivoSchema>;
