import React from 'react'
import { View, Text, Pressable, StyleSheet } from 'react-native'
import { colors, fonts, fontSize, radii, spacing } from '../theme/tokens'

type Props = {
  name: string
  config?: string
  price?: string
  quantity?: number
  notes?: string
  onEdit?: () => void
  onRemove?: () => void
}

export default function CartItem({ name, config, price, quantity, notes, onEdit, onRemove }: Props) {
  return (
    <View style={styles.container}>
      <View style={styles.info}>
        <Text style={styles.name}>{name}{quantity && quantity > 1 ? ` × ${quantity}` : ''}</Text>
        {config && <Text style={styles.config}>{config}</Text>}
        {price && <Text style={styles.price}>Est. ₹{price}</Text>}
        {notes && <Text style={styles.notes}>"{notes}"</Text>}
      </View>
      <View style={styles.actions}>
        <Pressable onPress={onEdit} style={styles.actionBtn}>
          <Text style={styles.actionEdit}>Edit</Text>
        </Pressable>
        <Pressable onPress={onRemove} style={styles.actionBtn}>
          <Text style={styles.actionRemove}>Remove</Text>
        </Pressable>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    gap: spacing.sm,
  },
  info: {
    flex: 1,
    gap: 3,
  },
  name: {
    fontSize: fontSize.body,
    fontFamily: fonts.body,
    color: colors.darkText,
    fontWeight: '600',
  },
  config: {
    fontSize: fontSize.caption,
    fontFamily: fonts.body,
    color: colors.mutedText,
  },
  price: {
    fontSize: fontSize.label,
    fontFamily: fonts.body,
    color: colors.darkText,
    fontWeight: '500',
  },
  notes: {
    fontSize: fontSize.caption,
    fontFamily: fonts.body,
    color: colors.mutedText,
    fontStyle: 'italic',
    marginTop: 2,
  },
  actions: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  actionBtn: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: radii.sm,
  },
  actionEdit: {
    fontSize: fontSize.caption,
    fontFamily: fonts.body,
    color: colors.darkText,
    fontWeight: '500',
  },
  actionRemove: {
    fontSize: fontSize.caption,
    fontFamily: fonts.body,
    color: colors.red,
    fontWeight: '500',
  },
})
