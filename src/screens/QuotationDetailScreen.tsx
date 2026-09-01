import React from 'react'
import { View, Text, ScrollView, StyleSheet } from 'react-native'
import AppHeader from '../components/AppHeader'
import PrimaryButton from '../components/PrimaryButton'
import SecondaryButton from '../components/SecondaryButton'
import { colors, fonts, fontSize, spacing, radii, shadows } from '../theme/tokens'
import { useRouter } from '../navigation/router'

type QuotationData = {
  id: string
  services: string
  amount: string
  status: 'Approved' | 'Pending' | 'Rejected'
  date: string
  lineItems: { label: string; price: string }[]
  validity: string
  terms: string
}

const mockData: Record<string, QuotationData> = {
  Q001: {
    id: 'Q001',
    services: 'Full Home Interior + Painting',
    amount: '4,50,000',
    status: 'Approved',
    date: 'Aug 28, 2026',
    lineItems: [
      { label: 'Living Room Interior Design', price: '1,80,000' },
      { label: 'Master Bedroom Furnishing', price: '1,40,000' },
      { label: 'Full Home Painting (3 BHK)', price: '75,000' },
      { label: 'Modular Wardrobe (2 units)', price: '55,000' },
    ],
    validity: 'Valid until Sep 28, 2026',
    terms: 'Payment: 30% advance on confirmation, 50% at midpoint, 20% on completion. All materials as per approved samples. Project timeline: 45–60 working days.',
  },
  Q002: {
    id: 'Q002',
    services: 'Carpentry + False Ceiling',
    amount: '1,20,000',
    status: 'Pending',
    date: 'Aug 15, 2026',
    lineItems: [
      { label: 'Custom Carpentry Work', price: '70,000' },
      { label: 'False Ceiling — Living Room', price: '35,000' },
      { label: 'False Ceiling — Master Bedroom', price: '15,000' },
    ],
    validity: 'Valid until Sep 15, 2026',
    terms: 'Payment: 40% advance on confirmation, 60% on completion. All material costs included. Timeline: 20–25 working days.',
  },
  Q003: {
    id: 'Q003',
    services: 'Modular Kitchen',
    amount: '85,000',
    status: 'Rejected',
    date: 'Jul 20, 2026',
    lineItems: [
      { label: 'Modular Kitchen Cabinets', price: '55,000' },
      { label: 'Countertop (Quartz)', price: '20,000' },
      { label: 'Hardware & Fittings', price: '10,000' },
    ],
    validity: 'Expired',
    terms: 'This quotation has been rejected. Please request a new quote if you would like to proceed.',
  },
}

const statusColors: Record<string, { bg: string; text: string; label: string }> = {
  Pending: { bg: '#fef9c3', text: '#854d0e', label: 'Pending Review' },
  Approved: { bg: '#dcfce7', text: '#15803d', label: 'Approved' },
  Rejected: { bg: '#fee2e2', text: '#b91c1c', label: 'Rejected' },
}

export default function QuotationDetailScreen() {
  const router = useRouter()
  const id = router.getParam('id') || 'Q001'
  const data = mockData[id] || mockData['Q001']
  const sc = statusColors[data.status]
  const showAccept = data.status === 'Pending' || data.status === 'Approved'

  return (
    <View style={styles.screen}>
      <AppHeader title="Quotation Details" showBack onBack={router.back} showHamburger={false} />
      <ScrollView style={styles.scroll} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>

        {/* Status header card */}
        <View style={[styles.statusCard, { backgroundColor: sc.bg }]}>
          <View style={styles.statusRow}>
            <Text style={[styles.statusLabel, { color: sc.text }]}>{sc.label}</Text>
            <Text style={[styles.statusId, { color: sc.text }]}>#{data.id}</Text>
          </View>
          <Text style={styles.statusService}>{data.services}</Text>
          <Text style={styles.statusDate}>Requested on {data.date}</Text>
        </View>

        {/* Services breakdown */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Services Breakdown</Text>
          <View style={styles.lineItems}>
            {data.lineItems.map((item, idx) => (
              <View key={idx} style={styles.lineItem}>
                <Text style={styles.lineLabel}>{item.label}</Text>
                <Text style={styles.linePrice}>₹{item.price}</Text>
              </View>
            ))}
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>Total Estimate</Text>
              <Text style={styles.totalAmount}>₹{data.amount}</Text>
            </View>
          </View>
        </View>

        {/* Terms & validity */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Terms & Validity</Text>
          <View style={styles.termsCard}>
            <View style={styles.validityRow}>
              <Text style={styles.validityIcon}>📅</Text>
              <Text style={styles.validityText}>{data.validity}</Text>
            </View>
            <Text style={styles.termsText}>{data.terms}</Text>
          </View>
        </View>

        {/* Actions */}
        <View style={styles.actions}>
          {showAccept && (
            <PrimaryButton
              label="Accept Quotation"
              onPress={() => router.push('Checkout', { quotationId: data.id })}
            />
          )}
          <SecondaryButton
            label="Request Revision"
            onPress={() => router.push('Support')}
          />
        </View>
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scroll: {
    flex: 1,
  },
  content: {
    padding: spacing.xl,
    gap: spacing.xl,
    paddingBottom: 40,
  },
  statusCard: {
    borderRadius: radii.md,
    padding: spacing.lg,
    gap: spacing.sm,
  },
  statusRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statusLabel: {
    fontSize: fontSize.label,
    fontFamily: fonts.body,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  statusId: {
    fontSize: fontSize.label,
    fontFamily: fonts.body,
    fontWeight: '600',
  },
  statusService: {
    fontSize: fontSize.h3,
    fontFamily: fonts.heading,
    color: colors.darkText,
    fontWeight: '700',
    lineHeight: 30,
  },
  statusDate: {
    fontSize: fontSize.caption,
    fontFamily: fonts.body,
    color: colors.mutedText,
  },
  section: {
    gap: spacing.md,
  },
  sectionTitle: {
    fontSize: fontSize.body,
    fontFamily: fonts.body,
    color: colors.darkText,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  lineItems: {
    backgroundColor: colors.cardBg2,
    borderRadius: radii.md,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.border,
    ...shadows.sm,
  },
  lineItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  lineLabel: {
    flex: 1,
    fontSize: fontSize.body,
    fontFamily: fonts.body,
    color: colors.darkText,
    marginRight: spacing.sm,
  },
  linePrice: {
    fontSize: fontSize.body,
    fontFamily: fonts.body,
    color: colors.darkText,
    fontWeight: '500',
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    backgroundColor: colors.cardBg,
  },
  totalLabel: {
    fontSize: fontSize.body,
    fontFamily: fonts.body,
    color: colors.darkText,
    fontWeight: '700',
  },
  totalAmount: {
    fontSize: fontSize.h3,
    fontFamily: fonts.heading,
    color: colors.darkText,
    fontWeight: '700',
  },
  termsCard: {
    backgroundColor: colors.cardBg2,
    borderRadius: radii.md,
    padding: spacing.lg,
    gap: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  validityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  validityIcon: {
    fontSize: 16,
  },
  validityText: {
    fontSize: fontSize.label,
    fontFamily: fonts.body,
    color: colors.mutedText,
    fontWeight: '600',
  },
  termsText: {
    fontSize: fontSize.label,
    fontFamily: fonts.body,
    color: colors.mutedText,
    lineHeight: 20,
  },
  actions: {
    gap: spacing.md,
    marginTop: spacing.sm,
  },
})
