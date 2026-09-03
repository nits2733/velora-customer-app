import React, { useState } from 'react'
import {
  View,
  Text,
  Pressable,
  Image,
  Modal,
  ScrollView,
  StyleSheet,
} from 'react-native'
import { colors, fonts, fontSize, spacing } from '../theme/tokens'
import { useRouter } from '../navigation/router'
import { useAuth } from '../context/AuthContext'
import ConfirmModal from '../components/ConfirmModal'

type Props = {
  visible: boolean
  onClose: () => void
}

type MenuItem = {
  icon: string
  label: string
  action: () => void
}

export default function HamburgerMenu({ visible, onClose }: Props) {
  const router = useRouter()
  const auth = useAuth()
  const [showLogoutModal, setShowLogoutModal] = useState(false)

  const menuItems: MenuItem[] = [
    {
      icon: '🗺️',
      label: 'Work Map',
      action: () => { router.push('WorkMap'); onClose() },
    },
    {
      icon: '📋',
      label: 'My Quotations',
      action: () => { router.push('MyQuotations'); onClose() },
    },
    {
      icon: '🧮',
      label: 'Cost Calculator',
      action: () => { router.push('CostCalculator'); onClose() },
    },
    {
      icon: '📍',
      label: 'Locations We Serve',
      action: () => { router.push('Locations'); onClose() },
    },
    {
      icon: '🎧',
      label: 'Support',
      action: () => { router.push('Support'); onClose() },
    },
    {
      icon: '🔒',
      label: 'Privacy & Terms',
      action: () => { router.push('Privacy'); onClose() },
    },
  ]

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        {/* Dark overlay tap-to-close */}
        <Pressable style={styles.overlayTap} onPress={onClose} />

        {/* Menu panel */}
        <View style={styles.panel}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.logo}>Velora</Text>
            <Pressable onPress={onClose} style={styles.closeBtn} accessibilityLabel="Close menu">
              <Text style={styles.closeIcon}>✕</Text>
            </Pressable>
          </View>

          {/* User info */}
          <Pressable
            style={styles.userRow}
            onPress={() => { router.push('Profile'); onClose() }}
          >
            <Image source={{ uri: auth.avatarUrl || '/assets/4af4b.png' }} style={styles.avatar} alt={auth.user?.fullName || 'Guest'} />
            <View style={styles.userInfo}>
              <Text style={styles.userName}>{auth.user?.fullName || 'Guest'}</Text>
              <Text style={styles.userEmail}>
                {auth.user?.email || 'Log in to view your profile'}
              </Text>
            </View>
          </Pressable>

          <View style={styles.divider} />

          {/* Menu items */}
          <ScrollView showsVerticalScrollIndicator={false} style={styles.itemsContainer}>
            {menuItems.map((item, index) => (
              <Pressable
                key={index}
                onPress={item.action}
                style={({ pressed }: { pressed: boolean }) => [styles.menuItem, pressed && styles.menuItemPressed]}
              >
                <Text style={styles.menuIcon}>{item.icon}</Text>
                <Text style={styles.menuLabel}>{item.label}</Text>
                <Text style={styles.menuChevron}>›</Text>
              </Pressable>
            ))}

            <View style={styles.divider} />

            {auth.isAuthenticated ? (
              <>
                {/* Logout */}
                <Pressable
                  onPress={() => setShowLogoutModal(true)}
                  style={({ pressed }: { pressed: boolean }) => [styles.menuItem, pressed && styles.menuItemPressed]}
                >
                  <Text style={styles.menuIcon}>🚪</Text>
                  <Text style={[styles.menuLabel, styles.logoutLabel]}>Logout</Text>
                </Pressable>

                {/* Delete Account */}
                <Pressable
                  onPress={() => { router.push('DeleteAccount'); onClose() }}
                  style={({ pressed }: { pressed: boolean }) => [styles.menuItem, pressed && styles.menuItemPressed]}
                >
                  <Text style={styles.menuIcon}>🗑️</Text>
                  <Text style={[styles.menuLabel, styles.deleteLabel]}>Delete Account</Text>
                </Pressable>
              </>
            ) : (
              <Pressable
                onPress={() => { router.push('Login'); onClose() }}
                style={({ pressed }: { pressed: boolean }) => [styles.menuItem, pressed && styles.menuItemPressed]}
              >
                <Text style={styles.menuIcon}>🔑</Text>
                <Text style={styles.menuLabel}>Log In</Text>
              </Pressable>
            )}
          </ScrollView>
        </View>
      </View>

      {/* Logout confirm modal */}
      <ConfirmModal
        visible={showLogoutModal}
        title="Log out?"
        message="You will be returned to the login screen."
        confirmLabel="Log Out"
        danger
        onCancel={() => setShowLogoutModal(false)}
        onConfirm={async () => {
          setShowLogoutModal(false)
          onClose()
          await auth.logout()
          router.replace('Home')
        }}
      />
    </Modal>
  )
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: colors.overlay,
  },
  overlayTap: {
    flex: 1,
  },
  panel: {
    width: 300,
    backgroundColor: colors.white,
    paddingTop: spacing.xl,
    paddingBottom: spacing.xl,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.xl,
    marginBottom: spacing.xl,
  },
  logo: {
    fontSize: fontSize.h3,
    fontFamily: fonts.heading,
    color: colors.darkText,
    fontWeight: '700',
    letterSpacing: 1,
  },
  closeBtn: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeIcon: {
    fontSize: 18,
    color: colors.mutedText,
  },
  userRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.xl,
    gap: spacing.md,
    marginBottom: spacing.lg,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.border,
  },
  userInfo: {
    flex: 1,
    gap: spacing.xs,
  },
  userName: {
    fontSize: fontSize.body,
    fontFamily: fonts.body,
    color: colors.darkText,
    fontWeight: '600',
  },
  userEmail: {
    fontSize: fontSize.caption,
    fontFamily: fonts.body,
    color: colors.mutedText,
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: spacing.sm,
  },
  itemsContainer: {
    flex: 1,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    gap: spacing.md,
  },
  menuItemPressed: {
    backgroundColor: colors.cardBg,
  },
  menuIcon: {
    fontSize: 18,
    width: 26,
    textAlign: 'center',
  },
  menuLabel: {
    flex: 1,
    fontSize: fontSize.body,
    fontFamily: fonts.body,
    color: colors.darkText,
    fontWeight: '400',
  },
  menuChevron: {
    fontSize: 20,
    color: colors.mutedText,
  },
  logoutLabel: {
    color: colors.mutedText,
  },
  deleteLabel: {
    color: colors.error,
  },
})
