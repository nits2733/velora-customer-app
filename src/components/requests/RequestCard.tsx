import { Feather } from '@expo/vector-icons';
import { memo } from 'react';
import { StyleSheet, View } from 'react-native';
import { AppText } from '@/components/ui/AppText';
import { Button } from '@/components/ui/Button';
import { Pressable } from '@/components/ui/Pressable';
import { strings } from '@/content/strings';
import { colors, radius, screenGutter, shadow } from '@/theme';
import type { Booking } from '@/types/requests';
import { requestBudget, requestMeta, requestTitle } from '@/utils/requestCard';
import { presentRequest } from '@/utils/requestState';
import { ProfessionalInline } from './ProfessionalLine';
import { ProgressSteps, progressLabel } from './ProgressSteps';
import { RequestMenu, type MenuItem } from './RequestMenu';
import { StatusPill } from './StatusPill';

export type CardIntent = 'quotation' | 'review' | 'cancel';

interface Props {
  booking: Booking;
  /** Opens the request; an intent says what the customer came to do (view the quotation, rate, cancel). */
  onOpen?: (id: number, intent?: CardIntent) => void;
  onSupport?: () => void;
  /**
   * Draws the card for display only, with no buttons: the guest "Example" uses the real card so it can
   * never drift from the real thing. Plain views are used (not disabled buttons), so nothing in it can
   * be focused or activated, by touch or by keyboard.
   */
  preview?: boolean;
}

/** Room kept on the title row for the "⋯" button, which sits over the card's top-right corner. */
const MENU_SPACE = 36;

/**
 * Compact summary of one request. The whole card opens it. A button appears only when the customer has
 * something to do (view a quotation, rate); cancelling and contacting support live in the "⋯" menu.
 * The menu and the button are siblings of the tap area, never nested in it.
 */
export const RequestCard = memo(function RequestCard({ booking, onOpen, onSupport, preview = false }: Props) {
  const state = presentRequest(booking);
  const title = requestTitle(booking);
  const meta = requestMeta(booking);
  const budget = requestBudget(booking);
  const next = state.next ? strings.requests.next[state.next] : null;
  const idText = `${strings.requests.idPrefix}${booking.id}`;

  const menuItems: MenuItem[] = [];
  if (!preview && state.canCancel) {
    menuItems.push({ key: 'cancel', label: strings.requests.action.cancel, icon: 'x-circle', destructive: true, onPress: () => onOpen?.(booking.id, 'cancel') });
    if (onSupport) menuItems.push({ key: 'support', label: strings.requests.action.support, icon: 'life-buoy', onPress: onSupport });
  }

  const spoken = [
    title,
    meta,
    budget ? `Budget ${budget}` : null,
    strings.requests.state[state.key],
    state.progress !== null ? progressLabel(state.progress) : null,
    next,
    booking.professional?.fullName ? `With ${booking.professional.fullName}` : null,
    idText,
  ].filter(Boolean).join('. ');

  const Body = preview ? View : Pressable;
  const bodyProps = preview ? {} : { scaleTo: 0.99, onPress: () => onOpen?.(booking.id), accessibilityRole: 'button' as const, accessibilityLabel: spoken };
  const actionLabel = state.cardAction ? strings.requests.action[state.cardAction] : null;
  const intent: CardIntent | undefined = state.cardAction === 'viewQuotation' ? 'quotation' : state.cardAction === 'rate' ? 'review' : undefined;

  return (
    <View style={styles.card}>
      <Body style={styles.body} {...bodyProps}>
        <View style={styles.titleRow}>
          <AppText variant="h3" numberOfLines={2} style={styles.title}>
            {title}
          </AppText>
          <AppText variant="caption" color={colors.inkSoft} style={styles.id}>
            {idText}
          </AppText>
          {menuItems.length ? <View style={{ width: MENU_SPACE - 8 }} /> : null}
        </View>

        {meta ? (
          <AppText variant="caption" color={colors.inkSoft} numberOfLines={1}>
            {meta}
          </AppText>
        ) : null}
        {budget ? (
          <AppText variant="caption" color={colors.inkSoft} numberOfLines={1}>
            {budget}
          </AppText>
        ) : null}

        <View style={styles.status}>
          <StatusPill state={state.key} tone={state.tone} icon={state.icon} />
          {state.chip ? (
            <AppText variant="captionStrong" color={colors.inkSoft}>
              {strings.requests.chip[state.chip.key]}
            </AppText>
          ) : null}
        </View>
        {state.progress !== null ? <ProgressSteps done={state.progress} showLabel={false} /> : null}

        {next ? (
          <AppText variant="body" color={colors.inkSoft}>
            {next}
          </AppText>
        ) : null}
        {booking.professional ? <ProfessionalInline professional={booking.professional} /> : null}
      </Body>

      {actionLabel ? (
        <View style={styles.action}>
          {preview ? (
            <View style={styles.previewAction}>
              <AppText variant="button" color={colors.white}>
                {actionLabel}
              </AppText>
            </View>
          ) : (
            <Button
              label={actionLabel}
              onPress={() => onOpen?.(booking.id, intent)}
              right={state.cardAction === 'viewQuotation' ? <Feather name="arrow-right" size={16} color={colors.white} /> : undefined}
              style={styles.button}
            />
          )}
        </View>
      ) : null}

      {menuItems.length ? (
        <View style={styles.menu}>
          <RequestMenu title={title} items={menuItems} />
        </View>
      ) : null}
    </View>
  );
});

const styles = StyleSheet.create({
  card: { marginHorizontal: screenGutter, borderRadius: radius.lg, backgroundColor: colors.surface, ...shadow.card },
  body: { padding: 14, gap: 6 },
  titleRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 8 },
  title: { flex: 1 },
  id: { paddingTop: 4 },
  status: { flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', gap: 8, marginTop: 2 },
  action: { paddingHorizontal: 14, paddingBottom: 14 },
  button: { minHeight: 48 },
  previewAction: { minHeight: 48, alignItems: 'center', justifyContent: 'center', borderRadius: radius.md, backgroundColor: colors.forest },
  menu: { position: 'absolute', top: 4, right: 4 },
});
