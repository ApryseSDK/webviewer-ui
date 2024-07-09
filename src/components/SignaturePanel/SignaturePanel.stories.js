import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import Panel from 'components/Panel';
import React from 'react';
import SignaturePanelComponent from './SignaturePanel';

export default {
  title: 'ModularComponents/SignaturePanel',
  component: SignaturePanelComponent,
  parameters: {
    customizableUI: true,
  },
};

const initialState = {
  viewer: {
    openElements: {
      panel: true,
    },
    disabledElements: {},
    customElementOverrides: {},
    tab: {},
    panelWidths: { panel: 300 },
    modularHeaders: {},
  },
  digitalSignatureValidation: {
    validationModalWidgetName: '',
    verificationResult: {},
    certificates: [],
    trustLists: [],
    isRevocationCheckingEnabled: false,
    revocationProxyPrefix: null,
  },
};

export function SignaturePanelEmpty() {
  return (
    <Provider store={configureStore({ reducer: () => initialState })}>
      <Panel location={'left'} dataElement={'panel'}>
        <SignaturePanelComponent/>
      </Panel>
    </Provider>
  );
}