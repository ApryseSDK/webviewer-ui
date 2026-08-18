import React from 'react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import PresetButton from '../../PresetButton';
import { PRESET_BUTTON_TYPES, STYLE_TOGGLE_OPTIONS } from 'src/constants/customizationVariables';
import core from 'core';
import { workerTypes } from 'src/constants/types';
import { expect, within, waitFor, fn } from 'storybook/test';
import { OEModularUIMockState } from 'helpers/storybookHelper';
import { getTranslatedText } from 'src/helpers/testTranslationHelper';
import { disableRtlModeParameters } from 'helpers/storybookParams';

export default {
  title: 'ModularComponents/OfficeEditor/PresetButton',
  component: PresetButton,
};

const initialState = OEModularUIMockState;

const updateSelectionAndCursorStyleMock = fn((style) => style);
const prepareButtonStory = (buttonsToRender, initialState, enableNonPrintingCharacters = false) => {
  const store = configureStore({ reducer: () => initialState });

  core.getOfficeEditor = () => ({
    isTextSelected: () => false,
    isCursorInTable: () => false,
    getIsNonPrintingCharactersEnabled: () => enableNonPrintingCharacters,
    updateSelectionAndCursorStyle: updateSelectionAndCursorStyleMock,
  });
  core.getDocument = () => ({
    getType: () => workerTypes.OFFICE_EDITOR,
    addEventListener: () => { },
    removeEventListener: () => { },
  });
  window.Core.Annotations.Color = class {
    constructor(r = 0, g = 0, b = 0) {
      this.r = r;
      this.g = g;
      this.b = b;
    }

    toString() {
      return `rgba(${this.r}, ${this.g}, ${this.b}, 1)`;
    }

    toHexString() {
      const toHex = (value) => value.toString(16).padStart(2, '0');
      // eslint-disable-next-line custom/no-hex-colors
      return `#${toHex(this.r)}${toHex(this.g)}${toHex(this.b)}`.toUpperCase();
    }
  };

  return (
    <Provider store={store}>
      {buttonsToRender.map((buttonType) => (
        <PresetButton key={buttonType} buttonType={buttonType} />
      ))}
    </Provider>
  );
};

const officeEditorButtons = [
  PRESET_BUTTON_TYPES.BOLD,
  PRESET_BUTTON_TYPES.ITALIC,
  PRESET_BUTTON_TYPES.UNDERLINE,
  PRESET_BUTTON_TYPES.STRIKEOUT,
  PRESET_BUTTON_TYPES.ALIGN_LEFT,
  PRESET_BUTTON_TYPES.ALIGN_CENTER,
  PRESET_BUTTON_TYPES.ALIGN_RIGHT,
  PRESET_BUTTON_TYPES.JUSTIFY_BOTH,
  PRESET_BUTTON_TYPES.INCREASE_INDENT,
  PRESET_BUTTON_TYPES.DECREASE_INDENT,
  PRESET_BUTTON_TYPES.OE_COLOR_PICKER,
  PRESET_BUTTON_TYPES.OE_HIGHLIGHT_COLOR_PICKER,
  PRESET_BUTTON_TYPES.INSERT_IMAGE,
  PRESET_BUTTON_TYPES.OE_TOGGLE_NON_PRINTING_CHARACTERS,
];

const officeEditorStyleTypes = Object.values(STYLE_TOGGLE_OPTIONS);

export const OfficeEditorPresetButtons = () => {
  return prepareButtonStory(officeEditorButtons, initialState);
};

OfficeEditorPresetButtons.play = async ({ canvasElement }) => {
  // check color picker button active state
  const canvas = within(canvasElement);
  // eslint-disable-next-line custom/no-hex-colors
  const colorPickerButton = canvas.getByRole('button', { name: `${getTranslatedText('officeEditor.textColor')} #00FF00` });
  const colorPickerButtonIcon = colorPickerButton.querySelector('.Icon');
  expect(getComputedStyle(colorPickerButtonIcon).color, 'color picker button should have correct color').toBe('rgb(0, 255, 0)');
  // eslint-disable-next-line custom/no-hex-colors
  const highlightColorPickerButton = canvas.getByRole('button', { name: getTranslatedText('officeEditor.highlightColor') });
  const highlightColorPickerButtonIcon = highlightColorPickerButton.querySelector('.Icon');
  expect(getComputedStyle(highlightColorPickerButtonIcon).color, 'highlight color picker button should have correct color').toBe('rgb(255, 255, 0)');

  for (const style of officeEditorStyleTypes) {
    const button = await canvas.findByRole('button', { name: getTranslatedText(`spreadsheetEditor.${style}`) });
    await button.click();
    await waitFor(() => {
      expect(updateSelectionAndCursorStyleMock).toHaveBeenCalledWith(expect.objectContaining({ [style]: true }));
    });
  }
};

OfficeEditorPresetButtons.parameters = disableRtlModeParameters;

export const OfficeEditorPresetButtonsActive = () => {
  const initialStateWithActiveStyles = {
    ...initialState,
    officeEditor: {
      ...initialState.officeEditor,
      cursorProperties: {
        ...initialState.officeEditor.cursorProperties,
        bold: true,
        italic: true,
        underlineStyle: 'single',
        strikethrough: true,
        paragraphProperties: {
          ...initialState.officeEditor.cursorProperties.paragraphProperties,
          justification: 'center',
        },
      },
    },
  };
  return prepareButtonStory(officeEditorButtons, initialStateWithActiveStyles, true);
};

OfficeEditorPresetButtonsActive.parameters = disableRtlModeParameters;
