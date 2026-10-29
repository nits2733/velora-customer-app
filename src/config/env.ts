import Constants from 'expo-constants';
import { Platform } from 'react-native';

/**
 * API base URL resolution:
 * 1. EXPO_PUBLIC_API_BASE_URL wins (production / physical device on LAN).
 * 2. In dev, derive the dev-machine host from the Metro host so a physical device
 *    reaches the backend without hardcoding an IP.
 * 3. Android emulator -> 10.0.2.2, iOS simulator -> localhost.
 */
function resolveApiBaseUrl(): string {
  const explicit = process.env.EXPO_PUBLIC_API_BASE_URL;
  if (explicit) return explicit.replace(/\/+$/, '');
  // A release build with no URL would quietly call localhost on the customer's phone.
  if (!__DEV__) throw new Error('EXPO_PUBLIC_API_BASE_URL must be set in a release build.');

  const hostUri = Constants.expoConfig?.hostUri;
  const metroHost = hostUri?.split(':')[0];
  if (metroHost) return `http://${metroHost}:8080`;

  return Platform.OS === 'android' ? 'http://10.0.2.2:8080' : 'http://localhost:8080';
}

export const env = {
  apiBaseUrl: resolveApiBaseUrl(),
  cloudinaryCloudName: process.env.EXPO_PUBLIC_CLOUDINARY_CLOUD_NAME ?? '',
};
