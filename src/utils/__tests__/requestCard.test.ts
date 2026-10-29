import { strings } from '@/content/strings';
import { requestBudget, requestMeta, requestTitle } from '../requestCard';

const now = new Date(2026, 9, 29);
const iso = (m: number, d: number) => new Date(2026, m, d, 12).toISOString();

describe('requestTitle', () => {
  it('names a whole-home project "Full home renovation", whatever its category says', () => {
    expect(requestTitle({ requestType: 'FULL_HOME_PROJECT', categoryName: '3 BHK Home Interior' })).toBe('Full home renovation');
    expect(requestTitle({ requestType: 'FULL_HOME_PROJECT', categoryName: null })).toBe('Full home renovation');
  });

  it('names a single service by its category, without repeating the type', () => {
    expect(requestTitle({ requestType: 'INDIVIDUAL_SERVICE', categoryName: 'Modular Kitchen' })).toBe('Modular Kitchen');
    expect(requestTitle({ requestType: 'INDIVIDUAL_SERVICE', categoryName: '  Painting ' })).toBe('Painting');
  });

  it('falls back to a plain label when the category is missing or blank', () => {
    expect(requestTitle({ requestType: 'INDIVIDUAL_SERVICE', categoryName: null })).toBe(strings.requests.titles.service);
    expect(requestTitle({ requestType: 'INDIVIDUAL_SERVICE', categoryName: '   ' })).toBe(strings.requests.titles.service);
    expect(requestTitle({ requestType: 'UNKNOWN', categoryName: null })).toBe(strings.requests.titles.unknown);
  });
});

describe('requestMeta', () => {
  it('joins location and created date, with no time of day', () => {
    expect(requestMeta({ location: 'Pune', createdAt: iso(8, 11) }, now)).toBe('Pune · 11 Sep');
  });

  it('leaves out whatever is missing, and is null when both are', () => {
    expect(requestMeta({ location: null, createdAt: iso(8, 11) }, now)).toBe('11 Sep');
    expect(requestMeta({ location: 'Pune', createdAt: 'bad' }, now)).toBe('Pune');
    expect(requestMeta({ location: ' ', createdAt: 'bad' }, now)).toBeNull();
  });
});

describe('requestBudget', () => {
  it('shows the range in Indian short form', () => {
    expect(requestBudget({ budgetMin: 500000, budgetMax: 800000 })).toBe('₹5L–₹8L');
  });

  it('is null, never "null" or "₹0", when there is no budget', () => {
    expect(requestBudget({ budgetMin: null, budgetMax: null })).toBeNull();
    expect(requestBudget({ budgetMin: 0, budgetMax: 0 })).toBeNull();
  });
});
