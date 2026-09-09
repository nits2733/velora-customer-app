import React from 'react'
import { View, Text, StyleSheet } from 'react-native'
import AnimatedPressable from './AnimatedPressable'
import { colors, fonts, fontSize, radii, spacing, shadows, statusColors } from '../theme/tokens'

type Props = {
  title: string
  status: string
  progress?: number
  professional?: string
  onPress?: () => void
}

export default function ProjectCard({ title, status, progress, professional, onPress }: Props) {
  return (
    <AnimatedPressable onPress={onPress} style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.title}>{title}</Text>
        <View style={[styles.badge, status === 'Active' && styles.activeBadge]}>
          <Text style={[styles.badgeText, status === 'Active' && styles.activeBadgeText]}>{status}</Text>
        </View>
      </View>
      {professional && <Text style={styles.sub}>Assigned: {professional}</Text>}
      {progress !== undefined && (
        <View style={styles.progressWrap}>
          <View style={styles.progressBg}>
            <View style={[styles.progressFill, { width: `${progress}%` as any }]} />
          </View>
          <Text style={styles.progressText}>{progress}% complete</Text>
        </View>
      )}
    </AnimatedPressable>
  )
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.cardBg2,
    borderRadius: radii.md,
    padding: spacing.lg,
    gap: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
    ...shadows.sm,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  title: {
    fontSize: fontSize.body,
    fontFamily: fonts.heading,
    color: colors.darkText,
    fontWeight: '600',
    flex: 1,
  },
  badge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: radii.round,
    backgroundColor: colors.border,
  },
  activeBadge: {
    backgroundColor: statusColors.approved.bg,
  },
  badgeText: {
    fontSize: fontSize.caption,
    fontFamily: fonts.body,
    color: colors.mutedText,
    fontWeight: '500',
  },
  activeBadgeText: {
    color: statusColors.approved.text,
  },
  sub: {
    fontSize: fontSize.caption,
    fontFamily: fonts.body,
    color: colors.mutedText,
  },
  progressWrap: {
    gap: 4,
  },
  progressBg: {
    height: 4,
    backgroundColor: colors.border,
    borderRadius: radii.round,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: colors.green,
    borderRadius: radii.round,
  },
  progressText: {
    fontSize: fontSize.caption,
    fontFamily: fonts.body,
    color: colors.mutedText,
  },
})
