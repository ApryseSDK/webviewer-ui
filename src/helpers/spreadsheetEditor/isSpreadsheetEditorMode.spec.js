import { isSpreadsheetEditorMode } from './isSpreadsheetEditorMode';
import core from 'core';
import { workerTypes } from 'constants/types';

jest.mock('core');
jest.mock('constants/types', () => ({
  workerTypes: {
    SPREADSHEET_EDITOR: 'SPREADSHEET_EDITOR',
    PDF_EDITOR: 'PDF_EDITOR',
  },
}));

describe('isSpreadsheetEditorMode', () => {
  let mockDocument;

  beforeEach(() => {
    mockDocument = {
      getType: jest.fn(),
    };

    core.getDocument = jest.fn(() => mockDocument);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return true when document type is SPREADSHEET_EDITOR', () => {
    mockDocument.getType.mockReturnValue('SPREADSHEET_EDITOR');
    const result = isSpreadsheetEditorMode();
    expect(result).toBe(true);
  });

  it('should return false when document type is PDF_EDITOR', () => {
    mockDocument.getType.mockReturnValue('PDF_EDITOR');
    const result = isSpreadsheetEditorMode();
    expect(result).toBe(false);
  });

  it.each([null, undefined])('should return false when the document is %p', (document) => {
    core.getDocument.mockReturnValue(document);
    const result = isSpreadsheetEditorMode();
    expect(result).toBe(false);
  });
});
