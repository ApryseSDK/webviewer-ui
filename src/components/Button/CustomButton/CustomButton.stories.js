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