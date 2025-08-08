import React from 'react';
import Label from './Label';
import { configureStore } from '@reduxjs/toolkit';
import { Provider } from 'react-redux';
import rootReducer from 'reducers/rootReducer';
import { expect, within } from 'storybook/test';

export default {
  title: 'ModularComponents/Label',
  component: Label,
};

const store = configureStore({ reducer: rootReducer });

export const LabelComponent = () => (
  <Provider store={store}>
    <Label dataElement="test" label="Test Label"/>
  </Provider>
);

export const LabelWithStyle = () => (
  <Provider store={store}>
    <Label dataElement="test" label="Test Label With Custom Style" className="label-custom-class"
      style={{ color: 'red', backgroundColor: 'green', fontSize: '50px' }}/>
  </Provider>
);
LabelWithStyle.play = async ({ canvasElement }) => {
  const canvas = within(canvasElement);
  const labelElement = canvas.getByText('Test Label With Custom Style');
  // Checking if the class was added to the label
  expect(labelElement.classList.contains('label-custom-class')).toBe(true);
};