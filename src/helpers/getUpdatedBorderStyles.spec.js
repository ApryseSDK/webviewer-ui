import getUpdatedBorderStyles from './getUpdatedBorderStyles';

describe('getUpdatedBorderStyles', () => {
  const mockStyle = 'Thin';
  const mockColor = 'black';
  const noBorder = { color: null, style: 'None' };
  const activeBorder = { color: mockColor, style: mockStyle };

  describe('when clicking "None" button', () => {
    it('returns all borders set to None', () => {
      const currentBorders = {
        top: activeBorder,
        left: activeBorder,
        bottom: noBorder,
        right: noBorder,
      };
      const result = getUpdatedBorderStyles(currentBorders, 'None', mockStyle, mockColor);
      expect(result).toEqual({
        top: noBorder,
        left: noBorder,
        bottom: noBorder,
        right: noBorder,
      });
    });
  });

  describe('when clicking "All" or "Outside" button', () => {
    test.each([
      ['All', { top: activeBorder, left: noBorder, bottom: noBorder, right: noBorder }],
      ['Outside', { top: noBorder, left: activeBorder, bottom: noBorder, right: noBorder }],
      ['Outside', { top: activeBorder, left: noBorder, bottom: activeBorder, right: noBorder }],
    ])('returns all four borders active when clicking "%s"', (clickedButton, currentBorders) => {

      const result = getUpdatedBorderStyles(currentBorders, clickedButton, mockStyle, mockColor);

      expect(result).toEqual({
        top: activeBorder,
        left: activeBorder,
        bottom: activeBorder,
        right: activeBorder,
      });
    });
  });

  describe('when clicking individual side buttons from "Outside" state', () => {
    test.each(['Top', 'Left', 'Right', 'Bottom'])(
      'clears all and shows only "%s" when coming from all four borders active',
      (side) => {
        const allBordersActive = {
          top: activeBorder,
          left: activeBorder,
          bottom: activeBorder,
          right: activeBorder,
        };

        const result = getUpdatedBorderStyles(allBordersActive, side, mockStyle, mockColor);

        const expected = {
          top: noBorder,
          left: noBorder,
          bottom: noBorder,
          right: noBorder,
        };
        expected[side.toLowerCase()] = activeBorder;

        expect(result).toEqual(expected);
      }
    );
  });
});