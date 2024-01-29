import React from 'react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import initialState from 'src/redux/initialState';
import rootReducer from 'reducers/rootReducer';
import App from 'components/App';
import RubberStampPanel from './RubberStampPanel';

export default {
  title: 'ModularComponents/RubberStampPanel',
  component: RubberStampPanel,
};

const createStore = (preloadedState) => {
  return configureStore({
    reducer: rootReducer,
    preloadedState: preloadedState,
    middleware: (getDefaultMiddleware) => getDefaultMiddleware({ serializableCheck: false })
  });
};

const MockApp = ({ initialState }) => (
  <Provider store={createStore(initialState)}>
    <App removeEventHandlers={() => { }} />
  </Provider>
);

const RubberStampPanelInApp = (location,) => {
  const mockState = {
    ...initialState,
    viewer: {
      ...initialState.viewer,
      toolbarGroup: 'toolbarGroup-Insert',
      isInDesktopOnlyMode: false,
      genericPanels: [{
        dataElement: 'rubberStampPanel',
        render: 'rubberStampPanel',
        location: location,
      }],
      openElements: {
        ...initialState.viewer.openElements,
        contextMenuPopup: false,
        rubberStampPanel: true,
      },
    },
    featureFlags: {
      customizableUI: true,
    },
  };
  return <MockApp initialState={mockState} />;
};

export const RubberStampPanelInleft = () => RubberStampPanelInApp('left');
export const RubbeStampPanelInRight = () => RubberStampPanelInApp('right');

RubberStampPanelInleft.parameters = {
  layout: 'fullscreen',
};
RubbeStampPanelInRight.parameters = {
  layout: 'fullscreen',
};