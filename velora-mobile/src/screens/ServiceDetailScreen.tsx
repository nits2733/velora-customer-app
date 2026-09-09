import React, { useEffect, useState } from 'react'
import { View, Text, Image, Pressable, ScrollView, StyleSheet } from 'react-native'
import { colors, fonts, fontSize, spacing, shadows, radii, fontWeight } from '../theme/tokens'
import { useRouter } from '../navigation/router'
import { useCart } from '../context/CartContext'
import PrimaryButton from '../components/PrimaryButton'
import InputField from '../components/InputField'
import SectionHeader from '../components/SectionHeader'
import InspirationCard from '../components/InspirationCard'
import FAQItem from '../components/FAQItem'
import Pulse from '../components/Pulse'
import { portfolioApi } from '../api/portfolio'
import type { PortfolioItemSummaryResponse } from '../api/types'
import DEFAULT_IMAGE from '../../assets/images/45a7e.png'

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
  { icon: '✓', label: 'Vetted\nProfessionals' },
  { icon: '🛡', label: '12-Month\nWarranty' },
  { icon: '⏱', label: 'On-Time\nDelivery' },
]

const HOW_IT_WORKS = [
  { step: '1', title: 'Configure your service', desc: 'Pick the option, quantity, and any notes for the professional.' },
  { step: '2', title: 'Free site visit', desc: 'Our team visits to confirm scope before any commitment.' },
  { step: '3', title: 'Approve & get started', desc: 'Review the itemized quotation and approve to schedule work.' },
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
  const { addToCart, cartCount } = useCart()

  const categoryId = Number(router.getParam('id')) || 0
  const name = getParam(router, 'name') || 'Service'
  const description = getParam(router, 'description') || DEFAULT_DESCRIPTION
  const imageParam = router.getParam('image')
  const image: number = typeof imageParam === 'number' ? imageParam : DEFAULT_IMAGE

  const catalog = SERVICE_CATALOG[categoryId] || DEFAULT_CATALOG

  const [selectedOption, setSelectedOption] = useState(catalog.options[0])
  const [quantity, setQuantity] = useState(1)
  const [notes, setNotes] = useState('')
  const [added, setAdded] = useState(false)
  const [addedPulse, setAddedPulse] = useState(0)

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
    setAddedPulse(p => p + 1)
    setTimeout(() => setAdded(false), 2000)
  }

  return (
    <View style={styles.root}>
      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent}>
        {/* Hero Image */}
        <View style={styles.heroContainer}>
          <Image source={image} style={styles.heroImage} resizeMode="cover" alt={name} />
          <View style={styles.heroOverlay} />
          <Pressable style={styles.backBtn} onPress={() => router.back()} accessibilityLabel="Go back">
            <Text style={styles.backText}>←</Text>
          </Pressable>
          <View style={styles.heroTitleWrap}>
            <Text style={styles.heroName}>{name}</Text>
          </View>
        </View>

        {/* Content */}
        <View style={styles.content}>
          {/* Description */}
          <Text style={styles.description}>{description}</Text>

          {/* Trust badges */}
          <View style={styles.trustRow}>
            {TRUST_BADGES.map(b => (
              <View key={b.label} style={styles.trustBadge}>
                <View style={styles.trustIconCircle}>
                  <Text style={styles.trustIcon}>{b.icon}</Text>
                </View>
                <Text style={styles.trustLabel}>{b.label}</Text>
              </View>
            ))}
          </View>

          {/* Price + Timeline */}
          <View style={styles.statsRow}>
            <View style={styles.priceSection}>
              <Text style={styles.priceLabel}>Estimated Price Range</Text>
              <Text style={styles.priceValue}>{catalog.priceRange}</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.priceSection}>
              <Text style={styles.priceLabel}>Estimated Timeline</Text>
              <Text style={styles.priceValue}>{catalog.timeline}</Text>
            </View>
          </View>

          {/* Options */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Choose an Option</Text>
            <View style={styles.optionGrid}>
              {catalog.options.map(opt => {
                const selected = selectedOption === opt
                return (
                  <Pressable
                    key={opt}
                    style={[styles.optionCard, selected && styles.optionCardSelected]}
                    onPress={() => setSelectedOption(opt)}
                    accessibilityRole="radio"
                    accessibilityState={{ selected }}
                  >
                    <View style={[styles.optionRadio, selected && styles.optionRadioSelected]}>
                      {selected && <View style={styles.optionRadioDot} />}
                    </View>
                    <Text style={[styles.optionLabel, selected && styles.optionLabelSelected]}>{opt}</Text>
                  </Pressable>
                )
              })}
            </View>
          </View>

          {/* Quantity */}
          <View style={styles.section}>
            <View style={styles.quantityCard}>
              <View style={styles.quantityInfo}>
                <Text style={styles.sectionTitle}>Quantity / Rooms</Text>
                <Text style={styles.quantityHint}>How many rooms or units need this service?</Text>
              </View>
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
          </View>

          {/* What's Included */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>What's Included</Text>
            <View style={styles.includesCard}>
              {catalog.includes.map((item, i) => (
                <View key={i} style={[styles.includeRow, i < catalog.includes.length - 1 && styles.includeRowBorder]}>
                  <View style={styles.includeCheck}>
                    <Text style={styles.includeCheckMark}>✓</Text>
                  </View>
                  <Text style={styles.includeText}>{item}</Text>
                </View>
              ))}
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

          {/* How it works */}
          <View style={styles.section}>
            <SectionHeader label="THE PROCESS" title="How Booking Works" />
            <View style={styles.stepsList}>
              {HOW_IT_WORKS.map(item => (
                <View key={item.step} style={styles.stepRow}>
                  <View style={styles.stepBadge}>
                    <Text style={styles.stepBadgeTxt}>{item.step}</Text>
                  </View>
                  <View style={styles.stepInfo}>
                    <Text style={styles.stepTitle}>{item.title}</Text>
                    <Text style={styles.stepDesc}>{item.desc}</Text>
                  </View>
                </View>
              ))}
            </View>
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

          {/* FAQ */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Frequently Asked Questions</Text>
            {FAQS.map(faq => (
              <FAQItem key={faq.question} question={faq.question} answer={faq.answer} />
            ))}
          </View>

          <Text style={styles.disclaimer}>
            Price is an estimate. Final quotation will be shared after a site visit.
          </Text>
        </View>
      </ScrollView>

      {/* Sticky footer CTA */}
      <View style={styles.footer}>
        <View style={styles.footerPrice}>
          <Text style={styles.footerPriceLabel}>Estimated</Text>
          <Text style={styles.footerPriceValue}>{catalog.priceRange}</Text>
        </View>
        <View style={styles.footerActions}>
          <Pulse trigger={addedPulse}>
            <PrimaryButton
              label={added ? 'Added! ✓' : 'Add to Cart'}
              onPress={handleAddToCart}
            />
          </Pulse>
          {cartCount > 0 && (
            <Pressable onPress={() => router.push('Checkout')} accessibilityRole="link">
              <Text style={styles.viewCartLink}>View Cart ({cartCount}) & Checkout →</Text>
            </Pressable>
          )}
        </View>
      </View>
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
    paddingBottom: 110,
  },
  heroContainer: {
    height: 260,
    position: 'relative',
  },
  heroImage: {
    width: '100%',
    height: 260,
  },
  heroOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.28)',
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
  heroTitleWrap: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    padding: spacing.xl,
  },
  heroName: {
    fontSize: fontSize.h2,
    fontFamily: fonts.heading,
    color: colors.white,
    fontWeight: fontWeight.bold,
    lineHeight: 38,
  },
  content: {
    padding: spacing.xl,
    gap: spacing.xxl,
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
    fontWeight: fontWeight.bold,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: spacing.xs,
  },

  // Trust badges
  trustRow: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  trustBadge: {
    flex: 1,
    alignItems: 'center',
    gap: 6,
  },
  trustIconCircle: {
    width: 44,
    height: 44,
    borderRadius: radii.round,
    backgroundColor: colors.cardBg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  trustIcon: {
    fontSize: 18,
  },
  trustLabel: {
    fontSize: fontSize.tiny,
    fontFamily: fonts.body,
    color: colors.mutedText,
    fontWeight: fontWeight.semibold,
    textAlign: 'center',
    lineHeight: 13,
  },

  // Price + timeline
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.cardBg,
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  statDivider: {
    width: 1,
    height: '70%',
    backgroundColor: colors.border,
  },
  priceSection: {
    flex: 1,
    padding: spacing.lg,
    gap: spacing.xs,
  },
  priceLabel: {
    fontSize: fontSize.tiny,
    fontFamily: fonts.body,
    color: colors.mutedText,
    textTransform: 'uppercase',
    letterSpacing: 1,
    fontWeight: fontWeight.medium,
  },
  priceValue: {
    fontSize: fontSize.h4,
    fontFamily: fonts.heading,
    color: colors.darkText,
    fontWeight: fontWeight.bold,
  },

  // Options
  optionGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  optionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.md,
    borderRadius: radii.lg,
    borderWidth: 1.5,
    borderColor: colors.border,
    backgroundColor: colors.white,
  },
  optionCardSelected: {
    borderColor: colors.darkText,
    backgroundColor: colors.cardBg2,
  },
  optionRadio: {
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 1.5,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  optionRadioSelected: {
    borderColor: colors.darkText,
  },
  optionRadioDot: {
    width: 9,
    height: 9,
    borderRadius: 5,
    backgroundColor: colors.darkText,
  },
  optionLabel: {
    fontSize: fontSize.label,
    fontFamily: fonts.body,
    color: colors.darkText,
    fontWeight: fontWeight.medium,
  },
  optionLabelSelected: {
    fontWeight: fontWeight.bold,
  },

  // Quantity
  quantityCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.md,
    backgroundColor: colors.cardBg,
    borderRadius: radii.lg,
    padding: spacing.lg,
  },
  quantityInfo: {
    flex: 1,
  },
  quantityHint: {
    fontSize: fontSize.caption,
    fontFamily: fonts.body,
    color: colors.mutedText,
    lineHeight: 16,
  },
  stepperRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  stepperBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.white,
  },
  stepperBtnText: {
    fontSize: 16,
    fontFamily: fonts.body,
    color: colors.darkText,
    fontWeight: fontWeight.semibold,
  },
  stepperValue: {
    fontSize: fontSize.h4,
    fontFamily: fonts.heading,
    color: colors.darkText,
    fontWeight: fontWeight.bold,
    minWidth: 20,
    textAlign: 'center',
  },

  // What's included
  includesCard: {
    backgroundColor: colors.white,
    borderRadius: radii.lg,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: 'hidden',
  },
  includeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
  },
  includeRowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  includeCheck: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: colors.success,
    alignItems: 'center',
    justifyContent: 'center',
  },
  includeCheckMark: {
    color: colors.white,
    fontSize: 12,
    fontWeight: fontWeight.bold,
  },
  includeText: {
    flex: 1,
    fontSize: fontSize.body,
    fontFamily: fonts.body,
    color: colors.darkText,
    lineHeight: 20,
  },

  // How it works
  stepsList: {
    gap: spacing.lg,
  },
  stepRow: {
    flexDirection: 'row',
    gap: spacing.md,
    alignItems: 'flex-start',
  },
  stepBadge: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.darkText,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepBadgeTxt: {
    fontFamily: fonts.body,
    fontSize: fontSize.caption,
    color: colors.white,
    fontWeight: fontWeight.bold,
  },
  stepInfo: {
    flex: 1,
    gap: 2,
  },
  stepTitle: {
    fontFamily: fonts.body,
    fontSize: fontSize.body,
    color: colors.darkText,
    fontWeight: fontWeight.semibold,
  },
  stepDesc: {
    fontFamily: fonts.body,
    fontSize: fontSize.caption,
    color: colors.mutedText,
    lineHeight: 18,
  },

  recentWorkScroll: {
    gap: spacing.sm,
  },

  disclaimer: {
    fontSize: fontSize.caption,
    fontFamily: fonts.body,
    color: colors.mutedText,
    textAlign: 'center',
    lineHeight: 18,
  },

  // Sticky footer
  footer: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    backgroundColor: colors.white,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.md,
    paddingBottom: spacing.lg,
    ...shadows.lg,
  },
  footerPrice: {
    gap: 2,
  },
  footerPriceLabel: {
    fontSize: fontSize.tiny,
    fontFamily: fonts.body,
    color: colors.mutedText,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  footerPriceValue: {
    fontSize: fontSize.label,
    fontFamily: fonts.heading,
    color: colors.darkText,
    fontWeight: fontWeight.bold,
  },
  footerActions: {
    flex: 1,
    gap: 6,
    alignItems: 'stretch',
  },
  viewCartLink: {
    fontSize: fontSize.caption,
    fontFamily: fonts.body,
    color: colors.accent,
    fontWeight: fontWeight.semibold,
    textAlign: 'center',
  },
})
