import React from 'react'
import { View, Text, Image, Pressable, ScrollView, StyleSheet } from 'react-native'
import { colors, fonts, fontSize, spacing, radii, shadows, fontWeight } from '../theme/tokens'
import { useRouter } from '../navigation/router'
import { useCart } from '../context/CartContext'

const SERVICES = [
  { name: 'Complete Interior', image: '/assets/18352.png' },
  { name: 'Painting', image: '/assets/3484d.png' },
  { name: 'Carpentry', image: '/assets/a4ca9.png' },
  { name: 'Electrical', image: '/assets/63616.png' },
  { name: 'Plumbing', image: '/assets/af52d.png' },
  { name: 'Tiling', image: '/assets/049f7.png' },
  { name: 'False Ceiling', image: '/assets/b9930.png' },
  { name: 'Plaster Work', image: '/assets/9986c.png' },
]

const TILE_W = (375 - 52) / 2

export default function ServicesScreen() {
  const router = useRouter()
  const { cartCount } = useCart()

  return (
    <View style={s.root}>
      {/* Header */}
      <View style={s.header}>
        <Text style={s.headerTitle}>Services</Text>
        <Text style={s.headerSub}>What does your home need?</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={s.content}>
        {/* Full Home Banner */}
        <Pressable style={s.banner} onPress={() => router.push('StartProject')}>
          <Image source={{ uri: '/assets/0a1c1.png' }} style={s.bannerImg} />
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

        {/* Individual Services */}
        <View style={s.section}>
          <View style={s.sectionHeadRow}>
            <Text style={s.sectionTitle}>Individual Services</Text>
            {cartCount > 0 && (
              <Pressable style={s.cartBadge} onPress={() => router.push('Cart')}>
                <Text style={s.cartBadgeTxt}>Cart ({cartCount})</Text>
              </Pressable>
            )}
          </View>
          <View style={s.grid}>
            {SERVICES.map((svc) => (
              <Pressable
                key={svc.name}
                style={s.tile}
                onPress={() => router.push('ServiceDetail', { name: svc.name, image: svc.image })}
              >
                <Image source={{ uri: svc.image }} style={s.tileImg} />
                <View style={s.tileFooter}>
                  <Text style={s.tileName}>{svc.name}</Text>
                  <Text style={s.tileArrow}>›</Text>
                </View>
              </Pressable>
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
  section: { padding: spacing.xl },
  sectionHeadRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: spacing.lg, paddingBottom: 10, borderBottomWidth: 1, borderBottomColor: colors.border },
  sectionTitle: { fontFamily: fonts.heading, fontSize: fontSize.h3, color: colors.darkText, fontWeight: fontWeight.semibold },
  cartBadge: { backgroundColor: colors.darkText, borderRadius: radii.round, paddingHorizontal: 12, paddingVertical: 4 },
  cartBadgeTxt: { fontFamily: fonts.body, fontSize: fontSize.caption, color: colors.white, fontWeight: fontWeight.semibold },
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
