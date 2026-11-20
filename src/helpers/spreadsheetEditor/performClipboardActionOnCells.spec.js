import performClipboardActionOnCells from './performClipboardActionOnCells';
import core from 'core';

jest.mock('core');

describe('performClipboardActionOnCells', () => {
  let mockClipboard;
  let mockSpreadsheetEditorManager;
  let mockDocumentViewer;

  beforeEach(() => {
    mockClipboard = {
      copy: jest.fn(),
      paste: jest.fn(),
      cut: jest.fn(),
    };

    mockSpreadsheetEditorManager = {
      getSpreadsheetEditorClipboard: jest.fn(() => mockClipboard),
    };

    mockDocumentViewer = {
      getSpreadsheetEditorManager: jest.fn(() => mockSpreadsheetEditorManager),
    };

    core.getDocumentViewer = jest.fn(() => mockDocumentViewer);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should call copy when actionType is "copy"', () => {
    performClipboardActionOnCells('copy');
    expect(mockClipboard.copy).toHaveBeenCalled();
  });

  it('should call paste when actionType is "paste"', () => {
    performClipboardActionOnCells('paste');
    expect(mockClipboard.paste).toHaveBeenCalled();
  });

  it('should call cut when actionType is "cut"', () => {
    performClipboardActionOnCells('cut');
    expect(mockClipboard.cut).toHaveBeenCalled();
  });

  it('should not call any clipboard method for unknown actionType', () => {
    performClipboardActionOnCells('unknown');
    expect(mockClipboard.copy).not.toHaveBeenCalled();
    expect(mockClipboard.paste).not.toHaveBeenCalled();
    expect(mockClipboard.cut).not.toHaveBeenCalled();
  });

  it.each([null, undefined, ''])('should return early if actionType is %p', (actionType) => {
    performClipboardActionOnCells(actionType);
    expect(mockDocumentViewer.getSpreadsheetEditorManager).not.toHaveBeenCalled();
  });

  it.each([null, undefined])('should return early if clipboard is %p', (clipboard) => {
    mockSpreadsheetEditorManager.getSpreadsheetEditorClipboard.mockReturnValue(clipboard);
    performClipboardActionOnCells('copy');
    expect(mockClipboard.copy).not.toHaveBeenCalled();
  });
});
