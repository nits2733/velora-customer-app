import { Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

/** Native devices report the real status-bar / notch inset; web reports 0, so it gets a small floor. */
const WEB_TOP_FLOOR = Platform.OS === 'web' ? 16 : 0;

/** Top padding that clears the status bar / cutout, plus breathing room. */
export function useTopPad(extra = 8) {
  const { top } = useSafeAreaInsets();
  return Math.max(top, WEB_TOP_FLOOR) + extra;
}
