
import React, { useEffect } from 'react';
import SaveModal from './SaveModal';
import { createStore } from 'redux';
import { Provider } from 'react-redux';

export default {
  title: 'Components/SaveModal',
  component: SaveModal,
};
const getStore = () => {
  const initialState = {
    viewer: {
      openElements: { saveModal: true },
      disabledElements: {},
      customElementOverrides: {},
    },
    featureFlags: {
      customizableUI: true,
    },
  };

  function rootReducer(state = initialState, action) {
    return state;
  }

  return createStore(rootReducer);
};

const spreadsheetStore = () => {
  const store = getStore();

  const originalGetState = store.getState;
  store.getState = () => {
    const state = originalGetState();
    return {
      ...state,
      viewer: {
        ...state.viewer,
        isSpreadsheetEditorModeEnabled: true,
      },
    };
  };

  return store;
};

export function Basic() {
  return (
    <Provider store={getStore()}>
      <SaveModal />
    </Provider>
  );
}

export function OfficeEditor() {
  window.setDocType('officeEditor');
  useEffect(() => {
    return () => {
      window.setDocType('PDF');
    };
  });

  return (
    <Provider store={spreadsheetStore()}>
      <SaveModal />
    </Provider>
  );
}

export function Spreadsheet() {
  window.setDocType('spreadsheetEditor');
  useEffect(() => {
    return () => {
      window.setDocType('PDF');
    };
  });

  return (
    <Provider store={spreadsheetStore()}>
      <SaveModal />
    </Provider>
  );
}