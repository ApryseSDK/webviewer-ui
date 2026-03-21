import React from 'react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import MultiViewer from './MultiViewer';
import rootReducer from 'reducers/rootReducer';
import initialState from 'src/redux/initialState';
import { MockApp } from 'helpers/storybookHelper';

export default {
  title: 'Components/MultiViewer',
  component: MultiViewer,
};

const createMockState = (overrides = {}) => ({
  ...initialState,
  viewer: {
    ...initialState.viewer,
    isMultiViewerMode: true,
    isMultiViewerReady: true,
    isComparisonOverlayEnabled: true,
    activeDocumentViewerKey: 1,
    ...overrides,
    openElements: {
      ...initialState.viewer.openElements,
      ...(overrides.openElements || {}),
    },
    panelWidths: {
      ...initialState.viewer.panelWidths,
      ...(overrides.panelWidths || {}),
    },
    disabledElements: {
      ...initialState.viewer.disabledElements,
      ...(overrides.disabledElements || {}),
    },
  },
  document: {
    ...initialState.document,
    documentLoadedMap: {
      1: overrides.doc1Loaded || false,
      2: overrides.doc2Loaded || false,
    },
  },
});

const containerStyle = {
  width: '100%',
  height: '600px',
  position: 'relative',
};

export const Basic = () => {
  const store = configureStore({
    reducer: rootReducer,
    preloadedState: createMockState({
      doc1Loaded: true,
      doc2Loaded: true,
    }),
    middleware: (getDefaultMiddleware) => getDefaultMiddleware({ serializableCheck: false }),
  });

  return (
    <Provider store={store}>
      <div style={containerStyle}>
        <MultiViewer />
      </div>
    </Provider>
  );
};

export const WithThumbnailsPanelOpen = (args, context) => {
  const { addonRtl } = context.globals;
  const mockState = {
    ...createMockState({
      doc1Loaded: true,
      doc2Loaded: true,
    }),
    viewer: {
      ...createMockState({ doc1Loaded: true, doc2Loaded: true }).viewer,
      openElements: {
        ...initialState.viewer.openElements,
        contextMenuPopup: false,
        thumbnailsPanel: true,
      },
      panelWidths: {
        ...initialState.viewer.panelWidths,
        thumbnailsPanel: 250,
      },
      activeTheme: context.globals.theme,
    },
    featureFlags: {
      customizableUI: true,
    },
  };

  return <MockApp initialState={mockState} initialDirection={addonRtl} />;
};

WithThumbnailsPanelOpen.parameters = {
  layout: 'fullscreen',
  customizableUI: true,
  chromatic: {
    modes: {
      'Dark theme': { disable: true },
    },
  },
};

export const WithNotesPanelOpen = (args, context) => {
  const { addonRtl } = context.globals;
  const mockState = {
    ...createMockState({
      doc1Loaded: true,
      doc2Loaded: true,
    }),
    viewer: {
      ...createMockState({ doc1Loaded: true, doc2Loaded: true }).viewer,
      openElements: {
        ...initialState.viewer.openElements,
        contextMenuPopup: false,
        notesPanel: true,
      },
      panelWidths: {
        ...initialState.viewer.panelWidths,
        notesPanel: 250,
      },
      activeTheme: context.globals.theme,
    },
    featureFlags: {
      customizableUI: true,
    },
  };

  return <MockApp initialState={mockState} initialDirection={addonRtl} />;
};

WithNotesPanelOpen.parameters = {
  layout: 'fullscreen',
  customizableUI: true,
  chromatic: {
    modes: {
      'Dark theme': { disable: true },
    },
  },
};

export const WithThumbnailsAndNotesPanelsOpen = (args, context) => {
  const { addonRtl } = context.globals;
  const mockState = {
    ...createMockState({
      doc1Loaded: true,
      doc2Loaded: true,
    }),
    viewer: {
      ...createMockState({ doc1Loaded: true, doc2Loaded: true }).viewer,
      openElements: {
        ...initialState.viewer.openElements,
        contextMenuPopup: false,
        thumbnailsPanel: true,
        notesPanel: true,
      },
      panelWidths: {
        ...initialState.viewer.panelWidths,
        thumbnailsPanel: 250,
        notesPanel: 250,
      },
      activeTheme: context.globals.theme,
    },
    featureFlags: {
      customizableUI: true,
    },
  };

  return <MockApp initialState={mockState} initialDirection={addonRtl} />;
};

WithThumbnailsAndNotesPanelsOpen.parameters = {
  layout: 'fullscreen',
  customizableUI: true,
  chromatic: {
    modes: {
      'Dark theme': { disable: true },
    },
  },
};