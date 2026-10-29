import { Redirect, type Href } from 'expo-router';
import type { ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';
import { Skeleton } from '@/components/ui/Skeleton';
import { useSession } from '@/session/useSession';
import { colors, radius, screenGutter } from '@/theme';

interface Props {
  /** Where to come back to after logging in (an in-app path). */
  next: string;
  children: ReactNode;
}

/**
 * Wraps a screen that only makes sense for a signed-in customer. While the saved session is being
 * restored it shows a placeholder; a guest is sent to log in and then returned here. Because the
 * children are not rendered until then, none of their data requests run for a guest.
 */
export function RequireSession({ next, children }: Props) {
  const { status } = useSession();
  if (status === 'loading') {
    return (
      <View style={styles.wrap}>
        <Skeleton height={44} width={44} r={22} />
        <Skeleton height={32} width="60%" />
        <Skeleton height={140} r={radius.lg} />
      </View>
    );
  }
  if (status === 'signedOut') return <Redirect href={{ pathname: '/login', params: { next } } as Href} />;
  return <>{children}</>;
}

const styles = StyleSheet.create({ wrap: { flex: 1, backgroundColor: colors.bg, padding: screenGutter, paddingTop: 60, gap: 14 } });
