import { router } from 'expo-router';
import { useState } from 'react';
import { AuthLayout } from '@/components/auth/AuthLayout';
import { TextField } from '@/components/auth/TextField';
import { AppText } from '@/components/ui/AppText';
import { Button } from '@/components/ui/Button';
import { strings } from '@/content/strings';
import { authService } from '@/services/authService';
import { authFlow } from '@/session/authFlow';
import { colors } from '@/theme';
import { authErrorMessage, checkNewPassword } from '@/utils/validation';

export default function ResetPasswordScreen() {
  const t = strings.auth;
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | undefined>();
  const [formError, setFormError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const submit = async () => {
    const problem = checkNewPassword(password);
    setError(problem);
    setFormError(null);
    if (problem) return;
    const token = authFlow.takeResetToken();
    if (!token) {
      // The token only lives in memory; if the app was restarted the customer starts again.
      router.replace('/forgot-password');
      return;
    }
    setBusy(true);
    try {
      await authService.resetPassword(token, password);
      authFlow.clear();
      if (router.canDismiss()) router.dismissAll();
      router.replace({ pathname: '/login', params: { reset: '1' } });
    } catch (e) {
      setFormError(authErrorMessage(e));
    } finally {
      setBusy(false);
    }
  };

  return (
    <AuthLayout title={t.reset.title} subtitle={t.reset.subtitle}>
      <TextField label={t.newPassword} value={password} onChangeText={setPassword} error={error} secure autoCapitalize="none" autoComplete="new-password" textContentType="newPassword" maxLength={100} returnKeyType="go" onSubmitEditing={submit} />
      {formError ? (
        <AppText variant="bodyStrong" color={colors.danger} accessibilityRole="alert">
          {formError}
        </AppText>
      ) : null}
      <Button label={t.reset.submit} loading={busy} onPress={submit} />
    </AuthLayout>
  );
}
