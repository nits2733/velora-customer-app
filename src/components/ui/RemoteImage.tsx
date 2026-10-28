import { Image, type ImageProps } from 'expo-image';
import { StyleSheet, type StyleProp } from 'react-native';
import { colors } from '@/theme';
import { optimizedImage } from '@/utils/cloudinary';

interface Props extends Omit<ImageProps, 'source' | 'style'> {
  src: string;
  /** Rendered width in dp - used to request a right-sized image. */
  width: number;
  height?: number;
  style?: StyleProp<import('react-native').ImageStyle>;
}

/** expo-image with disk+memory caching, fade-in and Cloudinary-optimized delivery. */
export function RemoteImage({ src, width, height, style, ...rest }: Props) {
  return (
    <Image
      {...rest}
      source={{ uri: optimizedImage(src, { width, height }) }}
      style={[styles.base, style]}
      contentFit="cover"
      transition={250}
      cachePolicy="memory-disk"
      recyclingKey={src}
    />
  );
}

const styles = StyleSheet.create({ base: { backgroundColor: colors.surfaceMuted } });
