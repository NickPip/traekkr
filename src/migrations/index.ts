import * as migration_20260324_150000_optional_fields_nullable_sqlite from './20260324_150000_optional_fields_nullable_sqlite'

export const migrations = [
  {
    up: migration_20260324_150000_optional_fields_nullable_sqlite.up,
    down: migration_20260324_150000_optional_fields_nullable_sqlite.down,
    name: '20260324_150000_optional_fields_nullable_sqlite',
  },
]
