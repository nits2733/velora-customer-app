import React, { useState } from 'react'
import { View, Text, Image, Pressable, ScrollView, StyleSheet } from 'react-native'
import { colors, fonts, fontSize, spacing, shadows, radii, fontWeight } from '../theme/tokens'
import { useRouter } from '../navigation/router'
import PrimaryButton from '../components/PrimaryButton'
import SectionHeader from '../components/SectionHeader'
import FAQItem from '../components/FAQItem'
import GalleryTile from '../components/GalleryTile'
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

  const categoryId = Number(router.getParam('id')) || 0
  const name = getParam(router, 'name') || 'Service'
  const description = getParam(router, 'description') || DEFAULT_DESCRIPTION
  const imageParam = router.getParam('image')
  const image: number = typeof imageParam === 'number' ? imageParam : DEFAULT_IMAGE

  const catalog = SERVICE_CATALOG[categoryId] || DEFAULT_CATALOG

  // Always pre-selected (never empty) so there's nothing to validate before
  // continuing - the customer can change it, but can't leave it unset.
  const [selectedOption, setSelectedOption] = useState(catalog.options[0])
  const [activeIncludeIndex, setActiveIncludeIndex] = useState(0)
  const [quantity, setQuantity] = useState(1)
  const [saved, setSaved] = useState(false)

  const handleStartRequest = () => {
    router.push('ServiceRequest', {
      categoryId: categoryId || undefined,
      name,
      selectedOption,
      priceRange: catalog.priceRange,
      quantity: String(quantity),
    })
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
          <Pressable style={styles.saveBtn} onPress={() => setSaved(value => !value)} accessibilityLabel={saved ? 'Remove saved service' : 'Save service'}>
            <Text style={[styles.saveText, saved && styles.saveTextActive]}>{saved ? '♥' : '♡'}</Text>
          </Pressable>
          <View style={styles.heroTitleWrap}>
            <Text style={styles.heroName}>{name}</Text>
          </View>
        </View>

        {/* Content */}
        <View style={styles.content}>
          {/* Description */}
          <Text style={styles.description}>{description}</Text>

          {/* Service gallery */}
          <View style={styles.section}>
            <View style={styles.sectionHeaderRow}>
              <Text style={styles.sectionTitle}>Project Inspiration</Text>
              <Text style={styles.sectionHint}>Swipe to explore</Text>
            </View>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.galleryRail}>
              <GalleryTile image={image} title="Finished spaces" caption="A polished result built around your home." width={220} size="sm" />
              <GalleryTile image={image} title="Crafted details" caption="Thoughtful materials and clean execution." width={220} size="sm" />
              <GalleryTile image={image} title="Made for you" caption="Your scope, style, and priorities come first." width={220} size="sm" />
            </ScrollView>
          </View>

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
          <Text style={styles.priceDisclaimer}>
            This is an estimate, not a checkout price. Final pricing is confirmed after your request is reviewed.
          </Text>

          {/* Pricing breakdown */}
          <View style={styles.breakdownCard}>
            <View style={styles.breakdownHeading}>
              <Text style={styles.breakdownTitle}>Estimated cost guide</Text>
              <Text style={styles.breakdownNote}>No payment today</Text>
            </View>
            {[
              ['Professional labour', 'Included in quote'],
              ['Materials & finish', 'Confirmed after visit'],
              ['Site consultation', 'Free of charge'],
            ].map(([label, value]) => (
              <View key={label} style={styles.breakdownRow}>
                <Text style={styles.breakdownLabel}>{label}</Text>
                <Text style={styles.breakdownValue}>{value}</Text>
              </View>
            ))}
          </View>

          {/* Quick facts and estimator */}
          <View style={styles.factsRow}>
            <View style={styles.fact}><Text style={styles.factValue}>4.9/5</Text><Text style={styles.factLabel}>Customer rating</Text></View>
            <View style={styles.fact}><Text style={styles.factValue}>250+</Text><Text style={styles.factLabel}>Projects delivered</Text></View>
            <View style={styles.fact}><Text style={styles.factValue}>12 mo</Text><Text style={styles.factLabel}>Workmanship cover</Text></View>
          </View>

          <View style={styles.quantityCard}>
            <View style={styles.quantityCopy}>
              <Text style={styles.quantityTitle}>Project quantity</Text>
              <Text style={styles.quantityHint}>Tell us how many spaces or units are involved.</Text>
            </View>
            <View style={styles.stepper}>
              <Pressable style={styles.stepperBtn} onPress={() => setQuantity(value => Math.max(1, value - 1))} accessibilityLabel="Decrease quantity"><Text style={styles.stepperText}>−</Text></Pressable>
              <Text style={styles.quantityValue}>{quantity}</Text>
              <Pressable style={styles.stepperBtn} onPress={() => setQuantity(value => Math.min(20, value + 1))} accessibilityLabel="Increase quantity"><Text style={styles.stepperText}>+</Text></Pressable>
            </View>
          </View>

          {/* Options */}
          <View style={styles.section}>
            <View style={styles.sectionHeaderRow}>
              <Text style={styles.sectionTitle}>Choose an Option</Text>
            </View>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              snapToInterval={200}
              decelerationRate="fast"
              contentContainerStyle={styles.optionGrid}
            >
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
                    <Image source={image} style={styles.optionImage} resizeMode="cover" />
                    <View style={styles.optionOverlay} />
                    <View style={styles.optionTopRow}>
                      <View style={[styles.optionRadio, selected && styles.optionRadioSelected]}>
                        {selected && <View style={styles.optionRadioDot} />}
                      </View>
                      {selected && <View style={styles.optionBadge}><Text style={styles.optionBadgeText}>Selected</Text></View>}
                    </View>
                    <Text style={[styles.optionLabel, selected && styles.optionLabelSelected]}>{opt}</Text>
                  </Pressable>
                )
              })}
            </ScrollView>
          </View>

          {/* What's Included */}
          <View style={styles.section}>
            <View style={styles.includesHeadingRow}>
              <Text style={styles.sectionTitle}>What's Included</Text>
              <View style={styles.studioTag}><Text style={styles.studioTagText}>Premium finish</Text></View>
            </View>
            <View style={styles.includesCard}>
              <View style={styles.includesHeader}>
                <Text style={styles.includesTitle}>Everything in this package</Text>
              </View>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                snapToInterval={216}
                decelerationRate="fast"
                contentContainerStyle={styles.includesRail}
                onScroll={event => {
                  const nextIndex = Math.round(event.nativeEvent.contentOffset.x / 216)
                  setActiveIncludeIndex(Math.min(nextIndex, catalog.includes.length - 1))
                }}
                scrollEventThrottle={16}
              >
                {catalog.includes.map((item, i) => (
                  <View key={i} style={styles.includeRow}>
                    <View style={styles.includeCheck}>
                      <Text style={styles.includeCheckMark}>✓</Text>
                    </View>
                    <View style={styles.includeTextWrap}>
                      <Text style={styles.includeIndex}>0{i + 1}</Text>
                      <Text style={styles.includeText}>{item}</Text>
                    </View>
                  </View>
                ))}
              </ScrollView>
              <View style={styles.includeFooter}>
                <Text style={styles.includeCount}>{catalog.includes.length} included benefits</Text>
                <View style={styles.includeDots}>
                  {catalog.includes.map((item, i) => (
                    <View key={item} style={[styles.includeDot, i === activeIncludeIndex && styles.includeDotActive]} />
                  ))}
                </View>
              </View>
            </View>
          </View>

          {/* How it works */}
          <View style={styles.section}>
            <SectionHeader label="THE PROCESS" title="How Booking Works" />
            <View style={styles.progressLine}>
              <View style={styles.progressStepActive}><Text style={styles.progressNumber}>1</Text><Text style={styles.progressLabel}>Request</Text></View>
              <View style={styles.progressConnector} />
              <View style={styles.progressStep}><Text style={styles.progressNumber}>2</Text><Text style={styles.progressLabel}>Visit</Text></View>
              <View style={styles.progressConnector} />
              <View style={styles.progressStep}><Text style={styles.progressNumber}>3</Text><Text style={styles.progressLabel}>Start</Text></View>
            </View>
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

          {/* FAQ */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Frequently Asked Questions</Text>
            {FAQS.map(faq => (
              <FAQItem key={faq.question} question={faq.question} answer={faq.answer} />
            ))}
          </View>

          <View style={styles.reviewCard}>
            <Text style={styles.reviewStars}>★★★★★</Text>
            <Text style={styles.reviewQuote}>“Clear communication, careful work, and the result looked even better than expected.”</Text>
            <Text style={styles.reviewAuthor}>Verified Velora customer</Text>
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
          <PrimaryButton
            label="Start Service Request"
            onPress={handleStartRequest}
            style={styles.footerButton}
          />
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
  saveBtn: {
    position: 'absolute',
    top: 12,
    right: 12,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255, 249, 234, 0.9)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  saveText: { fontSize: 22, color: '#8A5A20', lineHeight: 24 },
  saveTextActive: { color: '#B76D2A' },
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
  galleryRail: { gap: spacing.sm, paddingRight: spacing.xl },
  sectionHint: { fontSize: fontSize.tiny, color: colors.mutedText, fontFamily: fonts.body },
  section: {
    gap: spacing.sm,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.xs,
  },
  sectionTitle: {
    fontSize: fontSize.label,
    fontFamily: fonts.body,
    color: colors.darkText,
    fontWeight: fontWeight.bold,
    textTransform: 'uppercase',
    letterSpacing: 1,
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
    gap: spacing.sm,
    paddingRight: spacing.lg,
  },
  optionCard: {
    position: 'relative',
    width: 188,
    minHeight: 170,
    overflow: 'hidden',
    borderRadius: radii.xl,
    borderWidth: 1.5,
    borderColor: colors.border,
    backgroundColor: colors.white,
    ...shadows.sm,
  },
  optionCardSelected: {
    borderColor: '#C58A3A',
    backgroundColor: colors.cardBg2,
    ...shadows.md,
  },
  optionImage: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: '100%',
    height: '100%',
  },
  optionOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255, 247, 225, 0.12)',
  },
  optionTopRow: {
    position: 'absolute',
    top: 10,
    left: 10,
    right: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    zIndex: 1,
  },
  optionRadio: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: '#FFF9EA',
    backgroundColor: 'rgba(197, 138, 58, 0.18)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  optionRadioSelected: {
    borderColor: '#C58A3A',
    backgroundColor: '#FFF9EA',
  },
  optionRadioDot: {
    width: 9,
    height: 9,
    borderRadius: 4.5,
    backgroundColor: '#C58A3A',
  },
  optionBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 999,
    backgroundColor: 'rgba(255, 249, 234, 0.92)',
    borderWidth: 1,
    borderColor: 'rgba(197, 138, 58, 0.35)',
  },
  optionBadgeText: {
    fontSize: 9,
    fontFamily: fonts.body,
    color: '#8A5A20',
    fontWeight: fontWeight.bold,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  optionLabel: {
    position: 'absolute',
    left: 12,
    right: 12,
    bottom: 12,
    fontSize: fontSize.label,
    fontFamily: fonts.body,
    color: '#FFF9EA',
    fontWeight: fontWeight.bold,
    textShadowColor: 'rgba(92, 56, 18, 0.28)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
    zIndex: 1,
  },
  optionLabelSelected: {
    fontWeight: fontWeight.bold,
  },

  priceDisclaimer: {
    fontSize: fontSize.caption,
    fontFamily: fonts.body,
    color: colors.mutedText,
    lineHeight: 16,
    marginTop: -spacing.sm,
  },
  breakdownCard: { backgroundColor: '#F3E9D8', borderRadius: radii.lg, borderWidth: 1, borderColor: 'rgba(180, 120, 62, 0.18)', padding: spacing.lg, gap: spacing.sm },
  breakdownHeading: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.xs },
  breakdownTitle: { fontFamily: fonts.heading, fontSize: fontSize.body, color: colors.darkText, fontWeight: fontWeight.bold },
  breakdownNote: { fontFamily: fonts.body, fontSize: fontSize.tiny, color: '#8A5A20', fontWeight: fontWeight.semibold },
  breakdownRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: spacing.xs, borderTopWidth: 1, borderTopColor: 'rgba(180, 120, 62, 0.12)' },
  breakdownLabel: { fontFamily: fonts.body, fontSize: fontSize.caption, color: colors.mutedText },
  breakdownValue: { fontFamily: fonts.body, fontSize: fontSize.caption, color: colors.darkText, fontWeight: fontWeight.semibold },
  factsRow: { flexDirection: 'row', gap: spacing.sm },
  fact: { flex: 1, backgroundColor: colors.cardBg, borderRadius: radii.lg, padding: spacing.md, gap: 4 },
  factValue: { fontFamily: fonts.heading, fontSize: fontSize.body, color: '#8A5A20', fontWeight: fontWeight.bold },
  factLabel: { fontFamily: fonts.body, fontSize: fontSize.tiny, color: colors.mutedText, lineHeight: 14 },
  quantityCard: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: colors.white, borderRadius: radii.lg, borderWidth: 1, borderColor: colors.border, padding: spacing.md, gap: spacing.md },
  quantityCopy: { flex: 1, gap: 3 },
  quantityTitle: { fontFamily: fonts.body, fontSize: fontSize.label, color: colors.darkText, fontWeight: fontWeight.bold },
  quantityHint: { fontFamily: fonts.body, fontSize: fontSize.tiny, color: colors.mutedText, lineHeight: 14 },
  stepper: { flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: '#D7B27A', borderRadius: radii.round, overflow: 'hidden' },
  stepperBtn: { width: 30, height: 30, alignItems: 'center', justifyContent: 'center', backgroundColor: '#F3E9D8' },
  stepperText: { fontSize: fontSize.body, color: '#8A5A20', fontWeight: fontWeight.bold },
  quantityValue: { width: 28, textAlign: 'center', fontFamily: fonts.body, color: colors.darkText, fontWeight: fontWeight.bold },

  // What's included
  includesHeadingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.xs,
  },
  studioTag: {
    backgroundColor: 'rgba(15, 23, 42, 0.04)',
    borderWidth: 1,
    borderColor: 'rgba(15, 23, 42, 0.08)',
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  studioTagText: {
    fontSize: 9,
    fontFamily: fonts.body,
    color: colors.mutedText,
    fontWeight: fontWeight.bold,
    letterSpacing: 0.8,
    textTransform: 'uppercase',
  },
  includesCard: {
    position: 'relative',
    backgroundColor: '#F3E9D8',
    borderRadius: radii.xl,
    borderWidth: 1,
    borderColor: 'rgba(120, 113, 108, 0.18)',
    overflow: 'hidden',
    ...shadows.sm,
  },
  includesHeader: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
    paddingBottom: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(120, 113, 108, 0.12)',
  },
  includesTitle: {
    fontSize: fontSize.body,
    fontFamily: fonts.body,
    color: colors.darkText,
    fontWeight: fontWeight.bold,
  },
  includesRail: {
    gap: spacing.sm,
    padding: spacing.lg,
    paddingRight: spacing.xl,
  },
  includeFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.md,
  },
  includeCount: {
    fontSize: fontSize.tiny,
    fontFamily: fonts.body,
    color: colors.mutedText,
    fontWeight: fontWeight.semibold,
  },
  includeDots: {
    flexDirection: 'row',
    gap: 5,
  },
  includeDot: {
    width: 5,
    height: 5,
    borderRadius: 3,
    backgroundColor: 'rgba(120, 113, 108, 0.28)',
  },
  includeDotActive: {
    width: 16,
    backgroundColor: '#B76D2A',
  },
  includeRow: {
    width: 204,
    minHeight: 124,
    justifyContent: 'space-between',
    padding: spacing.md,
    borderRadius: radii.lg,
    borderWidth: 1,
    borderColor: 'rgba(180, 120, 62, 0.24)',
    backgroundColor: '#FAF3E7',
  },
  includeCheck: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(180, 120, 62, 0.12)',
    borderWidth: 1,
    borderColor: 'rgba(180, 120, 62, 0.18)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  includeCheckMark: {
    color: '#B76D2A',
    fontSize: 12,
    fontWeight: fontWeight.bold,
  },
  includeTextWrap: {
    gap: 4,
  },
  includeIndex: {
    fontSize: fontSize.tiny,
    fontFamily: fonts.body,
    color: '#B76D2A',
    fontWeight: fontWeight.bold,
    letterSpacing: 1,
  },
  includeText: {
    fontSize: fontSize.body,
    fontFamily: fonts.body,
    color: colors.darkText,
    lineHeight: 22,
    fontWeight: fontWeight.medium,
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
  progressLine: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginVertical: spacing.sm },
  progressStep: { alignItems: 'center', gap: 4 },
  progressStepActive: { alignItems: 'center', gap: 4 },
  progressNumber: { width: 24, height: 24, borderRadius: 12, textAlign: 'center', paddingTop: 3, backgroundColor: '#F3E9D8', color: '#8A5A20', fontSize: fontSize.caption, fontWeight: fontWeight.bold },
  progressLabel: { fontFamily: fonts.body, fontSize: fontSize.tiny, color: colors.mutedText },
  progressConnector: { flex: 1, height: 1, marginHorizontal: spacing.sm, backgroundColor: '#D7B27A' },
  reviewCard: { backgroundColor: '#F3E9D8', borderRadius: radii.lg, padding: spacing.lg, gap: spacing.xs, borderWidth: 1, borderColor: 'rgba(180, 120, 62, 0.16)' },
  reviewStars: { color: '#B76D2A', letterSpacing: 2, fontSize: fontSize.caption },
  reviewQuote: { fontFamily: fonts.heading, fontSize: fontSize.body, color: colors.darkText, lineHeight: 22 },
  reviewAuthor: { fontFamily: fonts.body, fontSize: fontSize.tiny, color: colors.mutedText },
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
    paddingTop: spacing.sm,
    paddingBottom: spacing.sm,
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
    alignItems: 'flex-end',
  },
  footerButton: {
    width: 240,
    maxWidth: '100%',
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
  },
})
