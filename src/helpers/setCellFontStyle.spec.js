import getDocumentViewer from 'src/apis/getDocumentViewer';
import setCellFontStyle from './setCellFontStyle';
import core from 'core';

jest.mock('core', () => ({
  getDocumentViewer: jest.fn(),
}));

/* eslint-disable custom/no-hex-colors */
describe('setCellFontStyle', () => {
  let setSelectedCellsStyleMock;
  let getSpreadsheetEditorManagerMock;

  beforeEach(() => {
    setSelectedCellsStyleMock = jest.fn();
    getSpreadsheetEditorManagerMock = jest.fn(() => ({
      setSelectedCellsStyle: setSelectedCellsStyleMock,
    }));

    core.getDocumentViewer.mockReturnValue({
      getSpreadsheetEditorManager: getSpreadsheetEditorManagerMock,
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should call Core.SpreadsheetEditorManager.setSelectedCellsStyle if font is defined', () => {
    const mockColor = { toHexString: () => '#FF0000' };
    const expectedFontStyle = { color: '#FF0000' };

    setCellFontStyle({ color: mockColor });

    const spreadsheetEditorManager = getDocumentViewer().getSpreadsheetEditorManager();
    expect(spreadsheetEditorManager.setSelectedCellsStyle).toHaveBeenCalledWith({
      font: expectedFontStyle,
    });
  });

  it('should not call Core.SpreadsheetEditorManager.setSelectedCellsStyle if font is undefined', () => {
    setCellFontStyle(undefined);

    expect(setSelectedCellsStyleMock).not.toHaveBeenCalled();
  });

  it('should call color.toHexString if it exists', () => {
    const mockColor = { toHexString: jest.fn(() => '#00000') };

    setCellFontStyle({ color: mockColor });

    expect(mockColor.toHexString).toHaveBeenCalled();
  });

  it('should pass color as hex string if color.toHexString exists', () => {
    const mockColor = { toHexString: () => '#00FF00' };

    setCellFontStyle({ color: mockColor });

    expect(setSelectedCellsStyleMock).toHaveBeenCalledWith({
      font: { color: '#00FF00' },
    });
  });

  it('should pass an empty string if color.toHexString does not exist', () => {
    const mockColor = {};

    setCellFontStyle({ color: mockColor });

    expect(setSelectedCellsStyleMock).toHaveBeenCalledWith({
      font: { color: '' },
    });
  });
});
/* eslint-enable custom/no-hex-colors */