import React, { useEffect, useMemo, useState } from 'react'
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TextInput,
  Image,
  ImageSourcePropType,
} from 'react-native'
import { colors, fonts, fontSize, spacing, radii, fontWeight, shadows } from '../theme/tokens'
import AppHeader from '../components/AppHeader'
import SectionHeader from '../components/SectionHeader'
import EmptyState from '../components/EmptyState'
import Skeleton from '../components/Skeleton'
import FadeInUp from '../components/FadeInUp'
import AnimatedPressable from '../components/AnimatedPressable'
import PopularProjectCard from '../components/PopularProjectCard'
import GalleryTile from '../components/GalleryTile'
import { categoriesApi } from '../api/categories'
import type { CategoryResponse } from '../api/types'
import { useRouter } from '../navigation/router'
import {
  CATEGORY_FALLBACK_IMAGES,
  POPULAR_PROJECTS,
  INSPIRATION_GRID,
  ALL_STYLES,
  EXPLORE_DESIGN_DETAILS,
} from '../data/exploreContent'
import { hydrateFavorites } from '../data/favorites'
import FALLBACK_IMAGE from '../../assets/images/9986c.png'

type Props = {
  onHamburger?: () => void
}

const FEATURED_PROJECT = POPULAR_PROJECTS[1]
const MORE_TO_EXPLORE = ['Dining Room', 'Office/Study', 'Balcony/Outdoor']

function getStyleImage(style: string): ImageSourcePropType {
  const project = POPULAR_PROJECTS.find(p => p.styleTag === style)
  if (project) return project.image
  const inspiration = INSPIRATION_GRID.find(i => i.styleTag === style)
  if (inspiration) return inspiration.image
  return FALLBACK_IMAGE
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
    hydrateFavorites().catch(() => {})
  }, [])

  const q = searchText.trim().toLowerCase()
  const searching = q.length > 0

  const matchedCategories = useMemo(() => {
    if (!searching) return []
    return categories.filter(c =>
      c.name.toLowerCase().includes(q) || c.description.toLowerCase().includes(q)
    )
  }, [categories, q, searching])

  const matchedStyles = useMemo(() => {
    if (!searching) return []
    return ALL_STYLES.filter(s => s.toLowerCase().includes(q))
  }, [q, searching])

  const matchedProjects = useMemo(() => {
    if (!searching) return []
    return POPULAR_PROJECTS.filter(p =>
      p.title.toLowerCase().includes(q) ||
      p.description.toLowerCase().includes(q) ||
      p.categoryTag.toLowerCase().includes(q) ||
      p.styleTag.toLowerCase().includes(q)
    )
  }, [q, searching])

  const matchedInspiration = useMemo(() => {
    if (!searching) return []
    return INSPIRATION_GRID.filter(i =>
      i.title.toLowerCase().includes(q) ||
      i.styleTag.toLowerCase().includes(q) ||
      i.tags.some(t => t.toLowerCase().includes(q))
    )
  }, [q, searching])

  const hasAnyMatches =
    matchedCategories.length + matchedStyles.length + matchedProjects.length + matchedInspiration.length > 0

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
            placeholder="Search spaces, styles, projects, inspiration..."
            placeholderTextColor={colors.mutedText}
            value={searchText}
            onChangeText={setSearchText}
          />
        </View>
      </View>

      {searching ? (
        <View style={styles.searchResultsWrap}>
          {!hasAnyMatches ? (
            <View style={styles.stateWrap}>
              <EmptyState title="No matches" subtitle="Try a different search term." />
            </View>
          ) : (
            <>
              {matchedCategories.length > 0 && (
                <View style={styles.resultGroup}>
                  <Text style={styles.resultGroupLabel}>Spaces</Text>
                  {matchedCategories.map(cat => (
                    <AnimatedPressable
                      key={cat.id}
                      style={styles.resultRow}
                      onPress={() => router.push('CategoryDetail', {
                        name: cat.name,
                        description: cat.description,
                        imageUrl: cat.imageUrl,
                      })}
                    >
                      <Image
                        source={cat.imageUrl ? { uri: cat.imageUrl } : (CATEGORY_FALLBACK_IMAGES[cat.name] || FALLBACK_IMAGE)}
                        style={styles.resultThumb}
                        alt={cat.name}
                      />
                      <View style={styles.resultTextWrap}>
                        <Text style={styles.resultTitle}>{cat.name}</Text>
                        {cat.description ? (
                          <Text style={styles.resultSubtitle} numberOfLines={1}>{cat.description}</Text>
                        ) : null}
                      </View>
                    </AnimatedPressable>
                  ))}
                </View>
              )}

              {matchedStyles.length > 0 && (
                <View style={styles.resultGroup}>
                  <Text style={styles.resultGroupLabel}>Styles</Text>
                  {matchedStyles.map(style => (
                    <AnimatedPressable
                      key={style}
                      style={styles.resultRow}
                      onPress={() => router.push('StyleDetail', { name: style })}
                    >
                      <Image source={getStyleImage(style)} style={styles.resultThumb} alt={style} />
                      <View style={styles.resultTextWrap}>
                        <Text style={styles.resultTitle}>{style}</Text>
                        <Text style={styles.resultSubtitle}>Browse by style</Text>
                      </View>
                    </AnimatedPressable>
                  ))}
                </View>
              )}

              {matchedProjects.length > 0 && (
                <View style={styles.resultGroup}>
                  <Text style={styles.resultGroupLabel}>Projects</Text>
                  {matchedProjects.map(project => (
                    <AnimatedPressable
                      key={project.id}
                      style={styles.resultRow}
                      onPress={() => router.push('PopularProjectDetail', { id: project.id })}
                    >
                      <Image source={project.image} style={styles.resultThumb} alt={project.title} />
                      <View style={styles.resultTextWrap}>
                        <Text style={styles.resultTitle}>{project.title}</Text>
                        <Text style={styles.resultSubtitle} numberOfLines={1}>{project.categoryTag} · {project.styleTag}</Text>
                      </View>
                    </AnimatedPressable>
                  ))}
                </View>
              )}

              {matchedInspiration.length > 0 && (
                <View style={styles.resultGroup}>
                  <Text style={styles.resultGroupLabel}>Inspiration</Text>
                  {matchedInspiration.map(item => (
                    <AnimatedPressable
                      key={item.id}
                      style={styles.resultRow}
                      onPress={() => router.push('InspirationDetail', { id: item.id })}
                    >
                      <Image source={item.image} style={styles.resultThumb} alt={item.title} />
                      <View style={styles.resultTextWrap}>
                        <Text style={styles.resultTitle}>{item.title}</Text>
                        <Text style={styles.resultSubtitle} numberOfLines={1}>{item.styleTag}</Text>
                      </View>
                    </AnimatedPressable>
                  ))}
                </View>
              )}
            </>
          )}
        </View>
      ) : (
        <>
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
          ) : categories.length === 0 ? (
            <View style={styles.stateWrap}>
              <EmptyState
                title="No categories yet"
                subtitle="Check back soon."
              />
            </View>
          ) : (
            <View style={styles.categoryGrid}>
              {categories.map((cat, i) => (
                <FadeInUp key={cat.id} delay={i * 40} style={styles.categoryCard}>
                  <AnimatedPressable
                    onPress={() => router.push('CategoryDetail', {
                      name: cat.name,
                      description: cat.description,
                      imageUrl: cat.imageUrl,
                    })}
                  >
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

          {/* Featured Project */}
          <FadeInUp>
            <AnimatedPressable
              style={styles.featuredCard}
              onPress={() => router.push('PopularProjectDetail', { id: FEATURED_PROJECT.id })}
            >
              <Image source={FEATURED_PROJECT.image} style={styles.featuredImage} alt={FEATURED_PROJECT.title} />
              <View style={styles.featuredBody}>
                <Text style={styles.featuredTag}>{FEATURED_PROJECT.categoryTag} · {FEATURED_PROJECT.styleTag}</Text>
                <Text style={styles.featuredTitle}>{FEATURED_PROJECT.title}</Text>
                <Text style={styles.featuredExcerpt} numberOfLines={3}>{FEATURED_PROJECT.longDescription}</Text>
              </View>
            </AnimatedPressable>
          </FadeInUp>

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
                  onPress={() => router.push('PopularProjectDetail', { id: project.id })}
                />
              </FadeInUp>
            ))}
          </ScrollView>

          {/* 5. Browse by Style */}
          <View style={[styles.sectionHeaderWrap, { marginTop: spacing.section }]}>
            <SectionHeader label="DISCOVER" title="Browse by Style" />
          </View>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.styleCarousel}
          >
            {ALL_STYLES.map((style, i) => (
              <FadeInUp key={style} delay={i * 40}>
                <AnimatedPressable
                  style={styles.styleCard}
                  onPress={() => router.push('StyleDetail', { name: style })}
                >
                  <Image source={getStyleImage(style)} style={styles.styleCardImage} alt={style} />
                  <View style={styles.styleCardGrad} />
                  <Text style={styles.styleCardTitle}>{style}</Text>
                </AnimatedPressable>
              </FadeInUp>
            ))}
          </ScrollView>

          {/* 6. Inspiration for Your Space */}
          <View style={[styles.sectionHeaderWrap, { marginTop: spacing.section }]}>
            <SectionHeader label="EDITORIAL" title="Inspiration for Your Space" />
          </View>
          <View style={styles.inspirationGrid}>
            <View style={styles.inspirationColumn}>
              {INSPIRATION_GRID.filter((_, i) => i % 2 === 0).map((item, i) => (
                <FadeInUp key={item.id} delay={i * 80}>
                  <AnimatedPressable
                    onPress={() => router.push('InspirationDetail', { id: item.id })}
                    style={[styles.inspirationTile, { height: item.tall ? 220 : 150 }]}
                  >
                    <Image source={item.image} style={styles.inspirationImage} alt={item.title} />
                    <View style={styles.inspirationGrad} />
                    <Text style={styles.inspirationTitle}>{item.title}</Text>
                  </AnimatedPressable>
                </FadeInUp>
              ))}
            </View>
            <View style={styles.inspirationColumn}>
              {INSPIRATION_GRID.filter((_, i) => i % 2 === 1).map((item, i) => (
                <FadeInUp key={item.id} delay={i * 80 + 40}>
                  <AnimatedPressable
                    onPress={() => router.push('InspirationDetail', { id: item.id })}
                    style={[styles.inspirationTile, { height: item.tall ? 220 : 150 }]}
                  >
                    <Image source={item.image} style={styles.inspirationImage} alt={item.title} />
                    <View style={styles.inspirationGrad} />
                    <Text style={styles.inspirationTitle}>{item.title}</Text>
                  </AnimatedPressable>
                </FadeInUp>
              ))}
            </View>
          </View>

          {/* Design Details */}
          <View style={[styles.sectionHeaderWrap, { marginTop: spacing.section }]}>
            <SectionHeader label="GUIDES" title="Design Details" />
          </View>
          <View style={styles.designDetailsGrid}>
            {EXPLORE_DESIGN_DETAILS.map((d, i) => (
              <FadeInUp key={d.id} delay={i * 40} style={styles.designDetailItem}>
                <GalleryTile
                  image={d.image}
                  title={d.title}
                  caption={d.caption}
                  size="sm"
                  onPress={() => router.push(d.linkScreen, d.linkParam)}
                />
              </FadeInUp>
            ))}
          </View>

          {/* More to Explore */}
          <View style={[styles.sectionHeaderWrap, { marginTop: spacing.section }]}>
            <SectionHeader label="KEEP BROWSING" title="More to Explore" />
          </View>
          <View style={styles.moreToExploreList}>
            {MORE_TO_EXPLORE.map((name, i) => {
              const cat = categories.find(c => c.name === name)
              return (
                <FadeInUp key={name} delay={i * 40}>
                  <AnimatedPressable
                    style={styles.moreToExploreRow}
                    onPress={() => router.push('CategoryDetail', cat
                      ? { name: cat.name, description: cat.description, imageUrl: cat.imageUrl }
                      : { name }
                    )}
                  >
                    <Text style={styles.moreToExploreText}>{name}</Text>
                    <Text style={styles.moreToExploreArrow}>→</Text>
                  </AnimatedPressable>
                </FadeInUp>
              )
            })}
          </View>
        </>
      )}

      {/* 7. Start Your Project CTA */}
      <FadeInUp style={styles.ctaBand}>
        <Text style={styles.ctaTitle}>Start Your Project</Text>
        <Text style={styles.ctaSubtitle}>Tell us what you need and we'll help bring it to life.</Text>
        <AnimatedPressable style={styles.ctaButton} onPress={() => router.push('StartProject')}>
          <Text style={styles.ctaButtonText}>Start Your Project →</Text>
        </AnimatedPressable>
      </FadeInUp>

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

  // Search results
  searchResultsWrap: {
    paddingHorizontal: spacing.xl,
    gap: spacing.section,
  },
  resultGroup: {
    gap: spacing.sm,
  },
  resultGroupLabel: {
    fontSize: fontSize.label,
    fontFamily: fonts.body,
    color: colors.darkText,
    fontWeight: fontWeight.bold,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: spacing.xs,
  },
  resultRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    backgroundColor: colors.cardBg,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radii.md,
    padding: spacing.sm,
  },
  resultThumb: {
    width: 56,
    height: 56,
    borderRadius: radii.sm,
    resizeMode: 'cover',
  },
  resultTextWrap: {
    flex: 1,
    gap: 2,
  },
  resultTitle: {
    fontSize: fontSize.label,
    fontFamily: fonts.heading,
    color: colors.darkText,
    fontWeight: fontWeight.semibold,
  },
  resultSubtitle: {
    fontSize: fontSize.caption,
    fontFamily: fonts.body,
    color: colors.mutedText,
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

  // Featured Project
  featuredCard: {
    marginHorizontal: spacing.xl,
    marginBottom: spacing.section,
    backgroundColor: colors.cardBg,
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: 'hidden',
    ...shadows.sm,
  },
  featuredImage: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
  },
  featuredBody: {
    padding: spacing.lg,
    gap: 6,
  },
  featuredTag: {
    fontSize: fontSize.caption,
    fontFamily: fonts.body,
    color: colors.mutedText,
    textTransform: 'uppercase',
    letterSpacing: 1,
    fontWeight: fontWeight.medium,
  },
  featuredTitle: {
    fontSize: fontSize.h3,
    fontFamily: fonts.heading,
    color: colors.darkText,
    fontWeight: fontWeight.bold,
  },
  featuredExcerpt: {
    fontSize: fontSize.body,
    fontFamily: fonts.body,
    color: colors.mutedText,
    lineHeight: 22,
  },

  // Popular Projects
  projectCarousel: {
    paddingHorizontal: spacing.xl,
    gap: 12,
  },

  // Browse by Style
  styleCarousel: {
    paddingHorizontal: spacing.xl,
    gap: 12,
  },
  styleCard: {
    width: 110,
    height: 140,
    borderRadius: radii.md,
    overflow: 'hidden',
    position: 'relative',
    justifyContent: 'flex-end',
  },
  styleCardImage: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  styleCardGrad: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 50,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  styleCardTitle: {
    fontFamily: fonts.heading,
    fontSize: fontSize.caption,
    color: colors.white,
    fontWeight: fontWeight.semibold,
    padding: 10,
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

  // Design Details
  designDetailsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 12,
    paddingHorizontal: spacing.xl,
  },
  designDetailItem: {
    width: '48%',
  },

  // More to Explore
  moreToExploreList: {
    paddingHorizontal: spacing.xl,
    gap: spacing.sm,
  },
  moreToExploreRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.cardBg,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radii.md,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.lg,
  },
  moreToExploreText: {
    fontSize: fontSize.label,
    fontFamily: fonts.heading,
    color: colors.darkText,
    fontWeight: fontWeight.semibold,
  },
  moreToExploreArrow: {
    fontSize: fontSize.label,
    fontFamily: fonts.body,
    color: colors.mutedText,
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
