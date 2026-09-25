import React, { useEffect, useState } from 'react'
import { View, Text, ScrollView, Pressable, StyleSheet, Image } from 'react-native'
import { colors, fonts, fontSize, spacing, radii } from '../../theme/tokens'
import { useRouter } from '../../navigation/router'
import AppHeader from '../../components/AppHeader'
import InputField from '../../components/InputField'
import PrimaryButton from '../../components/PrimaryButton'
import ImgWarm from '../../../assets/images/89a8f.png'
import ImgClean from '../../../assets/images/94bfe.png'
import ImgModern from '../../../assets/images/0a1c1.png'
import ImgClassic from '../../../assets/images/c9d47.png'
import ImgExpressive from '../../../assets/images/3484d.png'
import ImgDiscover from '../../../assets/images/419c8.png'

const scopeOptions = [
  'Design only',
  'Design + execution',
  'Execution only',
  'Furniture & styling',
  'Not sure yet',
]
const styleOptions = [
  { label: 'Warm & Cozy', detail: 'Comfortable, warm and inviting', image: ImgWarm },
  { label: 'Simple & Clean', detail: 'Open, uncluttered and easy to maintain', image: ImgClean },
  { label: 'Modern & Elegant', detail: 'Contemporary and sophisticated', image: ImgModern },
  { label: 'Classic & Timeless', detail: 'Elegant with traditional touches', image: ImgClassic },
  { label: 'Colourful & Expressive', detail: 'Bold colours and personality', image: ImgExpressive },
  { label: 'Not Sure Yet', detail: 'Help me discover my style', image: ImgDiscover },
]
const roomOptions = ['Entire Home', 'Living Room', 'Kitchen', 'Primary Bedroom', 'Kids Room', 'Guest Bedroom', 'Dining', 'Study', 'Bathrooms', 'Balcony', 'Foyer']
const workOptions = ['Kitchen', 'Wardrobes & Storage', 'Furniture', 'Lighting', 'Ceiling', 'Paint & Walls', 'Flooring / Civil Work', 'Curtains & Soft Furnishings', 'Electrical Work', 'Other']

function normalizeScope(value: string): string {
  const normalized = value.toLowerCase()
  if (normalized.includes('furnish') || normalized.includes('styling')) return 'Furniture & styling'
  if (normalized.includes('design') && !normalized.includes('execution')) return 'Design only'
  if (normalized.includes('execution') || normalized.includes('home project')) return 'Design + execution'
  return scopeOptions.includes(value) ? value : ''
}

function normalizeStyle(value: string): string {
  const normalized = value.toLowerCase()
  if (normalized.includes('minimal') || normalized.includes('clean')) return 'Simple & Clean'
  if (normalized.includes('warm') || normalized.includes('cozy')) return 'Warm & Cozy'
  if (normalized.includes('classic') || normalized.includes('traditional')) return 'Classic & Timeless'
  if (normalized.includes('bold') || normalized.includes('eclectic') || normalized.includes('colour')) return 'Colourful & Expressive'
  if (normalized.includes('modern') || normalized.includes('contemporary')) return 'Modern & Elegant'
  return styleOptions.some(option => option.label === value) ? value : ''
}

const TOTAL_STEPS = 4
const CURRENT_STEP = 2

export default function Step2() {
  const router = useRouter()

  const propertyType = router.getParam('propertyType') || ''
  const bedrooms = router.getParam('bedrooms') || ''
  const area = router.getParam('area') || ''
  const location = router.getParam('location') || ''
  const propertyCondition = router.getParam('propertyCondition') || ''
  const possessionDate = router.getParam('possessionDate') || ''
  const visionBrief = router.getParam('visionBrief') || ''
  const visionImageUri = router.getParam('visionImageUri') || ''
  const visionGoals = router.getParam('visionGoals') || []
  const visionBudget = router.getParam('visionBudget') || ''

  const presetScope = router.getParam('presetScope') || ''
  const presetStyle = router.getParam('presetStyle') || ''

  const [scope, setScope] = useState(router.getParam('scope') || normalizeScope(presetScope))
  const [style, setStyle] = useState(router.getParam('style') || normalizeStyle(presetStyle))
  const [rooms, setRooms] = useState<string[]>(router.getParam('rooms') || [])
  const [workTypes, setWorkTypes] = useState<string[]>(router.getParam('workTypes') || [])
  const [notes, setNotes] = useState(router.getParam('notes') || '')

  useEffect(() => {
    router.updateParams({ scope, style, rooms, workTypes, notes })
  }, [scope, style, rooms, workTypes, notes])

  const canContinue = Boolean(scope && style && rooms.length > 0 && workTypes.length > 0)

  const toggleRoom = (value: string) => {
    if (value === 'Entire Home') {
      setRooms(prev => prev.includes(value) ? [] : [value])
      return
    }
    setRooms(prev => {
      const withoutEntireHome = prev.filter(item => item !== 'Entire Home')
      return withoutEntireHome.includes(value)
        ? withoutEntireHome.filter(item => item !== value)
        : [...withoutEntireHome, value]
    })
  }

  const toggleWork = (value: string) => {
    setWorkTypes(prev =>
      prev.includes(value) ? prev.filter(item => item !== value) : [...prev, value]
    )
  }

  const handleContinue = () => {
    if (!canContinue) return
    router.push('StartProject_Step3', {
      propertyType,
      bedrooms,
      area,
      location,
      propertyCondition,
      possessionDate,
      visionBrief,
      visionImageUri,
      visionGoals,
      visionBudget,
      scope,
      style,
      rooms,
      workTypes,
      notes: notes.trim(),
    })
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
        <Text style={styles.stepLabel}>STEP 2 OF 4 · YOUR PROJECT</Text>
        <Text style={styles.title}>Tell us what you&apos;d like to create.</Text>
        <Text style={styles.subtitle}>A few simple choices are enough. Your professional can work through the details with you later.</Text>

        <Text style={styles.fieldLabel}>What kind of help are you looking for?</Text>
        <View style={styles.chipRow}>
          {scopeOptions.map(s => (
            <Pressable
              key={s}
              onPress={() => setScope(s)}
              style={[styles.chip, scope === s && styles.chipActive]}
            >
              <Text style={[styles.chipText, scope === s && styles.chipTextActive]}>{s}</Text>
            </Pressable>
          ))}
        </View>

        <View style={styles.fieldHeadingRow}>
          <Text style={styles.fieldLabel}>Which parts of your home need attention?</Text>
          {rooms.length > 0 && <Text style={styles.count}>{rooms.includes('Entire Home') ? 'Entire home' : `${rooms.length} selected`}</Text>}
        </View>
        <View style={styles.chipRow}>
          {roomOptions.map(room => (
            <Pressable
              key={room}
              onPress={() => toggleRoom(room)}
              style={[styles.chip, rooms.includes(room) && styles.chipActive]}
            >
              <Text style={[styles.chipText, rooms.includes(room) && styles.chipTextActive]}>{rooms.includes(room) ? '✓ ' : ''}{room}</Text>
            </Pressable>
          ))}
        </View>

        <View style={styles.fieldHeadingRow}>
          <Text style={styles.fieldLabel}>What would you like to add or change?</Text>
          {workTypes.length > 0 && <Text style={styles.count}>{workTypes.length} selected</Text>}
        </View>
        <View style={styles.chipRow}>
          {workOptions.map(work => (
            <Pressable
              key={work}
              onPress={() => toggleWork(work)}
              style={[styles.chip, workTypes.includes(work) && styles.chipActive]}
            >
              <Text style={[styles.chipText, workTypes.includes(work) && styles.chipTextActive]}>{workTypes.includes(work) ? '✓ ' : ''}{work}</Text>
            </Pressable>
          ))}
        </View>

        <Text style={styles.fieldLabel}>Which kind of home feels most like you?</Text>
        <View style={styles.styleGrid}>
          {styleOptions.map(option => (
            <Pressable
              key={option.label}
              onPress={() => setStyle(option.label)}
              style={[styles.styleCard, style === option.label && styles.styleCardActive]}
            >
              <Image source={option.image} style={styles.styleImage} />
              <View style={styles.styleCopy}>
                <Text style={styles.styleTitle}>{style === option.label ? '✓ ' : ''}{option.label}</Text>
                <Text style={styles.styleDetail}>{option.detail}</Text>
              </View>
            </Pressable>
          ))}
        </View>

        <InputField
          label="Anything else you'd like us to know? (optional)"
          placeholder="Tell us about anything important — specific requirements, preferences, or concerns."
          value={notes}
          onChangeText={setNotes}
          multiline
          numberOfLines={3}
        />

        <View style={styles.ctaWrap}>
          {!canContinue && <Text style={styles.requiredHint}>Choose a service level, space, work type, and style direction.</Text>}
          <PrimaryButton label="Continue to budget & timing" onPress={handleContinue} disabled={!canContinue} />
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
    fontWeight: '600',
    letterSpacing: 0.8,
    marginTop: spacing.xs,
  },
  title: {
    fontSize: 28,
    lineHeight: 35,
    fontFamily: fonts.heading,
    color: colors.darkText,
    fontWeight: '600',
  },
  subtitle: {
    fontSize: fontSize.label,
    lineHeight: 21,
    fontFamily: fonts.body,
    color: colors.mutedText,
    marginTop: -spacing.md,
  },
  fieldLabel: {
    flex: 1,
    fontSize: fontSize.body,
    fontFamily: fonts.body,
    color: colors.darkText,
    fontWeight: '600',
    marginBottom: -spacing.sm,
  },
  fieldHeadingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.md,
  },
  count: {
    fontFamily: fonts.body,
    fontSize: fontSize.caption,
    color: colors.accent,
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
  styleGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  styleCard: {
    width: '48%',
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: colors.border,
    borderRadius: radii.md,
    backgroundColor: colors.white,
  },
  styleCardActive: {
    borderColor: colors.darkText,
  },
  styleImage: {
    width: '100%',
    height: 108,
  },
  styleCopy: {
    minHeight: 82,
    padding: spacing.sm,
  },
  styleTitle: {
    fontFamily: fonts.body,
    fontSize: fontSize.label,
    fontWeight: '600',
    color: colors.darkText,
  },
  styleDetail: {
    marginTop: 3,
    fontFamily: fonts.body,
    fontSize: fontSize.caption,
    lineHeight: 16,
    color: colors.mutedText,
  },
  contextNote: {
    padding: spacing.md,
    borderLeftWidth: 3,
    borderLeftColor: colors.accent,
    backgroundColor: colors.cardBg2,
    borderRadius: radii.md,
  },
  contextTitle: {
    fontFamily: fonts.body,
    fontSize: fontSize.label,
    fontWeight: '600',
    color: colors.darkText,
  },
  contextText: {
    marginTop: 3,
    fontFamily: fonts.body,
    fontSize: fontSize.caption,
    lineHeight: 18,
    color: colors.mutedText,
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
