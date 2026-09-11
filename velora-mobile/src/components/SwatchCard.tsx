import React from 'react'
import { View, Text, Image, StyleSheet, ImageSourcePropType } from 'react-native'
import AnimatedPressable from './AnimatedPressable'
import { colors, fonts, fontSize, radii, spacing, shadows, fontWeight } from '../theme/tokens'

type Props = {
  image?: ImageSourcePropType
  color?: string
  label: string
  note?: string
  width?: number
  onPress?: () => void
}

export default function SwatchCard({ image, color, label, note, width = 150, onPress }: Props) {
  return (
    <AnimatedPressable onPress={onPress} style={[styles.card, { width }]}>
      {image ? (
        <Image source={image} style={styles.swatch} alt={label} />
      ) : (
        <View style={[styles.swatch, { backgroundColor: color || colors.border }]} />
      )}
      <View style={styles.body}>
        <Text style={styles.label}>{label}</Text>
        {note ? <Text style={styles.note} numberOfLines={3}>{note}</Text> : null}
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
  swatch: {
    width: '100%',
    height: 80,
    resizeMode: 'cover',
  },
  body: {
    padding: spacing.sm + 2,
    gap: 3,
  },
  label: {
    fontFamily: fonts.heading,
    fontSize: fontSize.caption,
    color: colors.darkText,
    fontWeight: fontWeight.semibold,
  },
  note: {
    fontFamily: fonts.body,
    fontSize: 11,
    color: colors.mutedText,
    lineHeight: 15,
  },
})
