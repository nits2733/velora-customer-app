import { router } from 'expo-router';
import Constants from 'expo-constants';
import { useMemo, useState } from 'react';
import { Linking, RefreshControl, ScrollView, StyleSheet, View } from 'react-native';
import { ProfileGuest } from '@/components/guest/ProfileGuest';
import { PageHeader } from '@/components/layout/PageHeader';
import { useTabBarSpace } from '@/components/layout/FloatingTabBar';
import { SettingsRow } from '@/components/profile/SettingsRow';
import { ConfirmSheet } from '@/components/requests/ConfirmSheet';
import { Avatar } from '@/components/requests/ProfessionalLine';
import { RequestsError } from '@/components/requests/states';
import { AppText } from '@/components/ui/AppText';
import { Button } from '@/components/ui/Button';
import { Skeleton } from '@/components/ui/Skeleton';
import { legalLinks } from '@/config/links';
import { supportConfig } from '@/config/support';
import { strings } from '@/content/strings';
import { useProfile, useUnreadCount } from '@/hooks/useAccount';
import { useIsOffline, useRequestCounts } from '@/hooks/useRequests';
import { useSupport } from '@/hooks/useSupport';
import { useSession } from '@/session/useSession';
import { colors, radius, screenGutter, shadow } from '@/theme';
import { track } from '@/utils/analytics';
import { formatDateTime } from '@/utils/format';
import { tabCounts } from '@/utils/requestState';

type Sheet = 'logout' | 'delete' | null;

const open = (url: string) => Linking.openURL(url).catch(() => {});

export default function ProfileScreen() {
  const session = useSession();
  const tabBarSpace = useTabBarSpace();
  const support = useSupport();
  const offline = useIsOffline();
  const t = strings.profile;
  const signedIn = session.status === 'signedIn';

  const profile = useProfile(signedIn);
  const counts = useRequestCounts(signedIn);
  const unread = useUnreadCount(signedIn);
  const [sheet, setSheet] = useState<Sheet>(null);
  const [busy, setBusy] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const totals = useMemo(() => (counts.data ? tabCounts(counts.data.byStatus) : null), [counts.data]);
  const completed = counts.data?.byStatus.COMPLETED ?? null;
  const version = Constants.expoConfig?.version ?? '';
  const supportHours = supportConfig.hours;

  const refresh = async () => {
    setRefreshing(true);
    await Promise.allSettled([profile.refetch(), counts.refetch(), unread.refetch()]);
    setRefreshing(false);
  };

  const logOut = async () => {
    setBusy(true);
    track({ name: 'auth_signed_out' });
    await session.signOut();
    setBusy(false);
    setSheet(null);
    router.replace('/');
  };

  const requestDeletion = () => {
    // The backend has no deletion endpoint yet, so the request goes to support, with the account ID only.
    track({ name: 'account_deletion_requested' });
    support.open('delete_account', strings.deleteAccount.message(session.user?.id ?? 0));
    setSheet(null);
  };

  if (session.status === 'loading') {
    return (
      <View style={styles.root}>
        <PageHeader title={t.title} />
        <View style={styles.guest}>
          <Skeleton height={120} r={radius.lg} />
          <Skeleton height={80} r={radius.lg} />
        </View>
      </View>
    );
  }

  if (!signedIn) {
    return (
      <ScrollView style={styles.root} contentContainerStyle={{ paddingBottom: tabBarSpace + 28, gap: 16, flexGrow: 1 }} showsVerticalScrollIndicator={false}>
        <PageHeader title={t.title} />
        <ProfileGuest />
      </ScrollView>
    );
  }

  const user = profile.data;
  const name = user?.fullName || session.user?.fullName || '';
  const email = user?.email ?? session.user?.email ?? '';

  return (
    <View style={styles.root}>
      <ScrollView
        contentContainerStyle={{ paddingBottom: tabBarSpace + 28, gap: 14 }}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={refresh} tintColor={colors.forest} />}
        showsVerticalScrollIndicator={false}
      >
        <PageHeader title={t.title} />

        {profile.isError && !user ? (
          <RequestsError offline={offline} onRetry={refresh} />
        ) : (
          <View style={styles.card}>
            <View style={styles.identity}>
              <Avatar name={name || email} url={user?.avatarUrl ?? null} size={72} />
              <View style={styles.identityCopy}>
                {profile.isPending ? (
                  <Skeleton height={24} width="70%" />
                ) : (
                  <AppText variant="h2" numberOfLines={2}>
                    {name}
                  </AppText>
                )}
                <AppText variant="body" color={colors.inkSoft} numberOfLines={1}>
                  {email}
                </AppText>
                {user?.phone ? (
                  <AppText variant="body" color={colors.inkSoft}>
                    {user.phone}
                  </AppText>
                ) : null}
                {user?.createdAt ? (
                  <AppText variant="caption" color={colors.inkSoft}>
                    {t.memberSince(formatDateTime(user.createdAt).split(',')[0])}
                  </AppText>
                ) : null}
              </View>
            </View>
            <Button label={t.edit} variant="quiet" onPress={() => router.push('/edit-profile')} />
          </View>
        )}

        <View style={styles.stats}>
          <View style={styles.stat} accessible accessibilityLabel={`${t.stats.active}: ${totals?.active ?? 'loading'}`}>
            <AppText variant="h2">{totals ? totals.active : '–'}</AppText>
            <AppText variant="caption" color={colors.inkSoft}>
              {t.stats.active}
            </AppText>
          </View>
          <View style={styles.stat} accessible accessibilityLabel={`${t.stats.completed}: ${completed ?? 'loading'}`}>
            <AppText variant="h2">{completed ?? '–'}</AppText>
            <AppText variant="caption" color={colors.inkSoft}>
              {t.stats.completed}
            </AppText>
          </View>
        </View>

        <View style={styles.list}>
          <SettingsRow icon="clipboard" label={t.rows.requests} onPress={() => router.push('/requests')} />
          <SettingsRow
            icon="bell"
            label={t.rows.notifications}
            value={unread.data ? t.unread(unread.data) : undefined}
            onPress={() => router.push('/notifications')}
          />
          <SettingsRow icon="life-buoy" label={t.rows.help} onPress={() => support.open('profile_row')} />
          <SettingsRow icon="lock" label={t.rows.password} onPress={() => router.push('/change-password')} />
          {legalLinks.privacy ? <SettingsRow icon="shield" label={t.rows.privacy} onPress={() => open(legalLinks.privacy!)} /> : null}
          {legalLinks.terms ? <SettingsRow icon="file-text" label={t.rows.terms} onPress={() => open(legalLinks.terms!)} /> : null}
          <SettingsRow icon="trash-2" label={t.rows.delete} destructive onPress={() => setSheet('delete')} />
          <SettingsRow icon="log-out" label={t.rows.logout} onPress={() => setSheet('logout')} />
        </View>

        <View style={styles.support}>
          <AppText variant="h3" accessibilityRole="header">
            {t.support.title}
          </AppText>
          <AppText variant="body" color={colors.inkSoft}>
            {t.support.body}
          </AppText>
          {supportHours ? (
            <AppText variant="caption" color={colors.inkSoft}>
              {strings.detail.supportHours(supportHours)}
            </AppText>
          ) : null}
          <Button label={t.support.action} variant="quiet" onPress={() => support.open('profile_card')} />
        </View>

        {version ? (
          <AppText variant="caption" color={colors.inkSoft} style={styles.version}>
            {t.version(version)}
          </AppText>
        ) : null}
      </ScrollView>

      <ConfirmSheet
        visible={sheet === 'logout'}
        title={t.logoutConfirm.title}
        body={t.logoutConfirm.body}
        confirmLabel={t.logoutConfirm.confirm}
        dismissLabel={t.logoutConfirm.keep}
        busy={busy}
        onClose={() => setSheet(null)}
        onConfirm={logOut}
      />
      <ConfirmSheet
        visible={sheet === 'delete'}
        title={strings.deleteAccount.title}
        body={strings.deleteAccount.body}
        confirmLabel={strings.deleteAccount.confirm}
        dismissLabel={strings.deleteAccount.keep}
        destructive
        onClose={() => setSheet(null)}
        onConfirm={requestDeletion}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.bg },
  guest: { marginTop: 16, gap: 12 },
  card: { marginHorizontal: screenGutter, padding: 16, gap: 12, borderRadius: radius.lg, backgroundColor: colors.surface, ...shadow.card },
  identity: { flexDirection: 'row', gap: 14, alignItems: 'center' },
  identityCopy: { flex: 1, gap: 2 },
  stats: { marginHorizontal: screenGutter, flexDirection: 'row', gap: 12 },
  stat: { flex: 1, padding: 16, gap: 2, borderRadius: radius.lg, backgroundColor: colors.surface, ...shadow.card },
  list: { marginHorizontal: screenGutter, gap: 8 },
  support: { marginHorizontal: screenGutter, padding: 16, gap: 10, borderRadius: radius.lg, backgroundColor: colors.surfaceMuted },
  version: { textAlign: 'center' },
});
