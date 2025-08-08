import React from 'react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import core from 'core';
import OfficeEditorFontFamilyDropdown from './OfficeEditorFontFamilyDropdown';
import { userEvent, expect } from 'storybook/test';
import { OEModularUIMockState } from 'helpers/storybookHelper';

export default {
  title: 'ModularComponents/OfficeEditor/FontFamilyDropdown',
  component: OfficeEditorFontFamilyDropdown,
};

const initialState = OEModularUIMockState;

const store = configureStore({ reducer: () => initialState });

const dropdownWidth = 180;

const prepareFontFamilyDropdownStory = () => {
  core.getOfficeEditor = () => ({
    isTextSelected: () => false,
  });

  return (
    <Provider store={store}>
      <div style={{ width: dropdownWidth }}>
        <OfficeEditorFontFamilyDropdown/>
      </div>
    </Provider>
  );
};

export function Basic() {
  return prepareFontFamilyDropdownStory();
}

Basic.play = async ({ canvasElement }) => {
  // open the dropdown and check the active item is Arial from the mock state
  const dropdown = canvasElement.querySelector('.Dropdown');
  await userEvent.click(dropdown);
  const dropdownItem = canvasElement.querySelector('[data-element=dropdown-item-Arial]');
  expect(dropdownItem.classList.contains('active')).toBe(true);
};