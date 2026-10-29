/**
 * Google sign-in needs OAuth client IDs from the Google Cloud console for this app. Until they are
 * configured the button is not shown at all: there is no half-working sign-in option.
 *
 * EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID      required (also used to request the ID token on every platform)
 * EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID      optional, iOS builds
 * EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID  optional, Android builds
 */
export interface GoogleConfig {
  webClientId: string;
  iosClientId?: string;
  androidClientId?: string;
}

export function loadGoogleConfig(env: Record<string, string | undefined> = process.env): GoogleConfig | null {
  const webClientId = env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID?.trim();
  if (!webClientId) return null;
  return {
    webClientId,
    iosClientId: env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID?.trim() || undefined,
    androidClientId: env.EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID?.trim() || undefined,
  };
}

export const googleConfig = loadGoogleConfig();
