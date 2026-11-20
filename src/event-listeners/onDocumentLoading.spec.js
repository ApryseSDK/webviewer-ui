import actions from 'actions';
import isSpreadsheetEditorMode from 'src/helpers/spreadsheetEditor/isSpreadsheetEditorMode';

import { onDocumentLoadingStarted, onDocumentUIReady } from './onDocumentLoading';
import { openSpreadsheetEditorLoadingModal } from './onSpreadsheetEditorLoaded';
import { closeSpreadsheetEditorLoadingModal } from './onSpreadsheetEditorReady';

jest.mock('src/helpers/spreadsheetEditor/isSpreadsheetEditorMode');

describe('document loading listeners', () => {
  const openAction = { type: 'OPEN_DOCUMENT_LOADING_SCREEN' };
  const closeAction = { type: 'CLOSE_LOADING_SCREEN' };
  let dispatch;

  beforeEach(() => {
    dispatch = jest.fn();
    jest.spyOn(actions, 'openDocumentLoadingScreen').mockReturnValue(openAction);
    jest.spyOn(actions, 'closeLoadingScreen').mockReturnValue(closeAction);
    jest.spyOn(actions, 'closeDocumentLoadingScreen').mockReturnValue(closeAction);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('opens document loading for the loading document viewer before a document starts loading', () => {
    onDocumentLoadingStarted(dispatch, 2)();

    expect(dispatch).toHaveBeenCalledWith(openAction);
    expect(actions.openDocumentLoadingScreen).toHaveBeenCalledWith(2);
  });

  it('closes document loading when the PDF or DOCX UI is configured', () => {
    isSpreadsheetEditorMode.mockReturnValue(false);

    onDocumentUIReady(dispatch, 2)();

    expect(dispatch).toHaveBeenCalledWith(closeAction);
    expect(actions.closeDocumentLoadingScreen).toHaveBeenCalledWith(2);
  });

  it('keeps document loading open until the spreadsheet UI is ready', () => {
    isSpreadsheetEditorMode.mockReturnValue(true);

    onDocumentUIReady(dispatch)();

    expect(dispatch).not.toHaveBeenCalled();
  });

  it('uses document loading throughout spreadsheet initialization', () => {
    openSpreadsheetEditorLoadingModal(dispatch)();
    closeSpreadsheetEditorLoadingModal(dispatch)();

    expect(dispatch).toHaveBeenNthCalledWith(1, openAction);
    expect(dispatch).toHaveBeenNthCalledWith(2, closeAction);
  });
});
