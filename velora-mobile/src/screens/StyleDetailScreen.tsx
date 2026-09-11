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
import { STYLE_CONTENT, CATEGORY_CONTENT, POPULAR_PROJECTS, INSPIRATION_GRID } from '../data/exploreContent'
import FALLBACK_IMAGE from '../../assets/images/9986c.png'

export default function StyleDetailScreen() {
  const router = useRouter()
  const name = router.getParam('name') || ''
  const info = STYLE_CONTENT[name]

  if (!info) {
    return (
      <View style={styles.root}>
        <Pressable onPress={() => router.back()} style={styles.backBtnPlain} accessibilityLabel="Go back">
          <Text style={styles.backText}>←</Text>
        </Pressable>
        <EmptyState
          title="Couldn't find this style"
          subtitle="It may have been removed. Head back and try another one."
        />
      </View>
    )
  }

  const styleProjects = POPULAR_PROJECTS.filter(p => p.styleTag === name)
  const styleInspiration = INSPIRATION_GRID.filter(i => i.styleTag === name)
  const heroImage = styleProjects[0]?.image || styleInspiration[0]?.image || FALLBACK_IMAGE

  const spaces = Object.entries(CATEGORY_CONTENT)
    .filter(([, content]) => content.styles.includes(name))
    .map(([catName]) => catName)

  return (
    <View style={styles.root}>
      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent}>
        <View style={styles.heroContainer}>
          <Image source={heroImage} style={styles.heroImage} resizeMode="cover" alt={name} />
          <View style={styles.heroOverlay} />
          <Pressable style={styles.backBtn} onPress={() => router.back()} accessibilityLabel="Go back">
            <Text style={styles.backText}>←</Text>
          </Pressable>
          <SaveButton id={name} kind="style" />
          <View style={styles.heroTitleWrap}>
            <Text style={styles.heroName}>{name}</Text>
          </View>
        </View>

        <View style={styles.content}>
          <View style={styles.section}>
            <SectionHeader label="ABOUT" title="What Defines This Style" />
            <Text style={styles.description}>{info.description}</Text>
            <View style={styles.traitList}>
              {info.definingTraits.map((trait, i) => (
                <FadeInUp key={trait} delay={i * 30}>
                  <Text style={styles.traitText}>{'· '}{trait}</Text>
                </FadeInUp>
              ))}
            </View>
          </View>

          {info.signatureElements.length > 0 && (
            <View style={styles.section}>
              <SectionHeader label="DETAILS" title="Signature Elements" />
              <View style={styles.tileGrid}>
                {info.signatureElements.map((el, i) => (
                  <FadeInUp key={el.id} delay={i * 40} style={styles.tileGridItem}>
                    <GalleryTile image={el.image} title={el.title} caption={el.caption} size="sm" />
                  </FadeInUp>
                ))}
              </View>
            </View>
          )}

          {spaces.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Explore {name} by Space</Text>
              <View style={styles.spaceChips}>
                {spaces.map((space, i) => (
                  <FadeInUp key={space} delay={i * 30}>
                    <Pressable
                      style={styles.spaceChip}
                      onPress={() => router.push('CategoryDetail', { name: space })}
                    >
                      <Text style={styles.spaceChipTxt}>{name} {space}</Text>
                    </Pressable>
                  </FadeInUp>
                ))}
              </View>
            </View>
          )}

          {info.palette.length > 0 && (
            <View style={styles.carouselSection}>
              <SectionHeader label="PALETTE" title="Color Palette" />
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.carousel}
              >
                {info.palette.map((swatch, i) => (
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

          {styleProjects.length > 0 && (
            <View style={styles.carouselSection}>
              <SectionHeader label="TRENDING" title={`Popular ${name} Projects`} />
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.carousel}
              >
                {styleProjects.map((project, i) => (
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

          {styleInspiration.length > 0 && (
            <View style={styles.section}>
              <SectionHeader label="EDITORIAL" title={`${name} Inspiration`} />
              <View style={styles.inspirationRow}>
                {styleInspiration.slice(0, 4).map((item, i) => (
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

          {info.fitCheck.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Is This Style For You?</Text>
              <View style={styles.traitList}>
                {info.fitCheck.map((point, i) => (
                  <FadeInUp key={point} delay={i * 30}>
                    <Text style={styles.traitText}>{'· '}{point}</Text>
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
          label={`Start a ${name} Project`}
          onPress={() => router.push('StartProject', { presetStyle: name })}
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
  backBtnPlain: {
    margin: spacing.xl, width: 36, height: 36, alignItems: 'center', justifyContent: 'center',
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
  traitList: { gap: 6, marginTop: spacing.xs },
  traitText: { fontSize: fontSize.body, fontFamily: fonts.body, color: colors.mutedText, lineHeight: 22 },
  tileGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  tileGridItem: { width: '48%' },
  spaceChips: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  spaceChip: {
    borderWidth: 1.5, borderColor: colors.border, borderRadius: radii.round,
    paddingHorizontal: spacing.md, paddingVertical: spacing.xs + 2, backgroundColor: colors.white,
  },
  spaceChipTxt: { fontFamily: fonts.body, fontSize: fontSize.label, color: colors.darkText, fontWeight: fontWeight.medium },
  carousel: { gap: 12 },
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
