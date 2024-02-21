import React from 'react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import initialState from 'src/redux/initialState';
import rootReducer from 'reducers/rootReducer';
import App from 'components/App';
import { mockHeadersNormalized, mockModularComponents } from '../ModularComponents/AppStories/mockAppState';
import SignatureListPanel from './SignatureListPanel';
import { mockSavedSignatures, mockSavedInitials } from '../SignatureStylePopup/mockedSignatures';

export default {
  title: 'ModularComponents/SignatureListPanel',
  component: SignatureListPanel,
};

const createStore = (preloadedState) => {
  return configureStore({
    reducer: rootReducer,
    preloadedState: preloadedState,
    middleware: (getDefaultMiddleware) => getDefaultMiddleware({ serializableCheck: false })
  });
};

const MockApp = ({ initialState }) => (
  <Provider store={createStore(initialState)}>
    <App removeEventHandlers={() => { }} />
  </Provider>
);

const SignatureListPanelInApp = (location, signatures = [], initials = []) => {
  const mockState = {
    ...initialState,
    viewer: {
      ...initialState.viewer,
      activeCustomRibbon: 'toolbarGroup-Insert',
      modularHeaders: mockHeadersNormalized,
      modularComponents: mockModularComponents,
      isInDesktopOnlyMode: false,
      genericPanels: [{
        dataElement: 'signatureListPanel',
        render: 'signatureListPanel',
        location: location,
      }],
      openElements: {
        ...initialState.viewer.openElements,
        contextMenuPopup: false,
        signatureListPanel: true,
      },
      savedSignatures: [...signatures],
      savedInitials: [...initials],
      isInitialsModeEnabled: initials.length > 0,
      lastPickedToolForGroupedItems: {
        'insertGroupedItems': 'AnnotationCreateSignature',
      },
      activeGroupedItems: ['insertGroupedItems']
    },
    featureFlags: {
      customizableUI: true,
    },
  };
  return <MockApp initialState={mockState} />;
};

export const EmptySignatureListPanelInAppLeft = () => SignatureListPanelInApp('left');
export const EmptySignatureListPanelInAppRight = () => SignatureListPanelInApp('right');
export const SignatureListPanelWithSignaturesInAppLeft = () => SignatureListPanelInApp('left', mockSavedSignatures);
export const SignatureListPanelWithSignaturesInAppRight = () => SignatureListPanelInApp('right', mockSavedSignatures);
export const SignatureListPanelWithSignaturesAndInitials = () => SignatureListPanelInApp('left', mockSavedSignatures, mockSavedInitials);
export const SignatureListPanelWithSignaturesAndInitialsInAppRight = () => SignatureListPanelInApp('right', mockSavedSignatures, mockSavedInitials);


EmptySignatureListPanelInAppLeft.parameters = {
  layout: 'fullscreen',
};
EmptySignatureListPanelInAppRight.parameters = {
  layout: 'fullscreen',
};
SignatureListPanelWithSignaturesInAppLeft.parameters = {
  layout: 'fullscreen',
};
SignatureListPanelWithSignaturesInAppRight.parameters = {
  layout: 'fullscreen',
};
SignatureListPanelWithSignaturesAndInitials.parameters = {
  layout: 'fullscreen',
};
SignatureListPanelWithSignaturesAndInitialsInAppRight.parameters = {
  layout: 'fullscreen',
};