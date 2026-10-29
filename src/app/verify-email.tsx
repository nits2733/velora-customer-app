import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { StyleSheet } from 'react-native';
import { AuthLayout } from '@/components/auth/AuthLayout';
import { CodeField } from '@/components/auth/CodeField';
import { AppText } from '@/components/ui/AppText';
import { Button } from '@/components/ui/Button';
import { Pressable } from '@/components/ui/Pressable';
import { strings } from '@/content/strings';
import { useResendTimer } from '@/hooks/useResendTimer';
import { authService } from '@/services/authService';
import { sessionStore } from '@/session/sessionStore';
import { colors } from '@/theme';
import { track } from '@/utils/analytics';
import { finishSignIn } from '@/utils/navigation';
import { authErrorMessage, checkCode } from '@/utils/validation';

/** Confirms a new account's email address. A correct code also signs the customer in. */
export default function VerifyEmailScreen() {
  const { email = '', next } = useLocalSearchParams<{ email?: string; next?: string }>();
  const t = strings.auth.verifyEmail;
  const timer = useResendTimer(60);
  const [code, setCode] = useState('');
  const [error, setError] = useState<string | undefined>();
  const [notice, setNotice] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const submit = async () => {
    const problem = checkCode(code);
    setError(problem);
    setNotice(null);
    if (problem) return;
    setBusy(true);
    try {
      await sessionStore.signIn(await authService.verifyEmail(email, code));
      track({ name: 'auth_signed_up' });
      finishSignIn(next);
    } catch (e) {
      setError(authErrorMessage(e));
    } finally {
      setBusy(false);
    }
  };

  const resend = async () => {
    setError(undefined);
    try {
      await authService.resendVerificationCode(email);
      setNotice(t.resent);
      timer.restart();
    } catch (e) {
      setError(authErrorMessage(e));
    }
  };

  return (
    <AuthLayout title={t.title} subtitle={t.subtitle(email)} notice={notice ?? undefined}>
      <CodeField value={code} onChange={setCode} error={error} onComplete={submit} />
      <Button label={t.submit} loading={busy} onPress={submit} />
      <Pressable
        style={[styles.link, !timer.ready && styles.disabled]}
        disabled={!timer.ready}
        onPress={resend}
        accessibilityRole="link"
        accessibilityState={{ disabled: !timer.ready }}
        accessibilityLabel={timer.ready ? t.resend : strings.auth.resendIn(timer.left)}
      >
        <AppText variant="bodyStrong" color={timer.ready ? colors.forest : colors.inkSoft}>
          {timer.ready ? t.resend : strings.auth.resendIn(timer.left)}
        </AppText>
      </Pressable>
      <Pressable style={styles.link} onPress={() => router.back()} accessibilityRole="link" accessibilityLabel={strings.auth.changeEmail}>
        <AppText variant="bodyStrong" color={colors.forest}>
          {strings.auth.changeEmail}
        </AppText>
      </Pressable>
    </AuthLayout>
  );
}

const styles = StyleSheet.create({ link: { minHeight: 44, alignItems: 'center', justifyContent: 'center' }, disabled: { opacity: 0.8 } });
