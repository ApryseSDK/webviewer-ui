import React from 'react';
import SignatureStylePopup from './SignatureStylePopup';
import SelectedSignatureRow from './SelectedSignatureRow';
import { configureStore } from '@reduxjs/toolkit';
import { Provider } from 'react-redux';
import SignatureModes from 'constants/signatureModes';
import { mockSavedSignatures, mockSavedInitials } from './mockedSignatures';

export default {
  title: 'Components/SavedSignaturesOverlay',
  component: SignatureStylePopup,
};

const initialState = {
  viewer: {
    isInitialsModeEnabled: true,
    disabledElements: {},
    openElements: {
      toolStylePopup: false,
    },
    signatureMode: SignatureModes.FULL_SIGNATURE,
    customElementOverrides: {},
    savedSignatures: mockSavedSignatures,
    selectedDisplayedSignatureIndex: 0,
    selectedDisplayedInitialsIndex: 0,
    savedInitials: mockSavedInitials,
    displayedSavedSignatures: [],
    displayedSignaturesFilterFunction: () => true,
    tab: {
      savedSignatures: 'savedFullSignaturePanelButton'
    },
    activeToolName: 'AnnotationCreateSignature',
  },
};

const store = configureStore({
  reducer: () => initialState
});

export const SavedFullSignaturesTab = () => (
  <Provider store={store}>
    <div className='ToolStylePopup' style={{ width: '220px' }}>
      <SignatureStylePopup />
    </div>
  </Provider>
);

const savedInitialsStore = configureStore({
  reducer: () => ({
    viewer: {
      ...initialState.viewer,
      tab: {
        savedSignatures: 'savedInitialsPanelButton',
      }
    }
  })
});

export const SavedInitialsTab = () => (
  <Provider store={savedInitialsStore}>
    <div className="ToolStylePopup" style={{ width: '220px' }}>
      <SignatureStylePopup />
    </div>
  </Provider>
);

export const SelectedSignature = () => (
  <Provider store={savedInitialsStore}>
    <SelectedSignatureRow />
  </Provider>
);

const intialStateInitialsMode = {
  viewer: {
    ...initialState.viewer,
    signatureMode: SignatureModes.INITIALS,
  }
};

const initialsModeStore = configureStore({
  reducer: () => intialStateInitialsMode
});

export const SelectedInitials = () => (
  <Provider store={initialsModeStore}>
    <SelectedSignatureRow />
  </Provider>
);
