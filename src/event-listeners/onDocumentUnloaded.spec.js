import onDocumentUnloaded from './onDocumentUnloaded';
import actions from 'actions';
import core from 'core';
import selectors from 'selectors';
import { isOfficeEditorMode } from 'helpers/officeEditor';
import { PRIORITY_THREE } from 'constants/actionPriority';
import { ELEMENTS_TO_ENABLE_IN_SPREADSHEET_EDITOR } from 'src/constants/spreadsheetEditor';

jest.mock('core');
jest.mock('actions');
jest.mock('selectors');
jest.mock('helpers/officeEditor');

describe('onDocumentUnloaded', () => {
  let store;

  beforeEach(() => {
    jest.clearAllMocks();
    store = {
      dispatch: jest.fn(),
      getState: jest.fn(() => ({})),
    };
    isOfficeEditorMode.mockReturnValue(false);
    selectors.isSpreadsheetEditorModeEnabled.mockReturnValue(false);
  });

  describe('when a spreadsheet document is unloaded', () => {
    beforeEach(() => {
      selectors.isSpreadsheetEditorModeEnabled.mockReturnValue(true);
    });

    it('disables the spreadsheet-only elements and resets the undo/redo state', () => {
      onDocumentUnloaded(store, 1)();

      expect(actions.disableElements).toHaveBeenCalledWith(ELEMENTS_TO_ENABLE_IN_SPREADSHEET_EDITOR, PRIORITY_THREE);
      expect(actions.setSpreadsheetEditorCanUndo).toHaveBeenCalledWith(false);
      expect(actions.setSpreadsheetEditorCanRedo).toHaveBeenCalledWith(false);
    });
  });

  it('clears the search when the first document viewer is unloaded', () => {
    onDocumentUnloaded(store, 1)();

    expect(actions.setSearchValue).toHaveBeenCalledWith('');
    expect(core.clearSearchResults).toHaveBeenCalled();
  });

  it('does not clear the search when another document viewer is unloaded', () => {
    onDocumentUnloaded(store, 2)();

    expect(actions.setSearchValue).not.toHaveBeenCalled();
    expect(core.clearSearchResults).not.toHaveBeenCalled();
  });
});
