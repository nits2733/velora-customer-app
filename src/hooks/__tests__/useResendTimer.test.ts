import { act, renderHook } from '@testing-library/react-native';
import { useResendTimer } from '../useResendTimer';

beforeEach(() => jest.useFakeTimers());

/** Each tick schedules the next one only after React re-renders, so advance one second per act. */
async function tick(seconds: number) {
  for (let i = 0; i < seconds; i += 1) {
    await act(async () => {
      jest.advanceTimersByTime(1000);
    });
  }
}
afterEach(() => jest.useRealTimers());

describe('useResendTimer', () => {
  it('starts locked, counts down each second, and unlocks at zero', async () => {
    const { result } = await renderHook(() => useResendTimer(3));
    expect(result.current).toMatchObject({ left: 3, ready: false });

    await tick(1);
    expect(result.current.left).toBe(2);

    await tick(2);
    expect(result.current).toMatchObject({ left: 0, ready: true });
  });

  it('locks again after a new code is sent', async () => {
    const { result } = await renderHook(() => useResendTimer(2));
    await tick(2);
    expect(result.current.ready).toBe(true);

    await act(async () => {
      result.current.restart();
    });
    expect(result.current).toMatchObject({ left: 2, ready: false });
  });
});
