import getNotesPanelSortStrategy from 'helpers/getNotesPanelSortStrategy';
import { getExtendedSortStrategies } from 'constants/sortStrategies';

jest.mock('constants/sortStrategies', () => ({
  getExtendedSortStrategies: jest.fn(),
}));

describe('getNotesPanelSortStrategy', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('returns the active strategy when key exists', () => {
    const mockStrategy = {
      getSortedNotes: jest.fn(),
      shouldRenderSeparator: jest.fn(),
      getSeparatorContent: jest.fn(),
    };

    getExtendedSortStrategies.mockReturnValue({
      createdDate: mockStrategy,
    });

    const activeSortStrategy = getNotesPanelSortStrategy('createdDate');

    expect(activeSortStrategy).toBe(mockStrategy);
  });

  it('falls back to the first strategy and warns on unknown key', () => {
    const warnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});
    const firstStrategy = {
      getSortedNotes: jest.fn(),
      shouldRenderSeparator: jest.fn(),
      getSeparatorContent: jest.fn(),
    };

    getExtendedSortStrategies.mockReturnValue({
      position: firstStrategy,
      createdDate: {
        getSortedNotes: jest.fn(),
        shouldRenderSeparator: jest.fn(),
        getSeparatorContent: jest.fn(),
      },
    });

    const activeSortStrategy = getNotesPanelSortStrategy('unknown');

    expect(activeSortStrategy).toBe(firstStrategy);
    expect(warnSpy).toHaveBeenCalledWith('Unknown sort strategy: unknown');

  });

  it('uses a safe fallback when no strategies exist', () => {
    getExtendedSortStrategies.mockReturnValue({});

    const activeSortStrategy = getNotesPanelSortStrategy('unknown');
    const notes = [1, 2, 3];

    expect(activeSortStrategy.getSortedNotes(notes)).toBe(notes);
    expect(activeSortStrategy.shouldRenderSeparator()).toBe(false);
    expect(activeSortStrategy.getSeparatorContent()).toBe('');
  });
});
