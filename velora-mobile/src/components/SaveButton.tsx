import React, { useEffect, useRef, useState } from 'react'
import { Animated, StyleSheet } from 'react-native'
import AnimatedPressable from './AnimatedPressable'
import { colors } from '../theme/tokens'
import { isFavorite, toggleFavorite, FavoriteKind } from '../data/favorites'

type Props = {
  id: string
  kind: FavoriteKind
}

export default function SaveButton({ id, kind }: Props) {
  const [saved, setSaved] = useState(() => isFavorite(kind, id))
  const scale = useRef(new Animated.Value(1)).current
  const skipPop = useRef(true)

  useEffect(() => {
    if (skipPop.current) {
      skipPop.current = false
      return
    }
    if (!saved) return
    scale.setValue(0.7)
    Animated.spring(scale, { toValue: 1, useNativeDriver: true, speed: 20, bounciness: 14 }).start()
  }, [saved, scale])

  const handlePress = () => {
    setSaved(!saved)
    toggleFavorite(kind, id).catch(() => setSaved(isFavorite(kind, id)))
  }

  return (
    <AnimatedPressable
      style={styles.btn}
      onPress={handlePress}
      accessibilityLabel={saved ? 'Remove from saved' : 'Save'}
    >
      <Animated.Text style={[styles.glyph, saved && styles.glyphSaved, { transform: [{ scale }] }]}>
        {saved ? '♥' : '♡'}
      </Animated.Text>
    </AnimatedPressable>
  )
}

const styles = StyleSheet.create({
  btn: {
    position: 'absolute',
    top: 12,
    right: 12,
    width: 40,
    height: 40,
    borderRadius: 999,
    backgroundColor: 'rgba(0,0,0,0.35)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  glyph: {
    fontSize: 20,
    color: colors.white,
    lineHeight: 22,
  },
  glyphSaved: {
    color: '#ef4444',
  },
})
