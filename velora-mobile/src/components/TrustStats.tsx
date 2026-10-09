import React from 'react'
import { View, Text, StyleSheet } from 'react-native'
import { colors, fonts, fontSize, spacing, radii, fontWeight } from '../theme/tokens'

const STATS = [
  { value: '500+', label: 'Projects Delivered' },
  { value: '150+', label: 'Vetted Professionals' },
  { value: '4.8★', label: 'Average Rating' },
]

export default function TrustStats() {
  return (
    <View style={s.statsRow}>
      {STATS.map((stat, i) => (
        <React.Fragment key={stat.label}>
          <View style={s.statItem}>
            <Text style={s.statValue}>{stat.value}</Text>
            <Text style={s.statLabel}>{stat.label}</Text>
          </View>
          {i < STATS.length - 1 && <View style={s.statDivider} />}
        </React.Fragment>
      ))}
    </View>
  )
}

const s = StyleSheet.create({
  statsRow: {
    flexDirection: 'row',
    backgroundColor: colors.cardBg,
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: 'hidden',
  },
  statItem: { flex: 1, alignItems: 'center', paddingVertical: spacing.lg, gap: 4 },
  statValue: { fontFamily: fonts.heading, fontSize: fontSize.h3, color: colors.darkText, fontWeight: fontWeight.bold },
  statLabel: { fontFamily: fonts.body, fontSize: fontSize.caption, color: colors.mutedText, textAlign: 'center' },
  statDivider: { width: 1, backgroundColor: colors.border, marginVertical: spacing.md },
})
