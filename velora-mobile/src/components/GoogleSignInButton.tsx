import React, { useEffect, useState } from 'react'
import { Text, View, StyleSheet } from 'react-native'
import Constants from 'expo-constants'
import * as Google from 'expo-auth-session/providers/google'
import * as WebBrowser from 'expo-web-browser'
import Svg, { Path } from 'react-native-svg'
import AnimatedPressable from './AnimatedPressable'
import { colors, fonts, fontSize, spacing } from '../theme/tokens'
import { authApi } from '../api/auth'
import { ApiError } from '../api/client'
import { useAuth } from '../context/AuthContext'

WebBrowser.maybeCompleteAuthSession()

function GoogleLogo() {
  return (
    <Svg width={18} height={18} viewBox="0 0 48 48">
      <Path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3c-1.6 4.7-6.1 8-11.3 8-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.1 8 3l6-6C34.6 5.1 29.6 3 24 3 12.4 3 3 12.4 3 24s9.4 21 21 21 21-9.4 21-21c0-1.2-.1-2.3-.4-3.5z" />
      <Path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.6 15.9 18.9 13 24 13c3.1 0 5.8 1.1 8 3l6-6C34.6 5.1 29.6 3 24 3c-7.4 0-13.7 4.1-17 10.1z" />
      <Path fill="#4CAF50" d="M24 45c5.5 0 10.4-2.1 14.1-5.5l-6.5-5.5C29.6 35.6 26.9 36.5 24 36.5c-5.2 0-9.6-3.3-11.3-7.9l-6.6 5.1C9.3 40.7 16.1 45 24 45z" />
      <Path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.2-2.2 4.1-4 5.5l6.5 5.5C41.9 35.7 45 30.3 45 24c0-1.2-.1-2.3-.4-3.5z" />
    </Svg>
  )
}

type Props = {
  onSuccess: () => void
  onError: (message: string) => void
}

// Uses expo-auth-session's Google provider (the SDK-backed flow — a system
// browser + PKCE, not a hand-rolled redirect) to get a raw Google ID token,
// then hands that to our own backend for verification. The client IDs come
// from app.config.ts's extra.google*ClientId, sourced from
// EXPO_PUBLIC_GOOGLE_*_CLIENT_ID at build time; until those are registered
// in Google Cloud Console, `request` stays null and the button is inert.
export default function GoogleSignInButton({ onSuccess, onError }: Props) {
  const auth = useAuth()
  const [submitting, setSubmitting] = useState(false)

  const extra = (Constants.expoConfig?.extra || {}) as {
    googleWebClientId?: string
    googleIosClientId?: string
    googleAndroidClientId?: string
  }

  // expo-auth-session throws synchronously at render time (not just on tap)
  // if no client ID is set for the current platform, which would crash the
  // whole Login screen before Google OAuth is even configured. The
  // per-platform ids below still take priority once real ones are set —
  // this fallback only keeps the hook from throwing when they're not.
  const [request, response, promptAsync] = Google.useIdTokenAuthRequest({
    clientId: 'not-configured.apps.googleusercontent.com',
    webClientId: extra.googleWebClientId || undefined,
    iosClientId: extra.googleIosClientId || undefined,
    androidClientId: extra.googleAndroidClientId || undefined,
  })

  const isConfigured = Boolean(extra.googleWebClientId || extra.googleIosClientId || extra.googleAndroidClientId)

  useEffect(() => {
    if (!response) return

    if (response.type === 'success') {
      const idToken = response.params?.id_token
      if (idToken) {
        exchangeToken(idToken)
      } else {
        onError('Google Sign-In did not return a token. Please try again.')
      }
    } else if (response.type === 'error') {
      // Token acquisition failed client-side (cancelled, network, config) — retryable.
      onError('Google Sign-In failed. Please try again.')
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [response])

  const exchangeToken = async (idToken: string) => {
    setSubmitting(true)
    try {
      const res = await authApi.google({ idToken })
      auth.login(res.user, res.accessToken, res.refreshToken)
      onSuccess()
    } catch (e) {
      if (e instanceof ApiError && e.status === 500) {
        // Only happens if the backend's GOOGLE_CLIENT_ID isn't configured — a deploy issue.
        onError('Something went wrong. Please try again.')
      } else if (e instanceof ApiError) {
        // 401 (e.g. professional account) and 400 both carry a useful message.
        onError(e.message)
      } else {
        onError('Something went wrong. Please try again.')
      }
    } finally {
      setSubmitting(false)
    }
  }

  const handlePress = async () => {
    onError('')
    if (!isConfigured) {
      onError('Google Sign-In is not set up yet. Please try again later.')
      return
    }
    try {
      await promptAsync()
    } catch {
      onError('Google Sign-In failed. Please try again.')
    }
  }

  return (
    <AnimatedPressable
      style={({ pressed }: { pressed: boolean }) => [styles.btn, pressed && styles.pressed]}
      onPress={handlePress}
      disabled={!request || submitting}
    >
      <View style={styles.content}>
        <GoogleLogo />
        <Text style={styles.label}>{submitting ? 'Signing in…' : 'Continue with Google'}</Text>
      </View>
    </AnimatedPressable>
  )
}

const styles = StyleSheet.create({
  btn: {
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.xl,
    alignItems: 'center',
    borderRadius: 4,
  },
  pressed: {
    backgroundColor: colors.cardBg,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
  },
  label: {
    color: colors.darkText,
    fontSize: fontSize.body,
    fontFamily: fonts.body,
    fontWeight: '600',
    letterSpacing: 0.3,
  },
})
