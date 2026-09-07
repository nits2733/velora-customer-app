import React, { useState } from 'react'
import { View, Text, ScrollView, StyleSheet } from 'react-native'
import AppHeader from '../components/AppHeader'
import Chip from '../components/Chip'
import InputField from '../components/InputField'
import PrimaryButton from '../components/PrimaryButton'
import SecondaryButton from '../components/SecondaryButton'
import { colors, fonts, fontSize, spacing, radii, shadows } from '../theme/tokens'
import { useRouter } from '../navigation/router'

type FinishLevel = 'Basic' | 'Standard' | 'Premium' | 'Luxury'
type ProjectType = 'Full Home' | 'Specific Rooms'
type RoomType = 'Living Room' | 'Bedroom' | 'Kitchen' | 'Bathroom'

const baseRates: Record<FinishLevel, number> = {
  Basic: 800,
  Standard: 1200,
  Premium: 1800,
  Luxury: 2800,
}

const projectTypes: ProjectType[] = ['Full Home', 'Specific Rooms']
const roomTypes: RoomType[] = ['Living Room', 'Bedroom', 'Kitchen', 'Bathroom']
const finishLevels: FinishLevel[] = ['Basic', 'Standard', 'Premium', 'Luxury']

export default function CostCalculatorScreen() {
  const router = useRouter()

  const [projectType, setProjectType] = useState<ProjectType>('Full Home')
  const [roomType, setRoomType] = useState<RoomType>('Living Room')
  const [finishLevel, setFinishLevel] = useState<FinishLevel>('Standard')
  const [area, setArea] = useState('')
  const [result, setResult] = useState<{ low: number; high: number } | null>(null)

  const handleCalculate = () => {
    const sqft = parseFloat(area)
    if (!sqft || sqft <= 0) return
    const rate = baseRates[finishLevel]
    const low = Math.round(sqft * rate)
    const high = Math.round(sqft * rate * 1.25)
    setResult({ low, high })
  }

  const formatAmount = (n: number) =>
    n >= 100000
      ? `${(n / 100000).toFixed(1)} Lakh`
      : n.toLocaleString('en-IN')

  return (
    <View style={styles.screen}>
      <AppHeader title="Cost Calculator" showBack onBack={router.back} showHamburger={false} />
      <ScrollView style={styles.scroll} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>

        <Text style={styles.heading}>Estimate Your Project Cost</Text>
        <Text style={styles.subheading}>
          Get a quick ballpark figure based on your space and finish preferences.
        </Text>

        {/* Project Type */}
        <View style={styles.fieldGroup}>
          <Text style={styles.fieldLabel}>Project Type</Text>
          <View style={styles.chips}>
            {projectTypes.map(pt => (
              <Chip
                key={pt}
                label={pt}
                selected={projectType === pt}
                onPress={() => setProjectType(pt)}
              />
            ))}
          </View>
        </View>

        {/* Room Type */}
        <View style={styles.fieldGroup}>
          <Text style={styles.fieldLabel}>Room Type</Text>
          <View style={styles.chips}>
            {roomTypes.map(rt => (
              <Chip
                key={rt}
                label={rt}
                selected={roomType === rt}
                onPress={() => setRoomType(rt)}
              />
            ))}
          </View>
        </View>

        {/* Finish Level */}
        <View style={styles.fieldGroup}>
          <Text style={styles.fieldLabel}>Finish Level</Text>
          <View style={styles.chips}>
            {finishLevels.map(fl => (
              <Chip
                key={fl}
                label={fl}
                selected={finishLevel === fl}
                onPress={() => setFinishLevel(fl)}
              />
            ))}
          </View>
          <Text style={styles.rateHint}>
            Rate: ₹{baseRates[finishLevel].toLocaleString('en-IN')} – ₹{Math.round(baseRates[finishLevel] * 1.25).toLocaleString('en-IN')} per sq. ft.
          </Text>
        </View>

        {/* Area Input */}
        <View style={styles.fieldGroup}>
          <InputField
            label="Carpet Area"
            placeholder="Enter area in sq. ft."
            value={area}
            onChangeText={setArea}
            keyboardType="numeric"
          />
        </View>

        <PrimaryButton label="Calculate Estimate" onPress={handleCalculate} />

        {/* Result card */}
        {result && (
          <View style={styles.resultCard}>
            <Text style={styles.resultLabel}>Estimated Cost</Text>
            <Text style={styles.resultAmount}>
              ₹{formatAmount(result.low)} – ₹{formatAmount(result.high)}
            </Text>
            <View style={styles.resultDivider} />
            <View style={styles.resultMeta}>
              <View style={styles.resultRow}>
                <Text style={styles.resultMetaKey}>Finish Level</Text>
                <Text style={styles.resultMetaVal}>{finishLevel}</Text>
              </View>
              <View style={styles.resultRow}>
                <Text style={styles.resultMetaKey}>Area</Text>
                <Text style={styles.resultMetaVal}>{area} sq. ft.</Text>
              </View>
              <View style={styles.resultRow}>
                <Text style={styles.resultMetaKey}>Room</Text>
                <Text style={styles.resultMetaVal}>{roomType}</Text>
              </View>
            </View>
            <Text style={styles.resultNote}>
              * Final quote may vary based on site inspection, material selection, and structural requirements.
            </Text>
          </View>
        )}

        {result && (
          <SecondaryButton
            label="Request Detailed Quote"
            onPress={() => router.push('Checkout')}
          />
        )}

        <View style={styles.spacer} />
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scroll: {
    flex: 1,
  },
  content: {
    padding: spacing.xl,
    gap: spacing.xl,
    paddingBottom: 40,
  },
  heading: {
    fontSize: fontSize.h3,
    fontFamily: fonts.heading,
    color: colors.darkText,
    fontWeight: '700',
    lineHeight: 30,
  },
  subheading: {
    fontSize: fontSize.body,
    fontFamily: fonts.body,
    color: colors.mutedText,
    lineHeight: 22,
    marginTop: -spacing.md,
  },
  fieldGroup: {
    gap: spacing.sm,
  },
  fieldLabel: {
    fontSize: fontSize.label,
    fontFamily: fonts.body,
    color: colors.darkText,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.6,
  },
  chips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  rateHint: {
    fontSize: fontSize.caption,
    fontFamily: fonts.body,
    color: colors.mutedText,
  },
  resultCard: {
    backgroundColor: colors.darkText,
    borderRadius: radii.md,
    padding: spacing.xl,
    gap: spacing.md,
    ...shadows.md,
  },
  resultLabel: {
    fontSize: fontSize.label,
    fontFamily: fonts.body,
    color: 'rgba(255,255,255,0.6)',
    fontWeight: '500',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  resultAmount: {
    fontSize: fontSize.h2,
    fontFamily: fonts.heading,
    color: colors.white,
    fontWeight: '700',
    lineHeight: 40,
  },
  resultDivider: {
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.15)',
  },
  resultMeta: {
    gap: spacing.sm,
  },
  resultRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  resultMetaKey: {
    fontSize: fontSize.label,
    fontFamily: fonts.body,
    color: 'rgba(255,255,255,0.55)',
  },
  resultMetaVal: {
    fontSize: fontSize.label,
    fontFamily: fonts.body,
    color: colors.white,
    fontWeight: '600',
  },
  resultNote: {
    fontSize: fontSize.caption,
    fontFamily: fonts.body,
    color: 'rgba(255,255,255,0.45)',
    lineHeight: 18,
    marginTop: spacing.xs,
  },
  spacer: {
    height: 20,
  },
})
