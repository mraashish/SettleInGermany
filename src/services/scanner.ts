import * as DocumentPicker from 'expo-document-picker';
import DocumentScanner, { ResponseType } from 'react-native-document-scanner-plugin';

export interface ScannedPage { uri: string; name: string; type: string }

/**
 * Apps: VisionKit (iOS) / ML Kit (Android) document scanner — multi-page,
 * edge detection, retake and crop are provided by the system UI.
 */
export async function scanDocument(): Promise<ScannedPage[]> {
  const res = await DocumentScanner.scanDocument({ responseType: ResponseType.ImageFilePath, maxNumDocuments: 10 });
  return (res.scannedImages ?? []).map((uri, i) => ({ uri, name: `page-${i + 1}.jpg`, type: 'image/jpeg' }));
}

export async function pickFiles(): Promise<ScannedPage[]> {
  const res = await DocumentPicker.getDocumentAsync({ type: ['image/*', 'application/pdf'], multiple: true, copyToCacheDirectory: true });
  if (res.canceled) return [];
  return res.assets.map((a) => ({ uri: a.uri, name: a.name, type: a.mimeType ?? 'application/octet-stream' }));
}
