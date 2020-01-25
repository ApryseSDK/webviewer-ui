import { combineReducers } from 'redux';

import initialState from 'src/redux/initialState';
import viewerReducer from 'reducers/viewerReducer';
import searchReducer from 'reducers/searchReducer';
import userReducer from 'reducers/userReducer';
import documentReducer from 'reducers/documentReducer';

export default combineReducers({
  viewer: viewerReducer(initialState.viewer),
  search: searchReducer(initialState.search),
  user: userReducer(initialState.user),
  document: documentReducer(initialState.document),
  // TODO: refactor in another PR to remove state.advanced. It's not necessary to have this because those states never change.
  advanced: () => initialState.advanced,
});