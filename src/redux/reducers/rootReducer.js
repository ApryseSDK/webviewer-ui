import { combineReducers } from 'redux';

import initialState from 'src/redux/initialState';
import viewerReducer from 'reducers/viewerReducer';
import searchReducer from 'reducers/searchReducer';
import userReducer from 'reducers/userReducer';
import documentReducer from 'reducers/documentReducer';
import wv3dPropertiesPanelReducer from 'src/redux/reducers/wv3dPropertiesPanelReducer';
import officeEditorReducer from 'src/redux/reducers/officeEditorReducer';
import digitalSignatureValidationReducer from 'src/redux/reducers/digitalSignatureValidationReducer';
import featureFlagsReducer from './featureFlagsReducer';
import spreadsheetEditorReducer from './spreadsheetEditorReducer';
import { getInstanceID } from 'helpers/getRootNode';
import { persistReducer } from 'redux-persist';
import localStorageManager from '../../helpers/localStorageManager';

const instanceId = getInstanceID();

const viewerPersistConfig = {
  key: `webviewer-viewer-${instanceId}`,
  storage: localStorageManager,
  whitelist: [
    'toolbarGroup',
    'lastPickedToolForGroup',
    'lastPickedToolGroup',
    'activeGroupedItems',
    'lastActiveToolForRibbon',
    'activeCustomRibbon',
    'currentLanguage',
    'activeTheme',
    'fadePageNavigationComponent',
    'toolDefaultStyleUpdateFromAnnotationPopupEnabled',
    'enableNoteSubmissionWithEnter',
    'isWidgetHighlightingEnabled',
    'isCommentThreadExpansionEnabled',
    'isNotesPanelRepliesCollapsingEnabled',
    'isNotesPanelTextCollapsingEnabled',
    'pageDeletionConfirmationModalEnabled',
    'thumbnailSelectingPages',
    'shortcutKeyMap'
  ]
};

const searchPersistConfig = {
  key: `webviewer-search-${instanceId}`,
  storage: localStorageManager,
  whitelist: ['clearSearchPanelOnClose']
};

const officeEditorPersistConfig = {
  key: `webviewer-office-editor-${instanceId}`,
  storage: localStorageManager,
  whitelist: ['unitMeasurement']
};

export default combineReducers({
  viewer: persistReducer(viewerPersistConfig, viewerReducer(initialState.viewer)),
  search: persistReducer(searchPersistConfig, searchReducer(initialState.search)),
  user: userReducer(initialState.user),
  document: documentReducer(initialState.document),
  // TODO: refactor in another PR to remove state.advanced. It's not necessary to have this because those states never change.
  advanced: () => initialState.advanced,
  featureFlags: featureFlagsReducer(initialState.featureFlags),
  wv3dPropertiesPanel: wv3dPropertiesPanelReducer(initialState.wv3dPropertiesPanel),
  officeEditor: persistReducer(officeEditorPersistConfig, officeEditorReducer(initialState.officeEditor)),
  digitalSignatureValidation: digitalSignatureValidationReducer(initialState.digitalSignatureValidation),
  spreadsheetEditor: spreadsheetEditorReducer(initialState.spreadsheetEditor)
});
