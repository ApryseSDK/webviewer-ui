import { Provider } from 'react-redux';
import React from 'react';
import { configureStore } from '@reduxjs/toolkit';


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
    currentPage: 7,
    pageLabels: ['1', '2', '3', '4', '5', '6', '7', '8', '9'],
    annotationPopup: [
      { dataElement: 'viewFileButton' },
      { dataElement: 'annotationCommentButton' },
      { dataElement: 'annotationStyleEditButton' },
      { dataElement: 'annotationDateEditButton' },
      { dataElement: 'annotationRedactButton' },
      { dataElement: 'annotationCropButton' },
      { dataElement: 'annotationContentEditButton' },
      { dataElement: 'annotationClearSignatureButton' },
      { dataElement: 'annotationGroupButton' },
      { dataElement: 'annotationUngroupButton' },
      { dataElement: 'formFieldEditButton' },
      { dataElement: 'linkButton' },
      { dataElement: 'fileAttachmentDownload' },
      { dataElement: 'annotationDeleteButton' },
      { dataElement: 'shortCutKeysFor3D' },
      { dataElement: 'playSoundButton' },
      { dataElement: 'annotationAlignButton' }
    ],
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
  }
};

export default function withMockRedux(Component, mockInitialState ={ viewer: {}, search: {}, document: {} }) {
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
  };
  return function WithMockReduxWrapper(props) {
    return (
      <Provider store={configureStore({ reducer: () => initialState })}>
        <Component {...props} />
      </Provider>
    );
  };
}
