import React from 'react'
import { View, Text, Modal, StyleSheet } from 'react-native'
import { colors, fonts, fontSize, spacing, radii, shadows } from '../theme/tokens'
import PrimaryButton from './PrimaryButton'
import SecondaryButton from './SecondaryButton'

type Props = {
  visible: boolean
  title: string
  message: string
  confirmLabel?: string
  cancelLabel?: string
  onConfirm: () => void
  onCancel: () => void
  danger?: boolean
}

export default function ConfirmModal({
  visible,
  title,
  message,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  onConfirm,
  onCancel,
  danger,
}: Props) {
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onCancel}>
      <View style={styles.overlay}>
        <View style={styles.box}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.message}>{message}</Text>
          <View style={styles.actions}>
            <SecondaryButton label={cancelLabel} onPress={onCancel} style={styles.actionBtn} />
            <PrimaryButton
              label={confirmLabel}
              onPress={onConfirm}
              style={danger ? { ...styles.actionBtn, backgroundColor: colors.error } : styles.actionBtn}
            />
          </View>
        </View>
      </View>
    </Modal>
  )
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: colors.overlay,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.xl,
  },
  box: {
    backgroundColor: colors.white,
    borderRadius: radii.lg,
    padding: spacing.xl,
    width: '100%',
    maxWidth: 320,
    gap: spacing.lg,
    ...shadows.lg,
  },
  title: {
    fontSize: fontSize.h3,
    fontFamily: fonts.heading,
    color: colors.darkText,
    fontWeight: '700',
  },
  message: {
    fontSize: fontSize.body,
    fontFamily: fonts.body,
    color: colors.mutedText,
    lineHeight: 22,
  },
  actions: {
    flexDirection: 'row',
    gap: spacing.md,
    marginTop: spacing.sm,
  },
  actionBtn: {
    flex: 1,
  },
})
