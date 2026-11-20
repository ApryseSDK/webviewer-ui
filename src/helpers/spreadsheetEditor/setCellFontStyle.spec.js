import setCellFontStyle from './setCellFontStyle';
import core from 'core';
import { COMMON_COLORS } from 'constants/commonColors';

jest.mock('core');

const BLACK_HEX = COMMON_COLORS.black;

describe('setCellFontStyle', () => {
  let mockSpreadsheetEditorManager;
  let mockDocumentViewer;

  beforeEach(() => {
    mockSpreadsheetEditorManager = {
      setSelectedCellsStyle: jest.fn(),
    };

    mockDocumentViewer = {
      getSpreadsheetEditorManager: jest.fn(() => mockSpreadsheetEditorManager),
    };

    core.getDocumentViewer = jest.fn(() => mockDocumentViewer);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should set font style object', () => {
    const fontStyle = { bold: true, italic: false };
    setCellFontStyle(fontStyle);
    expect(mockSpreadsheetEditorManager.setSelectedCellsStyle).toHaveBeenCalledWith({
      font: { bold: true, italic: false },
    });
  });

  it('should convert color to hex string', () => {
    const mockColor = {
      toHexString: jest.fn(() => BLACK_HEX),
    };
    const fontStyle = { bold: true, color: mockColor };
    setCellFontStyle(fontStyle);
    expect(fontStyle.color).toBe(BLACK_HEX);
    expect(mockSpreadsheetEditorManager.setSelectedCellsStyle).toHaveBeenCalledWith({
      font: fontStyle,
    });
  });

  it('should handle color without toHexString method', () => {
    const fontStyle = { bold: true, color: {} };
    setCellFontStyle(fontStyle);
    expect(fontStyle.color).toBe('');
    expect(mockSpreadsheetEditorManager.setSelectedCellsStyle).toHaveBeenCalledWith({
      font: fontStyle,
    });
  });

  it.each([null, undefined])('should return early if fontStyle is %p', (fontStyle) => {
    setCellFontStyle(fontStyle);
    expect(mockSpreadsheetEditorManager.setSelectedCellsStyle).not.toHaveBeenCalled();
  });
});
