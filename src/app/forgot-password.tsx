import { router } from 'expo-router';
import { useState } from 'react';
import { AuthLayout } from '@/components/auth/AuthLayout';
import { TextField } from '@/components/auth/TextField';
import { AppText } from '@/components/ui/AppText';
import { Button } from '@/components/ui/Button';
import { strings } from '@/content/strings';
import { authService } from '@/services/authService';
import { colors } from '@/theme';
import { authErrorMessage, checkEmail } from '@/utils/validation';

export default function ForgotPasswordScreen() {
  const t = strings.auth;
  const [email, setEmail] = useState('');
  const [error, setError] = useState<string | undefined>();
  const [formError, setFormError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const submit = async () => {
    const problem = checkEmail(email);
    setError(problem);
    setFormError(null);
    if (problem) return;
    setBusy(true);
    try {
      await authService.forgotPassword(email.trim());
      // Same next step whether or not the address has an account, so this screen cannot be used to find out who does.
      router.push({ pathname: '/verify-reset', params: { email: email.trim() } });
    } catch (e) {
      setFormError(authErrorMessage(e));
    } finally {
      setBusy(false);
    }
  };

  return (
    <AuthLayout title={t.forgot.title} subtitle={t.forgot.subtitle}>
      <TextField label={t.email} value={email} onChangeText={setEmail} error={error} keyboardType="email-address" autoCapitalize="none" autoCorrect={false} autoComplete="email" textContentType="emailAddress" returnKeyType="go" onSubmitEditing={submit} />
      {formError ? (
        <AppText variant="bodyStrong" color={colors.danger} accessibilityRole="alert">
          {formError}
        </AppText>
      ) : null}
      <Button label={t.forgot.submit} loading={busy} onPress={submit} />
    </AuthLayout>
  );
}
