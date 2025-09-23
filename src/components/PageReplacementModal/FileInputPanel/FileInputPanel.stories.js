import React from 'react';
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import FileInputPanel from './FileInputPanel';

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