import { Feather } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router, useLocalSearchParams } from 'expo-router';
import { useMemo } from 'react';
import { ScrollView, StyleSheet, View, useWindowDimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { AppText } from '@/components/ui/AppText';
import { Button } from '@/components/ui/Button';
import { ErrorState } from '@/components/ui/ErrorState';
import { Pressable } from '@/components/ui/Pressable';
import { RemoteImage } from '@/components/ui/RemoteImage';
import { Skeleton } from '@/components/ui/Skeleton';
import { IMG } from '@/content/home';
import { FULL_HOME_ID, defaultServiceIcon, fullHome, serviceMeta, steps, type IconName } from '@/content/services';
import { useAsync } from '@/hooks/useAsync';
import { categoryService } from '@/services/categoryService';
import { colors, radius, screenGutter } from '@/theme';

const HERO_H = 260;

interface Detail {
  name: string;
  description: string;
  icon: IconName;
  /** Bulleted scope; only facts the API provides. */
  scopeTitle: string;
  scope: string[];
}

/**
 * Shared detail template for every service. Content comes from the categories API; there is no
 * per-service detail endpoint. BACKEND GAP: booking (POST /api/bookings) needs a signed-in
 * CUSTOMER and this app has no auth or request screens yet, so the next step is not wired.
 */
export default function ServiceDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const categories = useAsync(categoryService.list);

  const detail = useMemo<Detail | null>(() => {
    const list = categories.data ?? [];
    if (id === FULL_HOME_ID) {
      return {
        name: fullHome.name,
        description: fullHome.tagline,
        icon: 'home',
        scopeTitle: 'Spaces covered',
        scope: list.filter((c) => c.serviceGroup === 'HOME_PROJECT').map((c) => c.name),
      };
    }
    const c = list.find((x) => String(x.id) === id && x.serviceGroup === 'INDIVIDUAL_SERVICE');
    if (!c) return null;
    const meta = serviceMeta[c.name.toLowerCase()];
    return {
      name: c.name,
      description: c.description ?? '',
      icon: meta?.icon ?? defaultServiceIcon,
      scopeTitle: 'Category',
      scope: [meta?.group ?? c.name],
    };
  }, [categories.data, id]);

  const loading = categories.loading && !categories.data;

  return (
    <View style={styles.root}>
      <ScrollView contentContainerStyle={{ paddingBottom: insets.bottom + 32 }} showsVerticalScrollIndicator={false}>
        <View style={styles.hero}>
          <RemoteImage src={id === FULL_HOME_ID ? IMG.livingWarm : IMG.livingModern} width={width} height={HERO_H} style={StyleSheet.absoluteFill} />
          <LinearGradient colors={['rgba(8,24,16,0.4)', 'transparent']} style={styles.topFade} />
          <Pressable
            style={[styles.back, { top: insets.top + 8 }]}
            onPress={() => router.back()}
            accessibilityRole="button"
            accessibilityLabel="Back"
          >
            <Feather name="arrow-left" size={20} color={colors.ink} />
          </Pressable>
        </View>

        <View style={styles.body}>
          {loading ? (
            <>
              <Skeleton height={32} width="70%" />
              <Skeleton height={64} />
            </>
          ) : categories.error && !categories.data ? (
            <ErrorState error={categories.error} onRetry={categories.reload} />
          ) : !detail ? (
            <>
              <AppText variant="h2">Service not found</AppText>
              <AppText variant="body" color={colors.inkSoft}>
                This service is no longer available.
              </AppText>
              <Button label="Back to Services" onPress={() => router.back()} style={styles.gap} />
            </>
          ) : (
            <>
              <View style={styles.icon}>
                <Feather name={detail.icon} size={22} color={colors.forest} />
              </View>
              <AppText variant="h1" accessibilityRole="header">
                {detail.name}
              </AppText>
              {detail.description ? (
                <AppText variant="body" color={colors.inkSoft}>
                  {detail.description}
                </AppText>
              ) : null}

              {detail.scope.length ? (
                <View style={styles.block}>
                  <AppText variant="eyebrow" color={colors.clay}>
                    {detail.scopeTitle}
                  </AppText>
                  <View style={styles.tags}>
                    {detail.scope.map((t) => (
                      <View key={t} style={styles.tag}>
                        <AppText variant="captionStrong" color={colors.forestDeep}>
                          {t}
                        </AppText>
                      </View>
                    ))}
                  </View>
                </View>
              ) : null}

              <View style={styles.block}>
                <AppText variant="eyebrow" color={colors.clay}>
                  How it works
                </AppText>
                {steps.map((st) => (
                  <View key={st.n} style={styles.step}>
                    <View style={styles.stepNum}>
                      <AppText variant="captionStrong" color={colors.white}>
                        {st.n}
                      </AppText>
                    </View>
                    <View style={styles.stepCopy}>
                      <AppText variant="bodyStrong">{st.title}</AppText>
                      <AppText variant="caption" color={colors.inkSoft}>
                        {st.body}
                      </AppText>
                    </View>
                  </View>
                ))}
              </View>

              <View style={styles.note}>
                <Feather name="info" size={16} color={colors.forest} />
                <AppText variant="caption" color={colors.inkSoft} style={styles.noteText}>
                  Online requests are not available in the app yet. Pricing is shared in the quotation after a professional is assigned.
                </AppText>
              </View>
              <Button label="Browse Design Ideas" onPress={() => router.push('/explore')} />
            </>
          )}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.bg },
  hero: { height: HERO_H, backgroundColor: colors.surfaceMuted },
  topFade: { ...StyleSheet.absoluteFill, height: 120 },
  back: { position: 'absolute', left: screenGutter, width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(255,255,255,0.92)', alignItems: 'center', justifyContent: 'center' },
  body: { padding: screenGutter, paddingTop: 20, gap: 12 },
  icon: { width: 48, height: 48, borderRadius: radius.pill, backgroundColor: colors.forestSoft, alignItems: 'center', justifyContent: 'center' },
  block: { gap: 10, marginTop: 8 },
  tags: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  tag: { paddingHorizontal: 10, paddingVertical: 5, borderRadius: radius.sm, backgroundColor: colors.forestSoft },
  step: { flexDirection: 'row', gap: 14, alignItems: 'flex-start' },
  stepNum: { width: 28, height: 28, borderRadius: 14, backgroundColor: colors.forest, alignItems: 'center', justifyContent: 'center' },
  stepCopy: { flex: 1, gap: 2 },
  note: { flexDirection: 'row', gap: 10, padding: 14, borderRadius: radius.md, backgroundColor: colors.surfaceMuted, marginTop: 8 },
  noteText: { flex: 1 },
  gap: { marginTop: 12 },
});
