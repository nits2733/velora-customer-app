import React from 'react'
import { Pressable, Text, StyleSheet, Linking } from 'react-native'
import { colors } from '../theme/tokens'

export default function FloatingWhatsApp() {
  return (
    <Pressable
      style={({ pressed }: { pressed: boolean }) => [styles.btn, pressed && styles.pressed]}
      onPress={() => Linking.openURL('https://wa.me/918210827121')}
    >
      <Text style={styles.icon}>💬</Text>
    </Pressable>
  )
}

const styles = StyleSheet.create({
  btn: {
    position: 'absolute',
    bottom: 72,
    right: 12,
    width: 44,
    height: 44,
    borderRadius: 22,
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
    fontSize: 19,
  },
})
