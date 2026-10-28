import { router } from 'expo-router';
import { useMemo } from 'react';
import { Platform, RefreshControl, StyleSheet, View } from 'react-native';
import Animated from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { BeforeAfter } from '@/components/home/BeforeAfter';
import { CtaCard } from '@/components/home/CtaCard';
import { FreshInspiration } from '@/components/home/FreshInspiration';
import { HeroCarousel } from '@/components/home/HeroCarousel';
import { HomeHeader } from '@/components/home/HomeHeader';
import { HowItWorks } from '@/components/home/HowItWorks';
import { IdeasSection } from '@/components/home/IdeasSection';
import { OfferBanner } from '@/components/home/OfferBanner';
import { RoomGrid } from '@/components/home/RoomGrid';
import { SearchBar } from '@/components/home/SearchBar';
import { ServicesGrid } from '@/components/home/ServicesGrid';
import { StylesCarousel } from '@/components/home/StylesCarousel';
import { useTabBarSpace } from '@/components/layout/FloatingTabBar';
import { Reveal, useRevealScroll } from '@/components/motion/Reveal';
import { ErrorState } from '@/components/ui/ErrorState';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { useAsync } from '@/hooks/useAsync';
import { categoryService } from '@/services/categoryService';
import { colors } from '@/theme';

const goExplore = () => router.push('/explore');
const goServices = () => router.push('/services');

/** Native devices report the real status-bar / notch inset; web reports 0, so give it a small floor. */
const WEB_TOP_FLOOR = Platform.OS === 'web' ? 16 : 0;

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const tabBarSpace = useTabBarSpace();
  const categories = useAsync(categoryService.list);
  const reveal = useRevealScroll();

  const { rooms, services } = useMemo(() => {
    const all = categories.data ?? [];
    return {
      rooms: all.filter((c) => c.serviceGroup === 'HOME_PROJECT'),
      services: all.filter((c) => c.serviceGroup === 'INDIVIDUAL_SERVICE'),
    };
  }, [categories.data]);

  const loading = categories.loading && !categories.data;
  const failed = categories.error && !categories.data;
  const topPad = Math.max(insets.top, WEB_TOP_FLOOR) + 8;

  return (
    <View style={styles.root}>
      <reveal.Provider value={reveal.value}>
        <Animated.ScrollView
          onScroll={reveal.onScroll}
          onLayout={reveal.onLayout}
          scrollEventThrottle={16}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{ paddingTop: topPad, paddingBottom: tabBarSpace + 28 }}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={categories.refreshing}
              onRefresh={categories.refresh}
              tintColor={colors.forest}
              progressViewOffset={insets.top}
            />
          }
        >
          <View style={styles.top}>
            <HomeHeader firstName={undefined} />
            <SearchBar />
            <OfferBanner />
          </View>

          <Section>
            <HeroCarousel />
          </Section>

          <Section stagger>
            <SectionHeader
              title="Popular Services"
              subtitle="Specialised trade services, ready to book"
              actionLabel="View All"
              onAction={goServices}
            />
            {failed ? (
              <ErrorState error={categories.error!} onRetry={categories.reload} />
            ) : (
              <ServicesGrid services={services} loading={loading} />
            )}
          </Section>

          <Section>
            <BeforeAfter />
          </Section>

          <Section>
            <SectionHeader
              title="Explore by Room"
              subtitle="Layouts and ideas for every space"
              actionLabel="View All"
              onAction={goExplore}
            />
            {failed ? (
              <ErrorState error={categories.error!} onRetry={categories.reload} />
            ) : (
              <RoomGrid rooms={rooms} loading={loading} />
            )}
          </Section>

          <Section>
            <SectionHeader
              title="Trending Aesthetics"
              subtitle="Design styles for Indian homes"
              actionLabel="All Styles"
              onAction={goExplore}
            />
            <StylesCarousel />
          </Section>

          <Section>
            <SectionHeader title="Ideas for Every Home" subtitle="Curated by need, budget and lifestyle" />
            <IdeasSection />
          </Section>

          <Section>
            <SectionHeader
              title="Fresh Inspiration"
              subtitle="Real Hyderabad homes, zero overruns"
              actionLabel="All Projects"
              onAction={goExplore}
            />
            <FreshInspiration />
          </Section>

          <Section stagger>
            <HowItWorks />
          </Section>

          <Section>
            <CtaCard />
          </Section>
        </Animated.ScrollView>
      </reveal.Provider>
    </View>
  );
}

/** Consistent vertical rhythm + one-time reveal on first scroll into view. */
function Section({ children, stagger }: { children: React.ReactNode; stagger?: boolean }) {
  return (
    <Reveal animate={!stagger} style={styles.section}>
      {children}
    </Reveal>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.bg },
  top: { gap: 14 },
  section: { marginTop: 32 },
});
