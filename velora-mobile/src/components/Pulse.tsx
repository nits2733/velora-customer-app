import React, { useEffect, useRef } from 'react'
import { Animated } from 'react-native'

type Props = {
  trigger: number | string
  children: React.ReactNode
  style?: any
}

// Pulses its children (scale 1 -> 1.25 -> 1) whenever `trigger` changes —
// e.g. a cart count going up. Does not pulse on first mount.
export default function Pulse({ trigger, children, style }: Props) {
  const scale = useRef(new Animated.Value(1)).current
  const prev = useRef(trigger)

  useEffect(() => {
    if (prev.current !== trigger) {
      prev.current = trigger
      Animated.sequence([
        Animated.spring(scale, { toValue: 1.25, useNativeDriver: true, speed: 30, bounciness: 10 }),
        Animated.spring(scale, { toValue: 1, useNativeDriver: true, speed: 20, bounciness: 6 }),
      ]).start()
    }
  }, [trigger, scale])

  return <Animated.View style={[style, { transform: [{ scale }] }]}>{children}</Animated.View>
}
