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
import Chip from '../components/Chip'
import AnimatedPressable from '../components/AnimatedPressable'
import FadeInUp from '../components/FadeInUp'
import { INSPIRATION_GRID, CATEGORY_CONTENT, POPULAR_PROJECTS } from '../data/exploreContent'

export default function InspirationDetailScreen() {
  const router = useRouter()
  const id = router.getParam('id')
  const item = INSPIRATION_GRID.find(i => i.id === id)

  if (!item) {
    return (
      <View style={styles.root}>
        <Pressable onPress={() => router.back()} style={styles.backBtnPlain} accessibilityLabel="Go back">
          <Text style={styles.backText}>←</Text>
        </Pressable>
        <EmptyState
          title="Couldn't find this piece"
          subtitle="It may have been removed. Head back and try another one."
        />
      </View>
    )
  }

  const moreInspiration = INSPIRATION_GRID.filter(i => i.id !== item.id)
  const relatedSpaces = Object.entries(CATEGORY_CONTENT)
    .filter(([, content]) => content.styles.includes(item.styleTag))
    .map(([name]) => name)
  const relatedProjects = item.relatedProjectIds
    .map(pid => POPULAR_PROJECTS.find(p => p.id === pid))
    .filter((p): p is typeof POPULAR_PROJECTS[number] => Boolean(p))

  return (
    <View style={styles.root}>
      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent}>
        <View style={styles.heroContainer}>
          <Image source={item.image} style={styles.heroImage} resizeMode="cover" alt={item.title} />
          <View style={styles.heroOverlay} />
          <Pressable style={styles.backBtn} onPress={() => router.back()} accessibilityLabel="Go back">
            <Text style={styles.backText}>←</Text>
          </Pressable>
          <SaveButton id={item.id} kind="inspiration" />
          <View style={styles.heroTitleWrap}>
            <Text style={styles.heroTag}>{item.styleTag}</Text>
            <Text style={styles.heroName}>{item.title}</Text>
          </View>
        </View>

        <View style={styles.content}>
          <View style={styles.tagsRow}>
            {item.tags.map((tag, i) => (
              <FadeInUp key={tag} delay={i * 30}>
                <View style={styles.tagChip}>
                  <Text style={styles.tagChipTxt}>{tag}</Text>
                </View>
              </FadeInUp>
            ))}
          </View>

          <View style={styles.section}>
            <SectionHeader label="EDITORIAL" title="Why This Works" />
            <Text style={styles.description}>{item.editorial}</Text>
          </View>

          {item.theLook.length > 0 && (
            <View style={styles.carouselSection}>
              <SectionHeader label="DETAILS" title="The Look" />
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.carousel}
              >
                {item.theLook.map((card, i) => (
                  <FadeInUp key={card.id} delay={i * 40}>
                    <GalleryTile image={card.image} title={card.title} caption={card.caption} size="sm" width={180} />
                  </FadeInUp>
                ))}
              </ScrollView>
            </View>
          )}

          {item.whereToUse.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Where to Use It</Text>
              <View style={styles.traitList}>
                {item.whereToUse.map((point, i) => (
                  <FadeInUp key={point} delay={i * 30}>
                    <Text style={styles.traitText}>{'· '}{point}</Text>
                  </FadeInUp>
                ))}
              </View>
            </View>
          )}

          {item.pairWith.length > 0 && (
            <View style={styles.carouselSection}>
              <SectionHeader label="MATERIALS" title="Pair It With" />
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.carousel}
              >
                {item.pairWith.map((swatch, i) => (
                  <FadeInUp key={swatch.id} delay={i * 40}>
                    <SwatchCard
                      image={swatch.image}
                      color={swatch.color}
                      label={swatch.label}
                      note={swatch.note}
                      width={150}
                    />
                  </FadeInUp>
                ))}
              </ScrollView>
            </View>
          )}

          {relatedProjects.length > 0 && (
            <View style={styles.carouselSection}>
              <SectionHeader label="TRENDING" title="Real Project Examples" />
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

          {moreInspiration.length > 0 && (
            <View style={styles.section}>
              <SectionHeader label="EDITORIAL" title="More Inspiration" />
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.moreRow}
              >
                {moreInspiration.map((other, i) => (
                  <FadeInUp key={other.id} delay={i * 40}>
                    <AnimatedPressable
                      style={styles.moreTile}
                      onPress={() => router.push('InspirationDetail', { id: other.id })}
                    >
                      <Image source={other.image} style={styles.moreImage} alt={other.title} />
                      <View style={styles.moreGrad} />
                      <Text style={styles.moreTitle}>{other.title}</Text>
                    </AnimatedPressable>
                  </FadeInUp>
                ))}
              </ScrollView>
            </View>
          )}

          {item.pairWith.length > 0 && (
            <View style={styles.section}>
              <SectionHeader label="EXPLORE" title="Related Materials" />
              <View style={styles.tagsRow}>
                {item.pairWith.map((swatch, i) => (
                  <FadeInUp key={swatch.id} delay={i * 30}>
                    <Chip
                      label={swatch.label}
                      onPress={swatch.styleLink ? () => router.push('StyleDetail', { name: swatch.styleLink }) : undefined}
                    />
                  </FadeInUp>
                ))}
              </View>
            </View>
          )}

          {relatedSpaces.length > 0 && (
            <View style={styles.section}>
              <SectionHeader label="EXPLORE" title="Related Spaces" />
              <View style={styles.tagsRow}>
                {relatedSpaces.map((name, i) => (
                  <FadeInUp key={name} delay={i * 30}>
                    <Pressable
                      style={styles.tagChip}
                      onPress={() => router.push('CategoryDetail', { name })}
                    >
                      <Text style={styles.tagChipTxt}>{name}</Text>
                    </Pressable>
                  </FadeInUp>
                ))}
              </View>
            </View>
          )}
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <PrimaryButton
          label="Create a Project Inspired by This"
          onPress={() => router.push('StartProject', { presetStyle: item.styleTag })}
        />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.background },
  scroll: { flex: 1 },
  scrollContent: { paddingBottom: 100 },
  heroContainer: { height: 320, position: 'relative' },
  heroImage: { width: '100%', height: 320 },
  heroOverlay: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.3)' },
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
  tagsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  tagChip: {
    borderWidth: 1.5, borderColor: colors.border, borderRadius: radii.round,
    paddingHorizontal: spacing.md, paddingVertical: spacing.xs + 2, backgroundColor: colors.white,
  },
  tagChipTxt: { fontFamily: fonts.body, fontSize: fontSize.label, color: colors.darkText, fontWeight: fontWeight.medium },
  description: { fontSize: fontSize.body, fontFamily: fonts.body, color: colors.mutedText, lineHeight: 24 },
  section: { gap: spacing.lg },
  carouselSection: { gap: spacing.lg },
  sectionTitle: {
    fontSize: fontSize.label, fontFamily: fonts.body, color: colors.darkText,
    fontWeight: fontWeight.bold, textTransform: 'uppercase', letterSpacing: 1, marginBottom: spacing.xs,
  },
  carousel: { gap: 12 },
  traitList: { gap: 6, marginTop: spacing.xs },
  traitText: { fontSize: fontSize.body, fontFamily: fonts.body, color: colors.mutedText, lineHeight: 22 },
  moreRow: { gap: 12 },
  moreTile: {
    width: 180, height: 220, borderRadius: radii.md, overflow: 'hidden',
    position: 'relative', justifyContent: 'flex-end',
  },
  moreImage: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, width: '100%', height: '100%', resizeMode: 'cover' },
  moreGrad: { position: 'absolute', bottom: 0, left: 0, right: 0, height: 60, backgroundColor: 'rgba(0,0,0,0.5)' },
  moreTitle: { fontFamily: fonts.heading, fontSize: fontSize.label, color: colors.white, fontWeight: fontWeight.semibold, padding: 10 },
  footer: {
    position: 'absolute', left: 0, right: 0, bottom: 0,
    backgroundColor: colors.white, borderTopWidth: 1, borderTopColor: colors.border,
    paddingHorizontal: spacing.xl, paddingTop: spacing.md, paddingBottom: spacing.lg,
    ...shadows.lg,
  },
})
