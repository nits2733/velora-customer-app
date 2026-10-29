import { colors } from '../colors';
import { tonePalette } from '../tones';

function luminance(hex: string): number {
  const channel = (i: number) => {
    const v = parseInt(hex.slice(1 + i * 2, 3 + i * 2), 16) / 255;
    return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4;
  };
  return 0.2126 * channel(0) + 0.7152 * channel(1) + 0.0722 * channel(2);
}

export function contrast(a: string, b: string): number {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
}

describe('status tone contrast (WCAG AA is 4.5:1 for normal text)', () => {
  it.each(Object.entries(tonePalette))('%s text on its background', (_tone, { fg, bg }) => {
    expect(contrast(fg, bg)).toBeGreaterThanOrEqual(4.5);
  });

  it.each(Object.entries(tonePalette))('%s text on a white card', (_tone, { fg }) => {
    expect(contrast(fg, colors.white)).toBeGreaterThanOrEqual(4.5);
  });

  it('secondary and muted text on the page and card backgrounds', () => {
    expect(contrast(colors.inkSoft, colors.bg)).toBeGreaterThanOrEqual(4.5);
    expect(contrast(colors.inkSoft, colors.white)).toBeGreaterThanOrEqual(4.5);
    expect(contrast(colors.inkMuted, colors.white)).toBeGreaterThanOrEqual(4.5);
    expect(contrast(colors.inkMuted, colors.bg)).toBeGreaterThanOrEqual(4.5);
  });

  it('white on the primary button', () => {
    expect(contrast(colors.white, colors.forest)).toBeGreaterThanOrEqual(4.5);
  });
});
