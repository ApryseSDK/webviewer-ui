
import React from 'react';
import { configureStore } from '@reduxjs/toolkit';
import { Provider } from 'react-redux';
import ToggleZoomOverlay from './ToggleZoomOverlay';
import { disableRtlModeParameters } from 'helpers/storybookParams';
import { OfficeEditorEditMode } from 'constants/officeEditor';

export default {
  title: 'Components/ToggleZoomOverlay',
  component: ToggleZoomOverlay
};

const getStore = () => {
  const initialState = {
    viewer: {
      openElements: ['zoomOverlay'],
      isMultiViewerMode: true,
      activeDocumentViewerKey: 1,
      disabledElements: {},
      customElementOverrides: {},
      zoomLevels: {
        1: 1,
      },
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

const store = getStore();


export function Basic() {
  return (
    <Provider store={store}>
      <div style={{ width: 150 }}>
        <ToggleZoomOverlay documentViewerKey={1} />
      </div>
    </Provider>
  );
}

Basic.parameters = disableRtlModeParameters;