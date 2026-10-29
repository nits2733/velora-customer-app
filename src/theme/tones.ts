import type { Tone } from '@/utils/requestState';
import { colors } from './colors';

/**
 * The only four status colours: green (done or primary), amber (needs your action), red (cancelled or
 * error) and grey (waiting). Always shown with an icon and a text label, never colour alone.
 */
export const tonePalette: Record<Tone, { fg: string; bg: string }> = {
  green: { fg: colors.forestDeep, bg: colors.forestSoft },
  amber: { fg: colors.amber, bg: colors.amberSoft },
  red: { fg: colors.danger, bg: colors.dangerSoft },
  grey: { fg: colors.inkSoft, bg: colors.surfaceMuted },
};
