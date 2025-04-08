import actions from 'actions';
import core from 'core';
import overlays from '../constants/overlays';
import selectors from 'selectors';
import { PRIORITY_TWO } from 'constants/actionPriority';
import { ELEMENTS_TO_DISABLE_IN_OFFICE_EDITOR, ELEMENTS_TO_ENABLE_IN_OFFICE_EDITOR } from 'constants/officeEditor';
import { isOfficeEditorMode } from 'helpers/officeEditor';

export default (dispatch, store, documentViewerKey) => () => {
  const isSpreadsheetEditorEnabled = selectors.isSpreadsheetEditorModeEnabled(store.getState());

  dispatch(
    actions.closeElements([
      'pageNavOverlay',
      'notesPanel',
      'searchPanel',
      'leftPanel',
      'signatureValidationModal',
      'audioPlaybackPopup',
      'redactionPanel',
      'textEditingPanel',
      'wv3dPropertiesPanel',
      'watermarkPanel',
      ...overlays,
    ]),
  );
  if (isOfficeEditorMode()) {
    dispatch(actions.enableElements(
      ELEMENTS_TO_DISABLE_IN_OFFICE_EDITOR,
      PRIORITY_TWO, // To allow customers to still disable these elements with PRIORITY_THREE
    ));
    dispatch(actions.disableElements(
      ELEMENTS_TO_ENABLE_IN_OFFICE_EDITOR,
      PRIORITY_TWO,
    ));
    dispatch(actions.setIsOfficeEditorMode(false));
    dispatch(actions.setOfficeEditorCanUndo(false));
    dispatch(actions.setOfficeEditorCanRedo(false));
  }

  if (isSpreadsheetEditorEnabled) {
    dispatch(actions.setActiveCellRange({
      activeCellRange: '',
      cellProperties: {
        cellType: null,
        cellFormula: null,
        stringCellValue: null,
        topLeftRow: null,
        topLeftColumn: null,
        bottomRightRow: null,
        bottomRightColumn: null,
      },
    }));
  }

  // TODO Compare: Integrate with panels
  if (documentViewerKey === 1) {
    dispatch(actions.setOutlines([]));
    dispatch(actions.setBookmarks({}));
    dispatch(actions.setPortfolio([]));
    dispatch(actions.setTotalPages(0));
    dispatch(actions.setSearchValue(''));
    core.clearSearchResults();
  }
  dispatch(actions.setZoom(1, documentViewerKey));
  dispatch(actions.setCompareAnnotationsMap({}));
};
