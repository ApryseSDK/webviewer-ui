import React from 'react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import initialState from 'src/redux/initialState';
import PresetButton from './PresetButton';
import { PRESET_BUTTON_TYPES } from 'src/constants/customizationVariables';

export default {
  title: 'ModularComponents/PresetButton',
  component: PresetButton,
  parameters: {
    customizableUI: true,
  }
};

initialState.viewer.activeDocumentViewerKey = 1;
const store = configureStore({ reducer: () => initialState });

const prepareButtonStory = (buttonType) => {
  const props = {
    buttonType: buttonType,
  };

  return (
    <Provider store={store}>
      <PresetButton {...props} />
    </Provider>
  );
};

export function UndoButton() {
  return prepareButtonStory(PRESET_BUTTON_TYPES.UNDO);
}

export function RedoButton() {
  return prepareButtonStory(PRESET_BUTTON_TYPES.REDO);
}

export function NewDocumentButton() {
  return prepareButtonStory(PRESET_BUTTON_TYPES.NEW_DOCUMENT);
}

export function FilePickerButton() {
  return prepareButtonStory(PRESET_BUTTON_TYPES.FILE_PICKER);
}

export function DownloadButton() {
  return prepareButtonStory(PRESET_BUTTON_TYPES.DOWNLOAD);
}

export function FullscreenButton() {
  return prepareButtonStory(PRESET_BUTTON_TYPES.FULLSCREEN);
}

export function SaveAsButton() {
  return prepareButtonStory(PRESET_BUTTON_TYPES.SAVE_AS);
}

export function PrintButton() {
  return prepareButtonStory(PRESET_BUTTON_TYPES.PRINT);
}

export function CreatePortfolioButton() {
  return prepareButtonStory(PRESET_BUTTON_TYPES.CREATE_PORTFOLIO);
}

export function SettingsButton() {
  return prepareButtonStory(PRESET_BUTTON_TYPES.SETTINGS);
}

export function FormFieldEditButton() {
  return prepareButtonStory(PRESET_BUTTON_TYPES.FORM_FIELD_EDIT);
}

export function ContentEditButton() {
  return prepareButtonStory(PRESET_BUTTON_TYPES.CONTENT_EDIT);
}