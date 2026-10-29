import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { StyleSheet } from 'react-native';
import { AuthLayout } from '@/components/auth/AuthLayout';
import { CodeField } from '@/components/auth/CodeField';
import { AppText } from '@/components/ui/AppText';
import { Button } from '@/components/ui/Button';
import { Pressable } from '@/components/ui/Pressable';
import { strings } from '@/content/strings';
import { authService } from '@/services/authService';
import { sessionStore } from '@/session/sessionStore';
import { colors } from '@/theme';
import { track } from '@/utils/analytics';
import { finishSignIn } from '@/utils/navigation';
import { authErrorMessage, checkCode } from '@/utils/validation';

/** Step two of logging in: the six-digit code emailed after the password was accepted. */
export default function VerifyLoginScreen() {
  const { email = '', next } = useLocalSearchParams<{ email?: string; next?: string }>();
  const t = strings.auth.loginCode;
  const [code, setCode] = useState('');
  const [error, setError] = useState<string | undefined>();
  const [busy, setBusy] = useState(false);

  const submit = async () => {
    const problem = checkCode(code);
    setError(problem);
    if (problem) return;
    setBusy(true);
    try {
      await sessionStore.signIn(await authService.verifyLoginCode(email, code));
      track({ name: 'auth_signed_in', method: 'password' });
      finishSignIn(next);
    } catch (e) {
      setError(authErrorMessage(e));
    } finally {
      setBusy(false);
    }
  };

  return (
    <AuthLayout title={t.title} subtitle={t.subtitle(email)}>
      <CodeField value={code} onChange={setCode} error={error} onComplete={submit} />
      <Button label={t.submit} loading={busy} onPress={submit} />
      <Pressable style={styles.link} onPress={() => router.back()} accessibilityRole="link" accessibilityLabel={t.resend}>
        <AppText variant="bodyStrong" color={colors.forest} style={styles.center}>
          {t.resend}
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

const styles = StyleSheet.create({ link: { minHeight: 44, alignItems: 'center', justifyContent: 'center' }, center: { textAlign: 'center' } });
