import { Provider } from 'react-redux';
import React from 'react';
import { configureStore } from '@reduxjs/toolkit';
import { defaultPopups } from 'src/redux/modularComponents';

const defaultState = {
  viewer: {
    activeDocumentViewerKey: 1,
    disabledElements: {},
    customElementOverrides: {},
    panelWidths: {
      redactionPanel: 330,
    },
    currentLanguage: 'en',
    openElements: {},
    flyoutMap: {},
    currentPage: { 1: 7, 2: 1, },
    pageLabels: { 1: ['1', '2', '3', '4', '5', '6', '7', '8', '9'], 2: [] },
    isCustomPageLabelsEnabled: { 1: false, 2: false },
    modularPopups: defaultPopups,
    savedSignatures: [],
    maxSignatureCount: 10,
    focusedElementsStack: [],
    annotationContentOverlayHandler: null,
  },
  search: {
    redactionSearchPatterns: {},
  },
  document: {
    totalPages: { 1: 9, 2: 0 },
  },
  spreadsheetEditor: {
    editMode: 'viewOnly',
  },
  featureFlags: {
  },
};

export default function withMockRedux(Component, mockInitialState = { viewer: {}, search: {}, document: {}, user: {} }) {
  const initialState = {
    viewer: {
      ...defaultState.viewer,
      ...mockInitialState.viewer,
    },
    search: {
      ...defaultState.search,
      ...mockInitialState.search,
    },
    document: {
      ...defaultState.document,
      ...mockInitialState.document,
    },
    spreadsheetEditor: {
      ...defaultState.spreadsheetEditor,
      ...mockInitialState.spreadsheetEditor,
    },
    officeEditor: {
      ...defaultState.officeEditor,
      ...mockInitialState.officeEditor,
    },
    featureFlags: {
      ...defaultState.featureFlags,
      ...mockInitialState.featureFlags,
    },
    user: {
      ...defaultState.user,
      ...mockInitialState.user,
    }
  };
  return function WithMockReduxWrapper(props) {
    return (
      <Provider store={configureStore({ reducer: () => initialState })}>
        <Component {...props} />
      </Provider>
    );
  };
}
