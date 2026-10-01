import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_pages_blocks_featured_projects_layout" AS ENUM('feature', 'grid');
  CREATE TYPE "public"."enum_pages_blocks_marquee_source" AS ENUM('services', 'custom');
  CREATE TYPE "public"."enum_pages_blocks_marquee_style" AS ENUM('brand', 'dark', 'outline');
  CREATE TYPE "public"."enum_pages_blocks_marquee_speed" AS ENUM('slow', 'normal', 'fast');
  CREATE TYPE "public"."enum_pages_blocks_marquee_settings_background" AS ENUM('default', 'alt', 'tint', 'dark');
  CREATE TYPE "public"."enum_pages_blocks_marquee_settings_spacing" AS ENUM('none', 'sm', 'md', 'lg');
  CREATE TYPE "public"."enum_pages_blocks_marquee_settings_hide_on" AS ENUM('none', 'mobile', 'desktop', 'all');
  CREATE TYPE "public"."enum__pages_v_blocks_featured_projects_layout" AS ENUM('feature', 'grid');
  CREATE TYPE "public"."enum__pages_v_blocks_marquee_source" AS ENUM('services', 'custom');
  CREATE TYPE "public"."enum__pages_v_blocks_marquee_style" AS ENUM('brand', 'dark', 'outline');
  CREATE TYPE "public"."enum__pages_v_blocks_marquee_speed" AS ENUM('slow', 'normal', 'fast');
  CREATE TYPE "public"."enum__pages_v_blocks_marquee_settings_background" AS ENUM('default', 'alt', 'tint', 'dark');
  CREATE TYPE "public"."enum__pages_v_blocks_marquee_settings_spacing" AS ENUM('none', 'sm', 'md', 'lg');
  CREATE TYPE "public"."enum__pages_v_blocks_marquee_settings_hide_on" AS ENUM('none', 'mobile', 'desktop', 'all');
  ALTER TYPE "public"."enum_pages_blocks_cards_items_icon" ADD VALUE 'arrow' BEFORE 'check';
  ALTER TYPE "public"."enum_pages_blocks_cards_items_icon" ADD VALUE 'arrowUpRight' BEFORE 'check';
  ALTER TYPE "public"."enum__pages_v_blocks_cards_items_icon" ADD VALUE 'arrow' BEFORE 'check';
  ALTER TYPE "public"."enum__pages_v_blocks_cards_items_icon" ADD VALUE 'arrowUpRight' BEFORE 'check';
  ALTER TYPE "public"."enum_services_icon" ADD VALUE 'arrow' BEFORE 'check';
  ALTER TYPE "public"."enum_services_icon" ADD VALUE 'arrowUpRight' BEFORE 'check';
  CREATE TABLE "pages_blocks_marquee" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"source" "enum_pages_blocks_marquee_source" DEFAULT 'services',
  	"style" "enum_pages_blocks_marquee_style" DEFAULT 'brand',
  	"speed" "enum_pages_blocks_marquee_speed" DEFAULT 'normal',
  	"settings_background" "enum_pages_blocks_marquee_settings_background" DEFAULT 'default',
  	"settings_spacing" "enum_pages_blocks_marquee_settings_spacing" DEFAULT 'md',
  	"settings_hide_on" "enum_pages_blocks_marquee_settings_hide_on" DEFAULT 'none',
  	"settings_anchor" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_texts" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"text" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_marquee" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"source" "enum__pages_v_blocks_marquee_source" DEFAULT 'services',
  	"style" "enum__pages_v_blocks_marquee_style" DEFAULT 'brand',
  	"speed" "enum__pages_v_blocks_marquee_speed" DEFAULT 'normal',
  	"settings_background" "enum__pages_v_blocks_marquee_settings_background" DEFAULT 'default',
  	"settings_spacing" "enum__pages_v_blocks_marquee_settings_spacing" DEFAULT 'md',
  	"settings_hide_on" "enum__pages_v_blocks_marquee_settings_hide_on" DEFAULT 'none',
  	"settings_anchor" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_texts" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"text" varchar
  );
  
  ALTER TABLE "pages_blocks_hero_home" ALTER COLUMN "variant" SET DATA TYPE text;
  ALTER TABLE "pages_blocks_hero_home" ALTER COLUMN "variant" SET DEFAULT 'fullImage'::text;
  DROP TYPE "public"."enum_pages_blocks_hero_home_variant";
  CREATE TYPE "public"."enum_pages_blocks_hero_home_variant" AS ENUM('fullImage', 'split');
  ALTER TABLE "pages_blocks_hero_home" ALTER COLUMN "variant" SET DEFAULT 'fullImage'::"public"."enum_pages_blocks_hero_home_variant";
  ALTER TABLE "pages_blocks_hero_home" ALTER COLUMN "variant" SET DATA TYPE "public"."enum_pages_blocks_hero_home_variant" USING "variant"::"public"."enum_pages_blocks_hero_home_variant";
  ALTER TABLE "_pages_v_blocks_hero_home" ALTER COLUMN "variant" SET DATA TYPE text;
  ALTER TABLE "_pages_v_blocks_hero_home" ALTER COLUMN "variant" SET DEFAULT 'fullImage'::text;
  DROP TYPE "public"."enum__pages_v_blocks_hero_home_variant";
  CREATE TYPE "public"."enum__pages_v_blocks_hero_home_variant" AS ENUM('fullImage', 'split');
  ALTER TABLE "_pages_v_blocks_hero_home" ALTER COLUMN "variant" SET DEFAULT 'fullImage'::"public"."enum__pages_v_blocks_hero_home_variant";
  ALTER TABLE "_pages_v_blocks_hero_home" ALTER COLUMN "variant" SET DATA TYPE "public"."enum__pages_v_blocks_hero_home_variant" USING "variant"::"public"."enum__pages_v_blocks_hero_home_variant";
  ALTER TABLE "pages_blocks_hero_home" ALTER COLUMN "show_logo" SET DEFAULT false;
  ALTER TABLE "_pages_v_blocks_hero_home" ALTER COLUMN "show_logo" SET DEFAULT false;
  ALTER TABLE "theme" ALTER COLUMN "preset" SET DEFAULT 'limestone';
  ALTER TABLE "_theme_v" ALTER COLUMN "version_preset" SET DEFAULT 'limestone';
  ALTER TABLE "pages_blocks_hero_home" ADD COLUMN "eyebrow" varchar;
  ALTER TABLE "pages_blocks_page_hero" ADD COLUMN "eyebrow" varchar;
  ALTER TABLE "pages_blocks_services_grid" ADD COLUMN "eyebrow" varchar;
  ALTER TABLE "pages_blocks_featured_projects" ADD COLUMN "eyebrow" varchar;
  ALTER TABLE "pages_blocks_featured_projects" ADD COLUMN "layout" "enum_pages_blocks_featured_projects_layout" DEFAULT 'feature';
  ALTER TABLE "pages_blocks_split" ADD COLUMN "eyebrow" varchar;
  ALTER TABLE "pages_blocks_cards" ADD COLUMN "eyebrow" varchar;
  ALTER TABLE "pages_blocks_steps" ADD COLUMN "eyebrow" varchar;
  ALTER TABLE "pages_blocks_stats" ADD COLUMN "eyebrow" varchar;
  ALTER TABLE "pages_blocks_equipment_grid" ADD COLUMN "eyebrow" varchar;
  ALTER TABLE "pages_blocks_checklist" ADD COLUMN "eyebrow" varchar;
  ALTER TABLE "pages_blocks_testimonials" ADD COLUMN "eyebrow" varchar;
  ALTER TABLE "pages_blocks_faq" ADD COLUMN "eyebrow" varchar;
  ALTER TABLE "pages_blocks_service_areas" ADD COLUMN "eyebrow" varchar;
  ALTER TABLE "pages_blocks_gallery" ADD COLUMN "eyebrow" varchar;
  ALTER TABLE "pages_blocks_contact_section" ADD COLUMN "eyebrow" varchar;
  ALTER TABLE "pages_blocks_cta_band" ADD COLUMN "eyebrow" varchar;
  ALTER TABLE "_pages_v_blocks_hero_home" ADD COLUMN "eyebrow" varchar;
  ALTER TABLE "_pages_v_blocks_page_hero" ADD COLUMN "eyebrow" varchar;
  ALTER TABLE "_pages_v_blocks_services_grid" ADD COLUMN "eyebrow" varchar;
  ALTER TABLE "_pages_v_blocks_featured_projects" ADD COLUMN "eyebrow" varchar;
  ALTER TABLE "_pages_v_blocks_featured_projects" ADD COLUMN "layout" "enum__pages_v_blocks_featured_projects_layout" DEFAULT 'feature';
  ALTER TABLE "_pages_v_blocks_split" ADD COLUMN "eyebrow" varchar;
  ALTER TABLE "_pages_v_blocks_cards" ADD COLUMN "eyebrow" varchar;
  ALTER TABLE "_pages_v_blocks_steps" ADD COLUMN "eyebrow" varchar;
  ALTER TABLE "_pages_v_blocks_stats" ADD COLUMN "eyebrow" varchar;
  ALTER TABLE "_pages_v_blocks_equipment_grid" ADD COLUMN "eyebrow" varchar;
  ALTER TABLE "_pages_v_blocks_checklist" ADD COLUMN "eyebrow" varchar;
  ALTER TABLE "_pages_v_blocks_testimonials" ADD COLUMN "eyebrow" varchar;
  ALTER TABLE "_pages_v_blocks_faq" ADD COLUMN "eyebrow" varchar;
  ALTER TABLE "_pages_v_blocks_service_areas" ADD COLUMN "eyebrow" varchar;
  ALTER TABLE "_pages_v_blocks_gallery" ADD COLUMN "eyebrow" varchar;
  ALTER TABLE "_pages_v_blocks_contact_section" ADD COLUMN "eyebrow" varchar;
  ALTER TABLE "_pages_v_blocks_cta_band" ADD COLUMN "eyebrow" varchar;
  ALTER TABLE "listing_pages" ADD COLUMN "projects_eyebrow" varchar;
  ALTER TABLE "listing_pages" ADD COLUMN "services_eyebrow" varchar;
  ALTER TABLE "listing_pages" ADD COLUMN "posts_eyebrow" varchar;
  ALTER TABLE "pages_blocks_marquee" ADD CONSTRAINT "pages_blocks_marquee_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_texts" ADD CONSTRAINT "pages_texts_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_marquee" ADD CONSTRAINT "_pages_v_blocks_marquee_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_texts" ADD CONSTRAINT "_pages_v_texts_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "pages_blocks_marquee_order_idx" ON "pages_blocks_marquee" USING btree ("_order");
  CREATE INDEX "pages_blocks_marquee_parent_id_idx" ON "pages_blocks_marquee" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_marquee_path_idx" ON "pages_blocks_marquee" USING btree ("_path");
  CREATE INDEX "pages_texts_order_parent" ON "pages_texts" USING btree ("order","parent_id");
  CREATE INDEX "_pages_v_blocks_marquee_order_idx" ON "_pages_v_blocks_marquee" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_marquee_parent_id_idx" ON "_pages_v_blocks_marquee" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_marquee_path_idx" ON "_pages_v_blocks_marquee" USING btree ("_path");
  CREATE INDEX "_pages_v_texts_order_parent" ON "_pages_v_texts" USING btree ("order","parent_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "pages_blocks_marquee" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_texts" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_blocks_marquee" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_texts" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "pages_blocks_marquee" CASCADE;
  DROP TABLE "pages_texts" CASCADE;
  DROP TABLE "_pages_v_blocks_marquee" CASCADE;
  DROP TABLE "_pages_v_texts" CASCADE;
  ALTER TABLE "pages_blocks_hero_home" ALTER COLUMN "variant" SET DATA TYPE text;
  ALTER TABLE "pages_blocks_hero_home" ALTER COLUMN "variant" SET DEFAULT 'split'::text;
  DROP TYPE "public"."enum_pages_blocks_hero_home_variant";
  CREATE TYPE "public"."enum_pages_blocks_hero_home_variant" AS ENUM('split', 'fullImage');
  ALTER TABLE "pages_blocks_hero_home" ALTER COLUMN "variant" SET DEFAULT 'split'::"public"."enum_pages_blocks_hero_home_variant";
  ALTER TABLE "pages_blocks_hero_home" ALTER COLUMN "variant" SET DATA TYPE "public"."enum_pages_blocks_hero_home_variant" USING "variant"::"public"."enum_pages_blocks_hero_home_variant";
  ALTER TABLE "pages_blocks_cards_items" ALTER COLUMN "icon" SET DATA TYPE text;
  DROP TYPE "public"."enum_pages_blocks_cards_items_icon";
  CREATE TYPE "public"."enum_pages_blocks_cards_items_icon" AS ENUM('mulch', 'clear', 'grade', 'demo', 'excav', 'drive', 'pad', 'clean', 'pavers', 'roof', 'check', 'phone', 'pin', 'area', 'calendar', 'clock', 'shield', 'star', 'users', 'leaf', 'truck', 'hammer', 'award', 'handshake', 'mail', 'techGps', 'techDrone', 'techLaser', 'techDoc');
  ALTER TABLE "pages_blocks_cards_items" ALTER COLUMN "icon" SET DATA TYPE "public"."enum_pages_blocks_cards_items_icon" USING "icon"::"public"."enum_pages_blocks_cards_items_icon";
  ALTER TABLE "_pages_v_blocks_hero_home" ALTER COLUMN "variant" SET DATA TYPE text;
  ALTER TABLE "_pages_v_blocks_hero_home" ALTER COLUMN "variant" SET DEFAULT 'split'::text;
  DROP TYPE "public"."enum__pages_v_blocks_hero_home_variant";
  CREATE TYPE "public"."enum__pages_v_blocks_hero_home_variant" AS ENUM('split', 'fullImage');
  ALTER TABLE "_pages_v_blocks_hero_home" ALTER COLUMN "variant" SET DEFAULT 'split'::"public"."enum__pages_v_blocks_hero_home_variant";
  ALTER TABLE "_pages_v_blocks_hero_home" ALTER COLUMN "variant" SET DATA TYPE "public"."enum__pages_v_blocks_hero_home_variant" USING "variant"::"public"."enum__pages_v_blocks_hero_home_variant";
  ALTER TABLE "_pages_v_blocks_cards_items" ALTER COLUMN "icon" SET DATA TYPE text;
  DROP TYPE "public"."enum__pages_v_blocks_cards_items_icon";
  CREATE TYPE "public"."enum__pages_v_blocks_cards_items_icon" AS ENUM('mulch', 'clear', 'grade', 'demo', 'excav', 'drive', 'pad', 'clean', 'pavers', 'roof', 'check', 'phone', 'pin', 'area', 'calendar', 'clock', 'shield', 'star', 'users', 'leaf', 'truck', 'hammer', 'award', 'handshake', 'mail', 'techGps', 'techDrone', 'techLaser', 'techDoc');
  ALTER TABLE "_pages_v_blocks_cards_items" ALTER COLUMN "icon" SET DATA TYPE "public"."enum__pages_v_blocks_cards_items_icon" USING "icon"::"public"."enum__pages_v_blocks_cards_items_icon";
  ALTER TABLE "services" ALTER COLUMN "icon" SET DATA TYPE text;
  ALTER TABLE "services" ALTER COLUMN "icon" SET DEFAULT 'excav'::text;
  DROP TYPE "public"."enum_services_icon";
  CREATE TYPE "public"."enum_services_icon" AS ENUM('mulch', 'clear', 'grade', 'demo', 'excav', 'drive', 'pad', 'clean', 'pavers', 'roof', 'check', 'phone', 'pin', 'area', 'calendar', 'clock', 'shield', 'star', 'users', 'leaf', 'truck', 'hammer', 'award', 'handshake', 'mail');
  ALTER TABLE "services" ALTER COLUMN "icon" SET DEFAULT 'excav'::"public"."enum_services_icon";
  ALTER TABLE "services" ALTER COLUMN "icon" SET DATA TYPE "public"."enum_services_icon" USING "icon"::"public"."enum_services_icon";
  ALTER TABLE "pages_blocks_hero_home" ALTER COLUMN "show_logo" SET DEFAULT true;
  ALTER TABLE "_pages_v_blocks_hero_home" ALTER COLUMN "show_logo" SET DEFAULT true;
  ALTER TABLE "theme" ALTER COLUMN "preset" SET DEFAULT 'classic';
  ALTER TABLE "_theme_v" ALTER COLUMN "version_preset" SET DEFAULT 'classic';
  ALTER TABLE "pages_blocks_hero_home" DROP COLUMN "eyebrow";
  ALTER TABLE "pages_blocks_page_hero" DROP COLUMN "eyebrow";
  ALTER TABLE "pages_blocks_services_grid" DROP COLUMN "eyebrow";
  ALTER TABLE "pages_blocks_featured_projects" DROP COLUMN "eyebrow";
  ALTER TABLE "pages_blocks_featured_projects" DROP COLUMN "layout";
  ALTER TABLE "pages_blocks_split" DROP COLUMN "eyebrow";
  ALTER TABLE "pages_blocks_cards" DROP COLUMN "eyebrow";
  ALTER TABLE "pages_blocks_steps" DROP COLUMN "eyebrow";
  ALTER TABLE "pages_blocks_stats" DROP COLUMN "eyebrow";
  ALTER TABLE "pages_blocks_equipment_grid" DROP COLUMN "eyebrow";
  ALTER TABLE "pages_blocks_checklist" DROP COLUMN "eyebrow";
  ALTER TABLE "pages_blocks_testimonials" DROP COLUMN "eyebrow";
  ALTER TABLE "pages_blocks_faq" DROP COLUMN "eyebrow";
  ALTER TABLE "pages_blocks_service_areas" DROP COLUMN "eyebrow";
  ALTER TABLE "pages_blocks_gallery" DROP COLUMN "eyebrow";
  ALTER TABLE "pages_blocks_contact_section" DROP COLUMN "eyebrow";
  ALTER TABLE "pages_blocks_cta_band" DROP COLUMN "eyebrow";
  ALTER TABLE "_pages_v_blocks_hero_home" DROP COLUMN "eyebrow";
  ALTER TABLE "_pages_v_blocks_page_hero" DROP COLUMN "eyebrow";
  ALTER TABLE "_pages_v_blocks_services_grid" DROP COLUMN "eyebrow";
  ALTER TABLE "_pages_v_blocks_featured_projects" DROP COLUMN "eyebrow";
  ALTER TABLE "_pages_v_blocks_featured_projects" DROP COLUMN "layout";
  ALTER TABLE "_pages_v_blocks_split" DROP COLUMN "eyebrow";
  ALTER TABLE "_pages_v_blocks_cards" DROP COLUMN "eyebrow";
  ALTER TABLE "_pages_v_blocks_steps" DROP COLUMN "eyebrow";
  ALTER TABLE "_pages_v_blocks_stats" DROP COLUMN "eyebrow";
  ALTER TABLE "_pages_v_blocks_equipment_grid" DROP COLUMN "eyebrow";
  ALTER TABLE "_pages_v_blocks_checklist" DROP COLUMN "eyebrow";
  ALTER TABLE "_pages_v_blocks_testimonials" DROP COLUMN "eyebrow";
  ALTER TABLE "_pages_v_blocks_faq" DROP COLUMN "eyebrow";
  ALTER TABLE "_pages_v_blocks_service_areas" DROP COLUMN "eyebrow";
  ALTER TABLE "_pages_v_blocks_gallery" DROP COLUMN "eyebrow";
  ALTER TABLE "_pages_v_blocks_contact_section" DROP COLUMN "eyebrow";
  ALTER TABLE "_pages_v_blocks_cta_band" DROP COLUMN "eyebrow";
  ALTER TABLE "listing_pages" DROP COLUMN "projects_eyebrow";
  ALTER TABLE "listing_pages" DROP COLUMN "services_eyebrow";
  ALTER TABLE "listing_pages" DROP COLUMN "posts_eyebrow";
  DROP TYPE "public"."enum_pages_blocks_featured_projects_layout";
  DROP TYPE "public"."enum_pages_blocks_marquee_source";
  DROP TYPE "public"."enum_pages_blocks_marquee_style";
  DROP TYPE "public"."enum_pages_blocks_marquee_speed";
  DROP TYPE "public"."enum_pages_blocks_marquee_settings_background";
  DROP TYPE "public"."enum_pages_blocks_marquee_settings_spacing";
  DROP TYPE "public"."enum_pages_blocks_marquee_settings_hide_on";
  DROP TYPE "public"."enum__pages_v_blocks_featured_projects_layout";
  DROP TYPE "public"."enum__pages_v_blocks_marquee_source";
  DROP TYPE "public"."enum__pages_v_blocks_marquee_style";
  DROP TYPE "public"."enum__pages_v_blocks_marquee_speed";
  DROP TYPE "public"."enum__pages_v_blocks_marquee_settings_background";
  DROP TYPE "public"."enum__pages_v_blocks_marquee_settings_spacing";
  DROP TYPE "public"."enum__pages_v_blocks_marquee_settings_hide_on";`)
}
