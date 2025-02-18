import React from 'react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { OfficeEditorEditMode } from 'src/constants/officeEditor';
import OfficeEditorModeDropdown from './OfficeEditorModeDropdown';
import { userEvent, expect } from '@storybook/test';
import { OEModularUIMockState } from 'src/helpers/storybookHelper';

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

export function Reviewing() {
  initialState.officeEditor.editMode = OfficeEditorEditMode.REVIEWING;
  return prepareEditModeDropdownStory();
}

export function ViewingOpen() {
  initialState.officeEditor.editMode = OfficeEditorEditMode.VIEW_ONLY;
  return prepareEditModeDropdownStory();
}

ViewingOpen.play = async ({ canvasElement }) => {
  // open the dropdown and check the active item
  const dropdown = canvasElement.querySelector('.Dropdown');
  await userEvent.click(dropdown);
  const viewingOption = canvasElement.querySelector('[data-element=dropdown-item-viewOnly]');
  expect(viewingOption.classList.contains('active')).toBe(true);
};