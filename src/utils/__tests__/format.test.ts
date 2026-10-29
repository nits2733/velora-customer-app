import { formatBudgetCompact, formatBudgetRange, formatDateTime, formatRupees, formatRupeesCompact, formatShortDate } from '../format';

describe('formatBudgetCompact', () => {
  it.each([
    [500000, 800000, '₹5L–₹8L'],
    [1200000, 1800000, '₹12L–₹18L'],
    [750000, 1250000, '₹7.5L–₹12.5L'],
    [50000, 70000, '₹50,000–₹70,000'],
    [10000000, 25000000, '₹1Cr–₹2.5Cr'],
    [500000, 500000, '₹5L'],
    [null, 800000, 'Up to ₹8L'],
    [500000, null, 'From ₹5L'],
  ])('%s to %s is %s', (min, max, expected) => expect(formatBudgetCompact(min, max)).toBe(expected));

  it('never prints a missing or zero budget', () => {
    for (const [min, max] of [[null, null], [0, 0], [0, null], [null, 0], [-5, NaN]] as const) {
      expect(formatBudgetCompact(min, max)).toBeNull();
    }
    expect(formatBudgetCompact(0, 800000)).toBe('Up to ₹8L');
    expect(formatRupeesCompact(null)).toBeNull();
  });
});

describe('formatShortDate', () => {
  const local = (y: number, m: number, d: number) => new Date(y, m, d, 12).toISOString();
  const now = new Date(2026, 9, 29);

  it('shows day and month for this year, adding the year for any other', () => {
    expect(formatShortDate(local(2026, 8, 11), now)).toBe('11 Sep');
    expect(formatShortDate(local(2025, 8, 11), now)).toBe('11 Sep 2025');
  });

  it('returns nothing for a value that is not a date', () => {
    expect(formatShortDate('nope', now)).toBe('');
  });
});

describe('formatRupees', () => {
  it.each([
    [0, '₹0'],
    [950, '₹950'],
    [1000, '₹1,000'],
    [58500, '₹58,500'],
    [345000, '₹3,45,000'],
    [1200000, '₹12,00,000'],
    [98500000, '₹9,85,00,000'],
    [18400.5, '₹18,400.50'],
    [-2500, '-₹2,500'],
  ])('%s', (amount, expected) => expect(formatRupees(amount)).toBe(expected));
});

describe('formatBudgetRange', () => {
  it('describes a range, one-sided budgets, and none', () => {
    expect(formatBudgetRange(1200000, 1800000)).toBe('₹12,00,000 to ₹18,00,000');
    expect(formatBudgetRange(null, 450000)).toBe('Up to ₹4,50,000');
    expect(formatBudgetRange(300000, null)).toBe('From ₹3,00,000');
    expect(formatBudgetRange(null, null)).toBeNull();
  });
});

describe('formatDateTime', () => {
  // Built from local-time parts so the test does not depend on the machine's time zone.
  const local = (y: number, m: number, d: number, h: number, min: number) => new Date(y, m, d, h, min).toISOString();

  it('uses one format: day, short month, 12-hour time', () => {
    expect(formatDateTime(local(2026, 9, 24, 10, 30))).toBe('24 Oct, 10:30 AM');
    expect(formatDateTime(local(2026, 0, 5, 16, 5))).toBe('5 Jan, 4:05 PM');
  });

  it('handles midnight and noon', () => {
    expect(formatDateTime(local(2026, 10, 1, 0, 0))).toBe('1 Nov, 12:00 AM');
    expect(formatDateTime(local(2026, 10, 1, 12, 0))).toBe('1 Nov, 12:00 PM');
  });

  it('returns nothing for a value that is not a date', () => {
    expect(formatDateTime('not a date')).toBe('');
  });
});
