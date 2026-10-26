import { z } from "zod";

export const CategoriaCulturaSchema = z.enum([
  "folha",
  "fruto",
  "raiz",
  "erva",
  "leguminosa",
]);

export const TipoEspacoSchema = z.enum([
  "vaso",
  "quintal_pequeno",
  "terreno_medio",
  "terra_grande",
]);

export const StatusRecomendacaoSchema = z.enum([
  "ideal_agora",
  "possivel",
  "esperar",
  "nao_recomendado",
]);

export const TarefaFaseSchema = z.object({
  titulo: z.string(),
  como_fazer: z.string(),
  frequencia_dias: z.number().int().min(1),
});

export const FaseCulturaSchema = z.object({
  id: z.string(),
  nome: z.string(),
  dias_inicio: z.number().int().min(0),
  dias_fim: z.number().int().min(1),
  tarefas: z.array(TarefaFaseSchema),
  o_que_observar: z.string(),
});

export const PragaCulturaSchema = z.object({
  nome: z.string(),
  sintomas: z.string(),
  solucao_caseira: z.string(),
});

export const CulturaSchema = z.object({
  id: z.string(),
  nome: z.string(),
  categoria: CategoriaCulturaSchema,
  dificuldade: z.number().int().min(1).max(5),
  dias_germinacao: z.tuple([z.number(), z.number()]),
  dias_ate_colheita: z.tuple([z.number(), z.number()]),
  temp_ideal_c: z.tuple([z.number(), z.number()]),
  temp_risco_c: z.object({
    min: z.number(),
    max: z.number(),
  }),
  sol_horas_min: z.number().min(1),
  agua: z.enum(["pouca", "regular", "abundante"]),
  espaco: z.object({
    permite_vaso: z.boolean(),
    vaso_litros_min: z.number().optional(),
    espaco_m2_por_planta: z.number(),
    permite_apartamento: z.boolean(),
  }),
  meses_plantio_geral: z.array(z.number().int().min(1).max(12)),
  descricao_curta: z.string(),
  dica_iniciante: z.string(),
  ponto_de_colheita: z.string(),
  materiais_iniciais: z.array(z.string()).default([]),
  fases: z.array(FaseCulturaSchema).default([]),
  pragas_comuns: z.array(PragaCulturaSchema).default([]),
  fontes: z.array(z.string()),
  verificar: z.boolean().optional(),
  aviso_seguranca: z.string().optional(),
});

export const InputRecomendacaoSchema = z.object({
  mes: z.number().int().min(1).max(12),
  tipo_espaco: TipoEspacoSchema,
  sol_horas: z.number().min(0).max(24),
  temperatura_media_c: z.number().min(-10).max(50),
  tem_agua_facil: z.boolean().default(true),
});

export const ItemRecomendadoSchema = z.object({
  cultura: CulturaSchema,
  status: StatusRecomendacaoSchema,
  pontuacao: z.number().min(0).max(100),
  motivos: z.array(z.string()),
  avisos: z.array(z.string()),
});

export type CategoriaCultura = z.infer<typeof CategoriaCulturaSchema>;
export type TipoEspaco = z.infer<typeof TipoEspacoSchema>;
export type StatusRecomendacao = z.infer<typeof StatusRecomendacaoSchema>;
export type TarefaFase = z.infer<typeof TarefaFaseSchema>;
export type FaseCultura = z.infer<typeof FaseCulturaSchema>;
export type PragaCultura = z.infer<typeof PragaCulturaSchema>;
export type Cultura = z.infer<typeof CulturaSchema>;
export type InputRecomendacao = z.infer<typeof InputRecomendacaoSchema>;
export type ItemRecomendado = z.infer<typeof ItemRecomendadoSchema>;
