import React from 'react';
import { render, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';

import SignaturePanel from './SignaturePanel';

jest.mock('helpers/setVerificationResult', () => ({
  __esModule: true,
  default: () => new Promise(() => {}),
}));

jest.mock('core', () => {
  const noop = () => {};
  const mockDoc = { addEventListener: noop, removeEventListener: noop };
  const createAnnotationManager = (annotations) => ({
    getAnnotationsList: () => annotations,
    getFormFieldCreationManager: () => ({ isInFormFieldCreationMode: () => false }),
    getFieldManager: () => ({ getField: (name) => ({ name, widgets: [] }) }),
    deleteAnnotations: noop,
  });

  function createWidget(fieldName) {
    const widget = Object.create(globalThis.Core.Annotations.SignatureWidgetAnnotation.prototype);
    widget.getField = () => ({ name: fieldName, widgets: [] });
    return widget;
  }

  const viewer1 = [
    createWidget('Viewer1_Sig_A'),
    createWidget('Viewer1_Sig_B'),
  ];
  const viewer2 = [
    createWidget('Viewer2_Sig_X'),
    createWidget('Viewer2_Sig_Y'),
    createWidget('Viewer2_Sig_Z'),
  ];

  return {
    addEventListener: noop,
    removeEventListener: noop,
    getDocument: () => mockDoc,
    getDocumentViewer: (key = 1) => ({
      getDocument: () => mockDoc,
      getAnnotationManager: () => createAnnotationManager(key === 2 ? viewer2 : viewer1),
    }),
    getAnnotationManager: (key = 1) => createAnnotationManager(key === 2 ? viewer2 : viewer1),
    getAnnotationsLoadedPromise: () => new Promise(() => {}),
    isFullPDFEnabled: () => false,
    getScrollViewElement: () => globalThis.document.createElement('div'),
  };
});

function createStore(initialState) {
  return configureStore({
    reducer: (state = initialState) => state,
  });
}

const baseState = {
  viewer: {
    isMultiViewerMode: true,
    activeDocumentViewerKey: 1,
    disabledElements: {},
    customElementOverrides: {},
    openElements: {},
    flyoutMap: {},
    currentLanguage: 'en',
  },
  document: {},
  digitalSignatureValidation: {
    certificates: { 1: [], 2: [] },
    verificationResult: { 1: {}, 2: {} },
    isRevocationCheckingEnabled: false,
    revocationProxyPrefix: '',
    trustListKey: '',
  },
  featureFlags: {},
  search: {},
};

describe('SignaturePanel - MultiViewer Mode', () => {
  const savedPDFNet = window.Core.PDFNet;

  beforeAll(() => {
    window.Core.PDFNet = {
      VerificationResult: {
        ModificationPermissionsStatus: {},
        DigestStatus: {},
      },
      VerificationOptions: {
        TimeMode: {},
      },
    };
  });

  afterAll(() => {
    window.Core.PDFNet = savedPDFNet;
  });

  it('should render signature widget info from the second documentViewerKey when multiviewer mode is enabled', async () => {
    const state = {
      ...baseState,
      viewer: { ...baseState.viewer, activeDocumentViewerKey: 2 },
    };

    const { container, getByText } = render(
      <Provider store={createStore(state)}>
        <SignaturePanel />
      </Provider>
    );

    await waitFor(() => {
      expect(container.querySelectorAll('.signature-widget-info')).toHaveLength(3);
    });
    expect(getByText(/Viewer2_Sig_X/)).toBeInTheDocument();
    expect(getByText(/Viewer2_Sig_Y/)).toBeInTheDocument();
    expect(getByText(/Viewer2_Sig_Z/)).toBeInTheDocument();
  });

  it('should switch from documentViewer 1 to 2 in multiviewer mode and update the rendered signature widgets', async () => {
    const stateViewer1 = {
      ...baseState,
      viewer: { ...baseState.viewer, activeDocumentViewerKey: 1 },
    };
    const stateViewer2 = {
      ...baseState,
      viewer: { ...baseState.viewer, activeDocumentViewerKey: 2 },
    };

    const { container, getByText, queryByText, rerender } = render(
      <Provider store={createStore(stateViewer1)}>
        <SignaturePanel />
      </Provider>
    );

    await waitFor(() => {
      expect(container.querySelectorAll('.signature-widget-info')).toHaveLength(2);
    });
    expect(getByText(/Viewer1_Sig_A/)).toBeInTheDocument();
    expect(getByText(/Viewer1_Sig_B/)).toBeInTheDocument();
    expect(queryByText(/Viewer2_Sig_X/)).not.toBeInTheDocument();

    rerender(
      <Provider store={createStore(stateViewer2)}>
        <SignaturePanel />
      </Provider>
    );

    await waitFor(() => {
      expect(container.querySelectorAll('.signature-widget-info')).toHaveLength(3);
    });
    expect(getByText(/Viewer2_Sig_X/)).toBeInTheDocument();
    expect(getByText(/Viewer2_Sig_Y/)).toBeInTheDocument();
    expect(getByText(/Viewer2_Sig_Z/)).toBeInTheDocument();
    expect(queryByText(/Viewer1_Sig_A/)).not.toBeInTheDocument();
    expect(queryByText(/Viewer1_Sig_B/)).not.toBeInTheDocument();
  });
});


