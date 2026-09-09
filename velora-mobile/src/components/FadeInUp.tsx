import React, { useEffect, useRef } from 'react'
import { Animated, Easing } from 'react-native'

type Props = {
  children: React.ReactNode
  delay?: number
  style?: any
}

// Staggered fade+slide-up for list/grid items appearing after data loads.
export default function FadeInUp({ children, delay = 0, style }: Props) {
  const opacity = useRef(new Animated.Value(0)).current
  const translateY = useRef(new Animated.Value(12)).current

  useEffect(() => {
    Animated.parallel([
      Animated.timing(opacity, { toValue: 1, duration: 260, delay, easing: Easing.out(Easing.quad), useNativeDriver: true }),
      Animated.timing(translateY, { toValue: 0, duration: 260, delay, easing: Easing.out(Easing.quad), useNativeDriver: true }),
    ]).start()
  }, [opacity, translateY, delay])

  return (
    <Animated.View style={[style, { opacity, transform: [{ translateY }] }]}>
      {children}
    </Animated.View>
  )
}
