import React from 'react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { OfficeEditorEditMode } from 'src/constants/officeEditor';
import OfficeEditorModeDropdown from './OfficeEditorModeDropdown';
import { userEvent, expect, within } from 'storybook/test';
import { OEModularUIMockState } from 'src/helpers/storybookHelper';
import { getTranslatedText } from 'src/helpers/testTranslationHelper';

export default {
  title: 'ModularComponents/OfficeEditor/OfficeEditorModeDropdown',
  component: OfficeEditorModeDropdown,
};

const initialState = OEModularUIMockState;

const store = configureStore({ reducer: () => initialState });

const prepareEditModeDropdownStory = () => {
  return (
    <Provider store={store}>
      <div style={{ width: 145 }}>
        <OfficeEditorModeDropdown/>
      </div>
    </Provider>
  );
};

export function Editing() {
  initialState.officeEditor.editMode = OfficeEditorEditMode.EDITING;
  return prepareEditModeDropdownStory();
}

Editing.parameters = window.storybook.disableRtlMode;

export function Reviewing() {
  initialState.officeEditor.editMode = OfficeEditorEditMode.REVIEWING;
  return prepareEditModeDropdownStory();
}

Reviewing.parameters = window.storybook.disableRtlMode;

export function ViewingOpen() {
  initialState.officeEditor.editMode = OfficeEditorEditMode.VIEW_ONLY;
  return prepareEditModeDropdownStory();
}

ViewingOpen.play = async ({ canvasElement }) => {
  // open the dropdown and check the active item
  const canvas = within(canvasElement);
  const dropdown = canvas.getByRole('combobox');
  await userEvent.click(dropdown);
  const viewingOption = canvas.getByRole('option', { name: new RegExp(getTranslatedText('officeEditor.viewOnly')) });
  expect(viewingOption.classList.contains('active')).toBe(true);
};