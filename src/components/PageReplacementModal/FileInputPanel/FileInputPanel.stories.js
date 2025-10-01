import React from 'react';
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import FileInputPanel from './FileInputPanel';
import { within, expect, userEvent } from 'storybook/test';
import { getTranslatedText } from 'src/helpers/testTranslationHelper';

const noop = () => {};

export default {
  title: 'Components/FileInputPanel',
  component: FileInputPanel,
};

const initialState = {
  viewer: {
    openElements: { pageReplacementModal: true },
    disabledElements: {},
    customElementOverrides: {},
    tab: {}
  }
};

function rootReducer(state = initialState) {
  return state;
}

const store = createStore(rootReducer);

export function Basic() {
  const props = {};

  return (
    <Provider store={store}>
      <FileInputPanel {...props} />
    </Provider>
  );
}

Basic.parameters = window.storybook.disableRtlMode;

export function WithDefaultValue() {
  const props = {
    defaultValue: 'https://example.com/document.pdf',
  };

  return (
    <Provider store={store}>
      <FileInputPanel {...props} />
    </Provider>
  );
}

WithDefaultValue.parameters = window.storybook.disableRtlMode;

export function BasicWithError() {
  const props = {
    defaultValue: 'https://example.com/document.pdf',
    error: 'link.invalidUrl',
  };

  return (
    <Provider store={store}>
      <FileInputPanel {...props} />
    </Provider>
  );
}

BasicWithError.parameters = window.storybook.disableRtlMode;

export function LongInputWithError() {
  const props = {
    defaultValue: 'https://example.example.org/example/example/thumb/a/a5/example_icon.png/500px-example_icon.png',
    error: 'link.invalidUrl',
  };

  return (
    <Provider store={store}>
      <FileInputPanel {...props} />
    </Provider>
  );
}

LongInputWithError.parameters = window.storybook.disableRtlMode;

export function WithDropdown() {
  const props = {
    defaultValue: 'https://example.example.org/example/example/thumb/a/a5/example_icon.png/500px-example_icon.png',
    setExtension: noop,
    acceptFormats: ['.png', '.jpg', '.jpeg'],
  };

  return (
    <Provider store={store}>
      <FileInputPanel {...props} />
    </Provider>
  );
}

WithDropdown.parameters = window.storybook.disableRtlMode;

WithDropdown.play = async ({ canvasElement }) => {
  const canvas = within(canvasElement);
  const dropDown = canvas.getByRole('combobox', { name: getTranslatedText('OpenFile.extension') });
  expect(dropDown).toBeInTheDocument();
  await userEvent.click(dropDown);
};