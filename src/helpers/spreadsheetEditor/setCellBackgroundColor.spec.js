import setCellBackgroundColor from './setCellBackgroundColor';
import core from 'core';
import { COMMON_COLORS } from 'constants/commonColors';

jest.mock('core');

const RED_HEX = COMMON_COLORS.signatureRed;

describe('setCellBackgroundColor', () => {
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

  it('should set background color with hex string', () => {
    const mockColor = {
      toHexString: jest.fn(() => RED_HEX),
    };
    setCellBackgroundColor(mockColor);
    expect(mockSpreadsheetEditorManager.setSelectedCellsStyle).toHaveBeenCalledWith({
      backgroundColor: RED_HEX,
    });
  });

  it.each([null, undefined])('should set an empty background color for %p', (color) => {
    setCellBackgroundColor(color);
    expect(mockSpreadsheetEditorManager.setSelectedCellsStyle).toHaveBeenCalledWith({
      backgroundColor: '',
    });
  });

  it('should set empty background color when toHexString is not available', () => {
    const mockColor = {};
    setCellBackgroundColor(mockColor);
    expect(mockSpreadsheetEditorManager.setSelectedCellsStyle).toHaveBeenCalledWith({
      backgroundColor: '',
    });
  });
});
