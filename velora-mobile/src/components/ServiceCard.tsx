import React from 'react'
import { View, Text, Image, Pressable, StyleSheet } from 'react-native'
import { colors, fonts, fontSize, radii, spacing } from '../theme/tokens'

type Props = {
  title: string
  imageUri: string
  onPress?: () => void
  width?: number
}

export default function ServiceCard({ title, imageUri, onPress, width = 140 }: Props) {
  return (
    <Pressable onPress={onPress} style={[styles.card, { width }]}>
      <Image source={{ uri: imageUri }} style={[styles.image, { width }]} />
      <View style={styles.info}>
        <Text style={styles.title}>{title}</Text>
      </View>
    </Pressable>
  )
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.cardBg,
    borderRadius: radii.md,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.border,
  },
  image: {
    height: 100,
    resizeMode: 'cover',
  },
  info: {
    padding: spacing.sm,
  },
  title: {
    fontSize: fontSize.label,
    fontFamily: fonts.body,
    color: colors.darkText,
    fontWeight: '600',
  },
})
