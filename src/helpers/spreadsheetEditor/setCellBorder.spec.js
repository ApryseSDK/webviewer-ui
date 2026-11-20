import setCellBorder from './setCellBorder';
import core from 'core';
import { COMMON_COLORS } from 'constants/commonColors';

jest.mock('core');

const RED_HEX = COMMON_COLORS.signatureRed;
const BLACK_HEX = COMMON_COLORS.black;

describe('setCellBorder', () => {
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

  it('should set cell border style', () => {
    const borderStyle = { style: 'solid', color: BLACK_HEX };
    setCellBorder(borderStyle);
    expect(borderStyle.color).toBe(BLACK_HEX);
    expect(mockSpreadsheetEditorManager.setSelectedCellsStyle).toHaveBeenCalledWith({
      border: { style: 'solid', color: BLACK_HEX },
    });
  });

  it('should handle border with None style', () => {
    const borderStyle = { style: 'None', color: RED_HEX };
    setCellBorder(borderStyle);
    expect(borderStyle.color).toBeNull();
    expect(mockSpreadsheetEditorManager.setSelectedCellsStyle).toHaveBeenCalledWith({
      border: borderStyle,
    });
  });

  it.each([null, undefined])('should return early if border is %p', (border) => {
    setCellBorder(border);
    expect(mockSpreadsheetEditorManager.setSelectedCellsStyle).not.toHaveBeenCalled();
  });

  it('should set empty border object', () => {
    const borderStyle = {};
    setCellBorder(borderStyle);
    expect(mockSpreadsheetEditorManager.setSelectedCellsStyle).toHaveBeenCalledWith({
      border: borderStyle,
    });
  });

});
