import React from 'react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import core from 'core';
import { workerTypes } from 'constants/types';
import ContextMenuPopup from './ContextMenuPopup';

export default {
  title: 'Components/ContextMenuPopup',
  component: ContextMenuPopup,
};

const initialState = {
  viewer: {
    disabledElements: {},
    customElementOverrides: {},
    contextMenuPopup: [
      { dataElement: 'panToolButton' },
      { dataElement: 'stickyToolButton' },
      { dataElement: 'highlightToolButton' },
      { dataElement: 'freeHandToolButton' },
      { dataElement: 'freeHandHighlightToolButton' },
      { dataElement: 'freeTextToolButton' },
      { dataElement: 'markInsertTextToolButton' },
      { dataElement: 'markReplaceTextToolButton' },
    ],
    customPanels: [],
    genericPanels: [],
    openElements: {
      contextMenuPopup: true,
    },
    enableRightClickAnnotationPopup: false,
  },
  featureFlags: {
    customizableUI: true,
  },
};

export const BasicHorizontal = () => {
  initialState.viewer.enableRightClickAnnotationPopup = false;
  core.getDocument = () => ({
    getType: () => workerTypes.PDF,
  });

  return (
    <Provider store={configureStore({ reducer: () => initialState })}>
      <ContextMenuPopup
        clickPosition={{ left: 0, top: 0 }}
      />
    </Provider>
  );
};

export const BasicVertical = () => {
  initialState.viewer.enableRightClickAnnotationPopup = true;
  core.getDocument = () => ({
    getType: () => workerTypes.PDF,
  });

  return (
    <Provider store={configureStore({ reducer: () => initialState })}>
      <ContextMenuPopup
        clickPosition={{ left: 0, top: 0 }}
      />
    </Provider>
  );
};

export const OfficeEditor = () => {
  core.getOfficeEditor = () => ({
    isTextSelected: () => true,
    isImageSelected: () => false,
    isCursorInTable: () => false,
  });
  core.getDocument = () => ({
    getType: () => workerTypes.OFFICE_EDITOR,
  });

  initialState.viewer.enableRightClickAnnotationPopup = false;

  return (
    <Provider store={configureStore({ reducer: () => initialState })}>
      <ContextMenuPopup
        clickPosition={{ left: 0, top: 0 }}
      />
    </Provider>
  );
};

export const OfficeEditorTable = () => {
  core.getOfficeEditor = () => ({
    isTextSelected: () => false,
    isCursorInTable: () => true,
  });
  core.getDocument = () => ({
    getType: () => workerTypes.OFFICE_EDITOR,
  });

  initialState.viewer.enableRightClickAnnotationPopup = false;

  return (
    <Provider store={configureStore({ reducer: () => initialState })}>
      <ContextMenuPopup
        clickPosition={{ left: 0, top: 0 }}
      />
    </Provider>
  );
};