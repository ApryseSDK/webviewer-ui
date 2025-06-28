import actions from 'actions';
import core from 'core';
import overlays from '../constants/overlays';
import selectors from 'selectors';
import { PRIORITY_TWO } from 'constants/actionPriority';
import { ELEMENTS_TO_DISABLE_IN_OFFICE_EDITOR, ELEMENTS_TO_ENABLE_IN_OFFICE_EDITOR } from 'constants/officeEditor';
import { isOfficeEditorMode } from 'helpers/officeEditor';
import { ELEMENTS_TO_DISABLE_IN_SPREADSHEET_EDITOR } from 'src/constants/spreadsheetEditor';

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
        isSingleCell: true,
        canCopy: false,
        canPaste: false,
        canCut: false,
        styles: {
          verticalAlignment: null,
          horizontalAlignment: null,
          formatType: null,
          border: {
            top: {},
            left: {},
            bottom: {},
            right: {}
          },
          font: {
            fontFace: null,
            pointSize: null,
            bold: false,
            italic: false,
            underline: false,
            strikeout: false,
            color: null,
          },
          isCellRangeMerged: false,
        }
      },
    }));
    dispatch(actions.enableElements(
      ELEMENTS_TO_DISABLE_IN_SPREADSHEET_EDITOR,
    ));
  }

  // TODO Compare: Integrate with panels
  if (documentViewerKey === 1) {
    dispatch(actions.setOutlines(null));
    dispatch(actions.setBookmarks({}));
    dispatch(actions.setPortfolio([]));
    dispatch(actions.setTotalPages(0));
    dispatch(actions.setSearchValue(''));
    dispatch(actions.setLayers(null));
    core.clearSearchResults();
  }
  dispatch(actions.setZoom(1, documentViewerKey));
  dispatch(actions.setCompareAnnotationsMap({}));
};
