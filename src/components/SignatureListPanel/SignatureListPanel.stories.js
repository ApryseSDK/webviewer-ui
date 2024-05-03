import React from 'react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import initialState from 'src/redux/initialState';
import rootReducer from 'reducers/rootReducer';
import App from 'components/App';
import { mockHeadersNormalized, mockModularComponents } from '../ModularComponents/AppStories/mockAppState';
import SignatureListPanel from './SignatureListPanel';
import { mockSavedSignatures, mockSavedInitials } from '../SignatureStylePopup/mockedSignatures';
import { setItemToFlyoutStore } from 'src/helpers/itemToFlyoutHelper';
import PropTypes from 'prop-types';

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

const MockApp = ({ store }) => (
  <Provider store={store}>
    <App removeEventHandlers={() => { }} />
  </Provider>
);

MockApp.propTypes = {
  store: PropTypes.object.isRequired,
};

const SignatureListPanelInApp = (location, signatures = [], initials = []) => {
  const mockState = {
    ...initialState,
    viewer: {
      ...initialState.viewer,
      activeCustomRibbon: 'insert-ribbon-item',
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
      activeGroupedItems: ['insertGroupedItems'],
      lastPickedToolAndGroup: {
        tool: 'AnnotationCreateSignature',
        group: ['insertGroupedItems'],
      },
      activeToolName: 'AnnotationCreateSignature',
    },
    featureFlags: {
      customizableUI: true,
    },
  };

  const store = createStore(mockState);
  setItemToFlyoutStore(store);

  return <MockApp store={store} />;
};

export const EmptySignatureListPanelInAppLeft = () => SignatureListPanelInApp('left');
export const EmptySignatureListPanelInAppRight = () => SignatureListPanelInApp('right');
export const EmptySignatureListPanelInMobile = () => SignatureListPanelInApp('right');
export const SignatureListPanelWithSignaturesInAppLeft = () => SignatureListPanelInApp('left', mockSavedSignatures);
export const SignatureListPanelWithSignaturesInAppRight = () => SignatureListPanelInApp('right', mockSavedSignatures);
export const SignatureListPanelWithSignaturesAndInitials = () => SignatureListPanelInApp('left', mockSavedSignatures, mockSavedInitials);
export const SignatureListPanelWithSignaturesAndInitialsInAppRight = () => SignatureListPanelInApp('right', mockSavedSignatures, mockSavedInitials);
export const SignatureListPanelInMobile = () => SignatureListPanelInApp('right', mockSavedSignatures, mockSavedInitials);


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
SignatureListPanelInMobile.parameters = window.storybook.MobileParameters;

EmptySignatureListPanelInMobile.parameters = window.storybook.MobileParameters;
