import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_ai_settings_provider" AS ENUM('gemini', 'groq', 'openai', 'anthropic');
  CREATE TABLE "ai_settings" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"provider" "enum_ai_settings_provider",
  	"api_key" varchar,
  	"key_hint" varchar,
  	"model" varchar,
  	"vision_model" varchar,
  	"auto_alt" boolean DEFAULT true,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  `)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "ai_settings" CASCADE;
  DROP TYPE "public"."enum_ai_settings_provider";`)
}
