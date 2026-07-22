import { db } from '../client';

export interface Note {
  id: number;
  content: string;
  subject: string | null;
  created_at: string;
  updated_at: string | null;
  status: string;
  review_count: number;
  next_review_date: string | null;
}

export function addNote(content: string, subject: string | null = null) {
  const createdAt = new Date().toISOString();
  db.runSync(
    `INSERT INTO notes (content, subject, created_at, status, review_count, next_review_date)
     VALUES (?, ?, ?, 'active', 0, NULL);`,
    [content, subject, createdAt]
  );
}

export function getAllNotes(): Note[] {
  return db.getAllSync<Note>(`SELECT * FROM notes ORDER BY created_at DESC;`);
}

export function updateNote(id: number, content: string) {
  const updatedAt = new Date().toISOString();
  db.runSync(`UPDATE notes SET content = ?, updated_at = ? WHERE id = ?;`, [content, updatedAt, id]);
}