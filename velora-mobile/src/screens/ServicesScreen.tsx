import React, { useEffect, useState } from 'react'
import { View, Text, Image, Pressable, ScrollView, ActivityIndicator, StyleSheet } from 'react-native'
import { colors, fonts, fontSize, spacing, radii, shadows, fontWeight } from '../theme/tokens'
import { useRouter } from '../navigation/router'
import { useCart } from '../context/CartContext'
import AppHeader from '../components/AppHeader'
import SectionHeader from '../components/SectionHeader'
import EmptyState from '../components/EmptyState'
import InspirationCard from '../components/InspirationCard'
import FAQItem from '../components/FAQItem'
import { categoriesApi } from '../api/categories'
import { portfolioApi } from '../api/portfolio'
import type { CategoryResponse, PortfolioItemSummaryResponse } from '../api/types'
import ImgPainting from '../../assets/images/3484d.png'
import ImgPlumbing from '../../assets/images/af52d.png'
import ImgElectrical from '../../assets/images/63616.png'
import ImgCarpentry from '../../assets/images/a4ca9.png'
import ImgFalseCeiling from '../../assets/images/b9930.png'
import ImgModularKitchen from '../../assets/images/18352.png'
import FALLBACK_IMAGE from '../../assets/images/9986c.png'
import ImgFullHomeBanner from '../../assets/images/0a1c1.png'

const SERVICE_IMAGES: Record<string, number> = {
  'Painting': ImgPainting,
  'Plumbing': ImgPlumbing,
  'Electrical': ImgElectrical,
  'Carpentry': ImgCarpentry,
  'False Ceiling': ImgFalseCeiling,
  'Modular Kitchen': ImgModularKitchen,
}

const TILE_W = (375 - 52) / 2

const STATS = [
  { value: '500+', label: 'Projects Delivered' },
  { value: '150+', label: 'Vetted Professionals' },
  { value: '4.8★', label: 'Average Rating' },
]

const HOW_IT_WORKS = [
  { step: '1', title: 'Choose a service', desc: 'Pick what your home needs and configure the details.' },
  { step: '2', title: 'Free site visit', desc: 'Our team visits to assess scope and confirm requirements.' },
  { step: '3', title: 'Get your quotation', desc: 'Receive an itemized quote and approve to get started.' },
]

const SERVICE_FAQS = [
  { question: 'Do you serve my area?', answer: "We're currently active across Hyderabad, including Banjara Hills, Jubilee Hills, Madhapur, Gachibowli, and more — check Locations We Serve for the full list." },
  { question: 'How are professionals matched to my project?', answer: 'We assign a vetted professional based on the service category, your location, and availability. You can view their profile and rating before work begins.' },
  { question: 'Is there a charge for the site visit?', answer: 'No — the initial site visit and quotation are completely free, with no obligation to proceed.' },
]

type Props = {
  onHamburger?: () => void
}

export default function ServicesScreen({ onHamburger }: Props) {
  const router = useRouter()
  const { cartCount } = useCart()

  const [services, setServices] = useState<CategoryResponse[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  const [inspiration, setInspiration] = useState<PortfolioItemSummaryResponse[]>([])

  useEffect(() => {
    setLoading(true)
    setError(false)
    categoriesApi.getAll()
      .then(all => setServices(all.filter(c => c.serviceGroup === 'INDIVIDUAL_SERVICE')))
      .catch(() => setError(true))
      .finally(() => setLoading(false))

    portfolioApi.search({ size: 10 })
      .then(page => setInspiration(page.content))
      .catch(() => setInspiration([]))
  }, [])

  return (
    <View style={s.root}>
      <AppHeader onHamburger={onHamburger} />
      {/* Sub-header */}
      <View style={s.header}>
        <Text style={s.headerTitle}>Services</Text>
        <Text style={s.headerSub}>What does your home need?</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={s.content}>
        {/* Full Home Banner */}
        <Pressable style={s.banner} onPress={() => router.push('StartProject')}>
          <Image source={ImgFullHomeBanner} style={s.bannerImg} alt="Full home project" />
          <View style={s.bannerGrad} />
          <View style={s.bannerContent}>
            <Text style={s.bannerLabel}>COMPLETE SOLUTION</Text>
            <Text style={s.bannerTitle}>Full Home Project</Text>
            <Text style={s.bannerSub}>Transform multiple spaces with one coordinated project.</Text>
            <View style={s.bannerBtn}>
              <Text style={s.bannerBtnTxt}>Start a Full Home Project →</Text>
            </View>
          </View>
        </Pressable>

        {/* Trust stats */}
        <View style={s.statsRow}>
          {STATS.map((stat, i) => (
            <React.Fragment key={stat.label}>
              <View style={s.statItem}>
                <Text style={s.statValue}>{stat.value}</Text>
                <Text style={s.statLabel}>{stat.label}</Text>
              </View>
              {i < STATS.length - 1 && <View style={s.statDivider} />}
            </React.Fragment>
          ))}
        </View>

        {/* Individual Services */}
        <View style={s.section}>
          <View style={s.sectionHeadRow}>
            <SectionHeader title="Individual Services" />
            {cartCount > 0 && (
              <Pressable style={s.cartBadge} onPress={() => router.push('Cart')}>
                <Text style={s.cartBadgeTxt}>Cart ({cartCount})</Text>
              </Pressable>
            )}
          </View>

          {loading ? (
            <View style={s.loadingWrap}>
              <ActivityIndicator color={colors.darkText} />
            </View>
          ) : error ? (
            <EmptyState
              title="Couldn't load services"
              subtitle="Check your connection and try again."
            />
          ) : (
            <View style={s.grid}>
              {services.map((svc) => {
                const image = SERVICE_IMAGES[svc.name] || FALLBACK_IMAGE
                return (
                  <Pressable
                    key={svc.id}
                    style={s.tile}
                    onPress={() => router.push('ServiceDetail', {
                      id: svc.id,
                      name: svc.name,
                      description: svc.description,
                      image,
                    })}
                  >
                    <Image source={image} style={s.tileImg} alt={svc.name} />
                    <View style={s.tileFooter}>
                      <Text style={s.tileName}>{svc.name}</Text>
                      <Text style={s.tileArrow}>›</Text>
                    </View>
                  </Pressable>
                )
              })}
            </View>
          )}
        </View>

        {/* How booking works */}
        <View style={s.section}>
          <SectionHeader label="THE PROCESS" title="How Booking Works" />
          <View style={s.stepsList}>
            {HOW_IT_WORKS.map((item, i) => (
              <View key={item.step} style={s.stepRow}>
                <View style={s.stepBadge}>
                  <Text style={s.stepBadgeTxt}>{item.step}</Text>
                </View>
                <View style={s.stepInfo}>
                  <Text style={s.stepTitle}>{item.title}</Text>
                  <Text style={s.stepDesc}>{item.desc}</Text>
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* Get inspired */}
        {inspiration.length > 0 && (
          <View style={s.section}>
            <SectionHeader label="NEED IDEAS FIRST?" title="Get Inspired" />
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={s.inspirationScroll}
            >
              {inspiration.map(item => (
                <InspirationCard
                  key={item.id}
                  title={item.title}
                  imageUri={item.coverImageUrl}
                  width={150}
                  height={190}
                  onPress={() => router.push('InspirationDetail', { id: item.id })}
                />
              ))}
            </ScrollView>
          </View>
        )}

        {/* FAQ */}
        <View style={s.section}>
          <SectionHeader title="Frequently Asked Questions" />
          <View style={s.faqList}>
            {SERVICE_FAQS.map(faq => (
              <FAQItem key={faq.question} question={faq.question} answer={faq.answer} />
            ))}
          </View>
        </View>
      </ScrollView>

      {/* Sticky cart button */}
      <View style={s.stickyCart}>
        <Pressable style={s.cartBtn} onPress={() => router.push('Cart')}>
          <Text style={s.cartBtnTxt}>
            {cartCount > 0 ? `View Cart · ${cartCount} ${cartCount === 1 ? 'service' : 'services'}` : 'Service Cart'}
          </Text>
          {cartCount > 0 && <View style={s.cartDot}><Text style={s.cartDotTxt}>{cartCount}</Text></View>}
        </Pressable>
      </View>
    </View>
  )
}

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.background },
  header: { paddingHorizontal: spacing.xl, paddingTop: 20, paddingBottom: 12, alignItems: 'center', borderBottomWidth: 1, borderBottomColor: colors.border },
  headerTitle: { fontFamily: fonts.heading, fontSize: fontSize.hero, color: colors.darkText, fontWeight: fontWeight.semibold },
  headerSub: { fontFamily: fonts.body, fontSize: fontSize.body, color: colors.mutedText, marginTop: 2 },
  content: { paddingBottom: 100 },
  banner: { marginHorizontal: spacing.xl, marginTop: spacing.xl, height: 260, borderRadius: radii.lg, overflow: 'hidden', position: 'relative', justifyContent: 'flex-end' },
  bannerImg: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, width: '100%', height: '100%', resizeMode: 'cover' },
  bannerGrad: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(28,27,27,0.65)' },
  bannerContent: { padding: spacing.xl },
  bannerLabel: { fontFamily: fonts.body, fontSize: 10, color: 'rgba(255,255,255,0.7)', letterSpacing: 1.2, textTransform: 'uppercase', marginBottom: 6 },
  bannerTitle: { fontFamily: fonts.heading, fontSize: 26, color: colors.white, fontWeight: fontWeight.semibold, marginBottom: 6 },
  bannerSub: { fontFamily: fonts.body, fontSize: fontSize.label, color: 'rgba(255,255,255,0.85)', lineHeight: 20, marginBottom: 14 },
  bannerBtn: { alignSelf: 'flex-start' },
  bannerBtnTxt: { fontFamily: fonts.body, fontSize: fontSize.label, color: colors.white, fontWeight: fontWeight.semibold, letterSpacing: 0.5 },
  statsRow: {
    flexDirection: 'row',
    marginHorizontal: spacing.xl,
    marginTop: spacing.xl,
    backgroundColor: colors.cardBg,
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: 'hidden',
  },
  statItem: { flex: 1, alignItems: 'center', paddingVertical: spacing.lg, gap: 4 },
  statValue: { fontFamily: fonts.heading, fontSize: fontSize.h3, color: colors.darkText, fontWeight: fontWeight.bold },
  statLabel: { fontFamily: fonts.body, fontSize: fontSize.caption, color: colors.mutedText, textAlign: 'center' },
  statDivider: { width: 1, backgroundColor: colors.border, marginVertical: spacing.md },
  section: { padding: spacing.xl, gap: spacing.lg },
  stepsList: { gap: spacing.lg },
  stepRow: { flexDirection: 'row', gap: spacing.md, alignItems: 'flex-start' },
  stepBadge: { width: 28, height: 28, borderRadius: 14, backgroundColor: colors.darkText, alignItems: 'center', justifyContent: 'center' },
  stepBadgeTxt: { fontFamily: fonts.body, fontSize: fontSize.caption, color: colors.white, fontWeight: fontWeight.bold },
  stepInfo: { flex: 1, gap: 2 },
  stepTitle: { fontFamily: fonts.body, fontSize: fontSize.body, color: colors.darkText, fontWeight: fontWeight.semibold },
  stepDesc: { fontFamily: fonts.body, fontSize: fontSize.caption, color: colors.mutedText, lineHeight: 18 },
  inspirationScroll: { gap: spacing.sm },
  faqList: { marginTop: -spacing.sm },
  sectionHeadRow: { flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: spacing.lg, paddingBottom: 10, borderBottomWidth: 1, borderBottomColor: colors.border },
  cartBadge: { backgroundColor: colors.darkText, borderRadius: radii.round, paddingHorizontal: 12, paddingVertical: 4 },
  cartBadgeTxt: { fontFamily: fonts.body, fontSize: fontSize.caption, color: colors.white, fontWeight: fontWeight.semibold },
  loadingWrap: { paddingVertical: spacing.section, alignItems: 'center' },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  tile: { width: TILE_W, backgroundColor: colors.cardBg2, borderRadius: radii.md, overflow: 'hidden', borderWidth: 1, borderColor: colors.border, ...shadows.sm },
  tileImg: { width: TILE_W, height: 130, resizeMode: 'cover' },
  tileFooter: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 10, paddingVertical: 8 },
  tileName: { fontFamily: fonts.body, fontSize: fontSize.label, color: colors.darkText, fontWeight: fontWeight.semibold, letterSpacing: 0.3, flex: 1 },
  tileArrow: { fontFamily: fonts.body, fontSize: 16, color: colors.mutedText },
  stickyCart: { position: 'absolute', bottom: 0, left: 0, right: 0, paddingHorizontal: spacing.xl, paddingBottom: 12, paddingTop: 8, backgroundColor: colors.background, borderTopWidth: 1, borderTopColor: colors.border },
  cartBtn: { backgroundColor: colors.black, paddingVertical: 15, alignItems: 'center', flexDirection: 'row', justifyContent: 'center', gap: 8 },
  cartBtnTxt: { fontFamily: fonts.body, fontSize: fontSize.label, color: colors.white, fontWeight: fontWeight.semibold, letterSpacing: 0.7 },
  cartDot: { backgroundColor: colors.white, borderRadius: radii.round, width: 20, height: 20, alignItems: 'center', justifyContent: 'center' },
  cartDotTxt: { fontFamily: fonts.body, fontSize: 10, color: colors.black, fontWeight: fontWeight.bold },
})
