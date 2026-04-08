import type { MigrateDownArgs, MigrateUpArgs } from '@payloadcms/db-sqlite'
import { sql } from '@payloadcms/db-sqlite'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.run(
    sql`ALTER TABLE \`about_sections\` ADD \`heading_font_size\` text DEFAULT 'default'`,
  )
  await db.run(
    sql`ALTER TABLE \`about_sections\` ADD \`content_font_size\` text DEFAULT 'default'`,
  )
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.run(
    sql`CREATE TABLE \`about_sections_new\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` text(36) NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`heading\` text,
  	\`content\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`about\`(\`id\`) ON UPDATE no action ON DELETE cascade
  )`,
  )
  await db.run(
    sql`INSERT INTO \`about_sections_new\` (\`_order\`, \`_parent_id\`, \`id\`, \`heading\`, \`content\`)
     SELECT \`_order\`, \`_parent_id\`, \`id\`, \`heading\`, \`content\` FROM \`about_sections\``,
  )
  await db.run(sql`DROP TABLE \`about_sections\``)
  await db.run(sql`ALTER TABLE \`about_sections_new\` RENAME TO \`about_sections\``)
  await db.run(
    sql`CREATE INDEX \`about_sections_order_idx\` ON \`about_sections\` (\`_order\`)`,
  )
  await db.run(
    sql`CREATE INDEX \`about_sections_parent_id_idx\` ON \`about_sections\` (\`_parent_id\`)`,
  )
}
