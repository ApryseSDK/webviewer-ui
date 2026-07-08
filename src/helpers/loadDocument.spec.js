import loadDocument from './loadDocument';
import { VIEWER_CONFIGURATIONS } from '../constants/customizationVariables';
import core from 'core';

jest.mock('core', () => ({
  loadBlankSpreadsheet: jest.fn(),
  loadBlankOfficeEditorDocument: jest.fn(),
  loadDocument: jest.fn()
}));

describe('loadDocument (UI helper)', () => {
  it('should call core.loadBlankSpreadsheet with spreadsheetEditorOptions in options', async () => {
    const dispatch = jest.fn();
    const options = {
      initialMode: VIEWER_CONFIGURATIONS.SPREADSHEET_EDITOR,
      spreadsheetEditorOptions: { initialEditMode: 'editing' }
    };
    await loadDocument(dispatch, undefined, options);
    expect(core.loadBlankSpreadsheet).toHaveBeenCalledTimes(1);
    expect(core.loadBlankSpreadsheet).toHaveBeenCalledWith(expect.objectContaining({
      spreadsheetEditorOptions: { initialEditMode: 'editing' }
    }));
  });
});
