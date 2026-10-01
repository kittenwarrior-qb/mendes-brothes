import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "theme" DROP COLUMN "accessible_contrast";
  ALTER TABLE "_theme_v" DROP COLUMN "version_accessible_contrast";`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "theme" ADD COLUMN "accessible_contrast" boolean;
  ALTER TABLE "_theme_v" ADD COLUMN "version_accessible_contrast" boolean;`)
}
