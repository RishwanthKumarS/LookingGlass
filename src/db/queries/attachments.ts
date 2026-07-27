import { db } from '../client';

export interface Attachment {
  id: number;
  note_id: number;
  type: 'image' | 'file';
  uri: string;
  filename: string | null;
  created_at: string;
}

export function addAttachment(noteId: number, type: 'image' | 'file', uri: string, filename: string | null) {
  const createdAt = new Date().toISOString();
  db.runSync(
    `INSERT INTO attachments (note_id, type, uri, filename, created_at) VALUES (?, ?, ?, ?, ?);`,
    [noteId, type, uri, filename, createdAt]
  );
}

export function getAttachmentsForNote(noteId: number): Attachment[] {
  return db.getAllSync<Attachment>(
    `SELECT * FROM attachments WHERE note_id = ? ORDER BY created_at ASC;`,
    [noteId]
  );
}

export function deleteAttachment(id: number) {
  db.runSync(`DELETE FROM attachments WHERE id = ?;`, [id]);
}

export function deleteAttachmentsForNote(noteId: number) {
  db.runSync(`DELETE FROM attachments WHERE note_id = ?;`, [noteId]);
}