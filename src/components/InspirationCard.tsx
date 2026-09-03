import React, { useState } from 'react'
import { View, Text, Image, Pressable, StyleSheet } from 'react-native'
import { colors, fonts, fontSize, radii } from '../theme/tokens'

const FALLBACK_IMAGE = '/assets/ab679.png'

type Props = {
  title: string
  imageUri: string
  onPress?: () => void
  width?: number
  height?: number
}

export default function InspirationCard({ title, imageUri, onPress, width = 160, height = 200 }: Props) {
  const [failed, setFailed] = useState(false)
  return (
    <Pressable onPress={onPress} style={[styles.card, { width, height }]}>
      <Image
        source={{ uri: failed ? FALLBACK_IMAGE : imageUri }}
        style={styles.image}
        onError={() => setFailed(true)}
        alt={title}
      />
      <View style={styles.overlay}>
        <Text style={styles.title}>{title}</Text>
      </View>
    </Pressable>
  )
}

const styles = StyleSheet.create({
  card: {
    borderRadius: radii.md,
    overflow: 'hidden',
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  overlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 12,
    backgroundColor: 'rgba(0,0,0,0.45)',
  },
  title: {
    fontSize: fontSize.label,
    fontFamily: fonts.body,
    color: colors.white,
    fontWeight: '600',
  },
})
