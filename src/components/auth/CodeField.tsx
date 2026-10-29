import { StyleSheet, TextInput, View } from 'react-native';
import { AppText } from '@/components/ui/AppText';
import { strings } from '@/content/strings';
import { colors, fonts, radius } from '@/theme';
import { digitsOnly } from '@/utils/validation';

interface Props {
  value: string;
  onChange: (code: string) => void;
  error?: string;
  onComplete?: () => void;
}

/** One field for the six-digit emailed code. It takes a paste, and offers the code from the keyboard where the device can. */
export function CodeField({ value, onChange, error, onComplete }: Props) {
  return (
    <View style={styles.wrap}>
      <AppText variant="captionStrong" color={colors.inkSoft}>
        {strings.auth.code}
      </AppText>
      <TextInput
        value={value}
        onChangeText={(text) => {
          const code = digitsOnly(text);
          onChange(code);
          if (code.length === 6) onComplete?.();
        }}
        keyboardType="number-pad"
        inputMode="numeric"
        autoComplete="one-time-code"
        textContentType="oneTimeCode"
        maxLength={6}
        placeholder="000000"
        placeholderTextColor={colors.inkMuted}
        style={[styles.input, error ? styles.error : null]}
        accessibilityLabel={strings.auth.code}
      />
      {error ? (
        <AppText variant="caption" color={colors.danger} accessibilityRole="alert">
          {error}
        </AppText>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { gap: 6 },
  input: { minHeight: 60, textAlign: 'center', fontFamily: fonts.sansBold, fontSize: 28, letterSpacing: 10, color: colors.ink, borderRadius: radius.md, borderWidth: 1.5, borderColor: colors.border, backgroundColor: colors.surface },
  error: { borderColor: colors.danger },
});
