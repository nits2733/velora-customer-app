/**
 * Developer-only preview of every Requests list state, so a designer or tester can see all of them
 * without needing a real account in each state. It draws the real RequestCard, skeletons and empty/error
 * cards from the demo fixtures kept under services/requests/testing.
 *
 * It does nothing in a release build: the screen redirects away, and the fixtures are only loaded
 * inside the __DEV__ branch so they are not part of what ships. The real list never reads this data.
 */
import { Redirect } from 'expo-router';
import { useMemo, useState } from 'react';
import { Alert, Platform, ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { RequestCard } from '@/components/requests/RequestCard';
import { EmptyRequests, RequestSkeletons, RequestsError } from '@/components/requests/states';
import { AppText } from '@/components/ui/AppText';
import { Pressable } from '@/components/ui/Pressable';
import { strings } from '@/content/strings';
import { colors, radius, screenGutter } from '@/theme';
import { parseBooking, type Booking } from '@/types/requests';
import { presentRequest } from '@/utils/requestState';

type Scenario = 'all' | 'skeleton' | 'empty' | 'error' | 'offline' | 'edge' | string;

function loadBookings(): { states: Booking[]; edge: Booking[] } {
  // Loaded here, not at the top of the file, so a release build never pulls the fixtures in.
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { seedRecords } = require('@/services/requests/testing/mockData') as typeof import('@/services/requests/testing/mockData');
  const seeded = seedRecords().map((r) => parseBooking(r.booking));
  const unknown = parseBooking({ ...seedRecords()[0].booking, id: 2099, status: 'A_FUTURE_STATUS' as never });
  const states = [...seeded, unknown];

  const long = seedRecords()[1].booking;
  const edge = [
    parseBooking({ ...long, id: 3001, categoryName: 'Wardrobe, loft storage and false ceiling with concealed lighting', location: 'Kondapur Main Road, Near Botanical Garden Junction, Hyderabad, Telangana' }),
    parseBooking({ ...long, id: 3002, requestType: 'FULL_HOME_PROJECT', categoryName: undefined, budgetMin: undefined, budgetMax: undefined, status: 'PENDING_ASSIGNMENT', quotationStatus: undefined, professional: undefined }),
    parseBooking({ ...long, id: 3003, budgetMin: 0, budgetMax: 0, quotationStatus: undefined, professional: undefined, location: undefined }),
    parseBooking({ ...long, id: 3004, requestType: 'INDIVIDUAL_SERVICE', categoryName: undefined, budgetMin: 450_000, budgetMax: undefined, quotationStatus: undefined }),
  ];
  return { states, edge };
}

export default function DevRequestStates() {
  if (!__DEV__) return <Redirect href="/requests" />;
  return <Preview />;
}

function Preview() {
  const insets = useSafeAreaInsets();
  const [scenario, setScenario] = useState<Scenario>('all');
  const { states, edge } = useMemo(() => loadBookings(), []);

  const byKey = useMemo(() => new Map(states.map((b) => [presentRequest(b).key, b])), [states]);
  const chips: { id: Scenario; label: string }[] = [
    { id: 'all', label: 'All states' },
    ...states.map((b) => ({ id: presentRequest(b).key, label: strings.requests.state[presentRequest(b).key] + (presentRequest(b).key === 'completed_unreviewed' ? ' (unrated)' : '') })),
    { id: 'edge', label: 'Edge cases' },
    { id: 'skeleton', label: 'Loading' },
    { id: 'empty', label: 'Empty' },
    { id: 'error', label: 'Error' },
    { id: 'offline', label: 'Offline' },
  ];

  const note = (what: string) => (Platform.OS === 'web' ? console.log(what) : Alert.alert('Dev preview', what));
  const open = (id: number, intent?: string) => note(`open request ${id}${intent ? ` (${intent})` : ''}`);

  let body: React.ReactNode;
  if (scenario === 'skeleton') body = <RequestSkeletons />;
  else if (scenario === 'empty') body = <EmptyRequests tab="active" />;
  else if (scenario === 'error') body = <RequestsError offline={false} onRetry={() => note('retry')} />;
  else if (scenario === 'offline') body = <RequestsError offline onRetry={() => note('retry')} />;
  else {
    const shown = scenario === 'all' ? states : scenario === 'edge' ? edge : [byKey.get(scenario as never)].filter(Boolean) as Booking[];
    body = shown.map((b) => <RequestCard key={b.id} booking={b} onOpen={open} onSupport={() => note('contact support')} />);
  }

  return (
    <ScrollView style={styles.root} contentContainerStyle={{ paddingTop: insets.top + 12, paddingBottom: insets.bottom + 40, gap: 12 }}>
      <AppText variant="h2" style={styles.pad} accessibilityRole="header">
        Request states (dev only)
      </AppText>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chips}>
        {chips.map((chip) => (
          <Pressable key={String(chip.id)} onPress={() => setScenario(chip.id)} style={[styles.chip, scenario === chip.id && styles.chipOn]} accessibilityRole="button" accessibilityState={{ selected: scenario === chip.id }}>
            <AppText variant="captionStrong" color={scenario === chip.id ? colors.white : colors.ink}>
              {chip.label}
            </AppText>
          </Pressable>
        ))}
      </ScrollView>
      <View style={styles.list}>{body}</View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.bg },
  pad: { paddingHorizontal: screenGutter },
  chips: { gap: 8, paddingHorizontal: screenGutter },
  chip: { minHeight: 44, justifyContent: 'center', paddingHorizontal: 14, borderRadius: radius.pill, backgroundColor: colors.surface },
  chipOn: { backgroundColor: colors.forest },
  list: { gap: 12 },
});
