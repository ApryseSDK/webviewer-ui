import React from 'react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import PresetButton from '../../PresetButton';
import { PRESET_BUTTON_TYPES } from 'src/constants/customizationVariables';
import core from 'core';
import { workerTypes } from 'src/constants/types';
import { expect, within } from 'storybook/test';
import { OEModularUIMockState } from 'helpers/storybookHelper';

export default {
  title: 'ModularComponents/OfficeEditor/PresetButton',
  component: PresetButton,
};

const initialState = OEModularUIMockState;


const prepareButtonStory = (buttonsToRender, initialState, enableNonPrintingCharacters = false) => {
  const store = configureStore({ reducer: () => initialState });

  core.getOfficeEditor = () => ({
    isTextSelected: () => false,
    isCursorInTable: () => false,
    getIsNonPrintingCharactersEnabled: () => enableNonPrintingCharacters,
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
  PRESET_BUTTON_TYPES.ALIGN_LEFT,
  PRESET_BUTTON_TYPES.ALIGN_CENTER,
  PRESET_BUTTON_TYPES.ALIGN_RIGHT,
  PRESET_BUTTON_TYPES.JUSTIFY_BOTH,
  PRESET_BUTTON_TYPES.INCREASE_INDENT,
  PRESET_BUTTON_TYPES.DECREASE_INDENT,
  PRESET_BUTTON_TYPES.OE_COLOR_PICKER,
  PRESET_BUTTON_TYPES.INSERT_IMAGE,
  PRESET_BUTTON_TYPES.OE_TOGGLE_NON_PRINTING_CHARACTERS,
];

export const OfficeEditorPresetButtons = () => {
  return prepareButtonStory(officeEditorButtons, initialState);
};

OfficeEditorPresetButtons.play = async ({ canvasElement }) => {
  // check color picker button active state
  const canvas = within(canvasElement);
  // eslint-disable-next-line custom/no-hex-colors
  const colorPickerButton = canvas.getByRole('button', { name: '#00FF00' });
  const colorPickerButtonIcon = colorPickerButton.querySelector('.Icon');
  expect(colorPickerButtonIcon.style.color, 'color picker button should have correct color').toBe('rgb(0, 255, 0)');
};

OfficeEditorPresetButtons.parameters = window.storybook.disableRtlMode;

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
        paragraphProperties: {
          ...initialState.officeEditor.cursorProperties.paragraphProperties,
          justification: 'center',
        },
      },
    },
  };
  return prepareButtonStory(officeEditorButtons, initialStateWithActiveStyles, true);
};

OfficeEditorPresetButtonsActive.parameters = window.storybook.disableRtlMode;
