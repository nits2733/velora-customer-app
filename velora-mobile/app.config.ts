import type { ExpoConfig } from 'expo/config'

// Backend has no dev proxy on native — point this at the deployed backend
// (or override per-build with EXPO_PUBLIC_API_BASE_URL).
const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL || 'https://api.velora.example.com'

// Google OAuth client IDs (Google Cloud Console -> Credentials). Each
// platform needs its own client ID; the web one must match the backend's
// GOOGLE_CLIENT_ID env var — that's the audience the backend verifies the
// ID token against. Unset in dev until these are registered.
const GOOGLE_WEB_CLIENT_ID = process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID || ''
const GOOGLE_IOS_CLIENT_ID = process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID || ''
const GOOGLE_ANDROID_CLIENT_ID = process.env.EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID || ''

const config: ExpoConfig = {
  name: 'velora-mobile',
  slug: 'velora-mobile',
  version: '1.0.0',
  orientation: 'portrait',
  scheme: 'velora',
  icon: './assets/icon.png',
  userInterfaceStyle: 'light',
  ios: {
    supportsTablet: true,
  },
  android: {
    adaptiveIcon: {
      backgroundColor: '#E6F4FE',
      foregroundImage: './assets/android-icon-foreground.png',
      backgroundImage: './assets/android-icon-background.png',
      monochromeImage: './assets/android-icon-monochrome.png',
    },
    predictiveBackGestureEnabled: false,
    package: 'com.velora.app',
  },
  web: {
    favicon: './assets/favicon.png',
  },
  plugins: ['expo-router', 'expo-status-bar', 'expo-web-browser'],
  extra: {
    apiBaseUrl: API_BASE_URL,
    googleWebClientId: GOOGLE_WEB_CLIENT_ID,
    googleIosClientId: GOOGLE_IOS_CLIENT_ID,
    googleAndroidClientId: GOOGLE_ANDROID_CLIENT_ID,
  },
}

export default config
