import { Feather } from '@expo/vector-icons';
import { useState } from 'react';
import { KeyboardAvoidingView, Modal, Platform, Pressable as RNPressable, StyleSheet, TextInput, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { AppText } from '@/components/ui/AppText';
import { Button } from '@/components/ui/Button';
import { Pressable } from '@/components/ui/Pressable';
import { locationStore, useLocation, type LocationStatus } from '@/hooks/useLocation';
import { colors, fonts, radius, screenGutter } from '@/theme';

const detectHint: Record<LocationStatus, string> = {
  idle: 'Detect where you are',
  detecting: 'Detecting…',
  ready: 'Detect where you are',
  denied: 'Allow location access',
  blocked: 'Open settings to allow access',
  unavailable: 'Turn on device location and retry',
};

interface Props {
  visible: boolean;
  onClose: () => void;
}

/** City-pill dropdown: auto-detect, or type an area or city by hand. */
export function LocationSheet({ visible, onClose }: Props) {
  const loc = useLocation();
  const insets = useSafeAreaInsets();
  const [text, setText] = useState('');
  const hint = loc.manual ? 'Switch back to your device location' : loc.city && loc.status === 'ready' ? loc.city : detectHint[loc.status];

  const close = () => {
    setText('');
    onClose();
  };

  const submit = () => {
    if (!text.trim()) return;
    locationStore.setManual(text);
    close();
  };

  const detectCurrent = () => {
    loc.retry();
    // Stay open when the OS needs the user to go to settings.
    if (loc.status !== 'blocked') close();
  };

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={close} statusBarTranslucent>
      <KeyboardAvoidingView style={styles.fill} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <RNPressable style={styles.backdrop} onPress={close} accessibilityLabel="Close location picker" accessibilityRole="button" />
        <View style={[styles.sheet, { paddingBottom: insets.bottom + 20 }]}>
          <View style={styles.head}>
            <AppText variant="h3" accessibilityRole="header">
              Choose your location
            </AppText>
            <Pressable style={styles.close} onPress={close} accessibilityRole="button" accessibilityLabel="Close">
              <Feather name="x" size={18} color={colors.ink} />
            </Pressable>
          </View>

          <Pressable
            style={styles.row}
            onPress={detectCurrent}
            accessibilityRole="button"
            accessibilityLabel={`Use current location. ${hint}`}
          >
            <View style={styles.icon}>
              <Feather name="crosshair" size={18} color={colors.forest} />
            </View>
            <View style={styles.rowCopy}>
              <AppText variant="bodyStrong">Use current location</AppText>
              <AppText variant="caption" color={colors.inkSoft}>
                {hint}
              </AppText>
            </View>
          </Pressable>

          <AppText variant="eyebrow" color={colors.clay} style={styles.or}>
            Or enter it yourself
          </AppText>
          <View style={styles.inputRow}>
            <TextInput
              value={text}
              onChangeText={setText}
              onSubmitEditing={submit}
              placeholder="Area, city"
              placeholderTextColor={colors.inkMuted}
              returnKeyType="done"
              autoCapitalize="words"
              style={styles.input}
              accessibilityLabel="Area or city"
            />
          </View>
          <Button label="Set location" onPress={submit} />
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  fill: { flex: 1, justifyContent: 'flex-end' },
  backdrop: { ...StyleSheet.absoluteFill, backgroundColor: 'rgba(8,24,16,0.45)' },
  sheet: { padding: screenGutter, gap: 12, borderTopLeftRadius: radius.xl, borderTopRightRadius: radius.xl, backgroundColor: colors.bg },
  head: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  close: { width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center' },
  row: { minHeight: 64, flexDirection: 'row', alignItems: 'center', gap: 12, padding: 12, borderRadius: radius.lg, backgroundColor: colors.surface },
  icon: { width: 44, height: 44, borderRadius: 22, backgroundColor: colors.forestSoft, alignItems: 'center', justifyContent: 'center' },
  rowCopy: { flex: 1, gap: 2 },
  or: { marginTop: 4 },
  inputRow: { height: 52, justifyContent: 'center', paddingHorizontal: 16, borderRadius: radius.lg, backgroundColor: colors.surface },
  input: { fontFamily: fonts.sans, fontSize: 15, color: colors.ink, paddingVertical: 0 },
});
