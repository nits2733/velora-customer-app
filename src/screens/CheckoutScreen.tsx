import React, { useState } from 'react'
import { View, Text, ScrollView, StyleSheet } from 'react-native'
import { colors, fonts, fontSize, spacing } from '../theme/tokens'
import { useRouter } from '../navigation/router'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'
import AppHeader from '../components/AppHeader'
import InputField from '../components/InputField'
import Chip from '../components/Chip'
import PrimaryButton from '../components/PrimaryButton'
import { bookingsApi } from '../api/bookings'
import { ApiError } from '../api/client'

const TIMELINE_OPTIONS = ['ASAP', '1–2 Months', '3+ Months']

const TIMELINE_DAYS: Record<string, number> = {
  'ASAP': 7,
  '1–2 Months': 45,
  '3+ Months': 120,
}

function computeScheduledAt(timeline: string): string {
  const days = TIMELINE_DAYS[timeline] ?? 30
  const d = new Date()
  d.setDate(d.getDate() + days)
  return d.toISOString()
}

function parseBudget(price?: string): number | undefined {
  if (!price) return undefined
  const nums = price.match(/[\d,]+/g)?.map(n => Number(n.replace(/,/g, ''))).filter(n => !isNaN(n))
  if (!nums || nums.length === 0) return undefined
  return Math.round(nums.reduce((a, b) => a + b, 0) / nums.length)
}

export default function CheckoutScreen() {
  const router = useRouter()
  const { cartItems, clearCart } = useCart()
  const auth = useAuth()

  const [address, setAddress] = useState('')
  const [propertyType, setPropertyType] = useState('')
  const [area, setArea] = useState('')
  const [timeline, setTimeline] = useState('ASAP')
  const [notes, setNotes] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async () => {
    if (!auth.isAuthenticated) {
      router.push('Login')
      return
    }
    if (cartItems.length === 0) {
      setError('Add at least one service before submitting.')
      return
    }
    setError('')
    setSubmitting(true)
    try {
      const scheduledAt = computeScheduledAt(timeline)
      const propertyNotes = [
        propertyType && `Property: ${propertyType}`,
        area && `Area: ${area} sq ft`,
        notes && `Notes: ${notes}`,
      ].filter(Boolean).join('\n')

      const bookings = await Promise.all(cartItems.map(item => {
        const itemNotes = [
          item.config && `Option: ${item.config}`,
          item.quantity && item.quantity > 1 && `Quantity: ${item.quantity}`,
          item.notes && `Notes: ${item.notes}`,
          propertyNotes,
        ].filter(Boolean).join('\n')

        return bookingsApi.create({
          requestType: 'INDIVIDUAL_SERVICE',
          categoryId: item.categoryId,
          scheduledAt,
          location: address || undefined,
          budget: parseBudget(item.price),
          notes: itemNotes || undefined,
        })
      }))

      clearCart()
      router.replace('Confirmation', { id: bookings[0].id })
    } catch (e) {
      setError(e instanceof ApiError && e.status === 401
        ? 'Please log in to submit this request.'
        : 'Something went wrong sending your request. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <View style={styles.root}>
      <AppHeader title="Review & Submit" showBack onBack={() => router.back()} />
      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent}>

        {/* Selected Services */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Selected Services</Text>
          {cartItems.length === 0 ? (
            <Text style={styles.emptyText}>No services added yet.</Text>
          ) : (
            cartItems.map(item => (
              <View key={item.id} style={styles.serviceRow}>
                <View style={styles.serviceRowInner}>
                  <Text style={styles.serviceName}>
                    {item.name}{item.quantity && item.quantity > 1 ? ` × ${item.quantity}` : ''}
                  </Text>
                  {item.config && <Text style={styles.serviceConfig}>{item.config}</Text>}
                  {item.notes && <Text style={styles.serviceConfig}>"{item.notes}"</Text>}
                </View>
                {item.price && <Text style={styles.servicePrice}>{item.price}</Text>}
              </View>
            ))
          )}
        </View>

        {/* Property Details */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Property Details</Text>
          <View style={styles.fields}>
            <InputField
              label="Location / Address"
              placeholder="Enter your full address"
              value={address}
              onChangeText={setAddress}
            />
            <InputField
              label="Property Type"
              placeholder="e.g. 2BHK Apartment"
              value={propertyType}
              onChangeText={setPropertyType}
            />
            <InputField
              label="Approximate Area (sqft)"
              placeholder="e.g. 1200"
              value={area}
              onChangeText={setArea}
              keyboardType="numeric"
            />
          </View>
        </View>

        {/* Preferred Timeline */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Preferred Timeline</Text>
          <View style={styles.chipRow}>
            {TIMELINE_OPTIONS.map(opt => (
              <Chip
                key={opt}
                label={opt}
                selected={timeline === opt}
                onPress={() => setTimeline(opt)}
              />
            ))}
          </View>
        </View>

        {/* Notes */}
        <View style={styles.section}>
          <InputField
            label="Additional Notes"
            placeholder="Any specific requirements or preferences..."
            value={notes}
            onChangeText={setNotes}
            multiline
            numberOfLines={4}
          />
        </View>

        {/* Submit */}
        <View style={styles.submitSection}>
          {error ? <Text style={styles.errorText}>{error}</Text> : null}
          <PrimaryButton
            label={submitting ? 'Sending…' : 'Request Quotation'}
            onPress={handleSubmit}
            disabled={submitting}
          />
          <Text style={styles.disclaimer}>
            By submitting, you agree to receive a call from our team within 24 hours to discuss your requirements and schedule a site visit. No payment is required at this stage.
          </Text>
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
  scroll: {
    flex: 1,
  },
  scrollContent: {
    padding: spacing.xl,
    paddingBottom: spacing.section,
    gap: spacing.xl,
  },
  section: {
    gap: spacing.md,
  },
  sectionTitle: {
    fontSize: fontSize.label,
    fontFamily: fonts.body,
    color: colors.darkText,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 1,
    paddingBottom: spacing.xs,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  emptyText: {
    fontSize: fontSize.body,
    fontFamily: fonts.body,
    color: colors.mutedText,
  },
  serviceRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    gap: spacing.sm,
  },
  serviceRowInner: {
    flex: 1,
    gap: 2,
  },
  serviceName: {
    fontSize: fontSize.body,
    fontFamily: fonts.body,
    color: colors.darkText,
    fontWeight: '600',
  },
  serviceConfig: {
    fontSize: fontSize.caption,
    fontFamily: fonts.body,
    color: colors.mutedText,
  },
  servicePrice: {
    fontSize: fontSize.label,
    fontFamily: fonts.body,
    color: colors.darkText,
    fontWeight: '500',
  },
  fields: {
    gap: spacing.lg,
  },
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  submitSection: {
    gap: spacing.md,
    marginTop: spacing.sm,
  },
  disclaimer: {
    fontSize: fontSize.caption,
    fontFamily: fonts.body,
    color: colors.mutedText,
    textAlign: 'center',
    lineHeight: 18,
  },
  errorText: {
    fontSize: fontSize.label,
    fontFamily: fonts.body,
    color: colors.error,
    textAlign: 'center',
  },
})
