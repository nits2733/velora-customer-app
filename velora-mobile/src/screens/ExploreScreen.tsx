import React, { useEffect, useMemo, useState } from 'react'
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TextInput,
  Image,
} from 'react-native'
import { colors, fonts, fontSize, spacing, radii, fontWeight, shadows } from '../theme/tokens'
import AppHeader from '../components/AppHeader'
import SectionHeader from '../components/SectionHeader'
import EmptyState from '../components/EmptyState'
import Skeleton from '../components/Skeleton'
import FadeInUp from '../components/FadeInUp'
import AnimatedPressable from '../components/AnimatedPressable'
import PopularProjectCard from '../components/PopularProjectCard'
import Chip from '../components/Chip'
import { categoriesApi } from '../api/categories'
import type { CategoryResponse } from '../api/types'
import { useRouter } from '../navigation/router'
import FALLBACK_IMAGE from '../../assets/images/9986c.png'
import ImgModernWarmHome from '../../assets/images/ab679.png'
import ImgContemporaryLiving from '../../assets/images/90052.png'
import ImgMinimalistKitchen from '../../assets/images/94bfe.png'
import ImgSanctuaryBath from '../../assets/images/f1c0e.png'
import ImgWarmBedroom from '../../assets/images/89a8f.png'
import ImgTravertineDetails from '../../assets/images/5aa20.png'
import ImgCompleteInterior from '../../assets/images/45a7e.png'
import ImgFullHomeChoice from '../../assets/images/74adb.png'

// Category images aren't seeded yet (backend field is admin-set via Cloudinary,
// still null for every category) - these keep each card visually distinct until
// then. cat.imageUrl always wins once an admin sets a real one.
const CATEGORY_FALLBACK_IMAGES: Record<string, number> = {
  'Living Room': ImgContemporaryLiving,
  'Bedroom': ImgWarmBedroom,
  'Kitchen': ImgMinimalistKitchen,
  'Bathroom': ImgSanctuaryBath,
  'Dining Room': ImgCompleteInterior,
  'Office/Study': ImgFullHomeChoice,
  'Balcony/Outdoor': ImgTravertineDetails,
}

const POPULAR_PROJECTS = [
  {
    id: 'p1',
    title: 'Modern Minimalist Home',
    category: 'Full Home Project',
    description: 'Clean lines and warm neutrals carried through every room.',
    image: ImgModernWarmHome,
  },
  {
    id: 'p2',
    title: 'Warm Contemporary Villa',
    category: 'Living Room',
    description: 'Textured walls and soft, layered lighting for evenings in.',
    image: ImgContemporaryLiving,
  },
  {
    id: 'p3',
    title: 'Urban Apartment Refresh',
    category: 'Kitchen',
    description: 'A compact, modular kitchen designed around smart storage.',
    image: ImgMinimalistKitchen,
  },
  {
    id: 'p4',
    title: 'Sanctuary Retreat',
    category: 'Bathroom',
    description: 'Spa-inspired finishes for a calmer daily routine.',
    image: ImgSanctuaryBath,
  },
  {
    id: 'p5',
    title: 'Quiet Luxury Bedroom',
    category: 'Bedroom',
    description: 'Tactile fabrics and a restrained, restful palette.',
    image: ImgWarmBedroom,
  },
]

const INSPIRATION_GRID = [
  { id: 'i1', title: 'Travertine Details', image: ImgTravertineDetails, tall: true },
  { id: 'i2', title: 'Complete Interior', image: ImgCompleteInterior, tall: false },
  { id: 'i3', title: 'Full Home Living', image: ImgFullHomeChoice, tall: false },
  { id: 'i4', title: 'Contemporary Living', image: ImgContemporaryLiving, tall: true },
]

const DESIGN_INTENTS = ['Full Home', 'Living Room', 'Bedroom', 'Kitchen', 'Office', 'Renovation']

type Props = {
  onHamburger?: () => void
}

export default function ExploreScreen({ onHamburger }: Props) {
  const router = useRouter()

  const [categories, setCategories] = useState<CategoryResponse[]>([])
  const [searchText, setSearchText] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    setLoading(true)
    setError(false)
    categoriesApi.getAll()
      .then(all => setCategories(all.filter(c => c.serviceGroup === 'HOME_PROJECT')))
      .catch(() => setError(true))
      .finally(() => setLoading(false))
  }, [])

  const filteredCategories = useMemo(() => {
    const q = searchText.trim().toLowerCase()
    if (!q) return categories
    return categories.filter(c =>
      c.name.toLowerCase().includes(q) || c.description.toLowerCase().includes(q)
    )
  }, [categories, searchText])

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      style={styles.scroll}
      contentContainerStyle={styles.scrollContent}
    >
      {/* 1. Header */}
      <AppHeader onHamburger={onHamburger} />

      {/* 2. Search bar */}
      <View style={styles.searchWrapper}>
        <View style={styles.searchBar}>
          <Text style={styles.searchIcon}>🔍</Text>
          <TextInput
            style={styles.searchInput}
            placeholder="Search project categories..."
            placeholderTextColor={colors.mutedText}
            value={searchText}
            onChangeText={setSearchText}
          />
        </View>
      </View>

      {/* 3. Categories */}
      <View style={styles.sectionHeaderWrap}>
        <SectionHeader label="HOME PROJECTS" title="Browse by Category" />
      </View>

      {loading ? (
        <View style={styles.categoryGrid}>
          {Array.from({ length: 4 }).map((_, i) => (
            <View key={i} style={styles.categoryCard}>
              <Skeleton height={110} radius={0} />
              <View style={styles.categoryCardInner}>
                <Skeleton height={20} width="70%" />
                <Skeleton height={14} width="90%" style={{ marginTop: 10 }} />
              </View>
            </View>
          ))}
        </View>
      ) : error ? (
        <View style={styles.stateWrap}>
          <EmptyState
            title="Couldn't load categories"
            subtitle="Check your connection and try again."
          />
        </View>
      ) : filteredCategories.length === 0 ? (
        <View style={styles.stateWrap}>
          <EmptyState
            title="No matches"
            subtitle="Try a different search term."
          />
        </View>
      ) : (
        <View style={styles.categoryGrid}>
          {filteredCategories.map((cat, i) => (
            <FadeInUp key={cat.id} delay={i * 40} style={styles.categoryCard}>
              <AnimatedPressable onPress={() => router.push('StartProject')}>
                <Image
                  source={cat.imageUrl ? { uri: cat.imageUrl } : (CATEGORY_FALLBACK_IMAGES[cat.name] || FALLBACK_IMAGE)}
                  style={styles.categoryImage}
                  alt={cat.name}
                />
                <View style={styles.categoryCardInner}>
                  <Text style={styles.categoryName}>{cat.name}</Text>
                  {cat.description ? (
                    <Text style={styles.categoryDescription} numberOfLines={3}>{cat.description}</Text>
                  ) : null}
                </View>
              </AnimatedPressable>
            </FadeInUp>
          ))}
        </View>
      )}

      {/* 4. Popular Projects */}
      <View style={styles.sectionHeaderWrap}>
        <SectionHeader label="TRENDING" title="Popular Projects" />
      </View>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.projectCarousel}
      >
        {POPULAR_PROJECTS.map((project, i) => (
          <FadeInUp key={project.id} delay={i * 40}>
            <PopularProjectCard
              image={project.image}
              title={project.title}
              category={project.category}
              description={project.description}
              onPress={() => router.push('StartProject')}
            />
          </FadeInUp>
        ))}
      </ScrollView>

      {/* 5. Inspiration for Your Space */}
      <View style={[styles.sectionHeaderWrap, { marginTop: spacing.section }]}>
        <SectionHeader label="EDITORIAL" title="Inspiration for Your Space" />
      </View>
      <View style={styles.inspirationGrid}>
        <View style={styles.inspirationColumn}>
          {INSPIRATION_GRID.filter((_, i) => i % 2 === 0).map(item => (
            <AnimatedPressable
              key={item.id}
              onPress={() => router.push('StartProject')}
              style={[styles.inspirationTile, { height: item.tall ? 220 : 150 }]}
            >
              <Image source={item.image} style={styles.inspirationImage} alt={item.title} />
              <View style={styles.inspirationGrad} />
              <Text style={styles.inspirationTitle}>{item.title}</Text>
            </AnimatedPressable>
          ))}
        </View>
        <View style={styles.inspirationColumn}>
          {INSPIRATION_GRID.filter((_, i) => i % 2 === 1).map(item => (
            <AnimatedPressable
              key={item.id}
              onPress={() => router.push('StartProject')}
              style={[styles.inspirationTile, { height: item.tall ? 220 : 150 }]}
            >
              <Image source={item.image} style={styles.inspirationImage} alt={item.title} />
              <View style={styles.inspirationGrad} />
              <Text style={styles.inspirationTitle}>{item.title}</Text>
            </AnimatedPressable>
          ))}
        </View>
      </View>

      {/* 6. What are you looking to design? */}
      <View style={[styles.section, { marginTop: spacing.section }]}>
        <SectionHeader label="GET STARTED" title="What are you looking to design?" />
        <View style={styles.intentChips}>
          {DESIGN_INTENTS.map(intent => (
            <Chip key={intent} label={intent} onPress={() => router.push('StartProject')} />
          ))}
        </View>
      </View>

      {/* 7. Start Your Project CTA */}
      <View style={styles.ctaBand}>
        <Text style={styles.ctaTitle}>Start Your Project</Text>
        <Text style={styles.ctaSubtitle}>Tell us what you need and we'll help bring it to life.</Text>
        <AnimatedPressable style={styles.ctaButton} onPress={() => router.push('StartProject')}>
          <Text style={styles.ctaButtonText}>Start Your Project →</Text>
        </AnimatedPressable>
      </View>

      <View style={styles.bottomSpacer} />
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  scroll: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    paddingBottom: 40,
  },

  // Search
  searchWrapper: {
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.lg,
    paddingBottom: spacing.md,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radii.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    backgroundColor: colors.cardBg,
    gap: spacing.sm,
  },
  searchIcon: {
    fontSize: 16,
  },
  searchInput: {
    flex: 1,
    fontSize: fontSize.body,
    fontFamily: fonts.body,
    color: colors.darkText,
    padding: 0,
    margin: 0,
    outlineStyle: 'none',
  } as any,

  sectionHeaderWrap: {
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.sm,
    paddingBottom: spacing.lg,
  },
  stateWrap: {
    minHeight: 160,
  },

  // Categories
  categoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 12,
    paddingHorizontal: spacing.xl,
    marginBottom: spacing.section,
  },
  categoryCard: {
    width: '48%',
    backgroundColor: colors.cardBg,
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: 'hidden',
    ...shadows.sm,
  },
  categoryImage: {
    width: '100%',
    height: 110,
    resizeMode: 'cover',
  },
  categoryCardInner: {
    padding: spacing.lg,
    minHeight: 90,
  },
  categoryName: {
    fontSize: fontSize.label,
    fontFamily: fonts.heading,
    color: colors.darkText,
    fontWeight: fontWeight.semibold,
  },
  categoryDescription: {
    fontSize: fontSize.caption,
    fontFamily: fonts.body,
    color: colors.mutedText,
    marginTop: 6,
    lineHeight: 18,
  },

  // Generic section wrap (non-carousel)
  section: {
    paddingHorizontal: spacing.xl,
  },

  // Popular Projects
  projectCarousel: {
    paddingHorizontal: spacing.xl,
    gap: 12,
  },

  // Inspiration editorial grid
  inspirationGrid: {
    flexDirection: 'row',
    paddingHorizontal: spacing.xl,
    gap: 12,
  },
  inspirationColumn: {
    flex: 1,
    gap: 12,
  },
  inspirationTile: {
    borderRadius: radii.md,
    overflow: 'hidden',
    position: 'relative',
    justifyContent: 'flex-end',
  },
  inspirationImage: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  inspirationGrad: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 70,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  inspirationTitle: {
    fontFamily: fonts.heading,
    fontSize: fontSize.label,
    color: colors.white,
    fontWeight: fontWeight.semibold,
    padding: 12,
  },

  // What are you looking to design?
  intentChips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginTop: spacing.lg,
  },

  // Start Your Project CTA
  ctaBand: {
    marginHorizontal: spacing.xl,
    marginTop: spacing.section,
    backgroundColor: colors.darkText,
    borderRadius: radii.md,
    padding: spacing.xl,
    alignItems: 'flex-start',
    gap: 6,
  },
  ctaTitle: {
    fontFamily: fonts.heading,
    fontSize: fontSize.h3,
    color: colors.white,
    fontWeight: fontWeight.bold,
  },
  ctaSubtitle: {
    fontFamily: fonts.body,
    fontSize: fontSize.label,
    color: 'rgba(255,255,255,0.75)',
    lineHeight: 20,
    marginBottom: spacing.md,
  },
  ctaButton: {
    width: '100%',
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: radii.md,
    paddingVertical: spacing.lg,
    alignItems: 'center',
  },
  ctaButtonText: {
    fontFamily: fonts.body,
    fontSize: fontSize.label,
    color: colors.white,
    fontWeight: fontWeight.semibold,
    letterSpacing: 0.5,
  },

  bottomSpacer: {
    height: 20,
  },
})
