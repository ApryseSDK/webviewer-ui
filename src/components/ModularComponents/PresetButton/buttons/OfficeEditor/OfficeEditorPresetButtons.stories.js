import React from 'react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import PresetButton from '../../PresetButton';
import { PRESET_BUTTON_TYPES } from 'src/constants/customizationVariables';
import core from 'core';
import { workerTypes } from 'src/constants/types';
import { expect } from '@storybook/test';
import { OEModularUIMockState } from 'helpers/storybookHelper';

export default {
  title: 'ModularComponents/OfficeEditor/PresetButton',
  component: PresetButton,
};

const initialState = OEModularUIMockState;

const store = configureStore({ reducer: () => initialState });

const prepareButtonStory = (buttonType, enableNonPrintingCharacters = false) => {
  const props = {
    buttonType: buttonType,
  };

  core.getOfficeEditor = () => ({
    isTextSelected: () => false,
    isCursorInTable: () => false
  });
  core.getDocument = () => ({
    getType: () => workerTypes.OFFICE_EDITOR,
    addEventListener: () => { },
    removeEventListener: () => { },
    getOfficeEditor: () => ({
      getIsNonPrintingCharactersEnabled: () => enableNonPrintingCharacters,
    }),
  });
  window.Core.Annotations.Color = () => ({
    toString: () => 'rgba(0, 255, 0, 1)',
    // eslint-disable-next-line custom/no-hex-colors
    toHexString: () => '#00FF00',
  });

  return (
    <Provider store={store}>
      <PresetButton {...props} />
    </Provider>
  );
};

export function BoldButton() {
  initialState.officeEditor.cursorProperties.bold = false; // set inactive state
  return prepareButtonStory(PRESET_BUTTON_TYPES.BOLD);
}

export function ActiveBoldButton() {
  initialState.officeEditor.cursorProperties.bold = true; // set active state
  return prepareButtonStory(PRESET_BUTTON_TYPES.BOLD);
}

export function ItalicButton() {
  initialState.officeEditor.cursorProperties.italic = false; // set inactive state
  return prepareButtonStory(PRESET_BUTTON_TYPES.ITALIC);
}

export function ActiveItalicButton() {
  initialState.officeEditor.cursorProperties.italic = true; // set active state
  return prepareButtonStory(PRESET_BUTTON_TYPES.ITALIC);
}

export function UnderlineButton() {
  initialState.officeEditor.cursorProperties.underlineStyle = ''; // set inactive state
  return prepareButtonStory(PRESET_BUTTON_TYPES.UNDERLINE);
}

export function ActiveUnderlineButton() {
  initialState.officeEditor.cursorProperties.underlineStyle = 'single'; // set active state
  return prepareButtonStory(PRESET_BUTTON_TYPES.UNDERLINE);
}

export function AlignLeftButton() {
  initialState.officeEditor.cursorProperties.paragraphProperties.justification = ''; // set inactive state
  return prepareButtonStory(PRESET_BUTTON_TYPES.JUSTIFY_LEFT);
}

export function ActiveAlignLeftButton() {
  initialState.officeEditor.cursorProperties.paragraphProperties.justification = 'left'; // set active state
  return prepareButtonStory(PRESET_BUTTON_TYPES.JUSTIFY_LEFT);
}

export function AlignCenterButton() {
  initialState.officeEditor.cursorProperties.paragraphProperties.justification = ''; // set inactive state
  return prepareButtonStory(PRESET_BUTTON_TYPES.JUSTIFY_CENTER);
}

export function ActiveAlignCenterButton() {
  initialState.officeEditor.cursorProperties.paragraphProperties.justification = 'center'; // set active state
  return prepareButtonStory(PRESET_BUTTON_TYPES.JUSTIFY_CENTER);
}

export function AlignRightButton() {
  initialState.officeEditor.cursorProperties.paragraphProperties.justification = ''; // set inactive state
  return prepareButtonStory(PRESET_BUTTON_TYPES.JUSTIFY_RIGHT);
}

export function ActiveAlignRightButton() {
  initialState.officeEditor.cursorProperties.paragraphProperties.justification = 'right'; // set active state
  return prepareButtonStory(PRESET_BUTTON_TYPES.JUSTIFY_RIGHT);
}

export function AlignJustifyButton() {
  initialState.officeEditor.cursorProperties.paragraphProperties.justification = ''; // set inactive state
  return prepareButtonStory(PRESET_BUTTON_TYPES.JUSTIFY_BOTH);
}

export function ActiveAlignJustifyButton() {
  initialState.officeEditor.cursorProperties.paragraphProperties.justification = 'both'; // set active state
  return prepareButtonStory(PRESET_BUTTON_TYPES.JUSTIFY_BOTH);
}

export function IncreaseIndentButton() {
  return prepareButtonStory(PRESET_BUTTON_TYPES.INCREASE_INDENT);
}

export function DecreaseIndentButton() {
  return prepareButtonStory(PRESET_BUTTON_TYPES.DECREASE_INDENT);
}

export function ColorPickerButton() {
  return prepareButtonStory(PRESET_BUTTON_TYPES.OE_COLOR_PICKER);
}

ColorPickerButton.play = async ({ canvasElement }) => {
  // check color picker button active state
  const colorPickerButtonIcon = canvasElement.querySelector('[data-element="textColorButton"] > .Icon');
  expect(colorPickerButtonIcon.style.color, 'color picker button should have correct color').toBe('rgb(0, 255, 0)');
};

export function InsertImageButton() {
  return prepareButtonStory(PRESET_BUTTON_TYPES.INSERT_IMAGE);
}

export function PageBreakButton() {
  return prepareButtonStory(PRESET_BUTTON_TYPES.PAGE_BREAK);
}

export function ToggleNonPrintingCharactersButton() {
  return prepareButtonStory(PRESET_BUTTON_TYPES.OE_TOGGLE_NON_PRINTING_CHARACTERS, false);
}

export function ActiveToggleNonPrintingCharactersButton() {
  return prepareButtonStory(PRESET_BUTTON_TYPES.OE_TOGGLE_NON_PRINTING_CHARACTERS, true);
}