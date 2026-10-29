import * as ImageManipulator from 'expo-image-manipulator';
import * as ImagePicker from 'expo-image-picker';
import { Platform } from 'react-native';

export type AvatarPick = { status: 'picked'; uri: string } | { status: 'cancelled' } | { status: 'denied' };

/** Square, so the picture is not stretched in the round avatar. The upload limit is 10 MB; this lands far below it. */
export const AVATAR_SIZE = 512;
const JPEG_QUALITY = 0.8;

/** Resizes and recompresses on the device before upload, so a 12 MP photo never travels over mobile data. */
export async function compressAvatar(uri: string): Promise<string> {
  const result = await ImageManipulator.manipulateAsync(uri, [{ resize: { width: AVATAR_SIZE, height: AVATAR_SIZE } }], {
    compress: JPEG_QUALITY,
    format: ImageManipulator.SaveFormat.JPEG,
  });
  return result.uri;
}

/** Asks for photo access (not needed on web), lets the customer crop to a square, and returns a compressed JPEG. */
export async function pickAvatar(): Promise<AvatarPick> {
  if (Platform.OS !== 'web') {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) return { status: 'denied' };
  }
  const result = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ['images'], allowsEditing: true, aspect: [1, 1], quality: 1 });
  if (result.canceled || !result.assets[0]) return { status: 'cancelled' };
  return { status: 'picked', uri: await compressAvatar(result.assets[0].uri) };
}
