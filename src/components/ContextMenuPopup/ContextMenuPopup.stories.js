import React from 'react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import core from 'core';
import { workerTypes } from 'constants/types';
import ContextMenuPopup from './ContextMenuPopup';
import { defaultPopups } from 'src/redux/modularComponents';
export default {
  title: 'Components/ContextMenuPopup',
  component: ContextMenuPopup,
};

const mockInitialState = {
  viewer: {
    disabledElements: {},
    customElementOverrides: {},
    modularPopups: defaultPopups,
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
  officeEditor: {
    cursorProperties: {
      paragraphProperties: {},
      locationProperties: {
        inTable: false,
      },
    },
  },
  spreadsheetEditor: {
    editMode: 'editing',
  }
};

export const BasicHorizontal = () => {
  mockInitialState.viewer.enableRightClickAnnotationPopup = false;
  core.getDocument = () => ({
    getType: () => workerTypes.PDF,
  });

  return (
    <Provider store={configureStore({ reducer: () => mockInitialState })}>
      <ContextMenuPopup
        clickPosition={{ left: 0, top: 0 }}
      />
    </Provider>
  );
};

BasicHorizontal.parameters = window.storybook.disableRtlMode;

export const BasicVertical = () => {
  mockInitialState.viewer.enableRightClickAnnotationPopup = true;
  core.getDocument = () => ({
    getType: () => workerTypes.PDF,
  });

  return (
    <Provider store={configureStore({ reducer: () => mockInitialState })}>
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
  });
  core.getDocument = () => ({
    getType: () => workerTypes.OFFICE_EDITOR,
  });

  mockInitialState.viewer.enableRightClickAnnotationPopup = false;

  return (
    <Provider store={configureStore({ reducer: () => mockInitialState })}>
      <ContextMenuPopup
        clickPosition={{ left: 0, top: 0 }}
      />
    </Provider>
  );
};

export const OfficeEditorTable = () => {
  core.getOfficeEditor = () => ({
    isTextSelected: () => false,
  });
  core.getDocument = () => ({
    getType: () => workerTypes.OFFICE_EDITOR,
  });

  mockInitialState.viewer.enableRightClickAnnotationPopup = false;
  mockInitialState.officeEditor.cursorProperties.locationProperties.inTable = true;

  return (
    <Provider store={configureStore({ reducer: () => mockInitialState })}>
      <ContextMenuPopup
        clickPosition={{ left: 0, top: 0 }}
      />
    </Provider>
  );
};

OfficeEditorTable.parameters = window.storybook.disableRtlMode;