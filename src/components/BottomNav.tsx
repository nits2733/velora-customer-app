import React from 'react'
import { View, Text, Pressable, StyleSheet } from 'react-native'
import { colors, fonts, fontSize, radii, layout } from '../theme/tokens'

type Tab = 'Home' | 'Explore' | 'Services' | 'Projects'

type Props = {
  activeTab: Tab | null
  onTabPress: (tab: Tab) => void
}

function IconHome({ color }: { color: string }) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <path d="M4 11.5L12 4l8 7.5" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M6 10v9a1 1 0 001 1h10a1 1 0 001-1v-9" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function IconExplore({ color }: { color: string }) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="8.5" stroke={color} strokeWidth="1.8" />
      <path d="M15 9l-2 4.5L9 15l2-4.5L15 9z" stroke={color} strokeWidth="1.5" strokeLinejoin="round" fill="none" />
    </svg>
  )
}

function IconServices({ color }: { color: string }) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <rect x="4" y="4" width="7" height="7" rx="1.2" stroke={color} strokeWidth="1.8" />
      <rect x="13" y="4" width="7" height="7" rx="1.2" stroke={color} strokeWidth="1.8" />
      <rect x="4" y="13" width="7" height="7" rx="1.2" stroke={color} strokeWidth="1.8" />
      <rect x="13" y="13" width="7" height="7" rx="1.2" stroke={color} strokeWidth="1.8" />
    </svg>
  )
}

function IconProjects({ color }: { color: string }) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <rect x="3.5" y="8" width="17" height="11" rx="1.5" stroke={color} strokeWidth="1.8" />
      <path d="M8.5 8V6.5a1.5 1.5 0 011.5-1.5h4a1.5 1.5 0 011.5 1.5V8" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
      <path d="M3.5 12.5h17" stroke={color} strokeWidth="1.8" />
    </svg>
  )
}

const tabs: { key: Tab; label: string; Icon: (p: { color: string }) => React.ReactElement }[] = [
  { key: 'Home', label: 'Home', Icon: IconHome },
  { key: 'Explore', label: 'Explore', Icon: IconExplore },
  { key: 'Services', label: 'Services', Icon: IconServices },
  { key: 'Projects', label: 'Projects', Icon: IconProjects },
]

export default function BottomNav({ activeTab, onTabPress }: Props) {
  return (
    <View style={styles.container}>
      {tabs.map(({ key, label, Icon }) => {
        const active = activeTab === key
        return (
          <Pressable key={key} style={styles.tab} onPress={() => onTabPress(key)}>
            <View style={[styles.iconBadge, active && styles.iconBadgeActive]}>
              <Icon color={active ? colors.white : colors.mutedText} />
            </View>
            <Text style={[styles.label, active && styles.activeLabel]}>{label}</Text>
          </Pressable>
        )
      })}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    height: layout.bottomNavHeight,
    flexDirection: 'row',
    backgroundColor: colors.white,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 3,
  },
  iconBadge: {
    width: 32,
    height: 32,
    borderRadius: radii.round,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },
  iconBadgeActive: {
    backgroundColor: colors.darkText,
  },
  label: {
    fontSize: fontSize.caption,
    fontFamily: fonts.body,
    color: colors.mutedText,
  },
  activeLabel: {
    color: colors.darkText,
    fontWeight: '600',
  },
})
