import React from 'react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { cssFontValues } from 'src/constants/fonts/fonts';
import { availableOfficeEditorFonts } from 'src/constants/fonts/officeEditorFonts';
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
    availableFontFaces: availableOfficeEditorFonts,
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


const prepareButtonStory = (initialState) => {
  const store = configureStore({ reducer: () => initialState });

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
  const initialStateWithDisabledElements = {
    ...initialState,
    viewer: {
      ...initialState.viewer,
      disabledElements: {
        lineSpacingToggleButton: true,
      },
    },
  };
  return prepareButtonStory(initialStateWithDisabledElements);
}

InactiveButton.parameters = window.storybook.disableChromatic;

export function ActiveButton() {
  const initialStateWithActiveElements = {
    ...initialState,
    viewer: {
      ...initialState.viewer,
      openElements: {
        ...initialState.viewer.openElements,
        lineSpacingFlyout: true,
      },
    },
  };
  return prepareButtonStory(initialStateWithActiveElements);
}

ActiveButton.parameters = window.storybook.disableChromatic;