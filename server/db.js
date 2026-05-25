import Database from 'better-sqlite3'

export function createDb(path) {
  const db = new Database(path)
  db.pragma('journal_mode = WAL')
  db.exec(`
    CREATE TABLE IF NOT EXISTS registrations (
      id          INTEGER PRIMARY KEY AUTOINCREMENT,
      ref         TEXT UNIQUE NOT NULL,
      full_name   TEXT NOT NULL,
      email       TEXT NOT NULL,
      phone       TEXT NOT NULL,
      age_group   TEXT,
      batch       TEXT NOT NULL,
      level       TEXT,
      emergency   TEXT,
      notes       TEXT,
      amount      INTEGER NOT NULL,
      agreed      INTEGER NOT NULL DEFAULT 0,
      paid        INTEGER NOT NULL DEFAULT 0,
      paid_at     TEXT,
      created_at  TEXT NOT NULL
    );
    CREATE INDEX IF NOT EXISTS idx_reg_batch   ON registrations(batch);
    CREATE INDEX IF NOT EXISTS idx_reg_paid    ON registrations(paid);
    CREATE INDEX IF NOT EXISTS idx_reg_created ON registrations(created_at);
  `)
  return db
}
