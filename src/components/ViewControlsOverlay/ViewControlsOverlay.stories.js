import React from 'react';
import { configureStore } from '@reduxjs/toolkit';
import { Provider } from 'react-redux';
import ViewControlsOverlay from './ViewControlsOverlay';

export default {
  title: 'Components/ViewControlsOverlay',
  component: ViewControlsOverlay,
};

const initialState = {
  viewer: {
    activeDocumentViewerKey: 1,
    disabledElements: {},
    customElementOverrides: {},
    openElements: {
      viewControlsOverlay: true
    },
    customPanels: [],
    genericPanels: [],
  },
  document: {
    totalPages: {
      1: 1,
    }
  },
  featureFlags: {
    customizableUI: false,
  },
};

const store = configureStore({
  reducer: () => initialState
});

export const Default = () => {
  return (
    <Provider store={store}>
      <div style={{ position: 'relative', right: '-9999px' }}>
        <ViewControlsOverlay/>
      </div>
    </Provider>
  );
};

const initialStateWithMultiTab = {
  ...initialState,
  viewer: {
    ...initialState.viewer,
    isMultiTab: true,
  },
  featureFlags: {
    customizableUI: false,
  },
};

const storeWithMultiTab = configureStore({
  reducer: () => initialStateWithMultiTab
});

export const WithMultiTab = () => {
  return (
    <Provider store={storeWithMultiTab}>
      <div style={{ position: 'relative', right: '-9999px' }}>
        <ViewControlsOverlay/>
      </div>
    </Provider>
  );
};
