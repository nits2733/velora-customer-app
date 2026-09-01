import React, { useState } from 'react'
import {
  View,
  Text,
  ScrollView,
  Pressable,
  Image,
  StyleSheet,
  TextInput,
} from 'react-native'
import { colors, fonts, fontSize, spacing, radii, fontWeight, shadows } from '../theme/tokens'
import AppHeader from '../components/AppHeader'
import Chip from '../components/Chip'
import SectionHeader from '../components/SectionHeader'

const categoryFilters = ['All', 'Living Room', 'Bedroom', 'Kitchen', 'Bathroom', 'Dining', 'Study']
const styleFilters = ['Modern', 'Minimal', 'Contemporary', 'Traditional', 'Bohemian']

const galleryImages = [
  { key: 'ab679', uri: '/assets/ab679.png', height: 180 },
  { key: '5aa20', uri: '/assets/5aa20.png', height: 220 },
  { key: 'f1c0e', uri: '/assets/f1c0e.png', height: 180 },
  { key: '90052', uri: '/assets/90052.png', height: 220 },
  { key: '94bfe', uri: '/assets/94bfe.png', height: 180 },
  { key: '89a8f', uri: '/assets/89a8f.png', height: 220 },
]

const trendingStyles = [
  { title: 'Modern Minimalist', image: '/assets/0b7a9.png' },
  { title: 'Warm Contemporary', image: '/assets/68ec1.png' },
  { title: 'Classic Indian', image: '/assets/de075.png' },
]

export default function ExploreScreen() {
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [selectedStyle, setSelectedStyle] = useState('Modern')
  const [searchText, setSearchText] = useState('')

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      style={styles.scroll}
      contentContainerStyle={styles.scrollContent}
    >
      {/* 1. Header */}
      <AppHeader title="Explore" showHamburger={false} />

      {/* 2. Search bar */}
      <View style={styles.searchWrapper}>
        <View style={styles.searchBar}>
          <Text style={styles.searchIcon}>🔍</Text>
          <TextInput
            style={styles.searchInput}
            placeholder="Search styles, rooms, ideas..."
            placeholderTextColor={colors.mutedText}
            value={searchText}
            onChangeText={setSearchText}
          />
        </View>
      </View>

      {/* 3. Category filter chips */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.chipRow}
      >
        {categoryFilters.map((cat) => (
          <Chip
            key={cat}
            label={cat}
            selected={selectedCategory === cat}
            onPress={() => setSelectedCategory(cat)}
          />
        ))}
      </ScrollView>

      {/* 4. Style filter chips */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.chipRow}
      >
        {styleFilters.map((style) => (
          <Chip
            key={style}
            label={style}
            selected={selectedStyle === style}
            onPress={() => setSelectedStyle(style)}
          />
        ))}
      </ScrollView>

      {/* 5. Inspiration Gallery */}
      <View style={styles.gallerySectionHeader}>
        <SectionHeader label="BROWSE" title="Inspiration Gallery" />
      </View>
      <View style={styles.galleryGrid}>
        {galleryImages.map((img) => (
          <Pressable
            key={img.key}
            style={[styles.galleryCell, { height: img.height }]}
          >
            <Image source={{ uri: img.uri }} style={styles.galleryImage} />
          </Pressable>
        ))}
      </View>

      {/* 6. Trending Styles */}
      <View style={styles.trendingHeader}>
        <SectionHeader label="POPULAR NOW" title="Trending Styles" />
      </View>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.trendingScroll}
      >
        {trendingStyles.map((item) => (
          <View key={item.title} style={styles.trendingCard}>
            <Image source={{ uri: item.image }} style={styles.trendingImage} />
            <View style={styles.trendingOverlay}>
              <Text style={styles.trendingTitle}>{item.title}</Text>
            </View>
          </View>
        ))}
      </ScrollView>

      <View style={styles.bottomSpacer} />
    </ScrollView>
  )
}

const CELL_WIDTH = (375 - 48) / 2

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

  // Chips
  chipRow: {
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing.md,
    gap: spacing.sm,
  },

  // Gallery
  gallerySectionHeader: {
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.sm,
    paddingBottom: spacing.lg,
  },
  galleryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    paddingHorizontal: spacing.xl,
    marginBottom: spacing.section,
  },
  galleryCell: {
    width: CELL_WIDTH,
    borderRadius: radii.md,
    overflow: 'hidden',
    backgroundColor: colors.cardBg,
  },
  galleryImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },

  // Trending
  trendingHeader: {
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing.lg,
  },
  trendingScroll: {
    paddingHorizontal: spacing.xl,
    gap: 12,
    paddingBottom: spacing.xl,
  },
  trendingCard: {
    width: 200,
    height: 250,
    borderRadius: radii.md,
    overflow: 'hidden',
    position: 'relative',
    ...shadows.sm,
  },
  trendingImage: {
    width: 200,
    height: 250,
    resizeMode: 'cover',
  },
  trendingOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: spacing.md,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  trendingTitle: {
    fontSize: fontSize.label,
    fontFamily: fonts.heading,
    color: colors.white,
    fontWeight: fontWeight.bold,
  },

  bottomSpacer: {
    height: 20,
  },
})
