import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "users" ALTER COLUMN "role" SET DATA TYPE text;
  ALTER TABLE "users" ALTER COLUMN "role" SET DEFAULT 'editor'::text;
  DROP TYPE "public"."enum_users_role";
  CREATE TYPE "public"."enum_users_role" AS ENUM('editor', 'manager', 'admin');
  ALTER TABLE "users" ALTER COLUMN "role" SET DEFAULT 'editor'::"public"."enum_users_role";
  ALTER TABLE "users" ALTER COLUMN "role" SET DATA TYPE "public"."enum_users_role" USING "role"::"public"."enum_users_role";
  ALTER TABLE "form_submissions" ADD COLUMN "contact_name" varchar;
  ALTER TABLE "form_submissions" ADD COLUMN "contact_phone" varchar;
  ALTER TABLE "form_submissions" ADD COLUMN "contact_email" varchar;
  ALTER TABLE "form_submissions" ADD COLUMN "service_wanted" varchar;
  ALTER TABLE "form_submissions" ADD COLUMN "details" varchar;`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "users" ALTER COLUMN "role" SET DATA TYPE text;
  ALTER TABLE "users" ALTER COLUMN "role" SET DEFAULT 'editor'::text;
  DROP TYPE "public"."enum_users_role";
  CREATE TYPE "public"."enum_users_role" AS ENUM('admin', 'editor');
  ALTER TABLE "users" ALTER COLUMN "role" SET DEFAULT 'editor'::"public"."enum_users_role";
  ALTER TABLE "users" ALTER COLUMN "role" SET DATA TYPE "public"."enum_users_role" USING "role"::"public"."enum_users_role";
  ALTER TABLE "form_submissions" DROP COLUMN "contact_name";
  ALTER TABLE "form_submissions" DROP COLUMN "contact_phone";
  ALTER TABLE "form_submissions" DROP COLUMN "contact_email";
  ALTER TABLE "form_submissions" DROP COLUMN "service_wanted";
  ALTER TABLE "form_submissions" DROP COLUMN "details";`)
}
