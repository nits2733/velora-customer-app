/**
 * Legal pages the store listings and Profile link to. A row is shown only when its address is set:
 * the release check (scripts/check-release-config.js) makes both mandatory for a shipped build.
 *
 * EXPO_PUBLIC_PRIVACY_URL, EXPO_PUBLIC_TERMS_URL: https links.
 */
const https = (value: string | undefined): string | null => (value && /^https:\/\/[^/\s]+/.test(value.trim()) ? value.trim() : null);

export const legalLinks = {
  privacy: https(process.env.EXPO_PUBLIC_PRIVACY_URL),
  terms: https(process.env.EXPO_PUBLIC_TERMS_URL),
};
