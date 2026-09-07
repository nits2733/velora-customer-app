import React, { useState } from 'react'
import { View, Text, Pressable, StyleSheet } from 'react-native'
import { colors, fonts, fontSize, spacing } from '../theme/tokens'
import { useRouter } from '../navigation/router'
import { useAuth } from '../context/AuthContext'
import InputField from '../components/InputField'
import PrimaryButton from '../components/PrimaryButton'
import { authApi } from '../api/auth'
import { ApiError } from '../api/client'

export default function VerifyOtpScreen() {
  const router = useRouter()
  const auth = useAuth()

  const email = String(router.getParam('email') || '')
  const mode: 'login' | 'register' = router.getParam('mode') === 'register' ? 'register' : 'login'

  const [otp, setOtp] = useState('')
  const [error, setError] = useState('')
  const [info, setInfo] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [resending, setResending] = useState(false)

  const handleVerify = async () => {
    if (!otp.trim()) {
      setError('Enter the code we sent you.')
      return
    }
    setError('')
    setInfo('')
    setSubmitting(true)
    try {
      const res = mode === 'register'
        ? await authApi.verifyEmail({ email, otp: otp.trim() })
        : await authApi.verifyLoginOtp({ email, otp: otp.trim() })
      auth.login(res.user, res.accessToken, res.refreshToken)
      router.replace('Home')
    } catch (e) {
      setError(e instanceof ApiError && (e.status === 400 || e.status === 401)
        ? 'Incorrect or expired code.'
        : 'Something went wrong. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  const handleResend = async () => {
    setError('')
    setInfo('')
    setResending(true)
    try {
      await authApi.resendVerificationOtp({ email })
      setInfo('A new code has been sent to your email.')
    } catch (e) {
      setError(e instanceof ApiError ? e.message : 'Could not resend the code. Please try again.')
    } finally {
      setResending(false)
    }
  }

  return (
    <View style={styles.root}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} accessibilityLabel="Go back">
          <Text style={styles.backTxt}>← Back</Text>
        </Pressable>
      </View>
      <View style={styles.content}>
        <Text style={styles.title}>Enter your code</Text>
        <Text style={styles.subtitle}>We sent a one-time code to {email || 'your email'}.</Text>

        <InputField
          label="Verification Code"
          placeholder="6-digit code"
          value={otp}
          onChangeText={setOtp}
          keyboardType="numeric"
          error={error || undefined}
        />

        {info ? <Text style={styles.infoText}>{info}</Text> : null}

        <PrimaryButton
          label={submitting ? 'Verifying…' : 'Verify & Continue'}
          onPress={handleVerify}
          disabled={submitting}
        />

        {mode === 'register' ? (
          <Pressable onPress={handleResend} disabled={resending}>
            <Text style={styles.resend}>
              {resending ? 'Sending…' : "Didn't get a code? Resend"}
            </Text>
          </Pressable>
        ) : (
          <Pressable onPress={() => router.back()}>
            <Text style={styles.resend}>Wrong email? Go back and re-enter</Text>
          </Pressable>
        )}
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    paddingHorizontal: spacing.xl,
    paddingTop: 20,
    paddingBottom: 8,
  },
  backTxt: {
    fontFamily: fonts.body,
    fontSize: fontSize.body,
    color: colors.darkText,
  },
  content: {
    flex: 1,
    padding: spacing.xl,
    paddingTop: spacing.xxl,
    gap: spacing.xl,
  },
  title: {
    fontSize: fontSize.h2,
    fontFamily: fonts.heading,
    color: colors.darkText,
    fontWeight: '700',
  },
  subtitle: {
    fontSize: fontSize.body,
    fontFamily: fonts.body,
    color: colors.mutedText,
    lineHeight: 22,
    marginTop: -spacing.lg,
  },
  infoText: {
    fontSize: fontSize.label,
    fontFamily: fonts.body,
    color: colors.accent,
    textAlign: 'center',
    marginTop: -spacing.lg,
  },
  resend: {
    fontSize: fontSize.label,
    fontFamily: fonts.body,
    color: colors.darkText,
    fontWeight: '600',
    textAlign: 'center',
    textDecorationLine: 'underline',
  },
})
