export const colors = {
  // Core
  background: '#FEF9EA',
  darkText: '#1d1c13',
  mutedText: '#444748',
  border: '#e5e1dc',
  cardBg: '#f2eede',
  cardBg2: '#f8f4e4',
  black: '#000000',
  white: '#ffffff',

  // Semantic
  primary: '#1d1c13',
  accent: '#b45309',
  success: '#22c55e',
  warning: '#f59e0b',
  error: '#ef4444',
  green: '#22c55e',
  red: '#ef4444',

  // Overlays
  overlay: 'rgba(0,0,0,0.5)',
  lightOverlay: 'rgba(0,0,0,0.3)',
  darkOverlay: 'rgba(0,0,0,0.6)',
}

// Semantic status badge colors — single source of truth for
// pending/approved/rejected style pill backgrounds+text used across
// quotations, bookings, work locations, and project status badges.
export const statusColors = {
  pending: { bg: '#fef9c3', text: '#854d0e' },
  approved: { bg: '#dcfce7', text: '#15803d' },
  rejected: { bg: '#fee2e2', text: '#b91c1c' },
}

export const fonts = {
  heading: 'Playfair Display, Georgia, serif',
  body: 'Inter, system-ui, sans-serif',
}

export const fontSize = {
  hero: 36,
  h2: 32,
  h3: 24,
  h4: 20,
  body: 16,
  label: 14,
  caption: 12,
  tiny: 10,
}

export const fontWeight = {
  light: '300',
  regular: '400',
  medium: '500',
  semibold: '600',
  bold: '700',
} as const

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
  section: 48,
  pagePadding: 20,
}

export const radii = {
  none: 0,
  sm: 2,
  md: 4,
  lg: 8,
  xl: 12,
  xxl: 16,
  round: 999,
}

export const shadows = {
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 4,
  },
  lg: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.16,
    shadowRadius: 16,
    elevation: 8,
  },
}

export const layout = {
  bottomNavHeight: 64,
  headerHeight: 56,
  phoneWidth: 375,
  buttonHeight: 52,
  inputHeight: 48,
}

export default { colors, fonts, fontSize, fontWeight, spacing, radii, shadows, layout }
