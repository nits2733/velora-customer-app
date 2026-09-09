import React from 'react'
import { Text, StyleSheet, ViewStyle } from 'react-native'
import AnimatedPressable from './AnimatedPressable'
import { colors, fonts, fontSize, spacing } from '../theme/tokens'

type Props = {
  label: string
  onPress?: () => void
  style?: ViewStyle
  disabled?: boolean
}

export default function PrimaryButton({ label, onPress, style, disabled }: Props) {
  return (
    <AnimatedPressable
      onPress={onPress}
      disabled={disabled}
      style={({ pressed }: { pressed: boolean }) => [styles.btn, pressed && styles.pressed, disabled && styles.disabled, style]}
    >
      <Text style={styles.label}>{label}</Text>
    </AnimatedPressable>
  )
}

const styles = StyleSheet.create({
  btn: {
    backgroundColor: colors.black,
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.xl,
    alignItems: 'center',
    borderRadius: 4,
  },
  pressed: {
    opacity: 0.8,
  },
  disabled: {
    backgroundColor: colors.mutedText,
  },
  label: {
    color: colors.white,
    fontSize: fontSize.body,
    fontFamily: fonts.body,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
})
