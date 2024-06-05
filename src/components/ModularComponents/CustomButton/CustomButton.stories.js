import React from 'react';
import CustomButton from './CustomButton';
import initialState from 'src/redux/initialState';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';

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