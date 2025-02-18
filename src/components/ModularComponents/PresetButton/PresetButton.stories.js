import React from 'react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import initialState from 'src/redux/initialState';
import PresetButton from './PresetButton';
import { PRESET_BUTTON_TYPES } from 'src/constants/customizationVariables';
import { expect, within } from '@storybook/test';

export default {
  title: 'ModularComponents/PresetButton',
  component: PresetButton,
};

initialState.viewer.activeDocumentViewerKey = 1;
const store = configureStore({ reducer: () => initialState });

const prepareButtonStory = (buttonType, className, style) => {
  const props = {
    buttonType: buttonType,
    className: className,
    style: style,
  };

  return (
    <Provider store={store}>
      <PresetButton {...props} />
    </Provider>
  );
};

const iteractiveTest = (canvasElement, buttonLabel, buttonClass) => {
  const canvas = within(canvasElement);
  const button = canvas.getByRole('button', { name: buttonLabel });
  expect(button.classList.contains(buttonClass)).toBe(true);
};

export function UndoButton() {
  return prepareButtonStory(PRESET_BUTTON_TYPES.UNDO);
}

export function UndoButtonWithStyleAndClass() {
  return prepareButtonStory(PRESET_BUTTON_TYPES.UNDO, 'undo-button-class', { borderRadius: '15px', border: '2px solid black' });
}
UndoButtonWithStyleAndClass.play = async ({ canvasElement }) => {
  iteractiveTest(canvasElement, /Undo/i, 'undo-button-class');
};

export function RedoButton() {
  return prepareButtonStory(PRESET_BUTTON_TYPES.REDO);
}

export function RedoButtonWithStyleAndClass() {
  return prepareButtonStory(PRESET_BUTTON_TYPES.REDO, 'redo-button-class', { borderRadius: '15px', border: '2px solid black' });
}
RedoButtonWithStyleAndClass.play = async ({ canvasElement }) => {
  iteractiveTest(canvasElement, /Redo/i, 'redo-button-class');
};

export function NewDocumentButton() {
  return prepareButtonStory(PRESET_BUTTON_TYPES.NEW_DOCUMENT);
}

export function NewDocumentButtonWithStyleAndClass() {
  return prepareButtonStory(PRESET_BUTTON_TYPES.NEW_DOCUMENT, 'new-document-class', { borderRadius: '15px', border: '2px solid black' });
}
NewDocumentButtonWithStyleAndClass.play = async ({ canvasElement }) => {
  iteractiveTest(canvasElement, /New Document/i, 'new-document-class');
};

export function FilePickerButton() {
  return prepareButtonStory(PRESET_BUTTON_TYPES.FILE_PICKER);
}

export function FilePickerButtonWithStyleAndClass() {
  return prepareButtonStory(PRESET_BUTTON_TYPES.FILE_PICKER, 'file-picker-class', { borderRadius: '15px', border: '2px solid black' });
}
FilePickerButtonWithStyleAndClass.play = async ({ canvasElement }) => {
  iteractiveTest(canvasElement, /Open File/i, 'file-picker-class');
};

export function DownloadButton() {
  return prepareButtonStory(PRESET_BUTTON_TYPES.DOWNLOAD);
}

export function DownloadButtonWithStyleAndClass() {
  return prepareButtonStory(PRESET_BUTTON_TYPES.DOWNLOAD, 'download-button-class', { borderRadius: '15px', border: '2px solid black' });
}
DownloadButtonWithStyleAndClass.play = async ({ canvasElement }) => {
  iteractiveTest(canvasElement, /Download/i, 'download-button-class');
};

export function FullscreenButton() {
  return prepareButtonStory(PRESET_BUTTON_TYPES.FULLSCREEN);
}

export function FullscreenButtonWithStyleAndClass() {
  return prepareButtonStory(PRESET_BUTTON_TYPES.FULLSCREEN, 'full-screen-class', { borderRadius: '15px', border: '2px solid black' });
}
FullscreenButtonWithStyleAndClass.play = async ({ canvasElement }) => {
  iteractiveTest(canvasElement, /Enter Full Screen/i, 'full-screen-class');
};

export function SaveAsButton() {
  return prepareButtonStory(PRESET_BUTTON_TYPES.SAVE_AS);
}

export function SaveAsButtonWithStyleAndClass() {
  return prepareButtonStory(PRESET_BUTTON_TYPES.SAVE_AS, 'save-as-button-class', { borderRadius: '15px', border: '2px solid black' });
}
SaveAsButtonWithStyleAndClass.play = async ({ canvasElement }) => {
  iteractiveTest(canvasElement, /Save As/i, 'save-as-button-class');
};

export function PrintButton() {
  return prepareButtonStory(PRESET_BUTTON_TYPES.PRINT);
}

export function PrintButtonWithStyleAndClass() {
  return prepareButtonStory(PRESET_BUTTON_TYPES.PRINT, 'print-button-class', { borderRadius: '15px', border: '2px solid black' });
}
PrintButtonWithStyleAndClass.play = async ({ canvasElement }) => {
  iteractiveTest(canvasElement, /Print/i, 'print-button-class');
};

export function CreatePortfolioButton() {
  return prepareButtonStory(PRESET_BUTTON_TYPES.CREATE_PORTFOLIO);
}

export function CreatePortfolioButtonWithStyleAndClass() {
  return prepareButtonStory(PRESET_BUTTON_TYPES.CREATE_PORTFOLIO, 'portfolio-button-class', { borderRadius: '15px', border: '2px solid black' });
}
CreatePortfolioButtonWithStyleAndClass.play = async ({ canvasElement }) => {
  iteractiveTest(canvasElement, /Create PDF Portfolio/i, 'portfolio-button-class');
};

export function SettingsButton() {
  return prepareButtonStory(PRESET_BUTTON_TYPES.SETTINGS);
}

export function SettingsButtonWithStyleAndClass() {
  return prepareButtonStory(PRESET_BUTTON_TYPES.SETTINGS, 'setting-button-class', { borderRadius: '15px', border: '2px solid black' });
}
SettingsButtonWithStyleAndClass.play = async ({ canvasElement }) => {
  iteractiveTest(canvasElement, /Settings/i, 'setting-button-class');
};

export function FormFieldEditButton() {
  return prepareButtonStory(PRESET_BUTTON_TYPES.FORM_FIELD_EDIT);
}

export function FormFieldEditButtonWithStyleAndClass() {
  return prepareButtonStory(PRESET_BUTTON_TYPES.FORM_FIELD_EDIT, 'form-field-button-class', { borderRadius: '15px', border: '2px solid black' });
}
FormFieldEditButtonWithStyleAndClass.play = async ({ canvasElement }) => {
  iteractiveTest(canvasElement, /Edit Form Fields/i, 'form-field-button-class');
};

export function ContentEditButton() {
  return prepareButtonStory(PRESET_BUTTON_TYPES.CONTENT_EDIT);
}

export function ContentEditButtonWithStyleAndClass() {
  return prepareButtonStory(PRESET_BUTTON_TYPES.CONTENT_EDIT, 'content-edit-button-class', { borderRadius: '15px', border: '2px solid black' });
}
ContentEditButtonWithStyleAndClass.play = async ({ canvasElement }) => {
  iteractiveTest(canvasElement, /Edit Content/i, 'content-edit-button-class');
};

export function ToggleAccessibilityModeButton() {
  return prepareButtonStory(PRESET_BUTTON_TYPES.TOGGLE_ACCESSIBILITY_MODE);
}

export function ToggleAccessibilityModeButtonWithStyleAndClass() {
  return prepareButtonStory(PRESET_BUTTON_TYPES.TOGGLE_ACCESSIBILITY_MODE, 'accessibility-mode-class', { borderRadius: '15px', border: '2px solid black' });
}
ToggleAccessibilityModeButtonWithStyleAndClass.play = async ({ canvasElement }) => {
  iteractiveTest(canvasElement, /Accessibility Mode/i, 'accessibility-mode-class');
};