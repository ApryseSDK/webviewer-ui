import React from 'react';
import { configureStore } from '@reduxjs/toolkit';
import { Provider } from 'react-redux';
import Panel from 'components/Panel';
import initialState from 'src/redux/initialState';
import App from 'components/App';

export default {
  title: 'Components/LayersPanel',
  component: Panel,
};

function noop() {
  // Comment needed to suppress SonarCloud code smell.
}

const layers = [
  {
    'name': 'Layer 1',
  },
  {
    'name': 'Layer 2',
  },
  {
    'name': 'Layer 3',
  }
];

function rootReducer(state = initialState, action) {
  return state;
}

const MockApp = ({ initialState }) => {
  return (
    <Provider store={configureStore({
      reducer: rootReducer,
      preloadedState: initialState,
      middleware: (getDefaultMiddleware) => getDefaultMiddleware({ serializableCheck: false })
    })}>
      <App removeEventHandlers={noop} />
    </Provider>
  );
};

export function Basic() {
  const stateWithLayersPanel = {
    ...initialState,
    viewer: {
      ...initialState.viewer,
      customFlxPanels: [
        {
          dataElement: 'panel1',
          render: 'layersPanel',
        }
      ],
      openElements: {
        ...initialState.viewer.openElements,
        contextMenuPopup: false,
        panel1: true,
      },
    },
    document: {
      ...initialState.document,
      layers: layers,
    },
  };
  return <MockApp initialState={stateWithLayersPanel} />;
}

Basic.parameters = { layout: 'fullscreen' };

export const RightSide = () => {
  const stateWithLayersPanelOnRight = {
    ...initialState,
    viewer: {
      ...initialState.viewer,
      customFlxPanels: [
        {
          dataElement: 'panel1',
          render: 'layersPanel',
          location: 'right',
        }
      ],
      openElements: {
        ...initialState.viewer.openElements,
        contextMenuPopup: false,
        panel1: true,
      },
    },
    document: {
      ...initialState.document,
      layers: layers,
    },
  };
  return <MockApp initialState={stateWithLayersPanelOnRight} />;
};

RightSide.parameters = { layout: 'fullscreen' };