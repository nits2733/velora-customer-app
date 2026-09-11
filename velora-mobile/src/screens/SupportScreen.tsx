import React from 'react'
import { View, Text, ScrollView, Pressable, Linking, StyleSheet } from 'react-native'
import { colors, fonts, fontSize, spacing, radii, fontWeight, shadows } from '../theme/tokens'
import { useRouter } from '../navigation/router'
import AppHeader from '../components/AppHeader'
import PrimaryButton from '../components/PrimaryButton'

export default function SupportScreen() {
  const router = useRouter()
  const options = [
    { icon: '💬', label: 'Chat on WhatsApp', desc: 'Get a quick response via WhatsApp', action: () => Linking.openURL('https://wa.me/918210827121') },
    { icon: '📞', label: 'Call Us', desc: '+91 82108 27121 · Mon–Sat, 9am–7pm', action: () => Linking.openURL('tel:+918210827121') },
    { icon: '✉️', label: 'Email Us', desc: 'support@velora.in · We reply within 24 hours', action: () => Linking.openURL('mailto:support@velora.in') },
  ]
  return (
    <View style={s.root}>
      <AppHeader title="Support" showBack onBack={() => router.back()} />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={s.content}>
        <Text style={s.title}>How can we{'\n'}help you?</Text>
        <Text style={s.subtitle}>Reach us through any of the channels below.</Text>
        {options.map((o) => (
          <Pressable key={o.label} style={s.card} onPress={o.action}>
            <Text style={s.cardIcon}>{o.icon}</Text>
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
      </ScrollView>
    </View>
  )
}
const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.background },
  content: { paddingHorizontal: spacing.pagePadding, paddingBottom: 40 },
  title: { fontFamily: fonts.heading, fontSize: 28, fontWeight: fontWeight.semibold, color: colors.darkText, marginTop: spacing.xl, marginBottom: 8, lineHeight: 36 },
  subtitle: { fontFamily: fonts.body, fontSize: fontSize.label, color: colors.mutedText, marginBottom: spacing.xl },
  card: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.white, borderRadius: radii.md, padding: spacing.lg, marginBottom: 12, ...shadows.sm },
  cardIcon: { fontSize: 24, marginRight: 12 },
  cardInfo: { flex: 1 },
  cardLabel: { fontFamily: fonts.body, fontSize: fontSize.label, fontWeight: fontWeight.semibold, color: colors.darkText, marginBottom: 2 },
  cardDesc: { fontFamily: fonts.body, fontSize: fontSize.caption, color: colors.mutedText },
  chevron: { fontSize: 20, color: colors.mutedText },
  hours: { backgroundColor: colors.cardBg, borderRadius: radii.md, padding: spacing.lg, marginTop: spacing.lg },
  hoursTitle: { fontFamily: fonts.body, fontSize: fontSize.label, fontWeight: fontWeight.semibold, color: colors.darkText, marginBottom: 8 },
  hoursText: { fontFamily: fonts.body, fontSize: fontSize.label, color: colors.mutedText, marginBottom: 4 },
})
