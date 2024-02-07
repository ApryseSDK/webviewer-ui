import React from 'react';
import { Provider } from 'react-redux';
import StylePanelContainer from './StylePanelContainer';
import { configureStore } from '@reduxjs/toolkit';
import initialState from 'src/redux/initialState';
import rootReducer from 'reducers/rootReducer';
import App from 'components/App';
import Panel from 'components/Panel';
import { mockHeadersNormalized, mockModularComponents } from '../ModularComponents/AppStories/mockAppState';

export default {
  title: 'ModularComponents/StylePanel',
  component: StylePanelContainer,
};

const createStore = (preloadedState) => {
  return configureStore({
    reducer: rootReducer,
    preloadedState: preloadedState,
    middleware: (getDefaultMiddleware) => getDefaultMiddleware({ serializableCheck: false })
  });
};

const StylePanelTemplate = ({ mockState, location }) => (
  <Provider store={createStore(mockState)}>
    <Panel location={location} dataElement={'stylePanel'} isCustom>
      <StylePanelContainer />
    </Panel>
  </Provider>
);

const EmptyStylePanel = (location) => {
  const mockState = {
    ...initialState,
    viewer: {
      ...initialState.viewer,
      openElements: {
        stylePanel: true,
      },
    }
  };
  return <StylePanelTemplate mockState={mockState} location={location} />;
};

export const EmptyStylePanelOnTheLeft = () => EmptyStylePanel('left');
export const EmptyStylePanelOnTheRight = () => EmptyStylePanel('right');

const MockApp = ({ initialState }) => (
  <Provider store={createStore(initialState)}>
    <App removeEventHandlers={() => { }} />
  </Provider>
);

const StylePanelInApp = (location) => {
  const mockState = {
    ...initialState,
    viewer: {
      ...initialState.viewer,
      modularHeaders: mockHeadersNormalized,
      modularComponents: mockModularComponents,
      isInDesktopOnlyMode: true,
      genericPanels: [{
        dataElement: 'stylePanel',
        render: 'stylePanel',
        location: location,
      }],
      openElements: {
        ...initialState.viewer.openElements,
        contextMenuPopup: false,
        stylePanel: true,
      },
      activeCustomRibbon: 'annotations-ribbon-item',
      lastPickedToolForGroupedItems: {
        'annotateGroupedItems': '',
      },
      activeGroupedItems: ['annotateGroupedItems'],
    },
    featureFlags: {
      customizableUI: true,
    },
  };
  return <MockApp initialState={mockState} />;
};

export const StylePanelInAppLeft = () => StylePanelInApp('left');
export const StylePanelInAppRight = () => StylePanelInApp('right');

StylePanelInAppLeft.parameters = {
  layout: 'fullscreen',
};
StylePanelInAppRight.parameters = {
  layout: 'fullscreen',
};
