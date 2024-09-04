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
