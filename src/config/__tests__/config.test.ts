import { spawnSync } from 'node:child_process';
import path from 'node:path';
import { capabilities } from '../capabilities';
import { assertSupportConfig, loadSupportConfig, parseSupportConfig, supportUrl } from '../support';

describe('support config', () => {
  it('parses each channel and trims the optional hours', () => {
    expect(parseSupportConfig('whatsapp', '+91 98765 43210', ' Mon-Sat, 9 am to 7 pm ')).toEqual({
      channel: 'whatsapp', value: '+91 98765 43210', hours: 'Mon-Sat, 9 am to 7 pm',
    });
    expect(parseSupportConfig('tel', '040 1234 5678')).toMatchObject({ channel: 'tel' });
    expect(parseSupportConfig('mailto', 'help@velora.example')).toMatchObject({ channel: 'mailto', hours: undefined });
  });

  it.each([
    [undefined, undefined],
    ['whatsapp', ''],
    ['fax', '12345678'],
    ['mailto', 'not-an-email'],
    ['tel', '12'],
  ])('rejects %s / %s', (channel, value) => {
    expect(parseSupportConfig(channel, value)).toBeNull();
  });

  it('fails loudly in a release build with nothing configured, instead of hiding the help card', () => {
    expect(() => assertSupportConfig(false)).toThrow(/Support is not configured/);
  });

  it('falls back to a placeholder in development only', () => {
    expect(loadSupportConfig(true)).not.toBeNull();
    expect(loadSupportConfig(false)).toBeNull();
  });

  it('builds a link per channel and keeps the prefilled message to what it is given', () => {
    expect(supportUrl({ channel: 'whatsapp', value: '+91 98765 43210' }, 'Hi')).toBe('https://wa.me/919876543210?text=Hi');
    expect(supportUrl({ channel: 'tel', value: '+91 40 1234 5678' })).toBe('tel:+914012345678');
    expect(supportUrl({ channel: 'mailto', value: 'help@velora.example' }, 'Delete my account (ID 101)')).toBe(
      'mailto:help@velora.example?subject=Velora%20support&body=Delete%20my%20account%20(ID%20101)',
    );
  });
});

describe('scripts/check-release-config.js', () => {
  const script = path.resolve(__dirname, '../../../scripts/check-release-config.js');
  const good = {
    EXPO_PUBLIC_API_BASE_URL: 'https://api.velora.example',
    EXPO_PUBLIC_PRIVACY_URL: 'https://velora.example/privacy',
    EXPO_PUBLIC_TERMS_URL: 'https://velora.example/terms',
    EXPO_PUBLIC_SUPPORT_CHANNEL: 'mailto',
    EXPO_PUBLIC_SUPPORT_VALUE: 'help@velora.example',
  };
  const run = (env: Record<string, string>) =>
    spawnSync(process.execPath, [script], { env: { PATH: process.env.PATH ?? '', ...env } as unknown as NodeJS.ProcessEnv, encoding: 'utf8' });

  it('fails when nothing is configured, and says what is missing', () => {
    const result = run({});
    expect(result.status).toBe(1);
    expect(result.stderr).toContain('EXPO_PUBLIC_API_BASE_URL');
    expect(result.stderr).toContain('EXPO_PUBLIC_SUPPORT_CHANNEL');
  });

  it('fails when only the API address is set', () => {
    expect(run({ EXPO_PUBLIC_API_BASE_URL: 'https://api.velora.example' }).status).toBe(1);
  });

  it('rejects a plain http or missing backend address, so a release never calls localhost', () => {
    expect(run({ ...good, EXPO_PUBLIC_API_BASE_URL: 'http://192.168.1.5:8080' }).status).toBe(1);
    const { EXPO_PUBLIC_API_BASE_URL: _omit, ...withoutUrl } = good;
    expect(run(withoutUrl).status).toBe(1);
  });

  it('requires privacy and terms links', () => {
    const { EXPO_PUBLIC_PRIVACY_URL: _a, ...noPrivacy } = good;
    const { EXPO_PUBLIC_TERMS_URL: _b, ...noTerms } = good;
    expect(run(noPrivacy).status).toBe(1);
    expect(run(noTerms).status).toBe(1);
  });

  it('passes with the backend address, support channel and legal links', () => {
    expect(run(good).status).toBe(0);
  });

  it('agrees with the app on what a valid value is', () => {
    const cases: [string, string][] = [['mailto', 'nope'], ['tel', '12'], ['whatsapp', '+91 98765 43210'], ['mailto', 'a@b.co']];
    for (const [channel, value] of cases) {
      const script_ok = run({ ...good, EXPO_PUBLIC_SUPPORT_CHANNEL: channel, EXPO_PUBLIC_SUPPORT_VALUE: value }).status === 0;
      expect(script_ok).toBe(parseSupportConfig(channel, value) !== null);
    }
  });
});

describe('capabilities', () => {
  it('ships with every unbacked feature off', () => {
    expect(Object.values(capabilities).every((enabled) => enabled === false)).toBe(true);
    expect(Object.keys(capabilities).sort()).toEqual(
      ['addresses', 'chat', 'documents', 'loyaltyTier', 'milestones', 'payments', 'push', 'renders3D', 'reschedule', 'savedDesigns', 'siteVisits'],
    );
  });
});
