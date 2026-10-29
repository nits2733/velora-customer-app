import { router, useLocalSearchParams } from 'expo-router';
import { useCallback, useRef, useState } from 'react';
import { StyleSheet, View, type TextInputInstance } from 'react-native';
import { AuthLayout } from '@/components/auth/AuthLayout';
import { GoogleButton } from '@/components/auth/GoogleButton';
import { TextField } from '@/components/auth/TextField';
import { AppText } from '@/components/ui/AppText';
import { Button } from '@/components/ui/Button';
import { Pressable } from '@/components/ui/Pressable';
import { googleConfig } from '@/config/google';
import { strings } from '@/content/strings';
import { authService } from '@/services/authService';
import { sessionStore } from '@/session/sessionStore';
import { colors } from '@/theme';
import { track } from '@/utils/analytics';
import { finishSignIn } from '@/utils/navigation';
import { authErrorMessage, checkEmail, hasErrors, isUnverifiedEmailError, type FieldErrors } from '@/utils/validation';

export default function LoginScreen() {
  const { next, reset } = useLocalSearchParams<{ next?: string; reset?: string }>();
  const t = strings.auth;
  const passwordRef = useRef<TextInputInstance>(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<FieldErrors>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const submit = async () => {
    const found: FieldErrors = { email: checkEmail(email), password: password ? undefined : t.errors.passwordRequired };
    setErrors(found);
    setFormError(null);
    if (hasErrors(found)) return;

    setBusy(true);
    try {
      await authService.login(email.trim(), password);
      router.push({ pathname: '/verify-login', params: next ? { email: email.trim(), next } : { email: email.trim() } });
    } catch (error) {
      if (isUnverifiedEmailError(error)) {
        // The account exists but the address was never confirmed: send a fresh code and continue there.
        await authService.resendVerificationCode(email.trim()).catch(() => {});
        router.push({ pathname: '/verify-email', params: next ? { email: email.trim(), next } : { email: email.trim() } });
      } else {
        setFormError(authErrorMessage(error));
      }
    } finally {
      setBusy(false);
    }
  };

  const withGoogle = useCallback(
    async (idToken: string) => {
      setBusy(true);
      setFormError(null);
      try {
        await sessionStore.signIn(await authService.google(idToken));
        track({ name: 'auth_signed_in', method: 'google' });
        finishSignIn(next);
      } catch (error) {
        setFormError(authErrorMessage(error));
      } finally {
        setBusy(false);
      }
    },
    [next],
  );

  return (
    <AuthLayout title={t.login.title} subtitle={t.login.subtitle} notice={reset ? t.reset.done : undefined}>
      <TextField
        label={t.email}
        placeholder={t.placeholders.email}
        value={email}
        onChangeText={setEmail}
        error={errors.email}
        keyboardType="email-address"
        autoCapitalize="none"
        autoCorrect={false}
        autoComplete="email"
        textContentType="emailAddress"
        returnKeyType="next"
        onSubmitEditing={() => passwordRef.current?.focus()}
      />
      <TextField
        ref={passwordRef}
        label={t.password}
        value={password}
        onChangeText={setPassword}
        error={errors.password}
        secure
        autoCapitalize="none"
        autoComplete="current-password"
        textContentType="password"
        returnKeyType="go"
        onSubmitEditing={submit}
      />

      {formError ? (
        <AppText variant="bodyStrong" color={colors.danger} accessibilityRole="alert">
          {formError}
        </AppText>
      ) : null}

      <Button label={t.login.submit} loading={busy} onPress={submit} />
      <Pressable style={styles.link} onPress={() => router.push('/forgot-password')} accessibilityRole="link" accessibilityLabel={t.login.forgot}>
        <AppText variant="bodyStrong" color={colors.forest}>
          {t.login.forgot}
        </AppText>
      </Pressable>

      {googleConfig ? (
        <>
          <AppText variant="caption" color={colors.inkSoft} style={styles.or}>
            {t.or}
          </AppText>
          <GoogleButton onIdToken={withGoogle} onFailure={() => setFormError(t.google.failed)} />
        </>
      ) : null}

      <View style={styles.footer}>
        <AppText variant="body" color={colors.inkSoft}>
          {t.login.noAccount}
        </AppText>
        <Pressable
          style={styles.link}
          onPress={() => router.push({ pathname: '/register', params: next ? { next } : {} })}
          accessibilityRole="link"
          accessibilityLabel={t.login.createAccount}
        >
          <AppText variant="bodyStrong" color={colors.forest}>
            {t.login.createAccount}
          </AppText>
        </Pressable>
      </View>
    </AuthLayout>
  );
}

const styles = StyleSheet.create({
  link: { minHeight: 44, alignItems: 'center', justifyContent: 'center' },
  or: { textAlign: 'center' },
  footer: { alignItems: 'center' },
});
