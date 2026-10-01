import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

// The new default ('studio') is set in the next migration: Postgres does not allow a freshly
// added enum value to be used inside the transaction that adds it.
export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TYPE "public"."enum_theme_preset" ADD VALUE 'studio' BEFORE 'classic';
  ALTER TYPE "public"."enum_theme_preset" ADD VALUE 'midnight' BEFORE 'auto';
  ALTER TYPE "public"."enum_theme_preset" ADD VALUE 'olive' BEFORE 'auto';
  ALTER TYPE "public"."enum_theme_preset" ADD VALUE 'teal' BEFORE 'auto';
  ALTER TYPE "public"."enum_theme_preset" ADD VALUE 'brick' BEFORE 'auto';
  ALTER TYPE "public"."enum_theme_preset" ADD VALUE 'lime' BEFORE 'auto';
  ALTER TYPE "public"."enum_theme_preset" ADD VALUE 'mono' BEFORE 'auto';
  ALTER TYPE "public"."enum__theme_v_version_preset" ADD VALUE 'studio' BEFORE 'classic';
  ALTER TYPE "public"."enum__theme_v_version_preset" ADD VALUE 'midnight' BEFORE 'auto';
  ALTER TYPE "public"."enum__theme_v_version_preset" ADD VALUE 'olive' BEFORE 'auto';
  ALTER TYPE "public"."enum__theme_v_version_preset" ADD VALUE 'teal' BEFORE 'auto';
  ALTER TYPE "public"."enum__theme_v_version_preset" ADD VALUE 'brick' BEFORE 'auto';
  ALTER TYPE "public"."enum__theme_v_version_preset" ADD VALUE 'lime' BEFORE 'auto';
  ALTER TYPE "public"."enum__theme_v_version_preset" ADD VALUE 'mono' BEFORE 'auto';`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "theme" ALTER COLUMN "preset" SET DATA TYPE text;
  ALTER TABLE "theme" ALTER COLUMN "preset" SET DEFAULT 'limestone'::text;
  DROP TYPE "public"."enum_theme_preset";
  CREATE TYPE "public"."enum_theme_preset" AS ENUM('classic', 'limestone', 'graphite', 'steel', 'forest', 'amber', 'auto');
  ALTER TABLE "theme" ALTER COLUMN "preset" SET DEFAULT 'limestone'::"public"."enum_theme_preset";
  ALTER TABLE "theme" ALTER COLUMN "preset" SET DATA TYPE "public"."enum_theme_preset" USING "preset"::"public"."enum_theme_preset";
  ALTER TABLE "_theme_v" ALTER COLUMN "version_preset" SET DATA TYPE text;
  ALTER TABLE "_theme_v" ALTER COLUMN "version_preset" SET DEFAULT 'limestone'::text;
  DROP TYPE "public"."enum__theme_v_version_preset";
  CREATE TYPE "public"."enum__theme_v_version_preset" AS ENUM('classic', 'limestone', 'graphite', 'steel', 'forest', 'amber', 'auto');
  ALTER TABLE "_theme_v" ALTER COLUMN "version_preset" SET DEFAULT 'limestone'::"public"."enum__theme_v_version_preset";
  ALTER TABLE "_theme_v" ALTER COLUMN "version_preset" SET DATA TYPE "public"."enum__theme_v_version_preset" USING "version_preset"::"public"."enum__theme_v_version_preset";`)
}
