import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { AppText } from '@/components/ui/AppText';
import { strings } from '@/content/strings';
import { colors, radius, screenGutter, shadow } from '@/theme';
import { tonePalette } from '@/theme/tones';
import type { Quotation } from '@/types/requests';
import { formatDateTime, formatRupees } from '@/utils/format';

interface Props {
  quotation: Quotation;
  /** Passed in so the date check is testable. Used for a hint only: it never blocks anything. */
  now?: number;
}

const lineDetail = (q: number | null, unit: string | null, rate: number | null) =>
  q !== null && rate !== null ? `${q} ${unit ?? ''} × ${formatRupees(rate)}`.replace(/\s+/g, ' ').trim() : null;

/**
 * Itemised quotation with one total. The validity date is plain information: the server does not
 * enforce it, so after the date a note asks the customer to confirm the price, and Accept stays
 * available. The decision is the server's, never this device's clock.
 */
export function QuotationView({ quotation, now: nowOverride }: Props) {
  const [mountedAt] = useState(() => Date.now());
  const now = nowOverride ?? mountedAt;
  const passed = quotation.validUntil !== null && Date.parse(quotation.validUntil) < now;

  return (
    <View style={styles.card}>
      <AppText variant="h3" accessibilityRole="header">
        {strings.detail.quotation}
      </AppText>

      <View style={styles.items}>
        {quotation.lineItems.map((item) => {
          const detail = lineDetail(item.quantity, item.unit, item.unitPrice);
          return (
            <View key={item.id} style={styles.item} accessible accessibilityLabel={`${item.description}, ${formatRupees(item.amount)}`}>
              <View style={styles.itemCopy}>
                <AppText variant="body">{item.description}</AppText>
                {detail ? (
                  <AppText variant="caption" color={colors.inkSoft}>
                    {detail}
                  </AppText>
                ) : null}
              </View>
              <AppText variant="bodyStrong">{formatRupees(item.amount)}</AppText>
            </View>
          );
        })}
      </View>

      <View style={styles.total} accessible accessibilityLabel={`${strings.detail.quotationTotal} ${formatRupees(quotation.totalAmount)}`}>
        <AppText variant="title">{strings.detail.quotationTotal}</AppText>
        <AppText variant="title">{formatRupees(quotation.totalAmount)}</AppText>
      </View>

      {quotation.validUntil ? (
        <AppText variant="caption" color={colors.inkSoft}>
          {strings.detail.quotationValidUntil(formatDateTime(quotation.validUntil))}
        </AppText>
      ) : null}
      {passed ? (
        <View style={styles.note} accessibilityRole="alert">
          <AppText variant="caption" color={tonePalette.amber.fg}>
            {strings.detail.quotationDatePassed}
          </AppText>
        </View>
      ) : null}

      {quotation.notes ? (
        <View style={styles.block}>
          <AppText variant="captionStrong" color={colors.inkSoft}>
            {strings.detail.quotationNotes}
          </AppText>
          <AppText variant="body">{quotation.notes}</AppText>
        </View>
      ) : null}

      {quotation.rejectionReason ? (
        <View style={styles.block}>
          <AppText variant="captionStrong" color={colors.inkSoft}>
            {strings.detail.declinedReason}
          </AppText>
          <AppText variant="body">{quotation.rejectionReason}</AppText>
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  card: { marginHorizontal: screenGutter, padding: 16, gap: 12, borderRadius: radius.lg, backgroundColor: colors.surface, ...shadow.card },
  items: { gap: 12 },
  item: { flexDirection: 'row', justifyContent: 'space-between', gap: 12 },
  itemCopy: { flex: 1, gap: 2 },
  total: { flexDirection: 'row', justifyContent: 'space-between', paddingTop: 12, borderTopWidth: 1, borderTopColor: colors.border },
  note: { padding: 10, borderRadius: radius.md, backgroundColor: tonePalette.amber.bg },
  block: { gap: 2 },
});
