import React, { useEffect, useRef, useState } from 'react'
import { Text, View, StyleSheet } from 'react-native'
import Constants from 'expo-constants'
import Svg, { Path } from 'react-native-svg'
import { colors, fonts, fontSize, spacing } from '../theme/tokens'
import { authApi } from '../api/auth'
import { ApiError } from '../api/client'
import { useAuth } from '../context/AuthContext'

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

const GIS_SRC = 'https://accounts.google.com/gsi/client'

let gisLoadPromise: Promise<void> | null = null
function loadGis(): Promise<void> {
  const w = window as any
  if (w.google?.accounts?.id) return Promise.resolve()
  if (!gisLoadPromise) {
    gisLoadPromise = new Promise((resolve, reject) => {
      const script = document.createElement('script')
      script.src = GIS_SRC
      script.async = true
      script.defer = true
      script.onload = () => resolve()
      script.onerror = () => reject(new Error('Failed to load accounts.google.com/gsi/client'))
      document.head.appendChild(script)
    })
  }
  return gisLoadPromise
}

// Web build: Google Identity Services' JS SDK, not expo-auth-session. GIS
// hands back the ID token through a JS callback (google.accounts.id
// initialize/renderButton) — there's no OAuth redirect step, so unlike
// AuthSession's browser-redirect flow it can't hit redirect_uri_mismatch;
// the only Google Cloud Console config it needs is the origin already
// registered under "Authorized JavaScript origins".
//
// Google's own renderButton draws the actual clickable element (its box
// can't be freely restyled — it's an iframe), so we render it invisible
// and stacked on top of our themed button underneath, which forwards the
// click through to it. This keeps this app's exact button design while
// still using Google's real, compliant sign-in element as what's actually
// clicked.
export default function GoogleSignInButton({ onSuccess, onError }: Props) {
  const auth = useAuth()
  const containerRef = useRef<View>(null)
  const renderedWidthRef = useRef(0)
  const [submitting, setSubmitting] = useState(false)
  const [ready, setReady] = useState(false)
  const [width, setWidth] = useState(0)

  const clientId = (Constants.expoConfig?.extra as { googleWebClientId?: string } | undefined)?.googleWebClientId

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

  useEffect(() => {
    if (!clientId || width <= 0 || width === renderedWidthRef.current) return
    const node = containerRef.current as unknown as HTMLElement | null
    if (!node) return

    let cancelled = false
    loadGis()
      .then(() => {
        if (cancelled) return
        const google = (window as any).google
        google.accounts.id.initialize({
          client_id: clientId,
          callback: (response: { credential?: string }) => {
            if (!response?.credential) {
              onError('Google Sign-In did not return a token. Please try again.')
              return
            }
            exchangeToken(response.credential)
          },
        })
        node.innerHTML = ''
        google.accounts.id.renderButton(node, {
          type: 'standard',
          theme: 'outline',
          size: 'large',
          text: 'continue_with',
          width: Math.min(Math.round(width), 400),
        })
        renderedWidthRef.current = width
        setReady(true)
      })
      .catch(() => {
        if (!cancelled) onError('Google Sign-In failed to load. Please try again.')
      })

    return () => {
      cancelled = true
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [clientId, width])

  return (
    <View
      style={styles.wrap}
      onLayout={(e) => setWidth(e.nativeEvent.layout.width)}
    >
      <View pointerEvents="none" style={styles.btn}>
        <GoogleLogo />
        <Text style={styles.label}>
          {submitting ? 'Signing in…' : !clientId ? 'Google Sign-In is not set up yet' : 'Continue with Google'}
        </Text>
      </View>
      {/* The real, clickable Google button — invisible, stacked on top so every click reaches it. */}
      <View ref={containerRef} style={[styles.overlay, (!clientId || !ready) && styles.overlayInert]} />
    </View>
  )
}

const styles = StyleSheet.create({
  wrap: {
    position: 'relative',
  },
  btn: {
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.xl,
    borderRadius: 4,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    opacity: 0,
    overflow: 'hidden',
  } as any,
  overlayInert: {
    pointerEvents: 'none',
  } as any,
  label: {
    color: colors.darkText,
    fontSize: fontSize.body,
    fontFamily: fonts.body,
    fontWeight: '600',
    letterSpacing: 0.3,
  },
})
