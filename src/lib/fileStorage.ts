import { File, Directory, Paths } from 'expo-file-system';

const ATTACHMENTS_DIR = new Directory(Paths.document, 'attachments');

function ensureDirExists() {
  if (!ATTACHMENTS_DIR.exists) {
    ATTACHMENTS_DIR.create({ intermediates: true });
  }
}

export function copyToPermanentStorage(sourceUri: string, suggestedName?: string): { uri: string; filename: string } {
  ensureDirExists();
  const filename = suggestedName || sourceUri.split('/').pop() || `file_${Date.now()}`;
  const destFile = new File(ATTACHMENTS_DIR, `${Date.now()}_${filename}`);
  const sourceFile = new File(sourceUri);
  sourceFile.copy(destFile);
  return { uri: destFile.uri, filename };
}

export function deleteStoredFile(uri: string) {
  try {
    const file = new File(uri);
    if (file.exists) {
      file.delete();
    }
  } catch (e) {
    // File may already be gone — ignore
  }
}