import React from 'react';
import SignatureModalComponent from './SignatureModal'
import { configureStore } from '@reduxjs/toolkit';
import { Provider } from "react-redux";

export default {
  title: 'Components/SignatureModal',
  component: SignatureModal,
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
    signatureFonts: ['GreatVibes-Regular'],
    toolbarGroup: 'toolbarGroup-Insert',
    customPanels: [],
  },
};

const store = configureStore({
  reducer: () => initialState
});

export const SignatureModal = () => (
  <Provider store={store}>
    <SignatureModalComponent isOpen={true} />
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
    signatureFonts: ['GreatVibes-Regular'],
    toolbarGroup: 'toolbarGroup-Insert',
    customPanels: [],
  },
}

const imageStore = configureStore({
  reducer: () => imageTabState
});

export const SignatureModalImageTab = () => (
  <Provider store={imageStore}>
    <SignatureModalComponent isOpen={true} />
  </Provider>
);
