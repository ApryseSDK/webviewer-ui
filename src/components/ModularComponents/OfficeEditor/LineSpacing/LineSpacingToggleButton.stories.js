import React from 'react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { availableFontFaces, cssFontValues } from 'src/constants/officeEditorFonts';
import { OfficeEditorEditMode } from 'src/constants/officeEditor';
import core from 'core';
import { workerTypes } from 'src/constants/types';
import LineSpacingToggleButton from './LineSpacingToggleButton';

export default {
  title: 'ModularComponents/OfficeEditor/LineSpacingToggleButton',
  component: LineSpacingToggleButton,
};

const initialState = {
  officeEditor: {
    cursorProperties: {
      paragraphProperties: {
        lineHeight: undefined,
        lineHeightMultiplier: 1,
      },
      locationProperties: {},
    },
    selectionProperties: {
      paragraphProperties: {},
    },
    availableFontFaces,
    cssFontValues,
    editMode: OfficeEditorEditMode.EDITING
  },
  viewer: {
    isOfficeEditorMode: true,
    toolButtonObjects: {},
    colorMap: {},
    disabledElements: {},
    customElementOverrides: {},
    openElements: {
      lineSpacingFlyout: false,
    },
    customPanels: [],
    genericPanels: [],
    focusedElementsStack: [],
    canUndo: {
      1: false,
      2: false,
    },
    canRedo: {
      1: false,
      2: false,
    },
    flyoutMap: {},
    flyoutPosition: { x: 0, y: 0 },
    activeFlyout: 'lineSpacingFlyout',
    activeTabInPanel: {},
    modularComponents: {},
    modularHeaders: {},
    modularHeadersHeight: {
      topHeaders: 40,
      bottomHeaders: 40
    },
    customHeadersAdditionalProperties: {},
  },
  featureFlags: {
    customizableUI: true,
  }
};

const store = configureStore({ reducer: () => initialState });

const prepareButtonStory = () => {
  core.getOfficeEditor = () => ({
    isTextSelected: () => false,
    isCursorInTable: () => false
  });
  core.getDocument = () => ({
    getType: () => workerTypes.OFFICE_EDITOR,
    addEventListener: () => { },
    removeEventListener: () => { },
  });

  return (
    <Provider store={store}>
      <LineSpacingToggleButton/>
    </Provider>
  );
};

export function InactiveButton() {
  initialState.viewer.openElements.lineSpacingFlyout = false;
  return prepareButtonStory();
}

export function ActiveButton() {
  initialState.viewer.openElements.lineSpacingFlyout = true;
  return prepareButtonStory();
}