import { router } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { AuthLayout } from '@/components/auth/AuthLayout';
import { TextField } from '@/components/auth/TextField';
import { Avatar } from '@/components/requests/ProfessionalLine';
import { AppText } from '@/components/ui/AppText';
import { Button } from '@/components/ui/Button';
import { strings } from '@/content/strings';
import { useProfile, useUpdateProfile } from '@/hooks/useAccount';
import { accountService, type ProfileUpdate } from '@/services/accountService';
import { colors } from '@/theme';
import { track } from '@/utils/analytics';
import { pickAvatar } from '@/utils/avatar';
import { authErrorMessage, hasErrors, isValidPhone, type FieldErrors } from '@/utils/validation';
import { RequireSession } from '@/components/auth/RequireSession';

/** Name, phone and photo: the only account fields the backend lets a customer change. */
function EditProfileScreenContent() {
  const t = strings.editProfile;
  const profile = useProfile();
  const update = useUpdateProfile();
  // Null until the customer types, so the form shows the saved values without copying them into state.
  const [nameEdit, setName] = useState<string | null>(null);
  const [phoneEdit, setPhone] = useState<string | null>(null);
  const name = nameEdit ?? profile.data?.fullName ?? '';
  const phone = phoneEdit ?? profile.data?.phone ?? '';
  const [photoUri, setPhotoUri] = useState<string | null>(null);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [message, setMessage] = useState<{ text: string; error: boolean } | null>(null);
  const [busy, setBusy] = useState(false);

  const choosePhoto = async () => {
    setMessage(null);
    try {
      const pick = await pickAvatar();
      if (pick.status === 'picked') setPhotoUri(pick.uri);
      else if (pick.status === 'denied') setMessage({ text: t.photoPermission, error: true });
    } catch {
      setMessage({ text: t.photoFailed, error: true });
    }
  };

  const save = async () => {
    const current = profile.data;
    if (!current) return;
    const found: FieldErrors = {
      fullName: name.trim() ? undefined : strings.auth.errors.name,
      phone: isValidPhone(phone) ? undefined : strings.auth.errors.phone,
    };
    setErrors(found);
    setMessage(null);
    if (hasErrors(found)) return;

    // Send only what changed. The backend cannot clear a phone number, so an emptied field means "leave it".
    const changes: ProfileUpdate = {};
    if (name.trim() !== current.fullName) changes.fullName = name.trim();
    if (phone.trim() && phone.trim() !== (current.phone ?? '')) changes.phone = phone.trim();

    setBusy(true);
    try {
      if (photoUri) changes.avatarUrl = await accountService.uploadAvatar(photoUri);
      const fields = Object.keys(changes).length;
      if (fields === 0) {
        setMessage({ text: t.nothingChanged, error: false });
        return;
      }
      await update.mutateAsync(changes);
      track({ name: 'profile_updated', fields });
      router.back();
    } catch (error) {
      setMessage({ text: authErrorMessage(error), error: true });
    } finally {
      setBusy(false);
    }
  };

  const shownName = name || profile.data?.fullName || profile.data?.email || '';

  return (
    <AuthLayout title={t.title}>
      <View style={styles.photo}>
        <Avatar name={shownName} url={photoUri ?? profile.data?.avatarUrl ?? null} size={96} />
        <Button label={t.photo} variant="quiet" onPress={choosePhoto} style={styles.photoButton} />
        <AppText variant="caption" color={colors.inkSoft}>
          {t.photoHint}
        </AppText>
      </View>

      <TextField label={strings.auth.fullName} value={name} onChangeText={setName} error={errors.fullName} autoCapitalize="words" autoComplete="name" textContentType="name" maxLength={150} />
      <TextField label={strings.auth.phone} value={phone} onChangeText={setPhone} error={errors.phone} keyboardType="phone-pad" autoComplete="tel" textContentType="telephoneNumber" maxLength={20} />
      <View style={styles.email}>
        <AppText variant="captionStrong" color={colors.inkSoft}>
          {t.email}
        </AppText>
        <AppText variant="body">{profile.data?.email ?? ''}</AppText>
      </View>

      {message ? (
        <AppText variant="bodyStrong" color={message.error ? colors.danger : colors.forestDeep} accessibilityRole="alert">
          {message.text}
        </AppText>
      ) : null}
      <Button label={busy && photoUri ? t.photoUploading : t.save} loading={busy} onPress={save} />
    </AuthLayout>
  );
}

const styles = StyleSheet.create({
  photo: { alignItems: 'center', gap: 8 },
  photoButton: { alignSelf: 'stretch' },
  email: { gap: 2 },
});

export default function EditProfileScreen() {
  return (
    <RequireSession next='/edit-profile'>
      <EditProfileScreenContent />
    </RequireSession>
  );
}
