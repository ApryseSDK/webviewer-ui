/* eslint-disable custom/no-hex-colors */
import React from 'react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import core from 'core';
import StylePresetDropdown from './StylePresetDropdown';
import { userEvent, expect } from '@storybook/test';
import { OEModularUIMockState } from 'src/helpers/storybookHelper';

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

NormalText.play = async ({ canvasElement }) => {
  // open the dropdown and check the active item
  const dropdown = canvasElement.querySelector('.Dropdown');
  await userEvent.click(dropdown);
  const activeItem = canvasElement.querySelector('.Dropdown__item.active');
  expect(activeItem.innerText).toBe('Normal Text');
};

export function Heading1() {
  initialState.officeEditor.cursorProperties = {
    ...initialState.officeEditor.cursorProperties,
    pointSize: 20,
  };
  return prepareDropdownStory();
}

Heading1.play = async ({ canvasElement }) => {
  // open the dropdown and check the active item
  const dropdown = canvasElement.querySelector('.Dropdown');
  await userEvent.click(dropdown);
  const activeItem = canvasElement.querySelector('.Dropdown__item.active');
  expect(activeItem.innerText).toBe('Heading 1');
};