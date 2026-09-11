import React, { useEffect, useRef, useState } from 'react'
import {
  View,
  Text,
  Pressable,
  Animated,
  Modal,
  ScrollView,
  StyleSheet,
} from 'react-native'
import Svg, { Path, Circle, Rect, Line } from 'react-native-svg'
import { colors, fonts, fontSize, spacing, radii, shadows } from '../theme/tokens'
import { useRouter } from '../navigation/router'
import { useAuth } from '../context/AuthContext'
import ConfirmModal from '../components/ConfirmModal'
import Avatar from '../components/Avatar'

const PANEL_WIDTH = 300

type Props = {
  visible: boolean
  onClose: () => void
}

type IconComponent = (p: { color: string }) => React.ReactElement

type MenuItem = {
  Icon: IconComponent
  label: string
  action: () => void
}

function IconMap({ color }: { color: string }) {
  return (
    <Svg width={19} height={19} viewBox="0 0 24 24" fill="none">
      <Path d="M9 4L4 6v14l5-2 6 2 5-2V4l-5 2-6-2z" stroke={color} strokeWidth={1.7} strokeLinejoin="round" />
      <Path d="M9 4v14M15 6v14" stroke={color} strokeWidth={1.7} strokeLinejoin="round" />
    </Svg>
  )
}

function IconQuotation({ color }: { color: string }) {
  return (
    <Svg width={19} height={19} viewBox="0 0 24 24" fill="none">
      <Rect x={5} y={3} width={14} height={18} rx={1.5} stroke={color} strokeWidth={1.7} />
      <Path d="M8.5 8h7M8.5 12h7M8.5 16h4" stroke={color} strokeWidth={1.7} strokeLinecap="round" />
    </Svg>
  )
}

function IconCalculator({ color }: { color: string }) {
  return (
    <Svg width={19} height={19} viewBox="0 0 24 24" fill="none">
      <Rect x={5} y={3} width={14} height={18} rx={1.5} stroke={color} strokeWidth={1.7} />
      <Line x1={8} y1={7.5} x2={16} y2={7.5} stroke={color} strokeWidth={1.7} strokeLinecap="round" />
      <Circle cx={8.3} cy={12} r={0.9} fill={color} />
      <Circle cx={12} cy={12} r={0.9} fill={color} />
      <Circle cx={15.7} cy={12} r={0.9} fill={color} />
      <Circle cx={8.3} cy={16} r={0.9} fill={color} />
      <Circle cx={12} cy={16} r={0.9} fill={color} />
      <Circle cx={15.7} cy={16} r={0.9} fill={color} />
    </Svg>
  )
}

function IconLocation({ color }: { color: string }) {
  return (
    <Svg width={19} height={19} viewBox="0 0 24 24" fill="none">
      <Path d="M12 21s7-6.5 7-12a7 7 0 10-14 0c0 5.5 7 12 7 12z" stroke={color} strokeWidth={1.7} strokeLinejoin="round" />
      <Circle cx={12} cy={9} r={2.4} stroke={color} strokeWidth={1.7} />
    </Svg>
  )
}

function IconSupport({ color }: { color: string }) {
  return (
    <Svg width={19} height={19} viewBox="0 0 24 24" fill="none">
      <Path d="M4 13v-1a8 8 0 0116 0v1" stroke={color} strokeWidth={1.7} strokeLinecap="round" />
      <Rect x={3} y={13} width={4} height={6} rx={1.2} stroke={color} strokeWidth={1.7} />
      <Rect x={17} y={13} width={4} height={6} rx={1.2} stroke={color} strokeWidth={1.7} />
    </Svg>
  )
}

function IconPrivacy({ color }: { color: string }) {
  return (
    <Svg width={19} height={19} viewBox="0 0 24 24" fill="none">
      <Rect x={5} y={11} width={14} height={9} rx={1.5} stroke={color} strokeWidth={1.7} />
      <Path d="M8 11V7.5a4 4 0 018 0V11" stroke={color} strokeWidth={1.7} strokeLinecap="round" />
      <Circle cx={12} cy={15.2} r={1.3} fill={color} />
    </Svg>
  )
}

function IconLogout({ color }: { color: string }) {
  return (
    <Svg width={19} height={19} viewBox="0 0 24 24" fill="none">
      <Path d="M14 8V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2h6a2 2 0 002-2v-2" stroke={color} strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round" />
      <Path d="M10 12h11m0 0l-3.5-3.5M21 12l-3.5 3.5" stroke={color} strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  )
}

function IconDelete({ color }: { color: string }) {
  return (
    <Svg width={19} height={19} viewBox="0 0 24 24" fill="none">
      <Path d="M5 7h14M9 7V5a1 1 0 011-1h4a1 1 0 011 1v2" stroke={color} strokeWidth={1.7} strokeLinecap="round" />
      <Path d="M7 7l1 13a1.5 1.5 0 001.5 1.4h5a1.5 1.5 0 001.5-1.4l1-13" stroke={color} strokeWidth={1.7} strokeLinejoin="round" />
      <Path d="M10 11v6M14 11v6" stroke={color} strokeWidth={1.7} strokeLinecap="round" />
    </Svg>
  )
}

function IconKey({ color }: { color: string }) {
  return (
    <Svg width={19} height={19} viewBox="0 0 24 24" fill="none">
      <Circle cx={8} cy={15} r={3.3} stroke={color} strokeWidth={1.7} />
      <Path d="M10.3 12.7L19 4M19 4v3.5M19 4h-3.5" stroke={color} strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round" />
      <Path d="M15.5 7.5L17.5 9.5" stroke={color} strokeWidth={1.7} strokeLinecap="round" />
    </Svg>
  )
}

export default function HamburgerMenu({ visible, onClose }: Props) {
  const router = useRouter()
  const auth = useAuth()
  const [showLogoutModal, setShowLogoutModal] = useState(false)
  const [modalVisible, setModalVisible] = useState(visible)
  const translateX = useRef(new Animated.Value(-PANEL_WIDTH)).current

  useEffect(() => {
    if (visible) {
      setModalVisible(true)
      translateX.setValue(-PANEL_WIDTH)
      Animated.spring(translateX, { toValue: 0, useNativeDriver: true, speed: 16, bounciness: 4 }).start()
    } else {
      Animated.timing(translateX, { toValue: -PANEL_WIDTH, duration: 200, useNativeDriver: true }).start(({ finished }) => {
        if (finished) setModalVisible(false)
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible])

  const overlayOpacity = translateX.interpolate({
    inputRange: [-PANEL_WIDTH, 0],
    outputRange: [0, 1],
  })

  const menuItems: MenuItem[] = [
    {
      Icon: IconMap,
      label: 'Work Map',
      action: () => { router.push('WorkMap'); onClose() },
    },
    {
      Icon: IconQuotation,
      label: 'My Quotations',
      action: () => { router.push('MyQuotations'); onClose() },
    },
    {
      Icon: IconCalculator,
      label: 'Cost Calculator',
      action: () => { router.push('CostCalculator'); onClose() },
    },
    {
      Icon: IconLocation,
      label: 'Locations We Serve',
      action: () => { router.push('Locations'); onClose() },
    },
    {
      Icon: IconSupport,
      label: 'Support',
      action: () => { router.push('Support'); onClose() },
    },
    {
      Icon: IconPrivacy,
      label: 'Privacy & Terms',
      action: () => { router.push('Privacy'); onClose() },
    },
  ]

  return (
    <Modal
      visible={modalVisible}
      transparent
      animationType="none"
      onRequestClose={onClose}
    >
      <Animated.View style={[styles.overlay, { opacity: overlayOpacity }]}>
        {/* Menu panel - rendered first so its flex-row position is the left
            side of the screen; translateX then slides it in from off-screen
            left into that slot. */}
        <Animated.View style={[styles.panel, { transform: [{ translateX }] }]}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.logo}>Velora</Text>
            <Pressable onPress={onClose} style={styles.closeBtn} accessibilityLabel="Close menu" hitSlop={8}>
              <Svg width={16} height={16} viewBox="0 0 24 24" fill="none">
                <Path d="M5 5l14 14M19 5L5 19" stroke={colors.mutedText} strokeWidth={1.8} strokeLinecap="round" />
              </Svg>
            </Pressable>
          </View>

          {/* User info */}
          <Pressable
            style={({ pressed }: { pressed: boolean }) => [styles.userRow, pressed && styles.menuItemPressed]}
            onPress={() => { router.push('Profile'); onClose() }}
          >
            <View style={styles.avatarRing}>
              <Avatar uri={auth.avatarUrl} name={auth.user?.fullName || 'Guest'} size={48} />
            </View>
            <View style={styles.userInfo}>
              <Text style={styles.userName}>{auth.user?.fullName || 'Guest'}</Text>
              <Text style={styles.userEmail}>
                {auth.user?.email || 'Log in to view your profile'}
              </Text>
            </View>
            <Svg width={16} height={16} viewBox="0 0 24 24" fill="none">
              <Path d="M9 5l7 7-7 7" stroke={colors.mutedText} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" />
            </Svg>
          </Pressable>

          <View style={styles.divider} />

          {/* Menu items */}
          <ScrollView showsVerticalScrollIndicator={false} style={styles.itemsContainer}>
            {menuItems.map(({ Icon, label, action }, index) => (
              <Pressable
                key={index}
                onPress={action}
                style={({ pressed }: { pressed: boolean }) => [styles.menuItem, pressed && styles.menuItemPressed]}
              >
                <View style={styles.menuIconBadge}>
                  <Icon color={colors.darkText} />
                </View>
                <Text style={styles.menuLabel}>{label}</Text>
                <Svg width={15} height={15} viewBox="0 0 24 24" fill="none">
                  <Path d="M9 5l7 7-7 7" stroke={colors.mutedText} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" />
                </Svg>
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
                  <View style={styles.menuIconBadge}>
                    <IconLogout color={colors.mutedText} />
                  </View>
                  <Text style={[styles.menuLabel, styles.logoutLabel]}>Logout</Text>
                </Pressable>

                {/* Delete Account */}
                <Pressable
                  onPress={() => { router.push('DeleteAccount'); onClose() }}
                  style={({ pressed }: { pressed: boolean }) => [styles.menuItem, pressed && styles.menuItemPressed]}
                >
                  <View style={[styles.menuIconBadge, styles.menuIconBadgeDanger]}>
                    <IconDelete color={colors.error} />
                  </View>
                  <Text style={[styles.menuLabel, styles.deleteLabel]}>Delete Account</Text>
                </Pressable>
              </>
            ) : (
              <Pressable
                onPress={() => { router.push('Login'); onClose() }}
                style={({ pressed }: { pressed: boolean }) => [styles.menuItem, pressed && styles.menuItemPressed]}
              >
                <View style={[styles.menuIconBadge, styles.menuIconBadgeActive]}>
                  <IconKey color={colors.white} />
                </View>
                <Text style={[styles.menuLabel, styles.loginLabel]}>Log In</Text>
              </Pressable>
            )}
          </ScrollView>
        </Animated.View>

        {/* Dark overlay tap-to-close - fills the remaining space to the right of the panel */}
        <Pressable style={styles.overlayTap} onPress={onClose} />
      </Animated.View>

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
    width: PANEL_WIDTH,
    backgroundColor: colors.white,
    paddingTop: spacing.xl,
    paddingBottom: spacing.xl,
    ...shadows.lg,
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
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.cardBg,
  },
  userRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.sm,
    gap: spacing.md,
    marginBottom: spacing.md,
    borderRadius: radii.md,
  },
  avatarRing: {
    width: 54,
    height: 54,
    borderRadius: 27,
    borderWidth: 1.5,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
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
    paddingVertical: spacing.sm,
    gap: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.cardBg,
  },
  menuItemPressed: {
    backgroundColor: colors.cardBg,
  },
  menuIconBadge: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.cardBg,
  },
  menuIconBadgeDanger: {
    backgroundColor: '#fdeceb',
  },
  menuIconBadgeActive: {
    backgroundColor: colors.darkText,
  },
  menuLabel: {
    flex: 1,
    fontSize: fontSize.body,
    fontFamily: fonts.body,
    color: colors.darkText,
    fontWeight: '500',
  },
  logoutLabel: {
    color: colors.mutedText,
  },
  deleteLabel: {
    color: colors.error,
  },
  loginLabel: {
    color: colors.darkText,
    fontWeight: '600',
  },
})
