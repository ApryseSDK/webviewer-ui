import { waitFor } from '@testing-library/react';
import { renderHook } from '@testing-library/react-hooks';
import useStampSearchOptionsFlyout from './useStampSearchOptionsFlyout';

describe('useStampSearchOptionsFlyout', () => {
  describe('categoryMap', () => {
    it('initializes with isCheckboxEnabled true', async () => {
      const params = {
        stamps: [],
        categories: ['alpha', 'beta'],
        getStampsByCategory: jest.fn(),
      };
      const { result } = renderHook(() => useStampSearchOptionsFlyout(params));

      const { categoryMap } = result.current;
      expect(categoryMap.alpha.isCheckboxEnabled).toBe(true);
      expect(categoryMap.beta.isCheckboxEnabled).toBe(true);
    });

    it('initializes with isCheckboxVisible true if category has stamps and false otherwise', async () => {
      const params = {
        stamps: [{ id: 1, category: 'alpha' }],
        categories: ['alpha', 'beta'],
        getStampsByCategory: jest.fn((stamps, category) => stamps.filter((stamp) => stamp.category === category)),
      };
      const { result } = renderHook(() => useStampSearchOptionsFlyout(params));

      const { categoryMap } = result.current;
      expect(categoryMap.alpha.isCheckboxVisible).toBe(true);
      expect(categoryMap.beta.isCheckboxVisible).toBe(false);
    });

    it('updates categoryMap when stamps change', async () => {
      const params = {
        stamps: [{ id: 1, category: 'alpha' }],
        categories: ['alpha', 'beta'],
        getStampsByCategory: jest.fn((stamps, category) => stamps.filter((stamp) => stamp.category === category)),
      };
      const { result, rerender } = renderHook((hookParams) => useStampSearchOptionsFlyout(hookParams), { initialProps: params });

      expect(result.current.categoryMap.alpha.isCheckboxVisible).toBe(true);
      expect(result.current.categoryMap.beta.isCheckboxVisible).toBe(false);

      // Update the stamps to include a stamp in the beta category
      const newStamps = [{ id: 1, category: 'alpha' }, { id: 2, category: 'beta' }];
      rerender({ ...params, stamps: newStamps });

      await waitFor(() => expect(result.current.categoryMap.beta.isCheckboxVisible).toBe(true));
    });

    it('preserves unchecked categories when stamps change', async () => {
      const params = {
        stamps: [{ id: 1, category: 'alpha' }, { id: 2, category: 'beta' }],
        categories: ['alpha', 'beta'],
        getStampsByCategory: jest.fn((stamps, category) => stamps.filter((stamp) => stamp.category === category)),
      };
      const { result, rerender } = renderHook((hookParams) => useStampSearchOptionsFlyout(hookParams), { initialProps: params });

      result.current.onCheckboxChange('beta');

      expect(result.current.categoryMap.beta.isCheckboxEnabled).toBe(false);
      expect(result.current.visibleCategories).toEqual(['alpha']);

      rerender({ ...params, stamps: [...params.stamps, { id: 3, category: 'beta' }] });

      await waitFor(() => {
        expect(result.current.categoryMap.beta.isCheckboxVisible).toBe(true);
        expect(result.current.categoryMap.beta.isCheckboxEnabled).toBe(false);
        expect(result.current.visibleCategories).toEqual(['alpha']);
      });
    });

    it('hides all categories if no stamps are present', async () => {
      const params = {
        stamps: [],
        categories: ['alpha', 'beta'],
        getStampsByCategory: jest.fn((stamps, category) => stamps.filter((stamp) => stamp.category === category)),
      };
      const { result } = renderHook(() => useStampSearchOptionsFlyout(params));

      const { categoryMap } = result.current;
      expect(categoryMap.alpha.isCheckboxVisible).toBe(false);
      expect(categoryMap.beta.isCheckboxVisible).toBe(false);
    });

    it('hides a category that has no stamps while showing categories that do', async () => {
      const params = {
        stamps: [{ id: 1, category: 'alpha' }],
        categories: ['alpha', 'beta'],
        getStampsByCategory: jest.fn((stamps, category) => stamps.filter((stamp) => stamp.category === category)),
      };
      const { result } = renderHook(() => useStampSearchOptionsFlyout(params));

      const { categoryMap } = result.current;
      expect(categoryMap.alpha.isCheckboxVisible).toBe(true);
      expect(categoryMap.beta.isCheckboxVisible).toBe(false);
      expect(result.current.visibleCategories).toEqual(['alpha']);
    });

    it('does not show any categories after all visible categories are unchecked', () => {
      const params = {
        stamps: [{ id: 1, category: 'alpha' }, { id: 2, category: 'beta' }],
        categories: ['alpha', 'beta'],
        getStampsByCategory: jest.fn((stamps, category) => stamps.filter((stamp) => stamp.category === category)),
      };
      const { result } = renderHook(() => useStampSearchOptionsFlyout(params));

      expect(result.current.visibleCategories).toEqual(['alpha', 'beta']);

      result.current.onCheckboxChange('alpha');
      result.current.onCheckboxChange('beta');

      expect(result.current.categoryMap.alpha.isCheckboxEnabled).toBe(false);
      expect(result.current.visibleCategories).toEqual([]);
    });
  });
});
