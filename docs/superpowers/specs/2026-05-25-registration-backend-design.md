# Registration Backend & Payment Tracking — Design

**Date:** 2026-05-25
**Branch:** `feat/registration-backend`
**Status:** Approved design, pending implementation plan

## Problem

The Rangtaal site is a static deploy. The registration form (`src/sections/Registration.jsx`)
collects dancer details across six steps but stores nothing: it attempts a fire-and-forget
POST to an unconfigured Google Form and then shows a confirmation with a **random** reservation
ID. Payment is Zelle, tracked manually and entirely off-site.

We need:
1. Registrations saved durably as rows (table format).
2. An admin view where a team member can see all registrations, filter/search/export them,
   and **tick a "Paid" checkbox** — with nothing else required.

Scale: ~200 people. No capacity cap (the number is sizing guidance only).

## Decisions (locked)

| Decision | Choice | Rationale |
|---|---|---|
| Storage | Local **SQLite** file (`better-sqlite3`) | Matches the requested architecture; single file; simple. |
| Hosting | Render **web service + persistent disk** (~$7/mo) | A persistent disk is required so the `.db` file survives redeploys/restarts. Render's free tier has an ephemeral filesystem and would erase data. |
| Service shape | **One** Node/Express service serves both the React app and the API | Simpler and cheaper than a separate API host at this scale. |
| Admin auth | **Shared team password** → httpOnly session cookie | Simplest; no Google OAuth setup needed. Trade-off: one shared secret, no per-person attribution. |
| Capacity | **No cap** | 200 is an estimate. Admin shows a running count to eyeball. |
| Sessions | **In-memory** | A restart logs the team out (re-enter password). Acceptable at this scale; avoids a session store. |
| Spam guard | Honeypot field + light rate-limit (no CAPTCHA) | Keeps the form frictionless. |

## Architecture

Today: static React (Vite) build → `dist`, served by a Render **static** site.

New: a single Node/Express **web service** that:
1. Serves the built React app (`dist/`) as static files — same site, same URLs.
2. Exposes `/api/*` endpoints.
3. Reads/writes a local SQLite file on a persistent disk mounted at `/data`.

```
Browser ──> Render Web Service (Node/Express)
              ├─ serves React app (dist/)
              ├─ POST /api/register ──┐
              └─ /api/admin/* ────────┴─> better-sqlite3 ─> /data/registrations.sqlite (persistent disk)
```

Client routing stays on `HashRouter`; the admin page lives at `/#/admin`. The API uses real
paths under `/api`. In production Express serves `index.html` for all non-`/api`, non-asset
routes. In development, Vite's dev server proxies `/api` to the Express process.

## Repo layout

```
server/
  index.js              Express app: static serving + routes + session + boot
  db.js                 better-sqlite3 connection + schema/migration on boot
  routes/register.js    POST /api/register
  routes/admin.js       login / logout / list / toggle-paid / export CSV
  middleware/auth.js    session guard for /api/admin/*
  lib/ref.js            reservation-code generator (e.g. RT-48213), collision-safe
src/
  sections/Registration.jsx   (modified — posts to the API, awaits result)
  pages/Admin.jsx             (new — admin page at /#/admin)
  components/admin/*          (new — table, filters, counts strip, login)
tests/
  server/*                    (supertest integration tests against a temp SQLite file)
```

## Data model — `registrations` table

One table. Columns map straight from the existing form, plus payment tracking.

| column | type | source / notes |
|---|---|---|
| `id` | INTEGER PRIMARY KEY AUTOINCREMENT | internal row id |
| `ref` | TEXT UNIQUE NOT NULL | server-generated code, e.g. `RT-48213` (replaces today's random one) |
| `full_name` | TEXT NOT NULL | form |
| `email` | TEXT NOT NULL | form |
| `phone` | TEXT NOT NULL | form |
| `age_group` | TEXT | form (e.g. `18—25`) |
| `batch` | TEXT NOT NULL | `july` / `august` |
| `level` | TEXT | form (`first`/`social`/`trained`/`pro`) |
| `emergency` | TEXT | form |
| `notes` | TEXT | form (optional) |
| `amount` | INTEGER NOT NULL | fee in dollars captured at signup (60) |
| `agreed` | INTEGER NOT NULL (0/1) | code of conduct accepted |
| `paid` | INTEGER NOT NULL DEFAULT 0 | **the checkbox** |
| `paid_at` | TEXT (ISO 8601) | set when toggled to paid; null otherwise |
| `created_at` | TEXT NOT NULL (ISO 8601) | submission time, default now |

Indexes: `batch`, `paid`, `created_at` for admin filtering/sorting.

## API

### Public

**`POST /api/register`**
- Body: `{ fullName, email, phone, ageGroup, batch, level, emergency, notes, agreed, hp }`
  (`hp` = hidden honeypot; if non-empty, silently accept-but-drop).
- Server validates: required fields present, email format, phone digits ≥ 8, `batch` is a
  known batch, `agreed === true`.
- Derives `amount` from the batch price (server-side source of truth, not trusted from client).
- Generates a unique `ref` (regenerate on the rare UNIQUE collision).
- Inserts the row; returns `200 { ref, batch }`.
- Validation failure → `400 { error: <friendly message> }`.
- Server/DB error → `500 { error }`.
- Rate-limited per IP (light).

### Admin (all require a valid session cookie)

| Method | Path | Purpose |
|---|---|---|
| POST | `/api/admin/login` | `{ password }` checked against `ADMIN_PASSWORD` (constant-time compare); sets httpOnly session cookie. `401` on mismatch. |
| POST | `/api/admin/logout` | Clears the session. |
| GET | `/api/admin/registrations?batch=&paid=&q=` | Returns rows + counts `{ total, paid, unpaid, byBatch }`. Filters: batch, paid status, search `q` over name/email. |
| PATCH | `/api/admin/registrations/:id` | `{ paid: true\|false }` → updates `paid` and stamps/clears `paid_at`. Returns the updated row. **This is the checkbox action.** |
| GET | `/api/admin/export.csv` | Streams the roster as a CSV download, respecting the same filters. |

Auth middleware rejects unauthenticated `/api/admin/*` calls with `401`.

## Admin page (`/#/admin`)

- **Not logged in:** password box → `POST /api/admin/login`. On success, the roster loads.
- **Logged in:**
  - **Counts strip:** Total · Paid · Unpaid · per-batch breakdown (the running count, since
    there is no cap).
  - **Search** (name/email) + **filters** (batch dropdown, paid/unpaid toggle).
  - **Table:** Name, Email, Phone, Batch, Level, Age, Registered date, and a **Paid checkbox**
    that saves instantly on click (optimistic update; rolls back on error). Each row expands to
    show emergency contact + notes.
  - **Export CSV** button (respects active filters) · **Logout**.
- Styled in the site's existing visual language (navy/gold/cream, `display-serif`) so it feels
  native — clarity-first since it is an internal tool.

## Changes to the existing registration flow

- Replace the dead Google Form `no-cors` POST with a real `fetch('/api/register', { POST, json })`
  on the final **Confirm** step.
- **Await the response.** Only advance to the "You're in" confirmation on success, and show the
  **server-returned `ref`** (not `Math.random()`). On failure, show an error and keep the user on
  the payment step — the old code advanced to confirmation regardless of outcome.
- Add a submitting/loading state to the Confirm button.
- Delete the now-unused `GOOGLE_FORM` block and `submitToGoogleForm`. The members-area Google
  sign-in (`config/members.js`, `MemberLoginModal.jsx`) is unrelated and stays.

## Deployment & config

- `render.yaml`: change `runtime: static` → a Node **web service**; add a **persistent disk**
  mounted at `/data`; build with `npm ci && npm run build`, start with `node server/index.js`.
- SQLite path: `/data/registrations.sqlite` in production; a local gitignored file in dev.
- Env vars: `ADMIN_PASSWORD`, `SESSION_SECRET`, `NODE_ENV=production`, optional `DB_PATH`.
- `package.json`: add `express`, `better-sqlite3`, a session/cookie lib, a CSV helper, and a
  rate-limiter; add a `start` script. Keep `dev`/`build`/`preview`.
- `vite.config.js`: add an `/api` dev proxy to the Express port.
- `.gitignore`: ignore the local dev `*.sqlite` files.

## Error handling & privacy

- Register: validation → `400` with a friendly message rendered in the form; server error →
  `500`, form states the spot was **not** saved (never a false success).
- DB writes wrapped in try/catch; `ref` UNIQUE collision triggers a regenerate-and-retry.
- The DB holds personal data (names, emails, phones, emergency contacts). Admin routes are gated
  by the password + httpOnly cookie; PII is never written to logs; the CSV is reachable only
  through the authenticated endpoint.

## Testing

- Test-first (project TDD workflow). Supertest integration tests against a temporary SQLite file:
  - register: valid insert returns a `ref`; missing/invalid fields → `400`; honeypot drop;
    `amount` derived server-side.
  - admin: login success/failure; unauthenticated `/api/admin/*` → `401`.
  - paid toggle: flips `paid` and sets/clears `paid_at`.
  - list filters: batch, paid status, search.
  - CSV export: shape and filter respect.
- Light front-end checks for the registration submit (success + error path) and the admin
  paid-toggle optimistic update.

## Out of scope (YAGNI)

- Per-person admin accounts / Google OAuth for the team.
- Capacity caps and waitlists.
- Automated payment reconciliation (Zelle stays manual; the team ticks the box).
- Email/SMS confirmations.
