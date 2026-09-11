import React from 'react'
import { View, Text, Image, Pressable, ScrollView, StyleSheet } from 'react-native'
import { colors, fonts, fontSize, spacing, shadows, radii, fontWeight } from '../theme/tokens'
import { useRouter } from '../navigation/router'
import PrimaryButton from '../components/PrimaryButton'
import SectionHeader from '../components/SectionHeader'
import EmptyState from '../components/EmptyState'
import PopularProjectCard from '../components/PopularProjectCard'
import GalleryTile from '../components/GalleryTile'
import SwatchCard from '../components/SwatchCard'
import SaveButton from '../components/SaveButton'
import AnimatedPressable from '../components/AnimatedPressable'
import FadeInUp from '../components/FadeInUp'
import { POPULAR_PROJECTS, INSPIRATION_GRID } from '../data/exploreContent'

export default function PopularProjectDetailScreen() {
  const router = useRouter()
  const id = router.getParam('id')
  const project = POPULAR_PROJECTS.find(p => p.id === id)

  if (!project) {
    return (
      <View style={styles.root}>
        <Pressable onPress={() => router.back()} style={styles.backBtnPlain} accessibilityLabel="Go back">
          <Text style={styles.backText}>←</Text>
        </Pressable>
        <EmptyState
          title="Couldn't find this project"
          subtitle="It may have been removed. Head back and try another one."
        />
      </View>
    )
  }

  const relatedInspiration = INSPIRATION_GRID.filter(i => i.styleTag === project.styleTag)
  const similarProjects = POPULAR_PROJECTS.filter(p =>
    p.id !== project.id && (p.styleTag === project.styleTag || p.categoryTag === project.categoryTag)
  ).slice(0, 3)

  return (
    <View style={styles.root}>
      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent}>
        <View style={styles.heroContainer}>
          <Image source={project.image} style={styles.heroImage} resizeMode="cover" alt={project.title} />
          <View style={styles.heroOverlay} />
          <Pressable style={styles.backBtn} onPress={() => router.back()} accessibilityLabel="Go back">
            <Text style={styles.backText}>←</Text>
          </Pressable>
          <SaveButton id={project.id} kind="project" />
          <View style={styles.heroTitleWrap}>
            <Text style={styles.heroTag}>{project.categoryTag}</Text>
            <Text style={styles.heroName}>{project.title}</Text>
          </View>
        </View>

        <View style={styles.content}>
          <View style={styles.metaRow}>
            <View style={styles.styleChip}>
              <Text style={styles.styleChipTxt}>{project.styleTag}</Text>
            </View>
          </View>

          <View style={styles.section}>
            <SectionHeader label="OVERVIEW" title="The Vision" />
            <Text style={styles.description}>{project.longDescription}</Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Project Details</Text>
            <View style={styles.metaGrid}>
              <FadeInUp delay={0} style={styles.metaGridItem}>
                <Text style={styles.metaLabel}>Property Type</Text>
                <Text style={styles.metaValue}>{project.propertyType}</Text>
              </FadeInUp>
              <FadeInUp delay={40} style={styles.metaGridItem}>
                <Text style={styles.metaLabel}>Scope</Text>
                <Text style={styles.metaValue}>{project.scope}</Text>
              </FadeInUp>
              <FadeInUp delay={80} style={styles.metaGridItem}>
                <Text style={styles.metaLabel}>Style</Text>
                <Text style={styles.metaValue}>{project.styleTag}</Text>
              </FadeInUp>
              <FadeInUp delay={120} style={styles.metaGridItem}>
                <Text style={styles.metaLabel}>Design Direction</Text>
                <Text style={styles.metaValue}>{project.designDirection}</Text>
              </FadeInUp>
            </View>
          </View>

          <View style={styles.carouselSection}>
            <Text style={styles.sectionTitle}>Design Highlights</Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.carousel}
            >
              {project.highlights.map((h, i) => (
                <FadeInUp key={h.id} delay={i * 40}>
                  <GalleryTile image={h.image} title={h.title} caption={h.caption} size="md" width={220} />
                </FadeInUp>
              ))}
            </ScrollView>
          </View>

          <View style={styles.carouselSection}>
            <SectionHeader label="SPACES" title="Room by Room" />
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.carousel}
            >
              {project.rooms.map((room, i) => (
                <FadeInUp key={room.id} delay={i * 40}>
                  <GalleryTile image={room.image} title={room.title} caption={room.caption} size="lg" width={260} />
                </FadeInUp>
              ))}
            </ScrollView>
          </View>

          <View style={styles.carouselSection}>
            <Text style={styles.sectionTitle}>Materials &amp; Palette</Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.carousel}
            >
              {project.materials.map((m, i) => (
                <FadeInUp key={m.id} delay={i * 40}>
                  <SwatchCard image={m.image} color={m.color} label={m.label} note={m.note} width={150} />
                </FadeInUp>
              ))}
            </ScrollView>
          </View>

          {similarProjects.length > 0 && (
            <View style={styles.carouselSection}>
              <SectionHeader label="TRENDING" title="Similar Projects" />
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.carousel}
              >
                {similarProjects.map((other, i) => (
                  <FadeInUp key={other.id} delay={i * 40}>
                    <PopularProjectCard
                      image={other.image}
                      title={other.title}
                      category={other.category}
                      description={other.description}
                      onPress={() => router.push('PopularProjectDetail', { id: other.id })}
                    />
                  </FadeInUp>
                ))}
              </ScrollView>
            </View>
          )}

          {relatedInspiration.length > 0 && (
            <View style={styles.section}>
              <SectionHeader label="EDITORIAL" title="Related Inspiration" />
              <View style={styles.inspirationRow}>
                {relatedInspiration.slice(0, 2).map((item, i) => (
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

          <Text style={styles.disclaimer}>
            Every project starts with a free consultation to confirm scope and pricing for your space.
          </Text>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <PrimaryButton
          label="Start a Similar Project"
          onPress={() => router.push('StartProject', { presetScope: project.categoryTag, presetStyle: project.styleTag })}
        />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.background },
  scroll: { flex: 1 },
  scrollContent: { paddingBottom: 100 },
  heroContainer: { height: 300, position: 'relative' },
  heroImage: { width: '100%', height: 300 },
  heroOverlay: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.28)' },
  backBtn: {
    position: 'absolute', top: 12, left: 12, padding: 8,
    backgroundColor: 'rgba(0,0,0,0.35)', borderRadius: 999,
    width: 36, height: 36, alignItems: 'center', justifyContent: 'center',
  },
  backBtnPlain: {
    margin: spacing.xl, width: 36, height: 36, alignItems: 'center', justifyContent: 'center',
  },
  backText: { color: colors.white, fontSize: 18, fontFamily: fonts.body, lineHeight: 20 },
  heroTitleWrap: { position: 'absolute', left: 0, right: 0, bottom: 0, padding: spacing.xl, gap: 4 },
  heroTag: {
    fontSize: fontSize.caption, fontFamily: fonts.body, color: 'rgba(255,255,255,0.85)',
    textTransform: 'uppercase', letterSpacing: 1.5, fontWeight: fontWeight.semibold,
  },
  heroName: { fontSize: fontSize.h2, fontFamily: fonts.heading, color: colors.white, fontWeight: fontWeight.bold, lineHeight: 38 },
  content: { padding: spacing.xl, gap: spacing.xxl },
  metaRow: { flexDirection: 'row' },
  styleChip: {
    borderWidth: 1.5, borderColor: colors.border, borderRadius: radii.round,
    paddingHorizontal: spacing.md, paddingVertical: spacing.xs + 2, backgroundColor: colors.white,
  },
  styleChipTxt: { fontFamily: fonts.body, fontSize: fontSize.label, color: colors.darkText, fontWeight: fontWeight.medium },
  description: { fontSize: fontSize.body, fontFamily: fonts.body, color: colors.mutedText, lineHeight: 24 },
  section: { gap: spacing.sm },
  sectionTitle: {
    fontSize: fontSize.label, fontFamily: fonts.body, color: colors.darkText,
    fontWeight: fontWeight.bold, textTransform: 'uppercase', letterSpacing: 1, marginBottom: spacing.xs,
  },
  metaGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  metaGridItem: {
    width: '48%', backgroundColor: colors.cardBg, borderRadius: radii.md,
    borderWidth: 1, borderColor: colors.border, padding: spacing.md, gap: 4,
  },
  metaLabel: {
    fontSize: fontSize.caption, fontFamily: fonts.body, color: colors.mutedText,
    textTransform: 'uppercase', letterSpacing: 0.5,
  },
  metaValue: { fontSize: fontSize.body, fontFamily: fonts.heading, color: colors.darkText, fontWeight: fontWeight.semibold },
  carouselSection: { gap: spacing.lg },
  carousel: { gap: 12 },
  inspirationRow: { flexDirection: 'row', gap: 12 },
  inspirationTileWrap: { flex: 1 },
  inspirationTile: {
    flex: 1, height: 180, borderRadius: radii.md, overflow: 'hidden',
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
