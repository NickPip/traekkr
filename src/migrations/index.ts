import * as migration_20260324_150000_optional_fields_nullable_sqlite from './20260324_150000_optional_fields_nullable_sqlite'
import * as migration_20260408_120000_about_section_font_sizes_sqlite from './20260408_120000_about_section_font_sizes_sqlite'
import * as migration_20260409_120000_about_section_font_px_sqlite from './20260409_120000_about_section_font_px_sqlite'
import * as migration_20260409_130000_about_cta_font_px_sqlite from './20260409_130000_about_cta_font_px_sqlite'
import * as migration_20260409_140000_services_font_px_sqlite from './20260409_140000_services_font_px_sqlite'

export const migrations = [
  {
    up: migration_20260324_150000_optional_fields_nullable_sqlite.up,
    down: migration_20260324_150000_optional_fields_nullable_sqlite.down,
    name: '20260324_150000_optional_fields_nullable_sqlite',
  },
  {
    up: migration_20260408_120000_about_section_font_sizes_sqlite.up,
    down: migration_20260408_120000_about_section_font_sizes_sqlite.down,
    name: '20260408_120000_about_section_font_sizes_sqlite',
  },
  {
    up: migration_20260409_120000_about_section_font_px_sqlite.up,
    down: migration_20260409_120000_about_section_font_px_sqlite.down,
    name: '20260409_120000_about_section_font_px_sqlite',
  },
  {
    up: migration_20260409_130000_about_cta_font_px_sqlite.up,
    down: migration_20260409_130000_about_cta_font_px_sqlite.down,
    name: '20260409_130000_about_cta_font_px_sqlite',
  },
  {
    up: migration_20260409_140000_services_font_px_sqlite.up,
    down: migration_20260409_140000_services_font_px_sqlite.down,
    name: '20260409_140000_services_font_px_sqlite',
  },
]
