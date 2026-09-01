import React from 'react'
import { View, Text, ScrollView, Pressable, StyleSheet } from 'react-native'
import { colors, fonts, fontSize, spacing, radii, fontWeight } from '../../theme/tokens'
import { useRouter } from '../../navigation/router'
import PrimaryButton from '../../components/PrimaryButton'
import SecondaryButton from '../../components/SecondaryButton'

export default function Confirmation() {
  const router = useRouter()

  const statusSteps = [
    { label: 'Request submitted', desc: 'Just now', done: true, active: false },
    { label: 'Velora contacting Rahul', desc: "We're reaching out to Rahul with your requirements.", done: false, active: true },
    { label: "Rahul's response", desc: 'Waiting for availability', done: false, active: false },
    { label: 'Project begins', desc: 'Available after Rahul accepts', done: false, active: false },
  ]

  return (
    <View style={s.root}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={s.content}>
        <View style={s.iconWrap}>
          <View style={s.iconCircle}>
            <Text style={s.iconTxt}>✓</Text>
          </View>
        </View>
        <Text style={s.title}>Request sent</Text>
        <Text style={s.subtitle}>Your project request has been sent to Velora.</Text>

        <Text style={s.sectionTitle}>What happens now?</Text>
        <Text style={s.sectionBody}>Velora will contact Rahul with your project requirements and let you know when he responds.</Text>

        <View style={s.projectCard}>
          <Text style={s.projectCategory}>INTERIOR DESIGN</Text>
          <Text style={s.projectName}>3 BHK Home Interior</Text>
          <View style={s.projectMeta}>
            <Text style={s.projectMetaTxt}>👤 Rahul Sharma</Text>
            <Text style={s.projectMetaTxt}>📍 Hyderabad</Text>
          </View>
          <View style={s.statusBadge}>
            <Text style={s.statusBadgeTxt}>Waiting for response</Text>
          </View>
        </View>

        <View style={s.timeline}>
          {statusSteps.map((step, i) => (
            <View key={i} style={s.timelineRow}>
              <View style={[s.dot, step.done ? s.dotDone : step.active ? s.dotActive : s.dotPending]} />
              <View style={s.timelineContent}>
                <Text style={[s.timelineTitle, !step.done && !step.active && s.dimmed]}>{step.label}</Text>
                <Text style={[s.timelineDesc, !step.done && !step.active && s.dimmed]}>{step.desc}</Text>
              </View>
            </View>
          ))}
        </View>

        <View style={s.actions}>
          <PrimaryButton label="View Project Status →" onPress={() => router.replace('Projects')} />
          <SecondaryButton label="Back to Projects" onPress={() => router.replace('Projects')} />
        </View>
      </ScrollView>
    </View>
  )
}

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.background },
  content: { paddingHorizontal: spacing.pagePadding, paddingTop: 48, paddingBottom: 40, alignItems: 'center' },
  iconWrap: { marginBottom: 16 },
  iconCircle: { width: 64, height: 64, borderRadius: 32, backgroundColor: colors.cardBg, alignItems: 'center', justifyContent: 'center' },
  iconTxt: { fontSize: 28, color: colors.darkText },
  title: { fontFamily: fonts.heading, fontSize: 28, fontWeight: fontWeight.semibold, color: colors.darkText, marginBottom: 8, textAlign: 'center' },
  subtitle: { fontFamily: fonts.body, fontSize: fontSize.label, color: colors.mutedText, textAlign: 'center', marginBottom: spacing.xxl },
  sectionTitle: { fontFamily: fonts.heading, fontSize: fontSize.h3, fontWeight: fontWeight.semibold, color: colors.darkText, alignSelf: 'flex-start', marginBottom: 8 },
  sectionBody: { fontFamily: fonts.body, fontSize: fontSize.label, color: colors.mutedText, alignSelf: 'flex-start', marginBottom: spacing.xl },
  projectCard: { width: '100%', backgroundColor: colors.white, borderRadius: radii.md, padding: spacing.lg, marginBottom: spacing.xl, borderWidth: 1, borderColor: colors.border },
  projectCategory: { fontFamily: fonts.body, fontSize: fontSize.caption, color: colors.mutedText, letterSpacing: 0.6, textTransform: 'uppercase', marginBottom: 4 },
  projectName: { fontFamily: fonts.heading, fontSize: fontSize.h3, fontWeight: fontWeight.semibold, color: colors.darkText, marginBottom: 8 },
  projectMeta: { gap: 4, marginBottom: 12 },
  projectMetaTxt: { fontFamily: fonts.body, fontSize: fontSize.label, color: colors.mutedText },
  statusBadge: { backgroundColor: colors.cardBg, borderRadius: radii.round, paddingHorizontal: 12, paddingVertical: 4, alignSelf: 'flex-start' },
  statusBadgeTxt: { fontFamily: fonts.body, fontSize: fontSize.caption, color: colors.mutedText },
  timeline: { width: '100%', marginBottom: spacing.xl },
  timelineRow: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 16, gap: 12 },
  dot: { width: 14, height: 14, borderRadius: 7, marginTop: 3 },
  dotDone: { backgroundColor: colors.darkText },
  dotActive: { backgroundColor: colors.darkText, opacity: 0.5 },
  dotPending: { backgroundColor: colors.border },
  timelineContent: { flex: 1 },
  timelineTitle: { fontFamily: fonts.body, fontSize: fontSize.label, fontWeight: fontWeight.semibold, color: colors.darkText },
  timelineDesc: { fontFamily: fonts.body, fontSize: fontSize.caption, color: colors.mutedText, marginTop: 2 },
  dimmed: { opacity: 0.4 },
  actions: { width: '100%', gap: 12 },
})
