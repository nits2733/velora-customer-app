import Svg, { Circle, Path, Rect } from 'react-native-svg';
import { colors } from '@/theme';

/** A small house with a tick: decorative, drawn in code so it needs no download and is there on first paint. */
export function HeroIllustration({ size = 112 }: { size?: number }) {
  return (
    <Svg
      width={size}
      height={size}
      viewBox="0 0 120 120"
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
    >
      <Circle cx="60" cy="60" r="56" fill={colors.forestSoft} />
      <Path d="M30 62 L60 36 L90 62" stroke={colors.forest} strokeWidth={5} strokeLinecap="round" strokeLinejoin="round" fill="none" />
      <Rect x="38" y="62" width="44" height="30" rx="4" fill={colors.surface} stroke={colors.forest} strokeWidth={4} />
      <Rect x="55" y="74" width="10" height="18" rx="2" fill={colors.forest} />
      <Circle cx="92" cy="30" r="14" fill={colors.forest} />
      <Path d="M85 30 L90 35 L99 25" stroke={colors.white} strokeWidth={4} fill="none" strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}
