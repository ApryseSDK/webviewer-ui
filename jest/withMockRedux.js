import { createStore, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import thunk from 'redux-thunk';
import React from 'react';

const initialState = {
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
  },
  search: {
    redactionSearchPatterns: {},
  },
  document: {
    totalPages: {1: 9, 2: 0},
  }
};

function rootReducer(state = initialState, action) { // eslint-disable-line no-unused-vars
  return state;
}

// Apply the thunk middleware
const store = createStore(rootReducer, applyMiddleware(thunk));

export default function withMockRedux(Component) {
  return function WithMockReduxWrapper(props) {
    return (
      <Provider store={store}>
        <Component {...props} />
      </Provider>
    );
  };
}
