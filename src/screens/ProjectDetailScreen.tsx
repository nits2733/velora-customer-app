import React from 'react'
import { View, Text, ScrollView, Pressable, Image, StyleSheet } from 'react-native'
import { colors, fonts, fontSize, spacing, radii, shadows } from '../theme/tokens'
import { useRouter } from '../navigation/router'
import PrimaryButton from '../components/PrimaryButton'

const milestones = [
  { label: 'Design', done: true },
  { label: 'Materials', done: true },
  { label: 'Execution', done: false, current: true },
  { label: 'Handover', done: false },
]

export default function ProjectDetailScreen() {
  const router = useRouter()
  const id = router.getParam('id') || '1'

  return (
    <View style={styles.root}>
      <ScrollView style={styles.scroll} contentContainerStyle={styles.content}>
        {/* Hero */}
        <View style={styles.heroWrap}>
          <Image source={{ uri: '/assets/95cf7.png' }} style={styles.hero} />
          <Pressable onPress={router.back} style={styles.backBtn}>
            <Text style={styles.backArrow}>←</Text>
          </Pressable>
        </View>

        {/* Body */}
        <View style={styles.body}>
          {/* Status + Title */}
          <View style={styles.statusRow}>
            <View style={styles.statusBadge}>
              <Text style={styles.statusText}>In Progress</Text>
            </View>
          </View>
          <Text style={styles.projectTitle}>Living Room Renovation</Text>

          {/* Timeline */}
          <Text style={styles.sectionHeading}>Progress Timeline</Text>
          <View style={styles.timeline}>
            {milestones.map((m, i) => (
              <View key={m.label} style={styles.milestoneRow}>
                <View style={styles.milestoneLeft}>
                  <View style={[
                    styles.dot,
                    m.done && styles.dotDone,
                    m.current && styles.dotCurrent,
                  ]} />
                  {i < milestones.length - 1 && (
                    <View style={[styles.line, m.done && styles.lineDone]} />
                  )}
                </View>
                <Text style={[
                  styles.milestoneLabel,
                  m.current && styles.milestoneCurrent,
                  m.done && styles.milestoneDone,
                ]}>
                  {m.label}
                  {m.current ? '  (Current)' : ''}
                </Text>
              </View>
            ))}
          </View>

          {/* Assigned Professional */}
          <Text style={styles.sectionHeading}>Assigned Professional</Text>
          <View style={styles.proCard}>
            <Image source={{ uri: '/assets/4af4b.png' }} style={styles.proAvatar} />
            <View style={styles.proInfo}>
              <Text style={styles.proName}>Arjun Sharma</Text>
              <Text style={styles.proRole}>Senior Interior Designer</Text>
              <Text style={styles.proRating}>4.9 ★</Text>
            </View>
          </View>

          {/* Maintenance */}
          <Text style={styles.sectionHeading}>Maintenance</Text>
          <View style={styles.infoCard}>
            <Text style={styles.infoText}>
              Post-project care includes periodic inspections, cleaning recommendations for materials used, and guidance on maintaining finishes to ensure longevity. Our team is available for follow-up visits within the first 30 days.
            </Text>
          </View>

          {/* Warranty */}
          <Text style={styles.sectionHeading}>Warranty</Text>
          <View style={styles.infoCard}>
            <Text style={styles.infoText}>12 months warranty on all workmanship</Text>
          </View>

          <View style={styles.ctaWrap}>
            <PrimaryButton label="Contact Professional" onPress={() => {}} />
          </View>
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
    paddingBottom: 40,
  },
  heroWrap: {
    position: 'relative',
    height: 220,
  },
  hero: {
    width: '100%',
    height: 220,
  },
  backBtn: {
    position: 'absolute',
    top: 48,
    left: spacing.xl,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.md,
  },
  backArrow: {
    fontSize: 18,
    color: colors.darkText,
    fontFamily: fonts.body,
  },
  body: {
    padding: spacing.xl,
    gap: spacing.md,
  },
  statusRow: {
    flexDirection: 'row',
  },
  statusBadge: {
    backgroundColor: '#dcfce7',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: radii.round,
  },
  statusText: {
    fontSize: fontSize.caption,
    fontFamily: fonts.body,
    color: '#15803d',
    fontWeight: '600',
  },
  projectTitle: {
    fontSize: fontSize.h2,
    fontFamily: fonts.heading,
    color: colors.darkText,
    fontWeight: '700',
    marginTop: spacing.xs,
  },
  sectionHeading: {
    fontSize: fontSize.label,
    fontFamily: fonts.body,
    color: colors.mutedText,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginTop: spacing.md,
  },
  timeline: {
    paddingLeft: spacing.sm,
    gap: 0,
  },
  milestoneRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.md,
    minHeight: 48,
  },
  milestoneLeft: {
    alignItems: 'center',
    width: 16,
  },
  dot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: colors.border,
    borderWidth: 2,
    borderColor: colors.mutedText,
    marginTop: 2,
  },
  dotDone: {
    backgroundColor: colors.green,
    borderColor: colors.green,
  },
  dotCurrent: {
    backgroundColor: colors.darkText,
    borderColor: colors.darkText,
  },
  line: {
    width: 2,
    flex: 1,
    backgroundColor: colors.border,
    marginTop: 2,
  },
  lineDone: {
    backgroundColor: colors.green,
  },
  milestoneLabel: {
    fontSize: fontSize.body,
    fontFamily: fonts.body,
    color: colors.mutedText,
    paddingTop: 0,
    flex: 1,
  },
  milestoneDone: {
    color: colors.darkText,
    fontWeight: '500',
  },
  milestoneCurrent: {
    color: colors.darkText,
    fontWeight: '700',
  },
  proCard: {
    flexDirection: 'row',
    backgroundColor: colors.cardBg2,
    borderRadius: radii.md,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
    gap: spacing.md,
    alignItems: 'center',
    ...shadows.sm,
  },
  proAvatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: colors.border,
  },
  proInfo: {
    flex: 1,
    gap: spacing.xs,
  },
  proName: {
    fontSize: fontSize.body,
    fontFamily: fonts.heading,
    color: colors.darkText,
    fontWeight: '600',
  },
  proRole: {
    fontSize: fontSize.caption,
    fontFamily: fonts.body,
    color: colors.mutedText,
  },
  proRating: {
    fontSize: fontSize.caption,
    fontFamily: fonts.body,
    color: '#b45309',
    fontWeight: '600',
  },
  infoCard: {
    backgroundColor: colors.cardBg,
    borderRadius: radii.md,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
  },
  infoText: {
    fontSize: fontSize.body,
    fontFamily: fonts.body,
    color: colors.mutedText,
    lineHeight: 24,
  },
  ctaWrap: {
    marginTop: spacing.xl,
  },
})
