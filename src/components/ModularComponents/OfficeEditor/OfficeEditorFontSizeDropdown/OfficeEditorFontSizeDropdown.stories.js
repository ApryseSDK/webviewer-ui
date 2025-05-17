import React from 'react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { DEFAULT_POINT_SIZE } from 'src/constants/officeEditor';
import core from 'core';
import OfficeEditorFontSizeDropdown from './OfficeEditorFontSizeDropdown';
import { userEvent, expect } from '@storybook/test';
import { OEModularUIMockState } from 'helpers/storybookHelper';

export default {
  title: 'ModularComponents/OfficeEditor/FontSizeDropdown',
  component: OfficeEditorFontSizeDropdown,
};

const initialState = OEModularUIMockState;

const store = configureStore({ reducer: () => initialState });
const dropdownWidth = 100;

const prepareFontSizeDropdownStory = () => {
  core.getOfficeEditor = () => ({
    isTextSelected: () => false,
  });

  return (
    <Provider store={store}>
      <div style={{ width: dropdownWidth }}>
        <OfficeEditorFontSizeDropdown/>
      </div>
    </Provider>
  );
};

export function Basic() {
  initialState.officeEditor.cursorProperties.pointSize = DEFAULT_POINT_SIZE;
  return prepareFontSizeDropdownStory();
}

Basic.play = async ({ canvasElement }) => {
  // open the dropdown and check the active item
  const dropdown = canvasElement.querySelector('.Dropdown');
  await userEvent.click(dropdown);
  const dropdownItem = canvasElement.querySelector(`[data-element=dropdown-item-${DEFAULT_POINT_SIZE.toString()}]`);
  expect(dropdownItem.classList.contains('active')).toBe(true);
};

const customPointSize = 24;

export function CustomPointSize() {
  initialState.officeEditor.cursorProperties.pointSize = customPointSize;
  return prepareFontSizeDropdownStory();
}

CustomPointSize.play = async ({ canvasElement }) => {
  // open the dropdown and check the active item
  const dropdown = canvasElement.querySelector('.Dropdown');
  await userEvent.click(dropdown);
  const dropdownItem = canvasElement.querySelector(`[data-element=dropdown-item-${customPointSize.toString()}]`);
  expect(dropdownItem.classList.contains('active')).toBe(true);
};