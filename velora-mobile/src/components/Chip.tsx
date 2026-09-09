import React from 'react'
import { Text, StyleSheet } from 'react-native'
import AnimatedPressable from './AnimatedPressable'
import { colors, fonts, fontSize, radii, spacing } from '../theme/tokens'

type Props = {
  label: string
  selected?: boolean
  onPress?: () => void
}

export default function Chip({ label, selected, onPress }: Props) {
  return (
    <AnimatedPressable
      onPress={onPress}
      style={[styles.chip, selected && styles.selected]}
    >
      <Text style={[styles.label, selected && styles.selectedLabel]}>{label}</Text>
    </AnimatedPressable>
  )
}

const styles = StyleSheet.create({
  chip: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs + 2,
    borderRadius: radii.round,
    borderWidth: 1.5,
    borderColor: colors.border,
    backgroundColor: colors.white,
  },
  selected: {
    backgroundColor: colors.darkText,
    borderColor: colors.darkText,
  },
  label: {
    fontSize: fontSize.label,
    fontFamily: fonts.body,
    color: colors.darkText,
    fontWeight: '500',
  },
  selectedLabel: {
    color: colors.white,
  },
})
