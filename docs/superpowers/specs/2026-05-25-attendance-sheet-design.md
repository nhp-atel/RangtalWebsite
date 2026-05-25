# July Attendance Sheet — Design

**Date:** 2026-05-25
**Branch:** `feat/attendance-sheet`
**Status:** Approved design, pending implementation plan
**Builds on:** the registration backend (`docs/superpowers/specs/2026-05-25-registration-backend-design.md`)

## Problem

The team needs to take weekly attendance for the July batch. From the admin page they
want a sheet listing the July dancers down the side and the July Tuesdays across the top,
where one click marks a dancer present for that class and clicking again clears it.

## Decisions (locked)

| Decision | Choice |
|---|---|
| Roster | July-batch registrants only (`registrations WHERE batch = 'july'`) |
| Toggle | 2-state, default **absent**; click → present, click again → absent |
| Dates | The 4 July 2026 Tuesdays: `2026-07-07`, `2026-07-14`, `2026-07-21`, `2026-07-28` |
| Storage | **Presence = a row.** A row exists only when present; absent = no row |
| Location | A new "Attendance" tab inside the existing `/#/admin` page (same session auth) |
| Counts | Show present-count per Tuesday (column) and per dancer (row) |
| Export | None for attendance (YAGNI) |
| Months | July only now; the table is date-keyed, so August is a trivial later add (no schema change) |

## Architecture

Reuses the existing Express + SQLite backend and the `requireAuth` session guard. Adds:
- a new `attendance` table,
- a server-side config listing the July Tuesday dates (a source of truth, like `batches.js`),
- two admin endpoints (list + toggle),
- a new "Attendance" view in the admin React page.

```
/#/admin (existing page)
   ├─ tab: Registrations (existing)
   └─ tab: Attendance (NEW)
         GET  /api/admin/attendance?batch=july   → dates + candidates + present set
         PUT  /api/admin/attendance {regId,date,present} → insert (present) / delete (absent)
                                                            ↓
                                              attendance table (SQLite)
```

## Data model — new `attendance` table

A row means "this registrant was present on this date." Absent = no row.

| column | type | notes |
|---|---|---|
| `id` | INTEGER PK AUTOINCREMENT | |
| `registration_id` | INTEGER NOT NULL | FK → `registrations(id)` |
| `date` | TEXT NOT NULL | one of the configured July Tuesdays, `YYYY-MM-DD` |
| `created_at` | TEXT NOT NULL | ISO timestamp when marked present |

- `UNIQUE(registration_id, date)` — at most one presence row per dancer per date.
- Index on `date` for fast per-column counts.
- `ON DELETE CASCADE` is not required (registrations are never deleted today); the FK is documentary. Use a plain `registration_id` column to keep parity with the existing schema style.

## Session config (server source of truth)

A new `server/lib/sessions.js` exports the July Tuesday dates:
```js
export const JULY_TUESDAYS = ['2026-07-07', '2026-07-14', '2026-07-21', '2026-07-28']
export const isValidSessionDate = (d) => JULY_TUESDAYS.includes(d)
```
This keeps the valid dates explicit (no on-the-fly date math) and gives the toggle endpoint
something concrete to validate against.

## API (all behind `requireAuth`)

**`GET /api/admin/attendance?batch=july`**
Returns the data the sheet needs:
```json
{
  "dates": ["2026-07-07","2026-07-14","2026-07-21","2026-07-28"],
  "candidates": [{ "id": 1, "full_name": "Ankita Patel" }, ...],
  "present": [{ "registration_id": 1, "date": "2026-07-07" }, ...]
}
```
- `candidates` = July-batch registrations ordered by name.
- `present` = all presence rows for those candidates (the client builds a lookup set).
- `batch` currently must be `july`; an unknown batch → `400`.

**`PUT /api/admin/attendance`** — body `{ registrationId, date, present }`
- Validates: `date` is a configured July Tuesday (else `400`); the registrant exists and is in the July batch (else `400`/`404`).
- `present === true` → `INSERT OR IGNORE` a presence row (idempotent).
- `present === false` → `DELETE` the presence row.
- Returns `{ ok: true }`.

## Admin page (the "Attendance" tab)

- Add a simple tab switcher at the top of the admin page: **Registrations** | **Attendance**. Default = Registrations (unchanged).
- Attendance view (loads on first open):
  - Header: "Attendance · July 2026".
  - A table: first column = dancer name; one column per Tuesday (label e.g. "Jul 7").
  - Each cell = a checkbox button: filled green ✓ when present, empty when absent. Click toggles with an **optimistic update** + rollback on error, calling `PUT /api/admin/attendance` (mirrors the existing Paid-toggle pattern).
  - A footer row shows the **present count per Tuesday**; each dancer row shows their **present count** (e.g. "2/4").
  - Empty state: if no July registrants, show "No July registrations yet."
- Styling reuses the admin page's existing classes (navy/gold/cream, the same checkbox visual as the Paid toggle) so it feels native.

## Error handling

- Toggle failure → roll back the optimistic cell change (no false "present").
- `GET` 401 → same auth handling as the rest of the admin page (drop to the login screen).
- Server validates date + batch so a malformed client request can't write junk rows.

## Testing

Server tests (Vitest + Supertest, in-memory DB), seeding a couple of July registrations
(and one August registrant to prove it's excluded):
- `GET /attendance` returns the 4 dates, only July candidates (August excluded), ordered by name, and the present set.
- `PUT present:true` inserts a presence row; a second identical `PUT` is idempotent (still one row).
- `PUT present:false` deletes the row (back to absent).
- `PUT` with a non-July date → `400`; with an August/unknown registrant → `400`/`404`.
- All attendance endpoints require a session (`401` without).
- A `db` test confirms the `attendance` table + unique constraint.

The grid UI gets manual verification (open the Attendance tab, toggle cells, confirm counts
update and persist on reload), consistent with how the rest of the admin UI is verified.

## Out of scope (YAGNI)

- August (and other months) attendance UI — storage already supports it.
- Attendance CSV export.
- Editing/deleting registrants.
- Per-class notes, late/excused states (the toggle is strictly present/absent).
