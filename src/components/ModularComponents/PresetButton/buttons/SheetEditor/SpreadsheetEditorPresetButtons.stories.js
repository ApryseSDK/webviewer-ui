import React from 'react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import PresetButton from '../../PresetButton';
import { PRESET_BUTTON_TYPES } from 'src/constants/customizationVariables';
import { OEModularUIMockState } from 'helpers/storybookHelper';

export default {
  title: 'SpreadsheetEditor/PresetButton',
  component: PresetButton,
};

const initialState = OEModularUIMockState;

const store = configureStore({ reducer: () => initialState });

const prepareButtonStory = (buttonType, enableNonPrintingCharacters = false) => {
  const props = {
    buttonType: buttonType,
  };

  return (
    <Provider store={store}>
      <PresetButton {...props} />
      <PresetButton buttonType={PRESET_BUTTON_TYPES.CELL_ADJUSTMENT} />
      <PresetButton buttonType={PRESET_BUTTON_TYPES.CELL_BACKGROUND_COLOR} />
      <PresetButton buttonType={PRESET_BUTTON_TYPES.CELL_BORDER_STYLE} />
      <PresetButton buttonType={PRESET_BUTTON_TYPES.CELL_DECORATOR_BOLD} />
      <PresetButton buttonType={PRESET_BUTTON_TYPES.CELL_DECORATOR_STRIKETHROUGH} />
      <PresetButton buttonType={PRESET_BUTTON_TYPES.CELL_FORMAT_CURRENCY} />
      <PresetButton buttonType={PRESET_BUTTON_TYPES.CELL_FORMAT_DEC_DECIMAL} />
      <PresetButton buttonType={PRESET_BUTTON_TYPES.CELL_FORMAT_PERCENT} />
      <PresetButton buttonType={PRESET_BUTTON_TYPES.CELL_TEXT_ALIGNMENT} />
    </Provider>
  );
};

export function MergeToggle() {
  initialState.officeEditor.cursorProperties.bold = false; // set inactive state
  return prepareButtonStory(PRESET_BUTTON_TYPES.CELL_MERGE_TOGGLE);
}
