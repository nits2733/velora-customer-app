import type { TextStyle } from 'react-native';

export const fonts = {
  serif: 'PlayfairDisplay_600SemiBold',
  serifBold: 'PlayfairDisplay_700Bold',
  sans: 'PlusJakartaSans_400Regular',
  sansMedium: 'PlusJakartaSans_500Medium',
  sansSemi: 'PlusJakartaSans_600SemiBold',
  sansBold: 'PlusJakartaSans_700Bold',
} as const;

export type TextVariant =
  | 'display' | 'h1' | 'h2' | 'h3' | 'title' | 'body' | 'bodyStrong'
  | 'caption' | 'captionStrong' | 'eyebrow' | 'button';

export const textVariants: Record<TextVariant, TextStyle> = {
  display: { fontFamily: fonts.serif, fontSize: 28, lineHeight: 36 },
  h1: { fontFamily: fonts.serif, fontSize: 26, lineHeight: 33 },
  h2: { fontFamily: fonts.serif, fontSize: 22, lineHeight: 28 },
  h3: { fontFamily: fonts.serif, fontSize: 18, lineHeight: 24 },
  title: { fontFamily: fonts.sansSemi, fontSize: 16, lineHeight: 22 },
  body: { fontFamily: fonts.sans, fontSize: 14, lineHeight: 20 },
  bodyStrong: { fontFamily: fonts.sansSemi, fontSize: 14, lineHeight: 20 },
  caption: { fontFamily: fonts.sans, fontSize: 12, lineHeight: 17 },
  captionStrong: { fontFamily: fonts.sansSemi, fontSize: 12, lineHeight: 17 },
  eyebrow: { fontFamily: fonts.sansBold, fontSize: 11, lineHeight: 15, letterSpacing: 1, textTransform: 'uppercase' },
  button: { fontFamily: fonts.sansBold, fontSize: 14, lineHeight: 18 },
};
