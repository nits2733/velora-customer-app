import { Feather } from '@expo/vector-icons';
import { router } from 'expo-router';
import type { ReactNode } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { AppText } from '@/components/ui/AppText';
import { Pressable } from '@/components/ui/Pressable';
import { strings } from '@/content/strings';
import { colors, screenGutter } from '@/theme';

interface Props {
  title: string;
  subtitle?: string;
  children: ReactNode;
  /** Shown above the form, e.g. a notice that the password was changed. */
  notice?: string;
}

/** Shared frame for every sign-in screen: back button, heading, and a form that scrolls above the keyboard. */
export function AuthLayout({ title, subtitle, notice, children }: Props) {
  const insets = useSafeAreaInsets();
  return (
    <KeyboardAvoidingView style={styles.root} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView
        contentContainerStyle={[styles.content, { paddingTop: insets.top + 8, paddingBottom: insets.bottom + 32 }]}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <Pressable
          style={styles.back}
          onPress={() => (router.canGoBack() ? router.back() : router.replace('/'))}
          accessibilityRole="button"
          accessibilityLabel={strings.auth.back}
        >
          <Feather name="arrow-left" size={22} color={colors.ink} />
        </Pressable>
        <View style={styles.head}>
          <AppText variant="h1" accessibilityRole="header">
            {title}
          </AppText>
          {subtitle ? (
            <AppText variant="body" color={colors.inkSoft}>
              {subtitle}
            </AppText>
          ) : null}
        </View>
        {notice ? (
          <View style={styles.notice} accessibilityRole="alert">
            <AppText variant="bodyStrong" color={colors.forestDeep}>
              {notice}
            </AppText>
          </View>
        ) : null}
        <View style={styles.form}>{children}</View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.bg },
  content: { paddingHorizontal: screenGutter, gap: 20 },
  back: { width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.surface },
  head: { gap: 8 },
  form: { gap: 14 },
  notice: { padding: 12, borderRadius: 12, backgroundColor: colors.forestSoft },
});
