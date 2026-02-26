import { sqliteAdapter } from '@payloadcms/db-sqlite'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import path from 'path'
import { buildConfig } from 'payload'
import { fileURLToPath, pathToFileURL } from 'url'
import sharp from 'sharp'

import { Users } from './collections/Users'
import { Media } from './collections/Media'
import { Services } from './collections/Services'
import { Orders } from './collections/Orders'
import { Tools } from './collections/Tools'
import { WriteUps } from './collections/WriteUps'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
  },
  collections: [Users, Media, Services, Orders, WriteUps, Tools],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: sqliteAdapter({
    client: {
      url: (() => {
        const url = process.env.DATABASE_URL
        // Use DATABASE_URL only if it's SQLite-compatible (file:, libsql:, etc.)
        if (url && !url.startsWith('mongodb')) return url
        return pathToFileURL(
          path.join(process.cwd(), 'data', 'payload.sqlite'),
        ).href
      })(),
    },
    idType: 'uuid',
    wal: true,
  }),
  sharp,
  plugins: [],
})
