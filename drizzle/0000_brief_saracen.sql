CREATE TABLE "diario" (
	"id" text PRIMARY KEY NOT NULL,
	"plantio_id" text NOT NULL,
	"texto" text NOT NULL,
	"foto_url" text,
	"data" timestamp with time zone DEFAULT now() NOT NULL,
	"criado_em" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "locais" (
	"id" text PRIMARY KEY NOT NULL,
	"usuario_id" text,
	"cidade" text NOT NULL,
	"estado" text,
	"latitude" numeric(9, 6),
	"longitude" numeric(9, 6),
	"criado_em" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "plantios" (
	"id" text PRIMARY KEY NOT NULL,
	"usuario_id" text,
	"cultura_id" text NOT NULL,
	"cultura_nome" text NOT NULL,
	"tipo_espaco" text NOT NULL,
	"data_plantio" timestamp with time zone NOT NULL,
	"status" text DEFAULT 'ativo' NOT NULL,
	"criado_em" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "tarefas" (
	"id" text PRIMARY KEY NOT NULL,
	"plantio_id" text NOT NULL,
	"titulo" text NOT NULL,
	"fase_nome" text NOT NULL,
	"concluida" boolean DEFAULT false NOT NULL,
	"data_execucao" timestamp with time zone NOT NULL,
	"criado_em" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "usuarios" (
	"id" text PRIMARY KEY NOT NULL,
	"email" text,
	"criado_em" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "usuarios_email_unique" UNIQUE("email")
);
--> statement-breakpoint
ALTER TABLE "diario" ADD CONSTRAINT "diario_plantio_id_plantios_id_fk" FOREIGN KEY ("plantio_id") REFERENCES "public"."plantios"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "locais" ADD CONSTRAINT "locais_usuario_id_usuarios_id_fk" FOREIGN KEY ("usuario_id") REFERENCES "public"."usuarios"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "plantios" ADD CONSTRAINT "plantios_usuario_id_usuarios_id_fk" FOREIGN KEY ("usuario_id") REFERENCES "public"."usuarios"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tarefas" ADD CONSTRAINT "tarefas_plantio_id_plantios_id_fk" FOREIGN KEY ("plantio_id") REFERENCES "public"."plantios"("id") ON DELETE cascade ON UPDATE no action;