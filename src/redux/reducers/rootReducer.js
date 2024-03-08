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
import { getInstanceID } from 'helpers/getRootNode';
import { persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';

const instanceId = getInstanceID();

const viewerPersistConfig = {
  key: `viewer-${instanceId}`,
  storage,
  whitelist: [
    'toolbarGroup',
    'lastPickedToolForGroup',
    'lastPickedToolGroup',
    'activeGroupedItems',
    'lastPickedToolForGroupedItems',
    'lastPickedToolAndGroup',
    'activeCustomRibbon',
    'currentLanguage',
    'activeTheme',
    'fadePageNavigationComponent',
    'toolDefaultStyleUpdateFromAnnotationPopupEnabled',
    'enableNoteSubmissionWithEnter',
    'isCommentThreadExpansionEnabled',
    'isNotesPanelRepliesCollapsingEnabled',
    'isNotesPanelTextCollapsingEnabled',
    'pageDeletionConfirmationModalEnabled',
    'thumbnailSelectingPages',
    'shortcutKeyMap'
  ]
};

const searchPersistConfig = {
  key: `search-${instanceId}`,
  storage,
  whitelist: ['clearSearchPanelOnClose']
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
  officeEditor: officeEditorReducer(initialState.officeEditor),
  digitalSignatureValidation: digitalSignatureValidationReducer(initialState.digitalSignatureValidation),
});
