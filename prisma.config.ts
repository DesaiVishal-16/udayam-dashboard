import 'dotenv/config'
import { defineConfig, env } from 'prisma/config'
import { neonConfig } from '@neondatabase/serverless'
import ws from 'ws'

// neon websocket for dev
neonConfig.webSocketConstructor = ws

export default defineConfig({
  schema: 'prisma/schema.prisma',
  migrations: {
    path: 'prisma/migrations',
  },
datasource: {
    url: env('DATABASE_URL'),
  }
})