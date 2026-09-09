import React, { useRef } from 'react'
import { Animated, Pressable, PressableProps, StyleProp, ViewStyle } from 'react-native'

type Props = Omit<PressableProps, 'style'> & {
  style?: StyleProp<ViewStyle> | ((state: { pressed: boolean }) => StyleProp<ViewStyle>)
}

// Drop-in replacement for Pressable that adds the standard tap scale-down
// feedback (spring back on release) on top of whatever press styling the
// caller already applies.
export default function AnimatedPressable({ style, onPressIn, onPressOut, children, ...rest }: Props) {
  const scale = useRef(new Animated.Value(1)).current

  const handlePressIn: PressableProps['onPressIn'] = e => {
    Animated.spring(scale, { toValue: 0.96, useNativeDriver: true, speed: 40, bounciness: 0 }).start()
    onPressIn?.(e)
  }

  const handlePressOut: PressableProps['onPressOut'] = e => {
    Animated.spring(scale, { toValue: 1, useNativeDriver: true, speed: 20, bounciness: 6 }).start()
    onPressOut?.(e)
  }

  return (
    <Pressable {...rest} onPressIn={handlePressIn} onPressOut={handlePressOut} style={style as any}>
      {state => (
        <Animated.View style={{ flex: 1, transform: [{ scale }] }}>
          {typeof children === 'function' ? (children as any)(state) : children}
        </Animated.View>
      )}
    </Pressable>
  )
}
