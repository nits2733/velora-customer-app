import { Feather } from '@expo/vector-icons';
import { forwardRef, useState } from 'react';
import { StyleSheet, TextInput, View, type TextInputInstance, type TextInputProps } from 'react-native';
import { AppText } from '@/components/ui/AppText';
import { Pressable } from '@/components/ui/Pressable';
import { strings } from '@/content/strings';
import { colors, fonts, radius } from '@/theme';

interface Props extends Omit<TextInputProps, 'style'> {
  label: string;
  error?: string;
  /** Adds a show/hide control for a password. */
  secure?: boolean;
}

/** Labelled input with its error under it. The label stays visible: it is also the accessibility name. */
export const TextField = forwardRef<TextInputInstance, Props>(function TextField({ label, error, secure, ...rest }, ref) {
  const [hidden, setHidden] = useState(true);
  return (
    <View style={styles.wrap}>
      <AppText variant="captionStrong" color={colors.inkSoft}>
        {label}
      </AppText>
      <View style={[styles.box, error ? styles.boxError : null]}>
        <TextInput
          ref={ref}
          {...rest}
          secureTextEntry={secure ? hidden : rest.secureTextEntry}
          placeholderTextColor={colors.inkMuted}
          style={styles.input}
          accessibilityLabel={label}
        />
        {secure ? (
          <Pressable
            style={styles.eye}
            onPress={() => setHidden((h) => !h)}
            accessibilityRole="button"
            accessibilityLabel={hidden ? strings.auth.showPassword : strings.auth.hidePassword}
          >
            <Feather name={hidden ? 'eye' : 'eye-off'} size={18} color={colors.inkSoft} />
          </Pressable>
        ) : null}
      </View>
      {error ? (
        <AppText variant="caption" color={colors.danger} accessibilityRole="alert">
          {error}
        </AppText>
      ) : null}
    </View>
  );
});

const styles = StyleSheet.create({
  wrap: { gap: 6 },
  box: { minHeight: 52, flexDirection: 'row', alignItems: 'center', paddingLeft: 14, borderRadius: radius.md, borderWidth: 1.5, borderColor: colors.border, backgroundColor: colors.surface },
  boxError: { borderColor: colors.danger },
  input: { flex: 1, minHeight: 50, fontFamily: fonts.sans, fontSize: 16, color: colors.ink, paddingVertical: 0 },
  eye: { width: 48, height: 48, alignItems: 'center', justifyContent: 'center' },
});
