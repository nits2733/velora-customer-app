import React, { useMemo, useState } from 'react'
import { View, Text, Image, ScrollView, Pressable, Linking, StyleSheet } from 'react-native'
import Svg, { Path } from 'react-native-svg'
import { colors, fonts, fontSize, spacing, radii, fontWeight, shadows } from '../theme/tokens'
import AppHeader from '../components/AppHeader'
import SectionHeader from '../components/SectionHeader'
import ImgFullHomeChoice from '../../assets/images/74adb.png'

function IconChat() {
  return (
    <Svg width={22} height={22} viewBox="0 0 24 24" fill="none">
      <Path d="M4 6.5A1.5 1.5 0 015.5 5h13A1.5 1.5 0 0120 6.5v8a1.5 1.5 0 01-1.5 1.5H10l-4.5 3.5V16H5.5A1.5 1.5 0 014 14.5v-8z" stroke={colors.white} strokeWidth={1.8} strokeLinejoin="round" />
    </Svg>
  )
}

function IconPhone() {
  return (
    <Svg width={22} height={22} viewBox="0 0 24 24" fill="none">
      <Path d="M6.5 4.5c.8 0 1.5.6 1.6 1.4l.5 3a1.7 1.7 0 01-.5 1.6l-1.2 1.2a12.5 12.5 0 005.4 5.4l1.2-1.2a1.7 1.7 0 011.6-.5l3 .5c.8.1 1.4.8 1.4 1.6v2.2c0 1-.8 1.8-1.8 1.7-10-.7-16-6.7-16.7-16.7A1.8 1.8 0 016.5 4.5z" stroke={colors.white} strokeWidth={1.6} strokeLinejoin="round" strokeLinecap="round" />
    </Svg>
  )
}

const CALL_URL = 'tel:+918210827121'

const TOPICS = ['Full home project', 'Kitchen', 'Painting', 'Just exploring']

const STEPS = [
  { num: '01', title: 'Tell us what you need', desc: 'Pick a topic below or just say hi.' },
  { num: '02', title: 'Talk to a specialist', desc: 'A Velora expert responds on call or WhatsApp.' },
  { num: '03', title: 'Get a free estimate', desc: 'Walk away with a budget direction, no obligation.' },
]

type Props = {
  onHamburger?: () => void
}

export default function ConsultationScreen({ onHamburger }: Props) {
  const [topic, setTopic] = useState('')

  const whatsappUrl = useMemo(() => {
    const message = topic
      ? `Hi, I'd like a free consultation about ${topic}.`
      : `Hi, I'd like a free consultation for my interior project.`
    return `https://wa.me/918210827121?text=${encodeURIComponent(message)}`
  }, [topic])

  const options = [
    { Icon: IconChat, label: 'WhatsApp Us', desc: 'Share your requirements and get a response within minutes', action: () => Linking.openURL(whatsappUrl) },
    { Icon: IconPhone, label: 'Call Us', desc: '+91 82108 27121 · Mon–Sat, 9am–7pm', action: () => Linking.openURL(CALL_URL) },
  ]

  return (
    <View style={s.root}>
      <AppHeader onHamburger={onHamburger} />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={s.content}>

        {/* ── Hero ────────────────────────────────────── */}
        <View style={s.hero}>
          <Image source={ImgFullHomeChoice} style={s.heroImg} />
          <View style={s.heroGrad} />
          <View style={s.heroContent}>
            <Text style={s.heroEyebrow}>FREE CONSULTATION</Text>
            <Text style={s.heroTitle}>Let's begin.</Text>
            <Text style={s.heroSub}>Talk directly to one of our interior specialists about your project, budget, and timelines.</Text>
          </View>
        </View>

        {/* ── What to expect ──────────────────────────── */}
        <View style={s.section}>
          <SectionHeader label="HOW IT WORKS" title="What to expect" />
          <View style={s.stepsList}>
            {STEPS.map(step => (
              <View key={step.num} style={s.stepRow}>
                <View style={s.stepBadge}><Text style={s.stepBadgeTxt}>{step.num}</Text></View>
                <View style={s.stepInfo}>
                  <Text style={s.stepTitle}>{step.title}</Text>
                  <Text style={s.stepDesc}>{step.desc}</Text>
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* ── Topic ───────────────────────────────────── */}
        <View style={s.section}>
          <SectionHeader label="PERSONALIZE" title="What do you need help with?" subtitle="Pick a topic so we can tailor your message." />
          <View style={s.chips}>
            {TOPICS.map(option => (
              <Pressable
                key={option}
                onPress={() => setTopic(current => current === option ? '' : option)}
                style={[s.chip, topic === option && s.chipActive]}
              >
                <Text style={[s.chipText, topic === option && s.chipTextActive]}>{option}</Text>
              </Pressable>
            ))}
          </View>
        </View>

        {/* ── Contact options ─────────────────────────── */}
        <View style={s.section}>
          <SectionHeader label="REACH US" title="Talk to us directly" />
          {options.map((o) => (
            <Pressable key={o.label} style={s.card} onPress={o.action}>
              <View style={s.cardIconBadge}><o.Icon /></View>
              <View style={s.cardInfo}>
                <Text style={s.cardLabel}>{o.label}</Text>
                <Text style={s.cardDesc}>{o.desc}</Text>
              </View>
              <Text style={s.chevron}>›</Text>
            </Pressable>
          ))}
          <View style={s.hours}>
            <Text style={s.hoursTitle}>Office Hours</Text>
            <Text style={s.hoursText}>Monday – Saturday: 9:00 AM – 7:00 PM</Text>
            <Text style={s.hoursText}>Sunday: Closed</Text>
          </View>
        </View>
      </ScrollView>
    </View>
  )
}

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.background },
  content: { paddingBottom: 100 },

  hero: { height: 240, position: 'relative', justifyContent: 'flex-end', marginHorizontal: spacing.xl, marginTop: spacing.lg, borderRadius: radii.lg, overflow: 'hidden' },
  heroImg: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, width: '100%', height: '100%', resizeMode: 'cover' },
  heroGrad: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)' },
  heroContent: { padding: spacing.xl, gap: 6 },
  heroEyebrow: { fontFamily: fonts.body, fontSize: 10, color: 'rgba(255,255,255,0.75)', letterSpacing: 1.2, textTransform: 'uppercase', fontWeight: fontWeight.semibold },
  heroTitle: { fontFamily: fonts.heading, fontSize: 28, color: colors.white, fontWeight: fontWeight.semibold },
  heroSub: { fontFamily: fonts.body, fontSize: fontSize.label, color: 'rgba(255,255,255,0.85)', lineHeight: 20 },

  section: { paddingHorizontal: spacing.xl, paddingTop: spacing.xxl, gap: spacing.lg },

  stepsList: { gap: spacing.lg },
  stepRow: { flexDirection: 'row', gap: spacing.md, alignItems: 'flex-start' },
  stepBadge: { width: 28, height: 28, borderRadius: 14, backgroundColor: colors.darkText, alignItems: 'center', justifyContent: 'center' },
  stepBadgeTxt: { fontFamily: fonts.body, fontSize: fontSize.caption, color: colors.white, fontWeight: fontWeight.bold },
  stepInfo: { flex: 1, gap: 2 },
  stepTitle: { fontFamily: fonts.body, fontSize: fontSize.body, color: colors.darkText, fontWeight: fontWeight.semibold },
  stepDesc: { fontFamily: fonts.body, fontSize: fontSize.caption, color: colors.mutedText, lineHeight: 18 },

  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  chip: { borderWidth: 1, borderColor: colors.border, backgroundColor: colors.white, borderRadius: radii.round, paddingHorizontal: spacing.md, paddingVertical: spacing.sm },
  chipActive: { backgroundColor: colors.darkText, borderColor: colors.darkText },
  chipText: { color: colors.darkText, fontFamily: fonts.body, fontSize: fontSize.label },
  chipTextActive: { color: colors.white },

  card: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.white, borderRadius: radii.md, padding: spacing.lg, marginBottom: 12, borderWidth: 1, borderColor: colors.border, ...shadows.sm },
  cardIconBadge: { width: 44, height: 44, borderRadius: 22, backgroundColor: colors.darkText, alignItems: 'center', justifyContent: 'center', marginRight: 14 },
  cardInfo: { flex: 1 },
  cardLabel: { fontFamily: fonts.body, fontSize: fontSize.label, fontWeight: fontWeight.semibold, color: colors.darkText, marginBottom: 2 },
  cardDesc: { fontFamily: fonts.body, fontSize: fontSize.caption, color: colors.mutedText },
  chevron: { fontSize: 20, color: colors.mutedText },

  hours: { backgroundColor: colors.cardBg, borderRadius: radii.md, padding: spacing.lg, marginTop: spacing.sm },
  hoursTitle: { fontFamily: fonts.body, fontSize: fontSize.label, fontWeight: fontWeight.semibold, color: colors.darkText, marginBottom: 8 },
  hoursText: { fontFamily: fonts.body, fontSize: fontSize.label, color: colors.mutedText, marginBottom: 4 },
})
