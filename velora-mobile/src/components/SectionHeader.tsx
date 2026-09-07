import React from 'react'
import { View, Text, StyleSheet } from 'react-native'
import { colors, fonts, fontSize, spacing } from '../theme/tokens'

type Props = {
  label?: string
  title: string
  subtitle?: string
}

export default function SectionHeader({ label, title, subtitle }: Props) {
  return (
    <View style={styles.container}>
      {label && <Text style={styles.label}>{label}</Text>}
      <Text style={styles.title}>{title}</Text>
      {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    gap: spacing.xs,
  },
  label: {
    fontSize: fontSize.caption,
    fontFamily: fonts.body,
    color: colors.mutedText,
    textTransform: 'uppercase',
    letterSpacing: 1.5,
    fontWeight: '500',
  },
  title: {
    fontSize: fontSize.h3,
    fontFamily: fonts.heading,
    color: colors.darkText,
    fontWeight: '700',
    lineHeight: 30,
  },
  subtitle: {
    fontSize: fontSize.label,
    fontFamily: fonts.body,
    color: colors.mutedText,
    lineHeight: 20,
  },
})
