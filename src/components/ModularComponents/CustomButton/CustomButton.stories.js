import React from 'react';
import CustomButton from './CustomButton';
import initialState from 'src/redux/initialState';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { expect, within } from '@storybook/test';

export default {
  title: 'Components/CustomButton',
  component: CustomButton,
};

const store = configureStore({
  reducer: () => initialState
});

const BasicComponent = (props) => {
  return (
    <Provider store={store}>
      <CustomButton {...props} />
    </Provider>
  );
};

export const DefaultButton = BasicComponent.bind({});
DefaultButton.args = {
  dataElement: 'button-data-element',
  title: 'Button title',
  disabled: false,
  label: 'Click',
  img: 'icon-save',
  onClick: () => {
    alert('Clicked!');
  }
};

export const DefaultButtonOnHover = BasicComponent.bind({});
DefaultButtonOnHover.args = {
  dataElement: 'button-data-element',
  title: 'Button title',
  disabled: false,
  label: 'Click',
  img: 'icon-save',
  onClick: () => {
    alert('Clicked!');
  }
};

DefaultButtonOnHover.parameters = {
  pseudo: { hover: true },
};

export const ConfirmButton = BasicComponent.bind({});
ConfirmButton.args = {
  dataElement: 'button-data-element',
  title: 'Apply Fields',
  label: 'Apply Fields',
  preset: 'confirm',
  onClick: () => {
    alert('Apply Fields button clicked!');
  }
};

export const CancelButton = BasicComponent.bind({});
CancelButton.args = {
  dataElement: 'button-data-element',
  title: 'Cancel',
  label: 'Cancel',
  preset: 'cancel',
  onClick: () => {
    alert('Cancel button clicked!');
  }
};

export const CustomButtonWithStyle = BasicComponent.bind({});
CustomButtonWithStyle.args = {
  dataElement: 'button-data-element',
  title: 'Button title',
  disabled: false,
  label: 'Click',
  img: 'icon-save',
  onClick: () => {
    alert('Clicked!');
  },
  style: {
    backgroundColor: 'red',
    color: 'white',
  },
  className: 'custom-class',
};

CustomButtonWithStyle.play = async ({ canvasElement }) => {
  const canvas = within(canvasElement);
  const span = canvas.getByText('Click');
  const button = span.closest('button');
  expect(button).not.toBeNull();
  // Checking if the class was added to the button
  expect(button.classList.contains('custom-class')).toBe(true);
};