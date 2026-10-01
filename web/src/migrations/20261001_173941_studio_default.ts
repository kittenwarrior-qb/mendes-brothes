import { MigrateDownArgs, MigrateUpArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "theme" ALTER COLUMN "preset" SET DEFAULT 'studio';
  ALTER TABLE "_theme_v" ALTER COLUMN "version_preset" SET DEFAULT 'studio';`)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "theme" ALTER COLUMN "preset" SET DEFAULT 'limestone';
  ALTER TABLE "_theme_v" ALTER COLUMN "version_preset" SET DEFAULT 'limestone';`)
}
