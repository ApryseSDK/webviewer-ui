import React from 'react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import core from 'core';
import OfficeEditorFontFamilyDropdown from './OfficeEditorFontFamilyDropdown';
import { userEvent, expect, within } from 'storybook/test';
import { OEModularUIMockState } from 'helpers/storybookHelper';
import { getTranslatedText } from 'src/helpers/testTranslationHelper';

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
  const canvas = within(canvasElement);
  const dropdown = canvas.getByRole('combobox', { name: getTranslatedText('officeEditor.fontFamily.dropdownLabel') });
  await userEvent.click(dropdown);
  const dropdownItem = canvas.getByRole('option', { name: 'Arial' });
  expect(dropdownItem.classList.contains('active')).toBe(true);
};