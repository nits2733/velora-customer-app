import React from 'react'
import { View, Text, TextInput, StyleSheet } from 'react-native'
import { colors, fonts, fontSize, radii, spacing } from '../theme/tokens'

type Props = {
  label?: string
  placeholder?: string
  value: string
  onChangeText: (v: string) => void
  multiline?: boolean
  numberOfLines?: number
  keyboardType?: 'default' | 'numeric' | 'email-address' | 'phone-pad'
}

export default function InputField({ label, placeholder, value, onChangeText, multiline, numberOfLines, keyboardType }: Props) {
  return (
    <View style={styles.container}>
      {label && <Text style={styles.label}>{label}</Text>}
      <TextInput
        style={[styles.input, multiline && { height: (numberOfLines || 3) * 22 }]}
        placeholder={placeholder || ''}
        placeholderTextColor={colors.mutedText}
        value={value}
        onChangeText={onChangeText}
        multiline={multiline}
        numberOfLines={numberOfLines}
        keyboardType={keyboardType}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    gap: spacing.xs,
  },
  label: {
    fontSize: fontSize.label,
    fontFamily: fonts.body,
    color: colors.darkText,
    fontWeight: '500',
  },
  input: {
    borderWidth: 1.5,
    borderColor: colors.border,
    borderRadius: radii.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm + 2,
    fontSize: fontSize.body,
    fontFamily: fonts.body,
    color: colors.darkText,
    backgroundColor: colors.white,
  },
})
