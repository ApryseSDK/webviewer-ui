import React from 'react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import core from 'core';
import { workerTypes } from 'constants/types';
import { EditingStreamType } from 'constants/officeEditor';
import ContextMenuPopup from './ContextMenuPopup';
import { defaultPopups } from 'src/redux/modularComponents';
import { defaultOfficeEditorPopups } from 'src/redux/officeEditorModularComponents';
import { disableRtlModeParameters } from 'helpers/storybookParams';

export default {
  title: 'Components/ContextMenuPopup',
  component: ContextMenuPopup,
};

const createMockState = ({
  isRightClickAnnotationPopupEnabled = false,
  isCursorInTable = false,
  officeEditorStream = EditingStreamType.BODY,
  modularPopups = defaultPopups,
} = {}) => ({
  viewer: {
    disabledElements: {},
    customElementOverrides: {},
    modularPopups,
    customPanels: [],
    genericPanels: [],
    openElements: {
      contextMenuPopup: true,
    },
    enableRightClickAnnotationPopup: isRightClickAnnotationPopupEnabled,
  },
  featureFlags: {
    customizableUI: true,
  },
  officeEditor: {
    cursorProperties: {
      paragraphProperties: {},
      locationProperties: {
        inTable: isCursorInTable,
      },
    },
    stream: officeEditorStream,
  },
  spreadsheetEditor: {
    editMode: 'editing',
  },
});

const renderWithState = (state) => (
  <Provider store={configureStore({ reducer: () => state })}>
    <ContextMenuPopup
      clickPosition={{ left: 0, top: 0 }}
    />
  </Provider>
);

const getOfficeEditorMock = (isTextSelected = true) => ({
  isTextSelected: () => isTextSelected,
  isImageSelected: () => false,
});

const getOfficeEditorModularPopups = () => ({
  ...defaultPopups,
  ...defaultOfficeEditorPopups,
});

const setDocumentType = (documentType) => {
  core.getDocument = () => ({
    getType: () => documentType,
  });
};

export const BasicHorizontal = () => {
  setDocumentType(workerTypes.PDF);
  return renderWithState(createMockState());
};

BasicHorizontal.parameters = disableRtlModeParameters;

export const BasicVertical = () => {
  setDocumentType(workerTypes.PDF);
  return renderWithState(createMockState({ isRightClickAnnotationPopupEnabled: true }));
};

export const OfficeEditor = () => {
  setDocumentType(workerTypes.OFFICE_EDITOR);
  core.getOfficeEditor = () => getOfficeEditorMock(true);

  return renderWithState(createMockState({
    officeEditorStream: EditingStreamType.BODY,
    modularPopups: getOfficeEditorModularPopups(),
  }));
};

export const OfficeEditorTable = () => {
  setDocumentType(workerTypes.OFFICE_EDITOR);
  core.getOfficeEditor = () => getOfficeEditorMock(false);

  return renderWithState(createMockState({
    isCursorInTable: true,
    modularPopups: getOfficeEditorModularPopups(),
  }));
};

OfficeEditorTable.parameters = disableRtlModeParameters;

export const OfficeEditorHeaderStream = () => {
  setDocumentType(workerTypes.OFFICE_EDITOR);
  core.getOfficeEditor = () => getOfficeEditorMock(true);

  return renderWithState(createMockState({
    officeEditorStream: EditingStreamType.HEADER,
    modularPopups: getOfficeEditorModularPopups(),
  }));
};

OfficeEditorHeaderStream.parameters = disableRtlModeParameters;
