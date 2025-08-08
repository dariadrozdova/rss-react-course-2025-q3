import React from 'react';

import { act, renderHook } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { usePaginationAndSearch } from '@hooks/usePaginationAndSearch';

const mockStorage: Record<string, string> = {};

vi.mock('./useLocalStorage', () => ({
  default: vi.fn((key: string, initialValue: string) => {
    return [
      mockStorage[key] || initialValue,
      vi.fn((value: string) => {
        mockStorage[key] = value;
      }),
    ];
  }),
}));

const mockSetSearchParameters = vi.fn();
let mockSearchParameters = new URLSearchParams();

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useSearchParams: () => [mockSearchParameters, mockSetSearchParameters],
  };
});

const renderHookWithRouter = () => {
  const wrapper = ({ children }: { children: React.ReactNode }) =>
    React.createElement('div', null, children);

  return renderHook(() => usePaginationAndSearch(), { wrapper });
};

describe('usePaginationAndSearch', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    for (const key of Object.keys(mockStorage)) {
      mockStorage[key] = '';
    }
    mockSearchParameters = new URLSearchParams();
  });

  describe('initial state', () => {
    it('should return default values when no URL params are present', () => {
      const { result } = renderHookWithRouter();

      expect(result.current.currentPage).toBe(1);
      expect(result.current.effectiveSearchTerm).toBe('');
    });

    it('should read search term from URL params', () => {
      mockSearchParameters = new URLSearchParams('search=test-query&page=2');

      const { result } = renderHookWithRouter();

      expect(result.current.effectiveSearchTerm).toBe('test-query');
      expect(result.current.currentPage).toBe(2);
    });

    it('should handle invalid page numbers', () => {
      mockSearchParameters = new URLSearchParams('page=0');

      const { result } = renderHookWithRouter();

      expect(result.current.currentPage).toBe(1);
    });

    describe('handleSearch', () => {
      it('should update URL params when searching with a term', () => {
        const { result } = renderHookWithRouter();

        act(() => {
          result.current.handleSearch('test-search');
        });

        expect(mockSetSearchParameters).toHaveBeenCalledWith(
          expect.objectContaining({
            toString: expect.any(Function),
          })
        );

        const callArguments = mockSetSearchParameters.mock.calls[0][0];
        const parameters = new URLSearchParams(callArguments.toString());
        expect(parameters.get('search')).toBe('test-search');
        expect(parameters.get('page')).toBe('1');
      });

      it('should remove search param when searching with empty term', () => {
        mockSearchParameters.set('search', 'existing-search');
        mockSearchParameters.set('page', '3');

        const { result } = renderHookWithRouter();

        act(() => {
          result.current.handleSearch('');
        });

        const callArguments = mockSetSearchParameters.mock.calls[0][0];
        const parameters = new URLSearchParams(callArguments.toString());
        expect(parameters.has('search')).toBe(false);
        expect(parameters.get('page')).toBe('1');
      });

      it('should trim whitespace from search terms', () => {
        const { result } = renderHookWithRouter();

        act(() => {
          result.current.handleSearch('  test-search  ');
        });

        const callArguments = mockSetSearchParameters.mock.calls[0][0];
        const parameters = new URLSearchParams(callArguments.toString());
        expect(parameters.get('search')).toBe('test-search');
      });

      it('should treat whitespace-only search as empty', () => {
        const { result } = renderHookWithRouter();

        act(() => {
          result.current.handleSearch('   ');
        });

        const callArguments = mockSetSearchParameters.mock.calls[0][0];
        const parameters = new URLSearchParams(callArguments.toString());
        expect(parameters.has('search')).toBe(false);
      });
    });

    describe('handlePageChange', () => {
      it('should update page in URL params', () => {
        const { result } = renderHookWithRouter();

        act(() => {
          result.current.handlePageChange(3);
        });

        expect(mockSetSearchParameters).toHaveBeenCalledWith(
          expect.objectContaining({
            toString: expect.any(Function),
          })
        );

        const callArguments = mockSetSearchParameters.mock.calls[0][0];
        const parameters = new URLSearchParams(callArguments.toString());
        expect(parameters.get('page')).toBe('3');
      });

      it('should preserve existing search params when changing page', () => {
        const TEST_PAGE_NUMBER = 4;
        mockSearchParameters = new URLSearchParams(
          'search=existing-search&page=1'
        );

        const { result } = renderHookWithRouter();

        act(() => {
          result.current.handlePageChange(TEST_PAGE_NUMBER);
        });

        const callArguments = mockSetSearchParameters.mock.calls[0][0];
        const parameters = new URLSearchParams(callArguments.toString());
        expect(parameters.get('search')).toBe('existing-search');
        expect(parameters.get('page')).toBe('4');
      });
    });

    describe('effectiveSearchTerm logic', () => {
      it('should return empty string when search param is not in URL', () => {
        const { result } = renderHookWithRouter();

        expect(result.current.effectiveSearchTerm).toBe('');
      });

      it('should return search param value when present in URL', () => {
        mockSearchParameters = new URLSearchParams('search=url-search');

        const { result } = renderHookWithRouter();

        expect(result.current.effectiveSearchTerm).toBe('url-search');
      });

      it('should return empty string when search param exists but is empty', () => {
        mockSearchParameters = new URLSearchParams('search=');

        const { result } = renderHookWithRouter();

        expect(result.current.effectiveSearchTerm).toBe('');
      });
    });

    describe('edge cases', () => {
      it('should handle multiple consecutive searches', () => {
        const { result } = renderHookWithRouter();

        act(() => {
          result.current.handleSearch('first-search');
        });

        act(() => {
          result.current.handleSearch('second-search');
        });

        act(() => {
          result.current.handleSearch('');
        });

        expect(mockSetSearchParameters).toHaveBeenCalledTimes(3);
      });
    });
  });
});
