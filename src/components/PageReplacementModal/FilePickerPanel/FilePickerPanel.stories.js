import React from 'react';
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import FilePickerPanel from './FilePickerPanel';
import { expect } from 'storybook/test';

export default {
  title: 'Components/FilePickerPanel',
  component: FilePickerPanel,
};

function rootReducer() {
  return {
    viewer: {}
  };
}

const store = createStore(rootReducer);

export function Basic() {
  const props = {};

  return (
    <Provider store={store}>
      <FilePickerPanel {...props} />
    </Provider>
  );
}

Basic.parameters = window.storybook.disableRtlMode;

Basic.play = async ({ canvasElement }) => {
  const input = canvasElement.querySelector('input[type="file"]');
  expect(input).toBeInTheDocument();
  expect(input).not.toHaveAttribute('multiple');
};

export function BasicWithMultiple() {
  const props = {
    allowMultiple: true,
  };

  return (
    <Provider store={store}>
      <FilePickerPanel {...props} />
    </Provider>
  );
}

BasicWithMultiple.parameters = window.storybook.disableRtlMode;
BasicWithMultiple.play = async ({ canvasElement }) => {
  const input = canvasElement.querySelector('input[type="file"]');
  expect(input).toBeInTheDocument();
  expect(input).toHaveAttribute('multiple');
};