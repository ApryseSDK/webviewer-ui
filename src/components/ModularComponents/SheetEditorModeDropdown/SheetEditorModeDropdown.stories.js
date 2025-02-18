import React from 'react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import SheetEditorModeDropdown from './SheetEditorModeDropdown';
import { userEvent, expect, within } from '@storybook/test';
import { OEModularUIMockState } from 'src/helpers/storybookHelper';

export default {
  title: 'SpreadsheetEditor/SheetEditorModeDropdown',
  component: SheetEditorModeDropdown,
};

const initialState = OEModularUIMockState;

const store = configureStore({ reducer: () => initialState });


export function ModeChangingDropdown() {
  return (
    <Provider store={store}>
      <div style={{ width: 145 }}>
        <SheetEditorModeDropdown />
      </div>
    </Provider>
  );
}

ModeChangingDropdown.play = async ({ canvasElement }) => {
  const canvas = within(canvasElement);
  // open the dropdown and check the active item
  const dropdown = canvas.getByRole('combobox', { name: '' });
  await userEvent.click(dropdown);
  const viewingOption = canvas.getByRole('option', { name: 'Viewing View only' });
  expect(viewingOption).toBeInTheDocument();
  expect(viewingOption.innerText).toBe('Viewing\nView only');
};