import { getStyleObjectFromCellStyle } from './getStyleObjectFromCellStyle';

describe('getStyleObjectFromCellStyle', () => {
  let mockCellStyle;

  beforeEach(() => {
    mockCellStyle = {
      backgroundColor: 'rgb(255, 0, 0)',
      verticalAlignment: 2,
      horizontalAlignment: 1,
      font: {
        bold: true,
        italic: false,
        underline: true,
        color: 'rgb(0, 0, 0)',
        pointSize: 12,
        fontFace: 'Arial',
        strikeout: false,
      },
      wrapText: true,
      getDataFormatString: jest.fn(() => '0.00'),
    };
  });

  it('should convert cell style to plain object', () => {
    const result = getStyleObjectFromCellStyle(mockCellStyle);
    expect(result).toEqual({
      backgroundColor: 'rgb(255, 0, 0)',
      verticalAlignment: 2,
      horizontalAlignment: 1,
      font: {
        bold: true,
        italic: false,
        underline: true,
        color: 'rgb(0, 0, 0)',
        pointSize: 12,
        fontFace: 'Arial',
        strikeout: false,
      },
      wrapText: true,
      formatString: '0.00',
    });
  });

  it.each([null, undefined])('should return empty object for %s cellStyle', (cellStyle) => {
    const result = getStyleObjectFromCellStyle(cellStyle);
    expect(result).toEqual({});
  });

  it('should handle empty backgroundColor', () => {
    mockCellStyle.backgroundColor = null;
    const result = getStyleObjectFromCellStyle(mockCellStyle);
    expect(result.backgroundColor).toBe('');
  });

  it('should handle empty formatString', () => {
    mockCellStyle.getDataFormatString.mockReturnValue(null);
    const result = getStyleObjectFromCellStyle(mockCellStyle);
    expect(result.formatString).toBe('');
  });

  it('should handle wrap text disabled', () => {
    mockCellStyle.wrapText = false;
    const result = getStyleObjectFromCellStyle(mockCellStyle);
    expect(result.wrapText).toBe(false);
  });

});
