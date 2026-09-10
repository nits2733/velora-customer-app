import React from 'react'
import { View, Text, Image, StyleSheet, ImageSourcePropType } from 'react-native'
import AnimatedPressable from './AnimatedPressable'
import { colors, fonts, fontSize, radii, spacing, shadows, fontWeight } from '../theme/tokens'

type Props = {
  image: ImageSourcePropType
  title: string
  category: string
  description: string
  onPress?: () => void
  width?: number
}

export default function PopularProjectCard({ image, title, category, description, onPress, width = 240 }: Props) {
  return (
    <AnimatedPressable onPress={onPress} style={[styles.card, { width }]}>
      <Image source={image} style={styles.image} alt={title} />
      <View style={styles.body}>
        <Text style={styles.category}>{category}</Text>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.description} numberOfLines={2}>{description}</Text>
      </View>
    </AnimatedPressable>
  )
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.cardBg2,
    borderRadius: radii.md,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.border,
    ...shadows.sm,
  },
  image: {
    width: '100%',
    height: 160,
    resizeMode: 'cover',
  },
  body: {
    padding: spacing.md,
    gap: 3,
  },
  category: {
    fontFamily: fonts.body,
    fontSize: 10,
    color: colors.mutedText,
    letterSpacing: 1,
    textTransform: 'uppercase',
    fontWeight: fontWeight.medium,
  },
  title: {
    fontFamily: fonts.heading,
    fontSize: fontSize.label,
    color: colors.darkText,
    fontWeight: fontWeight.semibold,
    marginTop: 1,
  },
  description: {
    fontFamily: fonts.body,
    fontSize: fontSize.caption,
    color: colors.mutedText,
    lineHeight: 16,
    marginTop: 2,
  },
})
