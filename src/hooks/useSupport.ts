import { useCallback } from 'react';
import { Linking } from 'react-native';
import { supportConfig, supportUrl } from '@/config/support';
import { track } from '@/utils/analytics';

/**
 * Opens the configured support channel. `message` is prefilled where the channel allows it; keep it to
 * an id (never a name, phone or address).
 */
export function useSupport() {
  const open = useCallback((source: string, message?: string) => {
    track({ name: 'support_tapped', source });
    Linking.openURL(supportUrl(supportConfig, message)).catch(() => {});
  }, []);
  return { open, hours: supportConfig.hours };
}
