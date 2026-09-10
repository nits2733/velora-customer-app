import React, { useEffect, useState } from 'react'
import { View, Text, ScrollView, Pressable, ActivityIndicator, StyleSheet } from 'react-native'
import * as ImagePicker from 'expo-image-picker'
import { colors, fonts, fontSize, spacing, radii, shadows } from '../theme/tokens'
import { useRouter } from '../navigation/router'
import { useAuth } from '../context/AuthContext'
import AppHeader from '../components/AppHeader'
import ConfirmModal from '../components/ConfirmModal'
import Avatar from '../components/Avatar'
import { userApi } from '../api/user'
import { uploadsApi } from '../api/uploads'
import { bookingsApi } from '../api/bookings'
import { quotationsApi } from '../api/quotations'
import { ApiError } from '../api/client'
import type { UserProfileResponse } from '../api/types'

const MAX_AVATAR_BYTES = 5 * 1024 * 1024

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

function formatMemberSince(createdAt: string): string {
  const d = new Date(createdAt)
  if (isNaN(d.getTime())) return ''
  return `Member since ${d.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}`
}

export default function ProfileScreen() {
  const router = useRouter()
  const auth = useAuth()
  const [showLogoutModal, setShowLogoutModal] = useState(false)
  const [profile, setProfile] = useState<UserProfileResponse | null>(null)
  const [uploadingAvatar, setUploadingAvatar] = useState(false)
  const [avatarError, setAvatarError] = useState('')

  const [stats, setStats] = useState<{ projects: number; quotations: number } | null>(null)

  useEffect(() => {
    userApi.getProfile()
      .then(setProfile)
      .catch(() => setProfile(null))
  }, [])

  useEffect(() => {
    bookingsApi.list(0, 100)
      .then(async page => {
        const results = await Promise.allSettled(
          page.content.map(b => quotationsApi.get(b.id))
        )
        const quotationsCount = results.filter(
          (r): r is PromiseFulfilledResult<Awaited<ReturnType<typeof quotationsApi.get>>> =>
            r.status === 'fulfilled' && r.value.status !== 'DRAFT'
        ).length

        setStats({ projects: page.totalElements, quotations: quotationsCount })
      })
      .catch(() => setStats({ projects: 0, quotations: 0 }))
  }, [])

  const displayName = profile?.fullName || auth.user?.fullName || 'Your Account'
  const displayEmail = profile?.email || auth.user?.email || ''

  const handlePickAvatar = async () => {
    setAvatarError('')
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync()
    if (!permission.granted) {
      setAvatarError('Photo library permission is required to change your avatar.')
      return
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.9,
    })
    if (result.canceled) return

    const asset = result.assets[0]
    if (asset.fileSize && asset.fileSize > MAX_AVATAR_BYTES) {
      setAvatarError('Image must be smaller than 5MB.')
      return
    }

    setAvatarError('')
    setUploadingAvatar(true)
    try {
      const { url } = await uploadsApi.upload(
        { uri: asset.uri, name: asset.fileName || 'avatar.jpg', type: asset.mimeType || 'image/jpeg' },
        'AVATAR'
      )
      const updated = await userApi.updateProfile({ avatarUrl: url })
      setProfile(updated)
      auth.updateAvatar(updated.avatarUrl || null)
    } catch (e) {
      setAvatarError(e instanceof ApiError ? 'Upload failed. Please try again.' : 'Something went wrong.')
    } finally {
      setUploadingAvatar(false)
    }
  }

  const handleSettingsPress = (route: string) => {
    if (route === '__logout__') {
      setShowLogoutModal(true)
    } else {
      router.push(route)
    }
  }

  const handleLogout = async () => {
    setShowLogoutModal(false)
    await auth.logout()
    router.replace('Home')
  }

  return (
    <View style={styles.root}>
      <AppHeader title="Profile" showBack onBack={() => router.back()} showHamburger={false} />

      <ScrollView style={styles.scroll} contentContainerStyle={styles.content}>
        {/* Profile header card */}
        <View style={styles.profileCard}>
          <Pressable onPress={handlePickAvatar} accessibilityLabel="Change profile photo" style={styles.avatarWrap}>
            <Avatar uri={profile?.avatarUrl} name={displayName} size={60} />
            <View style={styles.avatarEditBadge}>
              {uploadingAvatar ? (
                <ActivityIndicator size="small" color={colors.white} />
              ) : (
                <Text style={styles.avatarEditIcon}>✎</Text>
              )}
            </View>
          </Pressable>
          {avatarError ? <Text style={styles.avatarError}>{avatarError}</Text> : null}
          <Text style={styles.name}>{displayName}</Text>
          <Text style={styles.email}>{displayEmail}</Text>
          {profile?.createdAt && <Text style={styles.memberSince}>{formatMemberSince(profile.createdAt)}</Text>}
        </View>

        {/* Stats row */}
        <View style={styles.statsRow}>
          {[
            { label: 'Projects', value: stats?.projects },
            { label: 'Quotations', value: stats?.quotations },
          ].map((stat, i) => (
            <React.Fragment key={stat.label}>
              <View style={styles.statItem}>
                {stats ? (
                  <Text style={styles.statValue}>{stat.value}</Text>
                ) : (
                  <ActivityIndicator size="small" color={colors.darkText} />
                )}
                <Text style={styles.statLabel}>{stat.label}</Text>
              </View>
              {i < 1 && <View style={styles.statDivider} />}
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
      <ConfirmModal
        visible={showLogoutModal}
        title="Log Out?"
        message="Are you sure you want to log out of your account?"
        confirmLabel="Log Out"
        danger
        onCancel={() => setShowLogoutModal(false)}
        onConfirm={handleLogout}
      />
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
  avatarWrap: {
    width: 60,
    height: 60,
    marginBottom: spacing.xs,
    position: 'relative',
  },
  avatarEditBadge: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: colors.darkText,
    borderWidth: 2,
    borderColor: colors.cardBg2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarEditIcon: {
    fontSize: 11,
    color: colors.white,
  },
  avatarError: {
    fontSize: fontSize.caption,
    fontFamily: fonts.body,
    color: colors.error,
    textAlign: 'center',
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
    color: colors.error,
  },
  chevron: {
    fontSize: fontSize.body,
    color: colors.mutedText,
    fontFamily: fonts.body,
  },
})
