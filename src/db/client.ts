import * as SQLite from 'expo-sqlite';

export const db = SQLite.openDatabaseSync('lookingglass.db');

export function initDatabase() {
  db.execSync(`
    CREATE TABLE IF NOT EXISTS notes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      content TEXT NOT NULL,
      subject TEXT,
      created_at TEXT NOT NULL,
      updated_at TEXT,
      status TEXT NOT NULL DEFAULT 'active',
      review_count INTEGER NOT NULL DEFAULT 0,
      next_review_date TEXT
    );

    CREATE TABLE IF NOT EXISTS review_log (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      note_id INTEGER NOT NULL,
      reviewed_at TEXT NOT NULL,
      FOREIGN KEY (note_id) REFERENCES notes (id)
    );

    CREATE TABLE IF NOT EXISTS journal_entries (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      entry_date TEXT NOT NULL,
      content TEXT NOT NULL,
      mood TEXT,
      created_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS settings (
      key TEXT PRIMARY KEY,
      value TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS attachments (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      note_id INTEGER NOT NULL,
      type TEXT NOT NULL,
      uri TEXT NOT NULL,
      filename TEXT,
      created_at TEXT NOT NULL,
      FOREIGN KEY (note_id) REFERENCES notes (id)
    );
  `);

  try {
    db.execSync(`ALTER TABLE notes ADD COLUMN updated_at TEXT;`);
  } catch (e) {
    // Ignore if column already exists
  }
}

initDatabase();