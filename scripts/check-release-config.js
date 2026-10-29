/**
 * Fails a release build when configuration that must not be left to chance is missing.
 * Run it in CI / before an EAS build: `npm run check:release-config`.
 *
 * - EXPO_PUBLIC_API_BASE_URL must be the real backend over https; otherwise a release build would call
 *   localhost on the customer's phone.
 * - Support must be configured: it is the only way to ask for account deletion until the backend has
 *   an endpoint. Keep the rules in step with src/config/support.ts (src/config/__tests__ checks both).
 * - EXPO_PUBLIC_PRIVACY_URL and EXPO_PUBLIC_TERMS_URL must be https links: stores require a privacy policy.
 */
const problems = [];
const env = process.env;

if (!/^https:\/\/[^/\s]+/.test(env.EXPO_PUBLIC_API_BASE_URL || '')) {
  problems.push('EXPO_PUBLIC_API_BASE_URL must be the backend URL, starting with https://.');
}

for (const name of ['EXPO_PUBLIC_PRIVACY_URL', 'EXPO_PUBLIC_TERMS_URL']) {
  if (!/^https:\/\/[^/\s]+/.test(env[name] || '')) problems.push(`${name} must be a link starting with https://.`);
}

const channel = env.EXPO_PUBLIC_SUPPORT_CHANNEL;
const value = (env.EXPO_PUBLIC_SUPPORT_VALUE || '').trim();
if (!['whatsapp', 'tel', 'mailto'].includes(channel)) {
  problems.push('EXPO_PUBLIC_SUPPORT_CHANNEL must be whatsapp, tel or mailto.');
} else if (channel === 'mailto' ? !value.includes('@') : value.replace(/\D/g, '').length < 7) {
  problems.push('EXPO_PUBLIC_SUPPORT_VALUE is missing or does not look like a ' + (channel === 'mailto' ? 'email address.' : 'phone number.'));
}

if (problems.length) {
  console.error('Release config check failed:\n - ' + problems.join('\n - '));
  process.exit(1);
}
console.log('Release config check passed.');
