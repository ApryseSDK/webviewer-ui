import { combineReducers } from 'redux';

import initialState from 'src/redux/initialState';
import viewerReducer from 'reducers/viewerReducer';
import searchReducer from 'reducers/searchReducer';
import userReducer from 'reducers/userReducer';
import documentReducer from 'reducers/documentReducer';
import officeEditorReducer from 'src/redux/reducers/officeEditorReducer';
import digitalSignatureValidationReducer from 'src/redux/reducers/digitalSignatureValidationReducer';
import featureFlagsReducer from './featureFlagsReducer';
import spreadsheetEditorReducer from './spreadsheetEditorReducer';
import { getInstanceID } from 'helpers/getRootNode';
import { persistReducer } from 'redux-persist';
import localStorageManager from '../../helpers/localStorageManager';

/**
 * @ignore
 * Create a root reducer with per-instance redux-persist keys.
 * In multi-instance WC mode each instance has a unique instanceId
 * so their persisted state doesn't collide in localStorage.
 *
 * @param {string} [instanceId] – Unique instance ID for persist keys.
 *   Falls back to getInstanceID() for backward compat (single-instance).
 */
export function createRootReducer(instanceId) {
  if (!instanceId) {
    instanceId = getInstanceID();
  }

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
      'fadePageNavigationComponent',
      'toolDefaultStyleUpdateFromAnnotationPopupEnabled',
      'enableNoteSubmissionWithEnter',
      'isWidgetHighlightingEnabled',
      'isCommentThreadExpansionEnabled',
      'isNotesPanelRepliesCollapsingEnabled',
      'isNotesPanelTextCollapsingEnabled',
      'pageDeletionConfirmationModalEnabled',
      'thumbnailSelectingPages',
      'shortcutKeyMap',
      'viewportRelativeAnnotationPositioningEnabled'
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

  return combineReducers({
    viewer: persistReducer(viewerPersistConfig, viewerReducer(initialState.viewer)),
    search: persistReducer(searchPersistConfig, searchReducer(initialState.search)),
    user: userReducer(initialState.user),
    document: documentReducer(initialState.document),
    // TODO: refactor in another PR to remove state.advanced. It's not necessary to have this because those states never change.
    advanced: () => initialState.advanced,
    featureFlags: featureFlagsReducer(initialState.featureFlags),
    officeEditor: persistReducer(officeEditorPersistConfig, officeEditorReducer(initialState.officeEditor)),
    digitalSignatureValidation: digitalSignatureValidationReducer(initialState.digitalSignatureValidation),
    spreadsheetEditor: spreadsheetEditorReducer(initialState.spreadsheetEditor)
  });
}

const defaultRootReducer = createRootReducer();

// Backwards-compatible default export. Most Jest tests and stories still call
// `rootReducer()` to get a reducer, while a few use the default export directly
// as a reducer to read initial state. Production imports `createRootReducer` by
// named export to build per-instance reducers with unique redux-persist keys.
export default function rootReducer(state, action) {
  if (arguments.length === 0) {
    return createRootReducer();
  }

  if (action && action.type) {
    return defaultRootReducer(state, action);
  }

  return createRootReducer(state);
}
