import React from 'react';
import ColorPickerModal from './ColorPickerModal';
import { Provider } from 'react-redux';
import initialState from 'src/redux/initialState';
import { configureStore } from '@reduxjs/toolkit';

const store = configureStore({ reducer: () => initialState });

export default {
  title: 'Components/ColorPickerModal',
  component: ColorPickerModal,
  parameters: {
    customizableUI: true
  }
};

export function Basic() {
  const color = { R: 100, G: 0, B: 0, A: 1 };

  function closeModal() {
    console.log('closeModal');
  }

  function handleChangeSave() {
    console.log('handleChangeSave');
  }

  function handleChangeCancel() {
    console.log('handleChangeCancel');
  }
  const props = {
    isOpen: true,
    color,
    closeModal,
    handleChangeSave,
    handleChangeCancel,
  };
  return (
    <Provider store={store}>
      <ColorPickerModal {...props} />
    </Provider>
  );
}
