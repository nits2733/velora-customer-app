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

  const [otp, setOtp] = useState('')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const handleVerify = async () => {
    if (!otp.trim()) {
      setError('Enter the code we sent you.')
      return
    }
    setError('')
    setSubmitting(true)
    try {
      const res = await authApi.verifyLoginOtp({ email, otp: otp.trim() })
      auth.login(res.user, res.accessToken, res.refreshToken)
      router.replace('Home')
    } catch (e) {
      setError(e instanceof ApiError && e.status === 401
        ? 'Incorrect or expired code.'
        : 'Something went wrong. Please try again.')
    } finally {
      setSubmitting(false)
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

        <PrimaryButton
          label={submitting ? 'Verifying…' : 'Verify & Log In'}
          onPress={handleVerify}
          disabled={submitting}
        />

        <Pressable onPress={() => router.back()}>
          <Text style={styles.resend}>Wrong email? Go back and re-enter</Text>
        </Pressable>
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
  resend: {
    fontSize: fontSize.label,
    fontFamily: fonts.body,
    color: colors.darkText,
    fontWeight: '600',
    textAlign: 'center',
    textDecorationLine: 'underline',
  },
})
