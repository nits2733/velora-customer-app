import React, { useRef, useState, useEffect, useCallback } from 'react'
import {
  View,
  Text,
  ScrollView,
  Pressable,
  Image,
  StyleSheet,
  Linking,
  FlatList,
  NativeSyntheticEvent,
  NativeScrollEvent,
} from 'react-native'
import { colors, fonts, fontSize, spacing, radii, fontWeight, shadows } from '../theme/tokens'
import { useRouter } from '../navigation/router'
import { useAuth } from '../context/AuthContext'
import { bookingsApi } from '../api/bookings'
import type { BookingResponse } from '../api/types'
import AppHeader from '../components/AppHeader'
import InspirationCard from '../components/InspirationCard'
import SectionHeader from '../components/SectionHeader'
import FAQItem from '../components/FAQItem'
import FloatingWhatsApp from '../components/FloatingWhatsApp'
import PrimaryButton from '../components/PrimaryButton'
import SecondaryButton from '../components/SecondaryButton'

type Props = {
  onHamburger: () => void
}

const ACTIVE_OFFER = { title: '15% Off Painting', subtitle: 'On all interior painting services. Valid till Sep 30, 2026.' }

const SERVICES = [
  { id: 'complete-interior', title: 'Complete Interior', image: '/assets/45a7e.png' },
  { id: 'electrical', title: 'Electrical', image: '/assets/63616.png' },
  { id: 'plumbing', title: 'Plumbing', image: '/assets/8ac9e.png' },
  { id: 'carpentry', title: 'Carpentry', image: '/assets/a4ca9.png' },
  { id: 'painting', title: 'Painting', image: '/assets/3484d.png' },
  { id: 'tiling', title: 'Tiling', image: '/assets/049f7.png' },
  { id: 'false-ceiling', title: 'False Ceiling', image: '/assets/b9930.png' },
  { id: 'plaster-work', title: 'Plaster Work', image: '/assets/9986c.png' },
]

const INSPIRATIONS = [
  { id: '1', title: 'Modern Warm Home', image: '/assets/ab679.png' },
  { id: '2', title: 'Travertine Details', image: '/assets/5aa20.png' },
  { id: '3', title: 'Sanctuary Bath', image: '/assets/f1c0e.png' },
  { id: '4', title: 'Contemporary Living', image: '/assets/90052.png' },
  { id: '5', title: 'Minimalist Kitchen', image: '/assets/94bfe.png' },
  { id: '6', title: 'Warm Bedroom', image: '/assets/89a8f.png' },
]

const STEPS = [
  {
    num: '01',
    title: 'Tell us what you need',
    desc: 'Share your vision, space details, and preferences through our simple guided flow.',
  },
  {
    num: '02',
    title: 'Get matched & review proposal',
    desc: 'We match you with the right professional and share a detailed proposal for your approval.',
  },
  {
    num: '03',
    title: 'Contribute easily',
    desc: 'Sit back while our team executes your project with full transparency and regular updates.',
  },
]

const FAQS = [
  {
    q: 'How long does a typical interior project take?',
    a: 'Most projects take 4–12 weeks depending on scope. A single room may be done in a month; a full-home renovation can take up to 3 months.',
  },
  {
    q: 'Do you provide a cost breakdown before starting?',
    a: 'Yes. After the initial consultation we provide a detailed quote covering materials, labour, and design fees — no surprises.',
  },
  {
    q: 'Can I request only a single service like painting?',
    a: 'Absolutely. You can book any individual service without committing to a full interior package.',
  },
  {
    q: 'Do you offer a warranty on your work?',
    a: 'We provide a 1-year workmanship warranty on all completed projects. Material warranties follow the respective manufacturer terms.',
  },
  {
    q: 'Which areas do you currently serve?',
    a: 'We currently serve Hyderabad, including all major areas. Check Locations We Serve for the complete list.',
  },
]

const CARD_W = 148
const INSP_W = 200
const INSP_H = 240

export default function HomeScreen({ onHamburger }: Props) {
  const router = useRouter()
  const auth = useAuth()
  const firstName = auth.user?.fullName?.split(' ')[0]
  const avatarInitial = auth.user?.fullName?.trim()?.[0]?.toUpperCase()
  const carouselRef = useRef<any>(null)
  const [scrollX, setScrollX] = useState(0)
  const [paused, setPaused] = useState(false)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const [activeBooking, setActiveBooking] = useState<BookingResponse | null>(null)

  useEffect(() => {
    if (!auth.isAuthenticated) {
      setActiveBooking(null)
      return
    }
    bookingsApi.list()
      .then(page => setActiveBooking(page.content.find(b => b.status === 'CONFIRMED') || null))
      .catch(() => setActiveBooking(null))
  }, [auth.isAuthenticated])

  const startAutoScroll = useCallback(() => {
    intervalRef.current = setInterval(() => {
      setScrollX(prev => {
        const maxScroll = SERVICES.length * (CARD_W + 12)
        const next = prev + CARD_W + 12 > maxScroll ? 0 : prev + CARD_W + 12
        carouselRef.current?.scrollTo({ x: next, animated: true })
        return next
      })
    }, 2400)
  }, [])

  useEffect(() => {
    if (!paused) startAutoScroll()
    return () => { if (intervalRef.current) clearInterval(intervalRef.current) }
  }, [paused, startAutoScroll])

  const handleCarouselScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    setScrollX(e.nativeEvent.contentOffset.x)
  }

  return (
    <View style={s.root}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={s.page}>

        {/* ── Header ──────────────────────────────────── */}
        <View style={s.header}>
          <Pressable onPress={onHamburger} style={s.menuBtn}>
            <Text style={s.menuIcon}>☰</Text>
          </Pressable>
          <Text style={s.brandName}>VELORA</Text>
          <Pressable onPress={() => router.push('Profile')} style={s.profileBtn} accessibilityLabel="Profile">
            {auth.avatarUrl ? (
              <Image source={{ uri: auth.avatarUrl }} style={s.avatarImg} alt="Profile" />
            ) : (
              <View style={s.avatar}>
                <Text style={s.avatarTxt}>{avatarInitial || '👤'}</Text>
              </View>
            )}
          </Pressable>
        </View>

        {/* ── Hero ────────────────────────────────────── */}
        <View style={s.hero}>
          <Image source={{ uri: '/assets/419c8.png' }} style={s.heroImg} />
          <View style={s.heroGrad} />
          <View style={s.heroContent}>
            <Text style={s.heroGreeting}>{firstName ? `Hi, ${firstName}` : 'Hi there'}</Text>
            <Text style={s.heroTitle}>Design the home{'\n'}you want to live in.</Text>
            <Text style={s.heroSub}>From complete home transformations{'\n'}to the service you need today.</Text>
            <View style={s.heroBtns}>
              <Pressable style={s.heroBtn} onPress={() => router.push('StartProject')}>
                <Text style={s.heroBtnTxt}>Start a Full Home Project</Text>
              </Pressable>
              <Pressable style={s.heroBtnOutline} onPress={() => router.replace('Services')}>
                <Text style={s.heroBtnOutlineTxt}>Book a Service</Text>
              </Pressable>
            </View>
          </View>
        </View>

        {/* ── Active Project ───────────────────────────── */}
        {activeBooking && (
          <Pressable style={s.activeCard} onPress={() => router.push('ProjectDetail', { id: String(activeBooking.id) })}>
            <Text style={s.activeLabel}>● ACTIVE PROJECT</Text>
            <Text style={s.activeTitle}>
              {activeBooking.categoryName || activeBooking.portfolioItemTitle || 'Your Project'}
            </Text>
            <View style={s.progressRow}>
              <Text style={s.progressPct}>
                {activeBooking.professionalName ? `Assigned to ${activeBooking.professionalName}` : 'Awaiting assignment'}
              </Text>
              <Text style={s.viewProgress}>View Details →</Text>
            </View>
          </Pressable>
        )}

        {/* ── What are you looking for? ─────────────────── */}
        <View style={s.section}>
          <View style={s.sectionHead}>
            <Text style={s.sectionLabel}>WHAT WE DO</Text>
            <Text style={s.sectionTitle}>What are you{'\n'}looking for?</Text>
          </View>
          <Pressable style={s.choiceCard} onPress={() => router.push('StartProject')}>
            <Image source={{ uri: '/assets/74adb.png' }} style={s.choiceImg} />
            <View style={s.choiceGrad} />
            <View style={s.choiceContent}>
              <Text style={s.choiceTag}>FULL HOME PROJECT</Text>
              <Text style={s.choiceTitle}>Transform your{'\n'}entire home</Text>
            </View>
            <View style={s.choiceArrow}><Text style={s.choiceArrowTxt}>→</Text></View>
          </Pressable>
          <Pressable style={[s.choiceCard, { marginTop: 12 }]} onPress={() => router.replace('Services')}>
            <Image source={{ uri: '/assets/0b7a9.png' }} style={s.choiceImg} />
            <View style={s.choiceGrad} />
            <View style={s.choiceContent}>
              <Text style={s.choiceTag}>INDIVIDUAL SERVICE</Text>
              <Text style={s.choiceTitle}>Need something{'\n'}specific?</Text>
            </View>
            <View style={s.choiceArrow}><Text style={s.choiceArrowTxt}>→</Text></View>
          </Pressable>
        </View>

        {/* ── Services We Offer ─────────────────────────── */}
        <View style={[s.section, { paddingHorizontal: 0 }]}>
          <View style={s.sectionHead2}>
            <Text style={s.sectionLabel}>EXPLORE SERVICES</Text>
            <Text style={s.sectionTitle}>Everything your{'\n'}home needs.</Text>
          </View>
          <ScrollView
            ref={carouselRef}
            horizontal
            showsHorizontalScrollIndicator={false}
            scrollEventThrottle={16}
            onScroll={handleCarouselScroll}
            contentContainerStyle={s.carousel}
            onResponderGrant={() => { setPaused(true); if (intervalRef.current) clearInterval(intervalRef.current) }}
            onResponderRelease={() => setPaused(false)}
            onTouchStart={() => { setPaused(true); if (intervalRef.current) clearInterval(intervalRef.current) }}
            onTouchEnd={() => setPaused(false)}
          >
            {SERVICES.map((svc) => (
              <Pressable
                key={svc.id}
                style={s.svcCard}
                onPress={() => router.push('ServiceDetail', { name: svc.title, image: svc.image })}
              >
                <Image source={{ uri: svc.image }} style={s.svcImg} />
                <Text style={s.svcTitle}>{svc.title}</Text>
              </Pressable>
            ))}
          </ScrollView>
        </View>

        {/* ── Inspiration ───────────────────────────────── */}
        <View style={[s.section, { paddingHorizontal: 0 }]}>
          <View style={s.sectionHead2}>
            <Text style={s.sectionLabel}>GET INSPIRED</Text>
            <Text style={s.sectionTitle}>Spaces worth{'\n'}coming home to.</Text>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={s.carousel}>
            {INSPIRATIONS.map((insp) => (
              <Pressable
                key={insp.id}
                style={s.inspCard}
                onPress={() => router.replace('Explore')}
              >
                <Image source={{ uri: insp.image }} style={s.inspImg} />
                <View style={s.inspGrad} />
                <Text style={s.inspTitle}>{insp.title}</Text>
              </Pressable>
            ))}
          </ScrollView>
        </View>

        {/* ── From Idea to Reality ─────────────────────── */}
        <View style={[s.section, { paddingHorizontal: 0 }]}>
          <View style={s.sectionHead2}>
            <Text style={s.sectionLabel}>OUR PROCESS</Text>
            <Text style={s.sectionTitle}>From idea{'\n'}to reality.</Text>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={s.carousel}>
            {STEPS.map((step, i) => (
              <View key={step.num} style={s.stepCard}>
                <View style={s.stepRow}>
                  <View style={s.stepNumBox}><Text style={s.stepNum}>{step.num}</Text></View>
                  {i < STEPS.length - 1 && <View style={s.stepLine} />}
                </View>
                <Text style={s.stepTitle}>{step.title}</Text>
                <Text style={s.stepDesc}>{step.desc}</Text>
              </View>
            ))}
          </ScrollView>
        </View>

        {/* ── Offer ─────────────────────────────────────── */}
        {ACTIVE_OFFER && (
          <View style={s.offerBand}>
            <View style={s.offerLeft}>
              <Text style={s.offerTag}>LIMITED OFFER</Text>
              <Text style={s.offerTitle}>{ACTIVE_OFFER.title}</Text>
              <Text style={s.offerSub}>{ACTIVE_OFFER.subtitle}</Text>
            </View>
            <Pressable style={s.offerBtn} onPress={() => router.replace('Services')}>
              <Text style={s.offerBtnTxt}>Claim →</Text>
            </Pressable>
          </View>
        )}

        {/* ── FAQ ───────────────────────────────────────── */}
        <View style={s.section}>
          <Text style={s.sectionLabel}>HELP</Text>
          <Text style={s.sectionTitle}>Frequently asked{'\n'}questions.</Text>
          <View style={s.faqList}>
            {FAQS.map((faq) => (
              <FAQItem key={faq.q} question={faq.q} answer={faq.a} />
            ))}
          </View>
        </View>

        {/* ── Support ───────────────────────────────────── */}
        <View style={s.supportCard}>
          <Text style={s.supportTitle}>Still have questions?</Text>
          <Text style={s.supportSub}>Our team is available Monday–Saturday, 9am–7pm.</Text>
          <View style={s.supportBtns}>
            <PrimaryButton label="Call Us" onPress={() => Linking.openURL('tel:+919876543210')} style={s.supportBtn} />
            <SecondaryButton label="WhatsApp" onPress={() => Linking.openURL('https://wa.me/919876543210')} style={s.supportBtn} />
          </View>
        </View>

        <View style={{ height: 32 }} />
      </ScrollView>

      <FloatingWhatsApp />
    </View>
  )
}

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.background },
  page: { paddingBottom: 16 },

  // Header
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: spacing.xl, paddingTop: 14, paddingBottom: 10 },
  menuBtn: { padding: 4 },
  menuIcon: { fontSize: 20, color: colors.darkText },
  brandName: { fontFamily: fonts.heading, fontSize: 22, fontWeight: fontWeight.bold, color: colors.darkText, letterSpacing: 2 },
  profileBtn: { padding: 4 },
  avatar: { width: 34, height: 34, borderRadius: 17, backgroundColor: colors.darkText, alignItems: 'center', justifyContent: 'center' },
  avatarTxt: { fontFamily: fonts.heading, fontSize: 14, color: colors.white, fontWeight: fontWeight.semibold },
  avatarImg: { width: 34, height: 34, borderRadius: 17 },

  // Hero
  hero: { height: 380, position: 'relative', justifyContent: 'flex-end' },
  heroImg: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, width: '100%', height: '100%', resizeMode: 'cover' },
  heroGrad: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.45)' },
  heroContent: { padding: spacing.xl, gap: 6 },
  heroGreeting: { fontFamily: fonts.body, fontSize: fontSize.label, color: 'rgba(255,255,255,0.8)', letterSpacing: 0.5 },
  heroTitle: { fontFamily: fonts.heading, fontSize: 34, color: colors.white, fontWeight: fontWeight.semibold, lineHeight: 42 },
  heroSub: { fontFamily: fonts.body, fontSize: 15, color: 'rgba(255,255,255,0.85)', lineHeight: 22, marginBottom: 8 },
  heroBtns: { gap: 10 },
  heroBtn: { backgroundColor: colors.black, paddingVertical: 14, alignItems: 'center', borderRadius: radii.md },
  heroBtnTxt: { fontFamily: fonts.body, fontSize: fontSize.label, color: colors.white, fontWeight: fontWeight.semibold, letterSpacing: 0.7 },
  heroBtnOutline: { borderWidth: 1, borderColor: 'rgba(255,255,255,0.4)', paddingVertical: 14, alignItems: 'center', borderRadius: radii.md, backgroundColor: 'rgba(255,255,255,0.1)' },
  heroBtnOutlineTxt: { fontFamily: fonts.body, fontSize: fontSize.label, color: colors.white, fontWeight: fontWeight.semibold, letterSpacing: 0.7 },

  // Active project
  activeCard: { backgroundColor: colors.cardBg2, marginHorizontal: spacing.xl, marginTop: spacing.xl, marginBottom: spacing.sm, padding: spacing.lg, borderRadius: radii.md, borderWidth: 1, borderColor: colors.border },
  activeLabel: { fontFamily: fonts.body, fontSize: 10, color: colors.green, letterSpacing: 1.2, textTransform: 'uppercase', fontWeight: fontWeight.semibold, marginBottom: 6 },
  activeTitle: { fontFamily: fonts.heading, fontSize: 20, color: colors.darkText, fontWeight: fontWeight.semibold, marginBottom: 10 },
  progressRow: { flexDirection: 'row', justifyContent: 'space-between' },
  progressPct: { fontFamily: fonts.body, fontSize: fontSize.caption, color: colors.mutedText },
  viewProgress: { fontFamily: fonts.body, fontSize: fontSize.caption, color: colors.darkText, fontWeight: fontWeight.semibold },

  // Sections
  section: { paddingHorizontal: spacing.xl, paddingTop: spacing.section },
  sectionHead: { marginBottom: spacing.lg },
  sectionHead2: { paddingHorizontal: spacing.xl, marginBottom: spacing.lg },
  sectionLabel: { fontFamily: fonts.body, fontSize: 10, color: colors.mutedText, letterSpacing: 1.2, textTransform: 'uppercase', fontWeight: fontWeight.medium, marginBottom: 6 },
  sectionTitle: { fontFamily: fonts.heading, fontSize: 28, color: colors.darkText, fontWeight: fontWeight.semibold, lineHeight: 36 },

  // Choice cards (stacked full width)
  choiceCard: { height: 200, borderRadius: radii.md, overflow: 'hidden', position: 'relative', justifyContent: 'flex-end' },
  choiceImg: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, width: '100%', height: '100%', resizeMode: 'cover' },
  choiceGrad: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)' },
  choiceContent: { padding: spacing.xl },
  choiceTag: { fontFamily: fonts.body, fontSize: 10, color: 'rgba(255,255,255,0.75)', letterSpacing: 1, textTransform: 'uppercase', marginBottom: 4 },
  choiceTitle: { fontFamily: fonts.heading, fontSize: 22, color: colors.white, fontWeight: fontWeight.semibold, lineHeight: 28 },
  choiceArrow: { position: 'absolute', right: 20, bottom: 20, backgroundColor: 'rgba(255,255,255,0.2)', width: 36, height: 36, borderRadius: radii.xl, alignItems: 'center', justifyContent: 'center' },
  choiceArrowTxt: { fontFamily: fonts.body, fontSize: 16, color: colors.white },

  // Carousel
  carousel: { paddingHorizontal: spacing.xl, gap: 12 },

  // Service card
  svcCard: { width: CARD_W, backgroundColor: colors.cardBg2, borderRadius: radii.md, overflow: 'hidden', borderWidth: 1, borderColor: colors.border },
  svcImg: { width: CARD_W, height: 130, resizeMode: 'cover' },
  svcTitle: { fontFamily: fonts.body, fontSize: fontSize.label, color: colors.darkText, fontWeight: fontWeight.semibold, padding: 10, letterSpacing: 0.3 },

  // Inspiration card
  inspCard: { width: INSP_W, height: INSP_H, borderRadius: radii.md, overflow: 'hidden', position: 'relative', justifyContent: 'flex-end' },
  inspImg: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, width: '100%', height: '100%', resizeMode: 'cover' },
  inspGrad: { position: 'absolute', bottom: 0, left: 0, right: 0, height: 100, backgroundColor: 'rgba(0,0,0,0.55)' },
  inspTitle: { fontFamily: fonts.heading, fontSize: 16, color: colors.white, fontWeight: fontWeight.semibold, padding: 12 },

  // Steps
  stepCard: { width: 200, backgroundColor: colors.cardBg, borderRadius: radii.md, padding: spacing.lg, borderWidth: 1, borderColor: colors.border },
  stepRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  stepNumBox: { width: 36, height: 36, borderRadius: 18, backgroundColor: colors.darkText, alignItems: 'center', justifyContent: 'center' },
  stepNum: { fontFamily: fonts.body, fontSize: fontSize.caption, color: colors.white, fontWeight: fontWeight.bold, letterSpacing: 1 },
  stepLine: { flex: 1, height: 1, backgroundColor: colors.border, marginLeft: 8 },
  stepTitle: { fontFamily: fonts.heading, fontSize: 15, color: colors.darkText, fontWeight: fontWeight.semibold, lineHeight: 21, marginBottom: 6 },
  stepDesc: { fontFamily: fonts.body, fontSize: fontSize.caption, color: colors.mutedText, lineHeight: 18 },

  // Offer
  offerBand: { marginHorizontal: spacing.xl, marginTop: spacing.section, backgroundColor: colors.darkText, borderRadius: radii.md, padding: spacing.xl, flexDirection: 'row', alignItems: 'center', gap: 12 },
  offerLeft: { flex: 1 },
  offerTag: { fontFamily: fonts.body, fontSize: 10, color: 'rgba(255,255,255,0.6)', letterSpacing: 1.2, textTransform: 'uppercase', marginBottom: 4 },
  offerTitle: { fontFamily: fonts.heading, fontSize: 18, color: colors.white, fontWeight: fontWeight.semibold, marginBottom: 4 },
  offerSub: { fontFamily: fonts.body, fontSize: fontSize.caption, color: 'rgba(255,255,255,0.7)', lineHeight: 18 },
  offerBtn: { backgroundColor: 'rgba(255,255,255,0.15)', borderRadius: radii.md, paddingHorizontal: 16, paddingVertical: 10 },
  offerBtnTxt: { fontFamily: fonts.body, fontSize: fontSize.label, color: colors.white, fontWeight: fontWeight.semibold },

  // FAQ
  faqList: { marginTop: spacing.lg, borderTopWidth: 1, borderTopColor: colors.border },

  // Support
  supportCard: { marginHorizontal: spacing.xl, marginTop: spacing.section, backgroundColor: colors.cardBg, borderRadius: radii.md, padding: spacing.xl, borderWidth: 1, borderColor: colors.border },
  supportTitle: { fontFamily: fonts.heading, fontSize: 20, color: colors.darkText, fontWeight: fontWeight.semibold, marginBottom: 6 },
  supportSub: { fontFamily: fonts.body, fontSize: fontSize.label, color: colors.mutedText, marginBottom: spacing.lg, lineHeight: 20 },
  supportBtns: { flexDirection: 'row', gap: 10 },
  supportBtn: { flex: 1 },
})
