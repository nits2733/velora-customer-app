import React, { useState } from 'react'
import { View, Text, ScrollView, Pressable, StyleSheet } from 'react-native'
import { colors, fonts, fontSize, spacing, radii, shadows } from '../../theme/tokens'
import { useRouter } from '../../navigation/router'
import AppHeader from '../../components/AppHeader'
import InputField from '../../components/InputField'
import PrimaryButton from '../../components/PrimaryButton'

const propertyTypes = ['Apartment', 'Villa', 'Independent House', 'Studio', 'Office']
const bedroomOptions = ['1BHK', '2BHK', '3BHK', '4BHK', '5+BHK']

const TOTAL_STEPS = 4

export default function Step1() {
  const router = useRouter()
  const [propertyType, setPropertyType] = useState('')
  const [bedrooms, setBedrooms] = useState('')
  const [area, setArea] = useState('')
  const [location, setLocation] = useState('')

  const presetScope = router.getParam('presetScope') || ''
  const presetStyle = router.getParam('presetStyle') || ''

  const handleContinue = () => {
    router.push('StartProject_Step2', { propertyType, bedrooms, area, location, presetScope, presetStyle })
  }

  return (
    <View style={styles.root}>
      <AppHeader
        title="Start a Project"
        showBack
        onBack={router.back}
      />

      <ScrollView style={styles.scroll} contentContainerStyle={styles.content}>
        {/* Progress bar */}
        <View style={styles.progressWrap}>
          {Array.from({ length: TOTAL_STEPS }).map((_, i) => (
            <View
              key={i}
              style={[styles.progressSegment, i === 0 && styles.progressSegmentFilled]}
            />
          ))}
        </View>
        <Text style={styles.stepLabel}>Step 1 of 4 — Property Details</Text>

        {/* Property Type */}
        <Text style={styles.fieldLabel}>Property Type</Text>
        <View style={styles.chipRow}>
          {propertyTypes.map(pt => (
            <Pressable
              key={pt}
              onPress={() => setPropertyType(pt)}
              style={[styles.chip, propertyType === pt && styles.chipActive]}
            >
              <Text style={[styles.chipText, propertyType === pt && styles.chipTextActive]}>{pt}</Text>
            </Pressable>
          ))}
        </View>

        {/* Bedrooms */}
        <Text style={styles.fieldLabel}>Bedrooms</Text>
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

        {/* Area */}
        <InputField
          label="Area"
          placeholder="Area in sq. ft."
          value={area}
          onChangeText={setArea}
          keyboardType="numeric"
        />

        {/* Location */}
        <InputField
          label="Location"
          placeholder="City or neighbourhood"
          value={location}
          onChangeText={setLocation}
        />

        <View style={styles.ctaWrap}>
          <PrimaryButton label="Continue" onPress={handleContinue} />
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
    gap: spacing.lg,
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
    fontSize: fontSize.label,
    fontFamily: fonts.heading,
    color: colors.darkText,
    fontWeight: '600',
    marginTop: spacing.xs,
  },
  fieldLabel: {
    fontSize: fontSize.label,
    fontFamily: fonts.body,
    color: colors.darkText,
    fontWeight: '600',
    marginBottom: -spacing.sm,
  },
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
  ctaWrap: {
    marginTop: spacing.md,
  },
})
