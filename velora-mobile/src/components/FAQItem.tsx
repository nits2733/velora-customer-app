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
  const answerOpacity = useRef(new Animated.Value(0)).current

  useEffect(() => {
    if (open) {
      answerOpacity.setValue(0)
      Animated.timing(answerOpacity, { toValue: 1, duration: 220, useNativeDriver: true }).start()
    }
  }, [open, answerOpacity])

  return (
    <Animated.View style={styles.container}>
      <AnimatedPressable onPress={() => setOpen(v => !v)}>
        <Text style={styles.question}>{question}</Text>
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
  question: {
    fontSize: fontSize.body,
    fontFamily: fonts.body,
    color: colors.darkText,
    fontWeight: '500',
    lineHeight: 22,
  },
  answer: {
    marginTop: spacing.sm,
    fontSize: fontSize.label,
    fontFamily: fonts.body,
    color: colors.mutedText,
    lineHeight: 20,
  },
})
