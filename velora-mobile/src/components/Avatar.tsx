import React from 'react'
import { View, Text, Image, StyleSheet } from 'react-native'
import { colors, fonts } from '../theme/tokens'

type Props = {
  uri?: string | null
  name?: string
  size: number
}

// Shows the real photo when there is one; otherwise an initials bubble
// (never a stock photo — that would falsely suggest a real, logged-in
// identity, including for a guest who hasn't logged in at all).
export default function Avatar({ uri, name, size }: Props) {
  const dimStyle = { width: size, height: size, borderRadius: size / 2 }

  if (uri) {
    return <Image source={{ uri }} style={dimStyle} alt={name || 'Profile avatar'} />
  }

  const initial = (name || 'Guest').trim().charAt(0).toUpperCase()
  return (
    <View style={[styles.fallback, dimStyle]}>
      <Text style={[styles.initial, { fontSize: size * 0.42 }]}>{initial}</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  fallback: {
    backgroundColor: colors.cardBg2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  initial: {
    fontFamily: fonts.heading,
    color: colors.mutedText,
    fontWeight: '600',
  },
})
