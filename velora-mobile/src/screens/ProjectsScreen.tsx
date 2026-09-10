import React, { useEffect, useState } from 'react'
import { View, Text, ScrollView, Pressable, ActivityIndicator, StyleSheet } from 'react-native'
import { colors, fonts, fontSize, spacing, radii, shadows, fontWeight, statusColors } from '../theme/tokens'
import { useRouter } from '../navigation/router'
import { useAuth } from '../context/AuthContext'
import AppHeader from '../components/AppHeader'
import PrimaryButton from '../components/PrimaryButton'
import SecondaryButton from '../components/SecondaryButton'
import SectionHeader from '../components/SectionHeader'
import FAQItem from '../components/FAQItem'
import EmptyState from '../components/EmptyState'
import { bookingsApi } from '../api/bookings'
import type { BookingResponse } from '../api/types'

const UPCOMING_STEPS = [
  { title: 'Assignment', desc: 'We match your project with the right professional.' },
  { title: 'Site visit', desc: 'A scheduled visit to confirm scope and measurements.' },
  { title: 'Work begins', desc: 'Once approved, your project moves to Active.' },
]

const PROJECT_FAQS = [
  { question: 'How do I request a maintenance visit?', answer: 'Every completed project includes a warranty period. Message your professional or contact Support to schedule a free maintenance visit within that window.' },
  { question: 'Can I change my assigned professional?', answer: "Yes — contact Support and we'll help reassign your project to another vetted professional, at no extra cost." },
  { question: 'How do I report an issue after completion?', answer: 'Open the project from the Complete tab and use Support to raise an issue — we cover workmanship under warranty for 12 months.' },
]

const PENDING_STATUSES = ['PENDING_ASSIGNMENT', 'PENDING']

function projectTitle(b: BookingResponse): string {
  return b.categoryName || b.portfolioItemTitle || (b.requestType === 'FULL_HOME_PROJECT' ? 'Full Home Project' : 'Service Request')
}

function formatDate(iso: string): string {
  const d = new Date(iso)
  if (isNaN(d.getTime())) return ''
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

function pendingLabel(status: string): string {
  return status === 'PENDING_ASSIGNMENT' ? 'AWAITING ASSIGNMENT' : 'PENDING'
}

type Tab = 'Active' | 'Upcoming' | 'Complete'

type Props = {
  onHamburger?: () => void
}

export default function ProjectsScreen({ onHamburger }: Props) {
  const router = useRouter()
  const auth = useAuth()
  const [tab, setTab] = useState<Tab>('Active')

  const [bookings, setBookings] = useState<BookingResponse[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!auth.isAuthenticated) {
      setBookings([])
      setLoading(false)
      return
    }
    setLoading(true)
    bookingsApi.list()
      .then(page => setBookings(page.content))
      .catch(() => setBookings([]))
      .finally(() => setLoading(false))
  }, [auth.isAuthenticated])

  const activeBookings = bookings.filter(b => b.status === 'CONFIRMED')
  const upcomingBookings = bookings.filter(b => PENDING_STATUSES.includes(b.status))
  const completedBookings = bookings.filter(b => b.status === 'COMPLETED')

  return (
    <View style={s.root}>
      <AppHeader onHamburger={onHamburger} />
      {/* Sub-header */}
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

        {loading ? (
          <View style={s.loadingWrap}>
            <ActivityIndicator color={colors.darkText} />
          </View>
        ) : (
          <>
            {tab === 'Active' && (
              activeBookings.length === 0 ? (
                <EmptyState
                  title="No active project"
                  subtitle="Once a project is confirmed, it'll show up here."
                  ctaLabel="Book a New Project"
                  onCta={() => router.push('StartProject')}
                />
              ) : (
                <View style={s.list}>
                  {activeBookings.map(b => (
                    <View key={b.id} style={s.activeCard}>
                      <View style={s.activeBody}>
                        <View style={s.activeMeta}>
                          {b.location && <Text style={s.activeLoc}>📍 {b.location}</Text>}
                          {b.budget != null && <Text style={s.activeBudget}>₹{b.budget.toLocaleString('en-IN')}</Text>}
                        </View>
                        <Text style={s.activeTitle}>{projectTitle(b)}</Text>
                        <Text style={s.activeDate}>Scheduled for {formatDate(b.scheduledAt)}</Text>

                        {b.professionalName ? (
                          <View style={s.proRow}>
                            <View style={s.proAvatar}>
                              <Text style={s.proInitials}>{b.professionalName.split(' ').map(w => w[0]).slice(0, 2).join('')}</Text>
                            </View>
                            <View style={s.proInfo}>
                              <Text style={s.proName}>{b.professionalName}</Text>
                              <Text style={s.proRole}>Assigned Professional</Text>
                            </View>
                          </View>
                        ) : (
                          <Text style={s.awaitingTxt}>Awaiting professional assignment</Text>
                        )}

                        <View style={s.activeActions}>
                          <PrimaryButton label="View Project" onPress={() => router.push('ProjectDetail', { id: String(b.id) })} />
                          <SecondaryButton label="Message Professional" onPress={() => router.push('Support')} />
                        </View>
                      </View>
                    </View>
                  ))}
                </View>
              )
            )}

            {tab === 'Upcoming' && (
              upcomingBookings.length === 0 ? (
                <EmptyState
                  title="No upcoming projects"
                  subtitle="Requests awaiting assignment or confirmation will show up here."
                  ctaLabel="Book a New Project"
                  onCta={() => router.push('StartProject')}
                />
              ) : (
                <>
                  <Text style={s.sectionLabel}>Upcoming Projects</Text>
                  {upcomingBookings.map(b => {
                    const sc = statusColors.pending
                    return (
                      <Pressable key={b.id} style={s.upcomingCard} onPress={() => router.push('ProjectDetail', { id: String(b.id) })}>
                        <View style={s.upcomingLeft}>
                          <Text style={s.upcomingTitle}>{projectTitle(b)}</Text>
                          <Text style={s.upcomingDate}>Scheduled for {formatDate(b.scheduledAt)}</Text>
                          <View style={[s.statusPill, { backgroundColor: sc.bg }]}>
                            <Text style={[s.statusPillTxt, { color: sc.text }]}>{pendingLabel(b.status)}</Text>
                          </View>
                        </View>
                        <Text style={s.upcomingArrow}>›</Text>
                      </Pressable>
                    )
                  })}
                </>
              )
            )}

            {tab === 'Upcoming' && (
              <View style={s.whatsNextSection}>
                <SectionHeader label="WHAT TO EXPECT" title="What Happens Next" />
                <View style={s.upcomingStepsList}>
                  {UPCOMING_STEPS.map((step, i) => (
                    <View key={step.title} style={s.stepRow}>
                      <View style={s.stepBadge}>
                        <Text style={s.stepBadgeTxt}>{i + 1}</Text>
                      </View>
                      <View style={s.stepInfo}>
                        <Text style={s.stepTitle}>{step.title}</Text>
                        <Text style={s.stepDesc}>{step.desc}</Text>
                      </View>
                    </View>
                  ))}
                </View>
              </View>
            )}

            {tab === 'Complete' && (
              <>
                {completedBookings.length === 0 ? (
                  <EmptyState
                    title="No completed projects yet"
                    subtitle="Finished projects will appear here."
                  />
                ) : (
                  <>
                    <Text style={s.sectionLabel}>Completed</Text>
                    <View style={s.completedList}>
                      {completedBookings.map(b => (
                        <Pressable key={b.id} style={s.completedCard} onPress={() => router.push('ProjectDetail', { id: String(b.id) })}>
                          <Text style={s.completedTitle}>{projectTitle(b)}</Text>
                          <Text style={s.completedDate}>Completed {formatDate(b.scheduledAt)}</Text>
                        </Pressable>
                      ))}
                    </View>
                  </>
                )}

                {/* Ready to start something new */}
                <View style={s.newProjectBanner}>
                  <Text style={s.newProjectTitle}>Ready to start{'\n'}something new?</Text>
                  <Text style={s.newProjectSub}>Get a quotation and begin your next transformation.</Text>
                  <PrimaryButton label="Book a New Project" onPress={() => router.push('StartProject')} />
                </View>
              </>
            )}

            {((tab === 'Active' && activeBookings.length > 0) || (tab === 'Upcoming' && upcomingBookings.length > 0)) && (
              <View style={s.bookSection}>
                <PrimaryButton label="Book a New Project" onPress={() => router.push('StartProject')} />
              </View>
            )}
          </>
        )}

        {/* FAQ */}
        <View style={s.faqSection}>
          <SectionHeader title="Frequently Asked Questions" />
          <View style={s.faqList}>
            {PROJECT_FAQS.map(faq => (
              <FAQItem key={faq.question} question={faq.question} answer={faq.answer} />
            ))}
          </View>
        </View>

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
  loadingWrap: { paddingVertical: spacing.section, alignItems: 'center' },

  list: { gap: spacing.lg },

  // Active project card
  activeCard: { backgroundColor: colors.white, borderRadius: radii.lg, overflow: 'hidden', borderWidth: 1, borderColor: colors.border, ...shadows.md },
  activeBody: { padding: spacing.lg, gap: spacing.md },
  activeMeta: { flexDirection: 'row', justifyContent: 'space-between' },
  activeLoc: { fontFamily: fonts.body, fontSize: fontSize.caption, color: colors.mutedText },
  activeBudget: { fontFamily: fonts.body, fontSize: fontSize.caption, color: colors.mutedText },
  activeTitle: { fontFamily: fonts.heading, fontSize: 20, color: colors.darkText, fontWeight: fontWeight.semibold },
  activeDate: { fontFamily: fonts.body, fontSize: fontSize.caption, color: colors.mutedText },
  awaitingTxt: { fontFamily: fonts.body, fontSize: fontSize.label, color: colors.mutedText, fontStyle: 'italic' },
  proRow: { flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: colors.cardBg, borderRadius: radii.md, padding: 10 },
  proAvatar: { width: 36, height: 36, borderRadius: 18, backgroundColor: colors.darkText, alignItems: 'center', justifyContent: 'center' },
  proInitials: { fontFamily: fonts.body, fontSize: fontSize.caption, color: colors.white, fontWeight: fontWeight.bold },
  proInfo: { flex: 1 },
  proName: { fontFamily: fonts.body, fontSize: fontSize.label, color: colors.darkText, fontWeight: fontWeight.semibold },
  proRole: { fontFamily: fonts.body, fontSize: fontSize.caption, color: colors.mutedText },
  activeActions: { gap: 8 },

  sectionLabel: { fontFamily: fonts.body, fontSize: 11, color: colors.mutedText, letterSpacing: 1, textTransform: 'uppercase', fontWeight: fontWeight.semibold },

  // Upcoming
  upcomingCard: { backgroundColor: colors.white, borderRadius: radii.md, padding: spacing.lg, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', borderWidth: 1, borderColor: colors.border },
  upcomingLeft: { flex: 1, gap: 4 },
  upcomingTitle: { fontFamily: fonts.heading, fontSize: fontSize.body, color: colors.darkText, fontWeight: fontWeight.semibold },
  upcomingDate: { fontFamily: fonts.body, fontSize: fontSize.caption, color: colors.mutedText },
  statusPill: { borderRadius: radii.round, paddingHorizontal: 8, paddingVertical: 3, alignSelf: 'flex-start' },
  statusPillTxt: { fontFamily: fonts.body, fontSize: 10, letterSpacing: 0.5, fontWeight: fontWeight.semibold },
  upcomingArrow: { fontFamily: fonts.body, fontSize: 22, color: colors.mutedText },
  whatsNextSection: { marginTop: spacing.md, gap: spacing.lg },
  upcomingStepsList: { gap: spacing.lg },
  stepRow: { flexDirection: 'row', gap: spacing.md, alignItems: 'flex-start' },
  stepBadge: { width: 28, height: 28, borderRadius: 14, backgroundColor: colors.darkText, alignItems: 'center', justifyContent: 'center' },
  stepBadgeTxt: { fontFamily: fonts.body, fontSize: fontSize.caption, color: colors.white, fontWeight: fontWeight.bold },
  stepInfo: { flex: 1, gap: 2 },
  stepTitle: { fontFamily: fonts.body, fontSize: fontSize.body, color: colors.darkText, fontWeight: fontWeight.semibold },
  stepDesc: { fontFamily: fonts.body, fontSize: fontSize.caption, color: colors.mutedText, lineHeight: 18 },

  // Completed
  completedList: { gap: spacing.sm },
  completedCard: { backgroundColor: colors.white, borderRadius: radii.md, padding: spacing.lg, borderWidth: 1, borderColor: colors.border, gap: 4 },
  completedTitle: { fontFamily: fonts.heading, fontSize: fontSize.body, color: colors.darkText, fontWeight: fontWeight.semibold },
  completedDate: { fontFamily: fonts.body, fontSize: fontSize.caption, color: colors.mutedText },
  newProjectBanner: { backgroundColor: colors.cardBg, borderRadius: radii.md, padding: spacing.xl, gap: 8, borderWidth: 1, borderColor: colors.border },
  newProjectTitle: { fontFamily: fonts.heading, fontSize: 20, color: colors.darkText, fontWeight: fontWeight.semibold, lineHeight: 26 },
  newProjectSub: { fontFamily: fonts.body, fontSize: fontSize.label, color: colors.mutedText, marginBottom: 4 },

  bookSection: { marginTop: spacing.sm },

  faqSection: { gap: spacing.lg, marginTop: spacing.md },
  faqList: { marginTop: -spacing.sm },
})
