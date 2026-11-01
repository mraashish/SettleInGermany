import * as DocumentPicker from 'expo-document-picker';

export interface ScannedPage { uri: string; name: string; type: string }

/** Web has no scanner: upload drop zone + "take a photo" (LetterFlow step=upload). */
export async function scanDocument(): Promise<ScannedPage[]> {
  return pickFiles();
}

export async function pickFiles(): Promise<ScannedPage[]> {
  const res = await DocumentPicker.getDocumentAsync({ type: ['image/*', 'application/pdf'], multiple: true });
  if (res.canceled) return [];
  return res.assets.map((a) => ({ uri: a.uri, name: a.name, type: a.mimeType ?? 'application/octet-stream' }));
}
