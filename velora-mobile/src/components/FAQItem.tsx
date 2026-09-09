import React, { useEffect, useRef, useState } from 'react'
import { Animated, Text, StyleSheet } from 'react-native'
import AnimatedPressable from './AnimatedPressable'
import { colors, fonts, fontSize, spacing } from '../theme/tokens'

type Props = {
  question: string
  answer: string
}

export default function FAQItem({ question, answer }: Props) {
  const [open, setOpen] = useState(false)
  const rotation = useRef(new Animated.Value(0)).current
  const answerOpacity = useRef(new Animated.Value(0)).current

  useEffect(() => {
    Animated.timing(rotation, { toValue: open ? 1 : 0, duration: 200, useNativeDriver: true }).start()
    if (open) {
      answerOpacity.setValue(0)
      Animated.timing(answerOpacity, { toValue: 1, duration: 220, useNativeDriver: true }).start()
    }
  }, [open, rotation, answerOpacity])

  const rotate = rotation.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '135deg'] })

  return (
    <Animated.View style={styles.container}>
      <AnimatedPressable onPress={() => setOpen(v => !v)} style={styles.row}>
        <Text style={styles.question}>{question}</Text>
        <Animated.Text style={[styles.chevron, { transform: [{ rotate }] }]}>+</Animated.Text>
      </AnimatedPressable>
      {open && <Animated.Text style={[styles.answer, { opacity: answerOpacity }]}>{answer}</Animated.Text>}
    </Animated.View>
  )
}

const styles = StyleSheet.create({
  container: {
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    paddingVertical: spacing.md,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: spacing.sm,
  },
  question: {
    flex: 1,
    fontSize: fontSize.body,
    fontFamily: fonts.body,
    color: colors.darkText,
    fontWeight: '500',
    lineHeight: 22,
  },
  chevron: {
    fontSize: 20,
    color: colors.mutedText,
    fontWeight: '300',
  },
  answer: {
    marginTop: spacing.sm,
    fontSize: fontSize.label,
    fontFamily: fonts.body,
    color: colors.mutedText,
    lineHeight: 20,
  },
})
