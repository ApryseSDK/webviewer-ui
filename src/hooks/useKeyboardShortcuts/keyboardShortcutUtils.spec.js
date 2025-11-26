import { filterOutDisabledToolShortcuts, filterViewOnlyShortcuts } from './utils';
import { getViewOnlyShortcuts, isShortcutInToolList } from 'helpers/hotkeysManager';

jest.mock('helpers/hotkeysManager', () => ({
  getViewOnlyShortcuts: jest.fn(),
  isShortcutInToolList: jest.fn(),
}));

describe('keyboardShortcutUtils', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('filterOutDisabledToolShortcuts', () => {
    const mockShortcuts = [
      ['ERASER', { key: 'E' }],
      ['PAN', { key: 'P' }],
      ['SELECT', { key: 'Escape' }],
      ['ZOOM_IN', { key: '=' }],
    ];

    it('returns all shortcuts when disabledToolNames is empty', () => {
      const result = filterOutDisabledToolShortcuts(mockShortcuts, []);

      expect(result).toEqual(mockShortcuts);
      expect(result).toHaveLength(4);
      expect(isShortcutInToolList).not.toHaveBeenCalled();
    });

    it('filters out shortcuts for disabled tools', () => {
      isShortcutInToolList.mockImplementation((shortcut, toolNames) => {
        return shortcut === 'ERASER' && toolNames.includes('AnnotationEraserTool');
      });

      const result = filterOutDisabledToolShortcuts(mockShortcuts, ['AnnotationEraserTool']);

      expect(result).toHaveLength(3);
      expect(result.find(([shortcut]) => shortcut === 'ERASER')).toBeUndefined();
      expect(result.find(([shortcut]) => shortcut === 'PAN')).toBeDefined();
      expect(result.find(([shortcut]) => shortcut === 'SELECT')).toBeDefined();
      expect(result.find(([shortcut]) => shortcut === 'ZOOM_IN')).toBeDefined();
    });

    it('handles empty shortcuts array', () => {
      const result = filterOutDisabledToolShortcuts([], ['AnnotationEraserTool']);

      expect(result).toEqual([]);
    });
  });

  describe('filterViewOnlyShortcuts', () => {
    const mockShortcuts = [
      ['ERASER', { key: 'E' }],
      ['PAN', { key: 'P' }],
      ['SELECT', { key: 'Escape' }],
      ['ZOOM_IN', { key: '=' }],
      ['ZOOM_OUT', { key: '-' }],
    ];

    const mockShortcutKeyMap = {
      ERASER: 'E',
      PAN: 'P',
      SELECT: 'Escape',
      ZOOM_IN: '=',
      ZOOM_OUT: '-',
    };

    it('returns only view-only shortcuts that have key bindings', () => {
      getViewOnlyShortcuts.mockReturnValue(['SELECT', 'ZOOM_IN']);

      const result = filterViewOnlyShortcuts(mockShortcuts, mockShortcutKeyMap);

      expect(result).toHaveLength(2);
      expect(result).toEqual([
        ['SELECT', { key: 'Escape' }],
        ['ZOOM_IN', { key: '=' }],
      ]);
      expect(getViewOnlyShortcuts).toHaveBeenCalledTimes(1);
    });

    it('returns empty array when no shortcuts are view-only', () => {
      getViewOnlyShortcuts.mockReturnValue([]);

      const result = filterViewOnlyShortcuts(mockShortcuts, mockShortcutKeyMap);

      expect(result).toEqual([]);
    });

    it('returns empty array when shortcutKeyMap is empty', () => {
      getViewOnlyShortcuts.mockReturnValue(['SELECT', 'ZOOM_IN']);

      const result = filterViewOnlyShortcuts(mockShortcuts, {});

      expect(result).toEqual([]);
    });

    it('handles empty shortcuts array', () => {
      getViewOnlyShortcuts.mockReturnValue(['SELECT']);

      const result = filterViewOnlyShortcuts([], mockShortcutKeyMap);

      expect(result).toEqual([]);
    });
  });
});