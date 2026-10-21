import React, { useEffect, useMemo, useRef, useState } from 'react'
import * as ImagePicker from 'expo-image-picker'
import { Image, Pressable, ScrollView, StyleSheet, Text, TextInput, View, ActivityIndicator } from 'react-native'
import AppHeader from '../components/AppHeader'
import PrimaryButton from '../components/PrimaryButton'
import SecondaryButton from '../components/SecondaryButton'
import { colors, fonts, fontSize, fontWeight, radii, spacing } from '../theme/tokens'
import { useRouter } from '../navigation/router'
import { visionStudioApi } from '../api'
import { ApiError } from '../api/client'
import type { RNUploadFile } from '../api/client'
import type { VisionPreservation } from '../api/types'

type Option = { value: string; label: string }

const ROOM_TYPES: Option[] = [
  { value: 'LIVING_ROOM', label: 'Living room' },
  { value: 'BEDROOM', label: 'Bedroom' },
  { value: 'KITCHEN', label: 'Kitchen' },
  { value: 'BATHROOM', label: 'Bathroom' },
  { value: 'DINING_ROOM', label: 'Dining room' },
  { value: 'HOME_OFFICE', label: 'Home office' },
  { value: 'OTHER', label: 'Other' },
]

const STYLES: Option[] = [
  { value: 'MODERN_LUXURY', label: 'Modern luxury' },
  { value: 'MINIMALIST', label: 'Minimalist' },
  { value: 'SCANDINAVIAN', label: 'Scandinavian' },
  { value: 'CONTEMPORARY', label: 'Contemporary' },
  { value: 'TRADITIONAL_INDIAN', label: 'Traditional Indian' },
  { value: 'JAPANDI', label: 'Japandi' },
  { value: 'INDUSTRIAL', label: 'Industrial' },
  { value: 'BOHEMIAN', label: 'Bohemian' },
  { value: 'CLASSIC_LUXURY', label: 'Classic luxury' },
]

const PALETTES: Option[] = [
  { value: 'BEIGE_WALNUT', label: 'Beige & walnut' },
  { value: 'WHITE_OAK', label: 'White & oak' },
  { value: 'SAGE_CREAM', label: 'Sage green & cream' },
  { value: 'GREY_WHITE', label: 'Grey & white' },
  { value: 'CHARCOAL_GOLD', label: 'Charcoal & gold' },
  { value: 'EARTHY_NEUTRALS', label: 'Earthy neutrals' },
  { value: 'CUSTOM', label: 'Custom' },
]

const BUDGET_TIERS: Option[] = [
  { value: 'BUDGET_FRIENDLY', label: 'Budget-friendly' },
  { value: 'MID_RANGE', label: 'Mid-range' },
  { value: 'PREMIUM_LUXURY', label: 'Premium luxury' },
]

const PRESERVATION_OPTIONS: { value: VisionPreservation; label: string; desc: string }[] = [
  { value: 'PRESERVE_ORIGINAL', label: 'Preserve original room', desc: 'Tries to keep architecture, windows, doors, proportions, camera angle, and layout close to the original.' },
  { value: 'BALANCED', label: 'Balanced redesign', desc: "Keeps the room's structure recognizable while refreshing finishes and furniture more freely." },
  { value: 'CREATIVE', label: 'Creative transformation', desc: 'Prioritizes the new design direction — layout and structure may shift more.' },
]

const FEATURE_CATALOG: { value: string; label: string; rooms?: string[] }[] = [
  { value: 'SOFA_SEATING', label: 'Sofa and seating', rooms: ['LIVING_ROOM'] },
  { value: 'TV_UNIT', label: 'TV unit', rooms: ['LIVING_ROOM', 'BEDROOM'] },
  { value: 'WARDROBE_STORAGE', label: 'Wardrobes and storage', rooms: ['BEDROOM', 'HOME_OFFICE'] },
  { value: 'LIGHTING', label: 'Lighting' },
  { value: 'CURTAINS', label: 'Curtains' },
  { value: 'FALSE_CEILING', label: 'False ceiling', rooms: ['LIVING_ROOM', 'BEDROOM', 'DINING_ROOM'] },
  { value: 'INDOOR_PLANTS', label: 'Indoor plants' },
  { value: 'WALL_PANELS', label: 'Wall panels' },
  { value: 'FLOORING', label: 'Flooring' },
  { value: 'DECORATIVE_ELEMENTS', label: 'Decorative elements' },
]

const ADDITIONAL_INSTRUCTIONS_MAX = 400
const POLL_INTERVAL_MS = 3000
const POLL_TIMEOUT_MS = 90000

type GenStatus = 'idle' | 'PROCESSING' | 'COMPLETED' | 'FAILED'

function isValidImageUrl(url?: string | null): url is string {
  return Boolean(url) && /^https?:\/\//.test(url as string)
}

export default function VisionStudioScreen() {
  const router = useRouter()
  const [imageUri, setImageUri] = useState('')
  const [uploadFile, setUploadFile] = useState<RNUploadFile | null>(null)
  const [imageError, setImageError] = useState('')

  const [roomType, setRoomType] = useState('')
  const [style, setStyle] = useState('')
  const [colorPalette, setColorPalette] = useState('')
  const [customColorDescription, setCustomColorDescription] = useState('')
  const [budgetTier, setBudgetTier] = useState('')
  const [features, setFeatures] = useState<string[]>([])
  const [preservation, setPreservation] = useState<VisionPreservation>('BALANCED')
  const [additionalInstructions, setAdditionalInstructions] = useState('')
  const [advancedOpen, setAdvancedOpen] = useState(false)

  const [validationError, setValidationError] = useState('')
  const [genStatus, setGenStatus] = useState<GenStatus>('idle')
  const [genError, setGenError] = useState('')
  const [resultImageUrl, setResultImageUrl] = useState('')
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const availableFeatures = useMemo(
    () => FEATURE_CATALOG.filter(f => !f.rooms || !roomType || f.rooms.includes(roomType)),
    [roomType]
  )

  const stopPolling = () => {
    if (pollRef.current) clearInterval(pollRef.current)
    pollRef.current = null
  }

  useEffect(() => () => stopPolling(), [])

  // Dropping features that no longer apply when the room type changes
  // (e.g. "Wardrobes" selected, then room switched to Kitchen).
  useEffect(() => {
    setFeatures(current => current.filter(value => availableFeatures.some(f => f.value === value)))
  }, [availableFeatures])

  const toggleFeature = (value: string) => {
    setFeatures(current => current.includes(value) ? current.filter(f => f !== value) : [...current, value])
  }

  const pickRoomPhoto = async () => {
    setImageError('')
    setGenError('')
    setGenStatus('idle')
    setResultImageUrl('')
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync()
    if (!permission.granted) {
      setImageError('Photo library permission is required to add a room photo.')
      return
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.9,
    })
    if (result.canceled) return
    const asset = result.assets[0]
    setImageUri(asset.uri)
    setUploadFile({
      uri: asset.uri,
      name: asset.fileName || 'room.jpg',
      type: asset.mimeType || 'image/jpeg',
    })
  }

  const validate = (): string | null => {
    if (!uploadFile) return 'Add a room photo to continue.'
    if (!roomType) return 'Select a room type.'
    if (!style) return 'Select a design style.'
    if (!colorPalette) return 'Select a color palette.'
    if (colorPalette === 'CUSTOM' && !customColorDescription.trim()) return 'Describe your custom color preference.'
    if (!budgetTier) return 'Select a visual direction.'
    if (additionalInstructions.length > ADDITIONAL_INSTRUCTIONS_MAX) return `Additional instructions must be under ${ADDITIONAL_INSTRUCTIONS_MAX} characters.`
    return null
  }

  const mapError = (err: unknown): string => {
    if (err instanceof ApiError) {
      if (err.status === 400) return err.message || 'Check your selections and try again.'
      if (err.status === 429) return 'Too many requests right now. Please wait a moment and try again.'
      if (err.status === 402) return "We're temporarily out of generation credits. Please try again later."
      if (err.status >= 500) return 'The design engine ran into a problem. Please try again.'
      return err.message || 'Something went wrong. Please try again.'
    }
    return 'Network error. Check your connection and try again.'
  }

  const generateTransformation = async () => {
    const error = validate()
    if (error) {
      setValidationError(error)
      return
    }
    if (!uploadFile) return
    setValidationError('')
    stopPolling()
    setGenError('')
    setResultImageUrl('')
    setGenStatus('PROCESSING')

    const preferences = {
      roomType,
      style,
      colorPalette,
      customColorDescription: colorPalette === 'CUSTOM' ? customColorDescription.trim() : undefined,
      budgetTier,
      features,
      preservation,
      additionalInstructions: additionalInstructions.trim() || undefined,
    }

    const handleSettled = (status: 'COMPLETED' | 'FAILED', resultUrl?: string | null, errorMessage?: string | null) => {
      if (status === 'COMPLETED') {
        if (!isValidImageUrl(resultUrl)) {
          setGenStatus('FAILED')
          setGenError('Received an invalid image from the design engine. Please try again.')
          return
        }
        setResultImageUrl(resultUrl)
        setGenStatus('COMPLETED')
        return
      }
      setGenStatus('FAILED')
      setGenError(errorMessage || 'Generation failed. Please try again.')
    }

    try {
      const job = await visionStudioApi.transform(uploadFile, preferences)
      if (job.status === 'COMPLETED' || job.status === 'FAILED') {
        handleSettled(job.status, job.resultImageUrl, job.error)
        return
      }
      const startedAt = Date.now()
      pollRef.current = setInterval(async () => {
        if (Date.now() - startedAt > POLL_TIMEOUT_MS) {
          stopPolling()
          setGenStatus('FAILED')
          setGenError('This is taking longer than expected. Please try again.')
          return
        }
        try {
          const polled = await visionStudioApi.getTransform(job.id)
          if (polled.status === 'COMPLETED' || polled.status === 'FAILED') {
            stopPolling()
            handleSettled(polled.status, polled.resultImageUrl, polled.error)
          }
        } catch (err) {
          stopPolling()
          setGenStatus('FAILED')
          setGenError(mapError(err))
        }
      }, POLL_INTERVAL_MS)
    } catch (err) {
      setGenStatus('FAILED')
      setGenError(mapError(err))
    }
  }

  const createBrief = () => {
    router.push('StartProject', {
      presetStyle: style,
      visionImageUri: resultImageUrl || imageUri,
      visionRoomType: roomType,
      visionStyle: style,
      visionColorPalette: colorPalette,
      visionCustomColorDescription: customColorDescription || undefined,
      visionBudgetTier: budgetTier,
      visionFeatures: features,
      visionPreservation: preservation,
      visionAdditionalInstructions: additionalInstructions || undefined,
    })
  }

  const reset = () => {
    stopPolling()
    setImageUri('')
    setUploadFile(null)
    setRoomType('')
    setStyle('')
    setColorPalette('')
    setCustomColorDescription('')
    setBudgetTier('')
    setFeatures([])
    setPreservation('BALANCED')
    setAdditionalInstructions('')
    setAdvancedOpen(false)
    setValidationError('')
    setGenStatus('idle')
    setGenError('')
    setResultImageUrl('')
  }

  const isGenerating = genStatus === 'PROCESSING'

  return (
    <View style={s.root}>
      <AppHeader title="Vision Studio" showBack onBack={router.back} />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={s.content} keyboardShouldPersistTaps="handled">
        <Text style={s.eyebrow}>YOUR ROOM, REIMAGINED</Text>
        <Text style={s.title}>See your own room, redesigned.</Text>
        <Text style={s.subtitle}>Upload a photo of your room, choose a direction, and let AI generate a redesigned version.</Text>

        <Pressable style={s.canvas} onPress={pickRoomPhoto} accessibilityLabel="Upload a room photo">
          {imageUri ? <Image source={{ uri: imageUri }} style={s.roomImage} /> : <View style={s.emptyCanvas}><Text style={s.uploadIcon}>＋</Text><Text style={s.canvasTitle}>Add a room photo</Text><Text style={s.canvasHint}>Use a clear photo with the room in view</Text></View>}
          {Boolean(imageUri) && <View style={s.changePhoto}><Text style={s.changePhotoText}>Change photo</Text></View>}
        </Pressable>
        {imageError ? <Text style={s.error}>{imageError}</Text> : null}

        {Boolean(imageUri) && (
          <>
            <Text style={s.sectionLabel}>ROOM TYPE</Text>
            <View style={s.chips}>{ROOM_TYPES.map(opt => <Pressable key={opt.value} onPress={() => setRoomType(opt.value)} style={[s.chip, roomType === opt.value && s.chipActive]}><Text style={[s.chipText, roomType === opt.value && s.chipTextActive]}>{opt.label}</Text></Pressable>)}</View>

            <Text style={s.sectionLabel}>DESIGN STYLE</Text>
            <View style={s.chips}>{STYLES.map(opt => <Pressable key={opt.value} onPress={() => setStyle(opt.value)} style={[s.chip, style === opt.value && s.chipActive]}><Text style={[s.chipText, style === opt.value && s.chipTextActive]}>{opt.label}</Text></Pressable>)}</View>

            <Pressable style={s.advancedToggle} onPress={() => setAdvancedOpen(v => !v)}>
              <Text style={s.advancedToggleText}>{advancedOpen ? 'Hide advanced customization' : 'Show advanced customization'}</Text>
              <Text style={s.advancedToggleChevron}>{advancedOpen ? '▲' : '▼'}</Text>
            </Pressable>

            {advancedOpen && (
              <>
                <Text style={s.sectionLabel}>COLOR PALETTE</Text>
                <View style={s.chips}>{PALETTES.map(opt => <Pressable key={opt.value} onPress={() => setColorPalette(opt.value)} style={[s.chip, colorPalette === opt.value && s.chipActive]}><Text style={[s.chipText, colorPalette === opt.value && s.chipTextActive]}>{opt.label}</Text></Pressable>)}</View>
                {colorPalette === 'CUSTOM' && (
                  <TextInput
                    style={s.input}
                    placeholder="Describe your preferred colors, e.g. dusty rose and brass"
                    placeholderTextColor={colors.mutedText}
                    value={customColorDescription}
                    onChangeText={setCustomColorDescription}
                    maxLength={120}
                  />
                )}

                <Text style={s.sectionLabel}>VISUAL DIRECTION</Text>
                <Text style={s.hint}>Influences materials and finishes shown — not a renovation cost estimate.</Text>
                <View style={s.chips}>{BUDGET_TIERS.map(opt => <Pressable key={opt.value} onPress={() => setBudgetTier(opt.value)} style={[s.chip, budgetTier === opt.value && s.chipActive]}><Text style={[s.chipText, budgetTier === opt.value && s.chipTextActive]}>{opt.label}</Text></Pressable>)}</View>

                <Text style={s.sectionLabel}>FEATURES TO INCLUDE</Text>
                <View style={s.chips}>{availableFeatures.map(opt => <Pressable key={opt.value} onPress={() => toggleFeature(opt.value)} style={[s.chip, features.includes(opt.value) && s.chipActive]}><Text style={[s.chipText, features.includes(opt.value) && s.chipTextActive]}>{features.includes(opt.value) ? '✓ ' : ''}{opt.label}</Text></Pressable>)}</View>

                <Text style={s.sectionLabel}>ROOM PRESERVATION</Text>
                <View style={s.preservationList}>
                  {PRESERVATION_OPTIONS.map(opt => (
                    <Pressable key={opt.value} onPress={() => setPreservation(opt.value)} style={[s.preservationCard, preservation === opt.value && s.preservationCardActive]}>
                      <Text style={[s.preservationLabel, preservation === opt.value && s.preservationTextActive]}>{opt.label}</Text>
                      <Text style={[s.preservationDesc, preservation === opt.value && s.preservationTextActive]}>{opt.desc}</Text>
                    </Pressable>
                  ))}
                </View>
                <Text style={s.hint}>Results vary by room and AI model — this is a direction, not a guarantee.</Text>

                <Text style={s.sectionLabel}>ADDITIONAL INSTRUCTIONS (OPTIONAL)</Text>
                <TextInput
                  style={[s.input, s.textArea]}
                  placeholder="e.g. Keep the existing flooring and windows. Add a beige L-shaped sofa, a floating walnut TV unit, and warm lighting."
                  placeholderTextColor={colors.mutedText}
                  value={additionalInstructions}
                  onChangeText={setAdditionalInstructions}
                  multiline
                  numberOfLines={4}
                  maxLength={ADDITIONAL_INSTRUCTIONS_MAX}
                />
                <Text style={s.charCount}>{additionalInstructions.length}/{ADDITIONAL_INSTRUCTIONS_MAX}</Text>
              </>
            )}

            {validationError ? <Text style={s.error}>{validationError}</Text> : null}

            <PrimaryButton
              label={isGenerating ? 'Generating…' : 'Generate design'}
              onPress={generateTransformation}
              disabled={isGenerating}
            />

            {isGenerating && (
              <View style={s.statusCard}>
                <ActivityIndicator color={colors.darkText} />
                <Text style={s.statusText}>Redesigning your room — this can take up to a minute.</Text>
              </View>
            )}

            {genStatus === 'FAILED' && genError ? (
              <View style={s.errorCard}>
                <Text style={s.error}>{genError}</Text>
                <SecondaryButton label="Retry" onPress={generateTransformation} />
              </View>
            ) : null}

            {genStatus === 'COMPLETED' && resultImageUrl ? (
              <View style={s.resultBlock}>
                <Text style={s.sectionLabel}>BEFORE &amp; AFTER</Text>
                <View style={s.compareRow}>
                  <View style={s.compareCol}>
                    <Image source={{ uri: imageUri }} style={s.compareImage} />
                    <Text style={s.compareLabel}>Before</Text>
                  </View>
                  <View style={s.compareCol}>
                    <Image source={{ uri: resultImageUrl }} style={s.compareImage} />
                    <Text style={s.compareLabel}>After</Text>
                  </View>
                </View>
              </View>
            ) : null}
          </>
        )}

        {genStatus === 'COMPLETED' && resultImageUrl && (
          <>
            <PrimaryButton label="Use this for my project" onPress={createBrief} />
            <SecondaryButton label="Generate another variation" onPress={generateTransformation} />
            <SecondaryButton label="Start over" onPress={reset} />
          </>
        )}
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
  changePhoto: { position: 'absolute', right: spacing.md, bottom: spacing.md, backgroundColor: 'rgba(255,255,255,0.9)', paddingHorizontal: spacing.md, paddingVertical: spacing.sm, borderRadius: radii.round },
  changePhotoText: { color: colors.darkText, fontFamily: fonts.body, fontSize: fontSize.caption, fontWeight: fontWeight.semibold },
  sectionLabel: { color: colors.mutedText, fontFamily: fonts.body, fontSize: fontSize.tiny, letterSpacing: 0.8, fontWeight: fontWeight.semibold, marginTop: spacing.md },
  hint: { color: colors.mutedText, fontFamily: fonts.body, fontSize: fontSize.caption, lineHeight: 17, marginTop: -spacing.sm },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  chip: { borderWidth: 1, borderColor: colors.border, backgroundColor: colors.white, borderRadius: radii.round, paddingHorizontal: spacing.md, paddingVertical: spacing.sm },
  chipActive: { backgroundColor: colors.darkText, borderColor: colors.darkText },
  chipText: { color: colors.darkText, fontFamily: fonts.body, fontSize: fontSize.label },
  chipTextActive: { color: colors.white },
  advancedToggle: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: spacing.sm, paddingVertical: spacing.sm, borderTopWidth: 1, borderBottomWidth: 1, borderColor: colors.border },
  advancedToggleText: { color: colors.darkText, fontFamily: fonts.body, fontSize: fontSize.label, fontWeight: fontWeight.semibold },
  advancedToggleChevron: { color: colors.mutedText, fontFamily: fonts.body, fontSize: fontSize.caption },
  input: { borderWidth: 1, borderColor: colors.border, backgroundColor: colors.white, borderRadius: radii.md, padding: spacing.md, fontFamily: fonts.body, fontSize: fontSize.label, color: colors.darkText },
  textArea: { minHeight: 90, textAlignVertical: 'top' },
  charCount: { color: colors.mutedText, fontFamily: fonts.body, fontSize: fontSize.tiny, alignSelf: 'flex-end', marginTop: -spacing.sm },
  preservationList: { gap: spacing.sm },
  preservationCard: { borderWidth: 1, borderColor: colors.border, backgroundColor: colors.white, borderRadius: radii.md, padding: spacing.md, gap: 4 },
  preservationCardActive: { backgroundColor: colors.darkText, borderColor: colors.darkText },
  preservationLabel: { color: colors.darkText, fontFamily: fonts.body, fontSize: fontSize.label, fontWeight: fontWeight.semibold },
  preservationDesc: { color: colors.mutedText, fontFamily: fonts.body, fontSize: fontSize.caption, lineHeight: 17 },
  preservationTextActive: { color: colors.white },
  statusCard: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, backgroundColor: colors.cardBg2, borderRadius: radii.md, padding: spacing.lg },
  statusText: { flex: 1, color: colors.darkText, fontFamily: fonts.body, fontSize: fontSize.label, lineHeight: 20 },
  errorCard: { gap: spacing.sm },
  resultBlock: { gap: spacing.sm },
  compareRow: { flexDirection: 'row', gap: spacing.sm },
  compareCol: { flex: 1, gap: spacing.xs },
  compareImage: { width: '100%', height: 200, borderRadius: radii.lg, backgroundColor: colors.cardBg },
  compareLabel: { textAlign: 'center', color: colors.mutedText, fontFamily: fonts.body, fontSize: fontSize.caption, fontWeight: fontWeight.semibold },
  error: { color: colors.error, fontFamily: fonts.body, fontSize: fontSize.caption },
})
