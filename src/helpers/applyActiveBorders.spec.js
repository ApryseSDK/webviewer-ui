import applyActiveBorders from './applyActiveBorders';
import setCellBorder from './setCellBorder';

jest.mock('./setCellBorder');

describe('applyActiveBorders', () => {
  const mockStyle = 'Thin';
  const mockColor = 'black';

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('when applying to individual borders', () => {
    test.each(['Top', 'Left', 'Right', 'Bottom'])(
      'applies style to single active border "%s"',
      (side) => {
        const activeButtons = [side];

        applyActiveBorders(activeButtons, mockStyle, mockColor);

        expect(setCellBorder).toHaveBeenCalledTimes(1);
        expect(setCellBorder).toHaveBeenCalledWith({
          type: side,
          style: mockStyle,
          color: mockColor
        });
      }
    );
  });

  describe('when applying to multiple borders', () => {
    it('applies style to three active borders', () => {
      const activeButtons = ['Top', 'Left', 'Right'];

      applyActiveBorders(activeButtons, mockStyle, mockColor);

      expect(setCellBorder).toHaveBeenCalledTimes(3);
      expect(setCellBorder).toHaveBeenCalledWith({
        type: 'Top',
        style: mockStyle,
        color: mockColor
      });
      expect(setCellBorder).toHaveBeenCalledWith({
        type: 'Left',
        style: mockStyle,
        color: mockColor
      });
      expect(setCellBorder).toHaveBeenCalledWith({
        type: 'Right',
        style: mockStyle,
        color: mockColor
      });
    });
  });

  describe('when handling "None" button', () => {
    it('applies only to other buttons when "None" is mixed with sides', () => {
      const activeButtons = ['None', 'Top', 'Left'];

      applyActiveBorders(activeButtons, mockStyle, mockColor);

      expect(setCellBorder).toHaveBeenCalledTimes(2);
      expect(setCellBorder).toHaveBeenCalledWith({
        type: 'Top',
        style: mockStyle,
        color: mockColor
      });
      expect(setCellBorder).toHaveBeenCalledWith({
        type: 'Left',
        style: mockStyle,
        color: mockColor
      });
      expect(setCellBorder).not.toHaveBeenCalledWith(
        expect.objectContaining({ type: 'None' })
      );
    });
  });
});