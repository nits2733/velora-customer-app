import React from 'react'
import { View, Text, Pressable, StyleSheet } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { colors, fonts, fontSize, spacing } from '../theme/tokens'
import { useRouter } from '../navigation/router'
import { useAuth } from '../context/AuthContext'
import Avatar from './Avatar'

type Props = {
  title?: string
  greeting?: string
  showBack?: boolean
  onBack?: () => void
  onHamburger?: () => void
  showHamburger?: boolean
}

export default function AppHeader({ title, greeting, showBack, onBack, onHamburger, showHamburger = true }: Props) {
  const router = useRouter()
  const auth = useAuth()
  const insets = useSafeAreaInsets()
  return (
    <View style={[styles.container, { paddingTop: insets.top + spacing.sm }]}>
      <View style={styles.left}>
        {showBack ? (
          <Pressable onPress={onBack} style={styles.iconBtn} accessibilityLabel="Go back">
            <Text style={styles.backArrow}>←</Text>
          </Pressable>
        ) : showHamburger ? (
          <Pressable onPress={onHamburger} style={styles.iconBtn} accessibilityLabel="Open menu">
            <View style={styles.hamburgerLine} />
            <View style={[styles.hamburgerLine, { width: 18 }]} />
            <View style={styles.hamburgerLine} />
          </Pressable>
        ) : null}
      </View>
      <View style={styles.center}>
        {greeting ? (
          <Text style={styles.greeting}>{greeting}</Text>
        ) : title ? (
          <Text style={styles.title}>{title}</Text>
        ) : (
          <Text style={styles.brandTitle}>VELORA</Text>
        )}
      </View>
      <View style={styles.right}>
        <Pressable style={styles.avatar} accessibilityLabel="Profile" onPress={() => router.push('Profile')}>
          <Avatar uri={auth.avatarUrl} name={auth.user?.fullName || 'Guest'} size={32} />
        </Pressable>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    minHeight: 56,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.xl,
    backgroundColor: colors.background,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  left: {
    width: 40,
    alignItems: 'flex-start',
  },
  center: {
    flex: 1,
    alignItems: 'center',
  },
  right: {
    width: 40,
    alignItems: 'flex-end',
  },
  iconBtn: {
    padding: 4,
    gap: 4,
  },
  hamburgerLine: {
    width: 22,
    height: 2,
    backgroundColor: colors.darkText,
    marginVertical: 2,
    borderRadius: 1,
  },
  backArrow: {
    fontSize: 22,
    color: colors.darkText,
    fontFamily: fonts.body,
  },
  greeting: {
    fontSize: fontSize.body,
    fontFamily: fonts.heading,
    color: colors.darkText,
    fontWeight: '600',
  },
  title: {
    fontSize: fontSize.body,
    fontFamily: fonts.heading,
    color: colors.darkText,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  brandTitle: {
    fontSize: 22,
    fontFamily: fonts.heading,
    color: colors.darkText,
    fontWeight: '700',
    letterSpacing: 2,
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    overflow: 'hidden',
  },
})
