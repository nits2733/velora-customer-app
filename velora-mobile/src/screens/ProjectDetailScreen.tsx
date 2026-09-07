import React, { useEffect, useState } from 'react'
import { View, Text, ScrollView, Pressable, Image, ActivityIndicator, StyleSheet } from 'react-native'
import { colors, fonts, fontSize, spacing, radii, shadows, statusColors } from '../theme/tokens'
import { useRouter } from '../navigation/router'
import PrimaryButton from '../components/PrimaryButton'
import EmptyState from '../components/EmptyState'
import { bookingsApi } from '../api/bookings'
import type { BookingResponse, BookingStatus } from '../api/types'
import ImgLivingRoom from '../../assets/images/95cf7.png'
import ImgBedroom from '../../assets/images/f1c0e.png'
import ImgKitchen from '../../assets/images/90052.png'
import ImgBathroom from '../../assets/images/5aa20.png'
import FALLBACK_IMAGE from '../../assets/images/ab679.png'

const CATEGORY_IMAGES: Record<string, number> = {
  'Living Room': ImgLivingRoom,
  'Bedroom': ImgBedroom,
  'Kitchen': ImgKitchen,
  'Bathroom': ImgBathroom,
}

const STATUS_DISPLAY: Record<BookingStatus, { label: string; key: keyof typeof statusColors }> = {
  PENDING_ASSIGNMENT: { label: 'Awaiting Assignment', key: 'pending' },
  PENDING: { label: 'Pending', key: 'pending' },
  CONFIRMED: { label: 'In Progress', key: 'approved' },
  COMPLETED: { label: 'Completed', key: 'approved' },
  CANCELLED: { label: 'Cancelled', key: 'rejected' },
}

function projectTitle(b: BookingResponse): string {
  return b.categoryName || b.portfolioItemTitle || (b.requestType === 'FULL_HOME_PROJECT' ? 'Full Home Project' : 'Service Request')
}

function formatDate(iso: string): string {
  const d = new Date(iso)
  if (isNaN(d.getTime())) return ''
  return d.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
}

export default function ProjectDetailScreen() {
  const router = useRouter()
  const id = Number(router.getParam('id'))

  const [booking, setBooking] = useState<BookingResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    if (!id) {
      setLoading(false)
      setError(true)
      return
    }
    setLoading(true)
    setError(false)
    bookingsApi.getById(id)
      .then(setBooking)
      .catch(() => setError(true))
      .finally(() => setLoading(false))
  }, [id])

  if (loading) {
    return (
      <View style={styles.centerWrap}>
        <ActivityIndicator color={colors.darkText} />
      </View>
    )
  }

  if (error || !booking) {
    return (
      <View style={styles.root}>
        <Pressable onPress={() => router.back()} style={styles.backBtnPlain} accessibilityLabel="Go back">
          <Text style={styles.backArrow}>←</Text>
        </Pressable>
        <EmptyState
          title="Couldn't load this project"
          subtitle="Check your connection and try again."
        />
      </View>
    )
  }

  const statusInfo = STATUS_DISPLAY[booking.status]
  const sc = statusColors[statusInfo.key]
  const heroImage = (booking.categoryName && CATEGORY_IMAGES[booking.categoryName]) || FALLBACK_IMAGE

  return (
    <View style={styles.root}>
      <ScrollView style={styles.scroll} contentContainerStyle={styles.content}>
        {/* Hero */}
        <View style={styles.heroWrap}>
          <Image source={heroImage} style={styles.hero} alt={projectTitle(booking)} />
          <Pressable onPress={() => router.back()} style={styles.backBtn} accessibilityLabel="Go back">
            <Text style={styles.backArrow}>←</Text>
          </Pressable>
        </View>

        {/* Body */}
        <View style={styles.body}>
          {/* Status + Title */}
          <View style={styles.statusRow}>
            <View style={[styles.statusBadge, { backgroundColor: sc.bg }]}>
              <Text style={[styles.statusText, { color: sc.text }]}>{statusInfo.label}</Text>
            </View>
          </View>
          <Text style={styles.projectTitle}>{projectTitle(booking)}</Text>

          {/* Details */}
          <View style={styles.detailsCard}>
            {booking.location && (
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Location</Text>
                <Text style={styles.detailValue}>📍 {booking.location}</Text>
              </View>
            )}
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Scheduled</Text>
              <Text style={styles.detailValue}>{formatDate(booking.scheduledAt)}</Text>
            </View>
            {booking.budget != null && (
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Budget</Text>
                <Text style={styles.detailValue}>₹{booking.budget.toLocaleString('en-IN')}</Text>
              </View>
            )}
            {booking.preferredStyle && (
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Preferred Style</Text>
                <Text style={styles.detailValue}>{booking.preferredStyle}</Text>
              </View>
            )}
          </View>

          {booking.notes && (
            <>
              <Text style={styles.sectionHeading}>Your Notes</Text>
              <View style={styles.infoCard}>
                <Text style={styles.infoText}>{booking.notes}</Text>
              </View>
            </>
          )}

          {/* Assigned Professional */}
          <Text style={styles.sectionHeading}>Assigned Professional</Text>
          {booking.professionalName ? (
            <View style={styles.proCard}>
              <View style={styles.proAvatarFallback}>
                <Text style={styles.proInitials}>
                  {booking.professionalName.split(' ').map(w => w[0]).slice(0, 2).join('')}
                </Text>
              </View>
              <View style={styles.proInfo}>
                <Text style={styles.proName}>{booking.professionalName}</Text>
              </View>
            </View>
          ) : (
            <View style={styles.infoCard}>
              <Text style={styles.infoText}>
                We're matching your project with the right professional. You'll be notified as soon as one is assigned.
              </Text>
            </View>
          )}

          {/* Maintenance */}
          <Text style={styles.sectionHeading}>Maintenance</Text>
          <View style={styles.infoCard}>
            <Text style={styles.infoText}>
              Post-project care includes periodic inspections, cleaning recommendations for materials used, and guidance on maintaining finishes to ensure longevity. Our team is available for follow-up visits within the first 30 days.
            </Text>
          </View>

          {/* Warranty */}
          <Text style={styles.sectionHeading}>Warranty</Text>
          <View style={styles.infoCard}>
            <Text style={styles.infoText}>12 months warranty on all workmanship</Text>
          </View>

          <View style={styles.ctaWrap}>
            <PrimaryButton label="Contact Professional" onPress={() => router.push('Support')} />
          </View>
        </View>
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  root: {
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
    paddingBottom: 40,
  },
  heroWrap: {
    position: 'relative',
    height: 220,
  },
  hero: {
    width: '100%',
    height: 220,
  },
  backBtn: {
    position: 'absolute',
    top: 48,
    left: spacing.xl,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.md,
  },
  backBtnPlain: {
    margin: spacing.xl,
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backArrow: {
    fontSize: 18,
    color: colors.darkText,
    fontFamily: fonts.body,
  },
  body: {
    padding: spacing.xl,
    gap: spacing.md,
  },
  statusRow: {
    flexDirection: 'row',
  },
  statusBadge: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: radii.round,
  },
  statusText: {
    fontSize: fontSize.caption,
    fontFamily: fonts.body,
    fontWeight: '600',
  },
  projectTitle: {
    fontSize: fontSize.h2,
    fontFamily: fonts.heading,
    color: colors.darkText,
    fontWeight: '700',
    marginTop: spacing.xs,
  },
  sectionHeading: {
    fontSize: fontSize.label,
    fontFamily: fonts.body,
    color: colors.mutedText,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginTop: spacing.md,
  },
  detailsCard: {
    backgroundColor: colors.cardBg,
    borderRadius: radii.md,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
    gap: spacing.sm,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  detailLabel: {
    fontSize: fontSize.body,
    fontFamily: fonts.body,
    color: colors.mutedText,
  },
  detailValue: {
    fontSize: fontSize.body,
    fontFamily: fonts.body,
    color: colors.darkText,
    fontWeight: '500',
  },
  proCard: {
    flexDirection: 'row',
    backgroundColor: colors.cardBg2,
    borderRadius: radii.md,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
    gap: spacing.md,
    alignItems: 'center',
    ...shadows.sm,
  },
  proAvatarFallback: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: colors.darkText,
    alignItems: 'center',
    justifyContent: 'center',
  },
  proInitials: {
    fontSize: fontSize.body,
    fontFamily: fonts.body,
    color: colors.white,
    fontWeight: '700',
  },
  proInfo: {
    flex: 1,
    gap: spacing.xs,
  },
  proName: {
    fontSize: fontSize.body,
    fontFamily: fonts.heading,
    color: colors.darkText,
    fontWeight: '600',
  },
  infoCard: {
    backgroundColor: colors.cardBg,
    borderRadius: radii.md,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
  },
  infoText: {
    fontSize: fontSize.body,
    fontFamily: fonts.body,
    color: colors.mutedText,
    lineHeight: 24,
  },
  ctaWrap: {
    marginTop: spacing.xl,
  },
})
