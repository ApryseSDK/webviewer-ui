import React from 'react';
import { configureStore } from '@reduxjs/toolkit';
import { Provider as ReduxProvider } from 'react-redux';
import LinkModal from './LinkModal';
import core from 'core';

export default {
  title: 'Components/LinkModal',
  component: LinkModal,
  parameters: {
    customizableUI: true
  }
};

const initialState = {
  viewer: {
    disabledElements: {},
    openElements: {
      'linkModal': true,
    },
    currentPage: 1,
    selectedTab: 'notesPanel',
    tab: {
      linkModal: 'URLPanelButton'
    },
    customElementOverrides: {},
    pageLabels: []
  },
  document: {
    totalPages: 1
  },
  featureFlags: {
    customizableUI: true,
  },
};
const store = configureStore({
  reducer: () => initialState
});

export function NoURLInput() {
  core.getDocumentViewer = () => ({
    getAnnotationManager: () => ({
      isAnnotationSelected: () => true
    }),
    getSelectedText: () => 'selected text'
  });

  core.getSelectedAnnotations = () => ({});

  return (
    <ReduxProvider store={store}>
      <div style={{ width: 100 }}>
        <LinkModal
          rightClickedAnnotation={{}}
          setRightClickedAnnotation={function() { }}
        />
      </div>
    </ReduxProvider>
  );
}