import loadDocument from './loadDocument';
import { VIEWER_CONFIGURATIONS } from '../constants/customizationVariables';
import core from 'core';

jest.mock('core', () => ({
  loadBlankSpreadsheet: jest.fn(),
  loadBlankOfficeEditorDocument: jest.fn(),
  loadDocument: jest.fn()
}));

describe('loadDocument (UI helper)', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should call core.loadBlankSpreadsheet with spreadsheetEditorOptions in options', async () => {
    const loadBlankSpreadsheetSpy = jest.spyOn(core, 'loadBlankSpreadsheet');
    const dispatch = jest.fn();
    const options = {
      initialMode: VIEWER_CONFIGURATIONS.SPREADSHEET_EDITOR,
      spreadsheetEditorOptions: { initialEditMode: 'editing' }
    };
    await loadDocument(dispatch, undefined, options);
    expect(loadBlankSpreadsheetSpy).toHaveBeenCalledTimes(1);
    expect(loadBlankSpreadsheetSpy).toHaveBeenCalledWith(expect.objectContaining({
      spreadsheetEditorOptions: { initialEditMode: 'editing' }
    }));
  });

  it('should normalize invalid spreadsheet initialEditMode before calling core.loadBlankSpreadsheet', async () => {
    const loadBlankSpreadsheetSpy = jest.spyOn(core, 'loadBlankSpreadsheet');
    const dispatch = jest.fn();
    const warnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});
    const options = {
      initialMode: VIEWER_CONFIGURATIONS.SPREADSHEET_EDITOR,
      spreadsheetEditorOptions: { initialEditMode: 'invalid-edit-mode' }
    };

    await loadDocument(dispatch, undefined, options);

    expect(warnSpy).toHaveBeenCalledWith('Invalid initialEditMode parameter: invalid-edit-mode. Default to Editing mode.');
    expect(loadBlankSpreadsheetSpy).toHaveBeenCalledWith(expect.objectContaining({
      spreadsheetEditorOptions: { initialEditMode: 'editing' }
    }));
  });
});
