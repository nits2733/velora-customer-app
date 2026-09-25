import React, { useEffect, useState } from 'react'
import { View, Text, ScrollView, Pressable, StyleSheet, TextInput } from 'react-native'
import { colors, fonts, fontSize, spacing, radii, fontWeight } from '../../theme/tokens'
import { useRouter } from '../../navigation/router'
import AppHeader from '../../components/AppHeader'
import InputField from '../../components/InputField'
import PrimaryButton from '../../components/PrimaryButton'

const propertyTypes = [
  { value: 'Apartment', detail: 'A flat in a managed building' },
  { value: 'Villa', detail: 'A multi-level or gated home' },
  { value: 'Independent House', detail: 'A standalone home' },
  { value: 'Penthouse', detail: 'A larger top-floor residence' },
]
const bedroomOptions = ['1 BHK', '2 BHK', '3 BHK', '4 BHK', '5+ BHK']
const propertyConditions = [
  'Ready to move in',
  'New possession',
  'Currently living here',
  'Resale / older home',
  'Under construction',
]
const locationSuggestions = [
  'Bengaluru', 'Chennai', 'Delhi', 'Gurugram', 'Hyderabad', 'Kolkata', 'Mumbai', 'Noida', 'Pune',
]

const TOTAL_STEPS = 4

export default function Step1() {
  const router = useRouter()
  const presetScope = router.getParam('presetScope') || ''
  const presetStyle = router.getParam('presetStyle') || ''
  const visionBrief = router.getParam('visionBrief') || ''
  const visionImageUri = router.getParam('visionImageUri') || ''
  const visionGoals = router.getParam('visionGoals') || []
  const visionBudget = router.getParam('visionBudget') || ''
  const [propertyType, setPropertyType] = useState(router.getParam('propertyType') || '')
  const [bedrooms, setBedrooms] = useState(router.getParam('bedrooms') || '')
  const [area, setArea] = useState(router.getParam('area') || '')
  const [location, setLocation] = useState(router.getParam('location') || '')
  const [propertyCondition, setPropertyCondition] = useState(router.getParam('propertyCondition') || '')
  const [possessionDate, setPossessionDate] = useState(router.getParam('possessionDate') || '')
  const [locationFocused, setLocationFocused] = useState(false)
  const needsPossessionDate = propertyCondition === 'Under construction'
  const filteredLocations = locationSuggestions.filter(option =>
    !location.trim() || option.toLowerCase().includes(location.trim().toLowerCase())
  ).slice(0, 5)
  const canContinue = Boolean(
    propertyType && bedrooms && propertyCondition && location.trim()
    && (!needsPossessionDate || possessionDate.trim())
  )

  useEffect(() => {
    router.updateParams({ propertyType, bedrooms, area, location, propertyCondition, possessionDate })
  }, [propertyType, bedrooms, area, location, propertyCondition, possessionDate])

  const handleContinue = () => {
    if (!canContinue) return
    router.push('StartProject_Step2', {
      propertyType,
      bedrooms,
      area,
      location: location.trim(),
      propertyCondition,
      possessionDate: possessionDate.trim(),
      visionBrief,
      visionImageUri,
      visionGoals,
      visionBudget,
      presetScope,
      presetStyle,
    })
  }

  return (
    <View style={styles.root}>
      <AppHeader
        title="Start a Project"
        showBack
        onBack={router.back}
      />

      <ScrollView style={styles.scroll} contentContainerStyle={styles.content}>
        <View style={styles.progressWrap}>
          {Array.from({ length: TOTAL_STEPS }).map((_, i) => (
            <View
              key={i}
              style={[styles.progressSegment, i === 0 && styles.progressSegmentFilled]}
            />
          ))}
        </View>
        <Text style={styles.stepLabel}>STEP 1 OF 4 · YOUR HOME</Text>
        <Text style={styles.title}>Let&apos;s start with the home itself.</Text>
        <Text style={styles.subtitle}>A few practical details help us plan for the right scale, access, and everyday needs.</Text>

        <View style={styles.questionHead}>
          <Text style={styles.questionNumber}>01</Text>
          <View style={styles.questionCopy}>
            <Text style={styles.fieldLabel}>What kind of home is this?</Text>
            <Text style={styles.helper}>Choose the closest match.</Text>
          </View>
        </View>
        <View style={styles.optionGrid}>
          {propertyTypes.map(pt => (
            <Pressable
              key={pt.value}
              onPress={() => setPropertyType(pt.value)}
              style={[styles.optionCard, propertyType === pt.value && styles.optionCardActive]}
            >
              <Text style={[styles.optionTitle, propertyType === pt.value && styles.optionTextActive]}>{pt.value}</Text>
              <Text style={[styles.optionDetail, propertyType === pt.value && styles.optionDetailActive]}>{pt.detail}</Text>
            </Pressable>
          ))}
        </View>

        <Text style={styles.fieldLabel}>How many bedrooms?</Text>
        <View style={styles.chipRow}>
          {bedroomOptions.map(b => (
            <Pressable
              key={b}
              onPress={() => setBedrooms(b)}
              style={[styles.chip, bedrooms === b && styles.chipActive]}
            >
              <Text style={[styles.chipText, bedrooms === b && styles.chipTextActive]}>{b}</Text>
            </Pressable>
          ))}
        </View>

        <Text style={styles.fieldLabel}>What&apos;s the property status?</Text>
        <View style={styles.chipRow}>
          {propertyConditions.map(condition => (
            <Pressable
              key={condition}
              onPress={() => setPropertyCondition(condition)}
              style={[styles.chip, propertyCondition === condition && styles.chipActive]}
            >
              <Text style={[styles.chipText, propertyCondition === condition && styles.chipTextActive]}>{condition}</Text>
            </Pressable>
          ))}
        </View>

        {needsPossessionDate && (
          <InputField
            label="When is possession expected?"
            placeholder="e.g. March 2027"
            value={possessionDate}
            onChangeText={setPossessionDate}
          />
        )}

        <InputField
          label="Approximate carpet area (optional)"
          placeholder="e.g. 1,450 sq. ft."
          value={area}
          onChangeText={setArea}
          keyboardType="numeric"
        />

        <View>
          <Text style={styles.locationLabel}>Where is the property?</Text>
          <TextInput
            style={styles.locationInput}
            placeholder="Search city or neighbourhood"
            placeholderTextColor={colors.mutedText}
            value={location}
            onChangeText={setLocation}
            onFocus={() => setLocationFocused(true)}
          />
          {locationFocused && filteredLocations.length > 0 && (
            <View style={styles.suggestions}>
              {filteredLocations.map(option => (
                <Pressable
                  key={option}
                  style={styles.suggestion}
                  onPress={() => {
                    setLocation(option)
                    setLocationFocused(false)
                  }}
                >
                  <Text style={styles.suggestionText}>{option}</Text>
                </Pressable>
              ))}
            </View>
          )}
        </View>

        <View style={styles.ctaWrap}>
          {!canContinue && <Text style={styles.requiredHint}>Complete the required choices and location to continue.</Text>}
          <PrimaryButton label="Continue to project scope" onPress={handleContinue} disabled={!canContinue} />
        </View>
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scroll: {
    flex: 1,
  },
  content: {
    padding: spacing.xl,
    paddingBottom: 40,
    gap: spacing.xl,
  },
  progressWrap: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  progressSegment: {
    flex: 1,
    height: 4,
    borderRadius: radii.round,
    backgroundColor: colors.border,
  },
  progressSegmentFilled: {
    backgroundColor: colors.darkText,
  },
  stepLabel: {
    fontSize: fontSize.tiny,
    fontFamily: fonts.body,
    color: colors.accent,
    fontWeight: fontWeight.semibold,
    letterSpacing: 0.8,
    marginTop: spacing.xs,
  },
  title: {
    fontSize: 28,
    lineHeight: 35,
    fontFamily: fonts.heading,
    color: colors.darkText,
    fontWeight: fontWeight.semibold,
  },
  subtitle: {
    fontSize: fontSize.label,
    lineHeight: 21,
    fontFamily: fonts.body,
    color: colors.mutedText,
    marginTop: -spacing.md,
  },
  questionHead: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.md,
  },
  questionNumber: {
    fontFamily: fonts.heading,
    fontSize: fontSize.h4,
    color: colors.accent,
  },
  questionCopy: { flex: 1, gap: 2 },
  fieldLabel: {
    fontSize: fontSize.body,
    fontFamily: fonts.body,
    color: colors.darkText,
    fontWeight: fontWeight.semibold,
    marginBottom: -spacing.sm,
  },
  helper: {
    fontFamily: fonts.body,
    fontSize: fontSize.caption,
    color: colors.mutedText,
  },
  optionGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  optionCard: {
    width: '48%',
    minHeight: 82,
    padding: spacing.md,
    borderRadius: radii.lg,
    borderWidth: 1.5,
    borderColor: colors.border,
    backgroundColor: colors.white,
    justifyContent: 'center',
  },
  optionCardActive: {
    backgroundColor: colors.darkText,
    borderColor: colors.darkText,
  },
  optionTitle: {
    fontSize: fontSize.label,
    fontFamily: fonts.body,
    color: colors.darkText,
    fontWeight: fontWeight.semibold,
  },
  optionDetail: {
    marginTop: 4,
    fontSize: fontSize.caption,
    lineHeight: 16,
    fontFamily: fonts.body,
    color: colors.mutedText,
  },
  optionTextActive: { color: colors.white },
  optionDetailActive: { color: colors.border },
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  chip: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radii.round,
    borderWidth: 1.5,
    borderColor: colors.border,
    backgroundColor: colors.white,
  },
  chipActive: {
    backgroundColor: colors.darkText,
    borderColor: colors.darkText,
  },
  chipText: {
    fontSize: fontSize.label,
    fontFamily: fonts.body,
    color: colors.darkText,
    fontWeight: '500',
  },
  chipTextActive: {
    color: colors.white,
  },
  locationLabel: {
    fontSize: fontSize.label,
    fontFamily: fonts.body,
    color: colors.darkText,
    fontWeight: fontWeight.semibold,
    marginBottom: spacing.sm,
  },
  locationInput: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radii.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    fontFamily: fonts.body,
    fontSize: fontSize.label,
    color: colors.darkText,
    backgroundColor: colors.white,
  },
  suggestions: {
    borderWidth: 1,
    borderTopWidth: 0,
    borderColor: colors.border,
    borderBottomLeftRadius: radii.md,
    borderBottomRightRadius: radii.md,
    backgroundColor: colors.white,
    overflow: 'hidden',
  },
  suggestion: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  suggestionText: {
    fontFamily: fonts.body,
    fontSize: fontSize.label,
    color: colors.darkText,
  },
  ctaWrap: {
    marginTop: spacing.md,
    gap: spacing.sm,
  },
  requiredHint: {
    fontFamily: fonts.body,
    fontSize: fontSize.caption,
    color: colors.mutedText,
    textAlign: 'center',
  },
})
