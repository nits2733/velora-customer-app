import { Feather } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useMemo } from 'react';
import { RefreshControl, StyleSheet, View } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';
import { CategoryChips } from '@/components/explore/CategoryChips';
import { SearchBar } from '@/components/home/SearchBar';
import { useTabBarSpace } from '@/components/layout/FloatingTabBar';
import { Section } from '@/components/layout/Section';
import { TopBar } from '@/components/layout/TopBar';
import { useRevealScroll } from '@/components/motion/Reveal';
import { FeaturedService } from '@/components/services/FeaturedService';
import { HeroCarousel } from '@/components/services/HeroCarousel';
import { BeforeAfterSlider } from '@/components/services/BeforeAfterSlider';
import { BudgetPicker } from '@/components/services/BudgetPicker';
import { BundleRow } from '@/components/services/BundleCard';
import { FAQAccordion } from '@/components/services/FAQAccordion';
import { ServiceCard, openService } from '@/components/services/ServiceCard';
import { StepperHowItWorks } from '@/components/services/StepperHowItWorks';
import { STICKY_CTA_SPACE, StickyCta } from '@/components/services/StickyCta';
import { SuggestionChips } from '@/components/services/SuggestionChips';
import { TestimonialCarousel } from '@/components/services/TestimonialCarousel';
import { TrustStrip } from '@/components/services/TrustStrip';
import { AppText } from '@/components/ui/AppText';
import { Button } from '@/components/ui/Button';
import { ErrorState } from '@/components/ui/ErrorState';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { Skeleton } from '@/components/ui/Skeleton';
import { budgetRanges, bundles, copy, faqs, showcaseProjects, testimonials } from '@/content/marketing';
import { ALL_SERVICES, FULL_HOME_ID, RENOVATION_GROUP, helpCopy, type PromoTarget } from '@/content/services';
import { track } from '@/utils/analytics';
import { useAsync } from '@/hooks/useAsync';
import { useRotatingPlaceholder } from '@/hooks/useRotatingPlaceholder';
import { useServices, type ResolvedPromo, type ServiceItem } from '@/hooks/useServices';
import { useTopPad } from '@/hooks/useTopPad';
import { categoryService } from '@/services/categoryService';
import { colors, radius, screenGutter } from '@/theme';

export default function ServicesScreen() {
  const topPad = useTopPad();
  const tabBarSpace = useTabBarSpace();
  const reveal = useRevealScroll();
  const categories = useAsync(categoryService.list);
  const s = useServices(categories.data);
  const { visible, groups } = s;

  const names = useMemo(() => s.services.map((x) => x.name), [s.services]);
  const placeholder = useRotatingPlaceholder(
    useMemo(() => names.map((n) => `Search '${n.toLowerCase()}'`), [names]),
    !s.query,
  );
  const suggestions = useMemo(() => names.slice(0, 5), [names]);

  const applyGroup = (g: string) => {
    s.setGroup(g);
    track({ name: 'service_filter_applied', group: g });
  };

  const goTarget = (t: PromoTarget) => {
    if (t.kind === 'home') openService(FULL_HOME_ID);
    else if (t.kind === 'group') applyGroup(t.group);
    else {
      const hit = s.services.find((x) => x.name.toLowerCase() === t.name);
      if (hit) openService(hit.id);
    }
  };
  const onPromo = (p: ResolvedPromo) => goTarget(p.target);

  const openDesignIdeas = (source: string) => {
    track({ name: 'design_ideas_cta_tapped', source });
    router.push('/explore');
  };

  /** Marketing entries are shown only when their target exists in the live catalogue. */
  const resolves = (t: PromoTarget) =>
    t.kind === 'home' || (t.kind === 'group' ? groups.includes(t.group) : names.some((n) => n.toLowerCase() === t.name));
  const budgets = useMemo(() => budgetRanges.filter((r) => resolves(r.target)), [groups, names]); // eslint-disable-line react-hooks/exhaustive-deps
  const bundleList = useMemo(() => bundles.filter((b) => resolves(b.target)), [groups, names]); // eslint-disable-line react-hooks/exhaustive-deps

  const rooms = useMemo(
    () => (categories.data ?? []).filter((c) => c.serviceGroup === 'HOME_PROJECT').map((c) => c.name),
    [categories.data],
  );
  const loading = categories.loading && !categories.data;
  const failed = categories.error && !categories.data;
  const filtering = s.query.trim().length > 0 || s.group !== ALL_SERVICES;

  /** Browsing everything with no search: group by category. Otherwise one flat list. */
  const sections = useMemo(() => {
    if (filtering) return [{ title: null as string | null, items: visible }];
    const by = new Map<string, ServiceItem[]>();
    for (const item of visible) by.set(item.group, [...(by.get(item.group) ?? []), item]);
    return groups.filter((g) => by.has(g)).map((g) => ({ title: g as string | null, items: by.get(g)! }));
  }, [filtering, visible, groups]);

  return (
    <View style={styles.root}>
      <reveal.Provider value={reveal.value}>
        <Animated.ScrollView
          onScroll={reveal.onScroll}
          onLayout={reveal.onLayout}
          onContentSizeChange={reveal.onContentSizeChange}
          scrollEventThrottle={16}
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="on-drag"
          contentContainerStyle={{ paddingTop: topPad, paddingBottom: tabBarSpace + 28 + STICKY_CTA_SPACE }}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={categories.refreshing} onRefresh={categories.refresh} tintColor={colors.forest} />
          }
        >
          <View style={styles.top}>
            <TopBar />
            <View style={styles.intro}>
              <AppText variant="h1" accessibilityRole="header">
                Services for Your Home
              </AppText>
              <AppText variant="body" color={colors.inkSoft}>
                From complete renovations to the finishing touches, find the right services for your space.
              </AppText>
            </View>
            <SearchBar
              value={s.query}
              onChangeText={s.setQuery}
              placeholder={placeholder ?? 'Search kitchen, painting, plumbing…'}
              showFilter={false}
              accessibilityLabel="Search services"
            />
            {!s.query ? <SuggestionChips suggestions={suggestions} onPick={s.setQuery} /> : null}
            <CategoryChips options={s.groups} selected={s.group} onSelect={applyGroup} />
          </View>

          {failed ? (
            <Section>
              <ErrorState error={categories.error!} onRetry={categories.reload} />
            </Section>
          ) : (
            <>
              {s.showFeatured || loading ? (
                <Section>
                  {loading ? (
                    <Skeleton height={250} style={styles.sk} r={radius.xl} />
                  ) : filtering ? (
                    <FeaturedService rooms={rooms} />
                  ) : (
                    <HeroCarousel promos={s.promos} onPress={onPromo} />
                  )}
                </Section>
              ) : null}

              {!filtering && !loading ? (
                <Section>
                  <TrustStrip />
                </Section>
              ) : null}

              {s.group === RENOVATION_GROUP && !loading ? null : (
                <Section>
                  <SectionHeader
                    title={filtering ? 'Matching services' : 'Individual Services'}
                    subtitle={
                      loading
                        ? undefined
                        : filtering
                          ? `${visible.length} ${visible.length === 1 ? 'service' : 'services'}`
                          : 'Book a specialist for one job, from a single room to a single trade.'
                    }
                  />
                  {loading ? (
                    <View style={styles.list}>
                      {[0, 1, 2, 3].map((i) => (
                        <Skeleton key={i} height={92} style={styles.sk} r={radius.lg} />
                      ))}
                    </View>
                  ) : s.visible.length ? (
                    <Animated.View key={`${s.group}|${s.query}`} entering={FadeIn.duration(220)} style={styles.groups}>
                      {sections.map((sec) => (
                        <View key={sec.title ?? 'flat'} style={styles.list}>
                          {sec.title ? (
                            <AppText variant="eyebrow" color={colors.clay} style={styles.groupTitle}>
                              {sec.title}
                            </AppText>
                          ) : null}
                          <View style={styles.grid}>
                            {sec.items.map((item) => (
                              <ServiceCard key={item.id} item={item} showGroup={!sec.title && s.group === ALL_SERVICES} />
                            ))}
                          </View>
                        </View>
                      ))}
                    </Animated.View>
                  ) : (
                    <NoMatches onClear={s.reset} hasFeatured={s.showFeatured} />
                  )}
                </Section>
              )}
            </>
          )}

          {!filtering && !loading && !failed ? (
            <>
              {budgets.length ? (
                <Section>
                  <SectionHeader title={copy.budgetTitle} />
                  <BudgetPicker
                    ranges={budgets}
                    onPick={(r) => {
                      track({ name: 'budget_range_tapped', id: r.id });
                      goTarget(r.target);
                    }}
                  />
                </Section>
              ) : null}
              {bundleList.length ? (
                <Section>
                  <SectionHeader title={copy.bundlesTitle} />
                  <BundleRow
                    bundles={bundleList}
                    onPress={(b) => {
                      track({ name: 'bundle_tapped', id: b.id });
                      goTarget(b.target);
                    }}
                  />
                </Section>
              ) : null}
            </>
          ) : null}

          <Section stagger>
            <SectionHeader title={copy.howTitle} />
            <StepperHowItWorks />
          </Section>

          {!filtering && !loading && !failed ? (
            <>
              {showcaseProjects.length ? (
                <Section>
                  <SectionHeader title={copy.showcaseTitle} />
                  <BeforeAfterSlider projects={showcaseProjects} />
                </Section>
              ) : null}
              {testimonials.length ? (
                <Section>
                  <SectionHeader title={copy.testimonialsTitle} />
                  <TestimonialCarousel items={testimonials} />
                </Section>
              ) : null}
            </>
          ) : null}

          {faqs.length ? (
            <Section>
              <SectionHeader title={copy.faqTitle} />
              <FAQAccordion items={faqs} />
            </Section>
          ) : null}

          <Section>
            <View style={styles.help}>
              <Feather name="compass" size={22} color={colors.forest} />
              <AppText variant="h3">{helpCopy.title}</AppText>
              <AppText variant="body" color={colors.inkSoft}>
                {helpCopy.body}
              </AppText>
              <Button label="Browse Design Ideas" onPress={() => openDesignIdeas('help_card')} style={styles.helpBtn} />
            </View>
          </Section>
        </Animated.ScrollView>
        <StickyCta scroll={reveal.value} label={copy.stickyCta} onPress={() => openDesignIdeas('sticky')} />
      </reveal.Provider>
    </View>
  );
}

function NoMatches({ onClear, hasFeatured }: { onClear: () => void; hasFeatured: boolean }) {
  return (
    <View style={styles.empty}>
      <Feather name="search" size={20} color={colors.inkSoft} />
      <AppText variant="bodyStrong">No services match</AppText>
      <AppText variant="caption" color={colors.inkSoft} style={styles.emptyText}>
        {hasFeatured ? 'Full Home Renovation above may still fit. ' : ''}Try another word or clear your search.
      </AppText>
      <Button label="Clear search" onPress={onClear} style={styles.emptyBtn} />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.bg },
  top: { gap: 14 },
  intro: { paddingHorizontal: screenGutter, gap: 6 },
  groups: { gap: 20 },
  groupTitle: { paddingHorizontal: screenGutter },
  list: { gap: 12 },
  grid: { marginHorizontal: screenGutter, flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  sk: { marginHorizontal: screenGutter },
  help: { marginHorizontal: screenGutter, padding: 20, borderRadius: radius.xl, backgroundColor: colors.surfaceMuted, gap: 8 },
  helpBtn: { marginTop: 8 },
  empty: { marginHorizontal: screenGutter, padding: 20, borderRadius: radius.lg, backgroundColor: colors.surface, alignItems: 'center', gap: 6 },
  emptyText: { textAlign: 'center' },
  emptyBtn: { marginTop: 8, alignSelf: 'stretch' },
});
