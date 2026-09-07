import React, { useEffect, useState } from 'react'
import { View, Text, ScrollView, ActivityIndicator, StyleSheet } from 'react-native'
import AppHeader from '../components/AppHeader'
import QuotationCard from '../components/QuotationCard'
import EmptyState from '../components/EmptyState'
import { colors, fonts, fontSize, spacing } from '../theme/tokens'
import { useRouter } from '../navigation/router'
import { bookingsApi } from '../api/bookings'
import { quotationsApi } from '../api/quotations'
import type { BookingResponse, QuotationResponse, QuotationStatus } from '../api/types'

type Entry = { booking: BookingResponse; quotation: QuotationResponse }

const DISPLAY_STATUS: Partial<Record<QuotationStatus, 'Pending' | 'Approved' | 'Rejected'>> = {
  SENT: 'Pending',
  ACCEPTED: 'Approved',
  REJECTED: 'Rejected',
}

function projectTitle(b: BookingResponse): string {
  return b.categoryName || b.portfolioItemTitle || (b.requestType === 'FULL_HOME_PROJECT' ? 'Full Home Project' : 'Service Request')
}

function formatDate(iso: string): string {
  const d = new Date(iso)
  if (isNaN(d.getTime())) return ''
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

export default function MyQuotationsScreen() {
  const router = useRouter()
  const [entries, setEntries] = useState<Entry[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    bookingsApi.list()
      .then(async page => {
        const results = await Promise.allSettled(
          page.content.map(async booking => ({ booking, quotation: await quotationsApi.get(booking.id) }))
        )
        const found = results
          .filter((r): r is PromiseFulfilledResult<Entry> => r.status === 'fulfilled')
          .map(r => r.value)
          // A DRAFT quotation hasn't been sent to the customer yet — don't show it.
          .filter(e => e.quotation.status !== 'DRAFT')
          .sort((a, b) => new Date(b.quotation.createdAt).getTime() - new Date(a.quotation.createdAt).getTime())
        setEntries(found)
      })
      .catch(() => setEntries([]))
      .finally(() => setLoading(false))
  }, [])

  return (
    <View style={styles.screen}>
      <AppHeader title="My Quotations" showBack onBack={router.back} showHamburger={false} />
      <ScrollView style={styles.scroll} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {loading ? (
          <View style={styles.loadingWrap}>
            <ActivityIndicator color={colors.darkText} />
          </View>
        ) : entries.length === 0 ? (
          <EmptyState
            title="No Quotations Yet"
            subtitle="Your requested quotations will appear here once a professional sends one."
          />
        ) : (
          <>
            <Text style={styles.subheading}>Your recent quotation requests</Text>
            <View style={styles.list}>
              {entries.map(({ booking, quotation }) => (
                <QuotationCard
                  key={quotation.id}
                  id={String(quotation.id)}
                  services={projectTitle(booking)}
                  amount={quotation.totalAmount.toLocaleString('en-IN')}
                  status={DISPLAY_STATUS[quotation.status] || 'Pending'}
                  date={formatDate(quotation.createdAt)}
                  onPress={() => router.push('QuotationDetail', { bookingId: booking.id })}
                />
              ))}
            </View>
          </>
        )}
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
    gap: spacing.lg,
  },
  loadingWrap: {
    paddingVertical: spacing.section,
    alignItems: 'center',
  },
  subheading: {
    fontSize: fontSize.label,
    fontFamily: fonts.body,
    color: colors.mutedText,
    marginBottom: spacing.xs,
  },
  list: {
    gap: spacing.md,
  },
})
