import React, { useState } from 'react';
import SpreadsheetSwitcher
  from 'components/ModularComponents/SpreadsheetEditor/SpreadsheetSwitcher/SpreadsheetSwitcher';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { within, expect, userEvent, fireEvent } from 'storybook/test';
import rootReducer from 'reducers/rootReducer';
import FlyoutContainer from 'components/ModularComponents/FlyoutContainer';
import actions from 'actions';
import WarningModal from 'components/WarningModal';
import { getTranslatedText } from 'src/helpers/testTranslationHelper';

const customViewports = {
  ViewOptionOne: {
    name: 'Custom View Port',
    styles: {
      width: '800px',
      height: '963px',
    },
  },
};

export default {
  title: 'SpreadsheetEditor/SpreadsheetSwitcher',
  component: SpreadsheetSwitcher,
  parameters: {
    viewport: {
      viewports: customViewports,
      defaultViewport: 'ViewOptionOne'
    },
    test: {
      // For some flyout errors that might happen but are unrelated
      dangerouslyIgnoreUnhandledErrors: true,
    },
  },
};

const initialState = {
  viewer: {
    disabledElements: {},
    customElementOverrides: {},
    openElements: {},
    customPanels: [],
    flyoutMap: {},
  },
  featureFlags: {
    customizableUI: true,
  },
  spreadsheetEditor: {
    editMode: 'editing',
  }
};


export const Basic = () => {
  const [activeSheetIndex, setActiveSheetIndex] = useState(6);
  return (
    <Provider store={configureStore({ reducer: () => initialState })}>
      <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
        <SpreadsheetSwitcher tabs={[
          { name: 'Sheet 1', sheetIndex: 0 },
          { name: 'Sheet 2', sheetIndex: 1 },
          { name: 'Sheet 3', sheetIndex: 2 },
          { name: 'Sheet 4', sheetIndex: 3 },
          { name: 'Sheet 5', sheetIndex: 4 },
          { name: 'Sheet 6', sheetIndex: 5 },
          { name: 'Sheet 7', sheetIndex: 6 },

        ]}
        activeSheetIndex={activeSheetIndex}
        setActiveSheet={(name, index) => {
          setActiveSheetIndex(index);
        }}
        />
      </div>
    </Provider>
  );
};

Basic.play = async ({ canvasElement }) => {
  const canvas = within(canvasElement);

  const tabButton = canvas.getByRole('tab', { name: /Sheet 1/i });
  await expect(tabButton).toBeInTheDocument();

  const sheet2 = canvas.getByRole('tab', { name: 'Sheet 2' });
  await expect(sheet2).toBeInTheDocument();
  await expect(sheet2).toHaveAttribute('aria-selected', 'false');
  await userEvent.click(sheet2);
  await expect(sheet2).toHaveAttribute('aria-selected', 'true');

  const sheet3 = canvas.getByRole('tab', { name: 'Sheet 3' });
  await expect(sheet3).toBeInTheDocument();
  await expect(sheet3).toHaveAttribute('aria-selected', 'false');
  await sheet3.click(sheet2);
  await expect(sheet3).toHaveAttribute('aria-selected', 'true');
};

export const KeyboardNavigation = Basic.bind({});
KeyboardNavigation.play = async ({ canvasElement }) => {
  const canvas = within(canvasElement);
  // Tab to the sheet switcher
  await userEvent.tab();
  const firstTab = canvas.getByRole('tab', { name: /Sheet 1/ });
  await expect(firstTab).toHaveFocus();

  await userEvent.keyboard('{ArrowRight}');
  const firstTabMoreButton = canvas.getByRole('button', { name: new RegExp(`${getTranslatedText('option.searchPanel.moreOptions')} Sheet 1`) });
  await expect(firstTabMoreButton).toHaveFocus();

  for (let i = 0; i < 7; i++) {
    await userEvent.keyboard('{ArrowRight}');
  }

  await userEvent.keyboard('{Home}');
  await expect(firstTab).toHaveFocus();

  await userEvent.keyboard('{End}');
  const addSheetButton = canvas.getByRole('button', { name: getTranslatedText('action.addSheet') });
  await expect(addSheetButton).toHaveFocus();

  // tab away from the sheet switcher
  await userEvent.tab({ shift: true });
  await expect(addSheetButton).not.toHaveFocus();

  // tab back to the sheet switcher, should focus back on the last focused element
  await userEvent.tab();
  await expect(addSheetButton).toHaveFocus();
};


const editStore = configureStore({ reducer: rootReducer });
editStore.dispatch(actions.setSpreadsheetEditorEditMode(true));
export const Edit = () => {
  const [activeSheetIndex, setActiveSheetIndex] = useState(1);
  const [tabs, setTabs] = useState([
    { name: 'Sheet 1', sheetIndex: 0 },
    { name: 'Sheet 2', sheetIndex: 1 },
  ]);
  const setActiveSheet = (name, index) => {
    setActiveSheetIndex(index);
  };
  // Mock these functions since normally they call the leadtools worker
  const deleteTab = (name) => {
    const newTabs = [...tabs].filter((tab) => tab.name !== name);
    setTabs(newTabs);
    setActiveSheetIndex(0);
  };
  const renameSheet = (oldName, newName) => {
    let newTabs = [...tabs];
    const tab = newTabs.find((tab) => tab.name === oldName);
    tab.name = newName;
    setTabs(newTabs);
  };
  const addSheet = () => {
    const newTabs = [...tabs];
    newTabs.push({ name: 'Sheet 3', sheetIndex: 2 });
    setTabs(newTabs);
  };
  const checkIsSheetNameDuplicated = (newName) => {
    return tabs.findIndex((tab) => tab.name === newName) > -1;
  };
  return (
    <Provider store={editStore}>
      <div style={{ display: 'flex', flexDirection: 'column', height: '100%', marginTop: '400px' }}>
        <SpreadsheetSwitcher tabs={tabs} activeSheetIndex={activeSheetIndex}
          setActiveSheet={setActiveSheet} deleteSheet={deleteTab} renameSheet={renameSheet}
          createNewSheet={addSheet} skipDeleteWarning checkIsSheetNameDuplicated={checkIsSheetNameDuplicated}
        />
        <WarningModal />
        <FlyoutContainer />
      </div>
    </Provider>
  );
};

Edit.play = async ({ canvasElement }) => {
  const canvas = within(canvasElement);

  // Delete Flow
  await expect(canvas.getByRole('tab', { name: /Sheet 1/i })).toBeInTheDocument();
  canvas.getByRole('button', { name: new RegExp(`${getTranslatedText('option.searchPanel.moreOptions')} Sheet 1`) }).click();
  canvas.getByRole('button', { name: getTranslatedText('action.delete') }).click();
  // Query instead of locator to assert null (can't be done with locators)
  await expect(canvas.queryByLabelText('Sheet 1')).toBeNull();

  // Rename Flow
  await expect(canvas.getByRole('tab', { name: /Sheet 2/i })).toBeInTheDocument();
  canvas.getByRole('button', { name: new RegExp(`${getTranslatedText('option.searchPanel.moreOptions')} Sheet 2`) }).click();
  canvas.getByRole('button', { name: getTranslatedText('action.rename') }).click();
  let input = canvas.getByRole('textbox');
  await userEvent.type(input, ' Test');
  fireEvent.blur(input);
  userEvent.click(document.body);
  const renamedTab = await canvas.findByRole('tab', { name: /Sheet 2 Test/i });
  await expect(renamedTab).toBeInTheDocument();

  // Add Flow
  canvas.getByRole('button', { name: getTranslatedText('action.addSheet') }).click();
  await expect(canvas.getByRole('tab', { name: /Sheet 3/i })).toBeInTheDocument();

  // Invalid rename flow
  canvas.getByRole('button', { name: new RegExp(`${getTranslatedText('option.searchPanel.moreOptions')} Sheet 2 Test`) }).click();
  canvas.getByRole('button', { name: getTranslatedText('action.rename') }).click();
  input = canvas.getByRole('textbox');
  input.value = '';
  await userEvent.type(input, 'Sheet 3');
  userEvent.click(document.body);
  await expect(input.ariaInvalid).toBe('true');
  const closeButton = await canvas.findByRole('button', { name: getTranslatedText('action.close') });
  await userEvent.click(closeButton);
  await expect(await canvas.findByRole('tab', { name: /Sheet 2 Test/i })).toBeInTheDocument();
};

Edit.parameters = window.storybook.disableRtlMode;