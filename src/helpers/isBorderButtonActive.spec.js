import isBorderButtonActive from './isBorderButtonActive';
import getSelectedCellStyle from './getSelectedCellStyle';

jest.mock('./getSelectedCellStyle');

describe('isBorderButtonActive', () => {
  let mockGetSelectedCellStyle;
  let mockGetCellBorder;

  beforeEach(() => {
    mockGetCellBorder = jest.fn();
    mockGetSelectedCellStyle = jest.fn(() => ({
      getCellBorder: mockGetCellBorder,
    }));
    getSelectedCellStyle.mockImplementation(mockGetSelectedCellStyle);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('when checking border sides', () => {
    it('returns true for "Left" when left border has style other than "None"', () => {
      mockGetCellBorder.mockImplementation((side) => {
        if (side === 'Left') {
          return { style: 'Thin' };
        }
        return undefined;
      });

      const state = isBorderButtonActive('Left');

      expect(state).toBe(true);
    });

    it('returns false for "Left" when left border has style "None"', () => {
      mockGetCellBorder.mockImplementation((side) => {
        if (side === 'Left') {
          return { style: 'None' };
        }
        return undefined;
      });

      const state = isBorderButtonActive('Left');

      expect(state).toBe(false);
    });
  });

  describe('when getSelectedCellStyle returns null', () => {
    beforeEach(() => {
      getSelectedCellStyle.mockReturnValue(null);
    });

    it('returns true for "None" button', () => {
      const state = isBorderButtonActive('None');
      expect(state).toBe(true);
    });

    it('returns false for multiple cell selection buttons', () => {
      expect(isBorderButtonActive('Outside')).toBe(false);
      expect(isBorderButtonActive('Inside')).toBe(false);
      expect(isBorderButtonActive('Vertical')).toBe(false);
      expect(isBorderButtonActive('Horizontal')).toBe(false);
      expect(isBorderButtonActive('All')).toBe(false);
    });
  });
});
