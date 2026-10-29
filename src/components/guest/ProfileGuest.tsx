import { Feather } from '@expo/vector-icons';
import Constants from 'expo-constants';
import { router } from 'expo-router';
import { useEffect } from 'react';
import { Linking, StyleSheet, View } from 'react-native';
import { SettingsRow } from '@/components/profile/SettingsRow';
import { AppText } from '@/components/ui/AppText';
import { legalLinks } from '@/config/links';
import { strings } from '@/content/strings';
import { useSupport } from '@/hooks/useSupport';
import { colors, screenGutter } from '@/theme';
import { track } from '@/utils/analytics';
import { HowItWorksRow } from './HowItWorksRow';
import { SignedOutHero } from './SignedOutHero';

const open = (url: string) => Linking.openURL(url).catch(() => {});

function GuestAvatar() {
  return (
    <View style={styles.avatar} accessibilityElementsHidden importantForAccessibility="no-hide-descendants">
      <Feather name="user" size={32} color={colors.forest} />
    </View>
  );
}

/**
 * The Profile tab for someone who is not logged in. Everything account-specific (stats, notifications,
 * edit, delete, log out) is left out; what remains is what a visitor can use: browse, get help, and read the legal pages.
 */
export function ProfileGuest() {
  const g = strings.guest;
  const support = useSupport();
  const version = Constants.expoConfig?.version ?? '';

  useEffect(() => {
    track({ name: 'signed_out_profile_viewed' });
  }, []);

  return (
    <SignedOutHero source="profile" next="/profile" card actionsFirst visual={<GuestAvatar />} headline={g.profile.headline} support={g.profile.support}>
      <HowItWorksRow onOpen={() => track({ name: 'browse_services_tapped', source: 'profile' })} />
      <View style={styles.list}>
        <SettingsRow
          icon="grid"
          label={g.browseServices}
          onPress={() => {
            track({ name: 'browse_services_tapped', source: 'profile' });
            router.push('/services');
          }}
        />
        <SettingsRow icon="compass" label={g.browseIdeas} onPress={() => router.push('/explore')} />
        <SettingsRow icon="life-buoy" label={g.rows.help} onPress={() => support.open('profile_guest')} />
        {legalLinks.privacy ? <SettingsRow icon="shield" label={g.rows.privacy} onPress={() => open(legalLinks.privacy!)} /> : null}
        {legalLinks.terms ? <SettingsRow icon="file-text" label={g.rows.terms} onPress={() => open(legalLinks.terms!)} /> : null}
      </View>
      {version ? (
        <AppText variant="caption" color={colors.inkSoft} style={styles.version}>
          {strings.profile.version(version)}
        </AppText>
      ) : null}
    </SignedOutHero>
  );
}

const styles = StyleSheet.create({
  avatar: { width: 72, height: 72, borderRadius: 36, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.forestSoft },
  list: { marginHorizontal: screenGutter, gap: 8 },
  version: { textAlign: 'center' },
});
