import React from 'react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import core from 'core';
import { expect } from '@storybook/test';
import OfficeEditorFileName from './OfficeEditorFileName';
import { OEModularUIMockState } from 'src/helpers/storybookHelper';

export default {
  title: 'ModularComponents/OfficeEditor/OfficeEditorFileName',
  component: OfficeEditorFileName,
};

const initialState = OEModularUIMockState;

const store = configureStore({ reducer: () => initialState });

const prepareButtonStory = () => {
  core.getDocument = () => ({
    getFilename: () => 'test.docx',
  });

  return (
    <Provider store={store}>
      <OfficeEditorFileName/>
    </Provider>
  );
};

export function FileNameButton() {
  return prepareButtonStory();
}

FileNameButton.play = async ({ canvasElement }) => {
  const fileNameButtonSpan = canvasElement.querySelector('[data-element="officeEditorFileName"] > span');
  expect(fileNameButtonSpan.textContent).toBe('test.docx');
};

export function FileNameInput() {
  return prepareButtonStory();
}

FileNameInput.play = async ({ canvasElement }) => {
  // click file name and check input box
  const fileNameButton = canvasElement.querySelector('[data-element="officeEditorFileName"]');
  fileNameButton.click();
  const input = canvasElement.querySelector('input');
  expect(input.value).toBe('test');
};
