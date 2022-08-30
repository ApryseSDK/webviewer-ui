import { combineReducers } from 'redux';

import initialState from 'src/redux/initialState';
import viewerReducer from 'reducers/viewerReducer';
import searchReducer from 'reducers/searchReducer';
import userReducer from 'reducers/userReducer';
import documentReducer from 'reducers/documentReducer';
import wv3dPropertiesPanelReducer from 'src/redux/reducers/wv3dPropertiesPanelReducer';

import { persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';

const viewerPersistConfig = {
  key: 'viewer',
  storage,
  whitelist: ['toolbarGroup', 'lastPickedToolForGroup', 'lastPickedToolGroup'],
};

export default combineReducers({
  viewer: persistReducer(viewerPersistConfig, viewerReducer(initialState.viewer)),
  search: searchReducer(initialState.search),
  user: userReducer(initialState.user),
  document: documentReducer(initialState.document),
  // TODO: refactor in another PR to remove state.advanced. It's not necessary to have this because those states never change.
  advanced: () => initialState.advanced,
  featureFlags: () => initialState.featureFlags,
  wv3dPropertiesPanel: wv3dPropertiesPanelReducer(initialState.wv3dPropertiesPanel),
});
