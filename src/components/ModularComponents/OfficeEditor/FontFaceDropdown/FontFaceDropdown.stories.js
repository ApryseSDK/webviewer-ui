import React from 'react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import core from 'core';
import FontFaceDropdown from './FontFaceDropdown';
import { userEvent, expect } from '@storybook/test';
import { OEModularUIMockState } from 'helpers/storybookHelper';

export default {
  title: 'ModularComponents/OfficeEditor/FontFaceDropdown',
  component: FontFaceDropdown,
};

const initialState = OEModularUIMockState;

const store = configureStore({ reducer: () => initialState });

const prepareFontFaceDropdownStory = () => {
  core.getOfficeEditor = () => ({
    isTextSelected: () => false,
  });

  return (
    <Provider store={store}>
      <FontFaceDropdown/>
    </Provider>
  );
};

export function Basic() {
  return prepareFontFaceDropdownStory();
}

Basic.play = async ({ canvasElement }) => {
  // open the dropdown and check the active item is Arial from the mock state
  const dropdown = canvasElement.querySelector('.Dropdown');
  await userEvent.click(dropdown);
  const dropdownItem = canvasElement.querySelector('[data-element=dropdown-item-Arial]');
  expect(dropdownItem.classList.contains('active')).toBe(true);
};