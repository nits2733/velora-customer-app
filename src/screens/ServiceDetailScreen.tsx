import React, { useState } from 'react'
import { View, Text, Image, Pressable, ScrollView, StyleSheet } from 'react-native'
import { colors, fonts, fontSize, spacing, shadows } from '../theme/tokens'
import { useRouter } from '../navigation/router'
import { useCart } from '../context/CartContext'
import PrimaryButton from '../components/PrimaryButton'
import SecondaryButton from '../components/SecondaryButton'
import Chip from '../components/Chip'

const SERVICE_OPTIONS: Record<string, string[]> = {
  Painting: ['Interior', 'Exterior', 'Both'],
  Electrical: ['New Wiring', 'Repairs', 'Full Upgrade'],
  Plumbing: ['Bathroom', 'Kitchen', 'Full Home'],
  Carpentry: ['Furniture', 'Cabinets', 'Doors & Windows'],
  Tiling: ['Flooring', 'Wall Tiles', 'Both'],
  'False Ceiling': ['Living Room', 'Bedroom', 'Full Home'],
  'Plaster Work': ['Interior', 'Exterior', 'Both'],
  'Complete Interior': ['Basic', 'Standard', 'Premium'],
}

const SERVICE_DESCRIPTIONS: Record<string, string> = {
  Painting: 'Professional painting services to refresh and beautify your home. Our expert painters use premium quality paints to deliver a flawless finish that lasts for years.',
  Electrical: 'Certified electricians handle everything from minor repairs to complete rewiring. We ensure all work meets safety standards and building codes.',
  Plumbing: 'Expert plumbers for installation, repair, and maintenance. From leaky faucets to full bathroom fittings, we handle it all with precision.',
  Carpentry: 'Skilled carpenters craft custom furniture, cabinets, and woodwork tailored to your space and style preferences.',
  Tiling: 'Quality tiling services for floors and walls. We work with all tile types including ceramic, vitrified, marble, and more.',
  'False Ceiling': 'Modern false ceiling solutions to enhance your interiors with improved aesthetics and lighting options.',
  'Plaster Work': 'Expert plastering for smooth walls and ceilings. We provide durable, long-lasting finishes for new construction and renovation.',
  'Complete Interior': 'End-to-end interior design and execution covering every aspect of your home transformation.',
}

const SERVICE_INCLUDES: Record<string, string[]> = {
  Painting: ['Surface preparation & repair', 'Primer application', 'Two coats of paint', 'Clean-up & waste disposal', 'Post-work inspection'],
  Electrical: ['Site assessment', 'Material procurement', 'Wiring & fitting', 'Safety testing', 'Certification'],
  Plumbing: ['Site inspection', 'Pipe installation/repair', 'Fixture fitting', 'Leak testing', 'Final walkthrough'],
  Carpentry: ['Design consultation', 'Material selection', 'Custom fabrication', 'Installation', 'Finishing & polish'],
  Tiling: ['Surface leveling', 'Adhesive application', 'Tile laying & grouting', 'Edge finishing', 'Clean-up'],
  'False Ceiling': ['Structural assessment', 'Framework installation', 'Panel fitting', 'Lighting integration', 'Finishing'],
  'Plaster Work': ['Surface preparation', 'Base coat application', 'Finish coat', 'Curing period', 'Quality check'],
  'Complete Interior': ['Design planning', 'Material sourcing', 'Execution by experts', 'Project management', 'Handover & support'],
}

const SERVICE_PRICES: Record<string, string> = {
  Painting: '₹18,000 – ₹65,000',
  Electrical: '₹12,000 – ₹45,000',
  Plumbing: '₹8,000 – ₹35,000',
  Carpentry: '₹25,000 – ₹1,20,000',
  Tiling: '₹20,000 – ₹80,000',
  'False Ceiling': '₹15,000 – ₹55,000',
  'Plaster Work': '₹10,000 – ₹40,000',
  'Complete Interior': '₹3,50,000 – ₹12,00,000',
}

export default function ServiceDetailScreen() {
  const router = useRouter()
  const { addToCart } = useCart()

  const name: string = router.getParam('name') || 'Service'
  const image: string = router.getParam('image') || '/assets/45a7e.png'

  const options = SERVICE_OPTIONS[name] || ['Standard', 'Premium', 'Custom']
  const description = SERVICE_DESCRIPTIONS[name] || 'Professional service delivered by experienced and vetted experts. We ensure quality workmanship and timely completion of every project.'
  const includes = SERVICE_INCLUDES[name] || ['Initial consultation', 'Professional execution', 'Quality materials', 'Clean-up', 'Post-work review']
  const priceRange = SERVICE_PRICES[name] || '₹10,000 – ₹50,000'

  const [selectedOption, setSelectedOption] = useState(options[0])
  const [added, setAdded] = useState(false)

  const handleAddToCart = () => {
    addToCart({
      id: `${name}-${selectedOption}`,
      name,
      config: selectedOption,
      price: priceRange,
    })
    setAdded(true)
    setTimeout(() => setAdded(false), 2000)
  }

  return (
    <View style={styles.root}>
      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent}>
        {/* Hero Image */}
        <View style={styles.heroContainer}>
          <Image source={{ uri: image }} style={styles.heroImage} resizeMode="cover" />
          <View style={styles.heroOverlay} />
          <Pressable style={styles.backBtn} onPress={() => router.back()}>
            <Text style={styles.backText}>←</Text>
          </Pressable>
        </View>

        {/* Content */}
        <View style={styles.content}>
          {/* Name */}
          <Text style={styles.serviceName}>{name}</Text>

          {/* Description */}
          <Text style={styles.description}>{description}</Text>

          {/* What's Included */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>What's Included</Text>
            {includes.map((item, i) => (
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
              {options.map(opt => (
                <Chip
                  key={opt}
                  label={opt}
                  selected={selectedOption === opt}
                  onPress={() => setSelectedOption(opt)}
                />
              ))}
            </View>
          </View>

          {/* Price */}
          <View style={styles.priceSection}>
            <Text style={styles.priceLabel}>Estimated Price Range</Text>
            <Text style={styles.priceValue}>{priceRange}</Text>
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
  priceSection: {
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
