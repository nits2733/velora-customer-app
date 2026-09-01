import React from 'react'
import { View, Text, Pressable, Image, StyleSheet } from 'react-native'
import { colors, fonts, fontSize, spacing } from '../theme/tokens'

type Props = {
  title?: string
  greeting?: string
  showBack?: boolean
  onBack?: () => void
  onHamburger?: () => void
  showHamburger?: boolean
}

export default function AppHeader({ title, greeting, showBack, onBack, onHamburger, showHamburger = true }: Props) {
  return (
    <View style={styles.container}>
      <View style={styles.left}>
        {showBack ? (
          <Pressable onPress={onBack} style={styles.iconBtn}>
            <Text style={styles.backArrow}>←</Text>
          </Pressable>
        ) : showHamburger ? (
          <Pressable onPress={onHamburger} style={styles.iconBtn}>
            <View style={styles.hamburgerLine} />
            <View style={[styles.hamburgerLine, { width: 18 }]} />
            <View style={styles.hamburgerLine} />
          </Pressable>
        ) : null}
      </View>
      <View style={styles.center}>
        {greeting ? (
          <Text style={styles.greeting}>{greeting}</Text>
        ) : (
          <Text style={styles.title}>{title || 'Velora'}</Text>
        )}
      </View>
      <View style={styles.right}>
        <Pressable style={styles.avatar}>
          <Image source={{ uri: '/assets/4af4b.png' }} style={styles.avatarImg} />
        </Pressable>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    height: 56,
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
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: colors.border,
  },
  avatarImg: {
    width: 32,
    height: 32,
  },
})
