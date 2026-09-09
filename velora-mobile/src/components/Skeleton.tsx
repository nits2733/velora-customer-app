import React, { useEffect, useRef } from 'react'
import { Animated, StyleSheet, View, ViewStyle } from 'react-native'
import { colors, radii } from '../theme/tokens'

type Props = {
  width?: number | string
  height?: number
  radius?: number
  style?: ViewStyle
}

// A single pulsing placeholder block. Compose several into a layout that
// mirrors the real content's shape so nothing jumps when data arrives.
export default function Skeleton({ width = '100%', height = 16, radius = radii.sm, style }: Props) {
  const opacity = useRef(new Animated.Value(0.4)).current

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, { toValue: 1, duration: 700, useNativeDriver: true }),
        Animated.timing(opacity, { toValue: 0.4, duration: 700, useNativeDriver: true }),
      ])
    )
    loop.start()
    return () => loop.stop()
  }, [opacity])

  return (
    <Animated.View
      style={[
        styles.base,
        { width: width as any, height, borderRadius: radius, opacity },
        style,
      ]}
    />
  )
}

const styles = StyleSheet.create({
  base: {
    backgroundColor: colors.border,
  },
})

export function SkeletonCircle({ size = 32, style }: { size?: number; style?: ViewStyle }) {
  return <Skeleton width={size} height={size} radius={size / 2} style={style} />
}

export function SkeletonRow({ children, style }: { children: React.ReactNode; style?: ViewStyle }) {
  return <View style={[{ flexDirection: 'row' }, style]}>{children}</View>
}
