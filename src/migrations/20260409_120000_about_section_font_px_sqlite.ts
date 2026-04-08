import type { MigrateDownArgs, MigrateUpArgs } from '@payloadcms/db-sqlite'
import { sql } from '@payloadcms/db-sqlite'

/**
 * Numeric px fields for About section typography (replaces select-based sizes).
 */
export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.run(
    sql`ALTER TABLE \`about_sections\` ADD \`heading_font_size_px\` numeric`,
  )
  await db.run(
    sql`ALTER TABLE \`about_sections\` ADD \`content_font_size_px\` numeric`,
  )
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.run(
    sql`ALTER TABLE \`about_sections\` DROP COLUMN \`heading_font_size_px\``,
  )
  await db.run(
    sql`ALTER TABLE \`about_sections\` DROP COLUMN \`content_font_size_px\``,
  )
}
