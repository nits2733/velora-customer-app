import { Feather } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { useCallback, useEffect, useRef, useState } from 'react';
import { RefreshControl, ScrollView, StyleSheet, View, type ScrollViewInstance } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ConfirmSheet } from '@/components/requests/ConfirmSheet';
import { ProfessionalLine } from '@/components/requests/ProfessionalLine';
import { ProgressSteps } from '@/components/requests/ProgressSteps';
import { QuotationView } from '@/components/requests/QuotationView';
import { ReviewPrompt } from '@/components/requests/ReviewPrompt';
import { StatusPill } from '@/components/requests/StatusPill';
import { StatusTimeline } from '@/components/requests/StatusTimeline';
import { SupportCard } from '@/components/requests/SupportCard';
import { RequestsError } from '@/components/requests/states';
import { AppText } from '@/components/ui/AppText';
import { Button } from '@/components/ui/Button';
import { Pressable } from '@/components/ui/Pressable';
import { RemoteImage } from '@/components/ui/RemoteImage';
import { Skeleton } from '@/components/ui/Skeleton';
import { strings } from '@/content/strings';
import { describeError, isConflict, useIsOffline, useQuotation, useRequest, useRequestActions, useTimeline } from '@/hooks/useRequests';
import { ApiError } from '@/services/apiClient';
import { colors, radius, screenGutter, shadow } from '@/theme';
import { tonePalette } from '@/theme/tones';
import { track } from '@/utils/analytics';
import { formatBudgetRange, formatDateTime, formatRupees } from '@/utils/format';
import { presentRequest } from '@/utils/requestState';
import { RequireSession } from '@/components/auth/RequireSession';

type Sheet = 'accept' | 'decline' | 'cancel' | null;

function Fact({ label, value }: { label: string; value: string | null }) {
  if (!value) return null;
  return (
    <View style={styles.fact} accessible accessibilityLabel={`${label}: ${value}`}>
      <AppText variant="captionStrong" color={colors.inkSoft}>
        {label}
      </AppText>
      <AppText variant="body">{value}</AppText>
    </View>
  );
}

function RequestDetailContent() {
  const { id: idParam, intent } = useLocalSearchParams<{ id: string; intent?: string }>();
  const id = Number(idParam);
  const valid = Number.isInteger(id) && id > 0;
  const insets = useSafeAreaInsets();
  const offline = useIsOffline();

  const booking = useRequest(valid ? id : 0);
  const timeline = useTimeline(valid ? id : 0);
  const hasQuotation = booking.data?.quotationStatus != null;
  const quotation = useQuotation(valid ? id : 0, hasQuotation);
  const actions = useRequestActions(id);

  const [sheet, setSheet] = useState<Sheet>(null);
  const [intentUsed, setIntentUsed] = useState(false);
  const [sheetError, setSheetError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const scroll = useRef<ScrollViewInstance>(null);
  const anchors = useRef<{ quotation?: number; review?: number }>({});
  const handledIntent = useRef(false);
  const tracked = useRef(false);

  const data = booking.data;
  const state = data ? presentRequest(data) : null;
  // Coming from "Cancel request" on the list opens the confirmation straight away, once.
  const activeSheet: Sheet = sheet ?? (intent === 'cancel' && !intentUsed && state?.canCancel ? 'cancel' : null);

  useEffect(() => {
    if (data && state && !tracked.current) {
      tracked.current = true;
      track({ name: 'request_viewed', requestId: data.id, state: state.key, source: intent ? 'card_action' : 'list' });
    }
  }, [data, state, intent]);

  // Honour what the customer tapped on the list: jump to the quotation or the rating.
  useEffect(() => {
    if (!data || !state || handledIntent.current || !intent) return;
    handledIntent.current = true;
    if (intent === 'quotation' || intent === 'review') {
      const y = intent === 'quotation' ? anchors.current.quotation : anchors.current.review;
      if (y !== undefined) setTimeout(() => scroll.current?.scrollTo({ y: Math.max(0, y - 12), animated: true }), 250);
    }
  }, [data, state, intent]);

  const refresh = useCallback(async () => {
    setRefreshing(true);
    await Promise.allSettled([booking.refetch(), timeline.refetch(), hasQuotation ? quotation.refetch() : Promise.resolve()]);
    setRefreshing(false);
  }, [booking, timeline, quotation, hasQuotation]);

  const closeSheet = () => {
    setSheet(null);
    setIntentUsed(true);
    setSheetError(null);
  };

  /** Runs an action; a 409 means it changed under the customer, so say so and show them what it is now. */
  const perform = async (run: () => Promise<unknown>, onDone?: () => void) => {
    setSheetError(null);
    try {
      await run();
      closeSheet();
      onDone?.();
    } catch (error) {
      if (isConflict(error)) {
        closeSheet();
        setNotice(strings.detail.conflict);
      } else {
        setSheetError(describeError(error));
      }
    }
  };

  const back = () => (router.canGoBack() ? router.back() : router.replace('/requests'));

  const notFound = !valid || (booking.error instanceof ApiError && booking.error.status === 404);
  const failed = booking.isError && !notFound;
  const showActions = !!data && quotation.data?.status === 'SENT' && state?.key === 'quote_ready';
  const accepted = data?.quotationStatus === 'ACCEPTED';

  return (
    <View style={styles.root}>
      <View style={[styles.bar, { paddingTop: insets.top + 6 }]}>
        <Pressable style={styles.back} onPress={back} accessibilityRole="button" accessibilityLabel={strings.detail.back}>
          <Feather name="arrow-left" size={22} color={colors.ink} />
        </Pressable>
        {data ? (
          <AppText variant="caption" color={colors.inkSoft}>
            {strings.requests.idPrefix}
            {data.id}
          </AppText>
        ) : null}
      </View>

      <ScrollView
        ref={scroll}
        contentContainerStyle={{ paddingBottom: (showActions ? 112 : 32) + insets.bottom, gap: 14 }}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={refresh} tintColor={colors.forest} />}
        showsVerticalScrollIndicator={false}
      >
        {notFound ? (
          <View style={styles.centerCard}>
            <AppText variant="h2" accessibilityRole="header">
              {strings.detail.notFoundTitle}
            </AppText>
            <AppText variant="body" color={colors.inkSoft}>
              {strings.detail.notFoundBody}
            </AppText>
            <Button label={strings.detail.backToRequests} onPress={back} />
          </View>
        ) : failed ? (
          <RequestsError offline={offline} onRetry={refresh} />
        ) : !data || !state ? (
          <View style={styles.gap}>
            <Skeleton height={34} width="70%" style={styles.sk} />
            <Skeleton height={120} style={styles.sk} r={radius.lg} />
            <Skeleton height={220} style={styles.sk} r={radius.lg} />
          </View>
        ) : (
          <>
            <View style={styles.head}>
              <AppText variant="h1" accessibilityRole="header">
                {data.categoryName ?? strings.requests.types[data.requestType]}
              </AppText>
              <View style={styles.pills}>
                <StatusPill state={state.key} tone={state.tone} icon={state.icon} />
                {state.chip ? (
                  <View style={[styles.chip, { backgroundColor: tonePalette[state.chip.tone].bg }]}>
                    <AppText variant="captionStrong" color={tonePalette[state.chip.tone].fg} maxFontSizeMultiplier={1.5}>
                      {strings.requests.chip[state.chip.key]}
                    </AppText>
                  </View>
                ) : null}
              </View>
              {state.progress !== null ? <ProgressSteps done={state.progress} /> : null}
            </View>

            {notice ? (
              <View style={styles.notice} accessibilityRole="alert">
                <AppText variant="bodyStrong" color={tonePalette.amber.fg}>
                  {notice}
                </AppText>
              </View>
            ) : null}

            <View style={styles.card}>
              <AppText variant="h3" accessibilityRole="header">
                {strings.detail.summary}
              </AppText>
              <Fact label={strings.detail.labels.service} value={`${strings.requests.types[data.requestType]}${data.categoryName ? `, ${data.categoryName}` : ''}`} />
              <Fact label={strings.detail.labels.scope} value={data.notes} />
              <Fact label={strings.detail.labels.budget} value={formatBudgetRange(data.budgetMin, data.budgetMax)} />
              <Fact label={strings.detail.labels.style} value={data.preferredStyle} />
              <Fact label={strings.detail.labels.location} value={data.location} />
              <Fact label={strings.detail.labels.scheduledFor} value={formatDateTime(data.scheduledAt)} />
              <Fact label={strings.detail.labels.created} value={formatDateTime(data.createdAt)} />
              <Fact label={strings.detail.labels.cancelReason} value={data.status === 'CANCELLED' ? data.cancellationReason : null} />
              {data.inspirationImageUrls.length ? (
                <View style={styles.photos}>
                  <AppText variant="captionStrong" color={colors.inkSoft}>
                    {strings.detail.labels.photos}
                  </AppText>
                  <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.photoRow}>
                    {data.inspirationImageUrls.map((url) => (
                      <RemoteImage key={url} src={url} width={96} height={96} style={styles.photo} accessibilityLabel={strings.detail.labels.photos} />
                    ))}
                  </ScrollView>
                </View>
              ) : null}
            </View>

            {data.professional ? (
              <View style={styles.card}>
                <AppText variant="h3" accessibilityRole="header">
                  {strings.detail.professional}
                </AppText>
                <ProfessionalLine professional={data.professional} />
                {data.professional.yearsExperience ? (
                  <AppText variant="caption" color={colors.inkSoft}>
                    {strings.detail.professionalYears(data.professional.yearsExperience)}
                  </AppText>
                ) : null}
              </View>
            ) : null}

            {hasQuotation ? (
              <View onLayout={(e) => (anchors.current.quotation = e.nativeEvent.layout.y)}>
                {quotation.data ? (
                  <QuotationView quotation={quotation.data} />
                ) : quotation.isError ? (
                  <RequestsError offline={offline} onRetry={() => quotation.refetch()} />
                ) : (
                  <Skeleton height={200} style={styles.sk} r={radius.lg} />
                )}
              </View>
            ) : null}

            {timeline.data ? (
              <StatusTimeline events={timeline.data} status={data.status} />
            ) : timeline.isError ? (
              <RequestsError offline={offline} onRetry={() => timeline.refetch()} />
            ) : (
              <Skeleton height={180} style={styles.sk} r={radius.lg} />
            )}

            {state.key === 'completed_unreviewed' ? (
              <View onLayout={(e) => (anchors.current.review = e.nativeEvent.layout.y)}>
                <ReviewPrompt
                  busy={actions.review.isPending}
                  error={actions.review.isError ? describeError(actions.review.error) : null}
                  onSubmit={(rating, comment) => actions.review.mutate({ rating, comment })}
                />
              </View>
            ) : null}

            {data.reviewed ? (
              <AppText variant="bodyStrong" color={colors.forest} style={styles.thanks}>
                {strings.detail.review.thanks}
              </AppText>
            ) : null}

            <SupportCard requestId={data.id} />

            {state.canCancel ? (
              <Pressable style={styles.cancel} onPress={() => setSheet('cancel')} accessibilityRole="button" accessibilityLabel={strings.requests.action.cancel}>
                <AppText variant="bodyStrong" color={colors.danger}>
                  {strings.requests.action.cancel}
                </AppText>
              </Pressable>
            ) : null}
          </>
        )}
      </ScrollView>

      {showActions ? (
        <View style={[styles.sticky, { paddingBottom: insets.bottom + 12 }]}>
          <Button label={strings.detail.decline} variant="quiet" onPress={() => setSheet('decline')} style={styles.stickyHalf} />
          <Button label={strings.detail.accept} onPress={() => setSheet('accept')} style={styles.stickyWide} />
        </View>
      ) : null}

      <ConfirmSheet
        visible={activeSheet === 'accept'}
        title={strings.sheet.accept.title}
        body={strings.sheet.accept.body(quotation.data ? formatRupees(quotation.data.totalAmount) : '')}
        confirmLabel={strings.sheet.accept.confirm}
        dismissLabel={strings.sheet.accept.back}
        busy={actions.accept.isPending}
        error={sheetError}
        onClose={closeSheet}
        onConfirm={() => perform(() => actions.accept.mutateAsync(), () => track({ name: 'quotation_accepted', requestId: id }))}
      />
      <ConfirmSheet
        visible={activeSheet === 'decline'}
        title={strings.sheet.decline.title}
        body={strings.sheet.decline.body}
        confirmLabel={strings.sheet.decline.confirm}
        dismissLabel={strings.sheet.decline.back}
        destructive
        reasonLabel={strings.sheet.decline.reasonLabel}
        busy={actions.decline.isPending}
        error={sheetError}
        onClose={closeSheet}
        onConfirm={(reason) =>
          perform(
            () => actions.decline.mutateAsync(reason),
            () => track({ name: 'quotation_declined', requestId: id, hasReason: !!reason?.trim() }),
          )
        }
      />
      <ConfirmSheet
        visible={activeSheet === 'cancel'}
        title={strings.sheet.cancel.title}
        body={accepted ? strings.sheet.cancel.bodyAccepted : strings.sheet.cancel.body}
        confirmLabel={strings.sheet.cancel.confirm}
        dismissLabel={strings.sheet.cancel.keep}
        destructive
        reasonLabel={strings.sheet.cancel.reasonLabel}
        busy={actions.cancel.isPending}
        error={sheetError}
        onClose={closeSheet}
        onConfirm={(reason) =>
          perform(
            () => actions.cancel.mutateAsync(reason),
            () => track({ name: 'request_cancelled', requestId: id, hasReason: !!reason?.trim(), quotationAccepted: accepted }),
          )
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.bg },
  bar: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: screenGutter, paddingBottom: 6 },
  back: { width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.surface },
  head: { paddingHorizontal: screenGutter, gap: 10 },
  pills: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, alignItems: 'center' },
  chip: { paddingHorizontal: 10, paddingVertical: 6, borderRadius: radius.pill },
  card: { marginHorizontal: screenGutter, padding: 16, gap: 12, borderRadius: radius.lg, backgroundColor: colors.surface, ...shadow.card },
  fact: { gap: 2 },
  photos: { gap: 8 },
  photoRow: { gap: 8 },
  photo: { width: 96, height: 96, borderRadius: radius.md },
  notice: { marginHorizontal: screenGutter, padding: 12, borderRadius: radius.md, backgroundColor: tonePalette.amber.bg },
  thanks: { marginHorizontal: screenGutter },
  cancel: { minHeight: 48, alignItems: 'center', justifyContent: 'center' },
  centerCard: { marginHorizontal: screenGutter, marginTop: 24, padding: 24, gap: 12, borderRadius: radius.lg, backgroundColor: colors.surface },
  gap: { gap: 14 },
  sk: { marginHorizontal: screenGutter },
  sticky: { position: 'absolute', left: 0, right: 0, bottom: 0, flexDirection: 'row', gap: 10, paddingHorizontal: screenGutter, paddingTop: 12, backgroundColor: colors.bg, borderTopWidth: 1, borderTopColor: colors.border },
  stickyHalf: { flex: 1 },
  stickyWide: { flex: 2 },
});

export default function RequestDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  return (
    <RequireSession next={`/request/${id}`}>
      <RequestDetailContent />
    </RequireSession>
  );
}
