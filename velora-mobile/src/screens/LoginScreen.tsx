import React, { useState } from 'react'
import { View, Text, Pressable, StyleSheet } from 'react-native'
import { colors, fonts, fontSize, spacing } from '../theme/tokens'
import { useRouter } from '../navigation/router'
import InputField from '../components/InputField'
import PrimaryButton from '../components/PrimaryButton'
import GoogleSignInButton from '../components/GoogleSignInButton'
import { authApi } from '../api/auth'
import { ApiError } from '../api/client'

export default function LoginScreen() {
  const router = useRouter()
  const returnTo = router.getParam('returnTo')
  const returnParams = router.getParam('returnParams')

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [googleError, setGoogleError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const goToReturnRoute = () => {
    router.replace(returnTo || 'Home', returnTo ? returnParams : undefined)
  }

  const handleLogin = async () => {
    if (!email.trim() || !password) {
      setError('Enter your email and password.')
      return
    }
    setError('')
    setSubmitting(true)
    try {
      await authApi.login({ email: email.trim(), password })
      router.push('VerifyOtp', { email: email.trim(), returnTo, returnParams })
    } catch (e) {
      if (e instanceof ApiError && e.status === 401 && /not verified/i.test(e.message)) {
        router.push('VerifyOtp', { email: email.trim(), mode: 'register', returnTo, returnParams })
        return
      }
      setError(e instanceof ApiError && e.status === 401
        ? 'Incorrect email or password.'
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
        <Text style={styles.title}>Welcome back</Text>
        <Text style={styles.subtitle}>Log in to view your profile, projects, and quotations.</Text>

        <View style={styles.fields}>
          <InputField
            label="Email"
            placeholder="you@example.com"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />
          <InputField
            label="Password"
            placeholder="Enter your password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            error={error || undefined}
          />
        </View>

        <PrimaryButton
          label={submitting ? 'Logging in…' : 'Log In'}
          onPress={handleLogin}
          disabled={submitting}
        />

        <Text style={styles.disclaimer}>
          We'll send a one-time code to your email to confirm it's you.
        </Text>

        <View style={styles.dividerRow}>
          <View style={styles.dividerLine} />
          <Text style={styles.dividerText}>OR</Text>
          <View style={styles.dividerLine} />
        </View>

        <View>
          <GoogleSignInButton onSuccess={goToReturnRoute} onError={setGoogleError} />
          {googleError ? <Text style={styles.googleError}>{googleError}</Text> : null}
        </View>

        <Pressable onPress={() => router.push('Register', { returnTo, returnParams })}>
          <Text style={styles.registerLink}>New here? Create an account</Text>
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
  fields: {
    gap: spacing.lg,
  },
  disclaimer: {
    fontSize: fontSize.caption,
    fontFamily: fonts.body,
    color: colors.mutedText,
    textAlign: 'center',
    lineHeight: 18,
  },
  registerLink: {
    fontSize: fontSize.label,
    fontFamily: fonts.body,
    color: colors.darkText,
    fontWeight: '600',
    textAlign: 'center',
    textDecorationLine: 'underline',
  },
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    marginTop: -spacing.md,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: colors.border,
  },
  dividerText: {
    fontSize: fontSize.caption,
    fontFamily: fonts.body,
    color: colors.mutedText,
    letterSpacing: 1,
  },
  googleError: {
    fontSize: fontSize.caption,
    fontFamily: fonts.body,
    color: colors.error,
    textAlign: 'center',
    marginTop: spacing.sm,
  },
})
