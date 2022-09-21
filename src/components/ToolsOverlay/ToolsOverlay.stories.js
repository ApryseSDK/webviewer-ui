import React from 'react';
import { combineReducers, createStore } from 'redux';
import { Provider } from 'react-redux';
import viewerReducer from 'src/redux/reducers/viewerReducer';
import initialState from 'src/redux/initialState';
import ToolsOverlayComponent from './ToolsOverlay';


export default {
  title: 'Components/ToolsOverlay',
  component: ToolsOverlayComponent,
};


const mockInitialViewerState = {
  ...initialState.viewer,
  activeToolGroup: 'freeHandTools',
  activeToolName: 'AnnotationCreateFreeHand',

};

const reducer = combineReducers({
  viewer: viewerReducer(mockInitialViewerState)
});

const store = createStore(reducer);

const BasicComponent = (props) => {
  return (
    <Provider store={store}>
      <ToolsOverlayComponent {...props} />
    </Provider>
  );
};

export const ToolsOverlay = BasicComponent.bind({});