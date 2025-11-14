import React, { useEffect } from 'react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import core from 'core';
import { userEvent, expect, within } from 'storybook/test';
import EditorFileName from './EditorFileName';
import { OEModularUIMockState, string280Chars } from 'helpers/storybookHelper';
import { FILESAVERJS_MAX_NAME_LENTH } from 'constants/fileName';
import { OfficeEditorEditMode } from 'constants/officeEditor';
import { SpreadsheetEditorEditMode } from 'constants/spreadsheetEditor';

export default {
  title: 'ModularComponents/EditorFileName',
  component: EditorFileName,
};

const initialState = OEModularUIMockState;

const store = configureStore({ reducer: () => initialState });

const prepareButtonStory = (dataElement = 'editorFileName') => {
  const oldDoc = core.getDocument;
  core.getDocument = () => ({
    getFilename: () => 'test.docx',
  });

  useEffect(() => {
    return () => core.getDocument = oldDoc;
  });

  return (
    <Provider store={store}>
      <EditorFileName dataElement={dataElement} />
    </Provider>
  );
};

export function FileNameButton() {
  return prepareButtonStory();
}

FileNameButton.play = async ({ canvasElement }) => {
  const canvas = within(canvasElement);

  // update input and check button text
  const fileNameButton = await canvas.findByRole('button', { name: /test.docx/i });
  expect(fileNameButton).toBeInTheDocument();
  await userEvent.click(fileNameButton);

  const input = await canvas.findByRole('textbox', { name: /test/i });
  expect(input).toBeInTheDocument();

  await userEvent.clear(input);
  await userEvent.type(input, 'newFileName');
  await userEvent.keyboard('{Escape}');
  const fileNameButtonAfterClick = await canvas.findByRole('button', { name: /newFileName.docx/i });
  expect(fileNameButtonAfterClick).toBeInTheDocument();

  const extension = '.xlsx';
  await userEvent.click(fileNameButtonAfterClick);
  const secondInput = await canvas.findByRole('textbox');
  await userEvent.type(secondInput, string280Chars);
  const inputCap = secondInput.value.length + extension.length;
  expect(inputCap).toBe(FILESAVERJS_MAX_NAME_LENTH);
};

FileNameButton.parameters = window.storybook.disableRtlMode;

export function OfficeEditorDisabledFileName() {
  initialState.officeEditor.editMode = OfficeEditorEditMode.VIEW_ONLY;
  return prepareButtonStory();
}

OfficeEditorDisabledFileName.parameters = window.storybook.disableRtlMode;

export function SpreadsheetEditorDisabledFileName() {
  initialState.viewer.isSpreadsheetEditorModeEnabled = true;
  initialState.spreadsheetEditor.editMode = SpreadsheetEditorEditMode.VIEW_ONLY;
  return prepareButtonStory('spreadsheetEditorFileName');
}

SpreadsheetEditorDisabledFileName.parameters = window.storybook.disableRtlMode;