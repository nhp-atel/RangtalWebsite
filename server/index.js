import { createApp } from './app.js'
import { createDb } from './db.js'

const dbPath =
  process.env.DB_PATH ||
  (process.env.NODE_ENV === 'production' ? '/data/registrations.sqlite' : './dev.sqlite')

// In production these MUST be set in the host's environment. Warn loudly if not,
// rather than silently running with an insecure default / disabled admin.
if (process.env.NODE_ENV === 'production') {
  if (!process.env.SESSION_SECRET) {
    console.warn('[WARN] SESSION_SECRET is not set — using an insecure default. Set it in the host environment.')
  }
  if (!process.env.ADMIN_PASSWORD) {
    console.warn('[WARN] ADMIN_PASSWORD is not set — the admin login will reject every password.')
  }
}

const db = createDb(dbPath)
const app = createApp(db, { serveStatic: true })

const port = process.env.PORT || 3000
app.listen(port, () => {
  console.log(`Rangtaal server listening on :${port} (db: ${dbPath})`)
})
