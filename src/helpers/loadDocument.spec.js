import loadDocument from './loadDocument';
import { VIEWER_CONFIGURATIONS } from '../constants/customizationVariables';
import { configureStore } from '@reduxjs/toolkit';
import core from 'core';
import actions from 'actions';
import DataElements from 'constants/dataElement';
import rootReducer from 'reducers/rootReducer';
import selectors from 'selectors';

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

  it('keeps the loading screen closed when document loading completes synchronously', async () => {
    const store = configureStore({
      reducer: rootReducer(),
      middleware: (getDefaultMiddleware) => getDefaultMiddleware({
        immutableCheck: false,
        serializableCheck: false,
      }),
    });
    core.loadDocument.mockImplementationOnce(() => {
      store.dispatch(actions.closeLoadingScreen());
      return Promise.resolve();
    });

    await loadDocument(store.dispatch, 'document.pdf');

    expect(selectors.isElementOpen(store.getState(), DataElements.LOADING_MODAL)).toBe(false);
  });

  it('closes the keyed loading screen when document loading fails', async () => {
    const store = configureStore({
      reducer: rootReducer(),
      middleware: (getDefaultMiddleware) => getDefaultMiddleware({
        immutableCheck: false,
        serializableCheck: false,
      }),
    });
    core.loadDocument.mockImplementationOnce((_src, options) => {
      options.onError('bad document');
      return Promise.reject(new Error('bad document'));
    });

    await loadDocument(store.dispatch, 'document.pdf', {}, 2);

    expect(selectors.isDocumentViewerLoading(store.getState(), 2)).toBe(false);
    expect(selectors.isElementOpen(store.getState(), DataElements.LOADING_MODAL)).toBe(false);
  });
});
