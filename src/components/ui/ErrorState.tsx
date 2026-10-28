import { Feather } from '@expo/vector-icons';
import { StyleSheet, View } from 'react-native';
import { ApiError } from '@/services/apiClient';
import { colors, radius, screenGutter } from '@/theme';
import { AppText } from './AppText';
import { Button } from './Button';

interface Props {
  error: ApiError;
  onRetry: () => void;
}

export function ErrorState({ error, onRetry }: Props) {
  const title = error.isNetwork ? 'You are offline' : 'Something went wrong';
  return (
    <View style={styles.wrap}>
      <Feather name={error.isNetwork ? 'wifi-off' : 'alert-circle'} size={22} color={colors.clay} />
      <AppText variant="bodyStrong">{title}</AppText>
      <AppText variant="caption" color={colors.inkSoft} style={styles.msg}>
        {error.message}
      </AppText>
      <Button label="Try again" onPress={onRetry} style={styles.btn} />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    marginHorizontal: screenGutter,
    padding: 20,
    borderRadius: radius.lg,
    backgroundColor: colors.surface,
    alignItems: 'center',
    gap: 6,
  },
  msg: { textAlign: 'center' },
  btn: { marginTop: 8, alignSelf: 'stretch' },
});
