/* eslint-disable custom/no-hex-colors */
import React from 'react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import core from 'core';
import StylePresetDropdown from './StylePresetDropdown';
import { userEvent, expect, within } from 'storybook/test';
import { OEModularUIMockState } from 'src/helpers/storybookHelper';
import { getTranslatedText } from 'src/helpers/testTranslationHelper';

export default {
  title: 'ModularComponents/OfficeEditor/StylePresetDropdown',
  component: StylePresetDropdown,
};

const initialState = OEModularUIMockState;

const store = configureStore({ reducer: () => initialState });

const prepareDropdownStory = () => {
  core.getOfficeEditor = () => ({
    isTextSelected: () => false,
  });
  window.Core.Annotations.Color = () => ({
    toString: () => 'rgba(0, 0, 0, 1)',
    toHexString: () => '#000000',
  });

  return (
    <Provider store={store}>
      <StylePresetDropdown/>
    </Provider>
  );
};

export function NormalText() {
  initialState.officeEditor.cursorProperties = {
    ...initialState.officeEditor.cursorProperties,
    pointSize: 11,
  };
  return prepareDropdownStory();
}

NormalText.parameters = window.storybook.disableChromatic;

NormalText.play = async ({ canvasElement }) => {
  // open the dropdown and check the active item
  const canvas = within(canvasElement);
  const dropdown = canvas.getByRole('combobox', { name: getTranslatedText('officeEditor.fontStyles.dropdownLabel') });
  await userEvent.click(dropdown);
  const activeItem = canvas.getByRole('option', { name: /Normal Text/ });
  expect(activeItem.classList.contains('active')).toBe(true);
};

export function Heading1() {
  initialState.officeEditor.cursorProperties = {
    ...initialState.officeEditor.cursorProperties,
    pointSize: 20,
  };
  return prepareDropdownStory();
}

Heading1.parameters = window.storybook.disableChromatic;

Heading1.play = async ({ canvasElement }) => {
  const canvas = within(canvasElement);
  // open the dropdown and check the active item
  const dropdown = canvas.getByRole('combobox', { name: getTranslatedText('officeEditor.fontStyles.dropdownLabel') });
  await userEvent.click(dropdown);
  const activeItem = canvas.getByRole('option', { name: /Heading 1/ });
  expect(activeItem.classList.contains('active')).toBe(true);
};