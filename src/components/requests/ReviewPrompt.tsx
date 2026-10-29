import { Feather } from '@expo/vector-icons';
import { useState } from 'react';
import { StyleSheet, TextInput, View } from 'react-native';
import { AppText } from '@/components/ui/AppText';
import { Button } from '@/components/ui/Button';
import { Pressable } from '@/components/ui/Pressable';
import { strings } from '@/content/strings';
import { colors, fonts, radius, screenGutter, shadow } from '@/theme';

interface Props {
  busy: boolean;
  error: string | null;
  onSubmit: (rating: number, comment?: string) => void;
}

/** Shown once, after the work is completed and until the customer has rated it. */
export function ReviewPrompt({ busy, error, onSubmit }: Props) {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const r = strings.detail.review;

  return (
    <View style={styles.card}>
      <AppText variant="h3" accessibilityRole="header">
        {r.title}
      </AppText>
      <AppText variant="body" color={colors.inkSoft}>
        {r.body}
      </AppText>

      <View style={styles.stars} accessibilityRole="radiogroup">
        {[1, 2, 3, 4, 5].map((n) => (
          <Pressable
            key={n}
            style={styles.star}
            onPress={() => setRating(n)}
            accessibilityRole="radio"
            accessibilityState={{ checked: rating === n }}
            accessibilityLabel={r.stars(n)}
          >
            <Feather name="star" size={28} color={n <= rating ? colors.forest : colors.inkMuted} style={n <= rating ? styles.filled : undefined} />
          </Pressable>
        ))}
      </View>

      <TextInput
        value={comment}
        onChangeText={(text) => setComment(text.slice(0, 500))}
        placeholder={r.comment}
        placeholderTextColor={colors.inkMuted}
        multiline
        style={styles.input}
        accessibilityLabel={r.comment}
      />

      {error ? (
        <AppText variant="bodyStrong" color={colors.danger} accessibilityRole="alert">
          {error}
        </AppText>
      ) : null}
      <Button label={r.submit} loading={busy} onPress={() => rating > 0 && onSubmit(rating, comment)} style={rating === 0 ? styles.idle : undefined} />
    </View>
  );
}

const styles = StyleSheet.create({
  card: { marginHorizontal: screenGutter, padding: 16, gap: 12, borderRadius: radius.lg, backgroundColor: colors.surface, ...shadow.card },
  stars: { flexDirection: 'row', justifyContent: 'space-between' },
  star: { width: 52, height: 48, alignItems: 'center', justifyContent: 'center' },
  filled: { fontWeight: '700' },
  input: { minHeight: 72, padding: 12, borderRadius: radius.md, borderWidth: 1, borderColor: colors.border, fontFamily: fonts.sans, fontSize: 14, color: colors.ink, textAlignVertical: 'top' },
  idle: { opacity: 0.6 },
});
