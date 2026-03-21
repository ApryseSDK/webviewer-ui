import React from 'react';
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import FilePickerPanel from './FilePickerPanel';
import { expect } from 'storybook/test';
import { disableRtlModeParameters } from 'helpers/storybookParams';

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

Basic.parameters = disableRtlModeParameters;

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

BasicWithMultiple.parameters = disableRtlModeParameters;
BasicWithMultiple.play = async ({ canvasElement }) => {
  const input = canvasElement.querySelector('input[type="file"]');
  expect(input).toBeInTheDocument();
  expect(input).toHaveAttribute('multiple');
};
