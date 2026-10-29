/**
 * Where "Need help?", "Contact support" and the account-deletion request send the user.
 *
 * EXPO_PUBLIC_SUPPORT_CHANNEL = "whatsapp" | "tel" | "mailto"
 * EXPO_PUBLIC_SUPPORT_VALUE   = number (whatsapp, tel) or address (mailto)
 * EXPO_PUBLIC_SUPPORT_HOURS   = optional, e.g. "Mon-Sat, 9 am to 7 pm". Shown only if set, so only
 *                               state hours the team can staff.
 *
 * Release builds must configure this: the help card is also the only way to ask for account deletion
 * until the backend has an endpoint. `assertSupportConfig` runs at startup, and
 * scripts/check-release-config.js runs it in CI.
 */
export type SupportChannel = 'whatsapp' | 'tel' | 'mailto';

export interface SupportConfig {
  channel: SupportChannel;
  value: string;
  hours?: string;
}

const CHANNELS: readonly SupportChannel[] = ['whatsapp', 'tel', 'mailto'];

/** Parses the env values; returns null when the config is absent or invalid. */
export function parseSupportConfig(
  channel: string | undefined,
  value: string | undefined,
  hours?: string,
): SupportConfig | null {
  const v = value?.trim();
  if (!v || !CHANNELS.includes(channel as SupportChannel)) return null;
  if (channel === 'mailto' && !v.includes('@')) return null;
  if (channel !== 'mailto' && v.replace(/\D/g, '').length < 7) return null;
  return { channel: channel as SupportChannel, value: v, hours: hours?.trim() || undefined };
}

const DEV_FALLBACK: SupportConfig = { channel: 'mailto', value: 'support@velora.invalid' };

export function loadSupportConfig(dev: boolean = __DEV__): SupportConfig | null {
  const parsed = parseSupportConfig(
    process.env.EXPO_PUBLIC_SUPPORT_CHANNEL,
    process.env.EXPO_PUBLIC_SUPPORT_VALUE,
    process.env.EXPO_PUBLIC_SUPPORT_HOURS,
  );
  return parsed ?? (dev ? DEV_FALLBACK : null);
}

/** Throws in a release build when support is not configured. */
export function assertSupportConfig(dev: boolean = __DEV__): SupportConfig {
  const config = loadSupportConfig(dev);
  if (!config) {
    throw new Error(
      'Support is not configured. Set EXPO_PUBLIC_SUPPORT_CHANNEL (whatsapp | tel | mailto) and EXPO_PUBLIC_SUPPORT_VALUE.',
    );
  }
  return config;
}

export const supportConfig: SupportConfig = assertSupportConfig();

/** The URL to open. `message` is prefilled where the channel supports it; never put personal data in it beyond an id. */
export function supportUrl(config: SupportConfig, message?: string): string {
  const text = message ? encodeURIComponent(message) : '';
  switch (config.channel) {
    case 'whatsapp':
      return `https://wa.me/${config.value.replace(/\D/g, '')}${text ? `?text=${text}` : ''}`;
    case 'tel':
      return `tel:${config.value.replace(/[^\d+]/g, '')}`;
    case 'mailto':
      return `mailto:${config.value}${text ? `?subject=${encodeURIComponent('Velora support')}&body=${text}` : ''}`;
  }
}
