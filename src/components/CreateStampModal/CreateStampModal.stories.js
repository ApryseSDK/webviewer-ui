import { configureStore } from '@reduxjs/toolkit';
import React from 'react';
import CreateStampModal from './CreateStampModal';
import { Provider } from 'react-redux';
import defaultFonts from 'constants/defaultFonts';
import defaultDateTimeFormats from 'constants/defaultDateTimeFormats';
import { userEvent, expect, within } from 'storybook/test';
import { getTranslatedText } from 'src/helpers/testTranslationHelper';

export default {
  title: 'Components/CreateStampModal',
  component: CreateStampModal,
};

const initialState = {
  viewer: {
    openElements: { customStampModal: true },
    disabledElements: {},
    customElementOverrides: {},
    fonts: defaultFonts,
    dateTimeFormats: defaultDateTimeFormats
  },
  user: {
    name: 'TestName'
  },
  featureFlags: {
    customizableUI: true,
  },
};

const initialStateWithCategory = {
  ...initialState,
  viewer: {
    ...initialState.viewer,
    customStampCategories: ['Category 1', 'Category 2'],
    isMultiViewerMode: false,
  },
  featureFlags: {
    ...initialState.featureFlags,
    newStampPanel: true,
  },
};

function rootReducer(state = initialState, action) {
  return state;
}

const props = {
  isOpen: true
};

const store = configureStore({ reducer: rootReducer });
export const Basic = () => (
  <Provider store={store}>
    <CreateStampModal {...props} />
  </Provider>
);


Basic.play = async ({ canvasElement }) => {
  const canvas = within(canvasElement);
  const stampText = getTranslatedText('option.customStampModal.stampText');
  const stampTextInput = await canvas.getByRole('textbox', { name: stampText });
  await expect(stampTextInput).toBeInTheDocument();
  stampTextInput.value = null;
  await userEvent.click(stampTextInput);
  await userEvent.type(stampTextInput, '22', { delay: 100 });
  await userEvent.clear(stampTextInput);

  const errorMessage = getTranslatedText('message.emptyCustomStampInput');
  const errorMessageDiv = await canvas.getByText(errorMessage);
  expect(errorMessageDiv).toBeInTheDocument();
  expect(errorMessageDiv.innerText).not.toBeNull;
};

export const BasicWithCategory = () => {
  const x = configureStore({ reducer: () => initialStateWithCategory });
  return (
    <Provider store={x}>
      <CreateStampModal {...props} />
    </Provider>
  );
};

BasicWithCategory.play = async ({ canvasElement }) => {
  const canvas = await within(canvasElement);
  const categoryDropdown = document.querySelector('.category-dropdown');
  const combobox = categoryDropdown?.querySelector('[role="combobox"]');
  await userEvent.click(combobox);
  const categoryOption1 = await canvas.getByRole('option', { name: 'Category 1' });
  const categoryOption2 = await canvas.getByRole('option', { name: 'Category 2' });
  await expect(categoryOption1).toBeInTheDocument();
  await expect(categoryOption2).toBeInTheDocument();
  await userEvent.click(categoryOption1);
};