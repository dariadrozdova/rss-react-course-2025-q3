import { act, renderHook } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { useLoaderTimeout } from '@hooks/useLoaderTimeout';

const DEFAULT_TIMEOUT = 500;
const CUSTOM_TIMEOUT = 1000;

describe('useLoaderTimeout', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.runOnlyPendingTimers();
    vi.useRealTimers();
  });

  describe('initial state and timeout behavior', () => {
    it('returns true initially and false after timeout', () => {
      const { result } = renderHook(() => useLoaderTimeout('1'));

      expect(result.current).toBe(true);

      act(() => {
        vi.advanceTimersByTime(DEFAULT_TIMEOUT);
      });

      expect(result.current).toBe(false);
    });

    it('respects custom timeout value', () => {
      const { result } = renderHook(() =>
        useLoaderTimeout('1', CUSTOM_TIMEOUT)
      );

      act(() => {
        vi.advanceTimersByTime(CUSTOM_TIMEOUT - 1);
      });
      expect(result.current).toBe(true);

      act(() => {
        vi.advanceTimersByTime(1);
      });
      expect(result.current).toBe(false);
    });
  });

  describe('detailsId changes', () => {
    it.each([
      ['resets to true when detailsId changes', '1', '2', true],
      [
        'does not reset when detailsId becomes undefined',
        '1',
        undefined,
        false,
      ],
    ])('%s', (_, initialId, newId, shouldReset) => {
      const { rerender, result } = renderHook(
        ({ detailsId }: { detailsId: string | undefined }) =>
          useLoaderTimeout(detailsId),
        { initialProps: { detailsId: initialId as string | undefined } }
      );

      act(() => {
        vi.advanceTimersByTime(DEFAULT_TIMEOUT);
      });
      expect(result.current).toBe(false);

      rerender({ detailsId: newId });
      expect(result.current).toBe(shouldReset);
    });
  });

  describe('cleanup', () => {
    it('clears timeout on unmount', () => {
      const clearTimeoutSpy = vi.spyOn(global, 'clearTimeout');
      const { unmount } = renderHook(() => useLoaderTimeout('1'));

      unmount();

      expect(clearTimeoutSpy).toHaveBeenCalled();
      clearTimeoutSpy.mockRestore();
    });
  });
});
