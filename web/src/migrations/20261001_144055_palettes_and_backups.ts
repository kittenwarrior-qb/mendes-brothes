import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_theme_neutral_tone" AS ENUM('warm', 'neutral', 'cool');
  CREATE TYPE "public"."enum_theme_auto_mode" AS ENUM('light', 'dark');
  CREATE TYPE "public"."enum_theme_contrast_mode" AS ENUM('deepen', 'vivid', 'off');
  CREATE TYPE "public"."enum_theme_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__theme_v_version_preset" AS ENUM('classic', 'limestone', 'graphite', 'steel', 'forest', 'amber', 'auto');
  CREATE TYPE "public"."enum__theme_v_version_neutral_tone" AS ENUM('warm', 'neutral', 'cool');
  CREATE TYPE "public"."enum__theme_v_version_auto_mode" AS ENUM('light', 'dark');
  CREATE TYPE "public"."enum__theme_v_version_font_display" AS ENUM('preset', 'russo', 'montserrat', 'inter', 'oswald', 'barlowCondensed', 'barlow', 'archivo', 'playfair', 'dmSans');
  CREATE TYPE "public"."enum__theme_v_version_font_body" AS ENUM('preset', 'russo', 'montserrat', 'inter', 'oswald', 'barlowCondensed', 'barlow', 'archivo', 'playfair', 'dmSans');
  CREATE TYPE "public"."enum__theme_v_version_heading_case" AS ENUM('preset', 'uppercase', 'none');
  CREATE TYPE "public"."enum__theme_v_version_radius" AS ENUM('preset', 'sharp', 'soft', 'rounded');
  CREATE TYPE "public"."enum__theme_v_version_button_shape" AS ENUM('preset', 'square', 'rounded', 'pill');
  CREATE TYPE "public"."enum__theme_v_version_card_style" AS ENUM('preset', 'bordered', 'shadow', 'flat');
  CREATE TYPE "public"."enum__theme_v_version_container" AS ENUM('preset', 'narrow', 'default', 'wide');
  CREATE TYPE "public"."enum__theme_v_version_header_style" AS ENUM('preset', 'light', 'dark', 'brand');
  CREATE TYPE "public"."enum__theme_v_version_footer_style" AS ENUM('preset', 'light', 'dark');
  CREATE TYPE "public"."enum__theme_v_version_contrast_mode" AS ENUM('deepen', 'vivid', 'off');
  CREATE TYPE "public"."enum__theme_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum_backup_settings_frequency" AS ENUM('daily', 'weekly');
  CREATE TABLE "_theme_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"version_preset" "enum__theme_v_version_preset" DEFAULT 'classic',
  	"version_brand_color" varchar DEFAULT '#D96F25',
  	"version_neutral_tone" "enum__theme_v_version_neutral_tone" DEFAULT 'warm',
  	"version_auto_mode" "enum__theme_v_version_auto_mode" DEFAULT 'light',
  	"version_colors_primary" varchar,
  	"version_colors_primary_hover" varchar,
  	"version_colors_primary_deep" varchar,
  	"version_colors_accent" varchar,
  	"version_colors_heading" varchar,
  	"version_colors_text" varchar,
  	"version_colors_muted" varchar,
  	"version_colors_background" varchar,
  	"version_colors_alt" varchar,
  	"version_colors_tint" varchar,
  	"version_colors_surface" varchar,
  	"version_colors_line" varchar,
  	"version_colors_dark" varchar,
  	"version_colors_on_dark" varchar,
  	"version_font_display" "enum__theme_v_version_font_display" DEFAULT 'preset',
  	"version_font_body" "enum__theme_v_version_font_body" DEFAULT 'preset',
  	"version_heading_case" "enum__theme_v_version_heading_case" DEFAULT 'preset',
  	"version_base_font_size" numeric,
  	"version_radius" "enum__theme_v_version_radius" DEFAULT 'preset',
  	"version_button_shape" "enum__theme_v_version_button_shape" DEFAULT 'preset',
  	"version_card_style" "enum__theme_v_version_card_style" DEFAULT 'preset',
  	"version_container" "enum__theme_v_version_container" DEFAULT 'preset',
  	"version_header_style" "enum__theme_v_version_header_style" DEFAULT 'preset',
  	"version_footer_style" "enum__theme_v_version_footer_style" DEFAULT 'preset',
  	"version_sticky_header" boolean DEFAULT true,
  	"version_accessible_contrast" boolean,
  	"version_contrast_mode" "enum__theme_v_version_contrast_mode" DEFAULT 'deepen',
  	"version_animations" boolean DEFAULT true,
  	"version_custom_css" varchar,
  	"version__status" "enum__theme_v_version_status" DEFAULT 'draft',
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean,
  	"autosave" boolean
  );
  
  CREATE TABLE "backup_settings" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"auto_enabled" boolean DEFAULT true,
  	"frequency" "enum_backup_settings_frequency" DEFAULT 'daily',
  	"keep" numeric DEFAULT 7,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  ALTER TABLE "theme" ALTER COLUMN "preset" SET DATA TYPE text;
  ALTER TABLE "theme" ALTER COLUMN "preset" SET DEFAULT 'classic'::text;
  DROP TYPE "public"."enum_theme_preset";
  CREATE TYPE "public"."enum_theme_preset" AS ENUM('classic', 'limestone', 'graphite', 'steel', 'forest', 'amber', 'auto');
  ALTER TABLE "theme" ALTER COLUMN "preset" SET DEFAULT 'classic'::"public"."enum_theme_preset";
  ALTER TABLE "theme" ALTER COLUMN "preset" SET DATA TYPE "public"."enum_theme_preset" USING "preset"::"public"."enum_theme_preset";
  ALTER TABLE "theme" ALTER COLUMN "preset" DROP NOT NULL;
  ALTER TABLE "theme" ALTER COLUMN "accessible_contrast" DROP DEFAULT;
  ALTER TABLE "theme" ADD COLUMN "brand_color" varchar DEFAULT '#D96F25';
  ALTER TABLE "theme" ADD COLUMN "neutral_tone" "enum_theme_neutral_tone" DEFAULT 'warm';
  ALTER TABLE "theme" ADD COLUMN "auto_mode" "enum_theme_auto_mode" DEFAULT 'light';
  ALTER TABLE "theme" ADD COLUMN "contrast_mode" "enum_theme_contrast_mode" DEFAULT 'deepen';
  ALTER TABLE "theme" ADD COLUMN "_status" "enum_theme_status" DEFAULT 'draft';
  CREATE INDEX "_theme_v_version_version__status_idx" ON "_theme_v" USING btree ("version__status");
  CREATE INDEX "_theme_v_created_at_idx" ON "_theme_v" USING btree ("created_at");
  CREATE INDEX "_theme_v_updated_at_idx" ON "_theme_v" USING btree ("updated_at");
  CREATE INDEX "_theme_v_latest_idx" ON "_theme_v" USING btree ("latest");
  CREATE INDEX "_theme_v_autosave_idx" ON "_theme_v" USING btree ("autosave");
  CREATE INDEX "theme__status_idx" ON "theme" USING btree ("_status");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "_theme_v" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "backup_settings" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "_theme_v" CASCADE;
  DROP TABLE "backup_settings" CASCADE;
  ALTER TABLE "theme" ALTER COLUMN "preset" SET DATA TYPE text;
  ALTER TABLE "theme" ALTER COLUMN "preset" SET DEFAULT 'classic'::text;
  DROP TYPE "public"."enum_theme_preset";
  CREATE TYPE "public"."enum_theme_preset" AS ENUM('classic', 'heavyIron', 'earthStone');
  ALTER TABLE "theme" ALTER COLUMN "preset" SET DEFAULT 'classic'::"public"."enum_theme_preset";
  ALTER TABLE "theme" ALTER COLUMN "preset" SET DATA TYPE "public"."enum_theme_preset" USING "preset"::"public"."enum_theme_preset";
  DROP INDEX "theme__status_idx";
  ALTER TABLE "theme" ALTER COLUMN "preset" SET NOT NULL;
  ALTER TABLE "theme" ALTER COLUMN "accessible_contrast" SET DEFAULT true;
  ALTER TABLE "theme" DROP COLUMN "brand_color";
  ALTER TABLE "theme" DROP COLUMN "neutral_tone";
  ALTER TABLE "theme" DROP COLUMN "auto_mode";
  ALTER TABLE "theme" DROP COLUMN "contrast_mode";
  ALTER TABLE "theme" DROP COLUMN "_status";
  DROP TYPE "public"."enum_theme_neutral_tone";
  DROP TYPE "public"."enum_theme_auto_mode";
  DROP TYPE "public"."enum_theme_contrast_mode";
  DROP TYPE "public"."enum_theme_status";
  DROP TYPE "public"."enum__theme_v_version_preset";
  DROP TYPE "public"."enum__theme_v_version_neutral_tone";
  DROP TYPE "public"."enum__theme_v_version_auto_mode";
  DROP TYPE "public"."enum__theme_v_version_font_display";
  DROP TYPE "public"."enum__theme_v_version_font_body";
  DROP TYPE "public"."enum__theme_v_version_heading_case";
  DROP TYPE "public"."enum__theme_v_version_radius";
  DROP TYPE "public"."enum__theme_v_version_button_shape";
  DROP TYPE "public"."enum__theme_v_version_card_style";
  DROP TYPE "public"."enum__theme_v_version_container";
  DROP TYPE "public"."enum__theme_v_version_header_style";
  DROP TYPE "public"."enum__theme_v_version_footer_style";
  DROP TYPE "public"."enum__theme_v_version_contrast_mode";
  DROP TYPE "public"."enum__theme_v_version_status";
  DROP TYPE "public"."enum_backup_settings_frequency";`)
}
