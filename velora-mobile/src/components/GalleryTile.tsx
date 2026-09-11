import React from 'react'
import { View, Text, Image, StyleSheet, ImageSourcePropType } from 'react-native'
import AnimatedPressable from './AnimatedPressable'
import { colors, fonts, fontSize, radii, spacing, shadows, fontWeight } from '../theme/tokens'

type Size = 'sm' | 'md' | 'lg'

const IMAGE_HEIGHT: Record<Size, number> = { sm: 140, md: 200, lg: 280 }

type Props = {
  image: ImageSourcePropType
  title: string
  caption?: string
  size?: Size
  width?: number
  onPress?: () => void
}

export default function GalleryTile({ image, title, caption, size = 'md', width, onPress }: Props) {
  return (
    <AnimatedPressable onPress={onPress} style={[styles.card, width ? { width } : null]}>
      <Image source={image} style={[styles.image, { height: IMAGE_HEIGHT[size] }]} alt={title} />
      <View style={styles.body}>
        <Text style={styles.title}>{title}</Text>
        {caption ? <Text style={styles.caption} numberOfLines={3}>{caption}</Text> : null}
      </View>
    </AnimatedPressable>
  )
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.cardBg,
    borderRadius: radii.md,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.border,
    ...shadows.sm,
  },
  image: {
    width: '100%',
    resizeMode: 'cover',
  },
  body: {
    padding: spacing.md,
    gap: 4,
  },
  title: {
    fontFamily: fonts.heading,
    fontSize: fontSize.label,
    color: colors.darkText,
    fontWeight: fontWeight.semibold,
  },
  caption: {
    fontFamily: fonts.body,
    fontSize: fontSize.caption,
    color: colors.mutedText,
    lineHeight: 17,
  },
})
