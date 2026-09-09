import React, { useEffect, useRef } from 'react'
import { Animated, Easing, StyleSheet } from 'react-native'

type Props = {
  children: React.ReactNode
}

// Wraps a screen's rendered content with a subtle fade + slide-up on mount.
// AppContent's route switch already remounts a new component per route, so
// mounting this once per screen is enough to get a transition on every nav.
export default function ScreenTransition({ children }: Props) {
  const opacity = useRef(new Animated.Value(0)).current
  const translateY = useRef(new Animated.Value(8)).current

  useEffect(() => {
    Animated.parallel([
      Animated.timing(opacity, { toValue: 1, duration: 220, easing: Easing.out(Easing.quad), useNativeDriver: true }),
      Animated.timing(translateY, { toValue: 0, duration: 220, easing: Easing.out(Easing.quad), useNativeDriver: true }),
    ]).start()
  }, [opacity, translateY])

  return (
    <Animated.View style={[styles.flex, { opacity, transform: [{ translateY }] }]}>
      {children}
    </Animated.View>
  )
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
})
