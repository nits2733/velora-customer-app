import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { AuthLayout } from '@/components/auth/AuthLayout';
import { CodeField } from '@/components/auth/CodeField';
import { Button } from '@/components/ui/Button';
import { strings } from '@/content/strings';
import { authService } from '@/services/authService';
import { authFlow } from '@/session/authFlow';
import { authErrorMessage, checkCode } from '@/utils/validation';

export default function VerifyResetScreen() {
  const { email = '' } = useLocalSearchParams<{ email?: string }>();
  const t = strings.auth.verifyReset;
  const [code, setCode] = useState('');
  const [error, setError] = useState<string | undefined>();
  const [busy, setBusy] = useState(false);

  const submit = async () => {
    const problem = checkCode(code);
    setError(problem);
    if (problem) return;
    setBusy(true);
    try {
      authFlow.setResetToken(await authService.verifyResetCode(email, code));
      router.push('/reset-password');
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
    </AuthLayout>
  );
}
