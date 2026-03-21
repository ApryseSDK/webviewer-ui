import React from 'react';
import TrackChangeOverlay from './TrackChangeOverlay';
import { Provider } from 'react-redux';
import { OfficeEditorEditMode } from 'constants/officeEditor';
import { configureStore } from '@reduxjs/toolkit';
import { disableRtlModeParameters } from 'helpers/storybookParams';

export default {
  title: 'Components/TrackChangeOverlay',
  component: TrackChangeOverlay,
  parameters: {
    legacyUI: true,
  }
};

const getStore = () => {
  const initialState = {
    viewer: {
      isMultiViewerMode: false,
    },
    activeFlyout: null,
    featureFlags: {
      customizableUI: false,
    },
    officeEditor: {
      editMode: OfficeEditorEditMode.EDITING,
    }
  };

  function rootReducer(state = initialState) {
    return state;
  }

  return configureStore({ reducer: rootReducer });
};

export function Basic() {
  return (
    <Provider store={getStore()}>
      <div style={{ width: '150px' }}>
        <TrackChangeOverlay />
      </div>
    </Provider>
  );
}

Basic.parameters = disableRtlModeParameters;
