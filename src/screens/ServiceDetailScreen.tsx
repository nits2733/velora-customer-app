import React, { useEffect, useState } from 'react'
import { View, Text, Image, Pressable, ScrollView, StyleSheet } from 'react-native'
import { colors, fonts, fontSize, spacing, shadows, radii } from '../theme/tokens'
import { useRouter } from '../navigation/router'
import { useCart } from '../context/CartContext'
import PrimaryButton from '../components/PrimaryButton'
import SecondaryButton from '../components/SecondaryButton'
import Chip from '../components/Chip'
import InputField from '../components/InputField'
import SectionHeader from '../components/SectionHeader'
import InspirationCard from '../components/InspirationCard'
import FAQItem from '../components/FAQItem'
import { portfolioApi } from '../api/portfolio'
import type { PortfolioItemSummaryResponse } from '../api/types'

type Catalog = { options: string[]; includes: string[]; priceRange: string; timeline: string }

// Curated supplemental data — the backend's CategoryResponse has no
// options/includes/price/timeline fields, so this stays local, keyed by
// the real category id (not the fragile name-string keying used before).
const SERVICE_CATALOG: Record<number, Catalog> = {
  8: { // Painting
    options: ['Interior', 'Exterior', 'Both'],
    includes: ['Surface preparation & repair', 'Primer application', 'Two coats of paint', 'Clean-up & waste disposal', 'Post-work inspection'],
    priceRange: '₹18,000 – ₹65,000',
    timeline: '3–7 working days',
  },
  9: { // Plumbing
    options: ['Bathroom', 'Kitchen', 'Full Home'],
    includes: ['Site inspection', 'Pipe installation/repair', 'Fixture fitting', 'Leak testing', 'Final walkthrough'],
    priceRange: '₹8,000 – ₹35,000',
    timeline: '1–4 working days',
  },
  10: { // Electrical
    options: ['New Wiring', 'Repairs', 'Full Upgrade'],
    includes: ['Site assessment', 'Material procurement', 'Wiring & fitting', 'Safety testing', 'Certification'],
    priceRange: '₹12,000 – ₹45,000',
    timeline: '2–6 working days',
  },
  11: { // Carpentry
    options: ['Furniture', 'Cabinets', 'Doors & Windows'],
    includes: ['Design consultation', 'Material selection', 'Custom fabrication', 'Installation', 'Finishing & polish'],
    priceRange: '₹25,000 – ₹1,20,000',
    timeline: '10–20 working days',
  },
  12: { // False Ceiling
    options: ['Living Room', 'Bedroom', 'Full Home'],
    includes: ['Structural assessment', 'Framework installation', 'Panel fitting', 'Lighting integration', 'Finishing'],
    priceRange: '₹15,000 – ₹55,000',
    timeline: '4–8 working days',
  },
  13: { // Modular Kitchen
    options: ['Basic', 'Standard', 'Premium'],
    includes: ['Design planning', 'Material sourcing', 'Execution by experts', 'Project management', 'Handover & support'],
    priceRange: '₹1,50,000 – ₹6,00,000',
    timeline: '20–35 working days',
  },
}

const DEFAULT_CATALOG: Catalog = {
  options: ['Standard', 'Premium', 'Custom'],
  includes: ['Initial consultation', 'Professional execution', 'Quality materials', 'Clean-up', 'Post-work review'],
  priceRange: '₹10,000 – ₹50,000',
  timeline: '5–10 working days',
}

const DEFAULT_DESCRIPTION = 'Professional service delivered by experienced and vetted experts. We ensure quality workmanship and timely completion of every project.'

const TRUST_BADGES = [
  { icon: '✓', label: 'Vetted Professionals' },
  { icon: '🛡', label: '12-Month Warranty' },
  { icon: '⏱', label: 'On-Time Delivery' },
]

const FAQS = [
  { question: 'How is the final price decided?', answer: 'The price range shown is an estimate. Our team visits your site to assess scope, materials, and access before sharing a final, itemized quotation — free of charge and with no obligation.' },
  { question: 'Can I change the scope after booking?', answer: "Yes. You can adjust quantity, options, or add notes any time before the quotation is finalized. Once work begins, changes go through a simple revised-quotation approval." },
  { question: 'What if I\'m not satisfied with the work?', answer: 'Every service is backed by our workmanship warranty. If something isn\'t right within the warranty period, we send a professional back to fix it at no extra cost.' },
]

function getParam(router: ReturnType<typeof useRouter>, key: string): string {
  const v = router.getParam(key)
  return typeof v === 'string' ? v : ''
}

export default function ServiceDetailScreen() {
  const router = useRouter()
  const { addToCart } = useCart()

  const categoryId = Number(router.getParam('id')) || 0
  const name = getParam(router, 'name') || 'Service'
  const description = getParam(router, 'description') || DEFAULT_DESCRIPTION
  const image = getParam(router, 'image') || '/assets/45a7e.png'

  const catalog = SERVICE_CATALOG[categoryId] || DEFAULT_CATALOG

  const [selectedOption, setSelectedOption] = useState(catalog.options[0])
  const [quantity, setQuantity] = useState(1)
  const [notes, setNotes] = useState('')
  const [added, setAdded] = useState(false)

  const [recentWork, setRecentWork] = useState<PortfolioItemSummaryResponse[]>([])

  useEffect(() => {
    if (!categoryId) return
    portfolioApi.search({ category: categoryId, size: 6 })
      .then(page => setRecentWork(page.content))
      .catch(() => setRecentWork([]))
  }, [categoryId])

  const handleAddToCart = () => {
    addToCart({
      id: `${categoryId || name}-${selectedOption}`,
      name,
      config: selectedOption,
      price: catalog.priceRange,
      quantity,
      notes: notes.trim() || undefined,
      categoryId: categoryId || undefined,
    })
    setAdded(true)
    setTimeout(() => setAdded(false), 2000)
  }

  return (
    <View style={styles.root}>
      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent}>
        {/* Hero Image */}
        <View style={styles.heroContainer}>
          <Image source={{ uri: image }} style={styles.heroImage} resizeMode="cover" alt={name} />
          <View style={styles.heroOverlay} />
          <Pressable style={styles.backBtn} onPress={() => router.back()} accessibilityLabel="Go back">
            <Text style={styles.backText}>←</Text>
          </Pressable>
        </View>

        {/* Content */}
        <View style={styles.content}>
          {/* Name */}
          <Text style={styles.serviceName}>{name}</Text>

          {/* Description */}
          <Text style={styles.description}>{description}</Text>

          {/* Trust badges */}
          <View style={styles.trustRow}>
            {TRUST_BADGES.map(b => (
              <View key={b.label} style={styles.trustBadge}>
                <Text style={styles.trustIcon}>{b.icon}</Text>
                <Text style={styles.trustLabel}>{b.label}</Text>
              </View>
            ))}
          </View>

          {/* Recent Work */}
          {recentWork.length > 0 && (
            <View style={styles.section}>
              <SectionHeader label="FROM OUR PROFESSIONALS" title="Recent Work" />
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.recentWorkScroll}
              >
                {recentWork.map(item => (
                  <InspirationCard
                    key={item.id}
                    title={item.title}
                    imageUri={item.coverImageUrl}
                    width={150}
                    height={190}
                    onPress={() => router.push('InspirationDetail', { id: item.id })}
                  />
                ))}
              </ScrollView>
            </View>
          )}

          {/* What's Included */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>What's Included</Text>
            {catalog.includes.map((item, i) => (
              <View key={i} style={styles.bulletRow}>
                <Text style={styles.bullet}>•</Text>
                <Text style={styles.bulletText}>{item}</Text>
              </View>
            ))}
          </View>

          {/* Options */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Options</Text>
            <View style={styles.chipRow}>
              {catalog.options.map(opt => (
                <Chip
                  key={opt}
                  label={opt}
                  selected={selectedOption === opt}
                  onPress={() => setSelectedOption(opt)}
                />
              ))}
            </View>
          </View>

          {/* Quantity */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Quantity / Rooms</Text>
            <View style={styles.stepperRow}>
              <Pressable
                style={styles.stepperBtn}
                onPress={() => setQuantity(q => Math.max(1, q - 1))}
                accessibilityLabel="Decrease quantity"
              >
                <Text style={styles.stepperBtnText}>−</Text>
              </Pressable>
              <Text style={styles.stepperValue}>{quantity}</Text>
              <Pressable
                style={styles.stepperBtn}
                onPress={() => setQuantity(q => Math.min(20, q + 1))}
                accessibilityLabel="Increase quantity"
              >
                <Text style={styles.stepperBtnText}>+</Text>
              </Pressable>
            </View>
          </View>

          {/* Notes */}
          <View style={styles.section}>
            <InputField
              label="Notes for the professional"
              placeholder="Any specific requirements, size, or details..."
              value={notes}
              onChangeText={setNotes}
              multiline
              numberOfLines={3}
            />
          </View>

          {/* Price + Timeline */}
          <View style={styles.statsRow}>
            <View style={styles.priceSection}>
              <Text style={styles.priceLabel}>Estimated Price Range</Text>
              <Text style={styles.priceValue}>{catalog.priceRange}</Text>
            </View>
            <View style={styles.priceSection}>
              <Text style={styles.priceLabel}>Estimated Timeline</Text>
              <Text style={styles.priceValue}>{catalog.timeline}</Text>
            </View>
          </View>

          {/* Add to Cart */}
          <PrimaryButton
            label={added ? 'Added! ✓' : 'Add to Cart'}
            onPress={handleAddToCart}
          />

          {/* Proceed to Checkout */}
          <SecondaryButton
            label="Proceed to Checkout"
            onPress={() => router.push('Checkout')}
          />

          <Text style={styles.disclaimer}>
            Price is an estimate. Final quotation will be shared after a site visit.
          </Text>

          {/* FAQ */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Frequently Asked Questions</Text>
            {FAQS.map(faq => (
              <FAQItem key={faq.question} question={faq.question} answer={faq.answer} />
            ))}
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
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: spacing.section,
  },
  heroContainer: {
    height: 240,
    position: 'relative',
  },
  heroImage: {
    width: '100%',
    height: 240,
  },
  heroOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.15)',
  },
  backBtn: {
    position: 'absolute',
    top: 12,
    left: 12,
    padding: 8,
    backgroundColor: 'rgba(0,0,0,0.35)',
    borderRadius: 999,
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backText: {
    color: colors.white,
    fontSize: 18,
    fontFamily: fonts.body,
    lineHeight: 20,
  },
  content: {
    padding: spacing.xl,
    gap: spacing.lg,
  },
  serviceName: {
    fontSize: fontSize.h2,
    fontFamily: fonts.heading,
    color: colors.darkText,
    fontWeight: '700',
    lineHeight: 40,
  },
  description: {
    fontSize: fontSize.body,
    fontFamily: fonts.body,
    color: colors.mutedText,
    lineHeight: 24,
  },
  section: {
    gap: spacing.sm,
  },
  sectionTitle: {
    fontSize: fontSize.label,
    fontFamily: fonts.body,
    color: colors.darkText,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: spacing.xs,
  },
  bulletRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    alignItems: 'flex-start',
  },
  bullet: {
    fontSize: fontSize.body,
    color: colors.mutedText,
    lineHeight: 22,
  },
  bulletText: {
    flex: 1,
    fontSize: fontSize.body,
    fontFamily: fonts.body,
    color: colors.darkText,
    lineHeight: 22,
  },
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  stepperRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.lg,
  },
  stepperBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 1.5,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.white,
  },
  stepperBtnText: {
    fontSize: 18,
    fontFamily: fonts.body,
    color: colors.darkText,
    fontWeight: '600',
  },
  stepperValue: {
    fontSize: fontSize.h3,
    fontFamily: fonts.heading,
    color: colors.darkText,
    fontWeight: '700',
    minWidth: 24,
    textAlign: 'center',
  },
  trustRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  trustBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: colors.cardBg,
    borderRadius: radii.round,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs + 2,
  },
  trustIcon: {
    fontSize: 14,
  },
  trustLabel: {
    fontSize: fontSize.caption,
    fontFamily: fonts.body,
    color: colors.darkText,
    fontWeight: '600',
  },
  recentWorkScroll: {
    gap: spacing.sm,
  },
  statsRow: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  priceSection: {
    flex: 1,
    backgroundColor: colors.cardBg,
    padding: spacing.lg,
    gap: spacing.xs,
  },
  priceLabel: {
    fontSize: fontSize.caption,
    fontFamily: fonts.body,
    color: colors.mutedText,
    textTransform: 'uppercase',
    letterSpacing: 1,
    fontWeight: '500',
  },
  priceValue: {
    fontSize: fontSize.h3,
    fontFamily: fonts.heading,
    color: colors.darkText,
    fontWeight: '700',
  },
  disclaimer: {
    fontSize: fontSize.caption,
    fontFamily: fonts.body,
    color: colors.mutedText,
    textAlign: 'center',
    lineHeight: 18,
  },
})
