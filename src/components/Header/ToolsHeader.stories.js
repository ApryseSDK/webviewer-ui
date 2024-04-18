import React from 'react';
import ToolsHeaderComponent from './ToolsHeader';
import initialState from 'src/redux/initialState';
import { createStore, combineReducers } from 'redux';
import { Provider } from 'react-redux';
import viewerReducer from 'src/redux/reducers/viewerReducer';
import featureFlagsReducer from 'src/redux/reducers/featureFlagsReducer';

export default {
  title: 'Components/Header/ToolsHeader',
  component: ToolsHeaderComponent,
};

const store = createStore(combineReducers({
  viewer: viewerReducer(initialState.viewer),
  featureFlags: featureFlagsReducer(initialState.featureFlags),
}));

const BasicComponent = ({ props, store }) => {
  return (
    <Provider store={store}>
      <ToolsHeaderComponent {...props} />
    </Provider>
  );
};


export const ToolsHeaderNoPreset = () => {
  return (<BasicComponent store={store} />);
};

const mockInitialViewerState = {
  ...initialState.viewer,
  activeToolGroup: 'freeHandTools',
  activeToolName: 'AnnotationCreateFreeHand',
};

const reducer = combineReducers({
  viewer: viewerReducer(mockInitialViewerState),
  featureFlags: featureFlagsReducer(initialState.featureFlags),
});

const storeWithToolSelected = createStore(reducer);


export const ToolsHeaderToolActive = () => {
  return (<BasicComponent store={storeWithToolSelected} />);
};