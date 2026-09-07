import React, { useState } from 'react'
import { View, Text, ScrollView, Pressable, StyleSheet, TextInput } from 'react-native'
import { colors, fonts, fontSize, spacing, radii, fontWeight } from '../theme/tokens'
import { useRouter } from '../navigation/router'
import AppHeader from '../components/AppHeader'
import PrimaryButton from '../components/PrimaryButton'
import SecondaryButton from '../components/SecondaryButton'

export default function DeleteAccountScreen() {
  const router = useRouter()
  const [step, setStep] = useState<'confirm' | 'input' | 'done'>('confirm')
  const [input, setInput] = useState('')

  if (step === 'done') {
    return (
      <View style={[s.root, { alignItems: 'center', justifyContent: 'center', paddingHorizontal: spacing.pagePadding }]}>
        <Text style={s.doneIcon}>🗑️</Text>
        <Text style={s.doneTitle}>Account Deleted</Text>
        <Text style={s.doneSubtitle}>Your account has been permanently deleted. We are sorry to see you go.</Text>
        <Pressable style={s.doneBtn} onPress={() => router.replace('Home')}><Text style={s.doneBtnTxt}>Back to Home</Text></Pressable>
      </View>
    )
  }

  return (
    <View style={s.root}>
      <AppHeader title="Delete Account" showBack onBack={() => router.back()} />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={s.content}>
        <View style={s.warningBox}>
          <Text style={s.warningIcon}>⚠️</Text>
          <Text style={s.warningTitle}>This action is permanent</Text>
          <Text style={s.warningText}>Deleting your account will permanently remove all your data, including project history, quotations, and saved preferences. This cannot be undone.</Text>
        </View>

        <View style={s.listSection}>
          <Text style={s.listTitle}>What will be deleted:</Text>
          {['Your profile and account information', 'All project history and documents', 'Saved quotations and estimates', 'Communication history'].map((item) => (
            <Text key={item} style={s.listItem}>• {item}</Text>
          ))}
        </View>

        {step === 'input' && (
          <View style={s.inputSection}>
            <Text style={s.inputLabel}>Type DELETE to confirm</Text>
            <TextInput
              style={s.input}
              value={input}
              onChangeText={setInput}
              placeholder="DELETE"
              placeholderTextColor={colors.mutedText}
              autoCapitalize="characters"
            />
          </View>
        )}

        <View style={s.actions}>
          {step === 'confirm' ? (
            <PrimaryButton label="Continue to Delete" onPress={() => setStep('input')} />
          ) : (
            <Pressable
              style={[s.deleteBtn, input !== 'DELETE' && s.deleteBtnDisabled]}
              disabled={input !== 'DELETE'}
              onPress={() => setStep('done')}
            >
              <Text style={s.deleteBtnTxt}>Permanently Delete Account</Text>
            </Pressable>
          )}
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
  listSection: { marginTop: spacing.xl },
  listTitle: { fontFamily: fonts.body, fontSize: fontSize.label, fontWeight: fontWeight.semibold, color: colors.darkText, marginBottom: 8 },
  listItem: { fontFamily: fonts.body, fontSize: fontSize.label, color: colors.mutedText, marginBottom: 6 },
  inputSection: { marginTop: spacing.xl },
  inputLabel: { fontFamily: fonts.body, fontSize: fontSize.label, color: colors.darkText, marginBottom: 8 },
  input: { borderWidth: 1, borderColor: colors.border, borderRadius: radii.md, padding: 12, fontFamily: fonts.body, fontSize: fontSize.body, color: colors.darkText, letterSpacing: 2 },
  actions: { marginTop: spacing.xxl, gap: 12 },
  deleteBtn: { backgroundColor: colors.red, paddingVertical: 14, alignItems: 'center', borderRadius: radii.md },
  deleteBtnDisabled: { opacity: 0.4 },
  deleteBtnTxt: { fontFamily: fonts.body, fontSize: fontSize.label, fontWeight: fontWeight.semibold, color: colors.white, letterSpacing: 0.7 },
  doneIcon: { fontSize: 48, marginBottom: 16 },
  doneTitle: { fontFamily: fonts.heading, fontSize: 24, fontWeight: fontWeight.semibold, color: colors.darkText, marginBottom: 12, textAlign: 'center' },
  doneSubtitle: { fontFamily: fonts.body, fontSize: fontSize.label, color: colors.mutedText, textAlign: 'center', marginBottom: spacing.xxl, lineHeight: 22 },
  doneBtn: { backgroundColor: colors.darkText, paddingHorizontal: 32, paddingVertical: 14 },
  doneBtnTxt: { fontFamily: fonts.body, fontSize: fontSize.label, fontWeight: fontWeight.semibold, color: colors.white, letterSpacing: 0.7 },
})
