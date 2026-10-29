import { router } from 'expo-router';
import type { ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';
import { AppText } from '@/components/ui/AppText';
import { Button } from '@/components/ui/Button';
import { Pressable } from '@/components/ui/Pressable';
import { strings } from '@/content/strings';
import { colors, radius, screenGutter, shadow } from '@/theme';
import { track } from '@/utils/analytics';

export type GuestSource = 'requests' | 'profile';

interface Props {
  source: GuestSource;
  /** Where to land after logging in or signing up: the screen the guest came from. */
  next: string;
  visual: ReactNode;
  headline: string;
  support: string;
  /** Draws the hero as a card (Profile) instead of open on the page (Requests). */
  card?: boolean;
  /** Puts the buttons straight under the support line and `children` after them. Default: buttons last. */
  actionsFirst?: boolean;
  /** A text link under the buttons so a guest who is not ready to sign up still has somewhere to go. */
  browseLink?: boolean;
  children?: ReactNode;
}

/**
 * The shared shape of both signed-out tabs: a visual, a headline, one line of support, the two sign-in
 * buttons, and whatever sits between or after them. The two screens differ only in the content they
 * pass, so they cannot drift apart. Motion is a single short fade-in, plus press feedback on buttons.
 */
export function SignedOutHero({ source, next, visual, headline, support, card, actionsFirst, browseLink, children }: Props) {
  const t = strings.guest;

  const actions = (
    <View style={styles.actions}>
      <Button
        label={t.login}
        onPress={() => {
          track({ name: 'login_tapped', source });
          router.push({ pathname: '/login', params: { next } });
        }}
      />
      <Button
        label={t.register}
        variant="quiet"
        onPress={() => {
          track({ name: 'signup_tapped', source });
          router.push({ pathname: '/register', params: { next } });
        }}
      />
      {browseLink ? (
        <Pressable
          style={styles.link}
          onPress={() => {
            track({ name: 'browse_services_tapped', source });
            router.push('/services');
          }}
          accessibilityRole="link"
          accessibilityLabel={t.browseServices}
        >
          <AppText variant="bodyStrong" color={colors.forest}>
            {t.browseServices}
          </AppText>
        </Pressable>
      ) : null}
    </View>
  );

  return (
    <Animated.View entering={FadeIn.duration(250)} style={styles.wrap}>
      <View style={[styles.hero, card && styles.card]}>
        <View style={styles.visual}>{visual}</View>
        <AppText variant="h2" style={styles.center} accessibilityRole="header">
          {headline}
        </AppText>
        <AppText variant="body" color={colors.inkSoft} style={styles.center}>
          {support}
        </AppText>
        {actionsFirst ? actions : null}
      </View>
      {children}
      {actionsFirst ? null : actions}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  wrap: { gap: 20 },
  hero: { marginHorizontal: screenGutter, alignItems: 'stretch', gap: 10 },
  card: { padding: 20, borderRadius: radius.lg, backgroundColor: colors.surface, ...shadow.card },
  visual: { alignItems: 'center', marginBottom: 4 },
  center: { textAlign: 'center' },
  actions: { marginHorizontal: screenGutter, gap: 10, marginTop: 6 },
  link: { minHeight: 44, alignItems: 'center', justifyContent: 'center' },
});
