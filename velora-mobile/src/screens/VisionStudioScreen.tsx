import React, { useMemo, useState } from 'react'
import * as ImagePicker from 'expo-image-picker'
import { Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native'
import AppHeader from '../components/AppHeader'
import PrimaryButton from '../components/PrimaryButton'
import SecondaryButton from '../components/SecondaryButton'
import { colors, fonts, fontSize, fontWeight, radii, spacing } from '../theme/tokens'
import { useRouter } from '../navigation/router'

type Concept = {
  name: string
  description: string
  palette: string[]
  estimate: string
  focus: string
}

const goals = ['More storage', 'Warmer lighting', 'Kid-friendly', 'Work-from-home', 'Better flow', 'Premium finishes']
const budgets = ['Under ₹10L', '₹10L–₹20L', '₹20L–₹35L', '₹35L+', 'Help me plan']
const styles = ['Warm contemporary', 'Clean minimal', 'Modern Indian', 'Bold eclectic']
const hotspots = [
  { id: 'kitchen', label: 'Kitchen zone', left: '20%', top: '48%', question: 'How much might this kitchen cost?', answer: 'A modular kitchen here would typically begin around ₹3L and move upward based on storage, hardware, and countertop choices.' },
  { id: 'wall', label: 'Partition wall', left: '72%', top: '28%', question: 'Can this wall be removed?', answer: 'It may be possible, but a site visit is needed to check whether it is structural and confirm building permissions.' },
  { id: 'wood', label: 'Wood finish', left: '67%', top: '68%', question: 'Show this with darker wood.', answer: 'A walnut or smoked-oak direction would add contrast while keeping the room warm. We have saved this as your design preference.' },
]

const concepts: Concept[] = [
  { name: 'Soft Modern', description: 'Calm neutrals, concealed storage, and layered warm light for an easy everyday room.', palette: ['#e9dfcf', '#ad9276', '#403a34'], estimate: '₹12L–₹18L', focus: 'Storage + warm lighting' },
  { name: 'Earth & Line', description: 'Clean planning with natural textures, darker joinery, and a stronger architectural edge.', palette: ['#d8c8af', '#765f49', '#252725'], estimate: '₹16L–₹24L', focus: 'Flow + premium finishes' },
  { name: 'Bright Collective', description: 'Flexible furniture, durable finishes, and playful details designed around family life.', palette: ['#f5ead7', '#d18a62', '#50605c'], estimate: '₹10L–₹16L', focus: 'Kid-friendly + flexible use' },
]

export default function VisionStudioScreen() {
  const router = useRouter()
  const [imageUri, setImageUri] = useState('')
  const [selectedGoals, setSelectedGoals] = useState<string[]>(['More storage'])
  const [budget, setBudget] = useState('')
  const [style, setStyle] = useState('')
  const [selectedConcept, setSelectedConcept] = useState(0)
  const [activeHotspot, setActiveHotspot] = useState<typeof hotspots[number] | null>(null)
  const [imageError, setImageError] = useState('')

  const concept = concepts[selectedConcept]
  const conceptDirection = useMemo(() => `${concept.name}: ${concept.description} Budget direction: ${budget || 'to be planned'}. Goals: ${selectedGoals.join(', ') || 'explore options'}.`, [budget, concept, selectedGoals])

  const toggleGoal = (goal: string) => {
    setSelectedGoals(current => current.includes(goal) ? current.filter(item => item !== goal) : [...current, goal])
  }

  const pickRoomPhoto = async () => {
    setImageError('')
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync()
    if (!permission.granted) {
      setImageError('Photo library permission is required to add a room photo.')
      return
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.9,
    })
    if (!result.canceled) setImageUri(result.assets[0].uri)
  }

  const createBrief = () => {
    router.push('StartProject', {
      presetStyle: style || concept.name,
      visionImageUri: imageUri,
      visionBrief: conceptDirection,
      visionGoals: selectedGoals,
      visionBudget: budget,
    })
  }

  return (
    <View style={s.root}>
      <AppHeader title="Vision Studio" showBack onBack={router.back} />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={s.content}>
        <Text style={s.eyebrow}>YOUR ROOM, REIMAGINED</Text>
        <Text style={s.title}>Turn one photo into a design direction.</Text>
        <Text style={s.subtitle}>Upload a room, tell us what matters, and shape a brief you can send to a Velora professional.</Text>

        <Pressable style={s.canvas} onPress={pickRoomPhoto} accessibilityLabel="Upload a room photo">
          {imageUri ? <Image source={{ uri: imageUri }} style={s.roomImage} /> : <View style={s.emptyCanvas}><Text style={s.uploadIcon}>＋</Text><Text style={s.canvasTitle}>Add a room photo</Text><Text style={s.canvasHint}>Use a clear photo with the room in view</Text></View>}
          {Boolean(imageUri) && <View style={s.canvasShade} />}
          {Boolean(imageUri) && hotspots.map(hotspot => (
            <Pressable key={hotspot.id} style={[s.hotspot, { left: hotspot.left as any, top: hotspot.top as any }]} onPress={() => setActiveHotspot(hotspot)} accessibilityLabel={hotspot.label}>
              <View style={s.hotspotDot} /><Text style={s.hotspotLabel}>{hotspot.label}</Text>
            </Pressable>
          ))}
          {Boolean(imageUri) && <View style={s.changePhoto}><Text style={s.changePhotoText}>Change photo</Text></View>}
        </Pressable>
        {imageError ? <Text style={s.error}>{imageError}</Text> : null}

        {activeHotspot && (
          <View style={s.answerCard}>
            <View style={s.answerHeader}><Text style={s.answerQuestion}>{activeHotspot.question}</Text><Pressable onPress={() => setActiveHotspot(null)}><Text style={s.close}>×</Text></Pressable></View>
            <Text style={s.answer}>{activeHotspot.answer}</Text>
            <Text style={s.answerHint}>We will confirm this during the professional consultation.</Text>
          </View>
        )}

        <Text style={s.sectionLabel}>WHAT SHOULD THIS ROOM DO BETTER?</Text>
        <View style={s.chips}>{goals.map(goal => <Pressable key={goal} onPress={() => toggleGoal(goal)} style={[s.chip, selectedGoals.includes(goal) && s.chipActive]}><Text style={[s.chipText, selectedGoals.includes(goal) && s.chipTextActive]}>{selectedGoals.includes(goal) ? '✓ ' : ''}{goal}</Text></Pressable>)}</View>

        <Text style={s.sectionLabel}>YOUR INVESTMENT DIRECTION</Text>
        <View style={s.chips}>{budgets.map(option => <Pressable key={option} onPress={() => setBudget(option)} style={[s.chip, budget === option && s.chipActive]}><Text style={[s.chipText, budget === option && s.chipTextActive]}>{option}</Text></Pressable>)}</View>

        <Text style={s.sectionLabel}>PICK A DESIGN DIRECTION</Text>
        <View style={s.conceptRail}>{concepts.map((item, index) => <Pressable key={item.name} onPress={() => setSelectedConcept(index)} style={[s.conceptCard, selectedConcept === index && s.conceptCardActive]}><View style={s.swatches}>{item.palette.map(color => <View key={color} style={[s.swatch, { backgroundColor: color }]} />)}</View><Text style={[s.conceptName, selectedConcept === index && s.conceptTextActive]}>{item.name}</Text><Text style={[s.conceptDescription, selectedConcept === index && s.conceptTextActive]}>{item.description}</Text><Text style={[s.conceptMeta, selectedConcept === index && s.conceptTextActive]}>{item.estimate} · {item.focus}</Text></Pressable>)}</View>

        <Text style={s.sectionLabel}>MAKE IT YOURS</Text>
        <View style={s.chips}>{styles.map(option => <Pressable key={option} onPress={() => setStyle(option)} style={[s.chip, style === option && s.chipActive]}><Text style={[s.chipText, style === option && s.chipTextActive]}>{option}</Text></Pressable>)}</View>

        <View style={s.briefCard}><Text style={s.briefEyebrow}>LIVE CONSULTATION BRIEF</Text><Text style={s.briefTitle}>{concept.name}</Text><Text style={s.briefText}>{conceptDirection}</Text></View>
        <PrimaryButton label="Use this concept for my project" onPress={createBrief} />
        <SecondaryButton label="Start over" onPress={() => { setImageUri(''); setActiveHotspot(null); setSelectedGoals(['More storage']); setBudget(''); setStyle(''); setSelectedConcept(0) }} />
      </ScrollView>
    </View>
  )
}

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.xl, paddingBottom: 48, gap: spacing.lg },
  eyebrow: { color: colors.accent, fontFamily: fonts.body, fontSize: fontSize.tiny, fontWeight: fontWeight.semibold, letterSpacing: 1 },
  title: { color: colors.darkText, fontFamily: fonts.heading, fontSize: 30, lineHeight: 37, fontWeight: fontWeight.semibold },
  subtitle: { color: colors.mutedText, fontFamily: fonts.body, fontSize: fontSize.label, lineHeight: 21, marginTop: -spacing.sm },
  canvas: { height: 310, borderRadius: radii.lg, overflow: 'hidden', backgroundColor: '#d8d1c4', position: 'relative', borderWidth: 1, borderColor: colors.border },
  roomImage: { width: '100%', height: '100%' },
  emptyCanvas: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: spacing.xl },
  uploadIcon: { color: colors.darkText, fontSize: 42, fontWeight: '300' },
  canvasTitle: { color: colors.darkText, fontFamily: fonts.heading, fontSize: fontSize.h4, marginTop: spacing.sm },
  canvasHint: { color: colors.mutedText, fontFamily: fonts.body, fontSize: fontSize.caption, marginTop: spacing.xs },
  canvasShade: { ...StyleSheet.absoluteFill, backgroundColor: 'rgba(20, 18, 14, 0.16)' },
  changePhoto: { position: 'absolute', right: spacing.md, bottom: spacing.md, backgroundColor: 'rgba(255,255,255,0.9)', paddingHorizontal: spacing.md, paddingVertical: spacing.sm, borderRadius: radii.round },
  changePhotoText: { color: colors.darkText, fontFamily: fonts.body, fontSize: fontSize.caption, fontWeight: fontWeight.semibold },
  hotspot: { position: 'absolute', alignItems: 'center', transform: [{ translateX: -12 }, { translateY: -12 }] },
  hotspotDot: { width: 24, height: 24, borderRadius: 12, backgroundColor: colors.accent, borderWidth: 3, borderColor: colors.white },
  hotspotLabel: { backgroundColor: colors.darkText, color: colors.white, fontFamily: fonts.body, fontSize: 10, paddingHorizontal: 6, paddingVertical: 3, borderRadius: 3, marginTop: 4 },
  answerCard: { backgroundColor: colors.darkText, borderRadius: radii.lg, padding: spacing.lg, gap: spacing.sm },
  answerHeader: { flexDirection: 'row', justifyContent: 'space-between', gap: spacing.md },
  answerQuestion: { color: colors.white, fontFamily: fonts.body, fontSize: fontSize.body, fontWeight: fontWeight.semibold, flex: 1 },
  close: { color: colors.white, fontSize: 24, lineHeight: 20 },
  answer: { color: colors.white, fontFamily: fonts.body, fontSize: fontSize.label, lineHeight: 21 },
  answerHint: { color: 'rgba(255,255,255,0.6)', fontFamily: fonts.body, fontSize: fontSize.caption },
  sectionLabel: { color: colors.mutedText, fontFamily: fonts.body, fontSize: fontSize.tiny, letterSpacing: 0.8, fontWeight: fontWeight.semibold, marginTop: spacing.md },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  chip: { borderWidth: 1, borderColor: colors.border, backgroundColor: colors.white, borderRadius: radii.round, paddingHorizontal: spacing.md, paddingVertical: spacing.sm },
  chipActive: { backgroundColor: colors.darkText, borderColor: colors.darkText },
  chipText: { color: colors.darkText, fontFamily: fonts.body, fontSize: fontSize.label },
  chipTextActive: { color: colors.white },
  conceptRail: { gap: spacing.md },
  conceptCard: { backgroundColor: colors.white, borderWidth: 1, borderColor: colors.border, borderRadius: radii.lg, padding: spacing.lg, gap: spacing.sm },
  conceptCardActive: { backgroundColor: colors.darkText, borderColor: colors.darkText },
  swatches: { flexDirection: 'row', gap: spacing.xs },
  swatch: { width: 28, height: 12, borderRadius: 2 },
  conceptName: { color: colors.darkText, fontFamily: fonts.heading, fontSize: fontSize.h4, fontWeight: fontWeight.semibold },
  conceptDescription: { color: colors.mutedText, fontFamily: fonts.body, fontSize: fontSize.label, lineHeight: 19 },
  conceptMeta: { color: colors.accent, fontFamily: fonts.body, fontSize: fontSize.caption, fontWeight: fontWeight.semibold },
  conceptTextActive: { color: colors.white },
  briefCard: { backgroundColor: colors.cardBg2, borderLeftWidth: 3, borderLeftColor: colors.accent, padding: spacing.lg, gap: spacing.sm, borderRadius: radii.md },
  briefEyebrow: { color: colors.accent, fontFamily: fonts.body, fontSize: fontSize.tiny, letterSpacing: 0.8, fontWeight: fontWeight.semibold },
  briefTitle: { color: colors.darkText, fontFamily: fonts.heading, fontSize: fontSize.h3, fontWeight: fontWeight.semibold },
  briefText: { color: colors.mutedText, fontFamily: fonts.body, fontSize: fontSize.label, lineHeight: 20 },
  error: { color: colors.error, fontFamily: fonts.body, fontSize: fontSize.caption },
})
