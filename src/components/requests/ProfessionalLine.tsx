import { Feather } from '@expo/vector-icons';
import { StyleSheet, View } from 'react-native';
import { AppText } from '@/components/ui/AppText';
import { RemoteImage } from '@/components/ui/RemoteImage';
import { strings } from '@/content/strings';
import { colors } from '@/theme';
import type { Professional } from '@/types/requests';

const initials = (name: string) =>
  name.split(/\s+/).filter(Boolean).slice(0, 2).map((part) => part[0]?.toUpperCase()).join('');

export function Avatar({ name, url, size = 36 }: { name: string; url: string | null; size?: number }) {
  return url ? (
    <RemoteImage src={url} width={size} height={size} style={{ width: size, height: size, borderRadius: size / 2 }} accessibilityLabel={name} />
  ) : (
    <View style={[styles.initials, { width: size, height: size, borderRadius: size / 2 }]} accessibilityLabel={name}>
      <AppText variant="captionStrong" color={colors.forestDeep}>
        {initials(name)}
      </AppText>
    </View>
  );
}

/** Photo, name and rating of the assigned professional. No phone number: contact goes through support. */
export function ProfessionalLine({ professional }: { professional: Professional }) {
  const { fullName, specialization, averageRating, ratingCount, avatarUrl } = professional;
  return (
    <View style={styles.row}>
      <Avatar name={fullName} url={avatarUrl} />
      <View style={styles.copy}>
        <AppText variant="bodyStrong" numberOfLines={1}>
          {fullName}
        </AppText>
        {specialization ? (
          <AppText variant="caption" color={colors.inkSoft} numberOfLines={1}>
            {specialization}
          </AppText>
        ) : null}
      </View>
      {averageRating !== null && ratingCount > 0 ? (
        <View style={styles.rating} accessible accessibilityLabel={`Rated ${averageRating.toFixed(1)} from ${ratingCount} reviews`}>
          <Feather name="star" size={13} color={colors.forest} />
          <AppText variant="captionStrong" color={colors.ink}>
            {strings.requests.rating(averageRating, ratingCount)}
          </AppText>
        </View>
      ) : null}
    </View>
  );
}

/** The list-card version: small avatar, name and rating on a single line. */
export function ProfessionalInline({ professional }: { professional: Professional }) {
  const { fullName, averageRating, ratingCount, avatarUrl } = professional;
  return (
    <View style={styles.inline}>
      <Avatar name={fullName} url={avatarUrl} size={24} />
      <AppText variant="bodyStrong" numberOfLines={1} style={styles.copy}>
        {fullName}
      </AppText>
      {averageRating !== null && ratingCount > 0 ? (
        <View style={styles.rating} accessible accessibilityLabel={`Rated ${averageRating.toFixed(1)} from ${ratingCount} reviews`}>
          <Feather name="star" size={13} color={colors.forest} />
          <AppText variant="captionStrong" color={colors.ink}>
            {strings.requests.rating(averageRating, ratingCount)}
          </AppText>
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  inline: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  copy: { flex: 1 },
  rating: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  initials: { backgroundColor: colors.forestSoft, alignItems: 'center', justifyContent: 'center' },
});
