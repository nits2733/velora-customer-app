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
import { colors, fonts, fontSize, spacing, radii } from '../theme/tokens'
import { useRouter } from '../navigation/router'

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
            <Pressable onPress={onClose} style={styles.closeBtn}>
              <Text style={styles.closeIcon}>✕</Text>
            </Pressable>
          </View>

          {/* User info */}
          <View style={styles.userRow}>
            <Image source={{ uri: '/assets/4af4b.png' }} style={styles.avatar} />
            <View style={styles.userInfo}>
              <Text style={styles.userName}>Rahul Mehta</Text>
              <Text style={styles.userEmail}>rahul.mehta@gmail.com</Text>
            </View>
          </View>

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
          </ScrollView>
        </View>
      </View>

      {/* Logout confirm modal */}
      <Modal
        visible={showLogoutModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowLogoutModal(false)}
      >
        <View style={styles.confirmOverlay}>
          <View style={styles.confirmBox}>
            <Text style={styles.confirmTitle}>Log out?</Text>
            <Text style={styles.confirmText}>
              You will be returned to the login screen.
            </Text>
            <View style={styles.confirmButtons}>
              <Pressable
                onPress={() => setShowLogoutModal(false)}
                style={styles.confirmCancel}
              >
                <Text style={styles.confirmCancelText}>Cancel</Text>
              </Pressable>
              <Pressable
                onPress={() => {
                  setShowLogoutModal(false)
                  onClose()
                  router.replace('Home')
                }}
                style={styles.confirmLogout}
              >
                <Text style={styles.confirmLogoutText}>Log Out</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
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
    color: '#ef4444',
  },
  confirmOverlay: {
    flex: 1,
    backgroundColor: colors.overlay,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.xl,
  },
  confirmBox: {
    backgroundColor: colors.white,
    borderRadius: radii.lg,
    padding: spacing.xl,
    width: '100%',
    maxWidth: 320,
    gap: spacing.md,
  },
  confirmTitle: {
    fontSize: fontSize.h3,
    fontFamily: fonts.heading,
    color: colors.darkText,
    fontWeight: '700',
  },
  confirmText: {
    fontSize: fontSize.body,
    fontFamily: fonts.body,
    color: colors.mutedText,
    lineHeight: 22,
  },
  confirmButtons: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginTop: spacing.sm,
  },
  confirmCancel: {
    flex: 1,
    borderWidth: 1.5,
    borderColor: colors.border,
    paddingVertical: spacing.md,
    alignItems: 'center',
    borderRadius: radii.sm,
  },
  confirmCancelText: {
    fontSize: fontSize.body,
    fontFamily: fonts.body,
    color: colors.darkText,
    fontWeight: '500',
  },
  confirmLogout: {
    flex: 1,
    backgroundColor: colors.darkText,
    paddingVertical: spacing.md,
    alignItems: 'center',
    borderRadius: radii.sm,
  },
  confirmLogoutText: {
    fontSize: fontSize.body,
    fontFamily: fonts.body,
    color: colors.white,
    fontWeight: '600',
  },
})
