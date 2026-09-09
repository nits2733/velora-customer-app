import React from 'react'
import { View, Text, StyleSheet } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import Svg, { Path, Circle, Rect } from 'react-native-svg'
import AnimatedPressable from './AnimatedPressable'
import { colors, fonts, fontSize, radii, spacing, shadows } from '../theme/tokens'

type Tab = 'Home' | 'Explore' | 'Services' | 'Projects'

type Props = {
  activeTab: Tab | null
  onTabPress: (tab: Tab) => void
}

function IconHome({ color }: { color: string }) {
  return (
    <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
      <Path d="M4 11.5L12 4l8 7.5" stroke={color} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" />
      <Path d="M6 10v9a1 1 0 001 1h10a1 1 0 001-1v-9" stroke={color} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  )
}

function IconExplore({ color }: { color: string }) {
  return (
    <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
      <Circle cx={12} cy={12} r={8.5} stroke={color} strokeWidth={1.8} />
      <Path d="M15 9l-2 4.5L9 15l2-4.5L15 9z" stroke={color} strokeWidth={1.5} strokeLinejoin="round" fill="none" />
    </Svg>
  )
}

function IconServices({ color }: { color: string }) {
  return (
    <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
      <Rect x={4} y={4} width={7} height={7} rx={1.2} stroke={color} strokeWidth={1.8} />
      <Rect x={13} y={4} width={7} height={7} rx={1.2} stroke={color} strokeWidth={1.8} />
      <Rect x={4} y={13} width={7} height={7} rx={1.2} stroke={color} strokeWidth={1.8} />
      <Rect x={13} y={13} width={7} height={7} rx={1.2} stroke={color} strokeWidth={1.8} />
    </Svg>
  )
}

function IconProjects({ color }: { color: string }) {
  return (
    <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
      <Rect x={3.5} y={8} width={17} height={11} rx={1.5} stroke={color} strokeWidth={1.8} />
      <Path d="M8.5 8V6.5a1.5 1.5 0 011.5-1.5h4a1.5 1.5 0 011.5 1.5V8" stroke={color} strokeWidth={1.8} strokeLinecap="round" />
      <Path d="M3.5 12.5h17" stroke={color} strokeWidth={1.8} />
    </Svg>
  )
}

const tabs: { key: Tab; label: string; Icon: (p: { color: string }) => React.ReactElement }[] = [
  { key: 'Home', label: 'Home', Icon: IconHome },
  { key: 'Explore', label: 'Explore', Icon: IconExplore },
  { key: 'Services', label: 'Services', Icon: IconServices },
  { key: 'Projects', label: 'Projects', Icon: IconProjects },
]

export default function BottomNav({ activeTab, onTabPress }: Props) {
  const insets = useSafeAreaInsets()

  return (
    <View style={[styles.wrap, { paddingBottom: Math.max(insets.bottom, 24) }]}>
      <View style={styles.container}>
        {tabs.map(({ key, label, Icon }) => {
          const active = activeTab === key
          return (
            <AnimatedPressable
              key={key}
              style={({ pressed }) => [styles.tab, pressed && styles.tabPressed]}
              onPress={() => onTabPress(key)}
              accessibilityRole="tab"
              accessibilityState={{ selected: active }}
            >
              <View style={styles.tabContent}>
                <View style={active ? styles.iconBadgeActive : styles.iconBadge}>
                  <Icon color={active ? colors.white : colors.mutedText} />
                </View>
                <Text style={[styles.label, active && styles.activeLabel]}>{label}</Text>
              </View>
            </AnimatedPressable>
          )
        })}
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  wrap: {
    backgroundColor: colors.background,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.xs,
  },
  container: {
    flexDirection: 'row',
    backgroundColor: colors.cardBg2,
    borderRadius: radii.xxl,
    paddingTop: 6,
    paddingBottom: 8,
    paddingHorizontal: 6,
    ...shadows.lg,
  },
  tab: {
    flex: 1,
    paddingVertical: 4,
    borderRadius: radii.xl,
  },
  tabPressed: {
    backgroundColor: colors.border,
  },
  tabContent: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: 2,
  },
  iconBadge: {
    width: 40,
    height: 40,
    borderRadius: 20,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },
  iconBadgeActive: {
    width: 40,
    height: 40,
    borderRadius: 20,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.darkText,
  },
  label: {
    fontSize: fontSize.tiny,
    fontFamily: fonts.body,
    color: colors.mutedText,
  },
  activeLabel: {
    color: colors.darkText,
    fontWeight: '600',
  },
})
