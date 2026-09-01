import React, { useState } from 'react'
import { View, Text, ScrollView, Pressable, Image, StyleSheet } from 'react-native'
import { colors, fonts, fontSize, spacing, radii, shadows, fontWeight } from '../theme/tokens'
import { useRouter } from '../navigation/router'
import PrimaryButton from '../components/PrimaryButton'
import SecondaryButton from '../components/SecondaryButton'

const ACTIVE = {
  id: '1',
  title: '3 BHK Home Renovation',
  location: 'Hyderabad',
  progress: 70,
  budget: '₹8.5L – ₹10L',
  professional: { name: 'Rahul Sharma', role: 'Interior Designer', rating: 4.8, initials: 'RS' },
  milestonesDone: 7,
  milestonesTotal: 10,
  image: '/assets/ab679.png',
  status: '# IN PROGRESS',
}

const UPCOMING = [
  { id: '2', title: 'Modern Kitchen Redesign', date: 'Starts in 2 weeks', status: 'PLANNING', image: '/assets/94bfe.png' },
  { id: '3', title: 'Balcony Extension', date: 'Starts next month', status: 'AWAITING APPROVAL', image: '/assets/89a8f.png' },
]

const COMPLETED = [
  { id: '4', title: 'Minimalist Studio', date: 'Completed Oct 2023', image: '/assets/0b7a9.png' },
  { id: '5', title: 'Luxury Bathroom', date: 'Completed Aug 2023', image: '/assets/f1c0e.png' },
]

type Tab = 'Active' | 'Upcoming' | 'Complete'

export default function ProjectsScreen() {
  const router = useRouter()
  const [tab, setTab] = useState<Tab>('Active')

  return (
    <View style={s.root}>
      {/* Header */}
      <View style={s.header}>
        <Text style={s.headerTitle}>Projects</Text>
        <View style={s.tabs}>
          {(['Active', 'Upcoming', 'Complete'] as Tab[]).map(t => (
            <Pressable key={t} style={[s.tab, tab === t && s.tabActive]} onPress={() => setTab(t)}>
              <Text style={[s.tabTxt, tab === t && s.tabTxtActive]}>{t}</Text>
            </Pressable>
          ))}
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={s.content}>

        {tab === 'Active' && (
          <>
            {/* Active project card with image */}
            <View style={s.activeCard}>
              <View style={s.activeImgWrap}>
                <Image source={{ uri: ACTIVE.image }} style={s.activeImg} />
                <View style={s.activeImgGrad} />
                <View style={s.activeStatusBadge}>
                  <Text style={s.activeStatusTxt}>{ACTIVE.status}</Text>
                </View>
              </View>
              <View style={s.activeBody}>
                <View style={s.activeMeta}>
                  <Text style={s.activeLoc}>📍 {ACTIVE.location}</Text>
                  <Text style={s.activeBudget}>{ACTIVE.budget}</Text>
                </View>
                <Text style={s.activeTitle}>{ACTIVE.title}</Text>

                {/* Professional row */}
                <View style={s.proRow}>
                  <View style={s.proAvatar}><Text style={s.proInitials}>{ACTIVE.professional.initials}</Text></View>
                  <View style={s.proInfo}>
                    <Text style={s.proName}>{ACTIVE.professional.name}</Text>
                    <Text style={s.proRole}>{ACTIVE.professional.role}</Text>
                  </View>
                  <View style={s.proRating}>
                    <Text style={s.proRatingTxt}>★ {ACTIVE.professional.rating}</Text>
                  </View>
                </View>

                {/* Progress */}
                <View style={s.progressSection}>
                  <Text style={s.progressLabel}>{ACTIVE.milestonesDone} of {ACTIVE.milestonesTotal} milestones completed</Text>
                  <View style={s.progressTrack}>
                    <View style={[s.progressFill, { width: `${ACTIVE.progress}%` as any }]} />
                  </View>
                  <Text style={s.progressPct}>{ACTIVE.progress}%</Text>
                </View>

                {/* Actions */}
                <View style={s.activeActions}>
                  <PrimaryButton label="View Project" onPress={() => router.push('ProjectDetail', { id: '1' })} />
                  <SecondaryButton label="Message Professional" onPress={() => {}} />
                </View>
              </View>
            </View>

            {/* Next up */}
            <View style={s.nextSection}>
              <Text style={s.sectionLabel}>Next up</Text>
              <View style={s.nextCard}>
                <View style={s.nextLeft}>
                  <Text style={s.nextIcon}>📋</Text>
                  <View>
                    <Text style={s.nextTitle}>Finalise Living Room Design</Text>
                    <Text style={s.nextDate}>🔴 Due tomorrow</Text>
                  </View>
                </View>
                <Pressable style={s.reviewBtn} onPress={() => router.push('ProjectDetail', { id: '1' })}>
                  <Text style={s.reviewBtnTxt}>Review</Text>
                </Pressable>
              </View>
            </View>
          </>
        )}

        {tab === 'Upcoming' && (
          <>
            <Text style={s.sectionLabel}>Upcoming Projects</Text>
            {UPCOMING.map(p => (
              <Pressable key={p.id} style={s.upcomingCard} onPress={() => router.push('ProjectDetail', { id: p.id })}>
                <View style={s.upcomingLeft}>
                  <Text style={s.upcomingTitle}>{p.title}</Text>
                  <Text style={s.upcomingDate}>{p.date}</Text>
                  <View style={s.statusPill}><Text style={s.statusPillTxt}>{p.status}</Text></View>
                </View>
                <Text style={s.upcomingArrow}>›</Text>
              </Pressable>
            ))}
          </>
        )}

        {tab === 'Complete' && (
          <>
            <Text style={s.sectionLabel}>Completed</Text>
            <View style={s.completedGrid}>
              {COMPLETED.map(p => (
                <Pressable key={p.id} style={s.completedCard} onPress={() => router.push('ProjectDetail', { id: p.id })}>
                  <Image source={{ uri: p.image }} style={s.completedImg} />
                  <View style={s.completedOverlay}>
                    <Text style={s.completedTitle}>{p.title}</Text>
                    <Text style={s.completedDate}>{p.date}</Text>
                  </View>
                </Pressable>
              ))}
            </View>

            {/* Ready to start something new */}
            <View style={s.newProjectBanner}>
              <Text style={s.newProjectTitle}>Ready to start{'\n'}something new?</Text>
              <Text style={s.newProjectSub}>Get a quotation and begin your next transformation.</Text>
              <PrimaryButton label="Book a New Project" onPress={() => router.push('StartProject')} />
            </View>
          </>
        )}

        {tab !== 'Complete' && (
          <View style={s.bookSection}>
            <PrimaryButton label="Book a New Project" onPress={() => router.push('StartProject')} />
          </View>
        )}

      </ScrollView>
    </View>
  )
}

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.background },
  header: { paddingHorizontal: spacing.xl, paddingTop: 16, paddingBottom: 0 },
  headerTitle: { fontFamily: fonts.heading, fontSize: 28, color: colors.darkText, fontWeight: fontWeight.semibold, marginBottom: 14 },
  tabs: { flexDirection: 'row', gap: 8, borderBottomWidth: 1, borderBottomColor: colors.border },
  tab: { paddingHorizontal: 14, paddingVertical: 10, borderBottomWidth: 2, borderBottomColor: 'transparent' },
  tabActive: { borderBottomColor: colors.darkText },
  tabTxt: { fontFamily: fonts.body, fontSize: fontSize.label, color: colors.mutedText, fontWeight: fontWeight.medium },
  tabTxtActive: { color: colors.darkText, fontWeight: fontWeight.bold },
  content: { paddingHorizontal: spacing.xl, paddingTop: spacing.xl, paddingBottom: 40, gap: spacing.lg },

  // Active project card
  activeCard: { backgroundColor: colors.white, borderRadius: radii.lg, overflow: 'hidden', borderWidth: 1, borderColor: colors.border, ...shadows.md },
  activeImgWrap: { height: 200, position: 'relative' },
  activeImg: { width: '100%', height: '100%', resizeMode: 'cover' },
  activeImgGrad: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.2)' },
  activeStatusBadge: { position: 'absolute', top: 12, left: 12, backgroundColor: 'rgba(0,0,0,0.6)', paddingHorizontal: 10, paddingVertical: 4, borderRadius: radii.round },
  activeStatusTxt: { fontFamily: fonts.body, fontSize: 10, color: colors.white, letterSpacing: 0.8 },
  activeBody: { padding: spacing.lg, gap: spacing.md },
  activeMeta: { flexDirection: 'row', justifyContent: 'space-between' },
  activeLoc: { fontFamily: fonts.body, fontSize: fontSize.caption, color: colors.mutedText },
  activeBudget: { fontFamily: fonts.body, fontSize: fontSize.caption, color: colors.mutedText },
  activeTitle: { fontFamily: fonts.heading, fontSize: 20, color: colors.darkText, fontWeight: fontWeight.semibold },
  proRow: { flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: colors.cardBg, borderRadius: radii.md, padding: 10 },
  proAvatar: { width: 36, height: 36, borderRadius: 18, backgroundColor: colors.darkText, alignItems: 'center', justifyContent: 'center' },
  proInitials: { fontFamily: fonts.body, fontSize: fontSize.caption, color: colors.white, fontWeight: fontWeight.bold },
  proInfo: { flex: 1 },
  proName: { fontFamily: fonts.body, fontSize: fontSize.label, color: colors.darkText, fontWeight: fontWeight.semibold },
  proRole: { fontFamily: fonts.body, fontSize: fontSize.caption, color: colors.mutedText },
  proRating: {},
  proRatingTxt: { fontFamily: fonts.body, fontSize: fontSize.caption, color: colors.darkText, fontWeight: fontWeight.semibold },
  progressSection: { gap: 4 },
  progressLabel: { fontFamily: fonts.body, fontSize: fontSize.caption, color: colors.mutedText },
  progressTrack: { height: 4, backgroundColor: colors.border, borderRadius: 2, overflow: 'hidden' },
  progressFill: { height: '100%', backgroundColor: colors.darkText },
  progressPct: { fontFamily: fonts.body, fontSize: fontSize.caption, color: colors.mutedText, textAlign: 'right' },
  activeActions: { gap: 8 },

  // Next up
  nextSection: { gap: 8 },
  sectionLabel: { fontFamily: fonts.body, fontSize: 11, color: colors.mutedText, letterSpacing: 1, textTransform: 'uppercase', fontWeight: fontWeight.semibold },
  nextCard: { backgroundColor: colors.white, borderRadius: radii.md, padding: spacing.lg, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', borderWidth: 1, borderColor: colors.border },
  nextLeft: { flexDirection: 'row', alignItems: 'center', gap: 10, flex: 1 },
  nextIcon: { fontSize: 20 },
  nextTitle: { fontFamily: fonts.body, fontSize: fontSize.label, color: colors.darkText, fontWeight: fontWeight.semibold },
  nextDate: { fontFamily: fonts.body, fontSize: fontSize.caption, color: colors.red, marginTop: 2 },
  reviewBtn: { borderWidth: 1, borderColor: colors.border, borderRadius: radii.md, paddingHorizontal: 12, paddingVertical: 6 },
  reviewBtnTxt: { fontFamily: fonts.body, fontSize: fontSize.caption, color: colors.darkText, fontWeight: fontWeight.semibold },

  // Upcoming
  upcomingCard: { backgroundColor: colors.white, borderRadius: radii.md, padding: spacing.lg, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', borderWidth: 1, borderColor: colors.border },
  upcomingLeft: { flex: 1, gap: 4 },
  upcomingTitle: { fontFamily: fonts.heading, fontSize: fontSize.body, color: colors.darkText, fontWeight: fontWeight.semibold },
  upcomingDate: { fontFamily: fonts.body, fontSize: fontSize.caption, color: colors.mutedText },
  statusPill: { backgroundColor: colors.cardBg, borderRadius: radii.round, paddingHorizontal: 8, paddingVertical: 3, alignSelf: 'flex-start' },
  statusPillTxt: { fontFamily: fonts.body, fontSize: 10, color: colors.mutedText, letterSpacing: 0.5 },
  upcomingArrow: { fontFamily: fonts.body, fontSize: 22, color: colors.mutedText },

  // Completed
  completedGrid: { flexDirection: 'row', gap: 10, flexWrap: 'wrap' },
  completedCard: { width: '47%', height: 130, borderRadius: radii.md, overflow: 'hidden', position: 'relative' },
  completedImg: { width: '100%', height: '100%', resizeMode: 'cover' },
  completedOverlay: { position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: 'rgba(0,0,0,0.55)', padding: 8 },
  completedTitle: { fontFamily: fonts.heading, fontSize: 13, color: colors.white, fontWeight: fontWeight.semibold },
  completedDate: { fontFamily: fonts.body, fontSize: 10, color: 'rgba(255,255,255,0.8)', marginTop: 2 },
  newProjectBanner: { backgroundColor: colors.cardBg, borderRadius: radii.md, padding: spacing.xl, gap: 8, borderWidth: 1, borderColor: colors.border },
  newProjectTitle: { fontFamily: fonts.heading, fontSize: 20, color: colors.darkText, fontWeight: fontWeight.semibold, lineHeight: 26 },
  newProjectSub: { fontFamily: fonts.body, fontSize: fontSize.label, color: colors.mutedText, marginBottom: 4 },

  bookSection: { marginTop: spacing.sm },
})
