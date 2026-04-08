import type { MigrateDownArgs, MigrateUpArgs } from '@payloadcms/db-sqlite'
import { sql } from '@payloadcms/db-sqlite'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.run(
    sql`ALTER TABLE \`about\` ADD \`cta_text_font_size_px\` numeric`,
  )
  await db.run(
    sql`ALTER TABLE \`about\` ADD \`cta_button_font_size_px\` numeric`,
  )
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.run(
    sql`ALTER TABLE \`about\` DROP COLUMN \`cta_text_font_size_px\``,
  )
  await db.run(
    sql`ALTER TABLE \`about\` DROP COLUMN \`cta_button_font_size_px\``,
  )
}
