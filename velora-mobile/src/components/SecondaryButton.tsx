import React from 'react'
import { Text, StyleSheet, ViewStyle } from 'react-native'
import AnimatedPressable from './AnimatedPressable'
import { colors, fonts, fontSize, spacing } from '../theme/tokens'

type Props = {
  label: string
  onPress?: () => void
  style?: ViewStyle
}

export default function SecondaryButton({ label, onPress, style }: Props) {
  return (
    <AnimatedPressable
      onPress={onPress}
      style={({ pressed }: { pressed: boolean }) => [styles.btn, pressed && styles.pressed, style]}
    >
      <Text style={styles.label}>{label}</Text>
    </AnimatedPressable>
  )
}

const styles = StyleSheet.create({
  btn: {
    borderWidth: 1.5,
    borderColor: colors.darkText,
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.xl,
    alignItems: 'center',
    borderRadius: 4,
    backgroundColor: 'transparent',
  },
  pressed: {
    backgroundColor: colors.cardBg,
  },
  label: {
    color: colors.darkText,
    fontSize: fontSize.body,
    fontFamily: fonts.body,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
})
