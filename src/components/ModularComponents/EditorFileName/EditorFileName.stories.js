import React, { useEffect } from 'react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import core from 'core';
import { userEvent, expect, within } from '@storybook/test';
import EditorFileName from './EditorFileName';
import { OEModularUIMockState, string280Chars } from 'src/helpers/storybookHelper';
import { FILESAVERJS_MAX_NAME_LENTH } from 'src/constants/fileName';
export default {
  title: 'ModularComponents/EditorFileName',
  component: EditorFileName,
};

const initialState = OEModularUIMockState;

const store = configureStore({ reducer: () => initialState });

const prepareButtonStory = () => {
  const oldDoc = core.getDocument;
  core.getDocument = () => ({
    getFilename: () => 'test.docx',
  });

  useEffect(() => {
    return () => core.getDocument = oldDoc;
  });

  return (
    <Provider store={store}>
      <EditorFileName dataElement='editorFileName' />
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
