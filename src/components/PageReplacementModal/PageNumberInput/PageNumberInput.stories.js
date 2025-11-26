import React from 'react';
import PageNumberInput from './PageNumberInput';
import { userEvent, expect } from 'storybook/test';
import { configureStore } from '@reduxjs/toolkit';
import { Provider } from 'react-redux';

function noop() { }

export default {
  title: 'Components/PageReplacementModal/PageNumberInput',
  component: PageNumberInput,
};
const initialState = {
  viewer: {
    isCustomPageLabelsEnabled: false,
    pageLabels: [],
  }
};

const store = configureStore({
  reducer: () => initialState,
});

const PageNumberInputTemplate = (args) => (
  <Provider store={store}>
    <PageNumberInput {...args} />
  </Provider>
);

export const Basic = PageNumberInputTemplate.bind({});
Basic.args = {
  selectedPageNumbers: [],
  onSelectedPageNumbersChange: noop,
  pageCount: 10,
};

Basic.parameters = window.storybook.disableRtlMode;

export const BasicWithError = PageNumberInputTemplate.bind({});
BasicWithError.args = {
  selectedPageNumbers: [],
  onSelectedPageNumbersChange: noop,
  pageCount: 10,
};

BasicWithError.parameters = window.storybook.disableRtlMode;

BasicWithError.play = async ()  => {
  const textInput = await document.querySelector('.page-number-input');
  expect(textInput).toBeInTheDocument();

  await userEvent.type(textInput, 'Some text', {
    delay: 100,
  });

  const pElement = await document.querySelector('.page-number-error p');
  expect(pElement).toBeInTheDocument();
  expect(pElement.getAttribute('aria-live')).not.toBeNull;
};