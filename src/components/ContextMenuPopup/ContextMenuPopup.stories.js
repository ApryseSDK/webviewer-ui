import React from 'react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import core from 'core';
import { workerTypes } from 'constants/types';
import { EditingStreamType } from 'constants/officeEditor';
import ContextMenuPopup from './ContextMenuPopup';
import { defaultPopups } from 'src/redux/modularComponents';
import { disableRtlModeParameters } from 'helpers/storybookParams';
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
    stream: EditingStreamType.BODY,
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

BasicHorizontal.parameters = disableRtlModeParameters;

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
  mockInitialState.officeEditor.stream = EditingStreamType.BODY;

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

OfficeEditorTable.parameters = disableRtlModeParameters;

export const OfficeEditorHeaderStream = () => {
  core.getOfficeEditor = () => ({
    isTextSelected: () => true,
    isImageSelected: () => false,
  });
  core.getDocument = () => ({
    getType: () => workerTypes.OFFICE_EDITOR,
  });

  mockInitialState.viewer.enableRightClickAnnotationPopup = false;
  mockInitialState.officeEditor.cursorProperties.locationProperties.inTable = false;
  mockInitialState.officeEditor.stream = EditingStreamType.HEADER;

  return (
    <Provider store={configureStore({ reducer: () => mockInitialState })}>
      <ContextMenuPopup
        clickPosition={{ left: 0, top: 0 }}
      />
    </Provider>
  );
};

OfficeEditorHeaderStream.parameters = disableRtlModeParameters;
