import React, { useEffect, useState } from 'react'
import { View, Text, Image, ScrollView, ActivityIndicator, StyleSheet } from 'react-native'
import { colors, fonts, fontSize, spacing, radii } from '../theme/tokens'
import { useRouter } from '../navigation/router'
import AppHeader from '../components/AppHeader'
import Chip from '../components/Chip'
import PrimaryButton from '../components/PrimaryButton'
import EmptyState from '../components/EmptyState'
import { portfolioApi } from '../api/portfolio'
import type { PortfolioItemResponse } from '../api/types'

const FALLBACK_IMAGE = '/assets/ab679.png'

function titleCase(s: string) {
  return s.charAt(0).toUpperCase() + s.slice(1)
}

export default function InspirationDetailScreen() {
  const router = useRouter()
  const id = Number(router.getParam('id'))

  const [item, setItem] = useState<PortfolioItemResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const [imgFailed, setImgFailed] = useState(false)

  useEffect(() => {
    if (!id) {
      setLoading(false)
      setError(true)
      return
    }
    setLoading(true)
    setError(false)
    portfolioApi.getById(id)
      .then(setItem)
      .catch(() => setError(true))
      .finally(() => setLoading(false))
  }, [id])

  return (
    <View style={styles.root}>
      <AppHeader title="Inspiration" showBack onBack={() => router.back()} showHamburger={false} />

      {loading ? (
        <View style={styles.centerWrap}>
          <ActivityIndicator color={colors.darkText} />
        </View>
      ) : error || !item ? (
        <View style={styles.centerWrap}>
          <EmptyState
            title="Couldn't load this idea"
            subtitle="Check your connection and try again."
          />
        </View>
      ) : (
        <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent}>
          <Image
            source={{ uri: imgFailed ? FALLBACK_IMAGE : item.coverImageUrl }}
            style={styles.hero}
            onError={() => setImgFailed(true)}
            alt={item.title}
          />

          <View style={styles.content}>
            <Text style={styles.title}>{item.title}</Text>
            <Text style={styles.byline}>By {item.professionalName}</Text>

            <View style={styles.chipRow}>
              <Chip label={item.category.name} />
              {item.styleTag && <Chip label={titleCase(item.styleTag)} />}
            </View>

            {item.description && <Text style={styles.description}>{item.description}</Text>}

            {item.priceEstimate > 0 && (
              <View style={styles.priceSection}>
                <Text style={styles.priceLabel}>Estimated Price</Text>
                <Text style={styles.priceValue}>₹{item.priceEstimate.toLocaleString('en-IN')}</Text>
              </View>
            )}

            <PrimaryButton
              label="Start a Project Like This"
              onPress={() => router.push('StartProject')}
            />
          </View>
        </ScrollView>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.background,
  },
  centerWrap: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: spacing.section,
  },
  hero: {
    width: '100%',
    height: 260,
  },
  content: {
    padding: spacing.xl,
    gap: spacing.lg,
  },
  title: {
    fontSize: fontSize.h2,
    fontFamily: fonts.heading,
    color: colors.darkText,
    fontWeight: '700',
    lineHeight: 38,
  },
  byline: {
    fontSize: fontSize.label,
    fontFamily: fonts.body,
    color: colors.mutedText,
    marginTop: -spacing.md,
  },
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  description: {
    fontSize: fontSize.body,
    fontFamily: fonts.body,
    color: colors.mutedText,
    lineHeight: 24,
  },
  priceSection: {
    backgroundColor: colors.cardBg,
    padding: spacing.lg,
    borderRadius: radii.md,
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
})
