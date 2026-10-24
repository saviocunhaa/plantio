import { z } from "zod";

export const InputAssistenteSchema = z.object({
  mensagem: z.string().trim().min(1, "A pergunta não pode estar vazia.").max(1000),
  cultura_id: z.string().optional(),
  cultura_nome: z.string().optional(),
  fase_atual: z.string().optional(),
  dias_desde_plantio: z.number().int().min(0).optional(),
  tipo_espaco: z.string().optional(),
  cidade: z.string().optional(),
  tarefas_pendentes: z.array(z.string()).optional(),
});

export const RespostaAssistenteSchema = z.object({
  resposta: z.string(),
  fonte: z.enum(["gemma", "base_agronomica"]),
  proxima_acao: z.string(),
});

export type InputAssistente = z.infer<typeof InputAssistenteSchema>;
export type RespostaAssistente = z.infer<typeof RespostaAssistenteSchema>;
