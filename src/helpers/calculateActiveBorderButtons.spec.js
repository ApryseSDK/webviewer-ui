import calculateActiveBorderButtons from './calculateActiveBorderButtons';

describe('calculateActiveBorderButtons', () => {
  describe('when no borders are set', () => {
    it('returns ["None"] when all borders are undefined', () => {
      const borderStyles = {
        top: undefined,
        left: undefined,
        right: undefined,
        bottom: undefined,
      };

      const result = calculateActiveBorderButtons(borderStyles);

      expect(result).toEqual(['None']);
    });
  });

  describe('when all borders are set', () => {
    it('returns ["Outside"] when all four borders have styles', () => {
      const borderStyles = {
        top: { style: 'Thin' },
        left: { style: 'Thin' },
        right: { style: 'Thin' },
        bottom: { style: 'Thin' },
      };

      const result = calculateActiveBorderButtons(borderStyles);

      expect(result).toEqual(['Outside']);
    });
  });

  describe('when individual borders are set', () => {
    it('returns ["Top"] when only top border has style', () => {
      const borderStyles = {
        top: { style: 'Thin' },
        left: undefined,
        right: undefined,
        bottom: undefined,
      };

      const result = calculateActiveBorderButtons(borderStyles);

      expect(result).toEqual(['Top']);
    });
  });

  describe('when multiple individual borders are set', () => {
    it('returns ["Top", "Bottom"] when top and bottom borders have styles', () => {
      const borderStyles = {
        top: { style: 'Thin' },
        left: undefined,
        right: undefined,
        bottom: { style: 'Thin' },
      };

      const result = calculateActiveBorderButtons(borderStyles);

      expect(result).toEqual(['Top', 'Bottom']);
    });
  });
});
