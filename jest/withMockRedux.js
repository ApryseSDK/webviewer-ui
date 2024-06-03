import { createStore } from 'redux';
import { Provider } from 'react-redux';
import React from 'react';

// mock initial state.
// UI Buttons are redux connected, and they need a state or the
// tests will error out
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
      { dataElement: 'annotationAlignButton'}
    ],
  },
  search: {
    redactionSearchPatterns: {},
  }
};

function rootReducer(state = initialState, action) { // eslint-disable-line no-unused-vars
  return state;
}

const store = createStore(rootReducer);

export default function withMockRedux(Component) {
  return function WithMockReduxWrapper(props) {
    return (
      <Provider store={store}>
        <Component {...props} />
      </Provider>
    );
  };
}
