import React from 'react';
import OfficeEditorMarginsModal from './OfficeEditorMarginsModal';
import { configureStore } from '@reduxjs/toolkit';
import { Provider } from 'react-redux';
import DataElements from 'constants/dataElement';
import { userEvent, within, expect, waitFor } from '@storybook/test';

export default {
  title: 'Components/OfficeEditorMarginsModal',
  component: OfficeEditorMarginsModal,
};

const initialState = {
  viewer: {
    openElements: { [DataElements.OFFICE_EDITOR_MARGINS_MODAL]: true },
    disabledElements: {},
    customElementOverrides: {},
  }
};

const store = configureStore({ reducer: () => initialState });

export function Basic() {
  return (
    <Provider store={store}>
      <OfficeEditorMarginsModal/>
    </Provider>
  );
}

Basic.play = async ({ canvasElement }) => {
  const canvas = within(canvasElement);
  const inputs = [
    { element: canvas.getByLabelText('Left Margin'), max: '12.38' },
    { element: canvas.getByLabelText('Right Margin'), max: '2.54' },
    { element: canvas.getByLabelText('Top Margin'), max: '8.38' },
    { element: canvas.getByLabelText('Bottom Margin'), max: '8.38' }
  ];

  for (const inputObj of inputs) {
    const input = inputObj.element;
    await waitFor(() => expect(input.value).toBe('2.54'));

    // Test lower limit of input
    await userEvent.clear(input);
    await userEvent.type(input, '-9');
    expect(input.value).toBe('0');

    // Test upper limit of input.
    await userEvent.clear(input);
    await userEvent.type(input, '999');
    expect(input.value).toBe(inputObj.max);
  }
};