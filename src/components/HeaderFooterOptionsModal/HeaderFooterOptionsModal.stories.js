import React from 'react';
import HeaderFooterOptionsModal from './HeaderFooterOptionsModal';
import { configureStore } from '@reduxjs/toolkit';
import { Provider } from 'react-redux';
import DataElements from 'constants/dataElement';
import { userEvent, within, expect, waitFor } from '@storybook/test';

export default {
  title: 'Components/HeaderFooterOptionsModal',
  component: HeaderFooterOptionsModal,
};

const initialState = {
  viewer: {
    openElements: { [DataElements.HEADER_FOOTER_OPTIONS_MODAL]: true },
    disabledElements: {},
    customElementOverrides: {},
  }
};

const store = configureStore({ reducer: () => initialState });

export function Basic() {
  return (
    <Provider store={store}>
      <HeaderFooterOptionsModal/>
    </Provider>
  );
}

Basic.play = async ({ canvasElement }) => {
  const canvas = within(canvasElement);
  const inputs = [
    canvas.getByLabelText('Header from Top'),
    canvas.getByLabelText('Footer from Bottom')
  ];

  for (const input of inputs) {
    await waitFor(() => expect(input.value).toBe('1.27'));

    // Test lower limit of input
    await userEvent.clear(input);
    await userEvent.type(input, '-9');
    expect(input.value).toBe('0');

    // Test upper limit of input. 9.31 is 1/3 of page height in CM
    await userEvent.clear(input);
    await userEvent.type(input, '999');
    expect(input.value).toBe('9.31');
  }

};
