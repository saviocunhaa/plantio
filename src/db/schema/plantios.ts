import { boolean, numeric, pgTable, text, timestamp } from "drizzle-orm/pg-core";

export const usuarios = pgTable("usuarios", {
  id: text("id").primaryKey(),
  email: text("email").unique(),
  criado_em: timestamp("criado_em", { withTimezone: true }).defaultNow().notNull(),
});

export const locais = pgTable("locais", {
  id: text("id").primaryKey(),
  usuario_id: text("usuario_id").references(() => usuarios.id, { onDelete: "cascade" }),
  cidade: text("cidade").notNull(),
  estado: text("estado"),
  latitude: numeric("latitude", { precision: 9, scale: 6 }),
  longitude: numeric("longitude", { precision: 9, scale: 6 }),
  criado_em: timestamp("criado_em", { withTimezone: true }).defaultNow().notNull(),
});

export const plantios = pgTable("plantios", {
  id: text("id").primaryKey(),
  usuario_id: text("usuario_id").references(() => usuarios.id, { onDelete: "cascade" }),
  cultura_id: text("cultura_id").notNull(),
  cultura_nome: text("cultura_nome").notNull(),
  tipo_espaco: text("tipo_espaco").notNull(),
  data_plantio: timestamp("data_plantio", { withTimezone: true }).notNull(),
  status: text("status").default("ativo").notNull(),
  criado_em: timestamp("criado_em", { withTimezone: true }).defaultNow().notNull(),
});

export const tarefas = pgTable("tarefas", {
  id: text("id").primaryKey(),
  plantio_id: text("plantio_id")
    .references(() => plantios.id, { onDelete: "cascade" })
    .notNull(),
  titulo: text("titulo").notNull(),
  fase_nome: text("fase_nome").notNull(),
  concluida: boolean("concluida").default(false).notNull(),
  data_execucao: timestamp("data_execucao", { withTimezone: true }).notNull(),
  criado_em: timestamp("criado_em", { withTimezone: true }).defaultNow().notNull(),
});

export const diario = pgTable("diario", {
  id: text("id").primaryKey(),
  plantio_id: text("plantio_id")
    .references(() => plantios.id, { onDelete: "cascade" })
    .notNull(),
  texto: text("texto").notNull(),
  foto_url: text("foto_url"),
  data: timestamp("data", { withTimezone: true }).defaultNow().notNull(),
  criado_em: timestamp("criado_em", { withTimezone: true }).defaultNow().notNull(),
});
