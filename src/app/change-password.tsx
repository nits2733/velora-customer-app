import { router } from 'expo-router';
import { useRef, useState } from 'react';
import { type TextInputInstance } from 'react-native';
import { AuthLayout } from '@/components/auth/AuthLayout';
import { TextField } from '@/components/auth/TextField';
import { AppText } from '@/components/ui/AppText';
import { Button } from '@/components/ui/Button';
import { strings } from '@/content/strings';
import { authService } from '@/services/authService';
import { useSession } from '@/session/useSession';
import { colors } from '@/theme';
import { authErrorMessage, checkNewPassword, hasErrors, type FieldErrors } from '@/utils/validation';
import { RequireSession } from '@/components/auth/RequireSession';

/** The backend ends every session when the password changes, so afterwards the customer logs in again. */
function ChangePasswordScreenContent() {
  const t = strings.changePassword;
  const session = useSession();
  const newRef = useRef<TextInputInstance>(null);
  const [current, setCurrent] = useState('');
  const [next, setNext] = useState('');
  const [errors, setErrors] = useState<FieldErrors>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const submit = async () => {
    const found: FieldErrors = {
      current: current ? undefined : strings.auth.errors.passwordRequired,
      next: checkNewPassword(next),
    };
    setErrors(found);
    setFormError(null);
    if (hasErrors(found)) return;

    setBusy(true);
    try {
      await authService.changePassword(current, next);
      await session.signOut();
      if (router.canDismiss()) router.dismissAll();
      router.replace({ pathname: '/login', params: { reset: '1' } });
    } catch (error) {
      setFormError(authErrorMessage(error));
    } finally {
      setBusy(false);
    }
  };

  return (
    <AuthLayout title={t.title} subtitle={t.subtitle}>
      <TextField label={t.current} value={current} onChangeText={setCurrent} error={errors.current} secure autoCapitalize="none" autoComplete="current-password" textContentType="password" returnKeyType="next" onSubmitEditing={() => newRef.current?.focus()} />
      <TextField ref={newRef} label={strings.auth.newPassword} value={next} onChangeText={setNext} error={errors.next} secure autoCapitalize="none" autoComplete="new-password" textContentType="newPassword" maxLength={100} returnKeyType="go" onSubmitEditing={submit} />
      {formError ? (
        <AppText variant="bodyStrong" color={colors.danger} accessibilityRole="alert">
          {formError}
        </AppText>
      ) : null}
      <Button label={t.submit} loading={busy} onPress={submit} />
    </AuthLayout>
  );
}

export default function ChangePasswordScreen() {
  return (
    <RequireSession next='/profile'>
      <ChangePasswordScreenContent />
    </RequireSession>
  );
}
