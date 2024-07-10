import React from 'react';
import { Provider } from 'react-redux';
import Panel from 'components/Panel';
import ThumbnailsPanel from './ThumbnailsPanel';
import initialState from 'src/redux/initialState';
import { createStore } from 'src/helpers/storybookHelper';

export default {
  title: 'Components/Thumbnails',
  component: ThumbnailsPanel,
};

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
  featureFlags: {
    customizableUI: true,
  },
};

export const Thumbnails = () => {
  return (
    <Provider store={createStore(myState)}>
      <Panel dataElement="thumbnailsPanel">
        <ThumbnailsPanel />
      </Panel>
    </Provider>
  );
};

export const ThumbnailsMultiSelect = () => {
  const state = {
    ...myState,
    viewer: {
      ...myState.viewer,
      thumbnailSelectingPages: true,
    }
  };

  return (
    <Provider store={createStore(state)}>
      <Panel dataElement="thumbnailsPanel">
        <ThumbnailsPanel/>
      </Panel>
    </Provider>
  );
};