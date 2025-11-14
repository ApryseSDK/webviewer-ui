import React from 'react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import SpreadsheetEditorEditModeDropdown from './SpreadsheetEditorEditModeDropdown';
import { userEvent, expect, within } from 'storybook/test';
import rootReducer from 'src/redux/reducers/rootReducer';
import { getTranslatedText } from 'src/helpers/testTranslationHelper';

export default {
  title: 'SpreadsheetEditor/SpreadsheetEditorEditModeDropdown',
  component: SpreadsheetEditorEditModeDropdown,
};

const store = configureStore({ reducer: rootReducer });

export function ModeChangingDropdown() {
  return (
    <Provider store={store}>
      <div style={{ width: 145 }}>
        <SpreadsheetEditorEditModeDropdown />
      </div>
    </Provider>
  );
}

ModeChangingDropdown.play = async ({ canvasElement }) => {
  const canvas = within(canvasElement);
  // open the dropdown and check the active item
  const dropdown = canvas.getByRole('combobox', { name: getTranslatedText('spreadsheetEditor.editModeDropdown') });
  await userEvent.click(dropdown);
  const viewingOption = canvas.getByRole('option', { name: new RegExp(getTranslatedText('spreadsheetEditor.viewOnly')) });
  expect(viewingOption).toBeInTheDocument();
};