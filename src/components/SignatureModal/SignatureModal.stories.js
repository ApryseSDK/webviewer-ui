import React from 'react';
import SignatureModalComponent from './SignatureModal';
import { configureStore } from '@reduxjs/toolkit';
import { Provider } from 'react-redux';

export default {
  title: 'Components/SignatureModal',
  component: SignatureModalComponent,
};

const initialState = {
  viewer: {
    disabledElements: {},
    customElementOverrides: {},
    savedSignatures: [],
    displayedSavedSignatures: [],
    openElements: {
      signatureModal: true
    },
    displayedSignaturesFilterFunction: () => true,
    tab: {
      signatureModal: 'inkSignaturePanelButton',
    },
    activeToolName: 'AnnotationCreateSignature',
    signatureFonts: ['Satisfy', 'Nothing You Could Do', 'La Belle Aurore', 'Whisper'],
    toolbarGroup: 'toolbarGroup-Insert',
    customPanels: [],
  },
};

const store = configureStore({
  reducer: () => initialState
});

export const InkSignaturePanel = () => (
  <Provider store={store}>
    <SignatureModalComponent isOpen />
  </Provider>
);

const inkSignatureWithInitialsStore = configureStore({
  reducer: () => ({
    viewer: {
      ...initialState.viewer,
      isInitialsModeEnabled: true,
    }
  })
});

export const InkSignaturePanelWithInitials = () => (
  <Provider store={inkSignatureWithInitialsStore}>
    <SignatureModalComponent isOpen />
  </Provider>
);

const drawSignatureStore = configureStore({
  reducer: () => ({
    viewer: {
      ...initialState.viewer,
      tab: {
        signatureModal: 'textSignaturePanelButton',
      }
    }
  })
});

export const TextSignaturePanel = () => (
  <Provider store={drawSignatureStore}>
    <SignatureModalComponent isOpen />
  </Provider>
);

const drawSignatureStoreWithInitials = configureStore({
  reducer: () => ({
    viewer: {
      ...initialState.viewer,
      isInitialsModeEnabled: true,
      tab: {
        signatureModal: 'textSignaturePanelButton',
      }
    }
  })
});

export const TextSignaturePanelWithInitials = () => (
  <Provider store={drawSignatureStoreWithInitials}>
    <SignatureModalComponent isOpen />
  </Provider>
);

const imageTabState = {
  viewer: {
    disabledElements: {},
    customElementOverrides: {},
    savedSignatures: [],
    displayedSavedSignatures: [],
    openElements: {
      signatureModal: true
    },
    displayedSignaturesFilterFunction: () => true,
    tab: {
      signatureModal: 'imageSignaturePanelButton',
    },
    activeToolName: 'AnnotationCreateSignature',
    signatureFonts: ['Satisfy', 'Nothing You Could Do', 'La Belle Aurore', 'Whisper'],
    toolbarGroup: 'toolbarGroup-Insert',
    customPanels: [],
  },
};

const imageStore = configureStore({
  reducer: () => imageTabState
});

export const UploadSignatureTab = () => (
  <Provider store={imageStore}>
    <SignatureModalComponent isOpen />
  </Provider>
);

const imageStoreWithInitials = configureStore({
  reducer: () => ({
    viewer: {
      ...imageTabState.viewer,
      isInitialsModeEnabled: true,
    }
  })
});

export const UploadSignatureTabWithInitials = () => (
  <Provider store={imageStoreWithInitials}>
    <SignatureModalComponent isOpen />
  </Provider>
);