import React from 'react';
import { configureStore } from '@reduxjs/toolkit';
import Flyout from '../Flyout';
import { Provider } from 'react-redux';
import DataElements from 'constants/dataElement';

import { expect, within } from 'storybook/test';

import core from 'core';
import { workerTypes } from 'src/constants/types';
import { EditingStreamType, OfficeEditorEditMode } from 'constants/officeEditor';
import { cssFontValues } from 'src/constants/fonts/fonts';
import { availableOfficeEditorFonts } from 'src/constants/fonts/officeEditorFonts';
import { VIEWER_CONFIGURATIONS } from 'src/constants/customizationVariables';
import { getTranslatedText } from 'src/helpers/testTranslationHelper';

export default {
  title: 'ModularComponents/OfficeEditorFlyout',
  component: Flyout,
  parameters: {
    customizableUI: true,
  },
};

const stylePresetDropdown = {
  dataElement: 'stylePresetDropdown',
  type: 'stylePresetDropdown',
};

const fontFamilyDropdown = {
  dataElement: 'fontFamilyDropdown',
  type: 'fontFamilyDropdown',
};

const fontSizeDropdown = {
  dataElement: 'fontSizeDropdown',
  type: 'fontSizeDropdown',
};

const boldButton = {
  dataElement: 'boldButton',
  type: 'presetButton',
  buttonType: 'boldButton',
};

const italicButton = {
  dataElement: 'italicButton',
  type: 'presetButton',
  buttonType: 'italicButton',
};

const underlineButton = {
  dataElement: 'underlineButton',
  type: 'presetButton',
  buttonType: 'underlineButton',
};

const divider = 'divider';

const lineSpacingButton = {
  dataElement: 'lineSpacingButton',
  type: 'lineSpacingButton',
};

const orderedListButton = {
  dataElement: 'orderedListButton',
  type: 'orderedListButton',
};

const unorderedListButton = {
  dataElement: 'unorderedListButton',
  type: 'unorderedListButton',
};

const leftAlignButton = {
  dataElement: 'alignLeftButton',
  type: 'presetButton',
  buttonType: 'alignLeftButton'
};

const centerAlignButton = {
  dataElement: 'alignCenterButton',
  type: 'presetButton',
  buttonType: 'alignCenterButton',
};

const rightAlignButton = {
  dataElement: 'alignRightButton',
  type: 'presetButton',
  buttonType: 'alignRightButton',
};

const justifyBothButton = {
  dataElement: 'justifyBothButton',
  type: 'presetButton',
  buttonType: 'justifyBothButton',
};

const undoButton = {
  dataElement: 'undoButton',
  type: 'presetButton',
  buttonType: 'undoButton',
};

const redoButton = {
  dataElement: 'redoButton',
  type: 'presetButton',
  buttonType: 'redoButton',
};

const ColorPickerButton = {
  dataElement: DataElements.OFFICE_EDITOR_FLYOUT_COLOR_PICKER,
  type: 'presetButton',
  buttonType: DataElements.OFFICE_EDITOR_FLYOUT_COLOR_PICKER,
};

const increaseIndentButton = {
  dataElement: 'increaseIndentButton',
  type: 'presetButton',
  buttonType: 'increaseIndentButton',
};

const decreaseIndentButton = {
  dataElement: 'decreaseIndentButton',
  type: 'presetButton',
  buttonType: 'decreaseIndentButton',
};

const nonPrintingCharactersToggleButton = {
  dataElement: DataElements.OFFICE_EDITOR_TOGGLE_NON_PRINTING_CHARACTERS_BUTTON,
  type: 'presetButton',
  buttonType: DataElements.OFFICE_EDITOR_TOGGLE_NON_PRINTING_CHARACTERS_BUTTON,
};

const activeColor = {
  'r': 0,
  'g': 255,
  'b': 0,
};

const initialState = {
  officeEditor: {
    canUndo: true,
    canRedo: false,
    cursorProperties: {
      bold: true,
      italic: true,
      underlineStyle: 'single',
      pointSize: 11,
      fontFace: 'Arial',
      color: activeColor,
      paragraphProperties: {
        justification: 'both',
        listType: 'ordered',
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
    editMode: OfficeEditorEditMode.EDITING,
    stream: EditingStreamType.BODY,
  },
  viewer: {
    uiConfiguration: VIEWER_CONFIGURATIONS.DOCX_EDITOR,
    isOfficeEditorMode: true,
    toolButtonObjects: {},
    colorMap: {},
    disabledElements: {},
    customElementOverrides: {},
    openElements: {
      flyoutMenu: true,
      noIcons: true,
      [DataElements.MAIN_MENU]: true,
      menuWithComponentItems: true,
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
    flyoutMap: {
      'flyoutMenu': {
        'dataElement': 'flyoutMenu',
        'items': [
          stylePresetDropdown,
          fontFamilyDropdown,
          fontSizeDropdown,
          divider,
          boldButton,
          italicButton,
          underlineButton,
          divider,
          ColorPickerButton,
          divider,
          lineSpacingButton,
          divider,
          orderedListButton,
          unorderedListButton,
          divider,
          leftAlignButton,
          centerAlignButton,
          rightAlignButton,
          justifyBothButton,
          divider,
          increaseIndentButton,
          decreaseIndentButton,
          nonPrintingCharactersToggleButton,
          divider,
          undoButton,
          redoButton,
        ],
      },
    },
    flyoutPosition: { x: 0, y: 0 },
    activeFlyout: 'flyoutMenu',
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
  },
  spreadsheetEditor: {
    canRedo: false,
    canUndo: false,
  }
};
const store = configureStore({
  reducer: () => initialState
});

export const FlyoutComponent = () => {
  core.getOfficeEditor = () => ({
    isTextSelected: () => false,
    isCursorInTable: () => false,
    getIsNonPrintingCharactersEnabled: () => true,
  });
  core.getDocument = () => ({
    getType: () => workerTypes.OFFICE_EDITOR,
    addEventListener: () => { },
    removeEventListener: () => { },
  });
  window.Core.Annotations.Color = class {
    toString() {
      return 'rgba(0, 255, 0, 1)';
    }

    toHexString() {
    // eslint-disable-next-line custom/no-hex-colors
      return '#00FF00';
    }
  };

  return (
    <Provider store={store}>
      <Flyout />
    </Provider>
  );
};


FlyoutComponent.play = async ({ canvasElement }) => {
  const canvas = within(canvasElement);
  // check style buttons active state
  const boldButton = await canvas.findByRole('button', { name: getTranslatedText('officeEditor.bold') });
  expect(boldButton).toHaveAttribute('aria-pressed', 'true');
  const italicButton = await canvas.findByRole('button', { name: getTranslatedText('officeEditor.italic') });
  expect(italicButton).toHaveAttribute('aria-pressed', 'true');
  const underlineButton =  await canvas.findByRole('button', { name: getTranslatedText('officeEditor.underline') });
  expect(underlineButton).toHaveAttribute('aria-pressed', 'true');

  // check list type buttons active state
  const orderedListButton =  await canvas.findByRole('button', { name: getTranslatedText('officeEditor.numberList') });
  expect(orderedListButton).toHaveAttribute('aria-pressed', 'true');
  const unorderedListButton = await canvas.findByRole('button', { name: getTranslatedText('officeEditor.bulletList') });
  expect(unorderedListButton).toHaveAttribute('aria-pressed', 'false');

  // check alignment buttons active state
  const leftAlignButton =  await canvas.findByRole('button', { name: getTranslatedText('officeEditor.leftAlign') });
  expect(leftAlignButton).toHaveAttribute('aria-pressed', 'false');
  const centerAlignButton = await canvas.findByRole('button', { name: getTranslatedText('officeEditor.centerAlign') });
  expect(centerAlignButton).toHaveAttribute('aria-pressed', 'false');
  const rightAlignButton = await canvas.findByRole('button', { name: getTranslatedText('officeEditor.rightAlign') });
  expect(rightAlignButton).toHaveAttribute('aria-pressed', 'false');
  const justifyBothButton = await canvas.findByRole('button', { name: getTranslatedText('officeEditor.justify') });
  expect(justifyBothButton).toHaveAttribute('aria-pressed', 'true');

  // check active color picker button's icon
  // eslint-disable-next-line custom/no-hex-colors
  const colorPickerIcon = canvas.getByLabelText('#00FF00');
  expect(colorPickerIcon).toBeInTheDocument();

  // check active non printing characters button
  const nonPrintingCharactersButton = await canvas.findByRole('button', { name: getTranslatedText('officeEditor.nonPrintingCharacters') });
  expect(nonPrintingCharactersButton).toHaveAttribute('aria-pressed', 'true');

  // check undo is enabled and redo is disabled
  const undoButton = await canvas.findByRole('button', { name: getTranslatedText('action.undo') });
  expect(undoButton.disabled, 'undo button should not be disabled').toBe(false);
  const redoButton = await canvas.findByRole('button', { name: getTranslatedText('action.redo') });
  expect(redoButton.disabled, 'redo button should be disabled').toBe(true);
};
