import { useState } from 'react';
import { KeyboardAvoidingView, Modal, Platform, Pressable as RNPressable, ScrollView, StyleSheet, TextInput, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { AppText } from '@/components/ui/AppText';
import { Button } from '@/components/ui/Button';
import { strings } from '@/content/strings';
import { colors, fonts, radius, screenGutter } from '@/theme';

export const REASON_MAX = 300;

interface Props {
  visible: boolean;
  title: string;
  body: string;
  confirmLabel: string;
  dismissLabel: string;
  destructive?: boolean;
  /** When set, shows an optional reason field and passes its text to `onConfirm`. */
  reasonLabel?: string;
  busy?: boolean;
  error?: string | null;
  onConfirm: (reason?: string) => void;
  onClose: () => void;
}

/** Bottom sheet that asks before an action that cannot be taken back. Nothing happens until the customer confirms. */
export function ConfirmSheet({ visible, title, body, confirmLabel, dismissLabel, destructive, reasonLabel, busy, error, onConfirm, onClose }: Props) {
  const insets = useSafeAreaInsets();
  const [reason, setReason] = useState('');

  const close = () => {
    if (busy) return;
    setReason('');
    onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={close} statusBarTranslucent>
      <KeyboardAvoidingView style={styles.fill} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <RNPressable style={styles.backdrop} onPress={close} accessibilityRole="button" accessibilityLabel={dismissLabel} />
        <View style={[styles.sheet, { paddingBottom: insets.bottom + 20 }]}>
          <ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={styles.content} bounces={false}>
            <AppText variant="h3" accessibilityRole="header">
              {title}
            </AppText>
            <AppText variant="body" color={colors.inkSoft}>
              {body}
            </AppText>

            {reasonLabel ? (
              <View style={styles.reason}>
                <AppText variant="captionStrong" color={colors.inkSoft}>
                  {reasonLabel}
                </AppText>
                <TextInput
                  value={reason}
                  onChangeText={(text) => setReason(text.slice(0, REASON_MAX))}
                  placeholder={strings.sheet.reasonPlaceholder}
                  placeholderTextColor={colors.inkMuted}
                  multiline
                  maxLength={REASON_MAX}
                  style={styles.input}
                  accessibilityLabel={reasonLabel}
                />
                <AppText variant="caption" color={colors.inkSoft} style={styles.counter}>
                  {strings.sheet.reasonLimit(reason.length, REASON_MAX)}
                </AppText>
              </View>
            ) : null}

            {error ? (
              <AppText variant="bodyStrong" color={colors.danger} accessibilityRole="alert">
                {error}
              </AppText>
            ) : null}

            <Button label={confirmLabel} variant={destructive ? 'danger' : 'primary'} loading={busy} onPress={() => onConfirm(reasonLabel ? reason : undefined)} />
            <Button label={dismissLabel} variant="quiet" onPress={close} />
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  fill: { flex: 1, justifyContent: 'flex-end' },
  backdrop: { ...StyleSheet.absoluteFill, backgroundColor: colors.overlay },
  sheet: { maxHeight: '88%', borderTopLeftRadius: radius.xl, borderTopRightRadius: radius.xl, backgroundColor: colors.bg },
  content: { padding: screenGutter, paddingTop: 20, gap: 12 },
  reason: { gap: 6 },
  input: { minHeight: 84, padding: 12, borderRadius: radius.md, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.surface, fontFamily: fonts.sans, fontSize: 14, color: colors.ink, textAlignVertical: 'top' },
  counter: { alignSelf: 'flex-end' },
});
