import React, { useEffect, useMemo, useState } from 'react'
import {
  View,
  Text,
  Pressable,
  Image,
  ScrollView,
  StyleSheet,
  TextInput,
  ActivityIndicator,
} from 'react-native'
import { colors, fonts, fontSize, spacing, radii, fontWeight, shadows } from '../theme/tokens'
import AppHeader from '../components/AppHeader'
import Chip from '../components/Chip'
import SectionHeader from '../components/SectionHeader'
import EmptyState from '../components/EmptyState'
import { categoriesApi } from '../api/categories'
import { portfolioApi } from '../api/portfolio'
import type { CategoryResponse, PortfolioItemSummaryResponse } from '../api/types'
import { useRouter } from '../navigation/router'

const FALLBACK_IMAGE = '/assets/ab679.png'

function titleCase(s: string) {
  return s.charAt(0).toUpperCase() + s.slice(1)
}

function formatPrice(n: number): string {
  if (n >= 100000) {
    const lakhs = n / 100000
    return `Est. ₹${lakhs % 1 === 0 ? lakhs.toFixed(0) : lakhs.toFixed(1)}L`
  }
  return `Est. ₹${n.toLocaleString('en-IN')}`
}

type Props = {
  onHamburger?: () => void
}

export default function ExploreScreen({ onHamburger }: Props) {
  const router = useRouter()

  const [categories, setCategories] = useState<CategoryResponse[]>([])
  const [styleTags, setStyleTags] = useState<string[]>([])
  const [selectedCategory, setSelectedCategory] = useState<number | 'All'>('All')
  const [selectedStyle, setSelectedStyle] = useState<string | 'All'>('All')
  const [searchText, setSearchText] = useState('')

  const [items, setItems] = useState<PortfolioItemSummaryResponse[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  // Load category chips + discover the real style tags in use, once.
  useEffect(() => {
    categoriesApi.getAll()
      .then(all => setCategories(all.filter(c => c.serviceGroup === 'HOME_PROJECT')))
      .catch(() => setCategories([]))

    portfolioApi.search({ size: 50 })
      .then(page => {
        const tags = Array.from(new Set(page.content.map(i => i.styleTag).filter(Boolean))) as string[]
        setStyleTags(tags)
      })
      .catch(() => setStyleTags([]))
  }, [])

  // Debounced search + refetch whenever filters change.
  useEffect(() => {
    setLoading(true)
    setError(false)
    const handle = setTimeout(() => {
      portfolioApi.search({
        category: selectedCategory === 'All' ? undefined : selectedCategory,
        style: selectedStyle === 'All' ? undefined : selectedStyle,
        search: searchText.trim() || undefined,
        size: 20,
      })
        .then(page => setItems(page.content))
        .catch(() => setError(true))
        .finally(() => setLoading(false))
    }, 300)
    return () => clearTimeout(handle)
  }, [selectedCategory, selectedStyle, searchText])

  // One representative image per room category, drawn from whatever's
  // already loaded — no extra request needed.
  const roomTiles = useMemo(() => {
    return categories
      .map(cat => {
        const match = items.find(i => i.categoryName === cat.name)
        return { id: cat.id, name: cat.name, image: match?.coverImageUrl || FALLBACK_IMAGE }
      })
      .filter(t => items.some(i => i.categoryName === t.name))
  }, [categories, items])

  const openInspiration = (id: number) => router.push('InspirationDetail', { id })

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
        <Chip
          label="All"
          selected={selectedCategory === 'All'}
          onPress={() => setSelectedCategory('All')}
        />
        {categories.map((cat) => (
          <Chip
            key={cat.id}
            label={cat.name}
            selected={selectedCategory === cat.id}
            onPress={() => setSelectedCategory(cat.id)}
          />
        ))}
      </ScrollView>

      {/* 4. Style filter chips */}
      {styleTags.length > 0 && (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.chipRow}
        >
          <Chip
            label="All Styles"
            selected={selectedStyle === 'All'}
            onPress={() => setSelectedStyle('All')}
          />
          {styleTags.map((tag) => (
            <Chip
              key={tag}
              label={titleCase(tag)}
              selected={selectedStyle === tag}
              onPress={() => setSelectedStyle(tag)}
            />
          ))}
        </ScrollView>
      )}

      {/* 5. Explore Projects */}
      <View style={styles.sectionHeaderWrap}>
        <SectionHeader label="PORTFOLIO" title="Explore Projects" />
      </View>

      {loading ? (
        <View style={styles.loadingWrap}>
          <ActivityIndicator color={colors.darkText} />
        </View>
      ) : error ? (
        <View style={styles.stateWrap}>
          <EmptyState
            title="Couldn't load projects"
            subtitle="Check your connection and try again."
          />
        </View>
      ) : items.length === 0 ? (
        <View style={styles.stateWrap}>
          <EmptyState
            title="No matches"
            subtitle="Try a different category, style, or search term."
          />
        </View>
      ) : (
        <View style={styles.projectGrid}>
          {items.map((item) => (
            <Pressable key={item.id} style={styles.projectCard} onPress={() => openInspiration(item.id)}>
              <Image source={{ uri: item.coverImageUrl || FALLBACK_IMAGE }} style={styles.projectImg} alt={item.title} />
              <View style={styles.projectBody}>
                <Text style={styles.projectTitle} numberOfLines={2}>{item.title}</Text>
                <View style={styles.projectMeta}>
                  <Text style={styles.projectCategory}>{item.categoryName}</Text>
                  {item.priceEstimate > 0 && <Text style={styles.projectPrice}>{formatPrice(item.priceEstimate)}</Text>}
                </View>
              </View>
            </Pressable>
          ))}
        </View>
      )}

      {/* 6. Room Inspiration */}
      {roomTiles.length > 0 && (
        <>
          <View style={styles.sectionHeaderWrap}>
            <SectionHeader label="BROWSE BY ROOM" title="Room Inspiration" />
          </View>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.roomScroll}
          >
            {roomTiles.map((room) => (
              <Pressable
                key={room.id}
                style={styles.roomTile}
                onPress={() => setSelectedCategory(room.id)}
              >
                <Image source={{ uri: room.image }} style={styles.roomImage} alt={room.name} />
                <View style={styles.roomOverlay}>
                  <Text style={styles.roomLabel}>{room.name}</Text>
                </View>
              </Pressable>
            ))}
          </ScrollView>
        </>
      )}

      <View style={styles.bottomSpacer} />
    </ScrollView>
  )
}

const CELL_WIDTH = (375 - 48 - 8) / 2

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

  sectionHeaderWrap: {
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.sm,
    paddingBottom: spacing.lg,
  },
  loadingWrap: {
    paddingVertical: spacing.section,
    alignItems: 'center',
  },
  stateWrap: {
    minHeight: 160,
  },

  // Explore Projects
  projectGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    paddingHorizontal: spacing.xl,
    marginBottom: spacing.section,
  },
  projectCard: {
    width: CELL_WIDTH,
    backgroundColor: colors.cardBg,
    borderRadius: radii.md,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.border,
    ...shadows.sm,
  },
  projectImg: {
    width: '100%',
    height: 130,
    resizeMode: 'cover',
  },
  projectBody: {
    padding: spacing.sm,
    gap: 4,
  },
  projectTitle: {
    fontSize: fontSize.label,
    fontFamily: fonts.heading,
    color: colors.darkText,
    fontWeight: fontWeight.semibold,
    lineHeight: 18,
  },
  projectMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  projectCategory: {
    fontSize: fontSize.tiny,
    fontFamily: fonts.body,
    color: colors.mutedText,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  projectPrice: {
    fontSize: fontSize.caption,
    fontFamily: fonts.body,
    color: colors.accent,
    fontWeight: fontWeight.semibold,
  },

  // Room Inspiration
  roomScroll: {
    paddingHorizontal: spacing.xl,
    gap: 12,
    paddingBottom: spacing.xl,
  },
  roomTile: {
    width: 150,
    height: 110,
    borderRadius: radii.md,
    overflow: 'hidden',
    position: 'relative',
  },
  roomImage: {
    width: 150,
    height: 110,
    resizeMode: 'cover',
  },
  roomOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: spacing.sm,
    backgroundColor: 'rgba(0,0,0,0.45)',
  },
  roomLabel: {
    fontSize: fontSize.label,
    fontFamily: fonts.body,
    color: colors.white,
    fontWeight: fontWeight.semibold,
  },

  bottomSpacer: {
    height: 20,
  },
})
