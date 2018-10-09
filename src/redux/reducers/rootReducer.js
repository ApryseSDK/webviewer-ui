import { combineReducers } from 'redux';

import initialState from 'src/redux/initialState';
import viewerReducer from 'reducers/viewerReducer';
import searchReducer from 'reducers/searchReducer';
import userReducer from 'reducers/userReducer';
import documentReducer from 'reducers/documentReducer';
import advancedReducer from 'reducers/advancedReducer';

export default combineReducers({
  viewer: viewerReducer(initialState.viewer),
  search: searchReducer(initialState.search),
  user: userReducer(initialState.user),
  document: documentReducer(initialState.document),
  advanced: advancedReducer(initialState.advanced)
});