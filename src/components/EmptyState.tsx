import React from 'react'
import { View, Text, StyleSheet } from 'react-native'
import { colors, fonts, fontSize, spacing } from '../theme/tokens'
import PrimaryButton from './PrimaryButton'

type Props = {
  title: string
  subtitle?: string
  ctaLabel?: string
  onCta?: () => void
}

export default function EmptyState({ title, subtitle, ctaLabel, onCta }: Props) {
  return (
    <View style={styles.container}>
      <Text style={styles.icon}>◉</Text>
      <Text style={styles.title}>{title}</Text>
      {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
      {ctaLabel && <PrimaryButton label={ctaLabel} onPress={onCta} style={styles.btn} />}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.xxxl,
    gap: spacing.md,
  },
  icon: {
    fontSize: 48,
    color: colors.border,
    marginBottom: spacing.sm,
  },
  title: {
    fontSize: fontSize.h3,
    fontFamily: fonts.heading,
    color: colors.darkText,
    fontWeight: '700',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: fontSize.label,
    fontFamily: fonts.body,
    color: colors.mutedText,
    textAlign: 'center',
    lineHeight: 20,
  },
  btn: {
    marginTop: spacing.md,
    paddingHorizontal: spacing.xxxl,
  },
})
