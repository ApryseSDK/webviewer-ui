import { act } from '@testing-library/react';
import { renderHook } from '@testing-library/react-hooks';
import useStampSearch from './useStampSearch';

const mockFormatCustomStampSubtitle = jest.fn();
const mockGetTool = jest.fn();

jest.mock('hooks/useCore', () => () => ({
  core: {
    getTool: mockGetTool,
  },
}));

describe('useStampSearch', () => {
  beforeEach(() => {
    mockFormatCustomStampSubtitle.mockReset();
    mockFormatCustomStampSubtitle.mockImplementation((subtitle) => subtitle.replace('$currentUser', 'Current User'));
    mockGetTool.mockReturnValue({
      formatCustomStampSubtitle: mockFormatCustomStampSubtitle,
    });
  });

  it('matches the current user substituted into a stamp subtitle', () => {
    const stamp = {
      annotation: {
        subtitle: '[By $currentUser at] h:mm:ss a, MMMM D, YYYY',
        DateCreated: new Date('2026-01-02T13:02:03'),
      },
      index: 0,
    };
    const { result } = renderHook(() => useStampSearch({
      stamps: [stamp],
      visibleCategories: ['custom'],
      getStampCategory: () => 'custom',
    }));

    act(() => result.current.setSearchValue('current user'));

    expect(result.current.searchResults).toEqual({ custom: [stamp] });
  });

  it('matches a timestamp formatted into a stamp subtitle', () => {
    mockFormatCustomStampSubtitle.mockImplementation((subtitle, date) => {
      return `${subtitle.replace('$currentUser', 'Current User')} ${date.toISOString()}`;
    });
    const stamp = {
      annotation: {
        subtitle: '[By $currentUser at] h:mm:ss a, MMMM D, YYYY',
        DateCreated: new Date('2026-01-02T13:02:03.000Z'),
      },
      index: 0,
    };
    const { result } = renderHook(() => useStampSearch({
      stamps: [stamp],
      visibleCategories: ['custom'],
      getStampCategory: () => 'custom',
    }));

    act(() => result.current.setSearchValue('2026-01-02t13:02:03.000z'));

    expect(result.current.searchResults).toEqual({ custom: [stamp] });
    expect(mockFormatCustomStampSubtitle).toHaveBeenLastCalledWith(
      stamp.annotation.subtitle,
      stamp.annotation.DateCreated,
    );
  });

  it('returns an empty object when no stamps match the search value', () => {
    const stamp = {
      annotation: {
        subtitle: '[By $currentUser at] h:mm:ss a, MMMM D, YYYY',
        DateCreated: new Date('2026-01-02T13:02:03'),
      },
    };
    const { result } = renderHook(() => useStampSearch({
      stamps: [stamp],
      visibleCategories: ['custom'],
      getStampCategory: () => 'custom',
    }));

    act(() => result.current.setSearchValue('non-matching search value'));

    expect(result.current.searchResults).toEqual({});
  });

  it('returns all stamps by category when the search value is empty', () => {
    const stamp = {
      annotation: {
        subtitle: '[By $currentUser at] h:mm:ss a, MMMM D, YYYY',
        DateCreated: new Date('2026-01-02T13:02:03'),
      },
      index: 0,
    };
    const { result } = renderHook(() => useStampSearch({
      stamps: [stamp],
      visibleCategories: ['custom'],
      getStampCategory: () => 'custom',
    }));

    act(() => result.current.setSearchValue(''));

    expect(result.current.searchResults).toEqual({ custom: [stamp] });
  });

  it('returns all stamps for an empty search when the stamp tool has no subtitle formatter', () => {
    mockGetTool.mockReturnValue({});
    const stamp = {
      annotation: {
        subtitle: '[By $currentUser at] h:mm:ss a, MMMM D, YYYY',
        DateCreated: new Date('2026-01-02T13:02:03'),
      },
      index: 0,
    };

    const { result } = renderHook(() => useStampSearch({
      stamps: [stamp],
      visibleCategories: ['custom'],
      getStampCategory: () => 'custom',
    }));

    expect(result.current.searchResults).toEqual({ custom: [stamp] });
    expect(mockFormatCustomStampSubtitle).not.toHaveBeenCalled();
  });

  it('does not throw when the stamp tool is unavailable during a non-empty search', () => {
    mockGetTool.mockReturnValue(undefined);
    const stamp = {
      annotation: {
        subtitle: '[By $currentUser at] h:mm:ss a, MMMM D, YYYY',
        DateCreated: new Date('2026-01-02T13:02:03'),
      },
    };

    const { result } = renderHook(() => useStampSearch({
      stamps: [stamp],
      visibleCategories: ['custom'],
      getStampCategory: () => 'custom',
    }));

    act(() => result.current.setSearchValue('current user'));

    expect(result.current.searchResults).toEqual({});
    expect(mockFormatCustomStampSubtitle).not.toHaveBeenCalled();
  });

  it('returns all stamps matching the stampText, title, or subtitle and sorts them by category', () => {
    const searchValue = 'tion';
    const stampWithTitleMatch = {
      annotation: {
        DateCreated: new Date('2026-01-02T13:02:03'),
        title: 'Motion',
        stampText: 'stamp text',
        subtitle: '[By $currentUser at] h:mm:ss a, MMMM D, YYYY',
      },
      index: 0,
    };
    const stampWithStampTextMatch = {
      annotation: {
        DateCreated: new Date('2026-01-02T13:02:03'),
        title: 'title',
        stampText: 'Prosecution',
        subtitle: '[By $currentUser at] h:mm:ss a, MMMM D, YYYY',
      },
      index: 1,
    };
    const stampWithSubtitleMatch = {
      annotation: {
        DateCreated: new Date('2026-01-02T13:02:03'),
        title: 'title',
        stampText: 'stamp text',
        subtitle: '[Redaction by $currentUser at] h:mm:ss a, MMMM D, YYYY',
      },
      index: 2,
    };
    const stampWithNoMatch = {
      annotation: {
        DateCreated: new Date('2026-01-02T13:02:03'),
        title: 'title',
        stampText: 'stamp text',
        subtitle: '[By $currentUser at] h:mm:ss a, MMMM D, YYYY',
      },
      index: 3,
    };
    const { result } = renderHook(() => useStampSearch({
      stamps: [stampWithTitleMatch, stampWithStampTextMatch, stampWithSubtitleMatch, stampWithNoMatch],
      visibleCategories: ['custom'],
      getStampCategory: () => 'custom',
    }));

    act(() => result.current.setSearchValue(searchValue));

    expect(result.current.searchResults).toEqual({ custom: [stampWithTitleMatch, stampWithStampTextMatch, stampWithSubtitleMatch] });
  });

  it('matches compiled annotation data through public and serialized APIs', () => {
    const stamp = {
      annotation: {
        getStampText: () => 'Approved',
        getCustomData: () => JSON.stringify({
          title: 'Draft',
          subtitle: 'Prepared by Current User',
        }),
      },
      index: 0,
    };
    const { result } = renderHook(() => useStampSearch({
      stamps: [stamp],
      visibleCategories: ['custom'],
      getStampCategory: () => 'custom',
    }));

    act(() => result.current.setSearchValue('approved'));
    expect(result.current.searchResults).toEqual({ custom: [stamp] });

    act(() => result.current.setSearchValue('draft'));
    expect(result.current.searchResults).toEqual({ custom: [stamp] });

    act(() => result.current.setSearchValue('current user'));
    expect(result.current.searchResults).toEqual({ custom: [stamp] });
  });

  it('returns a searchValue and setSearchValue function that updates it', () => {
    const { result } = renderHook(() => useStampSearch({
      stamps: [],
      visibleCategories: ['custom'],
      getStampCategory: () => 'custom',
    }));

    expect(result.current.searchValue).toBe('');
    expect(typeof result.current.setSearchValue).toBe('function');
    act(() => result.current.setSearchValue('new search value'));
    expect(result.current.searchValue).toBe('new search value');
  });

  it('sorts categories alphabetically in the searchResults object', () => {
    const stamp1 = {
      annotation: {
        DateCreated: new Date('2026-01-02T13:02:03'),
        title: 'Motion',
        category: 'zeta',
      },
    };
    const stamp2 = {
      annotation: {
        DateCreated: new Date('2026-01-02T13:02:03'),
        title: 'title',
        category: 'rubberStampPanel.standard',
      },
    };
    const stamp3 = {
      annotation: {
        DateCreated: new Date('2026-01-02T13:02:03'),
        title: 'title',
        category: 'alpha',
      },
    };
    const stamp4 = {
      annotation: {
        DateCreated: new Date('2026-01-02T13:02:03'),
        title: 'title',
        category: 's1', // between rubberStampPanel.standard and zeta
      },
    };
    const stamps = [stamp1, stamp2, stamp3, stamp4];

    const { result } = renderHook(() => useStampSearch({
      stamps,
      visibleCategories: ['alpha', 's1', 'rubberStampPanel.standard', 'zeta'],
      getStampCategory: (stamp) => stamp.annotation.category,
    }));

    const sortedCategories = Object.keys(result.current.searchResults);
    expect(sortedCategories).toEqual(['alpha', 's1', 'rubberStampPanel.standard', 'zeta']);
  });

  it('only returns visible categories in the searchResults object', () => {
    const stamp1 = {
      annotation: {
        DateCreated: new Date('2026-01-02T13:02:03'),
        title: 'Motion',
        category: 'zeta',
      },
    };
    const stamp2 = {
      annotation: {
        DateCreated: new Date('2026-01-02T13:02:03'),
        title: 'title',
        category: 'rubberStampPanel.standard',
      },
    };
    const stamp3 = {
      annotation: {
        DateCreated: new Date('2026-01-02T13:02:03'),
        title: 'title',
        category: 'alpha',
      },
    };
    const stamp4 = {
      annotation: {
        DateCreated: new Date('2026-01-02T13:02:03'),
        title: 'title',
        category: 's1',
      },
    };
    const stamps = [stamp1, stamp2, stamp3, stamp4];

    const { result } = renderHook(() => useStampSearch({
      stamps,
      visibleCategories: ['alpha', 'zeta'],
      getStampCategory: (stamp) => stamp.annotation.category,
    }));

    const resultCategories = Object.keys(result.current.searchResults);
    expect(resultCategories).toEqual(['alpha', 'zeta']);
  });

  it('only returns categories with stamps in the searchResults object', () => {
    const stamp1 = {
      annotation: {
        DateCreated: new Date('2026-01-02T13:02:03'),
        title: 'title',
        category: 'alpha',
      },
    };
    const stamp2 = {
      annotation: {
        DateCreated: new Date('2026-01-02T13:02:03'),
        title: 'Motion',
        category: 'zeta',
      },
    };
    const stamps = [stamp1, stamp2];

    const { result } = renderHook(() => useStampSearch({
      stamps,
      visibleCategories: ['alpha', 'beta', 'zeta'],
      getStampCategory: (stamp) => stamp.annotation.category,
    }));

    const resultCategories = Object.keys(result.current.searchResults);
    expect(resultCategories).toEqual(['alpha', 'zeta']);
  });
});