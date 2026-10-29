import { Linking } from 'react-native';
import { AppText } from '@/components/ui/AppText';
import { legalLinks } from '@/config/links';
import { strings } from '@/content/strings';
import { colors } from '@/theme';

const open = (url: string) => Linking.openURL(url).catch(() => {});
const c = strings.auth.consent;

/**
 * "By creating an account you agree to ...". Shown only when the Terms and Privacy pages exist to link
 * to: a consent line pointing nowhere is worse than none. The release check requires both links.
 */
export function ConsentLine() {
  const { terms, privacy } = legalLinks;
  if (!terms || !privacy) return null;
  return (
    <AppText variant="caption" color={colors.inkSoft} style={{ textAlign: 'center' }}>
      {c.prefix}
      <AppText variant="captionStrong" color={colors.forest} accessibilityRole="link" onPress={() => open(terms)} style={{ textDecorationLine: 'underline' }}>
        {c.terms}
      </AppText>
      {c.and}
      <AppText variant="captionStrong" color={colors.forest} accessibilityRole="link" onPress={() => open(privacy)} style={{ textDecorationLine: 'underline' }}>
        {c.privacy}
      </AppText>
      {c.suffix}
    </AppText>
  );
}
