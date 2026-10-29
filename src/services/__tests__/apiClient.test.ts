import { buildQuery } from '../apiClient';

describe('buildQuery', () => {
  it('repeats the key for arrays, as the backend expects for ?status=A&status=B', () => {
    expect(buildQuery({ status: ['PENDING', 'CONFIRMED'], page: 0 })).toBe('?status=PENDING&status=CONFIRMED&page=0');
  });

  it('leaves out undefined values and empty arrays, and returns nothing when nothing is left', () => {
    expect(buildQuery({ a: undefined, b: [] })).toBe('');
    expect(buildQuery(undefined)).toBe('');
  });

  it('writes booleans and escapes values', () => {
    expect(buildQuery({ actionNeeded: true, q: 'a b&c' })).toBe('?actionNeeded=true&q=a%20b%26c');
  });
});
