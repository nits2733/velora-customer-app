import { Text, type TextProps } from 'react-native';
import { colors, textVariants, type TextVariant } from '@/theme';

interface Props extends TextProps {
  variant?: TextVariant;
  color?: string;
}

export function AppText({ variant = 'body', color = colors.ink, style, ...rest }: Props) {
  return <Text {...rest} style={[textVariants[variant], { color }, style]} />;
}
