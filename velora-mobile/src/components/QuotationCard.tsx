import React from 'react'
import { View, Text, Pressable, StyleSheet } from 'react-native'
import { colors, fonts, fontSize, radii, spacing, statusColors } from '../theme/tokens'

type Props = {
  id: string
  services: string
  amount: string
  status: 'Pending' | 'Approved' | 'Rejected'
  date: string
  onPress?: () => void
}

const STATUS_KEY: Record<Props['status'], keyof typeof statusColors> = {
  Pending: 'pending',
  Approved: 'approved',
  Rejected: 'rejected',
}

export default function QuotationCard({ id, services, amount, status, date, onPress }: Props) {
  const sc = statusColors[STATUS_KEY[status]]
  return (
    <Pressable onPress={onPress} style={styles.card}>
      <View style={styles.row}>
        <Text style={styles.id}>#{id}</Text>
        <View style={[styles.badge, { backgroundColor: sc.bg }]}>
          <Text style={[styles.badgeText, { color: sc.text }]}>{status}</Text>
        </View>
      </View>
      <Text style={styles.services}>{services}</Text>
      <View style={styles.row}>
        <Text style={styles.amount}>₹{amount}</Text>
        <Text style={styles.date}>{date}</Text>
      </View>
    </Pressable>
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
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  id: {
    fontSize: fontSize.label,
    fontFamily: fonts.body,
    color: colors.mutedText,
    fontWeight: '500',
  },
  badge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: radii.round,
  },
  badgeText: {
    fontSize: fontSize.caption,
    fontFamily: fonts.body,
    fontWeight: '600',
  },
  services: {
    fontSize: fontSize.body,
    fontFamily: fonts.body,
    color: colors.darkText,
    fontWeight: '500',
  },
  amount: {
    fontSize: fontSize.body,
    fontFamily: fonts.heading,
    color: colors.darkText,
    fontWeight: '700',
  },
  date: {
    fontSize: fontSize.caption,
    fontFamily: fonts.body,
    color: colors.mutedText,
  },
})
