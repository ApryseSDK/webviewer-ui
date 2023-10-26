import React from 'react';
import { configureStore } from '@reduxjs/toolkit';
import { Provider } from 'react-redux';
import Panel from 'components/Panel';
import ThumbnailsPanel from './ThumbnailsPanel';
import core from 'core';
import initialState from 'src/redux/initialState';
import rootReducer from 'reducers/rootReducer';

export default {
  title: 'Components/Thumbnails',
  component: ThumbnailsPanel,
};

export const Thumbnails = () => {
  const myState = {
    ...initialState,
    viewer: {
      ...initialState.viewer,
      openElements: {
        ...initialState.viewer.openElements,
        thumbnailsPanel: true,
        leftPanel: true,
      },
      panelWidths: {
        ...initialState.viewer.panelWidths,
        leftPanel: 264,
        thumbnailsPanel: 300,
      },
      pageLabels: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'],
    },
    document: {
      ...initialState.document,
      totalPages: {
        1: 10,
      },
    },
  };
  return (
    <Provider store={configureStore({
      reducer: rootReducer,
      preloadedState: myState,
      middleware: (getDefaultMiddleware) => getDefaultMiddleware({ serializableCheck: false })
    })}>
      <Panel dataElement="thumbnailsPanel">
        <ThumbnailsPanel />
      </Panel>
    </Provider>
  );
};