import React from 'react'
import { Pressable, Text, StyleSheet, Linking } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { colors } from '../theme/tokens'

export default function FloatingWhatsApp() {
  const insets = useSafeAreaInsets()
  // Additive on the device's own safe-area inset, not a bare constant -
  // a hardcoded offset looks fine on one screen size and either collides
  // with the bottom nav or floats oddly high on another.
  const bottomOffset = insets.bottom + 72

  return (
    <Pressable
      style={({ pressed }: { pressed: boolean }) => [styles.btn, { bottom: bottomOffset }, pressed && styles.pressed]}
      onPress={() => Linking.openURL('https://wa.me/919876543210')}
    >
      <Text style={styles.icon}>💬</Text>
    </Pressable>
  )
}

const styles = StyleSheet.create({
  btn: {
    position: 'absolute',
    right: 16,
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: colors.green,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 8,
    zIndex: 100,
  },
  pressed: {
    opacity: 0.85,
  },
  icon: {
    fontSize: 24,
  },
})
