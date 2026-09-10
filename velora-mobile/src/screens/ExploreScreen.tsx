import React, { useEffect, useMemo, useState } from 'react'
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TextInput,
} from 'react-native'
import { colors, fonts, fontSize, spacing, radii, fontWeight, shadows } from '../theme/tokens'
import AppHeader from '../components/AppHeader'
import SectionHeader from '../components/SectionHeader'
import EmptyState from '../components/EmptyState'
import Skeleton from '../components/Skeleton'
import FadeInUp from '../components/FadeInUp'
import AnimatedPressable from '../components/AnimatedPressable'
import { categoriesApi } from '../api/categories'
import type { CategoryResponse } from '../api/types'
import { useRouter } from '../navigation/router'

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
              <Skeleton height={20} width="70%" />
              <Skeleton height={14} width="90%" style={{ marginTop: 10 }} />
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
              <AnimatedPressable style={styles.categoryCardInner} onPress={() => router.push('StartProject')}>
                <Text style={styles.categoryName}>{cat.name}</Text>
                {cat.description ? (
                  <Text style={styles.categoryDescription} numberOfLines={3}>{cat.description}</Text>
                ) : null}
              </AnimatedPressable>
            </FadeInUp>
          ))}
        </View>
      )}

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
    ...shadows.sm,
  },
  categoryCardInner: {
    padding: spacing.lg,
    minHeight: 100,
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

  bottomSpacer: {
    height: 20,
  },
})
