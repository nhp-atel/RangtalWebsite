import express from 'express'
import session from 'express-session'
import rateLimit from 'express-rate-limit'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { registerRouter } from './routes/register.js'
import { adminRouter } from './routes/admin.js'
import { attendanceRouter } from './routes/attendance.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

export function createApp(db, opts = {}) {
  const {
    adminPassword = process.env.ADMIN_PASSWORD || '',
    sessionSecret = process.env.SESSION_SECRET || 'dev-secret-change-me',
    serveStatic = false,
  } = opts

  const app = express()
  app.set('trust proxy', 1)
  app.use(express.json())
  app.use(
    session({
      secret: sessionSecret,
      resave: false,
      saveUninitialized: false,
      cookie: {
        httpOnly: true,
        sameSite: 'lax',
        secure: process.env.NODE_ENV === 'production',
        maxAge: 1000 * 60 * 60 * 8,
      },
    })
  )

  const registerLimiter = rateLimit({
    windowMs: 60 * 1000,
    limit: 10,
    standardHeaders: true,
    legacyHeaders: false,
  })
  app.use('/api/register', registerLimiter)

  const loginLimiter = rateLimit({
    windowMs: 60 * 1000,
    limit: 5,
    standardHeaders: true,
    legacyHeaders: false,
  })
  app.use('/api/admin/login', loginLimiter)

  app.use('/api', registerRouter(db))
  app.use('/api/admin', adminRouter(db, { adminPassword }))
  app.use('/api/admin/attendance', attendanceRouter(db))

  // Unknown API routes should 404 as JSON, not fall through to the SPA.
  app.use('/api', (req, res) => res.status(404).json({ error: 'Not found.' }))

  if (serveStatic) {
    const dist = path.join(__dirname, '..', 'dist')
    app.use(express.static(dist))
    // SPA fallback. Path-less so it works on Express 4 and 5; registered last
    // and after the /api 404, so it only catches non-API routes.
    app.use((req, res) => res.sendFile(path.join(dist, 'index.html')))
  }

  return app
}
