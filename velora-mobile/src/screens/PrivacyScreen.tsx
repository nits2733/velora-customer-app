import React from 'react'
import { View, Text, ScrollView, StyleSheet } from 'react-native'
import { colors, fonts, fontSize, spacing, radii, fontWeight } from '../theme/tokens'
import { useRouter } from '../navigation/router'
import AppHeader from '../components/AppHeader'

const sections = [
  { title: '1. Information We Collect', body: 'We collect information you provide when creating an account, requesting services, or communicating with us. This includes your name, contact details, property information, and project preferences.' },
  { title: '2. How We Use Your Information', body: 'We use your information to provide and improve our services, match you with appropriate professionals, send service updates, and communicate important information about your projects.' },
  { title: '3. Information Sharing', body: 'We do not sell your personal information. We share your information only with professionals assigned to your projects and with service providers who help us operate our platform.' },
  { title: '4. Data Security', body: 'We implement industry-standard security measures to protect your personal information. However, no method of transmission over the internet is 100% secure.' },
  { title: '5. Your Rights', body: 'You have the right to access, correct, or delete your personal information. You may also opt out of marketing communications at any time.' },
  { title: '6. Contact Us', body: 'If you have questions about this Privacy Policy, please contact us at privacy@velora.in.' },
]

export default function PrivacyScreen() {
  const router = useRouter()
  const routeName = router.currentRoute.name
  const title = routeName === 'Terms' || router.getParam('type') === 'terms' ? 'Terms & Conditions' : 'Privacy Policy'
  return (
    <View style={s.root}>
      <AppHeader title={title} showBack onBack={() => router.back()} />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={s.content}>
        <Text style={s.lastUpdated}>Last updated: August 2026</Text>
        {sections.map((sec) => (
          <View key={sec.title} style={s.section}>
            <Text style={s.secTitle}>{sec.title}</Text>
            <Text style={s.secBody}>{sec.body}</Text>
          </View>
        ))}
      </ScrollView>
    </View>
  )
}
const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.background },
  content: { paddingHorizontal: spacing.pagePadding, paddingBottom: 40 },
  lastUpdated: { fontFamily: fonts.body, fontSize: fontSize.caption, color: colors.mutedText, marginTop: 16, marginBottom: 8 },
  section: { marginBottom: spacing.xl },
  secTitle: { fontFamily: fonts.body, fontSize: fontSize.label, fontWeight: fontWeight.semibold, color: colors.darkText, marginBottom: 6 },
  secBody: { fontFamily: fonts.body, fontSize: fontSize.label, color: colors.mutedText, lineHeight: 22 },
})
