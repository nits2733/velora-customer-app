import React, { useEffect, useState } from 'react'
import { View, Text, ScrollView, ActivityIndicator, StyleSheet } from 'react-native'
import AppHeader from '../components/AppHeader'
import PrimaryButton from '../components/PrimaryButton'
import SecondaryButton from '../components/SecondaryButton'
import ConfirmModal from '../components/ConfirmModal'
import EmptyState from '../components/EmptyState'
import { colors, fonts, fontSize, spacing, radii, shadows, statusColors } from '../theme/tokens'
import { useRouter } from '../navigation/router'
import { bookingsApi } from '../api/bookings'
import { quotationsApi } from '../api/quotations'
import { ApiError } from '../api/client'
import type { BookingResponse, QuotationResponse, QuotationStatus } from '../api/types'
import { projectTitle, formatDate } from '../utils/booking'

const STATUS_DISPLAY: Record<QuotationStatus, { label: string; key: keyof typeof statusColors }> = {
  DRAFT: { label: 'Draft', key: 'pending' },
  SENT: { label: 'Pending Review', key: 'pending' },
  ACCEPTED: { label: 'Approved', key: 'approved' },
  REJECTED: { label: 'Rejected', key: 'rejected' },
}

export default function QuotationDetailScreen() {
  const router = useRouter()
  const bookingId = Number(router.getParam('bookingId'))

  const [booking, setBooking] = useState<BookingResponse | null>(null)
  const [quotation, setQuotation] = useState<QuotationResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const [actionError, setActionError] = useState('')
  const [busy, setBusy] = useState(false)
  const [showRejectConfirm, setShowRejectConfirm] = useState(false)

  useEffect(() => {
    if (!bookingId) {
      setLoading(false)
      setError(true)
      return
    }
    Promise.all([bookingsApi.getById(bookingId), quotationsApi.get(bookingId)])
      .then(([b, q]) => {
        setBooking(b)
        setQuotation(q)
      })
      .catch(() => setError(true))
      .finally(() => setLoading(false))
  }, [bookingId])

  const handleAccept = async () => {
    setActionError('')
    setBusy(true)
    try {
      const updated = await quotationsApi.accept(bookingId)
      setQuotation(updated)
    } catch (e) {
      setActionError(e instanceof ApiError ? 'Could not accept this quotation. Please try again.' : 'Something went wrong.')
    } finally {
      setBusy(false)
    }
  }

  const handleReject = async () => {
    setShowRejectConfirm(false)
    setActionError('')
    setBusy(true)
    try {
      const updated = await quotationsApi.reject(bookingId)
      setQuotation(updated)
    } catch (e) {
      setActionError(e instanceof ApiError ? 'Could not reject this quotation. Please try again.' : 'Something went wrong.')
    } finally {
      setBusy(false)
    }
  }

  if (loading) {
    return (
      <View style={styles.centerWrap}>
        <ActivityIndicator color={colors.darkText} />
      </View>
    )
  }

  if (error || !booking || !quotation) {
    return (
      <View style={styles.screen}>
        <AppHeader title="Quotation Details" showBack onBack={router.back} showHamburger={false} />
        <EmptyState
          title="Couldn't load this quotation"
          subtitle="It may have been removed, or you don't have access to it."
        />
      </View>
    )
  }

  const sc = STATUS_DISPLAY[quotation.status]
  const scColors = statusColors[sc.key]
  const showActions = quotation.status === 'SENT'

  return (
    <View style={styles.screen}>
      <AppHeader title="Quotation Details" showBack onBack={router.back} showHamburger={false} />
      <ScrollView style={styles.scroll} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>

        {/* Status header card */}
        <View style={[styles.statusCard, { backgroundColor: scColors.bg }]}>
          <View style={styles.statusRow}>
            <Text style={[styles.statusLabel, { color: scColors.text }]}>{sc.label}</Text>
            <Text style={[styles.statusId, { color: scColors.text }]}>#{quotation.id}</Text>
          </View>
          <Text style={styles.statusService}>{projectTitle(booking)}</Text>
          <Text style={styles.statusDate}>Requested on {formatDate(quotation.createdAt)}</Text>
        </View>

        {/* Services breakdown */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Services Breakdown</Text>
          <View style={styles.lineItems}>
            {quotation.lineItems.map((item) => (
              <View key={item.id} style={styles.lineItem}>
                <Text style={styles.lineLabel}>{item.description}</Text>
                <Text style={styles.linePrice}>₹{item.amount.toLocaleString('en-IN')}</Text>
              </View>
            ))}
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>Total Estimate</Text>
              <Text style={styles.totalAmount}>₹{quotation.totalAmount.toLocaleString('en-IN')}</Text>
            </View>
          </View>
        </View>

        {/* Notes from professional */}
        {quotation.notes && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Notes from Your Professional</Text>
            <View style={styles.termsCard}>
              <Text style={styles.termsText}>{quotation.notes}</Text>
            </View>
          </View>
        )}

        {/* Actions */}
        <View style={styles.actions}>
          {actionError ? <Text style={styles.errorText}>{actionError}</Text> : null}
          {showActions ? (
            <>
              <PrimaryButton
                label={busy ? 'Please wait…' : 'Accept Quotation'}
                onPress={handleAccept}
                disabled={busy}
              />
              <SecondaryButton
                label="Reject Quotation"
                onPress={() => setShowRejectConfirm(true)}
              />
            </>
          ) : quotation.status === 'ACCEPTED' ? (
            <Text style={styles.statusNote}>You accepted this quotation.</Text>
          ) : quotation.status === 'REJECTED' ? (
            <Text style={styles.statusNote}>You rejected this quotation.</Text>
          ) : null}
          <SecondaryButton
            label="Contact Support"
            onPress={() => router.push('Support')}
          />
        </View>
      </ScrollView>

      <ConfirmModal
        visible={showRejectConfirm}
        title="Reject this quotation?"
        message="This will let your professional know you'd like to make changes or aren't proceeding."
        confirmLabel="Reject"
        danger
        onCancel={() => setShowRejectConfirm(false)}
        onConfirm={handleReject}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },
  centerWrap: {
    flex: 1,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
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
    borderWidth: 1,
    borderColor: colors.border,
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
  statusNote: {
    fontSize: fontSize.label,
    fontFamily: fonts.body,
    color: colors.mutedText,
    textAlign: 'center',
    fontStyle: 'italic',
  },
  errorText: {
    fontSize: fontSize.label,
    fontFamily: fonts.body,
    color: colors.error,
    textAlign: 'center',
  },
})
