import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TABLE "analytics_daily" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"day" varchar NOT NULL,
  	"kind" varchar NOT NULL,
  	"key" varchar NOT NULL,
  	"count" numeric DEFAULT 0 NOT NULL
  );
  
  CREATE TABLE "analytics_visitors" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"day" varchar NOT NULL,
  	"hash" varchar NOT NULL
  );
  
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "analytics_daily_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "analytics_visitors_id" integer;
  CREATE INDEX "analytics_daily_day_idx" ON "analytics_daily" USING btree ("day");
  CREATE UNIQUE INDEX "day_kind_key_idx" ON "analytics_daily" USING btree ("day","kind","key");
  CREATE UNIQUE INDEX "day_hash_idx" ON "analytics_visitors" USING btree ("day","hash");
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_analytics_daily_fk" FOREIGN KEY ("analytics_daily_id") REFERENCES "public"."analytics_daily"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_analytics_visitors_fk" FOREIGN KEY ("analytics_visitors_id") REFERENCES "public"."analytics_visitors"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "payload_locked_documents_rels_analytics_daily_id_idx" ON "payload_locked_documents_rels" USING btree ("analytics_daily_id");
  CREATE INDEX "payload_locked_documents_rels_analytics_visitors_id_idx" ON "payload_locked_documents_rels" USING btree ("analytics_visitors_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "analytics_daily" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "analytics_visitors" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "analytics_daily" CASCADE;
  DROP TABLE "analytics_visitors" CASCADE;
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_analytics_daily_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_analytics_visitors_fk";
  
  DROP INDEX "payload_locked_documents_rels_analytics_daily_id_idx";
  DROP INDEX "payload_locked_documents_rels_analytics_visitors_id_idx";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "analytics_daily_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "analytics_visitors_id";`)
}
