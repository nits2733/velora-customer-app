import React, { useState } from 'react'
import { View, Text, Pressable, StyleSheet } from 'react-native'
import { colors, fonts, fontSize, spacing } from '../theme/tokens'
import { useRouter } from '../navigation/router'
import { useAuth } from '../context/AuthContext'
import InputField from '../components/InputField'
import PrimaryButton from '../components/PrimaryButton'
import { authApi } from '../api/auth'
import { ApiError } from '../api/client'

export default function RegisterScreen() {
  const router = useRouter()
  const auth = useAuth()

  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const handleRegister = async () => {
    if (!fullName.trim() || !email.trim() || !password) {
      setError('Fill in your name, email, and password.')
      return
    }
    if (password.length < 8) {
      setError('Password must be at least 8 characters.')
      return
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match.')
      return
    }
    setError('')
    setSubmitting(true)
    try {
      const res = await authApi.register({
        fullName: fullName.trim(),
        email: email.trim(),
        password,
        phone: phone.trim() || undefined,
        role: 'CUSTOMER',
      })
      auth.login(res.user, res.accessToken, res.refreshToken)
      router.replace('Home')
    } catch (e) {
      setError(e instanceof ApiError && e.status === 409
        ? 'An account with this email already exists.'
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
        <Text style={styles.title}>Create your account</Text>
        <Text style={styles.subtitle}>Sign up to save projects, get quotations, and track your home services.</Text>

        <View style={styles.fields}>
          <InputField
            label="Full Name"
            placeholder="Your name"
            value={fullName}
            onChangeText={setFullName}
          />
          <InputField
            label="Email"
            placeholder="you@example.com"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />
          <InputField
            label="Phone (optional)"
            placeholder="Your phone number"
            value={phone}
            onChangeText={setPhone}
            keyboardType="phone-pad"
          />
          <InputField
            label="Password"
            placeholder="At least 8 characters"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
          <InputField
            label="Confirm Password"
            placeholder="Re-enter your password"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry
            error={error || undefined}
          />
        </View>

        <PrimaryButton
          label={submitting ? 'Creating account…' : 'Create Account'}
          onPress={handleRegister}
          disabled={submitting}
        />

        <Pressable onPress={() => router.replace('Login')}>
          <Text style={styles.loginLink}>Already have an account? Log In</Text>
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
    paddingBottom: spacing.section,
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
  loginLink: {
    fontSize: fontSize.label,
    fontFamily: fonts.body,
    color: colors.darkText,
    fontWeight: '600',
    textAlign: 'center',
    textDecorationLine: 'underline',
  },
})
