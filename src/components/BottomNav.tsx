import React from 'react'
import { View, Text, Pressable, StyleSheet } from 'react-native'
import { colors, fonts, fontSize, layout } from '../theme/tokens'

type Tab = 'Home' | 'Explore' | 'Services' | 'Projects'

type Props = {
  activeTab: Tab
  onTabPress: (tab: Tab) => void
}

const tabs: { key: Tab; label: string; icon: string }[] = [
  { key: 'Home', label: 'Home', icon: '⌂' },
  { key: 'Explore', label: 'Explore', icon: '✦' },
  { key: 'Services', label: 'Services', icon: '◈' },
  { key: 'Projects', label: 'Projects', icon: '◉' },
]

export default function BottomNav({ activeTab, onTabPress }: Props) {
  return (
    <View style={styles.container}>
      {tabs.map(tab => (
        <Pressable key={tab.key} style={styles.tab} onPress={() => onTabPress(tab.key)}>
          <Text style={[styles.icon, activeTab === tab.key && styles.activeIcon]}>{tab.icon}</Text>
          <Text style={[styles.label, activeTab === tab.key && styles.activeLabel]}>{tab.label}</Text>
        </Pressable>
      ))}
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
    gap: 2,
  },
  icon: {
    fontSize: 18,
    color: colors.mutedText,
  },
  activeIcon: {
    color: colors.darkText,
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
