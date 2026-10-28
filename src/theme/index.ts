import { Platform, type ViewStyle } from 'react-native';

export { colors } from './colors';
export { fonts, textVariants, type TextVariant } from './typography';

export const spacing = { xs: 4, sm: 8, md: 12, lg: 16, xl: 20, xxl: 28, section: 32 } as const;
export const radius = { sm: 10, md: 16, lg: 20, xl: 28, pill: 999 } as const;
export const screenGutter = 16;

export const shadow: Record<'card' | 'floating', ViewStyle> = {
  card: Platform.select<ViewStyle>({
    ios: { shadowColor: '#1B2B22', shadowOpacity: 0.07, shadowRadius: 14, shadowOffset: { width: 0, height: 5 } },
    default: { elevation: 2 },
  })!,
  floating: Platform.select<ViewStyle>({
    ios: { shadowColor: '#0B1A12', shadowOpacity: 0.18, shadowRadius: 22, shadowOffset: { width: 0, height: 10 } },
    default: { elevation: 10 },
  })!,
};
