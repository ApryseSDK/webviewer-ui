import setCellFormatString from './setCellFormatString';
import core from 'core';
import { formatsMap } from 'src/constants/spreadsheetEditor';

// Mock the dependencies
jest.mock('core', () => ({
  getDocumentViewer: jest.fn(() => ({
    getSpreadsheetEditorManager: jest.fn(() => ({
      setSelectedCellRangeStyle: jest.fn(),
    })),
  })),
}));

describe('setCellFormatString', () => {
  let mockSpreadsheetEditorManager;

  beforeEach(() => {
    mockSpreadsheetEditorManager = {
      setSelectedCellRangeStyle: jest.fn(),
    };

    core.getDocumentViewer.mockReturnValue({
      getSpreadsheetEditorManager: jest.fn(() => mockSpreadsheetEditorManager),
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should do nothing when provided an invalid format type', () => {
    setCellFormatString('invalidType');

    expect(mockSpreadsheetEditorManager.setSelectedCellRangeStyle).not.toHaveBeenCalled();
  });

  it('should do nothing when no format type is provided', () => {
    setCellFormatString();

    expect(mockSpreadsheetEditorManager.setSelectedCellRangeStyle).not.toHaveBeenCalled();
  });

  it('should test all format types in the formatsMap', () => {
    // Test each format type in the formatsMap
    Object.keys(formatsMap).forEach((formatType) => {
      jest.clearAllMocks();

      setCellFormatString(formatType);

      expect(mockSpreadsheetEditorManager.setSelectedCellRangeStyle).toHaveBeenCalledWith({
        formatString: formatsMap[formatType],
      });
    });
  });
});