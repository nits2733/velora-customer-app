import React, { useState } from 'react'
import { View, Text, ScrollView, Pressable, StyleSheet } from 'react-native'
import { colors, fonts, fontSize, spacing, radii } from '../../theme/tokens'
import { useRouter } from '../../navigation/router'
import AppHeader from '../../components/AppHeader'
import PrimaryButton from '../../components/PrimaryButton'

const scopeOptions = ['Full Home', 'Living Room', 'Bedroom', 'Kitchen', 'Bathroom', 'Multiple Rooms']
const styleOptions = ['Modern', 'Minimal', 'Traditional', 'Contemporary', 'Eclectic']
const roomOptions = ['Living Room', 'Master Bedroom', 'Guest Bedroom', 'Kitchen', 'Dining', 'Study', 'Balcony']

const TOTAL_STEPS = 4
const CURRENT_STEP = 2

export default function Step2() {
  const router = useRouter()

  const propertyType = router.getParam('propertyType') || ''
  const bedrooms = router.getParam('bedrooms') || ''
  const area = router.getParam('area') || ''
  const location = router.getParam('location') || ''

  const presetScope = router.getParam('presetScope') || ''
  const presetStyle = router.getParam('presetStyle') || ''

  const [scope, setScope] = useState(presetScope)
  const [style, setStyle] = useState(presetStyle)
  const [rooms, setRooms] = useState<string[]>([])

  const scopeChoices = presetScope && !scopeOptions.includes(presetScope)
    ? [presetScope, ...scopeOptions]
    : scopeOptions

  const toggleRoom = (room: string) => {
    setRooms(prev =>
      prev.includes(room) ? prev.filter(r => r !== room) : [...prev, room]
    )
  }

  const handleContinue = () => {
    router.push('StartProject_Step3', { propertyType, bedrooms, area, location, scope, style, rooms })
  }

  return (
    <View style={styles.root}>
      <AppHeader title="Start a Project" showBack onBack={router.back} />

      <ScrollView style={styles.scroll} contentContainerStyle={styles.content}>
        {/* Progress bar */}
        <View style={styles.progressWrap}>
          {Array.from({ length: TOTAL_STEPS }).map((_, i) => (
            <View
              key={i}
              style={[styles.progressSegment, i < CURRENT_STEP && styles.progressSegmentFilled]}
            />
          ))}
        </View>
        <Text style={styles.stepLabel}>Step 2 of 4 — Design Scope</Text>

        {/* Scope */}
        <Text style={styles.fieldLabel}>Scope of Work</Text>
        <View style={styles.chipRow}>
          {scopeChoices.map(s => (
            <Pressable
              key={s}
              onPress={() => setScope(s)}
              style={[styles.chip, scope === s && styles.chipActive]}
            >
              <Text style={[styles.chipText, scope === s && styles.chipTextActive]}>{s}</Text>
            </Pressable>
          ))}
        </View>

        {/* Style */}
        <Text style={styles.fieldLabel}>Style Preference</Text>
        <View style={styles.chipRow}>
          {styleOptions.map(s => (
            <Pressable
              key={s}
              onPress={() => setStyle(s)}
              style={[styles.chip, style === s && styles.chipActive]}
            >
              <Text style={[styles.chipText, style === s && styles.chipTextActive]}>{s}</Text>
            </Pressable>
          ))}
        </View>

        {/* Rooms multi-select */}
        <Text style={styles.fieldLabel}>Rooms to Include</Text>
        <View style={styles.chipRow}>
          {roomOptions.map(r => (
            <Pressable
              key={r}
              onPress={() => toggleRoom(r)}
              style={[styles.chip, rooms.includes(r) && styles.chipActive]}
            >
              <Text style={[styles.chipText, rooms.includes(r) && styles.chipTextActive]}>{r}</Text>
            </Pressable>
          ))}
        </View>

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
