import React from 'react';
import WatermarkModalComponent from './WatermarkModal';
import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { Provider, } from 'react-redux';
import viewerReducer from 'reducers/viewerReducer';
import initialState from 'src/redux/initialState';
import { expect, userEvent, within } from '@storybook/test';

export default {
  title: 'Components/WatermarkModal',
  component: WatermarkModal,
  parameters: {
    customizableUI: true
  }
};

const reducer = combineReducers({
  viewer: viewerReducer(initialState.viewer),
});

const store = configureStore({
  reducer,
});

export const WatermarkModal = () => (
  <Provider store={store}>
    <WatermarkModalComponent isVisible />
  </Provider>
);

export const WatermarkModalOpeningColorPicker = WatermarkModal.bind({});

WatermarkModalOpeningColorPicker.play = async ({ canvasElement }) => {
  const canvas = within(canvasElement);

  const colorPickerButton = canvas.getByLabelText(/colorSelectButton/i);
  await userEvent.click(colorPickerButton);

  const colorPickerColors = await canvas.findAllByRole('button', { name: /Color #/i });
  expect(colorPickerColors.length).toBe(27);
};