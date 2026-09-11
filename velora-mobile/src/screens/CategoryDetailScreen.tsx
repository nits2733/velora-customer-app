import React from 'react'
import { View, Text, Image, Pressable, ScrollView, StyleSheet } from 'react-native'
import { colors, fonts, fontSize, spacing, shadows, radii, fontWeight } from '../theme/tokens'
import { useRouter } from '../navigation/router'
import PrimaryButton from '../components/PrimaryButton'
import SectionHeader from '../components/SectionHeader'
import PopularProjectCard from '../components/PopularProjectCard'
import GalleryTile from '../components/GalleryTile'
import Chip from '../components/Chip'
import AnimatedPressable from '../components/AnimatedPressable'
import FadeInUp from '../components/FadeInUp'
import {
  CATEGORY_FALLBACK_IMAGES,
  CATEGORY_CONTENT,
  DEFAULT_CATEGORY_CONTENT,
  POPULAR_PROJECTS,
  INSPIRATION_GRID,
} from '../data/exploreContent'
import FALLBACK_IMAGE from '../../assets/images/9986c.png'

function getParam(router: ReturnType<typeof useRouter>, key: string): string {
  const v = router.getParam(key)
  return typeof v === 'string' ? v : ''
}

export default function CategoryDetailScreen() {
  const router = useRouter()

  const name = getParam(router, 'name') || 'Category'
  const imageUrl = getParam(router, 'imageUrl')

  const heroImage = imageUrl ? { uri: imageUrl } : (CATEGORY_FALLBACK_IMAGES[name] || FALLBACK_IMAGE)
  const content = CATEGORY_CONTENT[name] || DEFAULT_CATEGORY_CONTENT

  const relatedProjects = POPULAR_PROJECTS.filter(p => p.categoryTag === name)
  const relatedInspiration = INSPIRATION_GRID.filter(i => i.styleTag && content.styles.includes(i.styleTag))

  return (
    <View style={styles.root}>
      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent}>
        <View style={styles.heroContainer}>
          <Image source={heroImage} style={styles.heroImage} resizeMode="cover" alt={name} />
          <View style={styles.heroOverlay} />
          <Pressable style={styles.backBtn} onPress={() => router.back()} accessibilityLabel="Go back">
            <Text style={styles.backText}>←</Text>
          </Pressable>
          <View style={styles.heroTitleWrap}>
            <Text style={styles.heroName}>{name}</Text>
          </View>
        </View>

        <View style={styles.content}>
          {content.tagline ? <Text style={styles.description}>{content.tagline}</Text> : null}

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Quick Exploration</Text>
            <View style={styles.styleChips}>
              {content.styles.map((style, i) => (
                <FadeInUp key={style} delay={i * 30}>
                  <Pressable
                    style={styles.styleChip}
                    onPress={() => router.push('StyleDetail', { name: style })}
                  >
                    <Text style={styles.styleChipTxt}>{style}</Text>
                  </Pressable>
                </FadeInUp>
              ))}
            </View>
          </View>

          {content.popularLooks.length > 0 && (
            <View style={styles.carouselSection}>
              <SectionHeader label="POPULAR" title="Popular Looks" />
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.carousel}
              >
                {content.popularLooks.map((look, i) => (
                  <FadeInUp key={look.id} delay={i * 40}>
                    <GalleryTile
                      image={look.image}
                      title={look.title}
                      caption={look.caption}
                      size="md"
                      width={220}
                    />
                  </FadeInUp>
                ))}
              </ScrollView>
            </View>
          )}

          {content.roomShots.length > 0 && (
            <View style={styles.section}>
              <SectionHeader label="ROOMS" title="Room Inspiration" />
              <View style={styles.tileGrid}>
                {content.roomShots.map((shot, i) => (
                  <FadeInUp key={shot.id} delay={i * 40} style={styles.tileGridItem}>
                    <GalleryTile image={shot.image} title={shot.title} caption={shot.caption} size="sm" />
                  </FadeInUp>
                ))}
              </View>
            </View>
          )}

          {content.designIdeas.length > 0 && (
            <View style={styles.carouselSection}>
              <SectionHeader label="IDEAS" title="Design Ideas" />
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.carousel}
              >
                {content.designIdeas.map((idea, i) => (
                  <FadeInUp key={idea.id} delay={i * 40}>
                    <GalleryTile
                      image={idea.image}
                      title={idea.title}
                      caption={idea.caption}
                      size="md"
                      width={220}
                    />
                  </FadeInUp>
                ))}
              </ScrollView>
            </View>
          )}

          {relatedProjects.length > 0 && (
            <View style={styles.carouselSection}>
              <SectionHeader label="TRENDING" title="Trending Projects" />
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.carousel}
              >
                {relatedProjects.map((project, i) => (
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
            </View>
          )}

          {relatedInspiration.length > 0 && (
            <View style={styles.section}>
              <SectionHeader label="EDITORIAL" title="Inspiration in This Space" />
              <View style={styles.inspirationRow}>
                {relatedInspiration.slice(0, 4).map((item, i) => (
                  <FadeInUp key={item.id} delay={i * 40} style={styles.inspirationTileWrap}>
                    <AnimatedPressable
                      style={styles.inspirationTile}
                      onPress={() => router.push('InspirationDetail', { id: item.id })}
                    >
                      <Image source={item.image} style={styles.inspirationImage} alt={item.title} />
                      <View style={styles.inspirationGrad} />
                      <Text style={styles.inspirationTitle}>{item.title}</Text>
                    </AnimatedPressable>
                  </FadeInUp>
                ))}
              </View>
            </View>
          )}

          {content.relatedSpaces.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Related Spaces</Text>
              <View style={styles.relatedSpacesRow}>
                {content.relatedSpaces.map((space, i) => (
                  <FadeInUp key={space} delay={i * 30}>
                    <Chip
                      label={space}
                      onPress={() => router.push('CategoryDetail', { name: space })}
                    />
                  </FadeInUp>
                ))}
              </View>
            </View>
          )}

          <Text style={styles.disclaimer}>
            Every project starts with a free consultation to confirm scope and pricing for your space.
          </Text>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <PrimaryButton
          label={`Start a Project in ${name}`}
          onPress={() => router.push('StartProject', { presetScope: name })}
        />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.background },
  scroll: { flex: 1 },
  scrollContent: { paddingBottom: 100 },
  heroContainer: { height: 260, position: 'relative' },
  heroImage: { width: '100%', height: 260 },
  heroOverlay: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.28)' },
  backBtn: {
    position: 'absolute', top: 12, left: 12, padding: 8,
    backgroundColor: 'rgba(0,0,0,0.35)', borderRadius: 999,
    width: 36, height: 36, alignItems: 'center', justifyContent: 'center',
  },
  backText: { color: colors.white, fontSize: 18, fontFamily: fonts.body, lineHeight: 20 },
  heroTitleWrap: { position: 'absolute', left: 0, right: 0, bottom: 0, padding: spacing.xl },
  heroName: { fontSize: fontSize.h2, fontFamily: fonts.heading, color: colors.white, fontWeight: fontWeight.bold, lineHeight: 38 },
  content: { padding: spacing.xl, gap: spacing.xxl },
  description: { fontSize: fontSize.body, fontFamily: fonts.body, color: colors.mutedText, lineHeight: 24 },
  section: { gap: spacing.sm },
  carouselSection: { gap: spacing.lg },
  sectionTitle: {
    fontSize: fontSize.label, fontFamily: fonts.body, color: colors.darkText,
    fontWeight: fontWeight.bold, textTransform: 'uppercase', letterSpacing: 1, marginBottom: spacing.xs,
  },
  styleChips: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  styleChip: {
    borderWidth: 1.5, borderColor: colors.border, borderRadius: radii.round,
    paddingHorizontal: spacing.md, paddingVertical: spacing.xs + 2, backgroundColor: colors.white,
  },
  styleChipTxt: { fontFamily: fonts.body, fontSize: fontSize.label, color: colors.darkText, fontWeight: fontWeight.medium },
  carousel: { gap: 12 },
  tileGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  tileGridItem: { width: '48%' },
  relatedSpacesRow: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  inspirationRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  inspirationTileWrap: { width: '48%' },
  inspirationTile: {
    width: '100%', height: 180, borderRadius: radii.md, overflow: 'hidden',
    position: 'relative', justifyContent: 'flex-end',
  },
  inspirationImage: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, width: '100%', height: '100%', resizeMode: 'cover' },
  inspirationGrad: { position: 'absolute', bottom: 0, left: 0, right: 0, height: 60, backgroundColor: 'rgba(0,0,0,0.5)' },
  inspirationTitle: { fontFamily: fonts.heading, fontSize: fontSize.label, color: colors.white, fontWeight: fontWeight.semibold, padding: 10 },
  disclaimer: { fontSize: fontSize.caption, fontFamily: fonts.body, color: colors.mutedText, textAlign: 'center', lineHeight: 18 },
  footer: {
    position: 'absolute', left: 0, right: 0, bottom: 0,
    backgroundColor: colors.white, borderTopWidth: 1, borderTopColor: colors.border,
    paddingHorizontal: spacing.xl, paddingTop: spacing.md, paddingBottom: spacing.lg,
    ...shadows.lg,
  },
})
