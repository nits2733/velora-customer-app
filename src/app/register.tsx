import { router, useLocalSearchParams } from 'expo-router';
import { useRef, useState } from 'react';
import { StyleSheet, View, type TextInputInstance } from 'react-native';
import { AuthLayout } from '@/components/auth/AuthLayout';
import { ConsentLine } from '@/components/auth/ConsentLine';
import { PasswordHint } from '@/components/auth/PasswordHint';
import { TextField } from '@/components/auth/TextField';
import { AppText } from '@/components/ui/AppText';
import { Button } from '@/components/ui/Button';
import { Pressable } from '@/components/ui/Pressable';
import { strings } from '@/content/strings';
import { authService } from '@/services/authService';
import { colors } from '@/theme';
import { authErrorMessage, checkEmail, checkNewPassword, hasErrors, type FieldErrors } from '@/utils/validation';

/** Name, email and password: nothing else is asked until a request needs it. Phone can be added later in Edit profile. */
export default function RegisterScreen() {
  const { next } = useLocalSearchParams<{ next?: string }>();
  const t = strings.auth;
  const emailRef = useRef<TextInputInstance>(null);
  const passwordRef = useRef<TextInputInstance>(null);
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<FieldErrors>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const submit = async () => {
    const found: FieldErrors = {
      fullName: fullName.trim() ? undefined : t.errors.name,
      email: checkEmail(email),
      password: checkNewPassword(password),
    };
    setErrors(found);
    setFormError(null);
    if (hasErrors(found)) return;

    setBusy(true);
    try {
      await authService.register({ fullName: fullName.trim(), email: email.trim(), password });
      router.push({ pathname: '/verify-email', params: next ? { email: email.trim(), next } : { email: email.trim() } });
    } catch (error) {
      setFormError(authErrorMessage(error));
    } finally {
      setBusy(false);
    }
  };

  return (
    <AuthLayout title={t.register.title} subtitle={t.register.subtitle}>
      <TextField
        label={t.fullName}
        placeholder={t.placeholders.name}
        value={fullName}
        onChangeText={setFullName}
        error={errors.fullName}
        autoCapitalize="words"
        autoComplete="name"
        textContentType="name"
        maxLength={150}
        returnKeyType="next"
        onSubmitEditing={() => emailRef.current?.focus()}
      />
      <TextField
        ref={emailRef}
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
        autoComplete="new-password"
        textContentType="newPassword"
        maxLength={100}
        returnKeyType="go"
        onSubmitEditing={submit}
      />
      <PasswordHint password={password} />

      {formError ? (
        <AppText variant="bodyStrong" color={colors.danger} accessibilityRole="alert">
          {formError}
        </AppText>
      ) : null}

      <Button label={t.register.submit} loading={busy} onPress={submit} />
      <ConsentLine />

      <View style={styles.footer}>
        <AppText variant="body" color={colors.inkSoft}>
          {t.register.haveAccount}
        </AppText>
        <Pressable
          style={styles.link}
          onPress={() => router.replace({ pathname: '/login', params: next ? { next } : {} })}
          accessibilityRole="link"
          accessibilityLabel={t.register.login}
        >
          <AppText variant="bodyStrong" color={colors.forest}>
            {t.register.login}
          </AppText>
        </Pressable>
      </View>
    </AuthLayout>
  );
}

const styles = StyleSheet.create({ link: { minHeight: 44, alignItems: 'center', justifyContent: 'center' }, footer: { alignItems: 'center' } });
