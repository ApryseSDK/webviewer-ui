import React from 'react';
import initialState from 'src/redux/initialState';
import { mockHeadersNormalized, mockModularComponents } from '../ModularComponents/AppStories/mockAppState';
import SignatureListPanel from './SignatureListPanel';
import { mockSavedSignatures, mockSavedInitials } from '../SignatureStylePopup/mockedSignatures';
import { setItemToFlyoutStore } from 'helpers/itemToFlyoutHelper';
import { MockApp, createStore } from 'helpers/storybookHelper';

export default {
  title: 'ModularComponents/SignatureListPanel',
  component: SignatureListPanel,
};

const SignatureListPanelInApp = (context, location, signatures = [], initials = []) => {
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
      activeGroupedItems: [
        'insertGroupedItems',
        'insertToolsGroupedItems',
        'defaultAnnotationUtilities'
      ],
      activeToolName: 'AnnotationCreateSignature',
      activeTheme: context.globals.theme,
    },
    featureFlags: {
      customizableUI: true,
    },
  };

  const store = createStore(mockState);
  setItemToFlyoutStore(store);

  return <MockApp initialState={mockState} />;
};

export const EmptySignatureListPanelInAppLeft = (args, context) => SignatureListPanelInApp(context, 'left');
export const EmptySignatureListPanelInAppRight = (args, context) => SignatureListPanelInApp(context, 'right');
export const EmptySignatureListPanelInMobile = (args, context) => SignatureListPanelInApp(context, 'right');
export const SignatureListPanelWithSignaturesInAppLeft = (args, context) => SignatureListPanelInApp(context, 'left', mockSavedSignatures);
export const SignatureListPanelWithSignaturesInAppRight = (args, context) => SignatureListPanelInApp(context, 'right', mockSavedSignatures);
export const SignatureListPanelWithSignaturesAndInitials = (args, context) => SignatureListPanelInApp(context, 'left', mockSavedSignatures, mockSavedInitials);
export const SignatureListPanelWithSignaturesAndInitialsInAppRight = (args, context) => SignatureListPanelInApp(context, 'right', mockSavedSignatures, mockSavedInitials);
export const SignatureListPanelInMobile = (args, context) => SignatureListPanelInApp(context, 'right', mockSavedSignatures, mockSavedInitials);


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
