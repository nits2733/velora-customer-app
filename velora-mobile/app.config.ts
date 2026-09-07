import type { ExpoConfig } from 'expo/config'

// Backend has no dev proxy on native — point this at the deployed backend
// (or override per-build with EXPO_PUBLIC_API_BASE_URL).
const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL || 'https://api.velora.example.com'

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
  plugins: ['expo-router', 'expo-status-bar'],
  extra: {
    apiBaseUrl: API_BASE_URL,
  },
}

export default config
