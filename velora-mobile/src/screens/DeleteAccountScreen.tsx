import React from 'react'
import { View, Text, ScrollView, StyleSheet } from 'react-native'
import { colors, fonts, fontSize, spacing, radii, fontWeight } from '../theme/tokens'
import { useRouter } from '../navigation/router'
import AppHeader from '../components/AppHeader'
import PrimaryButton from '../components/PrimaryButton'
import SecondaryButton from '../components/SecondaryButton'

export default function DeleteAccountScreen() {
  const router = useRouter()

  return (
    <View style={s.root}>
      <AppHeader title="Delete Account" showBack onBack={() => router.back()} />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={s.content}>
        <View style={s.warningBox}>
          <Text style={s.warningIcon}>⚠️</Text>
          <Text style={s.warningTitle}>Account deletion is not available in the app</Text>
          <Text style={s.warningText}>Your account and data have not been deleted. Contact Velora Support to request account deletion.</Text>
        </View>

        <View style={s.actions}>
          <PrimaryButton label="Contact Support" onPress={() => router.push('Support')} />
          <SecondaryButton label="Cancel" onPress={() => router.back()} />
        </View>
      </ScrollView>
    </View>
  )
}

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.background },
  content: { paddingHorizontal: spacing.pagePadding, paddingBottom: 40 },
  warningBox: { backgroundColor: '#FEF2F2', borderRadius: radii.md, padding: spacing.lg, marginTop: spacing.xl, borderWidth: 1, borderColor: '#FECACA', alignItems: 'center' },
  warningIcon: { fontSize: 32, marginBottom: 8 },
  warningTitle: { fontFamily: fonts.body, fontSize: 16, fontWeight: fontWeight.semibold, color: '#991B1B', marginBottom: 8, textAlign: 'center' },
  warningText: { fontFamily: fonts.body, fontSize: fontSize.label, color: '#7F1D1D', textAlign: 'center', lineHeight: 20 },
  actions: { marginTop: spacing.xxl, gap: 12 },
})
