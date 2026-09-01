import React, { useState } from 'react'
import { View, Text, ScrollView, Pressable, Image, StyleSheet, Modal } from 'react-native'
import { colors, fonts, fontSize, spacing, radii, shadows } from '../theme/tokens'
import { useRouter } from '../navigation/router'
import AppHeader from '../components/AppHeader'
import PrimaryButton from '../components/PrimaryButton'
import SecondaryButton from '../components/SecondaryButton'

const settingsItems = [
  { label: 'My Quotations', route: 'MyQuotations' },
  { label: 'My Projects', route: 'Projects' },
  { label: 'Cost Calculator', route: 'CostCalculator' },
  { label: 'Locations We Serve', route: 'Locations' },
  { label: 'Support', route: 'Support' },
  { label: 'Privacy Policy', route: 'Privacy' },
  { label: 'Terms & Conditions', route: 'Terms' },
  { label: 'Logout', route: '__logout__' },
  { label: 'Delete Account', route: 'DeleteAccount' },
]

export default function ProfileScreen() {
  const router = useRouter()
  const [showLogoutModal, setShowLogoutModal] = useState(false)

  const handleSettingsPress = (route: string) => {
    if (route === '__logout__') {
      setShowLogoutModal(true)
    } else {
      router.push(route)
    }
  }

  return (
    <View style={styles.root}>
      <AppHeader title="Profile" showHamburger={false} />

      <ScrollView style={styles.scroll} contentContainerStyle={styles.content}>
        {/* Profile header card */}
        <View style={styles.profileCard}>
          <Image source={{ uri: '/assets/4af4b.png' }} style={styles.avatar} />
          <Text style={styles.name}>Rahul Mehta</Text>
          <Text style={styles.email}>rahul.mehta@gmail.com</Text>
          <Text style={styles.memberSince}>Member since January 2025</Text>
        </View>

        {/* Stats row */}
        <View style={styles.statsRow}>
          {[
            { label: 'Projects', value: '4' },
            { label: 'Quotations', value: '7' },
            { label: 'Saved', value: '12' },
          ].map((stat, i) => (
            <React.Fragment key={stat.label}>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>{stat.value}</Text>
                <Text style={styles.statLabel}>{stat.label}</Text>
              </View>
              {i < 2 && <View style={styles.statDivider} />}
            </React.Fragment>
          ))}
        </View>

        {/* Settings list */}
        <View style={styles.settingsList}>
          {settingsItems.map((item, i) => (
            <Pressable
              key={item.label}
              onPress={() => handleSettingsPress(item.route)}
              style={({ pressed }: { pressed: boolean }) => [
                styles.settingsRow,
                i < settingsItems.length - 1 && styles.settingsRowBorder,
                pressed && styles.settingsRowPressed,
                item.route === '__logout__' && styles.logoutRow,
              ]}
            >
              <Text style={[
                styles.settingsLabel,
                item.route === '__logout__' && styles.logoutLabel,
              ]}>
                {item.label}
              </Text>
              <Text style={styles.chevron}>→</Text>
            </Pressable>
          ))}
        </View>
      </ScrollView>

      {/* Logout confirm modal */}
      <Modal
        visible={showLogoutModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowLogoutModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <Text style={styles.modalTitle}>Log Out?</Text>
            <Text style={styles.modalBody}>Are you sure you want to log out of your account?</Text>
            <View style={styles.modalActions}>
              <SecondaryButton
                label="Cancel"
                onPress={() => setShowLogoutModal(false)}
                style={styles.modalCancelBtn}
              />
              <PrimaryButton
                label="Log Out"
                onPress={() => {
                  setShowLogoutModal(false)
                  router.replace('Home')
                }}
                style={styles.modalConfirmBtn}
              />
            </View>
          </View>
        </View>
      </Modal>
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
    padding: spacing.xl,
    paddingBottom: 40,
    gap: spacing.lg,
  },
  profileCard: {
    backgroundColor: colors.cardBg2,
    borderRadius: radii.md,
    padding: spacing.xl,
    alignItems: 'center',
    gap: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
    ...shadows.sm,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: colors.border,
    marginBottom: spacing.xs,
  },
  name: {
    fontSize: fontSize.h3,
    fontFamily: fonts.heading,
    color: colors.darkText,
    fontWeight: '700',
  },
  email: {
    fontSize: fontSize.body,
    fontFamily: fonts.body,
    color: colors.mutedText,
  },
  memberSince: {
    fontSize: fontSize.caption,
    fontFamily: fonts.body,
    color: colors.mutedText,
  },
  statsRow: {
    flexDirection: 'row',
    backgroundColor: colors.cardBg,
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: 'hidden',
    ...shadows.sm,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: spacing.lg,
    gap: spacing.xs,
  },
  statValue: {
    fontSize: fontSize.h3,
    fontFamily: fonts.heading,
    color: colors.darkText,
    fontWeight: '700',
  },
  statLabel: {
    fontSize: fontSize.caption,
    fontFamily: fonts.body,
    color: colors.mutedText,
  },
  statDivider: {
    width: 1,
    backgroundColor: colors.border,
    marginVertical: spacing.md,
  },
  settingsList: {
    backgroundColor: colors.white,
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: 'hidden',
    ...shadows.sm,
  },
  settingsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.lg,
  },
  settingsRowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  settingsRowPressed: {
    backgroundColor: colors.cardBg,
  },
  logoutRow: {},
  settingsLabel: {
    fontSize: fontSize.body,
    fontFamily: fonts.body,
    color: colors.darkText,
    fontWeight: '400',
  },
  logoutLabel: {
    color: '#dc2626',
  },
  chevron: {
    fontSize: fontSize.body,
    color: colors.mutedText,
    fontFamily: fonts.body,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalBox: {
    backgroundColor: colors.white,
    borderRadius: radii.md,
    padding: spacing.xl,
    width: '80%',
    gap: spacing.lg,
    ...shadows.lg,
  },
  modalTitle: {
    fontSize: fontSize.h3,
    fontFamily: fonts.heading,
    color: colors.darkText,
    fontWeight: '700',
  },
  modalBody: {
    fontSize: fontSize.body,
    fontFamily: fonts.body,
    color: colors.mutedText,
    lineHeight: 22,
  },
  modalActions: {
    flexDirection: 'row',
    gap: spacing.md,
    marginTop: spacing.sm,
  },
  modalCancelBtn: {
    flex: 1,
  },
  modalConfirmBtn: {
    flex: 1,
    backgroundColor: '#dc2626',
  },
})
