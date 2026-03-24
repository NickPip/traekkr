import type { MigrateDownArgs, MigrateUpArgs } from '@payloadcms/db-sqlite'
import { sql } from '@payloadcms/db-sqlite'

/**
 * Aligns SQLite with Payload optional fields: relax NOT NULL on text columns
 * that are no longer required in collection/global configs.
 */
export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.run(sql`PRAGMA foreign_keys = OFF`)

  await db.run(sql`CREATE TABLE \`write_ups_new\` (
  	\`id\` text(36) PRIMARY KEY NOT NULL,
  	\`title\` text,
  	\`slug\` text,
  	\`published_date\` text,
  	\`author\` text,
  	\`description\` text,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL
  )`)
  await db.run(sql`INSERT INTO \`write_ups_new\` SELECT * FROM \`write_ups\``)
  await db.run(sql`DROP TABLE \`write_ups\``)
  await db.run(sql`ALTER TABLE \`write_ups_new\` RENAME TO \`write_ups\``)
  await db.run(sql`CREATE UNIQUE INDEX \`write_ups_slug_idx\` ON \`write_ups\` (\`slug\`)`)
  await db.run(sql`CREATE INDEX \`write_ups_updated_at_idx\` ON \`write_ups\` (\`updated_at\`)`)
  await db.run(sql`CREATE INDEX \`write_ups_created_at_idx\` ON \`write_ups\` (\`created_at\`)`)

  await db.run(sql`CREATE TABLE \`tools_new\` (
  	\`id\` text(36) PRIMARY KEY NOT NULL,
  	\`title\` text,
  	\`slug\` text,
  	\`published_date\` text,
  	\`link\` text,
  	\`description\` text,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL
  )`)
  await db.run(sql`INSERT INTO \`tools_new\` SELECT * FROM \`tools\``)
  await db.run(sql`DROP TABLE \`tools\``)
  await db.run(sql`ALTER TABLE \`tools_new\` RENAME TO \`tools\``)
  await db.run(sql`CREATE UNIQUE INDEX \`tools_slug_idx\` ON \`tools\` (\`slug\`)`)
  await db.run(sql`CREATE INDEX \`tools_updated_at_idx\` ON \`tools\` (\`updated_at\`)`)
  await db.run(sql`CREATE INDEX \`tools_created_at_idx\` ON \`tools\` (\`created_at\`)`)

  await db.run(
    sql`CREATE TABLE \`services_target_items_mig_backup\` AS SELECT * FROM \`services_target_items\``,
  )
  await db.run(sql`DROP TABLE \`services_target_items\``)

  await db.run(sql`CREATE TABLE \`services_new\` (
  	\`id\` text(36) PRIMARY KEY NOT NULL,
  	\`title\` text,
  	\`description\` text,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`sort_order\` numeric
  )`)
  await db.run(sql`INSERT INTO \`services_new\` SELECT * FROM \`services\``)
  await db.run(sql`DROP TABLE \`services\``)
  await db.run(sql`ALTER TABLE \`services_new\` RENAME TO \`services\``)
  await db.run(sql`CREATE INDEX \`services_updated_at_idx\` ON \`services\` (\`updated_at\`)`)
  await db.run(sql`CREATE INDEX \`services_created_at_idx\` ON \`services\` (\`created_at\`)`)

  await db.run(sql`CREATE TABLE \`services_target_items\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` text(36) NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`item\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`services\`(\`id\`) ON UPDATE no action ON DELETE cascade
  )`)
  await db.run(sql`INSERT INTO \`services_target_items\` SELECT * FROM \`services_target_items_mig_backup\``)
  await db.run(sql`DROP TABLE \`services_target_items_mig_backup\``)
  await db.run(sql`CREATE INDEX \`services_target_items_order_idx\` ON \`services_target_items\` (\`_order\`)`)
  await db.run(sql`CREATE INDEX \`services_target_items_parent_id_idx\` ON \`services_target_items\` (\`_parent_id\`)`)

  await db.run(
    sql`CREATE TABLE \`about_sections_mig_backup\` AS SELECT * FROM \`about_sections\``,
  )
  await db.run(sql`DROP TABLE \`about_sections\``)

  await db.run(sql`CREATE TABLE \`about_new\` (
  	\`id\` text(36) PRIMARY KEY NOT NULL,
  	\`cta_text\` text,
  	\`cta_button_text\` text DEFAULT 'Contact us',
  	\`cta_button_href\` text DEFAULT '/contact',
  	\`updated_at\` text,
  	\`created_at\` text
  )`)
  await db.run(sql`INSERT INTO \`about_new\` SELECT * FROM \`about\``)
  await db.run(sql`DROP TABLE \`about\``)
  await db.run(sql`ALTER TABLE \`about_new\` RENAME TO \`about\``)

  await db.run(sql`CREATE TABLE \`about_sections\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` text(36) NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`heading\` text,
  	\`content\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`about\`(\`id\`) ON UPDATE no action ON DELETE cascade
  )`)
  await db.run(sql`INSERT INTO \`about_sections\` SELECT * FROM \`about_sections_mig_backup\``)
  await db.run(sql`DROP TABLE \`about_sections_mig_backup\``)
  await db.run(sql`CREATE INDEX \`about_sections_order_idx\` ON \`about_sections\` (\`_order\`)`)
  await db.run(sql`CREATE INDEX \`about_sections_parent_id_idx\` ON \`about_sections\` (\`_parent_id\`)`)

  await db.run(sql`PRAGMA foreign_keys = ON`)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  // Reverting NOT NULL would fail if any row contains NULL in those columns.
  await db.run(sql`SELECT 1`)
}
