import React, { useState } from 'react'
import { View, Text, Pressable, StyleSheet } from 'react-native'
import { colors, fonts, fontSize, spacing } from '../theme/tokens'

type Props = {
  question: string
  answer: string
}

export default function FAQItem({ question, answer }: Props) {
  const [open, setOpen] = useState(false)
  return (
    <View style={styles.container}>
      <Pressable onPress={() => setOpen(v => !v)} style={styles.row}>
        <Text style={styles.question}>{question}</Text>
        <Text style={styles.chevron}>{open ? '−' : '+'}</Text>
      </Pressable>
      {open && <Text style={styles.answer}>{answer}</Text>}
    </View>
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
